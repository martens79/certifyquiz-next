import { createAttemptId, submitResult, SaveExamFailure, type OutboxDeps } from '@/lib/save-exam-outbox';
import { getToken, getUser } from '@/lib/auth';
import { authMe } from '@/lib/apiClient';

type SummaryAttempt = { questionId: number | string; chosenAnswerId: number | string | null; isCorrect?: boolean };

export type UserIdResolver = {
  hasToken: () => boolean;
  cachedId: () => number | string | null;
  fetchId: () => Promise<number | string | null>;
};

const defaultResolver: UserIdResolver = {
  hasToken: () => !!getToken(),
  cachedId: () => getUser()?.id ?? null,
  fetchId: async () => (await authMe())?.user?.id ?? null,
};

/**
 * Registra in cronologia il risultato di un quiz concluso (/save-exam) tramite
 * l'outbox: write-ahead locale, attemptId stabile, un solo retry automatico.
 *
 * - Anonimo (nessun userId e nessun token): nulla da registrare, risolve
 *   `recorded: false` senza alcuna chiamata di rete.
 * - Token valido ma `user?.id` non ancora disponibile (bootstrap dell'auth): l'id
 *   viene ricavato dalla cache `cq_user` o da /auth/me. Se non e' determinabile NON
 *   si salta in silenzio: lancia SaveExamFailure (retryable) invece di `recorded: false`.
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
}, deps?: OutboxDeps, resolver: UserIdResolver = defaultResolver): Promise<{ recorded: boolean }> {
  let userId = args.userId;
  if (userId == null) {
    if (!resolver.hasToken()) return { recorded: false }; // anonimo reale
    userId = resolver.cachedId() ?? (await resolver.fetchId().catch(() => null));
    // Token presente ma identita' non determinabile: mai "salvato" in silenzio.
    if (userId == null) throw new SaveExamFailure({ kind: 'auth', retryable: true, status: null }, false);
  }
  const { summary } = args;
  const attemptId = summary.attemptId ?? createAttemptId();
  const attempts = (Array.isArray(summary.attempts) ? summary.attempts : [])
    .filter((a) => a?.chosenAnswerId != null)
    // solo le chiavi lette dal backend: la correttezza la ricalcola lui da answers.is_correct
    .map((a) => ({ questionId: Number(a.questionId), chosenAnswerId: Number(a.chosenAnswerId) }));
  await submitResult({
    attemptId,
    userId,
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
