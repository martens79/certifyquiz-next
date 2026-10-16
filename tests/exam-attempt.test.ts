import assert from 'node:assert/strict';
import { beforeEach, test } from 'node:test';
import { createExamAttempt, readExamAttempt, saveExamAttempt, clearExamAttempt, attemptRemaining, checkpointAttempt, closeAttempt, sameAttemptQuestions } from '../src/lib/exam-attempt';
import { clearProgress, clearAllProgressForUser } from '../src/lib/quiz-storage';
const NOW = 1_800_000_000_000;
const scope = 'mock:en:exam:user:42';
const store = new Map<string, string>();
beforeEach(() => {
  store.clear();
  Object.assign(globalThis, { localStorage: { get length() { return store.size; }, key: (i: number) => [...store.keys()][i] ?? null, getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => store.set(k, v), removeItem: (k: string) => store.delete(k) } });
});
const fresh = () => createExamAttempt({ scope, totalSec: 3600, qIds: [1, 2, 3], seed: 42, now: NOW });
test('attempt identity and original deadline survive JSON and progressive reload checkpoints', () => {
  const initial = fresh();
  saveExamAttempt(initial);
  const loaded = readExamAttempt(scope).attempt!;
  assert.equal(loaded.attemptId, initial.attemptId);
  assert.equal(attemptRemaining(loaded, NOW + 600_000), 3000);
  const checkpoint = checkpointAttempt(loaded, 3000, NOW + 600_000);
  assert.equal(checkpoint.deadlineAt, initial.deadlineAt);
  assert.equal(attemptRemaining(checkpoint, NOW + 1200_000), 2400);
});
test('a completed/expired attempt cannot regain time after reload or backwards clock', () => {
  const expired = checkpointAttempt(fresh(), 0, NOW + 7200_000);
  saveExamAttempt(expired);
  assert.equal(readExamAttempt(scope).attempt?.status, 'expired');
  assert.equal(attemptRemaining(expired, NOW - 3600_000), 0);
  assert.equal(attemptRemaining(closeAttempt(fresh(), 'completed'), NOW), 0);
});
test('backwards wall clock never increases the persisted remainder (not an anti-tamper claim)', () => {
  const at = checkpointAttempt(fresh(), 1200, NOW + 1200_000);
  assert.equal(attemptRemaining(at, NOW - 100_000), 1200);
  assert.equal(checkpointAttempt(at, 9999, NOW - 100_000).remainingSec, 1200);
});
test('clearing a snapshot/progress does not erase the attempt; explicit restart does', () => {
  saveExamAttempt(closeAttempt(fresh(), 'expired'));
  clearProgress(scope);
  assert.ok(readExamAttempt(scope).exists);
  clearExamAttempt(scope);
  const next = fresh();
  assert.equal(attemptRemaining(next, NOW), 3600);
  assert.equal(readExamAttempt(scope).exists, false);
});
test('invalid records and cross-account records are detected, without touching other keys', () => {
  saveExamAttempt(fresh());
  assert.equal(readExamAttempt('mock:en:exam:user:43').exists, false);
  store.set('cq:quiz:attempt:bad', '{broken');
  assert.deepEqual(readExamAttempt('bad'), { exists: true, attempt: null });
  store.set('cq:quiz:attempt:other', JSON.stringify(fresh()));
  assert.equal(readExamAttempt('other').attempt, null);
  clearAllProgressForUser(43);
  assert.ok(readExamAttempt(scope).attempt);
  clearAllProgressForUser(42);
  assert.equal(readExamAttempt(scope).exists, false);
});
test('question identity includes the exact ordered IDs', () => {
  assert.equal(sameAttemptQuestions(fresh(), [1, 2, 3]), true);
  assert.equal(sameAttemptQuestions(fresh(), [2, 1, 3]), false);
});
test('storage write failure is observable and never looks like a durable attempt', () => {
  Object.assign(globalThis, { localStorage: { setItem() { throw new Error('quota exceeded'); } } });
  assert.equal(saveExamAttempt(fresh()), false);
});
