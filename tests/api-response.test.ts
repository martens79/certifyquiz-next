import assert from 'node:assert/strict';
import { test } from 'node:test';
import { decodeApiJson, validateQuestionPayload } from '../src/lib/api-response';

test('an old service worker HTML response fails as unavailable instead of an empty pool', async () => {
  await assert.rejects(decodeApiJson(new Response('<html>Offline</html>', { status: 200 })), (e: any) => e.status === 503);
});
test('malformed JSON and a successful but invalid bank payload remain recoverable', async () => {
  await assert.rejects(decodeApiJson(new Response('{broken', { headers: { 'content-type': 'application/json' } })), (e: any) => e.status === 503);
  for (const invalid of [null, 'Offline', {}, { questions: 'wrong' }, { questions: [{}] }]) {
    assert.throws(() => validateQuestionPayload(invalid), (e: any) => e.status === 503);
  }
});
test('a genuine empty bank and delivered questions are valid', async () => {
  assert.deepEqual(await decodeApiJson(new Response('{"questions":[]}')), { questions: [] });
  assert.deepEqual(validateQuestionPayload({ questions: [] }), { questions: [] });
  const q = [{ id: 1, answers: [{ id: 11, text: 'a' }, { id: 12, text: 'b' }] }];
  assert.equal(validateQuestionPayload(q), q);
});
