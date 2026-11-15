import assert from 'node:assert/strict';
import test from 'node:test';

import {
  claimPostGateQuestionConsumption,
  claimWrongExplanationConsumption,
  isPostGateHardLocked,
  isPostGateLimitError,
  isWrongExplanationLocked,
  shouldReportPostGateAnswer,
  shouldShowPremiumUpsell,
} from '../src/lib/quiz-explanation-access.ts';
import { readFileSync } from 'node:fs';

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

// Regressione 2026-09-21: `postGateApplicable` veniva letto una volta al mount da
// /me/explanation-status e usato per FILTRARE le segnalazioni al server. Se il gate
// delle spiegazioni veniva superato nella stessa sessione di pagina (o in un'altra
// scheda) restava false: nessuna risposta post-gate veniva contata, il contatore
// server restava a 0 e utenti FREE rispondevano a 10-40 domande oltre il limite.
test('every logged-in FREE answer is reported to the server (the server decides applicability)', () => {
  assert.equal(shouldReportPostGateAnswer({ isPremiumUser: false, isLoggedIn: true }), true);
});

test('premium and guest answers are never reported', () => {
  assert.equal(shouldReportPostGateAnswer({ isPremiumUser: true, isLoggedIn: true }), false);
  assert.equal(shouldReportPostGateAnswer({ isPremiumUser: false, isLoggedIn: false }), false);
});

test('QuizEngine.recordPostGateQuestion does not filter on client state read at mount', () => {
  const source = readFileSync(new URL('../src/components/quiz/QuizEngine.tsx', import.meta.url), 'utf8');
  const start = source.indexOf('const recordPostGateQuestion');
  assert.ok(start > 0, 'recordPostGateQuestion not found');
  const body = source.slice(start, source.indexOf('const consumeWrongExplanation', start));
  assert.ok(!/postGateApplicable/.test(body), 'recordPostGateQuestion must not depend on a mount-time applicable flag');
  assert.match(body, /shouldReportPostGateAnswer\(/);
  assert.ok(!/postGateApplicable/.test(source), 'the stale applicable state must not exist anymore');
});

// ---- Upsell Premium e spiegazioni gia' possedute ------------------------
// Decisione 13/10/2026: chi ha un pacchetto con `explanation` (Study/Complete)
// non deve vedere upsell Premium per le spiegazioni che ha gia'.

test('shouldShowPremiumUpsell: FREE senza spiegazioni illimitate vede l’upsell', () => {
  assert.equal(shouldShowPremiumUpsell({ isPremiumUser: false, explanationsUnlimited: false }), true);
});

test('shouldShowPremiumUpsell: pacchetto con spiegazioni illimitate (dal server) nasconde l’upsell', () => {
  assert.equal(shouldShowPremiumUpsell({ isPremiumUser: false, explanationsUnlimited: true }), false);
});

test('shouldShowPremiumUpsell: Premium/admin non vedono mai l’upsell', () => {
  assert.equal(shouldShowPremiumUpsell({ isPremiumUser: true, explanationsUnlimited: false }), false);
  assert.equal(shouldShowPremiumUpsell({ isPremiumUser: true, explanationsUnlimited: true }), false);
});

test('QuizEngine: gli upsell Premium a fine quiz dipendono dal server, non solo da isPremiumUser', () => {
  const source = readFileSync(new URL('../src/components/quiz/QuizEngine.tsx', import.meta.url), 'utf8');

  // lo stato nasce solo da risposte del server
  assert.match(source, /setExplanationsUnlimited\(data\.unlimited === true\)/);
  assert.match(source, /explanation_access\?\.unlimited\) \{\s*setExplanationsUnlimited\(true\)/);
  assert.match(source, /shouldShowPremiumUpsell\(\{ isPremiumUser, explanationsUnlimited \}\)/);

  // PremiumTeaserBox e "Sblocca spiegazioni Premium" passano da showPremiumUpsell
  const teaser = source.indexOf('<PremiumTeaserBox');
  assert.ok(teaser > 0, 'PremiumTeaserBox not found');
  assert.match(source.slice(teaser - 200, teaser), /showPremiumUpsell/);
  assert.ok(!/!isAssessmentResult && !isPremiumUser/.test(source), 'PremiumTeaserBox must not depend on isPremiumUser alone');

  const unlockButton = source.indexOf('Unlock Premium explanations');
  assert.ok(unlockButton > 0, 'unlock explanations CTA not found');
  assert.match(source.slice(unlockButton - 700, unlockButton), /showPremiumUpsell && \(/);

  // il box "Review completa con Premium" dell'assessment non e' mostrato a chi ha le spiegazioni
  assert.match(source, /isAssessmentResult && !explanationsUnlimited/);
});

test('QuizEngine: la risposta a /me/explanation-status senza certificazione non sovrascrive quella corretta', () => {
  const source = readFileSync(new URL('../src/components/quiz/QuizEngine.tsx', import.meta.url), 'utf8');
  const start = source.indexOf('apiFetch(`/me/explanation-status');
  assert.ok(start > 0, 'explanation-status fetch not found');
  const before = source.slice(Math.max(0, start - 600), start);
  const after = source.slice(start, start + 2500);
  assert.match(before, /let alive = true/);
  assert.match(after, /if \(!alive\) return;/);
  assert.match(after, /alive = false;/);
});
