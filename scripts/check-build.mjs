import {readFile,readdir,stat} from 'node:fs/promises'
import assert from 'node:assert/strict'
const secrets=[]
for(const file of ['.env','.env.local','.dev.vars']){try{for(const line of (await readFile(file,'utf8')).split('\n')){const m=/^([A-Z_0-9]+)=(.*)$/.exec(line);if(m&&/SECRET|TOKEN|PASSWORD|KEY/.test(m[1])){const value=m[2].replace(/^["']|["']$/g,'').trim();if(value.length>=12)secrets.push({name:m[1],value})}}}catch{}}
let files=0
async function scan(dir){for(const e of await readdir(dir,{withFileTypes:true})){const path=dir+'/'+e.name;if(e.isDirectory())await scan(path);else{const b=await readFile(path);files++;for(const s of secrets)assert(!b.includes(s.value),`Secret ${s.name} found in ${path}`);if(/\.(js|html)$/.test(path))assert(!/supabase\.co|NEXT_PUBLIC_ADMIN_PASSWORD|@supabase\/supabase-js/.test(b.toString()),`Old backend dependency in ${path}`)}}}
await scan('out')
assert((await stat('out/_worker.js')).size>1000)
assert((await stat('out/admin.html')).size>1000)
const index=await readFile('out/index.html','utf8');assert(!index.includes('self.__next_f.push'));assert(index.includes('Temporarily unavailable'))
const routes=JSON.parse(await readFile('out/_routes.json','utf8'));assert(routes.include.includes('/*'));assert(routes.exclude.includes('/_next/*'))
console.log(`Verified ${files} output files: Pages Functions + admin export, no stale public hydration, no known local secret values or Supabase runtime dependencies.`)
