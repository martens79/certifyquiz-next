// src/lib/analytics.ts
// Helper GA4 condiviso, stesso pattern gia' in uso in QuizEngine.tsx
// (trackQuizEvent): guardie su window/gtag, nessuna eccezione se GA non e'
// ancora caricato. Qui non e' hardcoded event_category='quiz' perche' i
// chiamanti coprono aree diverse (mappe, materiale di studio, premium).
//
// "use client" non serve qui: il file non ha side effect a livello di
// modulo, il guard su typeof window basta a renderlo innocuo in SSR.

type TrackParams = Record<string, string | number | boolean | null | undefined>;

export function trackEvent(eventName: string, params: TrackParams = {}) {
  if (typeof window === "undefined") return;

  const w = window as typeof window & { gtag?: (...args: unknown[]) => void };
  if (typeof w.gtag !== "function") return;

  w.gtag("event", eventName, params);
}

/** user_status per gli eventi: mai id/email, solo lo stato d'accesso. */
export type UserStatus = "anonymous" | "free" | "premium";

export function userStatusFrom(user: { premium?: boolean } | null): UserStatus {
  if (!user) return "anonymous";
  return user.premium ? "premium" : "free";
}
