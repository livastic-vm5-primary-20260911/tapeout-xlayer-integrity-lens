import fs from 'node:fs/promises';
import path from 'node:path';
import {PublicRpc} from '../src/rpc.mjs';
import {publicJson,diagnostics} from '../src/core.mjs';
const root=new URL('../',import.meta.url);
const index=Number(process.argv[2]||0);
if(!Number.isSafeInteger(index)||index<0)throw Error('Index invalid');
const rpc=new PublicRpc();
const snap=await rpc.snapshot(index);
if(snap.partial)throw Error('Refusing to publish incomplete snapshot: '+snap.errors.join('; '));
const output={
 ...snap,
 diagnostics:diagnostics(snap),
 provenance:{tool:'TapeOut Integrity Lens',network:'X Layer Mainnet',
  chainId:196,reads:'eth_call + eth_getStorageAt at pinned block; no wallet signing',
  limitations:'RPC-provider observations, not independent consensus verification'}
};
const outDir=new URL('../evidence/',import.meta.url);
await fs.mkdir(outDir,{recursive:true});
const filename='tapeout-cpu'+index+'-block'+snap.blockNumber+'.json';
await fs.writeFile(new URL(filename,outDir),publicJson(output)+'\n',{flag:'wx',mode:0o644});
console.log(JSON.stringify({file:path.posix.join('evidence',filename),
 chainId:snap.chainId,block:snap.blockNumber,cpu:snap.processor?.index,
 sealed:snap.factory.isSealed,feeBps:snap.market.feeBps,
 totalRpcRequests:rpc.requestCount},null,2));
