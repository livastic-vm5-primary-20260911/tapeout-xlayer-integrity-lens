import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {compareSnapshots} from '../src/compare.mjs';
const read=p=>JSON.parse(readFileSync(new URL(p,import.meta.url),'utf8'));
test('actual October 2026 pinned-block evidence reproduces exact observed changes',()=>{
 const before=read('../evidence/tapeout-cpu0-block73915245.json');
 const after=read('../evidence/tapeout-cpu0-block73947001.json');
 const exported=read('../evidence/tapeout-compare-73915245-to-73947001.json');
 const measured=compareSnapshots(before,after);
 assert.deepEqual(exported,measured);
 assert.deepEqual(exported.changes.map(x=>x.field),['factory.cpuCount','factory.implementation']);
 assert.equal(exported.changes[0].before,'387');
 assert.equal(exported.changes[0].after,'388');
 assert.equal(after.partial,false);
 assert.equal(after.errors.length,0);
 assert.equal(exported.cpuIdentityChanged,false);
});
