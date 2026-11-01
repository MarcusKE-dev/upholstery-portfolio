import { generateRegistrationOptions,verifyRegistrationResponse,generateAuthenticationOptions,verifyAuthenticationResponse } from '@simplewebauthn/server'
import { type Env,HttpError,json,body,now,digest,randomToken } from './types'
const SESSION='__Host-portfolio_session',CHALLENGE='__Host-portfolio_challenge'
export const cookie=(name:string,value:string,seconds:number)=>`${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${seconds}`
const readCookie=(req:Request,name:string)=>req.headers.get('cookie')?.split(';').map(c=>c.trim()).find(c=>c.startsWith(name+'='))?.slice(name.length+1)||''
export function origin(req:Request,env:Env){
 const configured=env.ADMIN_ORIGIN
 if(!configured||new URL(req.url).origin!==configured||req.headers.get('origin')!==configured||req.headers.get('sec-fetch-site')==='cross-site')throw new HttpError(403,'Invalid request origin.')
 return configured
}
export async function requireAdmin(req:Request,env:Env){
 if(new URL(req.url).origin!==env.ADMIN_ORIGIN)throw new HttpError(403,'Administration is disabled on this hostname.')
 const token=readCookie(req,SESSION)
 if(!/^[a-f0-9]{64}$/.test(token))throw new HttpError(401,'Sign in again.')
 const session=await env.DB.prepare('SELECT expires_at FROM sessions WHERE token_hash=? AND expires_at>?').bind(await digest(token),now()).first()
 if(!session)throw new HttpError(401,'Session expired. Sign in again.')
}
export async function throttle(req:Request,env:Env,scope:string,limit:number,window=900){
 const t=now();const ip=req.headers.get('CF-Connecting-IP')||'local'
 // Atomic upsert and both per-IP and global caps; no untrusted forwarded-IP header.
 for(const key of [scope+':global',scope+':'+await digest(ip)]){
  const row=await env.DB.prepare('INSERT INTO rate_limits(key,hits,reset_at) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET hits=CASE WHEN reset_at<=? THEN 1 ELSE hits+1 END,reset_at=CASE WHEN reset_at<=? THEN excluded.reset_at ELSE reset_at END RETURNING hits').bind(key,t+window,t,t).first<{hits:number}>()
  if(!row||row.hits>(key.endsWith(':global')?limit*5:limit))throw new HttpError(429,'Too many requests. Please try later.')
 }
 // Bound retained IP keys; executed without background jobs.
 await env.DB.prepare('DELETE FROM rate_limits WHERE reset_at<?').bind(t).run()
}
export async function auth(req:Request,env:Env,path:string){
 if(req.method==='GET'&&path==='/api/admin/auth'){await requireAdmin(req,env);return json({admin:true})}
 if(req.method==='DELETE'&&path==='/api/admin/auth'){
  origin(req,env)
  // One administrator: logout invalidates all sessions, including copied cookies.
  try{await requireAdmin(req,env);await env.DB.prepare('DELETE FROM sessions').run()}catch(e){if(!(e instanceof HttpError)||e.status!==401)throw e}
  return json({admin:false},200,{'Set-Cookie':cookie(SESSION,'',0)})
 }
 if(req.method!=='POST')throw new HttpError(405,'Method not allowed.')
 const expectedOrigin=origin(req,env);const rpID=new URL(expectedOrigin).hostname
 await throttle(req,env,'auth',10)
 const input=await body(req,16000)
 const admin=await env.DB.prepare('SELECT * FROM administrator WHERE singleton=1').first<{credential_id:string;public_key:string;counter:number;transports:string}>()
 if(path.endsWith('/options')){
  const backup=input.backup===true;const register=input.register===true||backup
  if(backup){await requireAdmin(req,env);const count=await env.DB.prepare('SELECT count(*) AS n FROM backup_credentials').first<{n:number}>();if((count?.n||0)>=10)throw new HttpError(400,'Maximum backup passkeys reached. Use private account recovery to reset credentials if needed.')}else if(register){
   if(admin||!env.ADMIN_ENROLLMENT_TOKEN||!/^[a-f0-9]{64}$/.test(env.ADMIN_ENROLLMENT_TOKEN)||typeof input.setupToken!=='string'||await digest(input.setupToken)!==await digest(env.ADMIN_ENROLLMENT_TOKEN))throw new HttpError(403,'Enrollment unavailable.')
  }else if(!admin)throw new HttpError(403,'Administrator enrollment is required.')
  const options=register?await generateRegistrationOptions({rpName:"Charles' Interiors",rpID,userName:'owner',userID:new TextEncoder().encode('portfolio-owner') as Uint8Array<ArrayBuffer>,attestationType:'none',excludeCredentials:admin?[{id:admin.credential_id,transports:JSON.parse(admin.transports)},...(await env.DB.prepare('SELECT credential_id,transports FROM backup_credentials').all<{credential_id:string;transports:string}>()).results.map(c=>({id:c.credential_id,transports:JSON.parse(c.transports)}))]:[],authenticatorSelection:{residentKey:'required',userVerification:'required'}}):await generateAuthenticationOptions({rpID,allowCredentials:[{id:admin!.credential_id,transports:JSON.parse(admin!.transports)},...(await env.DB.prepare('SELECT credential_id,transports FROM backup_credentials').all<{credential_id:string;transports:string}>()).results.map(c=>({id:c.credential_id,transports:JSON.parse(c.transports)}))],userVerification:'required'})
  const token=randomToken()
  await env.DB.batch([env.DB.prepare('DELETE FROM challenges WHERE expires_at<=?').bind(now()),env.DB.prepare('INSERT INTO challenges VALUES(?,?,?,?)').bind(await digest(token),options.challenge,backup?'backup':register?'register':'login',now()+300)])
  return json(options,200,{'Set-Cookie':cookie(CHALLENGE,token,300)})
 }
 if(!path.endsWith('/verify'))throw new HttpError(404,'Not found.')
 const challenge=await env.DB.prepare('DELETE FROM challenges WHERE token_hash=? AND expires_at>? RETURNING challenge,purpose').bind(await digest(readCookie(req,CHALLENGE)),now()).first<{challenge:string;purpose:string}>()
 if(!challenge)throw new HttpError(401,'Challenge expired. Try again.')
 try {
  if(challenge.purpose==='register'||challenge.purpose==='backup'){
   if(challenge.purpose==='backup')await requireAdmin(req,env)
   if(challenge.purpose==='register'&&admin)throw new Error('Already enrolled')
   const result=await verifyRegistrationResponse({response:input.response,expectedChallenge:challenge.challenge,expectedOrigin,expectedRPID:rpID,requireUserVerification:true})
   if(!result.verified||!result.registrationInfo)throw new Error('Invalid passkey')
   const c=result.registrationInfo.credential
   if(challenge.purpose==='backup'){await env.DB.prepare('INSERT INTO backup_credentials VALUES(?,?,?,?,?)').bind(c.id,btoa(String.fromCharCode(...c.publicKey)),c.counter,JSON.stringify(c.transports||[]),now()).run()}else await env.DB.prepare('INSERT INTO administrator VALUES(1,?,?,?,?,?)').bind(c.id,btoa(String.fromCharCode(...c.publicKey)),c.counter,JSON.stringify(c.transports||[]),now()).run()
  }else{
   if(!admin)throw new Error('Not enrolled')
   const selected=input.response?.id===admin.credential_id?admin:await env.DB.prepare('SELECT * FROM backup_credentials WHERE credential_id=?').bind(String(input.response?.id||'')).first<typeof admin>();if(!selected)throw new Error('Unknown passkey')
   const result=await verifyAuthenticationResponse({response:input.response,expectedChallenge:challenge.challenge,expectedOrigin,expectedRPID:rpID,requireUserVerification:true,credential:{id:selected.credential_id,publicKey:Uint8Array.from(atob(selected.public_key),c=>c.charCodeAt(0)) as Uint8Array<ArrayBuffer>,counter:selected.counter,transports:JSON.parse(selected.transports)}})
   if(!result.verified)throw new Error('Invalid passkey')
   const updated=await env.DB.prepare(selected.credential_id===admin.credential_id?'UPDATE administrator SET counter=? WHERE credential_id=? AND counter=?':'UPDATE backup_credentials SET counter=? WHERE credential_id=? AND counter=?').bind(result.authenticationInfo.newCounter,selected.credential_id,selected.counter).run()
   if(updated.meta.changes!==1)throw new Error('Concurrent sign in; retry')
  }
 }catch{throw new HttpError(401,'Passkey verification failed.')}
 const token=randomToken()
 await env.DB.batch([env.DB.prepare('DELETE FROM sessions WHERE expires_at<=?').bind(now()),env.DB.prepare('INSERT INTO sessions VALUES(?,?)').bind(await digest(token),now()+3600)])
 return json({admin:true},200,{'Set-Cookie':cookie(SESSION,token,3600)})
}
