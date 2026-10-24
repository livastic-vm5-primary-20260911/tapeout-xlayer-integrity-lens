import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';

const video='./demo/tapeout-real-triage-and-business-20261024.mp4';
const image='./demo/tapeout-review-real-mainnet-20261024.png';
const homepage=readFileSync('index.html','utf8');
const buyer=readFileSync('commercial.html','utf8');
const submission=readFileSync('SUBMISSION.md','utf8');
const readme=readFileSync('README.md','utf8');
const provenance=readFileSync('demo/RECORDING_PROVENANCE_20261024.md','utf8');

test('Latest review-and-business demo is real bounded MP4 and is findable from source, product and commercial page',()=>{
 const buffer=readFileSync(video);
 assert.ok(buffer.length>100000 && buffer.length<10000000,'no empty placeholder or huge unreviewed video');
 assert.equal(buffer.subarray(4,8).toString(),'ftyp','not a normal MP4 container');
 assert.ok(statSync(image).size>20000,'missing actual illustrated screenshot');
 for(const page of [homepage,buyer]){
  assert.match(page,/href="\.\/demo\/tapeout-real-triage-and-business-20261024\.mp4"/);
  assert.match(page,/noopener noreferrer/);
 }
 assert.match(submission,/tapeout-real-triage-and-business-20261024\.mp4/);
 assert.match(readme,/tapeout-real-triage-and-business-20261024\.mp4/);
 assert.match(provenance,/53\.6-second 1440×900 MP4/);
 assert.match(provenance,/74,032,901/);
});

test('Documented video states contest eligibility pending and never misrepresents a real sale or security certification',()=>{
 assert.match(submission,/submission packet \(not yet submitted\)/i);
 assert.match(submission,/legal full name, nationality, owner-controlled Telegram and legal-majority details remain unknown/i);
 assert.match(provenance,/no third-party buyer, signed contract, prize or paid revenue/i);
 assert.match(provenance,/imported historical|historical baseline/i);
 assert.match(provenance,/not independently verified/i);
 assert.match(readme,/earlier 29-second film/i);
 assert.match(buyer,/USD-equivalent/);
});
