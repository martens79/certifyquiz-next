import assert from 'node:assert/strict';
import test from 'node:test';

import {
  claimBlockReviewGateOpening,
  explanationPaywallParams,
} from '../src/lib/quiz-block-review-tracking.ts';

test('GA4 block-review payload preserves existing fields and adds source', () => {
  assert.deepEqual(explanationPaywallParams({
    language: 'it', quizMode: 'training', questionId: 42,
    certificationSlug: 'comptia-a-plus', source: 'block-review',
  }), {
    language: 'it', quiz_mode: 'training', question_id: 42,
    certification_slug: 'comptia-a-plus', content_type: 'explanation',
    source_page: 'quiz', source: 'block-review',
  });
});

test('normal quiz GA4 payload remains unchanged without source', () => {
  const payload = explanationPaywallParams({
    language: 'en', quizMode: 'training', questionId: 7, certificationSlug: null,
  });
  assert.equal('source' in payload, false);
  assert.equal(payload.source_page, 'quiz');
  assert.equal(payload.content_type, 'explanation');
});

test('DB gate event is deduplicated per block-review opening', () => {
  const tracked = new Set<number>();
  assert.equal(claimBlockReviewGateOpening(tracked, 1), true);
  assert.equal(claimBlockReviewGateOpening(tracked, 1), false);
  assert.equal(claimBlockReviewGateOpening(tracked, 2), true);
});
