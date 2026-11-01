import {existsSync,writeFileSync} from 'node:fs'
import {randomBytes} from 'node:crypto'
import {spawnSync} from 'node:child_process'
if(!existsSync('.dev.vars'))writeFileSync('.dev.vars',`SITE_URL=https://localhost:8788\nINDEXABLE=false\nADMIN_ENROLLMENT_TOKEN=${randomBytes(32).toString('hex')}\n`,{mode:0o600,flag:'wx'})
const r=spawnSync('npm',['run','db:local'],{stdio:'inherit'});process.exit(r.status??1)
