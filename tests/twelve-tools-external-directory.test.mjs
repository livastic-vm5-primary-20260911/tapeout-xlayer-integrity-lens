import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const css=readFileSync(new URL('../styles.css',import.meta.url),'utf8');
test('One neutral independent backlink on the unique authentic TapeOut homepage',()=>{
 const foot=html.match(/<footer>([\s\S]*?)<\/footer>/);
 assert.ok(foot);
 assert.match(foot[1],/<a href="https:\/\/twelve\.tools\/" target="_blank" rel="noopener noreferrer"/);
 assert.match(foot[1],/aria-label="Twelve Tools independent software directory"/);
 assert.equal((html.match(/https:\/\/twelve\.tools\//g)||[]).length,1);
 assert.match(foot[1],/No approvals · No seed phrase · No gas · No wallet connection/);
 assert.match(css,/footer a\[href=/);
});
test('The directory link does not substitute a paid merchant, modify contract addresses or claim sponsorship',()=>{
 assert.match(html,/href="\.\/commercial\.html"/);
 assert.doesNotMatch(html,/official partnership with Twelve Tools|paid by Twelve Tools/i);
 assert.doesNotMatch(html,/eth_sendTransaction|window\.ethereum\.request/);
});
