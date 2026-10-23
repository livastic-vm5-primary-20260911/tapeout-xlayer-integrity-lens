import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../commercial.html', import.meta.url), 'utf8');
const freeUrl = 'https://settled.tools/v1/peek?url=https%3A%2F%2Fvm5-openapi-x402.onrender.com%2Fv1%2Ftapeout-cpu0-report';

test('external directory link uses FREE public exact-resource peek and not the paid check endpoint', () => {
  assert.ok(html.includes('href="' + freeUrl + '"'));
  assert.equal((html.match(/settled\.tools\/v1\/peek/g) || []).length, 1);
  assert.ok(!html.includes('settled.tools/v1/check?'));
  assert.ok(!html.includes('settled.tools/v1/submit'));
});

test('live listing is never conflated with buyer order, delivery or unique wallet receipt', () => {
  assert.ok(html.includes('listed as <strong>live</strong>'));
  assert.ok(html.includes('not</strong> independent proof'));
  assert.ok(html.includes('finalized USDC'));
  assert.ok(html.includes('quality score may change'));
  assert.ok(!html.includes('Settled confirmed our second customer'));
});

test('original free preview, Base x402 paid route and written-scope $49 CTA remain', () => {
  assert.ok(html.includes('https://vm5-openapi-x402.onrender.com/v1/tapeout-cpu0-sample'));
  assert.ok(html.includes('https://vm5-openapi-x402.onrender.com/v1/tapeout-cpu0-report'));
  assert.ok(html.includes('only after written scope and terms'));
  assert.ok(html.includes('0.005 native Circle Base USDC'));
  assert.ok(html.includes('https://agent402.tools/api/route?q=tapeout&amp;include=external'));
});
