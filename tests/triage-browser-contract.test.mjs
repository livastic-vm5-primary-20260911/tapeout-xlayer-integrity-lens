import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const js=readFileSync(new URL('../src/app.mjs',import.meta.url),'utf8');
const css=readFileSync(new URL('../styles.css',import.meta.url),'utf8');

test('live history review UI exports machine-readable data only after valid comparison',()=>{
 for(const id of ['review-heading','review-summary','review-priorities','download-review'])
  assert.match(html,new RegExp('id="'+id+'"'));
 assert.match(html,/download-review"[^>]+disabled/);
 assert.match(js,/reviewed=triageComparison\(diff\)/);
 assert.match(js,/el\('download-review'\).disabled=false/);
 assert.match(js,/el\('download-review'\).disabled=true/);
 assert.match(js,/publicJson\(reviewed\)/);
});
test('no risk score, wallet connector, payment or unsafe imported-HTML rendering in triage UI',()=>{
 assert.match(js,/not a security verdict/i);
 assert.match(html,/A missing change does/i);
 assert.match(html,/establish safety/i);
 assert.match(js,/row.textContent=finding.label/);
 assert.doesNotMatch(js,/innerHTML|wallet_requestPermissions|eth_sendTransaction|sendTransaction\(/i);
 assert.doesNotMatch(css,/@import|url\(https?:/);
});
