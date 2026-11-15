import type { Question } from '@/lib/quiz-types';

// Training APIs (including restored versioned attempts) omit public answer keys.
// Use their existing evaluation; retain keyed legacy payloads as a fallback.
type BlockResults = Readonly<Record<string, { correct_answer_id?: number | string | null }>>;

function correctAnswerId(question: Question, results?: BlockResults) {
  return results?.[String(question.id)]?.correct_answer_id
    ?? question.answers.find((answer) => !!answer.isCorrect)?.id;
}

export function shouldPauseAtBlockBoundary({
  mode,
  blockSize,
  currentIndex,
  questionCount,
}: {
  mode: string;
  blockSize?: number;
  currentIndex: number;
  questionCount: number;
}) {
  return (
    mode === 'training' &&
    !!blockSize &&
    currentIndex < questionCount - 1 &&
    (currentIndex + 1) % blockSize === 0
  );
}

export function calculateCompletedBlock({
  questions,
  marked,
  results,
  nextQuestionIndex,
  blockSize,
}: {
  questions: Question[];
  marked: Record<string | number, string | number | null>;
  results?: BlockResults;
  nextQuestionIndex: number;
  blockSize: number;
}) {
  const start = Math.max(0, nextQuestionIndex - blockSize);
  const completedQuestions = questions.slice(start, nextQuestionIndex);
  let correct = 0;

  for (const question of completedQuestions) {
    const chosen = marked[question.id];
    const right = correctAnswerId(question, results);
    if (chosen != null && right != null && String(chosen) === String(right)) correct++;
  }

  const total = completedQuestions.length;
  return {
    correct,
    total,
    percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
    blockNumber: Math.floor(nextQuestionIndex / blockSize),
  };
}

export function getNextBlockQuestionCount({
  blockSize,
  nextQuestionIndex,
  questionCount,
}: {
  blockSize: number;
  nextQuestionIndex: number;
  questionCount: number;
}) {
  return Math.max(0, Math.min(blockSize, questionCount - nextQuestionIndex));
}

export function getCompletedBlockWrongPositions({
  questions,
  marked,
  results,
  nextQuestionIndex,
  blockSize,
}: {
  questions: Question[];
  marked: Record<string | number, string | number | null>;
  results?: BlockResults;
  nextQuestionIndex: number;
  blockSize: number;
}) {
  const start = Math.max(0, nextQuestionIndex - blockSize);
  return questions
    .slice(start, nextQuestionIndex)
    .map((question, offset) => {
      const chosen = marked[question.id];
      const right = correctAnswerId(question, results);
      return chosen != null && right != null && String(chosen) !== String(right)
        ? start + offset
        : -1;
    })
    .filter((position) => position >= 0);
}
