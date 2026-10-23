#!/usr/bin/env node
/** Offline, bounded, chain-specific evidence triage. NEVER signs or contacts a network. */
import {readFileSync,statSync} from 'node:fs';
import {compareSnapshots} from '../src/compare.mjs';
import {triageComparison} from '../src/triage.mjs';
import {publicJson} from '../src/core.mjs';
const MAX_BYTES=256*1024;
function readLocalSnapshot(file){
 const st=statSync(file);
 if(!st.isFile()||st.size>MAX_BYTES)throw new Error('Input must be a regular JSON file not exceeding 256 KiB');
 return JSON.parse(readFileSync(file,'utf8'));
}
if(process.argv.length!==4){
 console.error('Usage: node scripts/review-evidence.mjs EARLIER_CPU_SNAPSHOT.json LATER_CPU_SNAPSHOT.json');
 process.exitCode=2;
}else{
 try{
  const from=readLocalSnapshot(process.argv[2]),to=readLocalSnapshot(process.argv[3]);
  process.stdout.write(publicJson(triageComparison(compareSnapshots(from,to)))+'\n');
 }catch(e){
  console.error('Refused incomplete/untrusted comparison: '+(e instanceof Error?e.message:'unreadable evidence'));
  process.exitCode=1;
 }
}
