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
