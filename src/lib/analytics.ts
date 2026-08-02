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

type FunnelEventBody = {
  event: string;
  email?: string | null;
  cert_slug?: string | null;
  topic_slug?: string | null;
  lang?: string | null;
  score?: number | null;
  plan?: string | null;
};

/**
 * Scrive un evento in funnel_events (DB), pensato per i click seguiti
 * subito da una navigazione (redirect/router.push). Una fetch normale
 * fire-and-forget viene abortita dal browser se la pagina inizia a
 * scaricarsi prima che la richiesta risponda: usiamo sendBeacon (pensato
 * apposta per sopravvivere all'unload) con fallback a fetch keepalive per
 * i browser che non lo supportano.
 */
export function trackFunnelEvent(
  body: FunnelEventBody,
  endpoint = "/api/backend/funnel-event"
) {
  if (typeof window === "undefined") return;

  const payload = JSON.stringify(body);

  if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    const blob = new Blob([payload], { type: "application/json" });
    if (navigator.sendBeacon(endpoint, blob)) return;
  }

  fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    keepalive: true,
    body: payload,
  }).catch(() => {});
}
