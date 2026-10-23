/**
 * Offline review ordering for two same-CPU X Layer TapeOut observations.
 * This is NOT exploit detection, verification of imported files, or a risk score.
 * It never connects to a wallet, signs, submits, or requests paid endpoints.
 */
import {COMPARISON_SCHEMA,COMPARISON_FIELD_IDS} from './compare.mjs';

export const TRIAGE_SCHEMA='TapeOutXLayerRiskLens/change-review-v1';
const CONTROL=['factory.owner','factory.implementation','factory.isSealed',
  'market.owner','market.implementation','market.isSealed'];
const IDENTITY=['processor.circuits','processor.transistors'];
const ECONOMICS=['factory.deployFee','factory.protocolFee','market.feeBps',
  'processor.tapeoutFee','processor.mintPrice','processor.protocolFee','processor.supplyCap'];
const ACTIVITY=['factory.cpuCount','market.nextListingId','processor.creator',
  'processor.nextId','processor.minted'];
const ALL=[...IDENTITY,...CONTROL,...ECONOMICS,...ACTIVITY];
export const REVIEW_FIELD_COUNT=20;
if(new Set(ALL).size!==REVIEW_FIELD_COUNT ||
  ALL.length!==COMPARISON_FIELD_IDS.length ||
  !COMPARISON_FIELD_IDS.every(key=>ALL.includes(key)))
 throw new Error('Review classification must cover the exact 20 comparison fields');
const GROUPS=Object.freeze({
  identity:{rank:1,title:'Processor identity — re-establish baseline',kind:'identity',
    guidance:'A processor contract identity changed. Verify the indexed CPU contract before comparing its dependent metrics.'},
  control:{rank:2,title:'Owner / proxy / sealing — review authority',kind:'control',
    guidance:'The observed authority, proxy implementation or sealing flag changed. Independently verify who controls it and when it changed.'},
  economics:{rank:3,title:'Fees / limits — recalculate economics',kind:'economics',
    guidance:'An on-chain fee, price, or cap moved. Update fee assumptions and independently verify the documented terms.'},
  activity:{rank:4,title:'Counters / observations — track activity',kind:'activity',
    guidance:'The recorded counter or identity value changed. This alone does not imply a security issue.'}
});
const groupOf=field=>IDENTITY.includes(field)?'identity':CONTROL.includes(field)?'control':
  ECONOMICS.includes(field)?'economics':ACTIVITY.includes(field)?'activity':null;
const isUnsigned=x=>typeof x==='string' && /^(0|[1-9][0-9]*)$/.test(x) &&
  (BigInt(x)<(1n<<256n));
const isAddress=x=>typeof x==='string' && /^0x[0-9a-f]{40}$/.test(x);
const isBool=x=>x==='true'||x==='false';
const assertUnsigned=(x,name)=>{if(!isUnsigned(x))throw new Error('Invalid '+name);return BigInt(x);};
function validateDifference(row){
 if(!row || typeof row!=='object'||Array.isArray(row))throw new Error('Invalid difference');
 const field=row.field;
 if(typeof field!=='string'||!ALL.includes(field))throw new Error('Unrecognized on-chain field');
 if(typeof row.label!=='string'||row.label.length<1||row.label.length>160)throw new Error('Invalid difference label');
 const type=CONTROL.includes(field)&&field.endsWith('.isSealed')?'bool':
  (IDENTITY.includes(field)||field.endsWith('.owner')||field.endsWith('.implementation')||field==='processor.creator')?'address':'uint';
 if(![row.before,row.after].every(x=>type==='bool'?isBool(x):type==='address'?isAddress(x):isUnsigned(x)))
  throw new Error('Malformed on-chain value: '+field);
 if(row.before===row.after)throw new Error('Unchanged field in changed-only comparison');
 const delta=type==='uint'?(BigInt(row.after)-BigInt(row.before)).toString():null;
 return {...row,group:groupOf(field),reviewOrder:GROUPS[groupOf(field)].rank,deltaAtomic:delta};
}
/**
 * Accept only output compatible with strict compareSnapshots(), not untrusted JSON
 * that claims to be a certificate or security finding. Caller is responsible
 * for generating the diff from two checked local/public observations.
 */
export function triageComparison(comparison){
 if(!comparison||typeof comparison!=='object'||Array.isArray(comparison)||
   comparison.schema!==COMPARISON_SCHEMA||comparison.network!=='eip155:196')
   throw new Error('Unsupported comparison evidence');
 if(comparison.fieldsCompared!==REVIEW_FIELD_COUNT||!Array.isArray(comparison.changes)||
   comparison.changes.length>REVIEW_FIELD_COUNT||
   comparison.unchangedCount!==REVIEW_FIELD_COUNT-comparison.changes.length)
   throw new Error('Inconsistent comparison field coverage');
 const from=assertUnsigned(comparison.baselineBlock,'baseline block');
 const to=assertUnsigned(comparison.liveBlock,'later block');
 if(from===0n||from>=to)throw new Error('Blocks must be increasing');
 assertUnsigned(comparison.cpuIndex,'CPU index');
 const seen=new Set();
 const findings=comparison.changes.map(row=>{
  const finding=validateDifference(row);
  if(seen.has(finding.field))throw new Error('Duplicate difference field');
  seen.add(finding.field);
  return finding;
 }).sort((a,b)=>a.reviewOrder-b.reviewOrder||ALL.indexOf(a.field)-ALL.indexOf(b.field));
 if(comparison.cpuIdentityChanged!==findings.some(x=>x.group==='identity'))
  throw new Error('Processor identity flag contradicts differences');
 const counts={identity:0,control:0,economics:0,activity:0};
 for(const item of findings)counts[item.group]++;
 const priorities=Object.entries(GROUPS).filter(([key])=>counts[key]>0).map(([key,val])=>({
  group:key,count:counts[key],title:val.title,guidance:val.guidance
 }));
 return {
  schema:TRIAGE_SCHEMA,network:'eip155:196',cpuIndex:comparison.cpuIndex,
  baselineBlock:comparison.baselineBlock,liveBlock:comparison.liveBlock,
  fieldsCompared:REVIEW_FIELD_COUNT,changedCount:findings.length,
  counts,priorities,findings,
  provenance:'Deterministic review ordering of client-supplied (NOT independently authenticated) before/after X Layer values. Not a security finding, verified transaction, security score, audit, or on-chain attestation.'
 };
}
