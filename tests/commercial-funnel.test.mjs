import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const homepage=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const commercial=readFileSync(new URL('../commercial.html',import.meta.url),'utf8');
const readme=readFileSync(new URL('../README.md',import.meta.url),'utf8');
const sample='https://vm5-openapi-x402.onrender.com/v1/tapeout-cpu0-sample';
const paid='https://vm5-openapi-x402.onrender.com/v1/tapeout-cpu0-report';
const market='https://payapi.market/api/tapeout-x-layer-cpu0-on-chain-integrity-report';

test('human free browser product and no-charge agent sample are not described as paid checkout',()=>{
 assert.match(homepage,/<button class="primary" id="refresh"/);
 assert.ok(homepage.includes('href="'+sample+'"'));
 assert.match(homepage,/Free agent API preview · no payment/);
 assert.match(readme,/browser explorer is entirely free/);
});

test('buyer can open the verified marketplace while the raw paid endpoint remains available',()=>{
 assert.ok(homepage.includes('href="'+market+'"'));
 assert.match(homepage,/Buy via verified marketplace · 0\.005 Base USDC/);
 assert.ok(commercial.includes('href="'+paid+'"'));
 assert.match(commercial,/Paid machine API · HTTP 402/);
 assert.ok(homepage.indexOf('href="'+sample+'"')<homepage.indexOf('href="'+market+'"'));
});

test('buyer-facing commercial page shows separate free sample, paid API and human $49 only with agreement',()=>{
 assert.ok(commercial.includes('href="'+sample+'"'));
 assert.ok(commercial.includes('href="'+paid+'"'));
 assert.match(commercial,/Paid machine API · HTTP 402/);
 assert.match(commercial,/repeat independent buyer demand and a finalized owner-wallet Transfer have not been independently established/);
 assert.match(commercial,/only after written scope and terms/);
});

test('business model is factual: live microcheckout, no signed customer or recurring subscription',()=>{
 assert.match(readme,/0\.005 native Circle Base USDC per GET/);
 assert.ok(readme.includes('no live custom human-report checkout'));
 assert.ok(readme.includes('No independent repeat paying customer, signed service order, grant award or realized fiat revenue'));
 assert.ok(readme.includes('independent finalized beneficiary ERC-20 Transfer confirmation was not available'));
 assert.ok(readme.includes(market));
 assert.ok(!readme.includes('None are implemented as a paid checkout in this free prototype'));
});


test('distinct second TapeOut 0.01 BaseUSDC buyer SKU shows exact free sample, signed-free quote, and unapproved listing honesty',()=>{
 const sample='https://vm5-openapi-x402.onrender.com/v1/tapeout-cpu0-diff-sample';
 const paid='https://vm5-openapi-x402.onrender.com/v1/tapeout-cpu0-diff';
 for(const link of [sample,paid,'https://vm5-openapi-x402.onrender.com/discovery/resources'])
  assert.ok(commercial.includes('href="'+link+'"'),link);
 assert.ok(commercial.indexOf('href="'+sample+'"')<commercial.indexOf('href="'+paid+'"'));
 assert.match(commercial,/0\.01 native Circle Base USDC/);
 assert.match(commercial,/fixed October 23 CPU0 baseline/);
 assert.match(commercial,/receipt\/badge remains pending/);
 assert.match(commercial,/free in-browser comparison is always available/);
 assert.ok(readme.includes('10,000 atomic'));
 assert.match(readme,/listing is pending review, not live\/paid\/approved yet/);
 assert.ok(readme.includes('No independent outside customer receipt'));
 assert.ok(readme.includes('pre-existing 13 other merchant recipients'));
});

test('agent buyers can verify both independent zero-fee discovery listings without mistaking live probes for income',()=>{
 const agent='https://agent402.tools/api/index?seller=vm5-openapi-x402.onrender.com';
 const check='https://settled.tools/v1/free/check?url=https%3A%2F%2Fvm5-openapi-x402.onrender.com%2Fv1%2Ftapeout-cpu0-diff';
 assert.ok(commercial.includes('href="'+agent+'"'));
 assert.ok(commercial.includes('href="'+check+'"'));
 assert.ok(readme.includes(']('+agent+')'));
 assert.ok(readme.includes(']('+check+')'));
 assert.match(commercial,/normal external router still requires settlement history/);
 assert.match(commercial,/no paid purchase yet/);
 assert.match(readme,/no scout payment delivery confirmed/i);
 assert.match(readme,/PayAPI listing remains under human review/);
 assert.ok(commercial.includes('the free in-browser comparison is always available'));
});
