import {body,HttpError,json,type Env} from './types'
import {origin,requireAdmin} from './auth'
export const kinds=['project','post','service','category','page','guide','faq','settings'] as const
export type Kind=typeof kinds[number]
export type Doc={id:string;kind:Kind;slug:string;title:string;published:number;position:number;updated_at?:string;description:string;body:string;category:string;subcategory:string;cover:string;seoTitle:string;seoDescription:string;socialImage:string;featured:boolean;enabled:boolean;publicationDate:string;placement:string;media:Item[];[key:string]:any}
export type Item={url:string;alt:string;caption:string;title:string;poster:string;before:string;beforeAlt:string;beforeCaption:string;position:number}
export const paths=(d:Pick<Doc,'kind'|'slug'>)=>d.kind==='page'?(d.slug==='home'?'/':'/'+d.slug):d.kind==='faq'?'/faqs#'+d.slug:d.kind==='settings'?'/admin':({project:'/projects/',post:'/blog/',service:'/services/',category:'/portfolio/',guide:'/guides/'} as any)[d.kind]+d.slug
const singletonSlugs=['home','about','process','contact','services','portfolio','blog','guides','faqs']
export const decode=(r:any):Doc=>({...JSON.parse(r.document),id:r.id,kind:r.kind,slug:r.slug,title:r.title,published:r.published,position:r.position,updated_at:r.updated_at})
export async function records(env:Env,admin=false){const r=await env.DB.prepare(`SELECT * FROM content ${admin?'':'WHERE published=1'} ORDER BY position,CASE WHEN kind IN ('post','guide') THEN json_extract(document,'$.publicationDate') ELSE '' END DESC,title`).all();return r.results.map(decode)}
const text=(v:any,max:number,label:string)=>{if(v===undefined)return '';if(typeof v!=='string'||v.length>max||/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(v))throw new HttpError(400,`Check ${label} (maximum ${max} characters).`);return v.trim()}
export async function cms(req:Request,env:Env){
 await requireAdmin(req,env)
 if(req.method==='GET')return json({records:await records(env,true)})
 origin(req,env)
 if(req.method!=='POST')throw new HttpError(405,'Use POST.')
 const input=await body(req,1048576)
 if(input.action==='delete'){
  const d=await env.DB.prepare('SELECT kind,slug FROM content WHERE id=?').bind(text(input.id,100,'id')).first<{kind:string;slug:string}>()
  if(!d)throw new HttpError(404,'Content not found.')
  if(d.kind==='page'||d.kind==='settings')throw new HttpError(400,'Disable optional sections or edit this permanent page instead.')
  // Category IDs are stable. Removing a category clears assignments atomically.
  if(d.kind==='category')await env.DB.batch([env.DB.prepare("UPDATE content SET document=json_set(document,'$.category',''),updated_at=? WHERE json_extract(document,'$.category')=?").bind(new Date().toISOString(),input.id),env.DB.prepare('DELETE FROM content WHERE id=?').bind(input.id)])
  else await env.DB.prepare('DELETE FROM content WHERE id=?').bind(input.id).run()
  return json({success:true})
 }
 const v=input.record;if(!v||!kinds.includes(v.kind))throw new HttpError(400,'Invalid content type.')
 const d:any={kind:v.kind,id:text(v.id,100,'id')||crypto.randomUUID(),title:text(v.title,200,'title'),slug:text(v.slug,120,'slug'),published:v.published===1?1:0,position:Number(v.position||0)}
 if(!d.title||!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(d.slug)||!Number.isSafeInteger(d.position)||Math.abs(d.position)>100000)throw new HttpError(400,'Provide a title, lowercase hyphenated slug and valid display order.')
 if(d.kind==='page'&&!singletonSlugs.includes(d.slug)||d.kind==='settings'&&d.slug!=='business')throw new HttpError(400,'This page has a permanent address.')
 for(const [key,max] of Object.entries({description:10000,body:80000,category:100,subcategory:150,cover:500,coverAlt:500,coverCaption:2000,seoTitle:200,seoDescription:500,socialImage:500,publicationDate:10,placement:150,ctaLabel:100,ctaUrl:500,name:200,email:254,phone:40,whatsapp:20,address:500,hours:1000,footer:2000,instagram:500,facebook:500,logo:500,profile:500,profileAlt:500,ctaHeading:200,ctaEyebrow:100,ctaText:2000,featuredHeading:200,featuredEyebrow:100,servicesHeading:200,servicesEyebrow:100}))d[key]=text(v[key],max,key)
 d.enabled=v.enabled!==false;d.featured=v.featured===true;d.ctaEnabled=v.ctaEnabled!==false;d.servicesEnabled=v.servicesEnabled!==false
 if(d.publicationDate&&(!/^\d{4}-\d{2}-\d{2}$/.test(d.publicationDate)||Number.isNaN(Date.parse(d.publicationDate))||new Date(d.publicationDate).toISOString().slice(0,10)!==d.publicationDate))throw new HttpError(400,'Use a valid publication date.')
 if(d.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)||d.whatsapp&&!/^\d{10,15}$/.test(d.whatsapp))throw new HttpError(400,'Check the email and international WhatsApp number (digits only).')
 for(const k of ['instagram','facebook'])if(d[k]&&!/^https:\/\/[a-z0-9.-]+\//i.test(d[k]))throw new HttpError(400,'Social links must start with https:// and include a path.')
 if(d.ctaUrl&&!/^\/(?!\/)[a-zA-Z0-9/?=&%-]*$/.test(d.ctaUrl))throw new HttpError(400,'CTA must be a local page path.')
 if(d.category&&!await env.DB.prepare("SELECT id FROM content WHERE kind='category' AND id=?").bind(d.category).first())throw new HttpError(400,'Select an existing category.')
 if(v.media!==undefined&&!Array.isArray(v.media)||v.media?.length>100)throw new HttpError(400,'Use at most 100 media entries per item.')
 const candidates=[...['cover','socialImage','logo','profile'].map(k=>d[k]),...(v.media||[]).flatMap((m:any)=>[m?.url,m?.poster,m?.before]),...Array.from(d.body.matchAll(/!\[[^\]]*\]\(([^)\s]+)\)/g),(m:any)=>m[1])]
 const keys=[...new Set(candidates.filter((value:any):value is string=>typeof value==='string'&&value.startsWith('/media/')).map((value:string)=>value.slice(7)))]
 // One read and one reference write keep large galleries within D1 invocation/parameter limits.
 const uploaded=keys.length?(await env.DB.prepare('SELECT object_key,content_type FROM media WHERE object_key IN (SELECT value FROM json_each(?))').bind(JSON.stringify(keys)).all<{object_key:string;content_type:string}>()).results:[]
 const knownMedia=new Map(uploaded.map(m=>[m.object_key,m]))
 const references=new Set<string>()
 async function media(value:string,kind='image'){
  if(!value)return
  if(!/^\/media\/uploads\/[a-f0-9-]+\.[a-z0-9]+$/.test(value))throw new HttpError(400,'Choose an uploaded media file.')
  const key=value.slice(7);const m=knownMedia.get(key)
  if(!m||kind!=='any'&&!m.content_type.startsWith(kind+'/'))throw new HttpError(400,'Media is missing or has the wrong type.')
  references.add(key)
 }
 for(const k of ['cover','socialImage','logo','profile'])await media(d[k])

 d.media=[]
 for(const item of v.media||[]){if(!item||typeof item!=='object'||Array.isArray(item))throw new HttpError(400,'Invalid gallery entry.');const m:any={};for(const [k,max] of Object.entries({url:500,alt:500,caption:2000,title:200,poster:500,before:500,beforeAlt:500,beforeCaption:2000}))m[k]=text(item[k],max,k);m.position=Number(item.position||0);if(!Number.isSafeInteger(m.position))throw new HttpError(400,'Check media order.');await media(m.url,'any');await media(m.poster);await media(m.before);if(!m.url)throw new HttpError(400,'Select media for each gallery entry.');d.media.push(m)}
 d.media.sort((a:Item,b:Item)=>a.position-b.position)
 // Inline image references use a deliberately narrow Markdown syntax, never raw HTML.
 for(const m of d.body.matchAll(/!\[[^\]]*\]\(([^)\s]+)\)/g))await media(m[1])
 const old=await env.DB.prepare('SELECT * FROM content WHERE id=?').bind(d.id).first<any>()
 if(old&&(old.kind!==d.kind||['page','settings'].includes(d.kind)&&old.slug!==d.slug))throw new HttpError(400,'Content type and permanent page addresses cannot change.')
 const route=paths(d)
 const occupied=await env.DB.prepare('SELECT content_id FROM redirects WHERE path=? AND content_id<>?').bind(route,d.id).first()
 if(occupied)throw new HttpError(409,'This address is reserved by a previous item. Use another slug.')
 try{await env.DB.batch([
  env.DB.prepare('INSERT INTO content(id,kind,slug,title,published,position,document,updated_at) VALUES(?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET slug=excluded.slug,title=excluded.title,published=excluded.published,position=excluded.position,document=excluded.document,updated_at=excluded.updated_at').bind(d.id,d.kind,d.slug,d.title,d.published,d.position,JSON.stringify(d),new Date().toISOString()),
  env.DB.prepare('DELETE FROM media_refs WHERE content_id=?').bind(d.id),
  ...(references.size?[env.DB.prepare('INSERT INTO media_refs(content_id,object_key) SELECT ?,value FROM json_each(?)').bind(d.id,JSON.stringify([...references]))]:[]),
  ...(old&&old.slug!==d.slug&&['project','post','guide','service','category'].includes(d.kind)?[env.DB.prepare('INSERT INTO redirects(path,content_id) VALUES(?,?) ON CONFLICT(path) DO UPDATE SET content_id=excluded.content_id').bind(paths(old),d.id),env.DB.prepare("UPDATE content SET document=json_set(document,'$.placement',?),updated_at=? WHERE kind='faq' AND json_extract(document,'$.placement')=?").bind(paths(d),new Date().toISOString(),paths(old))]:[])
 ])}catch(e){if(String(e).includes('UNIQUE'))throw new HttpError(409,'That slug is already in use.');throw e}
 return json({record:d})
}
