import {mkdir,writeFile,chmod,stat} from 'node:fs/promises'
import {createReadStream} from 'node:fs'
import {createHash} from 'node:crypto'
import {resolve,join,dirname} from 'node:path'
import {execFileSync} from 'node:child_process'
const [bucket,directory,environment]=process.argv.slice(2)
if(!bucket||!directory||environment&&!['--preview'].includes(environment))throw Error('Usage: node scripts/backup.mjs BUCKET PRIVATE_DIRECTORY [--preview]')
const dir=resolve(directory);await mkdir(dir,{recursive:true,mode:0o700});await chmod(dir,0o700)
const env=environment?['--env','preview']:[]
const run=(args)=>execFileSync(process.execPath,['node_modules/wrangler/bin/wrangler.js',...args],{encoding:'utf8',maxBuffer:50*1024*1024})
run(['d1','export','DB','--remote',...env,'--output',join(dir,'database.sql')]);await chmod(join(dir,'database.sql'),0o600)
const result=JSON.parse(run(['d1','execute','DB','--remote',...env,'--command','SELECT object_key,size,content_type FROM media ORDER BY object_key','--json']))
const objects=result.flatMap(r=>r.results||[])
for(const object of objects){
 if(!/^uploads\/[a-f0-9-]+\.[a-z0-9]+$/.test(object.object_key))throw Error('Unexpected media key; review manifest.')
 const path=join(dir,'media',object.object_key);await mkdir(dirname(path),{recursive:true,mode:0o700})
 run(['r2','object','get',bucket+'/'+object.object_key,'--remote','--file',path]);await chmod(path,0o600)
 if((await stat(path)).size!==object.size)throw Error('Downloaded object size mismatch. Keep the application unchanged and retry the backup.')
 const hash=createHash('sha256');for await(const chunk of createReadStream(path))hash.update(chunk);object.backup_sha256=hash.digest('hex')
}
await writeFile(join(dir,'media.json'),JSON.stringify(objects,null,2),{mode:0o600})
console.log(`Saved D1 and ${objects.length} size-checked originals with SHA-256 checksums. Treat database.sql as sensitive.`)
