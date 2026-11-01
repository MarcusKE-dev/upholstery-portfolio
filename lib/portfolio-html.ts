import type { Project } from './project'
import { CATEGORIES,SUBCATEGORIES,type CategoryId } from './constants'
export const escape=(v:unknown)=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!))
const safe=(url:string)=>url.startsWith('/media/')||/^https:\/\//.test(url)?escape(url):''
export function grid(projects:Project[]){
 if(!projects.length)return '<p>No project photographs are currently available. You can still discuss a furniture or furnishing enquiry.</p>'
 return `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">${projects.map(p=>`<article><figure><a href="/projects/${encodeURIComponent(p.id)}"><div class="relative aspect-[4/3] bg-[#E8DFD0]"><img src="${safe(p.image_url)}" alt="${escape(p.alt_text||p.title)}" loading="lazy" class="object-cover" style="width:100%;height:100%;position:absolute;inset:0"/></div></a><figcaption><h2 class="font-serif text-2xl mt-4"><a href="/projects/${encodeURIComponent(p.id)}">${escape(p.title)}</a></h2><p class="text-sm mt-2">${escape(CATEGORIES.find(c=>c.id===p.category)?.label||'Upholstery and furnishings')}</p>${p.description?`<p class="mt-3">${escape(p.description)}</p>`:''}</figcaption></figure>${p.video_url?`<video controls preload="metadata" playsinline style="width:100%;margin-top:1rem" src="${safe(p.video_url)}" aria-label="${escape(p.title)} video"></video>`:''}</article>`).join('')}</div>`
}
export function portfolioHTML(data:{projects:Project[];hasMore:boolean;page:number;category?:string|null;subcategory?:string|null},home=false){
 if(home)return grid(data.projects)
 const {page,category,subcategory}=data
 const href=(n:number,cat=category,sub=subcategory)=>'/portfolio?'+new URLSearchParams({...n>1?{page:String(n)}:{},...cat?{category:cat}:{},...sub?{subcategory:sub}:{}})
 return `<nav aria-label="Filter portfolio" class="flex flex-wrap gap-5 mb-8"><a href="/portfolio">All work</a>${CATEGORIES.map(c=>`<a href="${escape(href(1,c.id,''))}" ${category===c.id?'aria-current="page"':''}>${escape(c.label)}</a>`).join('')}</nav>${category?`<nav aria-label="Filter by furniture type" class="flex flex-wrap gap-4 mb-8"><a href="${escape(href(1,category,''))}">All types</a>${SUBCATEGORIES[category as CategoryId].map(s=>`<a href="${escape(href(1,category,s))}">${escape(s)}</a>`).join('')}</nav>`:''}${grid(data.projects)}<nav class="flex gap-8 mt-10" aria-label="Portfolio pages">${page>1?`<a href="${escape(href(page-1))}">Previous page</a>`:''}${data.hasMore?`<a href="${escape(href(page+1))}">Next page</a>`:''}</nav>`
}
