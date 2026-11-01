import {type Env,HttpError,json} from './types'
import {auth,requireAdmin} from './auth'
import {upload,serveMedia,multipart,mediaAdmin} from './media'
import {inquiry} from './inquiry'
import {cms,records,paths,type Doc} from './cms'
import {escape,render} from './render'
const standard=['/','/portfolio','/blog','/guides','/services','/about','/contact','/process','/faqs']
async function main(req:Request,env:Env){
 const url=new URL(req.url),path=url.pathname
 // A production-bound preview must fail before accessing D1/R2, even for reads.
 if(!env.SITE_URL||url.origin!==env.SITE_URL)return new Response('This deployment is not configured for this hostname.',{status:403,headers:{'X-Robots-Tag':'noindex'}})
 env.ADMIN_ORIGIN=env.SITE_URL
 if(path.startsWith('/api/admin/auth'))return auth(req,env,path)
 if(path==='/api/admin/content')return cms(req,env)
 if(path==='/api/admin/upload'&&req.method==='POST')return upload(req,env)
 if(path.startsWith('/api/admin/video/'))return multipart(req,env,path)
 if(path==='/api/admin/media')return mediaAdmin(req,env)
 if(path==='/api/inquiry'&&req.method==='POST')return inquiry(req,env)
 if(!['GET','HEAD'].includes(req.method))throw new HttpError(405,'Method not allowed.')
 if(path.startsWith('/media/'))return serveMedia(req,env,path.slice(7))
 if(path.startsWith('/api/')){
  if(path==='/api/content')return json({records:(await records(env)).filter(d=>d.kind==='page'||d.enabled!==false)})
  throw new HttpError(404,'API not found.')
 }
 if(path==='/admin'||path==='/admin.html'){
  const r=await env.ASSETS.fetch(new Request(new URL('/admin',url)))
  return new Response(r.body,{status:r.status,headers:{...Object.fromEntries(r.headers),'Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow'}})
 }
 if(path.endsWith('/')&&path!=='/'||path.endsWith('.html')||path==='/all-photos'){
  let to=path==='/all-photos'?'/portfolio':path==='/index.html'?'/':path.replace(/\.html$/,'').replace(/\/$/,'')
  if(to===path)throw new HttpError(404,'Page not found.')
  return Response.redirect(url.origin+to+url.search,308)
 }
 const indexed=env.INDEXABLE==='true'
 if(path==='/robots.txt')return new Response(indexed?`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nDisallow: /media/\nDisallow: /preview/\nSitemap: ${url.origin}/sitemap.xml\n`:'User-agent: *\nDisallow: /\n',{headers:{'Content-Type':'text/plain'}})
 const docs=(await records(env)).filter(d=>d.kind==='page'||d.enabled!==false)
 if(path==='/sitemap.xml'){
  const urls=[...new Set([...standard,...docs.filter(d=>['project','post','guide','service','category'].includes(d.kind)).map(paths)])]
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${indexed?urls.map(p=>`<url><loc>${escape(url.origin+p)}</loc></url>`).join(''):''}</urlset>`,{headers:{'Content-Type':'application/xml'}})
 }
 let target:Doc|undefined,preview=path.startsWith('/preview/')
 if(preview){await requireAdmin(req,env);const row=await env.DB.prepare('SELECT * FROM content WHERE id=?').bind(path.slice(9)).first<any>();if(!row)throw new HttpError(404,'Preview not found.');const {decode}=await import('./cms');target=decode(row)}
 else if(!standard.includes(path)){
  target=docs.find(d=>['project','post','guide','service','category'].includes(d.kind)&&paths(d)===path)
  if(!target){const redirect=await env.DB.prepare('SELECT content_id FROM redirects WHERE path=?').bind(path).first<{content_id:string}>();const current=docs.find(d=>d.id===redirect?.content_id);if(current)return Response.redirect(url.origin+paths(current),301);throw new HttpError(404,'Page not found.')}
 }
 const actual=preview&&target?paths(target):path
 const result=render(actual,docs,target,preview)
 const canonical=url.origin+actual
 const schema:any[]=[{'@context':'https://schema.org','@type':'Organization',name:result.name,url:url.origin}]
 if(target?.kind==='post')schema.push({'@context':'https://schema.org','@type':'BlogPosting',headline:target.title,description:target.description,datePublished:target.publicationDate||undefined,dateModified:target.updated_at,image:result.image?url.origin+result.image:undefined,mainEntityOfPage:canonical})
 if(result.faqs.length)schema.push({'@context':'https://schema.org','@type':'FAQPage',mainEntity:result.faqs.map(d=>({'@type':'Question',name:d.title,acceptedAnswer:{'@type':'Answer',text:d.body||d.description}}))})
 const nonce=crypto.randomUUID()
 const head=`<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(result.title)} | ${escape(result.name)}</title><meta name="description" content="${escape(result.description)}"><meta name="robots" content="${indexed&&!preview?'index, follow':'noindex, nofollow'}"><link rel="canonical" href="${escape(canonical)}"><meta property="og:title" content="${escape(result.title)}"><meta property="og:description" content="${escape(result.description)}"><meta property="og:url" content="${escape(canonical)}"><meta property="og:type" content="${target?.kind==='post'?'article':'website'}">${result.image?`<meta property="og:image" content="${escape(url.origin+result.image)}">`:''}<meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/icon.svg"><link rel="stylesheet" href="/site.css"><script type="application/ld+json" nonce="${nonce}">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script>`
 // Use canonical asset paths: Pages can redirect requests ending in .html.
 const shell=await env.ASSETS.fetch(new Request(new URL('/',url)))
 if(shell.status!==200)throw new HttpError(503,'Page template unavailable.')
 const r=new HTMLRewriter().on('head',{element(e){e.setInnerContent(head,{html:true})}}).on('body',{element(e){e.setInnerContent(result.html,{html:true})}}).transform(shell)
 return new Response(r.body,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','Content-Security-Policy':`default-src 'self'; script-src 'self' 'nonce-${nonce}'; style-src 'self'; img-src 'self' data:; media-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'`,...(!indexed||preview?{'X-Robots-Tag':'noindex, nofollow'}:{})}})
}
export default {async fetch(req:Request,env:Env):Promise<Response>{
 let response:Response
 try{response=await main(req,env)}catch(e){
  const status=e instanceof HttpError?e.status:503,message=e instanceof HttpError?e.message:'Service temporarily unavailable. Please try again.'
  response=new URL(req.url).pathname.startsWith('/api/')?json({error:message},status):new Response(`<!doctype html><html lang="en"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${status} — Charles’ Interiors</title><link rel="stylesheet" href="/site.css"><main class="section narrow"><h1>${status===404?'Page not found':escape(message)}</h1><p>${status===404?'This page is unavailable. It may have moved or is no longer published.':''}</p><a class="button" href="/">Return home</a></main></html>`,{status,headers:{'Content-Type':'text/html; charset=utf-8','X-Robots-Tag':'noindex'}})
 }
 const h=new Headers(response.headers);h.set('Cache-Control','no-store');if(!h.has('Content-Security-Policy'))h.set('Content-Security-Policy',"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; media-src 'self' blob:; connect-src 'self'; worker-src 'self' blob:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'");h.set('X-Content-Type-Options','nosniff');h.set('X-Frame-Options','DENY');h.set('Referrer-Policy','strict-origin-when-cross-origin');h.set('Permissions-Policy','camera=(), microphone=(), geolocation=()')
 return new Response(req.method==='HEAD'?null:response.body,{status:response.status,headers:h})
}}
