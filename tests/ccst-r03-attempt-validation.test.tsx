import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { createVersionedTrainingClient, VersionedTrainingError } from '../src/lib/ccst-versioned-training';

const topicId = 365;
const versions = ['legacy-v1', 'release-02-v2', 'release-03-v3', 'release-04-v4', 'release-05-v5', 'release-06-v6', 'release-07-v7', 'release-08-v8', 'release-09-v9', 'release-11-v11'] as const;

function attempt(questionVersions: string[], attemptVersion: string) {
  return {
    id: 'r03-fixture-attempt', lang: 'it', certificationId: 34,
    contentVersion: attemptVersion, seed: 123, startedAt: 1729300000000,
    expiresAt: null, rev: 0, expired: false,
    state: { marked: {}, reviewLater: [], currentIndex: 0 },
    questions: questionVersions.map((contentVersion, index) => ({
      id: 19730 + index, topic_id: topicId,
      question: 'Synthetic question',
      contentVersion, contentHash: 'a'.repeat(64),
      answers: [1, 2, 3, 4].map(id => ({ id, text: 'Synthetic answer' })),
    })),
  };
}

function client(questionVersions: string[], attemptVersion = 'release-09-v9') {
  const map = new Map<string, string>();
  return createVersionedTrainingClient({
    userId: 246, topicId, lang: 'it',
    storage: {
      getItem: key => map.get(key) ?? null,
      setItem: (key, value) => { map.set(key, value); },
    },
    randomKey: () => 'fixture-start-key-123456789',
    request: async (path) => {
      assert.equal(path, '/latest?topicId=365&lang=it');
      return { attempt: attempt(questionVersions, attemptVersion) };
    },
  });
}

test('CCST W1 accepts mixed legacy/R02/R03/R04/R05/R06/R07/R08/R09/W1 training attempts', async () => {
  const result = await client([...versions]).open();
  assert.equal(result.contentVersion, 'release-09-v9');
  assert.deepEqual(result.questions.map(q => q.contentVersion), [...versions]);
});

test('CCST training continues to reject unknown question content versions', async () => {
  await assert.rejects(client(['release-10-v10']).open(),
    (err: unknown) => err instanceof VersionedTrainingError &&
      err.message === 'INVALID_ATTEMPT_RESPONSE');
});

test('CCST W1 accepts residual W2 question versions alongside historical versions', async () => {
  const mixed = [...versions, 'release-12-v12'];
  const result = await client(mixed, 'release-11-v11').open();
  assert.equal(result.contentVersion, 'release-11-v11');
  assert.deepEqual(result.questions.map(q => q.contentVersion), mixed);
});
