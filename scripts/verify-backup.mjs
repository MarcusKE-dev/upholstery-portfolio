import {readFile,stat} from 'node:fs/promises'
import {createReadStream} from 'node:fs'
import {createHash} from 'node:crypto'
import {resolve,join} from 'node:path'
const dir=resolve(process.argv[2]||'backups')
const objects=JSON.parse(await readFile(join(dir,'media.json'),'utf8'))
for(const object of objects){
 if(!/^uploads\/[a-f0-9-]+\.[a-z0-9]+$/.test(object.object_key))throw Error('Invalid media key in manifest.')
 const file=join(dir,'media',object.object_key);if((await stat(file)).size!==object.size)throw Error('File size mismatch.')
 const hash=createHash('sha256');for await(const chunk of createReadStream(file))hash.update(chunk)
 if(hash.digest('hex')!==object.backup_sha256)throw Error('File checksum mismatch.')
}
console.log(`Verified ${objects.length} backup objects.`)
