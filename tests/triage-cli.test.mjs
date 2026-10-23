import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
const script=new URL('../scripts/review-evidence.mjs',import.meta.url).pathname;
const early=new URL('../evidence/tapeout-cpu0-block73915245.json',import.meta.url).pathname;
const late=new URL('../evidence/tapeout-cpu0-block73947001.json',import.meta.url).pathname;
const run=(a,b)=>spawnSync(process.execPath,[script,a,b],{encoding:'utf8',timeout:8000});

test('CLI reads only two pinned local snapshots and emits zero-wallet audit checklist',()=>{
 const p=run(early,late);
 assert.equal(p.status,0,p.stderr);
 const j=JSON.parse(p.stdout);
 assert.equal(j.changedCount,2);
 assert.equal(j.network,'eip155:196');
 assert.equal(j.counts.control,1);
 assert.equal(j.counts.activity,1);
 assert.equal(j.priorities.length,2);
 assert.match(j.provenance,/NOT independently authenticated/);
});
test('CLI refuses reverse ordering and invalid JSON without producing false output',()=>{
 let p=run(late,early);
 assert.equal(p.status,1);
 assert.equal(p.stdout,'');
 assert.match(p.stderr,/Reference block must predate live block/);
 const dir=mkdtempSync(join(tmpdir(),'tapeout-triage-test-'));
 try{
  const path=join(dir,'invalid.json');writeFileSync(path,'{not-json');
  p=run(path,late);assert.equal(p.status,1);assert.equal(p.stdout,'');
  assert.match(p.stderr,/Refused/);
 }finally{rmSync(dir,{recursive:true,force:true});}
});
test('CLI fails closed on oversized local file before parsing or upload',()=>{
 const dir=mkdtempSync(join(tmpdir(),'tapeout-triage-limit-'));
 try{
  const path=join(dir,'big.json');writeFileSync(path,' '.repeat(256*1024+1));
  const p=run(path,late);assert.equal(p.status,1);
  assert.equal(p.stdout,'');assert.match(p.stderr,/not exceeding 256 KiB/);
 }finally{rmSync(dir,{recursive:true,force:true});}
});
