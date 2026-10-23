import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const page = readFileSync(new URL('../commercial.html', import.meta.url), 'utf8');

test('independent third-party seller search deep-links to the exact neutral, external TapeOut result', () => {
 assert.ok(page.includes('https://agent402.tools/api/route?q=tapeout&amp;include=external'));
 assert.ok(page.includes('https://agent402.tools/guides/smart-order-router'));
 assert.ok(page.includes('0.005 Base USDC'));
 assert.ok(page.includes('$0.01 per-call cap'));
});
test('third-party routing is not misrepresented as paid buyer traffic, guaranteed placement or an audit', () => {
 assert.ok(page.includes('after proven matches'));
 assert.ok(page.includes('not</strong> a customer, prepayment, first sale'));
 assert.ok(page.includes('The buyer, not our seller, chooses and authorizes'));
 assert.ok(page.includes('No self-funding or artificial settlement history'));
 assert.ok(!page.includes('Agent402 already paid us'));
});
test('original separate free sample, native wallet paid API and $49 quote remain independent',()=>{
 assert.ok(page.includes('https://vm5-openapi-x402.onrender.com/v1/tapeout-cpu0-sample'));
 assert.ok(page.includes('https://vm5-openapi-x402.onrender.com/v1/tapeout-cpu0-report'));
 assert.ok(page.includes('only after written scope and terms'));
 assert.ok(page.includes('0.005 native Circle Base USDC'));
});
