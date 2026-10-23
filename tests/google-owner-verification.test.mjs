import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('owner-controlled GitHub Pages URL-prefix has the exact public verification file Google provided', () => {
 const verifier = readFileSync(new URL('../googlecede1404657214bb.html', import.meta.url), 'utf8');
 assert.equal(verifier, 'google-site-verification: googlecede1404657214bb.html\n');
 assert.ok(!verifier.includes('<script'));
});

test('new sitemap remains scoped to this project and does not claim whole github.io hostname', () => {
 const s = readFileSync(new URL('../sitemap.xml', import.meta.url), 'utf8');
 assert.ok(s.includes('/tapeout-xlayer-integrity-lens/'));
 assert.ok(!s.includes('/vm5-delivery-lab/'));
});
