import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const text=readFileSync(new URL('../commercial.html',import.meta.url),'utf8');
const readme=readFileSync(new URL('../README.md',import.meta.url),'utf8');
const schema=JSON.parse(readFileSync(new URL('../data/tapeout-cpu0-diff-paid-response.schema.json',import.meta.url),'utf8'));
const relative='./data/tapeout-cpu0-diff-paid-response.schema.json';

test('public buyer page and README link the actual published free response contract, never a fake paid fulfillment',()=>{
 assert.ok(text.includes('href="'+relative+'"'));
 assert.ok(readme.includes(']('+relative+')'));
 assert.ok(text.includes('Free exact paid JSON response schema'));
 assert.ok(readme.includes('not a fabricated paid response'));
 assert.ok(readme.includes('may temporarily lag'));
 assert.ok(text.includes('PayAPI was asked to review'));
});
test('self-contained draft 2020-12 schema has exact original paid response wire fields without any wallet secret, proof of payment or fake result',()=>{
 assert.equal(schema.$schema,'https://json-schema.org/draft/2020-12/schema');
 assert.equal(schema.type,'object');
 assert.equal(schema.$id,'https://livastic-vm5-primary-20260911.github.io/tapeout-xlayer-integrity-lens/data/tapeout-cpu0-diff-paid-response.schema.json');
 for(const key of ['ok','paid','chargedUSDC','kind','schema','chainId','cpuIndex','network','baselineBlock','liveBlock','fieldsCompared','changes','changeCount','unchangedCount','warning','originalVM1PayoutAddress','independentOutsideBuyersForThisNewSKU'])
   assert.ok(schema.required.includes(key),key+' is required');
 assert.equal(schema.required.length,17);
 assert.equal(schema.properties.kind.const,'xlayer_tapeout_cpu0_pinned_state_diff');
 assert.equal(schema.properties.schema.const,'TapeOutXLayerRiskLens/paid-diff-v1');
 assert.equal(schema.properties.chargedUSDC.const,'0.01');
 assert.equal(schema.properties.chainId.const,196);
 assert.equal(schema.properties.network.const,'eip155:196');
 assert.equal(schema.properties.fieldsCompared.const,20);
 assert.equal(schema.properties.changes.maxItems,20);
 assert.deepEqual(schema.properties.changes.items.required,['field','label','before','after']);
 assert.equal(schema.properties.changes.items.properties.before.type,'string');
 assert.equal(schema.properties.changes.items.properties.after.type,'string');
 const raw=JSON.stringify(schema).toLowerCase();
 for(const sensitive of ['seedphrase','privatekey','mnemonic','payment-signature','walletsecret'])assert.ok(!raw.includes(sensitive));
 assert.ok(schema.description.includes('NOT a paid report'));
 assert.ok(schema.$comment.includes('Render deployment'));
});
