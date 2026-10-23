import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {compareSnapshots,COMPARISON_SCHEMA} from '../src/compare.mjs';
const source=JSON.parse(readFileSync(new URL('../evidence/tapeout-cpu0-block73915245.json',import.meta.url),'utf8'));
const clone=()=>structuredClone(source);
const future=(additional=100)=>{const x=clone();x.blockNumber=String(BigInt(x.blockNumber)+BigInt(additional));return x};
test('same CPU and whitelisted equal values: no invented changes',()=>{
 const diff=compareSnapshots(clone(),future());
 assert.equal(diff.schema,COMPARISON_SCHEMA);
 assert.equal(diff.network,'eip155:196');
 assert.equal(diff.cpuIndex,'0');
 assert.equal(diff.changes.length,0);
 assert.equal(diff.unchangedCount,diff.fieldsCompared);
 assert.equal(diff.cpuIdentityChanged,false);
});
test('fee, proxy and account differences are exact and recognizable',()=>{
 const newer=future();
 newer.factory.deployFee='7700000000000000';
 newer.factory.implementation='0x'+'a'.repeat(40);
 newer.factory.owner='0x'+'b'.repeat(40);
 newer.market.isSealed=true;
 const d=compareSnapshots(source,newer);
 assert.deepEqual(d.changes.map(x=>x.field),['factory.deployFee','factory.owner','factory.implementation','market.isSealed']);
 assert.equal(d.changes[0].before,'6600000000000000');
 assert.equal(d.changes[0].after,'7700000000000000');
});
test('address case difference does not look like an on-chain ownership change',()=>{
 const x=future();x.factory.owner=x.factory.owner.toUpperCase().replace('0X','0x');
 assert.equal(compareSnapshots(source,x).changes.length,0);
});
test('changing CPU contract is identified, not silently compared as same identity',()=>{
 const x=future();x.processor.circuits='0x'+'c'.repeat(40);
 assert.equal(compareSnapshots(source,x).cpuIdentityChanged,true);
 assert.equal(compareSnapshots(source,x).changes[0].field,'processor.circuits');
});
test('wrong chain is refused even if values otherwise look normal',()=>{
 const x=future();x.chainId=8453;
 assert.throws(()=>compareSnapshots(source,x),/wrong network/);
});
test('wrong factory and market are refused before presenting differences',()=>{
 for(const path of ['factory','market']){
   const x=future();x[path].address='0x'+'9'.repeat(40);
   assert.throws(()=>compareSnapshots(source,x),/wrong TapeOut/);
 }
});
test('partial or failed RPC snapshots are refused, never shown as unchanged',()=>{
 for(const scenario of ['partial','errors']){
  const x=future();
  if(scenario==='partial')x.partial=true;
  else x.errors=['eth_call failed'];
  assert.throws(()=>compareSnapshots(source,x),/incomplete or failed/);
 }
});
test('missing on-chain value in either input is rejected',()=>{
 for(const value of [null,undefined,'UNKNOWN','1e3',-1]){
  const x=future();x.factory.deployFee=value;
  assert.throws(()=>compareSnapshots(source,x),/Missing or invalid/);
 }
});
test('invalid processor or schema rejected; no dynamic key traversal',()=>{
 const x=future();x.processor.index='1';
 assert.throws(()=>compareSnapshots(source,x),/CPU index differs/);
 const y=future();y.schema='AttackerControlled';
 assert.throws(()=>compareSnapshots(source,y),/unsupported evidence schema/);
});
test('same block, backward history and malformed block are refused',()=>{
 for(const value of [source.blockNumber,String(Number(source.blockNumber)-1),'10.2','-1','']){
  const x=future();x.blockNumber=value;
  assert.throws(()=>compareSnapshots(source,x),/predate|invalid/);
 }
});
test('numeric string zero-padding cannot invent changes or hide integer differences',()=>{
 const x=future();x.factory.cpuCount='0387';
 assert.throws(()=>compareSnapshots(source,x),/invalid factory.cpuCount/);
});
test('large correct uint256 values retain exact decimal digits',()=>{
 const x=future();x.processor.minted=((1n<<255n)+12345n).toString();
 const diff=compareSnapshots(source,x);
 assert.equal(diff.changes.find(z=>z.field==='processor.minted').after,x.processor.minted);
});
