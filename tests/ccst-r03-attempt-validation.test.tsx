import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { createVersionedTrainingClient, VersionedTrainingError } from '../src/lib/ccst-versioned-training';

const topicId = 365;
const versions = ['legacy-v1', 'release-02-v2', 'release-03-v3'] as const;

function attempt(questionVersions: string[]) {
  return {
    id: 'r03-fixture-attempt', lang: 'it', certificationId: 34,
    contentVersion: 'release-03-v3', seed: 123, startedAt: 1729300000000,
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

function client(questionVersions: string[]) {
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
      return { attempt: attempt(questionVersions) };
    },
  });
}

test('CCST R03 accepts mixed legacy/R02/R03 training attempts', async () => {
  const result = await client([...versions]).open();
  assert.equal(result.contentVersion, 'release-03-v3');
  assert.deepEqual(result.questions.map(q => q.contentVersion), [...versions]);
});

test('CCST training continues to reject unknown question content versions', async () => {
  await assert.rejects(client(['release-04-v4']).open(),
    (err: unknown) => err instanceof VersionedTrainingError &&
      err.message === 'INVALID_ATTEMPT_RESPONSE');
});
