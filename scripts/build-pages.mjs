import {build} from 'esbuild'
import {writeFile,readFile,readdir,unlink} from 'node:fs/promises'
await build({entryPoints:['cloudflare/worker.ts'],outfile:'out/_worker.js',bundle:true,format:'esm',platform:'browser',target:'es2022',conditions:['workerd','worker','browser'],external:['cloudflare:*','node:*'],minify:true})
await writeFile('out/_routes.json',JSON.stringify({version:1,include:['/*'],exclude:['/_next/*','/site.css','/site.js','/icon.svg','/favicon.ico']},null,2))
await writeFile('out/_headers',`/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: DENY\n/admin*\n  X-Robots-Tag: noindex, nofollow\n  Cache-Control: no-store\n`)
// Public pages are rendered by Functions. Remove stale exported copies and RSC payloads.
async function prune(dir){for(const item of await readdir(dir,{withFileTypes:true})){const path=dir+'/'+item.name;if(item.isDirectory()){if(item.name!=='_next')await prune(path)}else if(/\.(html|txt|rsc)$/.test(item.name)&&!['out/index.html','out/admin.html','out/404.html','out/robots.txt'].includes(path))await unlink(path)}}
await prune('out')
const template=await readFile('out/index.html','utf8')
await writeFile('out/index.html',template.replace(/<body[^>]*>[\s\S]*<\/body>/,'<body><main id="main-content"><h1>Temporarily unavailable</h1><p>Please try again shortly.</p></main></body>'))
const worker=await readFile('out/_worker.js','utf8')
if(!worker.includes('fetch')||!worker.includes('DB')||!worker.includes('MEDIA'))throw Error('Missing Functions bindings')
console.log('Packaged Next static export and Pages Functions in out/. No deployment performed.')
