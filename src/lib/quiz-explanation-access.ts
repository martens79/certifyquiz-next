export function isWrongExplanationLocked({
  isPremiumUser,
  isLoggedIn,
  wrongExpLeft,
  adUnlocked,
}: {
  isPremiumUser: boolean;
  isLoggedIn: boolean;
  wrongExpLeft: number | null;
  adUnlocked: boolean;
}) {
  return (
    !isPremiumUser &&
    isLoggedIn &&
    wrongExpLeft !== null &&
    wrongExpLeft <= 0 &&
    !adUnlocked
  );
}

export function claimWrongExplanationConsumption(
  consumedQuestionIds: Set<string>,
  questionId: string | number
) {
  const key = String(questionId);
  if (consumedQuestionIds.has(key)) return false;
  consumedQuestionIds.add(key);
  return true;
}

/**
 * Hard paywall "explanation gate + N domande extra": blocca l'accesso a una
 * domanda NON ancora risposta quando il server ha già segnalato hardLocked.
 * Scoping esplicito, coerente con l'audit:
 * - solo training (exam/assessment restano fuori in questa prima iterazione:
 *   l'assessment ha il suo flusso, l'exam mode non va deciso arbitrariamente);
 * - premium/admin/package (isPremiumUser=true) sono sempre illimitati;
 * - guest (isLoggedIn=false) non sono toccati da questo gate.
 */
export function isPostGateHardLocked({
  isPremiumUser,
  isLoggedIn,
  mode,
  hardLocked,
}: {
  isPremiumUser: boolean;
  isLoggedIn: boolean;
  mode: string;
  hardLocked: boolean;
}) {
  return !isPremiumUser && isLoggedIn && mode === "training" && hardLocked === true;
}

/**
 * Una domanda risposta consuma UNA sola slot post-gate, indipendentemente
 * dal fatto che la risposta sia corretta o sbagliata: la dedup vive qui solo
 * per evitare chiamate di rete ridondanti (doppio click, re-render). La
 * garanzia reale contro il doppio conteggio è server-side
 * (UNIQUE(user_id, question_id) su post_gate_question_log) — questa
 * funzione non va MAI considerata l'unica difesa.
 */
export function claimPostGateQuestionConsumption(
  consumedQuestionIds: Set<string>,
  questionId: string | number
) {
  const key = String(questionId);
  if (consumedQuestionIds.has(key)) return false;
  consumedQuestionIds.add(key);
  return true;
}

/**
 * Riconosce il 403 POST_GATE_QUIZ_LIMIT_REACHED (Fase A, enforcement
 * server-side su GET /questions/:topicId e /questions-mixed/:id) da un
 * errore lanciato da apiClient.ts (vedi toApiError: status + detail sono
 * sempre allegati all'Error). Usata sia da QuizEngine.tsx (per non mostrare
 * un errore generico e riusare invece renderPostGateHardPaywall) sia da
 * QuizTopicClient.tsx (per decidere se rilanciare l'errore invece di
 * ingoiarlo in []). Un'unica definizione: le due copie non devono mai
 * divergere su quale forma di errore riconoscono.
 */
export function isPostGateLimitError(err: unknown): boolean {
  const e = err as { status?: unknown; detail?: { error?: unknown } } | null | undefined;
  return e?.status === 403 && e?.detail?.error === "POST_GATE_QUIZ_LIMIT_REACHED";
}
