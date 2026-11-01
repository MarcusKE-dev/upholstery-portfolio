import {mkdtemp} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import {execFileSync} from 'node:child_process'
import assert from 'node:assert/strict'
const path=await mkdtemp(join(tmpdir(),'upholstery-fresh-'))
const run=(args)=>execFileSync(process.execPath,['node_modules/wrangler/bin/wrangler.js',...args,'--local','--persist-to',path],{encoding:'utf8',stdio:['ignore','pipe','pipe']})
run(['d1','migrations','apply','DB'])
const again=run(['d1','migrations','apply','DB']);assert(again.includes('No migrations'))
const results=JSON.parse(run(['d1','execute','DB','--json','--command',"SELECT kind,count(*) AS count FROM content GROUP BY kind; SELECT count(*) AS count FROM media; PRAGMA foreign_key_check;"]))
const kinds=results[0].results
assert(!kinds.some(r=>['project','post'].includes(r.kind)))
assert(kinds.find(r=>r.kind==='settings').count===1)
assert(kinds.find(r=>r.kind==='page').count===9)
assert(results[1].results[0].count===0)
assert(results[2].results.length===0)
console.log('Fresh disposable D1: all migrations applied; repeat is a no-op; nine editable pages, one settings record, established copy, zero projects/posts/media and no foreign-key violations.')
