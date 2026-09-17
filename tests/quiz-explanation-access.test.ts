import assert from 'node:assert/strict';
import test from 'node:test';

import {
  claimPostGateQuestionConsumption,
  claimWrongExplanationConsumption,
  isPostGateHardLocked,
  isPostGateLimitError,
  isWrongExplanationLocked,
} from '../src/lib/quiz-explanation-access.ts';

test('free user with quota can see and consume an explanation', () => {
  assert.equal(isWrongExplanationLocked({
    isPremiumUser: false, isLoggedIn: true, wrongExpLeft: 3, adUnlocked: false,
  }), false);
});

test('free user with exhausted quota sees the existing gate', () => {
  assert.equal(isWrongExplanationLocked({
    isPremiumUser: false, isLoggedIn: true, wrongExpLeft: 0, adUnlocked: false,
  }), true);
});

test('premium, admin and unlimited entitlement states bypass the gate', () => {
  assert.equal(isWrongExplanationLocked({
    isPremiumUser: true, isLoggedIn: true, wrongExpLeft: 0, adUnlocked: false,
  }), false);
  assert.equal(isWrongExplanationLocked({
    isPremiumUser: false, isLoggedIn: true, wrongExpLeft: null, adUnlocked: false,
  }), false);
});

test('the same question is consumed only once across re-render and back navigation', () => {
  const consumed = new Set<string>();
  assert.equal(claimWrongExplanationConsumption(consumed, 42), true);
  assert.equal(claimWrongExplanationConsumption(consumed, 42), false);
  assert.equal(claimWrongExplanationConsumption(consumed, '42'), false);
  assert.equal(claimWrongExplanationConsumption(consumed, 43), true);
});

// ---- isPostGateHardLocked ---------------------------------------------

test('free logged-in user in training is blocked once the server reports hardLocked', () => {
  assert.equal(isPostGateHardLocked({
    isPremiumUser: false, isLoggedIn: true, mode: 'training', hardLocked: true,
  }), true);
});

test('free logged-in user in training is NOT blocked while hardLocked is still false', () => {
  assert.equal(isPostGateHardLocked({
    isPremiumUser: false, isLoggedIn: true, mode: 'training', hardLocked: false,
  }), false);
});

test('premium/admin/package users are never hard-locked, even if the server flag is stale/true', () => {
  assert.equal(isPostGateHardLocked({
    isPremiumUser: true, isLoggedIn: true, mode: 'training', hardLocked: true,
  }), false);
});

test('guests (not logged in) are not affected by this gate', () => {
  assert.equal(isPostGateHardLocked({
    isPremiumUser: false, isLoggedIn: false, mode: 'training', hardLocked: true,
  }), false);
});

test('assessment is explicitly excluded, even when hardLocked is true', () => {
  assert.equal(isPostGateHardLocked({
    isPremiumUser: false, isLoggedIn: true, mode: 'assessment', hardLocked: true,
  }), false);
});

test('exam is explicitly excluded in this first iteration, even when hardLocked is true', () => {
  assert.equal(isPostGateHardLocked({
    isPremiumUser: false, isLoggedIn: true, mode: 'exam', hardLocked: true,
  }), false);
});

// ---- claimPostGateQuestionConsumption ----------------------------------

test('claimPostGateQuestionConsumption: same question claimed only once (client-side optimization only)', () => {
  const consumed = new Set<string>();
  assert.equal(claimPostGateQuestionConsumption(consumed, 7), true);
  assert.equal(claimPostGateQuestionConsumption(consumed, 7), false);
  assert.equal(claimPostGateQuestionConsumption(consumed, '7'), false);
  assert.equal(claimPostGateQuestionConsumption(consumed, 8), true);
});

// ---- isPostGateLimitError (Fase A: server enforcement on the bulk endpoints) ----

test('15) recognizes the exact POST_GATE_QUIZ_LIMIT_REACHED shape thrown by apiClient', () => {
  assert.equal(isPostGateLimitError({
    status: 403, detail: { error: 'POST_GATE_QUIZ_LIMIT_REACHED', hardLocked: true, limit: 5, used: 5, remaining: 0 },
  }), true);
});

test('a plain 403 with a different application code is NOT treated as the post-gate paywall', () => {
  assert.equal(isPostGateLimitError({ status: 403, detail: { error: 'PREMIUM_REQUIRED' } }), false);
});

test('a 401 (unrelated auth error) is never mistaken for the post-gate paywall', () => {
  assert.equal(isPostGateLimitError({ status: 401, detail: { error: 'POST_GATE_QUIZ_LIMIT_REACHED' } }), false);
});

test('malformed/missing error shapes are handled without throwing', () => {
  assert.equal(isPostGateLimitError(null), false);
  assert.equal(isPostGateLimitError(undefined), false);
  assert.equal(isPostGateLimitError({}), false);
  assert.equal(isPostGateLimitError({ status: 403 }), false);
  assert.equal(isPostGateLimitError(new Error('network down')), false);
});
