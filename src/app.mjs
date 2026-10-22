import {PublicRpc} from './rpc.mjs';
import {decimalUnits,diagnostics,quoteMint,publicJson} from './core.mjs';

const rpc=new PublicRpc();
const el=id=>document.getElementById(id);
let latest=null, busy=false;

function setStatus(kind,message) {
 const pill=el('status-pill');
 pill.className='pill '+kind;
 pill.textContent=kind==='ready'?'LIVE VERIFIED BLOCK':kind==='loading'?'READING CHAIN':kind==='failed'?'READ ERROR':'NOT LOADED';
 el('status-text').textContent=message;
}
function num(x){return x===null||x===undefined?'—':BigInt(x).toLocaleString('en-US');}
function okb(x){return x===null||x===undefined?'—':decimalUnits(x)+' OKB';}
function address(id,value) {
 const dom=el(id);dom.replaceChildren();
 if(!value){dom.textContent='Unavailable';return;}
 if(!/^0x[0-9a-f]{40}$/i.test(value)){dom.textContent='Unverified data';return;}
 const a=document.createElement('a');
 a.href='https://www.okx.com/web3/explorer/xlayer/address/'+value;
 a.target='_blank';a.rel='noopener noreferrer';a.title=value;
 a.textContent=value.slice(0,8)+'…'+value.slice(-6)+' ↗';
 dom.append(a);
}
function seal(id,value){
 const dom=el(id);dom.className='value';
 if(value===null||value===undefined){dom.textContent='Unknown';return;}
 dom.textContent=value?'YES — sealed':'NO — mutable';
 dom.classList.add(value?'good':'bad');
}
function drawCost(){
 const dom=el('mint-total'),tapeout=el('tapeout-total');
 tapeout.textContent=latest?.processor ? okb(latest.processor.tapeoutFee) : '—';
 if(!latest?.processor || latest.processor.mintPrice===null || latest.processor.protocolFee===null){
  dom.textContent='Unavailable';return;
 }
 try{
  const input=el('mint-count'); if(!input.reportValidity())return;
  const quote=quoteMint(input.value,latest.processor.mintPrice,latest.processor.protocolFee);
  dom.textContent=okb(quote.msgValue);
 }catch(e){dom.textContent=e.message;}
}
function draw(snapshot){
 latest=snapshot;
 const f=snapshot.factory,m=snapshot.market,p=snapshot.processor;
 el('cpu-count').textContent=num(f.cpuCount);
 el('deployment-fee').textContent=okb(f.deployFee);
 el('market-fee').textContent=m.feeBps===null?'Unknown':(m.feeBps/100).toFixed(2)+'%';
 el('block-number').textContent=num(snapshot.blockNumber);
 el('sample-time').textContent=new Date(snapshot.timestamp).toLocaleString();
 address('factory-impl',f.implementation);
 address('factory-owner',f.owner);
 seal('factory-sealed',f.isSealed);
 address('market-impl',m.implementation);
 address('market-owner',m.owner);
 seal('market-sealed',m.isSealed);
 el('market-listings').textContent=num(m.nextListingId);
 for(const [id,value] of [
   ['processor-circuits',p?.circuits],['processor-transistors',p?.transistors],
   ['processor-creator',p?.creator]
 ])address(id,value);
 el('processor-circuits-count').textContent=p?num(p.nextId):'—';
 el('processor-supply').textContent=p?(num(p.minted)+' / '+num(p.supplyCap)):'—';
 el('processor-price').textContent=p?okb(p.mintPrice):'—';
 el('processor-tapeout').textContent=p?okb(p.tapeoutFee):'—';
 const list=el('diagnostics');list.replaceChildren();
 for(const d of diagnostics(snapshot)){
  const li=document.createElement('li');
  li.className='diagnostic '+d.level;
  li.textContent=d.note;
  list.append(li);
 }
 drawCost();
 el('download-json').disabled=false;
 el('download-csv').disabled=false;
 setStatus(snapshot.partial?'failed':'ready',
   (snapshot.partial?'Partial read; some values missing. ':'Complete pinned snapshot. ') +
    'Chain '+snapshot.chainId+' · block '+num(snapshot.blockNumber)+' · '+rpc.requestCount+' read-only RPC calls.');
}
async function refresh(){
 if(busy)return;
 const input=el('cpu-index');
 if(!input.reportValidity())return;
 const index=Number(input.value);
 if(!Number.isSafeInteger(index)||index<0){setStatus('failed','CPU index must be a nonnegative safe integer.');return;}
 busy=true;el('refresh').disabled=true;
 setStatus('loading','Fetching from official public X Layer RPC. No wallet connection.');
 try{ const snap=await rpc.snapshot(index); draw(snap); }
 catch(e){setStatus('failed',String(e.message));}
 finally{busy=false;el('refresh').disabled=false;}
}
function download(name,contents,type){
 const blob=new Blob([contents],{type});
 const url=URL.createObjectURL(blob);
 const a=document.createElement('a');
 a.download=name;a.href=url;
 document.body.append(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function csv(v){
 const rows=[['chainId','block','entity','field','value','address']];
 for(const entity of ['factory','market','processor']){
  const obj=v[entity];if(!obj)continue;
  const address=obj.address||obj.circuits||'';
  for(const [field,value] of Object.entries(obj)){
   if(field==='address'||field==='circuits')continue;
   rows.push([v.chainId,v.blockNumber,entity,field,value===null?'UNKNOWN':String(value),address]);
  }
 }
 return rows.map(row=>row.map(value=>'"'+String(value).replaceAll('"','""')+'"').join(',')).join('\r\n')+'\r\n';
}
el('refresh').addEventListener('click',refresh);
el('selector-form').addEventListener('submit',e=>{e.preventDefault();refresh();});
el('quote-form').addEventListener('submit',e=>{e.preventDefault();drawCost();});
el('download-json').addEventListener('click',()=>{if(latest)download('tapeout-xlayer-evidence-block-'+latest.blockNumber+'.json',publicJson(latest)+'\n','application/json');});
el('download-csv').addEventListener('click',()=>{if(latest)download('tapeout-xlayer-evidence-block-'+latest.blockNumber+'.csv',csv(latest),'text/csv;charset=utf-8');});
refresh();
