/**
 * Strict, read-only comparison of two independently exported TapeOut snapshots.
 * Imported files are untrusted client-side documents, never authenticated chain
 * receipts; this module does not read, write, sign, or broadcast transactions.
 */
import {CHAIN_ID,FACTORY,MARKET} from './core.mjs';

const FIELDS=Object.freeze([
  ['factory.cpuCount','Registered processor count','uint'],
  ['factory.deployFee','Factory CPU creation fee (wei)','uint'],
  ['factory.protocolFee','Factory protocol fee (wei)','uint'],
  ['factory.isSealed','Factory sealing flag','bool'],
  ['factory.owner','Factory owner','address'],
  ['factory.implementation','Factory proxy implementation','address'],
  ['market.feeBps','Market fee (basis points)','uint'],
  ['market.isSealed','Market sealing flag','bool'],
  ['market.owner','Market owner','address'],
  ['market.implementation','Market proxy implementation','address'],
  ['market.nextListingId','Next circuit listing ID','uint'],
  ['processor.circuits','Selected CPU circuit contract','address'],
  ['processor.transistors','CPU transistor token','address'],
  ['processor.creator','CPU creator','address'],
  ['processor.nextId','CPU next circuit ID','uint'],
  ['processor.tapeoutFee','CPU tapeout fee (wei)','uint'],
  ['processor.mintPrice','Transistor mint unit price (wei)','uint'],
  ['processor.minted','Transistors minted','uint'],
  ['processor.supplyCap','Transistor supply cap','uint'],
  ['processor.protocolFee','Transistor token protocol fee (wei)','uint']
]);
export const COMPARISON_SCHEMA='TapeOutXLayerRiskLens/comparison-v1';
export const COMPARISON_FIELD_IDS=Object.freeze(FIELDS.map(row=>row[0]));
const assertRecord=(x,name)=>{
  if (!x||typeof x!=='object'||Array.isArray(x)) throw new Error('Invalid '+name+' object');
};
const field=(obj,path)=>{
  const [entity,key]=path.split('.');
  assertRecord(obj[entity],entity);
  return obj[entity][key];
};
const normAddress=x=>{
  if(typeof x!=='string'||!/^0x[0-9a-f]{40}$/i.test(x))throw new Error('Invalid on-chain address');
  return x.toLowerCase();
};
function normalizedValue(v,type,path){
  if(type==='bool'){
    if(typeof v!=='boolean')throw new Error('Missing or invalid '+path);
    return String(v);
  }
  if(type==='address'){
    try{return normAddress(v);}catch{throw new Error('Missing or invalid '+path);}
  }
  if((typeof v!=='string'&&typeof v!=='number'&&typeof v!=='bigint') ||
     !/^(0|[1-9][0-9]*)$/.test(String(v)))throw new Error('Missing or invalid '+path);
  if(typeof v==='number'&&!Number.isSafeInteger(v))throw new Error('Unsafe number: '+path);
  const n=BigInt(v);
  if(n<0n||n>=(1n<<256n))throw new Error('Out-of-range value: '+path);
  return n.toString();
}
function validate(s,name){
  assertRecord(s,name);
  if(s.schema!=='TapeOutXLayerRiskLens/v1')throw new Error(name+': unsupported evidence schema');
  if(s.chainId!==Number(CHAIN_ID))throw new Error(name+': wrong network; expected X Layer 196');
  if(s.partial!==false||!Array.isArray(s.errors)||s.errors.length!==0)throw new Error(name+': incomplete or failed snapshot');
  if(normAddress(s.factory?.address)!==normAddress(FACTORY)||
     normAddress(s.market?.address)!==normAddress(MARKET))
    throw new Error(name+': wrong TapeOut factory/market');
  assertRecord(s.processor,name+' processor');
  const index=normalizedValue(s.processor.index,'uint','processor.index');
  const block=normalizedValue(s.blockNumber,'uint','blockNumber');
  if(BigInt(block)<=0n)throw new Error(name+': block must be positive');
  const values=new Map();
  for(const [path,,type] of FIELDS){
    values.set(path,normalizedValue(field(s,path),type,path));
  }
  return {block,index,values};
}
export function compareSnapshots(before,after){
  const a=validate(before,'Reference');
  const b=validate(after,'Live');
  if(a.index!==b.index)throw new Error('CPU index differs; select the same processor in both snapshots');
  if(BigInt(a.block)>=BigInt(b.block))throw new Error('Reference block must predate live block');
  const changes=[];
  for(const [path,label] of FIELDS){
    const old=a.values.get(path),current=b.values.get(path);
    if(old!==current)changes.push({field:path,label,before:old,after:current});
  }
  return {
    schema:COMPARISON_SCHEMA,network:'eip155:196',cpuIndex:a.index,
    baselineBlock:a.block,liveBlock:b.block,fieldsCompared:FIELDS.length,
    changes,unchangedCount:FIELDS.length-changes.length,
    cpuIdentityChanged:changes.some(x=>['processor.circuits','processor.transistors'].includes(x.field)),
    provenance:'Comparison of one client-imported, unverified JSON reference and one public-RPC latest view. NOT a chain-proof, security audit, oracle, or contract endorsement.'
  };
}
