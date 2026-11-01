import {type Doc,paths} from './cms'
export const escape=(s:unknown)=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!))
const safeLink=(s:string)=>/^(https?:\/\/|mailto:|\/[^/]|#[a-z])/i.test(s)?s:'#'
function inline(s:string){
 return escape(s).replace(/!\[([^\]]*)\]\((\/media\/uploads\/[a-f0-9-]+\.[a-z0-9]+)\)/g,'<img loading="lazy" src="$2" alt="$1">').replace(/\[([^\]]+)\]\(([^\s)]+)\)/g,(_m,t,u)=>`<a href="${safeLink(u)}" rel="noopener noreferrer">${t}</a>`).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/\*([^*]+)\*/g,'<em>$1</em>')
}
export function markdown(s:string){
 let list='';const out:string[]=[]
 for(const line of s.split('\n')){
  const item=/^\s*([-*]|\d+\.)\s+(.+)/.exec(line)
  if(item){const kind=/\d/.test(item[1])?'ol':'ul';if(list!==kind){if(list)out.push(`</${list}>`);out.push(`<${kind}>`);list=kind}out.push('<li>'+inline(item[2])+'</li>');continue}
  if(list){out.push(`</${list}>`);list=''}
  const h=/^(#{1,3})\s+(.+)/.exec(line)
  if(h)out.push(`<h${Math.max(2,h[1].length)}>${inline(h[2])}</h${Math.max(2,h[1].length)}>`)
  else if(line.trim())out.push('<p>'+inline(line)+'</p>')
 }
 if(list)out.push(`</${list}>`)
 return out.join('')
}
export const image=(url:string,alt:string,lazy=true)=>url?`<img src="${escape(url)}" alt="${escape(alt)}" loading="${lazy?'lazy':'eager'}" decoding="async">`:''
const empty=(title:string,description:string)=>`<div class="empty"><span class="eyebrow">A space in the making</span><h2>${escape(title)}</h2><p>${escape(description)}</p><a class="button" href="/contact">Discuss your project</a></div>`
export function card(d:Doc){return `<a class="card" href="${paths(d)}">${d.cover?image(d.cover,d.coverAlt||d.media?.find(m=>m.url===d.cover)?.alt||d.title):'<div class="placeholder" aria-hidden="true">✦</div>'}<div><span class="eyebrow">${escape(d.kind==='post'?d.publicationDate:d.subcategory||d.kind)}</span><h2>${escape(d.title)}</h2><p>${escape(d.description)}</p><span class="text-link">Explore →</span></div></a>`}
export const faqHTML=(rows:Doc[])=>rows.length?`<section class="faqs"><h2>Questions & answers</h2>${rows.map(d=>`<details id="${escape(d.slug)}"><summary>${escape(d.title)}</summary><div class="prose">${markdown(d.body||d.description)}</div></details>`).join('')}</section>`:''
export function render(path:string,all:Doc[],target?:Doc,preview=false){
 const business=all.find(d=>d.kind==='settings')||({name:"Charles' Interiors",email:'charlieluner@gmail.com'} as unknown as Doc)
 const name=business.name||"Charles' Interiors"
 const page=target||all.find(d=>d.kind==='page'&&paths(d)===path)
 const kind=path==='/portfolio'?'project':path==='/blog'?'post':path==='/guides'?'guide':path==='/services'?'service':''
 let title=page?.title||({ '/': 'Upholstery & Furniture Restoration', '/portfolio':'Our portfolio','/services':'Services & furnishings','/blog':'From the workshop','/guides':'Furnishing guides','/about':'About Charles’ Interiors','/contact':'Let’s talk about your space','/process':'Planning your project','/faqs':'Questions & answers' } as any)[path]||'Page not found'
 const description=page?.description||`${title}. Explore upholstery and furnishing ideas from ${name}.`
 let content=''
 if(path==='/'){
  const featured=all.filter(d=>d.kind==='project'&&d.featured)
  content=`<section class="hero"><span class="eyebrow">${escape(name)} · Upholstery & interiors</span><h1>${escape(title)}</h1><p>${escape(description)}</p><div class="actions"><a class="button" href="${escape(page?.ctaUrl||'/portfolio')}">${escape(page?.ctaLabel||'Explore our work')}</a><a class="button secondary" href="/contact">Discuss your project</a></div></section>`
  if(page?.body)content+=`<section class="section prose">${markdown(page.body)}</section>`
  if(page?.enabled!==false)content+=`<section class="section"><div class="section-heading"><div><span class="eyebrow">${escape(page?.featuredEyebrow||'Selected work')}</span><h2>${escape(page?.featuredHeading||'Materials. Details. Possibilities.')}</h2></div><a href="/portfolio">Full portfolio →</a></div>${featured.length?`<div class="grid">${featured.slice(0,6).map(card).join('')}</div>`:empty('New work will appear here','Our portfolio is being updated. Contact us to discuss your furniture and ideas.')}</section>`
  const services=all.filter(d=>d.kind==='service');if(services.length&&page?.servicesEnabled!==false)content+=`<section class="section tint"><span class="eyebrow">${escape(page?.servicesEyebrow||'For your space')}</span><h2>${escape(page?.servicesHeading||'Explore our services')}</h2><div class="grid">${services.map(card).join('')}</div></section>`
 }else if(target&&['project','post','guide','service'].includes(target.kind)){
  content=`<section class="section"><nav class="breadcrumb"><a href="/">Home</a> / <a href="${{project:'/portfolio',post:'/blog',guide:'/guides',service:'/services'}[target.kind as 'project']}">${escape(target.kind==='post'?'Blog':target.kind)}</a></nav><div class="intro"><span class="eyebrow">${escape(target.publicationDate||target.subcategory||target.kind)}</span><h1>${escape(title)}</h1><p>${escape(description)}</p></div>${target.cover?`<figure class="cover">${image(target.cover,target.coverAlt||target.media?.find(m=>m.url===target.cover)?.alt||target.title,false)}${target.coverCaption?`<figcaption>${escape(target.coverCaption)}</figcaption>`:''}</figure>`:''}<article class="prose">${markdown(target.body||'')}</article><div class="gallery">${(target.media||[]).map(m=>`<figure>${/\.(mp4|webm)$/.test(m.url)?`<video controls playsinline preload="none" ${m.poster?`poster="${escape(m.poster)}"`:''} aria-label="${escape(m.title||title)}" src="${escape(m.url)}"></video>`:image(m.url,m.alt||title)}${m.title?`<h2>${escape(m.title)}</h2>`:''}${m.caption?`<figcaption>${escape(m.caption)}</figcaption>`:''}${m.before?`<details><summary>Before this work</summary>${image(m.before,m.beforeAlt||'Before work: '+title)}${m.beforeCaption?`<p>${escape(m.beforeCaption)}</p>`:''}</details>`:''}</figure>`).join('')}</div></section>`
  if(target.kind==='service'){const related=all.filter(d=>d.kind==='project'&&d.category&&d.category===target.category);if(related.length)content+=`<section class="section"><h2>Related work</h2><div class="grid">${related.map(card).join('')}</div></section>`}
 }else{
  content=`<section class="section"><div class="intro"><span class="eyebrow">${escape(name)}</span><h1>${escape(title)}</h1><p>${escape(description)}</p></div>`
  if(target?.kind==='category'&&target.cover)content+=`<figure class="cover">${image(target.cover,target.coverAlt||target.media?.find(m=>m.url===target.cover)?.alt||target.title,false)}${target.coverCaption?`<figcaption>${escape(target.coverCaption)}</figcaption>`:''}</figure>`
  if(kind||target?.kind==='category'){
   const rows=all.filter(d=>d.kind===(kind||'project')&&(!target||target.kind!=='category'||d.category===target.id))
   if(path==='/portfolio'){const cats=all.filter(d=>d.kind==='category');content+=`<nav class="filters" aria-label="Portfolio categories"><a href="/portfolio">All work</a>${cats.map(c=>`<a href="${paths(c)}">${escape(c.title)}</a>`).join('')}</nav>`}
   content+=rows.length?`<div class="grid">${rows.map(card).join('')}</div>`:empty('Nothing published yet',kind==='post'?'Articles will appear here when they are ready.':'New content will appear here as it is published.')
  }
  if(path==='/about'&&business.profile)content+=`<figure class="profile">${image(business.profile,business.profileAlt||'The artisan at '+name,false)}</figure>`
  if(page?.body)content+=`<article class="prose">${markdown(page.body)}</article>`
  if(path==='/contact')content+=`<div class="contact-grid"><div>${business.email?`<p><a href="mailto:${escape(business.email)}">${escape(business.email)}</a></p>`:''}${business.phone?`<p><a href="tel:${escape(business.phone)}">${escape(business.phone)}</a></p>`:''}${business.whatsapp?`<p><a href="https://wa.me/${escape(business.whatsapp)}">Message on WhatsApp →</a></p>`:''}<p>${escape(business.address)}</p><p class="pre-line">${escape(business.hours)}</p></div><form id="inquiry"><h2>Tell us about your project</h2><label>Your name<input name="name" required maxlength="100" autocomplete="name"></label><label>Email<input name="email" type="email" required maxlength="254" autocomplete="email"></label><label>Phone (optional)<input name="phone" type="tel" maxlength="40" autocomplete="tel"></label><label class="trap" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label><label>What would you like to do?<textarea name="description" rows="6" required maxlength="5000"></textarea></label><button type="submit" class="button">Send enquiry</button><p role="status" id="inquiry-status"></p></form></div>`
  if(path==='/faqs'&&!all.some(d=>d.kind==='faq'))content+=empty('Your questions, answered','Frequently asked questions will appear here as they are published.')
  content+='</section>'
 }
 const faqs=all.filter(d=>d.kind==='faq'&&(path==='/faqs'||d.placement===path||d.placement==='all'))
 if(faqs.length)content+=`<section class="section narrow">${faqHTML(faqs)}</section>`
 if(path!=='/contact'&&business.ctaEnabled!==false)content+=`<section class="section cta"><span class="eyebrow">${escape(business.ctaEyebrow||'Start a conversation')}</span><h2>${escape(business.ctaHeading||'A new chapter for your furniture.')}</h2><p>${escape(business.ctaText||'Share a few details, photographs and your ideas.')}</p><a class="button" href="${escape(business.ctaUrl||'/contact')}">${escape(business.ctaLabel||'Get in touch')}</a></section>`
 const nav=[['/portfolio','Portfolio'],['/services','Services'],['/about','About'],['/blog','Journal'],['/guides','Guides'],['/faqs','FAQs'],['/contact','Contact']]
 const html=`${preview?'<div class="preview-banner">Private preview — saved draft. <a href="/admin">Return to editor</a></div>':''}<a class="skip" href="#main-content">Skip to content</a><header><div class="nav-wrap"><a class="brand" href="/">${business.logo?image(business.logo,name,false):`<span>${escape(name)}</span><small>Upholstery · Interiors</small>`}</a><button id="menu-toggle" aria-expanded="false" aria-controls="navigation">Menu</button><nav id="navigation">${nav.map(([href,label])=>`<a ${path.startsWith(href)?'aria-current="page"':''} href="${href}">${label}</a>`).join('')}</nav></div></header><main id="main-content">${content}</main><footer><div><a class="brand" href="/">${escape(name)}</a><p>${escape(business.footer||'Upholstery & interior furnishings. Let’s discuss your project.')}</p></div><div>${nav.map(([href,label])=>`<a href="${href}">${label}</a>`).join('')}<a href="/admin">Owner sign in</a></div><div>${business.email?`<a href="mailto:${escape(business.email)}">${escape(business.email)}</a>`:''}${['instagram','facebook'].map(k=>business[k]?`<a rel="noopener noreferrer" href="${escape(business[k])}">${k}</a>`:'').join('')}<small>© ${new Date().getFullYear()} ${escape(name)}</small></div></footer>${business.whatsapp?`<a class="whatsapp" href="https://wa.me/${escape(business.whatsapp)}" aria-label="Contact on WhatsApp">WhatsApp ↗</a>`:''}<script src="/site.js" defer></script>`
 return {html,title:page?.seoTitle||title,description:page?.seoDescription||description,image:page?.socialImage||page?.cover||business.logo||'',name,faqs,page}
}
