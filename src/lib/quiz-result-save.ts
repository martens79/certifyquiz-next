import { createAttemptId, submitResult, type OutboxDeps } from '@/lib/save-exam-outbox';

type SummaryAttempt = { questionId: number | string; chosenAnswerId: number | string | null; isCorrect?: boolean };

/**
 * Registra in cronologia il risultato di un quiz concluso (/save-exam) tramite
 * l'outbox: write-ahead locale, attemptId stabile, un solo retry automatico.
 *
 * - Anonimo (nessun userId): nulla da registrare, risolve `recorded: false`.
 * - Salvataggio fallito: lancia SaveExamFailure. Lo stato resta nello store
 *   dell'outbox e SaveResultBanner lo mostra con il pulsante di retry; non serve
 *   ripetere le risposte. Il chiamante NON deve ingoiare l'errore.
 */
export async function recordQuizResult(args: {
  userId: number | string | null | undefined;
  scope: string;
  summary: { attemptId?: string; total?: number; correct?: number; attempts?: SummaryAttempt[] };
  certificationId: number;
  topicId?: number | null;
  isExam: boolean;
}, deps?: OutboxDeps): Promise<{ recorded: boolean }> {
  if (args.userId == null) return { recorded: false };
  const { summary } = args;
  const attemptId = summary.attemptId ?? createAttemptId();
  const attempts = (Array.isArray(summary.attempts) ? summary.attempts : [])
    .filter((a) => a?.chosenAnswerId != null)
    // solo le chiavi lette dal backend: la correttezza la ricalcola lui da answers.is_correct
    .map((a) => ({ questionId: Number(a.questionId), chosenAnswerId: Number(a.chosenAnswerId) }));
  await submitResult({
    attemptId,
    userId: args.userId,
    scope: args.scope,
    payload: {
      attemptId,
      ...(args.topicId != null ? { topicId: args.topicId } : {}),
      certification_id: args.certificationId,
      totalQuestions: summary.total ?? 0,
      correctAnswers: summary.correct ?? 0,
      isExam: args.isExam,
      attempts,
    },
  }, deps);
  return { recorded: true };
}
