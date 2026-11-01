import {test,expect} from '@playwright/test'
import {readFileSync,mkdirSync} from 'node:fs'
import {execFileSync} from 'node:child_process'
const site='https://localhost:8788'
const db=(sql:string)=>execFileSync(process.execPath,['node_modules/wrangler/bin/wrangler.js','d1','execute','DB','--local','--command',sql,'--json'],{stdio:['ignore','pipe','pipe']})
test('complete fresh Pages application, owner lifecycle, publishing, media and responsive layouts',async({page,context,browser,request})=>{
 expect(site).toBe('https://localhost:8788')
 db("DROP TRIGGER IF EXISTS fixture_save_failure; DROP TRIGGER IF EXISTS fixture_upload_failure; DELETE FROM sessions; DELETE FROM challenges; DELETE FROM administrator; DELETE FROM backup_credentials; DELETE FROM rate_limits; DELETE FROM content WHERE kind IN ('project','post') OR id LIKE 'fixture-%';")
 const indexable=(await (await request.get('/robots.txt')).text()).includes('Allow: /')
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message))
 const anon=await browser.newContext({baseURL:site,ignoreHTTPSErrors:true})
 const post=(path:string,data:any)=>context.request.post(path,{headers:{Origin:site},data})
 const save=async(record:any)=>{const r=await post('/api/admin/content',{record});expect(r.status(),await r.text()).toBe(200);return (await r.json()).record}
 const remove=(id:string)=>post('/api/admin/content',{action:'delete',id})
 for(const path of ['/','/portfolio','/blog','/guides','/services','/about','/process','/faqs','/contact','/guides/reupholster-or-replace-sofa','/services/sofa-reupholstery'])expect((await request.get(path)).status(),path).toBe(200)
 expect(await (await request.get('/portfolio')).text()).toContain('Nothing published yet')
 for(const path of ['/missing','/projects/missing','/blog/missing','/guides/missing','/preview/missing'])expect((await request.get(path)).status(),path).toBe(path.startsWith('/preview')?401:404)
 for(const path of ['/all-photos','/portfolio/','/portfolio.html'])expect((await request.get(path,{maxRedirects:0})).status()).toBe(308)
 for(const path of ['/api/admin/content','/api/admin/upload','/api/admin/media','/api/admin/video/start','/api/admin/video/part','/api/admin/video/complete','/api/admin/video/abort'])expect((await anon.request.post(path,{headers:{Origin:site},data:{}})).status(),path).toBe(401)
 expect((await anon.request.post('/api/admin/auth/options',{headers:{Origin:site},data:{register:true,setupToken:'wrong'}})).status()).toBe(403)
 expect((await anon.request.post('/api/inquiry',{headers:{Origin:site},data:{name:'Bad',email:'no',description:'Test'}})).status()).toBe(400)
 expect((await anon.request.post('/api/inquiry',{headers:{Origin:site},data:{name:'Fixture',email:'test@example.invalid',description:'Disposable local enquiry'}})).status()).toBe(503)
 expect((await anon.request.post('/api/inquiry',{headers:{Origin:'https://evil.invalid'},data:{}})).status()).toBe(403)
 await page.goto('/admin');await page.evaluate(()=>{localStorage.setItem('admin','true')});await page.reload();await expect(page.getByRole('button',{name:'Sign in with passkey',exact:true})).toBeVisible()
 const cdp=await context.newCDPSession(page);await cdp.send('WebAuthn.enable');const primary=await cdp.send('WebAuthn.addVirtualAuthenticator',{options:{protocol:'ctap2',transport:'internal',hasResidentKey:true,hasUserVerification:true,isUserVerified:true,automaticPresenceSimulation:true}})
 const token=readFileSync('.dev.vars','utf8').match(/^ADMIN_ENROLLMENT_TOKEN=(.+)$/m)![1]
 await page.getByRole('button',{name:'First-time owner setup'}).click();await page.getByLabel('Private setup token').fill(token);await page.getByRole('button',{name:'Enroll owner passkey',exact:true}).click();await expect(page.getByRole('button',{name:'Sign out',exact:true})).toBeVisible({timeout:30000})
 const session=(await context.cookies()).find(c=>c.name==='__Host-portfolio_session')!;expect(session.httpOnly&&session.secure&&session.sameSite==='Strict').toBeTruthy()
 expect((await post('/api/admin/auth/options',{register:true,setupToken:token})).status()).toBe(403)
 expect((await context.request.post('/api/admin/content',{headers:{Origin:'https://evil.invalid'},data:{}})).status()).toBe(403)
 expect((await post('/api/admin/upload','<svg onload="alert(1)">')).status()).toBe(415)
 const image=Buffer.from(await page.evaluate(()=>{const c=document.createElement('canvas');c.width=80;c.height=60;const ctx=c.getContext('2d')!;ctx.fillStyle='#a67434';ctx.fillRect(0,0,80,60);return c.toDataURL('image/png').split(',')[1]}),'base64')
 const upload=async()=>{const r=await context.request.post('/api/admin/upload',{headers:{Origin:site,'Content-Type':'application/octet-stream'},data:image});expect(r.status()).toBe(200);return (await r.json()).url as string}
 const a=await upload(),b=await upload();expect((await anon.request.get(a)).status()).toBe(404)
 const category=await save({id:'fixture-category',kind:'category',slug:'fixture-category',title:'Fixture category',published:1})
 let project=await save({id:'fixture-project',kind:'project',slug:'fixture-project',title:'Fixture project',description:'Independent gallery metadata',category:category.id,published:0,cover:a,featured:true,media:[{url:a,alt:'First photo alt',caption:'First independent caption',position:2},{url:b,alt:'Second photo alt',caption:'Second independent caption',position:1,before:a}]})
 expect((await anon.request.get('/projects/fixture-project')).status()).toBe(404);expect((await anon.request.get(a)).status()).toBe(404)
 expect(await (await anon.request.get('/api/content')).text()).not.toContain('Fixture project')
 expect((await anon.request.get('/preview/fixture-project')).status()).toBe(401);expect((await context.request.get('/preview/fixture-project')).status()).toBe(200)
 project=await save({...project,published:1,seoTitle:'Unique fixture SEO',seoDescription:'Unique fixture description'})
 let html=await (await anon.request.get('/projects/fixture-project')).text();expect(html).toContain('Unique fixture SEO');expect(html).toContain('Unique fixture description');expect(html.indexOf('Second independent caption')).toBeLessThan(html.indexOf('First independent caption'));expect(html).toContain('First photo alt');expect(html).not.toContain('/_next/');expect((await anon.request.get(a)).status()).toBe(200)
 expect(await (await anon.request.get('/')).text()).toContain('Fixture project')
 project=await save({...project,slug:'renamed-fixture',title:'Renamed fixture'})
 const sitemap=await (await anon.request.get('/sitemap.xml')).text();if(indexable)expect(sitemap).toContain('/projects/renamed-fixture');else expect(sitemap).not.toContain('<loc>');
 const redirect=await anon.request.get('/projects/fixture-project',{maxRedirects:0});expect(redirect.status()).toBe(301);expect(redirect.headers().location).toBe(site+'/projects/renamed-fixture')
 // Chunked video crosses the chunk boundary while keeping each request at 8 MiB.
 const fixture=readFileSync('tests/cloudflare/fixtures/video.mp4'),video=Buffer.concat([fixture,Buffer.alloc(8*1024*1024)])
 const start=await post('/api/admin/video/start',{type:'video/mp4',size:video.length});expect(start.status()).toBe(200);const state=await start.json()
 expect((await post('/api/admin/video/complete?id='+state.id,{})).status()).toBe(400)
 for(let offset=0,part=1;offset<video.length;offset+=state.partSize,part++){const r=await context.request.post(`/api/admin/video/part?id=${state.id}&part=${part}`,{headers:{Origin:site,'Content-Type':'application/octet-stream'},data:video.subarray(offset,offset+state.partSize)});expect(r.status(),await r.text()).toBe(200)}
 const complete=await post('/api/admin/video/complete?id='+state.id,{});expect(complete.status(),await complete.text()).toBe(200);const videoURL=(await complete.json()).url
 project=await save({...project,media:[...project.media,{url:videoURL,title:'Video fixture',caption:'Video caption',poster:a,position:3}]})
 const range=await anon.request.get(videoURL,{headers:{Range:'bytes=0-31'}});expect(range.status()).toBe(206);expect((await range.body()).length).toBe(32)
 expect((await anon.request.get(videoURL,{headers:{Range:'bytes=-16'}})).status()).toBe(206);expect((await anon.request.get(videoURL,{headers:{Range:'bytes=999999999-'}})).status()).toBe(416)
 await page.goto('/projects/renamed-fixture');await page.locator('video').evaluate(async(v:HTMLVideoElement)=>{v.muted=true;await v.play();v.currentTime=.5});await expect.poll(()=>page.locator('video').evaluate((v:HTMLVideoElement)=>v.readyState)).toBeGreaterThanOrEqual(2)
 // Posts, safe formatted content, drafts, metadata, FAQ placement, services and settings.
 let blog=await save({id:'fixture-blog',kind:'post',slug:'fixture-article',title:'Fixture article',description:'Blog excerpt',body:'## A useful heading\n\n**Bold words** and [a link](/contact)\n\n- First list item\n- Second list item\n\n<script>alert(1)</script>\n\n![Inline image]('+b+')',cover:a,publicationDate:'2026-10-27',published:0})
 expect((await anon.request.get('/blog/fixture-article')).status()).toBe(404)
 blog=await save({...blog,published:1});html=await (await anon.request.get('/blog/fixture-article')).text();expect(html).toContain('<h2>A useful heading</h2>');expect(html).toContain('<strong>Bold words</strong>');expect(html).toContain('<li>First list item</li>');expect(html).not.toContain('<script>alert');expect(html).toContain('BlogPosting')
 const faq=await save({id:'fixture-faq',kind:'faq',slug:'fixture-faq',title:'Fixture question?',body:'Fixture answer.',placement:'/contact',published:1,position:1});expect(await (await anon.request.get('/contact')).text()).toContain('Fixture question?');expect(await (await anon.request.get('/faqs')).text()).toContain('Fixture answer.')
 const service=await save({id:'fixture-service',kind:'service',slug:'fixture-service',title:'Fixture service',body:'Editable service copy',category:category.id,published:1,cover:a});expect(await (await anon.request.get('/services/fixture-service')).text()).toContain('Editable service copy')
 const all=(await (await context.request.get('/api/admin/content')).json()).records
 const about=all.find((d:any)=>d.kind==='page'&&d.slug==='about'),business=all.find((d:any)=>d.kind==='settings')
 await save({...about,body:'Updated profile copy',seoTitle:'Updated about SEO'});expect(await (await anon.request.get('/about')).text()).toContain('Updated profile copy')
 await save({...business,hours:'Fixture hours',profile:a,whatsapp:'254700000000'});expect(await (await anon.request.get('/contact')).text()).toContain('Fixture hours');expect(await (await anon.request.get('/')).text()).toContain('https://wa.me/254700000000')
 await remove(category.id);const afterCategory=(await (await context.request.get('/api/admin/content')).json()).records.find((d:any)=>d.id===project.id);expect(afterCategory.category).toBe('');project={...project,category:''};expect((await anon.request.get('/projects/renamed-fixture')).status()).toBe(200)
 // Shared originals cannot be removed; failed saves preserve existing content.
 expect((await post('/api/admin/media',{action:'delete',key:a.slice(7)})).status()).toBe(409);expect((await post('/api/admin/media',{action:'delete',key:'uploads/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa.png'})).status()).toBe(404)
 db("CREATE TRIGGER fixture_save_failure BEFORE UPDATE ON content BEGIN SELECT RAISE(FAIL,'fixture'); END;")
 expect((await post('/api/admin/content',{record:{...project,title:'Must not persist'}})).status()).toBe(503)
 db('DROP TRIGGER fixture_save_failure;');expect(await (await anon.request.get('/projects/renamed-fixture')).text()).toContain('Renamed fixture')
 db("CREATE TRIGGER fixture_upload_failure BEFORE INSERT ON media BEGIN SELECT RAISE(FAIL,'fixture'); END;")
 expect((await context.request.post('/api/admin/upload',{headers:{Origin:site,'Content-Type':'application/octet-stream'},data:image})).status()).toBe(503);db('DROP TRIGGER fixture_upload_failure;')
 // UI batch upload and independent metadata persistence.
 await page.goto('/admin');await page.getByRole('button',{name:'Projects & galleries',exact:true}).click();await page.getByRole('button',{name:'Create project',exact:true}).click();await page.getByLabel('Title',{exact:true}).first().fill('Batch UI project');await page.getByLabel('URL slug').fill('batch-ui-project');let failOnce=true;await page.route('**/api/admin/upload',async route=>{if(failOnce){failOnce=false;await route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'Injected transient upload failure'})})}else await route.continue()});await page.locator('input[type=file]').setInputFiles([{name:'first.png',mimeType:'image/png',buffer:image},{name:'second.png',mimeType:'image/png',buffer:image}]);await expect(page.getByRole('button',{name:'Retry',exact:true})).toBeVisible({timeout:30000});await expect(page.getByText('Uploaded',{exact:true})).toHaveCount(1,{timeout:30000});await page.getByRole('button',{name:'Retry',exact:true}).click();await expect(page.getByText('Uploaded',{exact:true})).toHaveCount(2,{timeout:30000});await page.unroute('**/api/admin/upload');await expect(page.getByLabel('Alt text (photos)')).toHaveCount(2);await page.getByLabel('Alt text (photos)').nth(0).fill('UI first alt');await page.getByLabel('Alt text (photos)').nth(1).fill('UI second alt');await page.getByLabel('Caption / description').nth(0).fill('UI first caption');await page.getByRole('button',{name:'Publish',exact:true}).click();await expect(page.getByText('Published changes saved.',{exact:true})).toBeVisible();expect(await (await anon.request.get('/projects/batch-ui-project')).text()).toContain('UI first caption');const previewPromise=context.waitForEvent('page');await page.getByRole('button',{name:'Save & preview',exact:true}).click();const previewPage=await previewPromise;await expect(previewPage.locator('h1')).toHaveText('Batch UI project');await previewPage.close()
 mkdirSync('test-results/layouts',{recursive:true})
 for(const width of [360,390,768,1440]){
  await page.setViewportSize({width,height:900})
  for(const route of ['/','/portfolio','/services','/blog','/blog/fixture-article','/faqs','/contact','/admin']){
   await page.goto(route);await expect(page.locator('h1')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${route} at ${width}px`).toBeTruthy()
  }
  await page.screenshot({path:`test-results/layouts/admin-${width}.png`,fullPage:true});await page.goto('/portfolio');await page.screenshot({path:`test-results/layouts/portfolio-${width}.png`,fullPage:true})
  if(width<1050){await page.getByRole('button',{name:'Menu',exact:true}).click();await expect(page.locator('#navigation')).toBeVisible();await page.keyboard.press('Escape');await expect(page.locator('#navigation')).toBeHidden()}
 }
 await page.goto('/admin');await page.getByRole('button',{name:'Projects & galleries',exact:true}).click();await page.getByRole('button',{name:'Edit',exact:true}).first().click();await page.getByLabel('Title',{exact:true}).first().fill('Unsaved local edit');let prompted=false;page.once('dialog',async d=>{prompted=true;await d.dismiss()});await page.getByRole('button',{name:'Blog',exact:true}).click();expect(prompted).toBeTruthy();await expect(page.getByLabel('Title',{exact:true}).first()).toHaveValue('Unsaved local edit')
 page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'Account & recovery',exact:true}).click();await cdp.send('WebAuthn.removeVirtualAuthenticator',{authenticatorId:primary.authenticatorId});await cdp.send('WebAuthn.addVirtualAuthenticator',{options:{protocol:'ctap2',transport:'usb',hasResidentKey:true,hasUserVerification:true,isUserVerified:true,automaticPresenceSimulation:true}});await page.getByRole('button',{name:'Register backup passkey'}).click();await expect(page.getByText('Backup passkey registered.',{exact:true})).toBeVisible({timeout:30000})
 // Unpublishing removes HTML, API entries, redirects and media access immediately.
 await save({...blog,published:0});expect((await anon.request.get('/blog/fixture-article')).status()).toBe(404);expect(await (await anon.request.get('/sitemap.xml')).text()).not.toContain('/blog/fixture-article');expect(await (await anon.request.get('/api/content')).text()).not.toContain('Fixture article')
 await save({...project,published:0});expect((await anon.request.get('/projects/renamed-fixture')).status()).toBe(404);expect((await anon.request.get('/projects/fixture-project')).status()).toBe(404);expect((await anon.request.get(videoURL)).status()).toBe(404)
 await remove(project.id);expect((await context.request.get(videoURL)).status()).toBe(200)
 await remove(service.id);await remove(blog.id);await remove(faq.id);await save(about);await save(business)
 await page.getByRole('button',{name:'Sign out',exact:true}).click();await expect(page.getByRole('button',{name:'Sign in with passkey',exact:true})).toBeVisible();expect((await context.request.get('/api/admin/content')).status()).toBe(401)
 db('DELETE FROM rate_limits;');await page.getByRole('button',{name:'Sign in with passkey',exact:true}).click();await expect(page.getByRole('button',{name:'Sign out',exact:true})).toBeVisible({timeout:30000})
 db('UPDATE sessions SET expires_at=0;');expect((await post('/api/admin/content',{record:project})).status()).toBe(401)
 db('DELETE FROM rate_limits;');for(let i=0;i<10;i++)await anon.request.post('/api/admin/auth/options',{headers:{Origin:site},data:{}});expect((await anon.request.post('/api/admin/auth/options',{headers:{Origin:site},data:{}})).status()).toBe(429)
 expect((await request.get('https://127.0.0.1:8788/')).status()).toBe(403);
 execFileSync(process.execPath,['node_modules/wrangler/bin/wrangler.js','d1','execute','DB','--local','--file','scripts/reset-owner.sql','--json'],{stdio:['ignore','pipe','pipe']});await page.goto('/admin');await page.getByRole('button',{name:'First-time owner setup'}).click();await page.getByLabel('Private setup token').fill(token);await page.getByRole('button',{name:'Enroll owner passkey',exact:true}).click();await expect(page.getByRole('button',{name:'Sign out',exact:true})).toBeVisible({timeout:30000});expect((await anon.request.get('/projects/batch-ui-project')).status()).toBe(200);
 expect(errors).toEqual([]);db("DELETE FROM content WHERE kind='project' AND slug='batch-ui-project'; DELETE FROM sessions; DELETE FROM challenges; DELETE FROM administrator; DELETE FROM backup_credentials; DELETE FROM rate_limits;");await anon.close()
})

test('FAQ lifecycle and media validation boundaries on disposable local D1',async({request})=>{
 expect(site).toBe('https://localhost:8788')
 const {randomBytes,createHash}=await import('node:crypto')
 const token=randomBytes(32).toString('hex'),hash=createHash('sha256').update(token).digest('hex')
 // This session is an isolated test fixture; WebAuthn itself is exercised by the main browser test.
 db(`INSERT INTO sessions VALUES('${hash}',${Math.floor(Date.now()/1000)+600});`)
 const headers={Origin:site,Cookie:'__Host-portfolio_session='+token}
 const post=(path:string,data:any)=>request.post(path,{headers,data})
 const save=async(record:any)=>{const r=await post('/api/admin/content',{record});expect(r.status(),await r.text()).toBe(200);return (await r.json()).record}
 let faq=await save({id:'fixture-validation-faq',kind:'faq',slug:'validation-faq',title:'Validation fixture question?',body:'Original answer',placement:'/contact',position:0,published:0})
 expect(await (await request.get('/contact')).text()).not.toContain(faq.title)
 faq=await save({...faq,published:1});expect(await (await request.get('/contact')).text()).toContain(faq.title)
 faq=await save({...faq,body:'Edited answer',position:-100});const faqs=await (await request.get('/faqs')).text();expect(faqs).toContain('Edited answer');expect(faqs.indexOf(faq.title)).toBeLessThan(faqs.indexOf('Can an existing sofa'))
 faq=await save({...faq,published:0});expect(await (await request.get('/contact')).text()).not.toContain(faq.title)
 expect((await post('/api/admin/content',{action:'delete',id:faq.id})).status()).toBe(200)
 const binaryHeaders={...headers,'Content-Type':'application/octet-stream'}
 expect((await request.post('/api/admin/upload',{headers:binaryHeaders,data:Buffer.alloc(12*1024*1024+1)})).status()).toBe(413)
 const image=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aWQAAAABJRU5ErkJggg==','base64')
 const tooLarge=Buffer.from(image);tooLarge.writeUInt32BE(50000,16);tooLarge.writeUInt32BE(50000,20)
 expect((await request.post('/api/admin/upload',{headers:binaryHeaders,data:tooLarge})).status()).toBe(415)
 expect((await post('/api/admin/video/start',{type:'video/mp4',size:2*1024*1024*1024+1})).status()).toBe(400)
 const start=await post('/api/admin/video/start',{type:'video/mp4',size:32,name:'disposable.mp4'});expect(start.status()).toBe(200);const {id}=await start.json()
 expect((await request.post('/api/admin/video/part?id='+id+'&part=1',{headers:binaryHeaders,data:Buffer.alloc(16)})).status()).toBe(400)
 expect((await request.post('/api/admin/video/part?id='+id+'&part=1',{headers:binaryHeaders,data:Buffer.alloc(32)})).status()).toBe(415)
 expect((await post('/api/admin/video/abort?id='+id,{})).status()).toBe(200)
 expect((await post('/api/admin/video/complete?id='+id,{})).status()).toBe(404)
 const media=await request.post('/api/admin/upload',{headers:binaryHeaders,data:image});expect(media.status()).toBe(200);const url=(await media.json()).url
 expect((await request.get(url)).status()).toBe(404);expect((await request.get(url,{headers})).status()).toBe(200)
 const bulk=await save({id:'fixture-bulk-gallery',kind:'project',slug:'fixture-bulk-gallery',title:'Bulk gallery fixture',published:0,media:Array.from({length:100},(_,i)=>({url,alt:'Photo '+i,caption:'Independent caption '+i,position:i}))});expect(bulk.media.length).toBe(100);expect(bulk.media[99].caption).toBe('Independent caption 99');const library=(await (await request.get('/api/admin/media',{headers})).json()).media;expect(library.find((m:any)=>'/media/'+m.object_key===url).references_count).toBe(1);expect((await post('/api/admin/content',{action:'delete',id:bulk.id})).status()).toBe(200)
 expect((await post('/api/admin/media',{action:'delete',key:url.slice(7)})).status()).toBe(200)
 expect((await request.get(url,{headers})).status()).toBe(404)
 db(`DELETE FROM sessions WHERE token_hash='${hash}';`)
})

test('admin gallery editor controls fit phones, tablets and desktop',async({page,context})=>{
 expect(site).toBe('https://localhost:8788')
 const {randomBytes,createHash}=await import('node:crypto');const token=randomBytes(32).toString('hex'),hash=createHash('sha256').update(token).digest('hex')
 db(`INSERT INTO sessions VALUES('${hash}',${Math.floor(Date.now()/1000)+600});`)
 await context.addCookies([{name:'__Host-portfolio_session',value:token,url:site,secure:true,httpOnly:true,sameSite:'Strict'}])
 const headers={Origin:site}
 const image=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aWQAAAABJRU5ErkJggg==','base64')
 const photo=await context.request.post('/api/admin/upload',{headers:{...headers,'Content-Type':'application/octet-stream'},data:image});expect(photo.status()).toBe(200);const photoURL=(await photo.json()).url
 const video=await context.request.post('/api/admin/upload',{headers:{...headers,'Content-Type':'application/octet-stream'},data:readFileSync('tests/cloudflare/fixtures/video.webm')});expect(video.status()).toBe(200);const videoURL=(await video.json()).url
 const record={id:'fixture-layout-editor',kind:'project',slug:'fixture-layout-editor',title:'Responsive editor fixture',cover:photoURL,published:0,media:[{url:photoURL,title:'First image',alt:'A separately described image',caption:'An independent caption',position:0,before:photoURL},{url:videoURL,title:'Video title',caption:'Video description',poster:photoURL,position:1}]}
 const created=await context.request.post('/api/admin/content',{headers,data:{record}});expect(created.status()).toBe(200)
 for(const width of [360,390,768,1440]){
  await page.setViewportSize({width,height:900});await page.goto('/admin');await page.getByRole('button',{name:'Projects & galleries',exact:true}).click();await page.getByLabel('Search',{exact:true}).fill(record.title);await page.getByRole('button',{name:'Edit',exact:true}).click()
  await expect(page.getByRole('button',{name:'Save',exact:true})).toBeVisible();await expect(page.getByRole('button',{name:'Publish',exact:true})).toBeVisible();await expect(page.getByLabel('Alt text (photos)')).toHaveCount(2)
  if(width===360){await page.getByLabel('Cover alt text',{exact:true}).fill('Cover alt fixture');await page.getByLabel('Cover caption',{exact:true}).fill('Cover caption fixture');await page.getByLabel('Before image alt text',{exact:true}).fill('Before alt fixture');await page.getByLabel('Before image caption',{exact:true}).fill('Before caption fixture');await page.getByRole('button',{name:'Save',exact:true}).click();await expect(page.getByText('Draft saved.',{exact:true})).toBeVisible();const preview=await (await context.request.get('/preview/'+record.id)).text();for(const text of ['Cover alt fixture','Cover caption fixture','Before alt fixture','Before caption fixture'])expect(preview).toContain(text)}
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`editor at ${width}px`).toBeTruthy()
  await page.screenshot({path:`test-results/layouts/admin-editor-${width}.png`,fullPage:true})
 }
 expect((await context.request.post('/api/admin/content',{headers,data:{action:'delete',id:record.id}})).status()).toBe(200)
 for(const url of [photoURL,videoURL])expect((await context.request.post('/api/admin/media',{headers,data:{action:'delete',key:url.slice(7)}})).status()).toBe(200)
 db(`DELETE FROM sessions WHERE token_hash='${hash}';`)
})

test('homepage headings, optional sections and shared CTA persist through structured editors',async({page,context})=>{
 expect(site).toBe('https://localhost:8788')
 const {randomBytes,createHash}=await import('node:crypto');const token=randomBytes(32).toString('hex'),hash=createHash('sha256').update(token).digest('hex')
 db(`INSERT INTO sessions VALUES('${hash}',${Math.floor(Date.now()/1000)+600});`)
 await context.addCookies([{name:'__Host-portfolio_session',value:token,url:site,secure:true,httpOnly:true,sameSite:'Strict'}])
 const headers={Origin:site},all=(await (await context.request.get('/api/admin/content')).json()).records
 const business=all.find((d:any)=>d.kind==='settings'),home=all.find((d:any)=>d.kind==='page'&&d.slug==='home')
 const save=async(record:any)=>{const r=await context.request.post('/api/admin/content',{headers,data:{record}});expect(r.status(),await r.text()).toBe(200)}
 try{
  await page.goto('/admin');await page.getByRole('button',{name:'Business settings',exact:true}).click();await page.getByRole('button',{name:'Edit',exact:true}).click()
  await page.getByLabel('CTA eyebrow',{exact:true}).fill('Fixture eyebrow');await page.getByLabel('CTA heading',{exact:true}).fill('Fixture shared heading');await page.getByRole('textbox',{name:'CTA introduction',exact:true}).fill('Fixture shared introduction');await page.getByLabel('CTA button label',{exact:true}).fill('Fixture shared button');await page.getByLabel('CTA button path',{exact:false}).fill('/services');let releaseSave!:()=>void;const heldSave=new Promise<void>(resolve=>{releaseSave=resolve});await page.route('**/api/admin/content',async route=>{if(route.request().method()==='POST')await heldSave;await route.continue()});await page.getByRole('button',{name:'Save',exact:true}).click();await expect(page.getByLabel('CTA heading',{exact:true})).toBeDisabled();await page.getByRole('button',{name:'Pages & SEO',exact:true}).click();await expect(page.getByLabel('CTA heading',{exact:true})).toBeVisible();releaseSave();await expect(page.getByText('Published changes saved.',{exact:true})).toBeVisible();await page.unroute('**/api/admin/content')
  let html=await (await context.request.get('/')).text();for(const text of ['Fixture eyebrow','Fixture shared heading','Fixture shared introduction','Fixture shared button'])expect(html).toContain(text)
  await page.getByRole('button',{name:'Pages & SEO',exact:true}).click();await page.getByLabel('Search',{exact:true}).fill(home.title);await page.getByRole('button',{name:'Edit',exact:true}).click()
  await page.getByLabel('Featured work section eyebrow').fill('Fixture work');await page.getByLabel('Featured work section heading').fill('Fixture featured heading');await page.getByLabel('Services section eyebrow').fill('Fixture services');await page.getByLabel('Services section heading').fill('Fixture services heading');await page.getByRole('button',{name:'Save',exact:true}).click();await expect(page.getByText('Published changes saved.',{exact:true})).toBeVisible()
  html=await (await context.request.get('/')).text();expect(html).toContain('Fixture featured heading');expect(html).toContain('Fixture services heading')
  await page.getByLabel('Show selected projects section').uncheck();await page.getByLabel('Show homepage services section').uncheck();await page.getByRole('button',{name:'Save',exact:true}).click();await expect(page.getByText('Published changes saved.',{exact:true})).toBeVisible()
  html=await (await context.request.get('/')).text();expect(html).not.toContain('Fixture featured heading');expect(html).not.toContain('Fixture services heading')
  await save({...business,ctaEnabled:false});expect(await (await context.request.get('/about')).text()).not.toContain('class="section cta"')
  const service={id:'fixture-renaming-service',kind:'service',slug:'fixture-service-before',title:'Renaming service fixture',published:1};const faq={id:'fixture-renaming-faq',kind:'faq',slug:'fixture-renaming-faq',title:'Related rename question?',body:'Related answer survives renaming.',placement:'/services/fixture-service-before',published:1};await save(service);await save(faq);await save({...service,slug:'fixture-service-after'});expect((await context.request.get('/services/fixture-service-before',{maxRedirects:0})).status()).toBe(301);expect(await (await context.request.get('/services/fixture-service-after')).text()).toContain(faq.title);for(const id of [faq.id,service.id])expect((await context.request.post('/api/admin/content',{headers,data:{action:'delete',id}})).status()).toBe(200)
 }finally{await save(home);await save(business);db(`DELETE FROM sessions WHERE token_hash='${hash}';`)}
})

test('video completion recovers from a database failure and lost browser response',async({page,context,request})=>{
 expect(site).toBe('https://localhost:8788')
 const {randomBytes,createHash}=await import('node:crypto');const token=randomBytes(32).toString('hex'),hash=createHash('sha256').update(token).digest('hex')
 db(`INSERT INTO sessions VALUES('${hash}',${Math.floor(Date.now()/1000)+600});`)
 await context.addCookies([{name:'__Host-portfolio_session',value:token,url:site,secure:true,httpOnly:true,sameSite:'Strict'}])
 const headers={Origin:site},video=readFileSync('tests/cloudflare/fixtures/video.mp4')
 const post=(path:string,data:any)=>context.request.post(path,{headers,data})
 const start=await post('/api/admin/video/start',{type:'video/mp4',size:video.length,name:'recovery-fixture.mp4'});expect(start.status()).toBe(200);const {id}=await start.json()
 expect((await context.request.post('/api/admin/video/part?id='+id+'&part=1',{headers:{...headers,'Content-Type':'application/octet-stream'},data:video})).status()).toBe(200)
 db("CREATE TRIGGER fixture_upload_failure BEFORE INSERT ON media BEGIN SELECT RAISE(FAIL,'fixture'); END;")
 try{expect((await post('/api/admin/video/complete?id='+id,{})).status()).toBe(503)}finally{db('DROP TRIGGER fixture_upload_failure;')}
 const recovered=await post('/api/admin/video/complete?id='+id,{});expect(recovered.status()).toBe(200);const recoveredMedia=await recovered.json()
 const repeated=await post('/api/admin/video/complete?id='+id,{});expect(repeated.status()).toBe(200);expect((await repeated.json()).url).toBe(recoveredMedia.url)
 expect((await post('/api/admin/video/abort?id='+id,{})).status()).toBe(200);expect((await context.request.get(recoveredMedia.url)).status()).toBe(200);expect((await request.get(recoveredMedia.url)).status()).toBe(404)
 expect((await post('/api/admin/media',{action:'delete',key:recoveredMedia.url.slice(7)})).status()).toBe(200)
 expect((await post('/api/admin/video/complete?id='+id,{})).status()).toBe(404)
 const record={id:'fixture-completion-ui',kind:'project',title:'Completion recovery UI fixture',slug:'fixture-completion-ui',published:0,media:[]}
 expect((await post('/api/admin/content',{record})).status()).toBe(200)
 await page.goto('/admin');await page.getByRole('button',{name:'Projects & galleries',exact:true}).click();await page.getByLabel('Search',{exact:true}).fill(record.title);await page.getByRole('button',{name:'Edit',exact:true}).click()
 let loseResponse=true
 await page.route('**/api/admin/video/complete?*',async route=>{const real=await route.fetch();if(loseResponse&&real.status()===200){loseResponse=false;await route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'Injected lost completion response'})})}else await route.fulfill({response:real})})
 let failLibraryRefresh=false;await page.route('**/api/admin/media',async route=>{if(failLibraryRefresh&&route.request().method()==='GET'){failLibraryRefresh=false;await route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'Injected media-list refresh failure'})})}else await route.continue()});const partRequests=new Map<number,number>();let failSecondPart=true;await page.route('**/api/admin/video/part?*',async route=>{const part=Number(new URL(route.request().url()).searchParams.get('part'));partRequests.set(part,(partRequests.get(part)||0)+1);if(part===2&&failSecondPart){failSecondPart=false;await route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'Injected chunk failure'})})}else await route.continue()});await page.locator('input[type=file]').setInputFiles({name:'retry-fixture.mp4',mimeType:'video/mp4',buffer:Buffer.concat([video,Buffer.alloc(8*1024*1024)])});await expect(page.getByText('Injected chunk failure',{exact:true})).toBeVisible({timeout:30000});await page.getByRole('button',{name:'Retry',exact:true}).click();await expect(page.getByText('Injected lost completion response',{exact:true})).toBeVisible({timeout:30000});failLibraryRefresh=true;await page.getByRole('button',{name:'Retry',exact:true}).click();await expect(page.getByText('Uploaded',{exact:true})).toHaveCount(1,{timeout:30000});expect(partRequests.get(1)).toBe(1);expect(partRequests.get(2)).toBe(2);await expect(page.getByRole('alert').filter({hasText:'Upload completed, but the media list could not refresh. Injected media-list refresh failure'})).toBeVisible();await page.unroute('**/api/admin/media');await page.unroute('**/api/admin/video/part?*');await page.unroute('**/api/admin/video/complete?*')
 await expect(page.locator('.media-entry')).toHaveCount(1);await page.getByRole('button',{name:'Save',exact:true}).click();await expect(page.getByText('Draft saved.',{exact:true})).toBeVisible()
 const saved=(await (await context.request.get('/api/admin/content')).json()).records.find((d:any)=>d.id===record.id);expect(saved.media.length).toBe(1);expect((await context.request.get(saved.media[0].url)).status()).toBe(200)
 expect((await post('/api/admin/content',{action:'delete',id:record.id})).status()).toBe(200);expect((await post('/api/admin/media',{action:'delete',key:saved.media[0].url.slice(7)})).status()).toBe(200)
 db(`DELETE FROM sessions WHERE token_hash='${hash}';`)
})
