import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const origin = 'https://livastic-vm5-primary-20260911.github.io/tapeout-xlayer-integrity-lens/';
const html = readFileSync(new URL('../index.html', import.meta.url),'utf8');
const custom = readFileSync(new URL('../commercial.html',import.meta.url),'utf8');
const sitemap = readFileSync(new URL('../sitemap.xml',import.meta.url),'utf8');
const poster = readFileSync(new URL('../demo/poster.png',import.meta.url));

test('canonical and share cards are unique, direct links to the actual owner site',()=>{
 for(const [content,url] of [[html,origin],[custom,origin+'commercial.html']]){
  assert.ok(content.includes('rel="canonical" href="'+url+'"'));
  assert.ok(content.includes('property="og:url" content="'+url+'"'));
  assert.ok(content.includes('property="og:image" content="'+origin+'demo/poster.png"'));
  assert.ok(content.includes('name="twitter:card" content="summary_large_image"'));
  assert.equal((content.match(/rel="canonical"/g)||[]).length,1);
  assert.equal((content.match(/property="og:url"/g)||[]).length,1);
 }
});
test('used open graph poster is a real 1360x815 PNG already in the deployed project',()=>{
 assert.equal(poster.toString('hex',0,8),'89504e470d0a1a0a');
 assert.equal(poster.readUInt32BE(16),1360);
 assert.equal(poster.readUInt32BE(20),815);
});
test('structured metadata prices the FREE app, not the separate paid x402 API',()=>{
 const m=html.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/);
 assert.ok(m);
 const app=JSON.parse(m[1]);
 assert.equal(app['@type'],'SoftwareApplication');
 assert.equal(app.offers.price,'0');
 assert.equal(app.offers.priceCurrency,'USD');
 assert.equal(app.isAccessibleForFree,true);
 assert.equal(app.url,origin);
 assert.ok(!JSON.stringify(app).includes('0.005'));
 assert.ok(!JSON.stringify(app).includes('50,000'));
});
test('sitemap contains only existing indexable webpages, not chargeable 402 routes',()=>{
 const locs=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
 assert.deepEqual(locs,[origin,origin+'commercial.html']);
 assert.ok(!sitemap.includes('vm5-openapi-x402.onrender.com'));
 assert.ok(!sitemap.includes('payapi.market'));
 assert.match(sitemap,/xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9"/);
});
test('original consent-based buyer journey retained unchanged',()=>{
 const free='https://vm5-openapi-x402.onrender.com/v1/tapeout-cpu0-sample';
 const paid='https://vm5-openapi-x402.onrender.com/v1/tapeout-cpu0-report';
 const market='https://payapi.market/api/tapeout-x-layer-cpu0-on-chain-integrity-report';
 assert.ok(html.includes(free));
 assert.ok(html.includes(market));
 assert.ok(custom.includes(free));
 assert.ok(custom.includes(paid));
 assert.match(custom,/only after written scope and terms/);
});
