import { fileTypeFromBuffer } from 'file-type'
import { imageSize } from 'image-size'
import { type Env,HttpError,bounded,json,digest,body,now } from './types'
import { origin,requireAdmin } from './auth'
const MAX=12*1024*1024
const filename=(value:unknown)=>typeof value==='string'?value.split(/[\\/]/).pop()!.replace(/[\x00-\x1f\x7f]/g,'').slice(0,200):''
const allowed=['image/jpeg','image/png','image/webp','video/mp4','video/webm']
export async function upload(req:Request,env:Env){
 origin(req,env);await requireAdmin(req,env)
 let originalName='';try{originalName=filename(decodeURIComponent(req.headers.get('X-File-Name')||''))}catch{throw new HttpError(400,'Invalid filename.')}
 const bytes=await bounded(req,MAX);let type
 try{type=await fileTypeFromBuffer(bytes)}catch{throw new HttpError(415,'Invalid media file.')}
 if(!type||!allowed.includes(type.mime))throw new HttpError(415,'Use JPEG, PNG, WebP, MP4 or WebM media.')
 if(type.mime.startsWith('image/')){
  if(bytes.length>12*1024*1024)throw new HttpError(413,'Images must be at most 12 MiB.')
  try{const d=imageSize(bytes);if(!d.width||!d.height||d.width*d.height>40000000)throw new Error()}catch{throw new HttpError(415,'Invalid image or more than 40 megapixels.')}
 }
 // Signature/container checks are not transcoding. Use ordinary H.264/AAC MP4 or VP8/VP9 WebM.
 const key=`uploads/${crypto.randomUUID()}.${type.ext}`;const checksum=await digest(bytes)
 await requireAdmin(req,env) // Session may expire while request body arrives.
 await env.MEDIA.put(key,bytes,{httpMetadata:{contentType:type.mime},customMetadata:{sha256:checksum},storageClass:'Standard'})
 // R2 first: if D1 fails, the unreferenced object stays private. Never delete existing media.
 await env.DB.prepare('INSERT INTO media(object_key,content_type,size,sha256,created_at,filename) VALUES(?,?,?,?,?,?)').bind(key,type.mime,bytes.length,checksum,new Date().toISOString(),originalName).run()
 return json({url:'/media/'+key,size:bytes.length,contentType:type.mime})
}
export async function serveMedia(req:Request,env:Env,key:string){
 if(!/^(uploads|imported)\/[a-zA-Z0-9.-]+$/.test(key))throw new HttpError(404,'Media not found.')
 const path='/media/'+key
 // Visibility derives from current published references, never object existence alone.
 const visible=await env.DB.prepare("SELECT 1 FROM media_refs r JOIN content c ON c.id=r.content_id WHERE r.object_key=? AND c.published=1 AND (c.kind='page' OR COALESCE(json_extract(c.document,'$.enabled'),1)=1) LIMIT 1").bind(key).first()
 if(!visible){try{await requireAdmin(req,env)}catch{throw new HttpError(404,'Media not found.')}}
 const registered=await env.DB.prepare('SELECT content_type,size FROM media WHERE object_key=?').bind(key).first<{content_type:string;size:number}>()
 const metadata=await env.MEDIA.head(key);if(!registered||!metadata||registered.size!==metadata.size)throw new HttpError(404,'Media not found.')
 const headers=new Headers({'Content-Type':registered.content_type,'X-Content-Type-Options':'nosniff','Accept-Ranges':'bytes','ETag':metadata.httpEtag,'Cache-Control':visible?'no-store':'private, no-store','Content-Disposition':'inline'})
 if(req.headers.get('if-none-match')===metadata.httpEtag)return new Response(null,{status:304,headers})
 let range:{offset:number;length:number}|undefined
 const raw=req.headers.get('range')
 if(raw&&(!req.headers.get('if-range')||req.headers.get('if-range')===metadata.httpEtag)){
  const m=/^bytes=(\d*)-(\d*)$/.exec(raw)
  if(!m||!m[1]&&!m[2])return new Response(null,{status:416,headers:{'Content-Range':`bytes */${metadata.size}`}})
  const start=m[1]?Number(m[1]):Math.max(0,metadata.size-Number(m[2]));const end=m[1]?(m[2]?Math.min(Number(m[2]),metadata.size-1):metadata.size-1):metadata.size-1
  if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start>end||start>=metadata.size)return new Response(null,{status:416,headers:{'Content-Range':`bytes */${metadata.size}`}})
  range={offset:start,length:end-start+1};headers.set('Content-Range',`bytes ${start}-${end}/${metadata.size}`)
 }
 headers.set('Content-Length',String(range?.length??metadata.size))
 if(req.method==='HEAD')return new Response(null,{status:range?206:200,headers})
 const object=await env.MEDIA.get(key,range?{range}:undefined);if(!object)throw new HttpError(404,'Media not found.')
 return new Response(object.body,{status:range?206:200,headers})
}

