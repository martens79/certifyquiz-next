// src/lib/flags.ts
// Feature flags centrali — Premium ready-to-flip

/**
 * PREMIUM_ENABLED
 * - false: nessun enforcement (oggi)
 * - true: feature premium bloccate per utenti free
 */
export const PREMIUM_ENABLED = false;

/**
 * PREMIUM_BETA_FREE
 * - true: feature premium visibili/gratuite (beta)
 * - false: enforcement completo se PREMIUM_ENABLED = true
 */
export const PREMIUM_BETA_FREE = true;

/**
 * Helper logico: una feature premium è effettivamente bloccata?
 */
export function isPremiumLocked(isPremiumUser: boolean): boolean {
  if (!PREMIUM_ENABLED) return false;
  if (PREMIUM_BETA_FREE) return false;
  return !isPremiumUser;
}
