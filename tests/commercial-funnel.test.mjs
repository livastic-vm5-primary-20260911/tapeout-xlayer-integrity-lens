import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const homepage=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const commercial=readFileSync(new URL('../commercial.html',import.meta.url),'utf8');
const readme=readFileSync(new URL('../README.md',import.meta.url),'utf8');
const sample='https://vm5-openapi-x402.onrender.com/v1/tapeout-cpu0-sample';
const paid='https://vm5-openapi-x402.onrender.com/v1/tapeout-cpu0-report';

test('human free browser product and no-charge agent sample are not described as paid checkout',()=>{
 assert.match(homepage,/<button class="primary" id="refresh"/);
 assert.ok(homepage.includes('href="'+sample+'"'));
 assert.match(homepage,/Free agent API preview · no payment/);
 assert.match(readme,/browser explorer is entirely free/);
});

test('paid machine endpoint actually linked from original public homepage and differentiates HTTP 402',()=>{
 assert.ok(homepage.includes('href="'+paid+'"'));
 assert.match(homepage,/Paid agent API · 0\.005 Base USDC \(HTTP 402\)/);
 assert.ok(homepage.indexOf('href="'+sample+'"')<homepage.indexOf('href="'+paid+'"'));
});

test('buyer-facing commercial page shows separate free sample, paid API and human $49 only with agreement',()=>{
 assert.ok(commercial.includes('href="'+sample+'"'));
 assert.ok(commercial.includes('href="'+paid+'"'));
 assert.match(commercial,/Paid machine API · HTTP 402/);
 assert.match(commercial,/No independent buyer sale of this new endpoint has been confirmed/);
 assert.match(commercial,/only after written scope and terms/);
});

test('business model is factual: live microcheckout, no signed customer or recurring subscription',()=>{
 assert.match(readme,/0\.005 native Circle Base USDC per GET/);
 assert.ok(readme.includes('no live custom human-report checkout'));
 assert.match(readme,/No independent paying customer, signed service order, prize award or realized revenue/);
 assert.ok(!readme.includes('None are implemented as a paid checkout in this free prototype'));
});
