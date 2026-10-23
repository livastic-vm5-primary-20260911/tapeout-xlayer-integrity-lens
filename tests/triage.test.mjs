import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {compareSnapshots,COMPARISON_FIELD_IDS} from '../src/compare.mjs';
import {triageComparison,TRIAGE_SCHEMA,REVIEW_FIELD_COUNT} from '../src/triage.mjs';
const baseline=JSON.parse(readFileSync(new URL('../evidence/tapeout-cpu0-block73915245.json',import.meta.url),'utf8'));
const observed=JSON.parse(readFileSync(new URL('../evidence/tapeout-cpu0-block73947001.json',import.meta.url),'utf8'));
const clone=x=>structuredClone(x);
const next=()=>{const x=clone(baseline);x.blockNumber=(BigInt(baseline.blockNumber)+1n).toString();return x};
const forgedDiff=()=>compareSnapshots(baseline,next());

test('classification covers all 20 actual comparator field IDs, no silent field gap',()=>{
 assert.equal(REVIEW_FIELD_COUNT,20);
 const x=next();
 for(const [entity,key] of COMPARISON_FIELD_IDS.map(z=>z.split('.'))){
  const old=x[entity][key];
  x[entity][key]=typeof old==='boolean'?!old:typeof old==='number'?old+1:
    typeof old==='string'&&old.startsWith('0x')?'0x'+'a'.repeat(40):String(BigInt(old)+1n);
 }
 const review=triageComparison(compareSnapshots(baseline,x));
 assert.equal(review.findings.length,20);
 assert.equal(Object.values(review.counts).reduce((sum,n)=>sum+n,0),20);
 assert.equal(new Set(review.findings.map(z=>z.field)).size,20);
});
test('real two pinned public snapshots preserve exact truth: factory count and proxy only',()=>{
 const r=triageComparison(compareSnapshots(baseline,observed));
 assert.equal(r.schema,TRIAGE_SCHEMA);
 assert.equal(r.network,'eip155:196');
 assert.equal(r.baselineBlock,'73915245');
 assert.equal(r.liveBlock,'73947001');
 assert.equal(r.changedCount,2);
 assert.deepEqual(r.counts,{identity:0,control:1,economics:0,activity:1});
 assert.deepEqual(r.findings.map(x=>x.field),['factory.implementation','factory.cpuCount']);
 assert.equal(r.findings[1].deltaAtomic,'1');
 assert.equal(r.findings[0].deltaAtomic,null);
 assert.match(r.provenance,/NOT independently authenticated/);
});
test('same values across strictly increasing blocks is not represented as a safety guarantee',()=>{
 const r=triageComparison(forgedDiff());
 assert.equal(r.changedCount,0);
 assert.equal(r.priorities.length,0);
 assert.match(r.provenance,/not a security finding/i);
});
test('contract identity change is highest review priority, followed by governance, fees, counters',()=>{
 const x=next();
 x.processor.circuits='0x'+'a'.repeat(40);
 x.factory.owner='0x'+'b'.repeat(40);
 x.factory.deployFee=(BigInt(x.factory.deployFee)+7n).toString();
 x.market.nextListingId=(BigInt(x.market.nextListingId)+1n).toString();
 const r=triageComparison(compareSnapshots(baseline,x));
 assert.deepEqual(r.priorities.map(v=>v.group),['identity','control','economics','activity']);
 assert.deepEqual(r.findings.map(v=>v.reviewOrder),[1,2,3,4]);
 assert.equal(r.counts.identity,1);
 assert.match(r.priorities[0].guidance,/verify the indexed CPU/i);
});
test('fee deltas retain uint256 exactness even above JS safe integer',()=>{
 const x=next();
 const v=((1n<<255n)+123456n).toString();
 x.processor.mintPrice=v;
 const r=triageComparison(compareSnapshots(baseline,x));
 assert.equal(r.findings[0].deltaAtomic,(BigInt(v)-BigInt(baseline.processor.mintPrice)).toString());
});
test('negative fees keep signed delta in human-readable atomic units',()=>{
 const x=next();x.factory.deployFee=(BigInt(x.factory.deployFee)-1n).toString();
 const r=triageComparison(compareSnapshots(baseline,x));
 assert.equal(r.findings[0].deltaAtomic,'-1');
 assert.equal(r.findings[0].group,'economics');
});
test('unknown or tampered external field never gets silently categorized',()=>{
 const x=forgedDiff();x.changes=[{field:'wallet.seed',label:'seed',before:'0',after:'1'}];x.unchangedCount=19;
 assert.throws(()=>triageComparison(x),/Unrecognized on-chain field/);
});
test('duplicate differences, fabricated changedCount, inconsistent identity flag fail closed',()=>{
 const x=next();x.factory.cpuCount=(BigInt(x.factory.cpuCount)+1n).toString();
 const d=compareSnapshots(baseline,x);
 const doubled=clone(d);doubled.changes.push(clone(doubled.changes[0]));doubled.unchangedCount=18;
 assert.throws(()=>triageComparison(doubled),/Duplicate difference field/);
 const mismatched=clone(d);mismatched.fieldsCompared=19;
 assert.throws(()=>triageComparison(mismatched),/Inconsistent comparison field coverage/);
 const flag=clone(d);flag.cpuIdentityChanged=true;
 assert.throws(()=>triageComparison(flag),/contradicts differences/);
});
test('invalid evidence format or network is refused',()=>{
 for(const key of ['schema','network']){
  const x=forgedDiff();x[key]='fake';
  assert.throws(()=>triageComparison(x),/Unsupported comparison evidence/);
 }
});
test('backward and invalid block numbers cannot be graded',()=>{
 for(const value of ['0','-1','1.5','1e9','999999999999999999999999999999999999999999']){
  const x=forgedDiff();x.baselineBlock=value;
  if(value.startsWith('99999'))assert.throws(()=>triageComparison(x),/Blocks must be increasing/);
  else if(value==='0')assert.throws(()=>triageComparison(x),/Blocks must be increasing/);
  else assert.throws(()=>triageComparison(x),/Invalid baseline block/);
 }
});
test('noncanonical values, unexpected booleans or forged address changes refused',()=>{
 const newer=next();newer.factory.isSealed=!newer.factory.isSealed;
 const diff=compareSnapshots(baseline,newer);
 for(const invalid of ['True','yes',true,'0']){
  const x=clone(diff);x.changes[0].after=invalid;
  assert.throws(()=>triageComparison(x),/Malformed on-chain value/);
 }
 const addr=next();addr.factory.owner='0x'+'a'.repeat(40);
 const ad=compareSnapshots(baseline,addr);ad.changes[0].after='http://bad.example';
 assert.throws(()=>triageComparison(ad),/Malformed on-chain value/);
});
test('unchanged numeric changes and overlong label cannot be smuggled in',()=>{
 const x=next();x.factory.cpuCount=(BigInt(x.factory.cpuCount)+1n).toString();
 const diff=compareSnapshots(baseline,x);
 const same=clone(diff);same.changes[0].after=same.changes[0].before;
 assert.throws(()=>triageComparison(same),/Unchanged field/);
 const label=clone(diff);label.changes[0].label='A'.repeat(1000);
 assert.throws(()=>triageComparison(label),/Invalid difference label/);
});