export async function mediaAdmin(req:Request,env:Env){
 await requireAdmin(req,env)
 if(req.method==='GET')return json({media:(await env.DB.prepare('SELECT m.*, (SELECT count(*) FROM media_refs WHERE object_key=m.object_key) AS references_count FROM media m ORDER BY created_at DESC LIMIT 1000').all()).results})
 origin(req,env);const v=await body(req)
 if(v.action!=='delete'||typeof v.key!=='string'||!/^uploads\/[a-f0-9-]+\.[a-z0-9]+$/.test(v.key))throw new HttpError(400,'Invalid action.')
 // D1 foreign key serializes deletion against concurrent content saves. R2 deletion comes last.
 try{const deleted=await env.DB.prepare('DELETE FROM media WHERE object_key=? RETURNING object_key').bind(v.key).first();if(!deleted)throw new HttpError(404,'Registered media not found.')}catch(e){if(/FOREIGN KEY/i.test(String(e)))throw new HttpError(409,'This file is still used by content, including drafts. Remove those references first.');throw e}
 await env.MEDIA.delete(v.key)
 return json({success:true})
}
const PART=8*1024*1024,VIDEO_MAX=2*1024*1024*1024
export async function multipart(req:Request,env:Env,path:string){
 origin(req,env);await requireAdmin(req,env)
 if(req.method!=='POST')throw new HttpError(405,'Use POST.')
 const url=new URL(req.url)
 if(path.endsWith('/start')){
  const v=await body(req);if(!['video/mp4','video/webm'].includes(v.type)||!Number.isSafeInteger(v.size)||v.size<1||v.size>VIDEO_MAX)throw new HttpError(400,'Use MP4 or WebM up to 2 GiB.')
  await env.DB.batch([env.DB.prepare('DELETE FROM upload_receipts WHERE created_at<?').bind(now()-86400),env.DB.prepare('DELETE FROM uploads WHERE created_at<?').bind(now()-86400)])
  const id=crypto.randomUUID(),key='uploads/'+crypto.randomUUID()+(v.type==='video/mp4'?'.mp4':'.webm')
  const upload=await env.MEDIA.createMultipartUpload(key,{httpMetadata:{contentType:v.type},storageClass:'Standard'})
  try{await env.DB.prepare('INSERT INTO uploads(id,object_key,upload_id,content_type,size,created_at,filename) VALUES(?,?,?,?,?,?,?)').bind(id,key,upload.uploadId,v.type,v.size,now(),filename(v.name)).run()}catch(e){await upload.abort();throw e}
  return json({id,partSize:PART})
 }
 const id=url.searchParams.get('id')||''
 const receipt=await env.DB.prepare('SELECT object_key,size,content_type FROM upload_receipts WHERE id=? AND created_at>?').bind(id,now()-86400).first<{object_key:string;size:number;content_type:string}>()
 if(receipt){if(path.endsWith('/complete'))return json({url:'/media/'+receipt.object_key,size:receipt.size,contentType:receipt.content_type});if(path.endsWith('/abort'))return json({success:true});throw new HttpError(409,'Upload already completed. Retry completion to recover it.')}
 const u=await env.DB.prepare('SELECT * FROM uploads WHERE id=?').bind(id).first<{id:string;object_key:string;upload_id:string;content_type:string;size:number;created_at:number;filename:string}>()
 if(!u)throw new HttpError(404,'Upload not found. Start again.')
 const upload=env.MEDIA.resumeMultipartUpload(u.object_key,u.upload_id)
 if(path.endsWith('/abort')){try{await upload.abort()}catch(e){if(!await env.MEDIA.head(u.object_key))throw e};await env.DB.prepare('DELETE FROM uploads WHERE id=?').bind(id).run();return json({success:true})}
 if(now()-u.created_at>86400)throw new HttpError(410,'Upload expired. Remove it and start again.')
 if(path.endsWith('/part')){
  const part=Number(url.searchParams.get('part'));const count=Math.ceil(u.size/PART)
  if(!Number.isInteger(part)||part<1||part>count)throw new HttpError(400,'Invalid part.')
  const size=part===count?u.size-(part-1)*PART:PART
  const bytes=await bounded(req,PART)
  if(bytes.length!==size)throw new HttpError(400,'Incomplete chunk. Retry this file.')
  if(part===1){let type;try{type=await fileTypeFromBuffer(bytes)}catch{}if(type?.mime!==u.content_type)throw new HttpError(415,'Video container does not match its declared type.')}
  await requireAdmin(req,env)
  const result=await upload.uploadPart(part,bytes)
  await env.DB.prepare('INSERT INTO upload_parts VALUES(?,?,?,?) ON CONFLICT(upload_id,part) DO UPDATE SET size=excluded.size,etag=excluded.etag').bind(id,part,size,result.etag).run()
  return json({part,etag:result.etag})
 }
 if(path.endsWith('/complete')){
  const parts=(await env.DB.prepare('SELECT part,size,etag FROM upload_parts WHERE upload_id=? ORDER BY part').bind(id).all<{part:number;size:number;etag:string}>()).results
  if(parts.length!==Math.ceil(u.size/PART)||parts.reduce((n,p)=>n+p.size,0)!==u.size||parts.some((p,i)=>p.part!==i+1))throw new HttpError(400,'Some chunks are missing. Retry this file.')
  // Completion can be retried if the object succeeded but D1 registration failed.
  let object=await env.MEDIA.head(u.object_key)
  if(!object){await upload.complete(parts.map(p=>({partNumber:p.part,etag:p.etag})));object=await env.MEDIA.head(u.object_key)}
  if(!object||object.size!==u.size||object.httpMetadata?.contentType!==u.content_type)throw new HttpError(409,'Uploaded size or type did not match.')
  await env.DB.batch([env.DB.prepare('INSERT INTO media(object_key,content_type,size,sha256,created_at,filename) VALUES(?,?,?,?,?,?) ON CONFLICT(object_key) DO NOTHING').bind(u.object_key,u.content_type,u.size,'',new Date().toISOString(),u.filename),env.DB.prepare('INSERT INTO upload_receipts VALUES(?,?,?,?,?) ON CONFLICT(id) DO NOTHING').bind(id,u.object_key,u.size,u.content_type,now()),env.DB.prepare('DELETE FROM uploads WHERE id=?').bind(id)])
  return json({url:'/media/'+u.object_key,size:u.size,contentType:u.content_type})
 }
 throw new HttpError(404,'Upload endpoint not found.')
}
