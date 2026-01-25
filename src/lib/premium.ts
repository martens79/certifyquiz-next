// src/lib/premium.ts
// ============================================================
// 💎 Premium decision layer (single source of truth)
// ============================================================
//
// OBIETTIVO:
// - Centralizzare TUTTA la logica Premium
// - Evitare condizioni sparse nel codice
// - Consentire attivazione futura via flag / backend
//
// REGOLA D'ORO:
// ❌ Non decidere "premium sì/no" nei componenti
// ✅ Usare SEMPRE getPremiumState()
// ============================================================

export type PremiumFlags = {
  /** Feature flag globale: Premium esiste o no */
  premiumEnabled: boolean;

  /** Se true, le spiegazioni vengono bloccate per utenti free */
  lockExplanations: boolean;
};

export type PremiumUser = {
  /** true se l’utente ha un piano premium attivo */
  isPremium?: boolean;

  /** opzionale, se in futuro distingui piani */
  plan?: "free" | "premium" | "pro";
};

export type PremiumState = {
  /** l’utente ha accesso premium */
  isPremiumUser: boolean;

  /**
   * true = contenuti premium BLOCCATI
   * false = tutto visibile (anche se premiumEnabled=true)
   */
  premiumLocked: boolean;
};

/* ─────────────────────────────────────────────────────────────
   LETTURA FLAGS (ENV)
   → default = false (safe)
───────────────────────────────────────────────────────────── */
export function getPremiumFlags(): PremiumFlags {
  return {
    premiumEnabled: process.env.NEXT_PUBLIC_PREMIUM_ENABLED === "1",
    lockExplanations:
      process.env.NEXT_PUBLIC_PREMIUM_LOCK_EXPLANATIONS === "1",
  };
}

/* ─────────────────────────────────────────────────────────────
   DECISIONE FINALE PREMIUM
   (QUESTA è la funzione da usare ovunque)
───────────────────────────────────────────────────────────── */
export function getPremiumState(opts: {
  user?: PremiumUser | null;
  flags?: PremiumFlags;
}): PremiumState {
  const flags = opts.flags ?? getPremiumFlags();
  const user = opts.user ?? null;

  const isPremiumUser =
    user?.isPremium === true || user?.plan === "premium" || user?.plan === "pro";

  /**
   * LOGICA:
   * - Se Premium non è abilitato → NON bloccare mai
   * - Se Premium è abilitato MA lockExplanations=false → NON bloccare
   * - Se Premium è abilitato + lockExplanations=true
   *   → blocca SOLO se utente NON premium
   */
  const premiumLocked =
    flags.premiumEnabled && flags.lockExplanations && !isPremiumUser;

  return {
    isPremiumUser,
    premiumLocked,
  };
}
