import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const root=new URL('../',import.meta.url);
const html=readFileSync(new URL('index.html',root),'utf8');
const app=readFileSync(new URL('src/app.mjs',root),'utf8');
test('read-only history controls are wired to one accessible UI panel',()=>{
 for(const id of ['baseline-file','compare-historical','comparison-summary','comparison-changes','download-comparison']){
  assert.equal((html.match(new RegExp('id="'+id+'"','g'))||[]).length,1,id);
  assert.ok(app.includes("'"+id+"'"),id+' is accessed by the module');
 }
 assert.match(html,/type="file" accept="\.json,application\/json"/);
 assert.match(html,/LOCAL FILE · NO UPLOAD/);
});
test('imported JSON is compared locally and never sent to a server',()=>{
 assert.match(app,/JSON\.parse\(await file\.text\(\)\)/);
 assert.match(app,/compareSnapshots\(baseline,latest\)/);
 assert.doesNotMatch(app,/fetch\(|sendBeacon\(|XMLHttpRequest|eth_sendRawTransaction|window\.ethereum|personal_sign/);
 assert.match(app,/textContent=item\.label/);
});
test('refresh invalidates stale evidence on error and when file changes',()=>{
 assert.match(app,/latest=null;[\s\S]*?clearComparison\('Live refresh failed/);
 assert.match(app,/el\('baseline-file'\)\.addEventListener\('change'/);
});
test('README and package manifest agree on open-source rights',()=>{
 const pkg=JSON.parse(readFileSync(new URL('package.json',root),'utf8'));
 assert.equal(pkg.license,'MIT');
 assert.match(readFileSync(new URL('LICENSE',root),'utf8'),/MIT License/);
});
