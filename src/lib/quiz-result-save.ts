import {
  completeAwaiting, createAttemptId, holdForIdentity, submitResult, type OutboxDeps,
} from '@/lib/save-exam-outbox';
import { getToken, getUser } from '@/lib/auth';
import { authMe } from '@/lib/apiClient';

type SummaryAttempt = { questionId: number | string; chosenAnswerId: number | string | null; isCorrect?: boolean };

export type UserIdResolver = {
  hasToken: () => boolean;
  cachedId: () => number | string | null;
  fetchId: () => Promise<number | string | null>;
};

const IDENTITY_TIMEOUT_MS = 10_000;

const defaultResolver: UserIdResolver = {
  hasToken: () => !!getToken(),
  cachedId: () => getUser()?.id ?? null,
  fetchId: async () => (await authMe())?.user?.id ?? null,
};

/**
 * Ricava l'id utente quando `user?.id` non e' ancora disponibile: cache `cq_user`,
 * poi UNA richiesta /auth/me (timeout 10 s). Senza token = anonimo: null, nessuna
 * chiamata. Con token ma id non determinabile: null (il chiamante NON deve
 * trattarlo come anonimo).
 */
export async function resolveUserId(resolver: UserIdResolver = defaultResolver): Promise<string | number | null> {
  if (!resolver.hasToken()) return null;
  const cached = resolver.cachedId();
  if (cached != null) return cached;
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      resolver.fetchId(),
      new Promise<null>((resolve) => { timer = setTimeout(() => resolve(null), IDENTITY_TIMEOUT_MS); }),
    ]);
  } catch {
    return null;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/**
 * Registra in cronologia il risultato di un quiz concluso (/save-exam) tramite
 * l'outbox: write-ahead locale, attemptId stabile, un solo retry automatico.
 *
 * - Anonimo (nessun userId e nessun token): nulla da registrare, risolve
 *   `recorded: false` senza alcuna chiamata di rete.
 * - Token valido ma `user?.id` non ancora disponibile (bootstrap dell'auth): l'id
 *   viene ricavato dalla cache `cq_user` o da /auth/me. Se non e' determinabile NON
 *   si salta in silenzio e NON si crea un'outbox per un'identita' sconosciuta: il
 *   risultato resta SOLO in memoria (`holdForIdentity`), SaveResultBanner lo mostra
 *   con un retry manuale che non richiede di rispondere di nuovo, e la funzione
 *   lancia SaveExamFailure di tipo 'identity'.
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
  if (args.userId == null && !resolver.hasToken()) return { recorded: false }; // anonimo reale
  const { summary } = args;
  const attemptId = summary.attemptId ?? createAttemptId();
  const attempts = (Array.isArray(summary.attempts) ? summary.attempts : [])
    .filter((a) => a?.chosenAnswerId != null)
    // solo le chiavi lette dal backend: la correttezza la ricalcola lui da answers.is_correct
    .map((a) => ({ questionId: Number(a.questionId), chosenAnswerId: Number(a.chosenAnswerId) }));
  const payload = {
    attemptId,
    ...(args.topicId != null ? { topicId: args.topicId } : {}),
    certification_id: args.certificationId,
    totalQuestions: summary.total ?? 0,
    correctAnswers: summary.correct ?? 0,
    isExam: args.isExam,
    attempts,
  };
  if (args.userId != null) {
    await submitResult({ attemptId, userId: args.userId, scope: args.scope, payload }, deps);
    return { recorded: true };
  }
  // Token presente, id assente: visibile e ritentabile, mai su disco finche' l'identita' e' ignota.
  holdForIdentity({ attemptId, scope: args.scope, payload }, deps);
  await completeAwaiting(attemptId, () => resolveUserId(resolver), deps, false);
  return { recorded: true };
}

/** Retry manuale dal banner: ritenta la sola risoluzione dell'identita' (cooldown 3 s), poi il salvataggio. */
export function retryUnresolvedResult(attemptId: string, deps?: OutboxDeps, resolver: UserIdResolver = defaultResolver) {
  return completeAwaiting(attemptId, () => resolveUserId(resolver), deps, true);
}
