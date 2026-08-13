import assert from 'node:assert/strict';
import test from 'node:test';

import {
  claimWrongExplanationConsumption,
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
