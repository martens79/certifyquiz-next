import assert from 'node:assert/strict';
import test from 'node:test';

import type { Question } from '../src/lib/quiz-types.ts';
import {
  calculateCompletedBlock,
  getCompletedBlockWrongPositions,
  getNextBlockQuestionCount,
  shouldPauseAtBlockBoundary,
} from '../src/lib/quiz-blocks.ts';

function questions(count: number): Question[] {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    question: `Question ${index + 1}`,
    answers: [
      { id: 1, text: 'Wrong' },
      { id: 2, text: 'Correct', isCorrect: true },
    ],
  }));
}

test('scores the first and second blocks independently', () => {
  const pool = questions(23);
  const marked: Record<number, number> = {};
  for (let id = 1; id <= 20; id++) marked[id] = id <= 7 || (id >= 11 && id <= 15) ? 2 : 1;

  assert.deepEqual(calculateCompletedBlock({ questions: pool, marked, nextQuestionIndex: 10, blockSize: 10 }), {
    correct: 7,
    total: 10,
    percentage: 70,
    blockNumber: 1,
  });
  assert.deepEqual(calculateCompletedBlock({ questions: pool, marked, nextQuestionIndex: 20, blockSize: 10 }), {
    correct: 5,
    total: 10,
    percentage: 50,
    blockNumber: 2,
  });
});

test('pauses at 10 and 20 in a 23-question pool, but not for the final tail', () => {
  const pause = (currentIndex: number) => shouldPauseAtBlockBoundary({
    mode: 'training', blockSize: 10, currentIndex, questionCount: 23,
  });
  assert.equal(pause(9), true);
  assert.equal(pause(19), true);
  assert.equal(pause(22), false);
});

test('does not pause pools shorter than a block or non-training modes', () => {
  for (let index = 0; index < 7; index++) {
    assert.equal(shouldPauseAtBlockBoundary({
      mode: 'training', blockSize: 10, currentIndex: index, questionCount: 7,
    }), false);
  }
  assert.equal(shouldPauseAtBlockBoundary({ mode: 'exam', blockSize: 10, currentIndex: 9, questionCount: 75 }), false);
  assert.equal(shouldPauseAtBlockBoundary({ mode: 'assessment', blockSize: 10, currentIndex: 9, questionCount: 10 }), false);
});

test('mixed training pauses every 10 while the same mixed pool in exam does not', () => {
  const mixedQuestionCount = 120;
  assert.equal(shouldPauseAtBlockBoundary({
    mode: 'training', blockSize: 10, currentIndex: 9, questionCount: mixedQuestionCount,
  }), true);
  assert.equal(shouldPauseAtBlockBoundary({
    mode: 'exam', blockSize: 10, currentIndex: 9, questionCount: mixedQuestionCount,
  }), false);
});

test('uses the real remaining count in the continue CTA', () => {
  assert.equal(getNextBlockQuestionCount({ blockSize: 10, nextQuestionIndex: 10, questionCount: 23 }), 10);
  assert.equal(getNextBlockQuestionCount({ blockSize: 10, nextQuestionIndex: 20, questionCount: 23 }), 3);
  assert.equal(getNextBlockQuestionCount({ blockSize: 10, nextQuestionIndex: 20, questionCount: 35 }), 10);

  // Un pool esattamente multiplo termina normalmente: il boundary finale
  // non genera checkpoint e non ha un blocco successivo da annunciare.
  assert.equal(shouldPauseAtBlockBoundary({ mode: 'training', blockSize: 10, currentIndex: 19, questionCount: 20 }), false);
  assert.equal(getNextBlockQuestionCount({ blockSize: 10, nextQuestionIndex: 20, questionCount: 20 }), 0);
});

test('block review contains only mistakes from the completed block', () => {
  const pool = questions(23);
  const marked: Record<number, number> = {};
  for (let id = 1; id <= 20; id++) marked[id] = 2;
  marked[2] = 1;
  marked[9] = 1;
  marked[11] = 1;
  marked[17] = 1;

  assert.deepEqual(getCompletedBlockWrongPositions({
    questions: pool, marked, nextQuestionIndex: 10, blockSize: 10,
  }), [1, 8]);
  assert.deepEqual(getCompletedBlockWrongPositions({
    questions: pool, marked, nextQuestionIndex: 20, blockSize: 10,
  }), [10, 16]);
});

test('a perfect block has no block-review positions', () => {
  const pool = questions(10);
  const marked = Object.fromEntries(pool.map((question) => [Number(question.id), 2]));
  assert.deepEqual(getCompletedBlockWrongPositions({
    questions: pool, marked, nextQuestionIndex: 10, blockSize: 10,
  }), []);
});
