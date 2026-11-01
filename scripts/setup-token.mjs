import {randomBytes} from 'node:crypto'
import {writeFileSync} from 'node:fs'
// Private file output only; never put tokens in shell arguments or public logs.
const file=process.argv[2]
if(!file)throw new Error('Provide a private output path, outside Git.')
writeFileSync(file,randomBytes(32).toString('hex'),{mode:0o600,flag:'wx'})
console.log('Setup token written to the requested private file.')
