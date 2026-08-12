// src/lib/analytics.ts
// Helper GA4 condiviso, stesso pattern gia' in uso in QuizEngine.tsx
// (trackQuizEvent): guardie su window/gtag, nessuna eccezione se GA non e'
// ancora caricato. Qui non e' hardcoded event_category='quiz' perche' i
// chiamanti coprono aree diverse (mappe, materiale di studio, premium).
//
// "use client" non serve qui: il file non ha side effect a livello di
// modulo, il guard su typeof window basta a renderlo innocuo in SSR.

type TrackParams = Record<string, string | number | boolean | null | undefined>;

export type AnalyticsUserState = "anonymous" | "free" | "trial" | "premium";

const SESSION_KEY = "cq_analytics_session";
const onceKeys = new Set<string>();
const pendingEvents: Array<{ eventName: string; params: TrackParams }> = [];

function getAnonymousSessionId(): string | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    let value = sessionStorage.getItem(SESSION_KEY);
    if (!value) {
      value = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, value);
    }
    return value;
  } catch {
    return undefined;
  }
}

/**
 * "production" | "preview" | "development", da NEXT_PUBLIC_APP_ENV (iniettata
 * in next.config.ts da VERCEL_ENV). Allegato a ogni evento perché un solo
 * GA4 stream copre oggi tutti gli ambienti: senza questo campo i click di
 * anteprima/dev contaminerebbero i KPI di produzione (rilevante per
 * l'esperimento Rewarded Ads, che va misurato solo su traffico reale).
 */
export function getAnalyticsEnvironment(): string {
  return process.env.NEXT_PUBLIC_APP_ENV || "development";
}

export function trackEvent(eventName: string, params: TrackParams = {}) {
  if (typeof window === "undefined") return;

  const w = window as typeof window & { gtag?: (...args: unknown[]) => void };
  if (typeof w.gtag !== "function") {
    pendingEvents.push({ eventName, params });
    return;
  }

  w.gtag("event", eventName, {
    anonymous_session_id: getAnonymousSessionId(),
    environment: getAnalyticsEnvironment(),
    ...params,
  });
}

/** Invia gli eventi partiti prima che lo script GA4 fosse pronto. */
export function flushPendingAnalyticsEvents() {
  if (typeof window === "undefined") return;
  const w = window as typeof window & { gtag?: (...args: unknown[]) => void };
  if (typeof w.gtag !== "function") return;

  const queued = pendingEvents.splice(0, pendingEvents.length);
  queued.forEach(({ eventName, params }) => trackEvent(eventName, params));
}

/** Evita duplicazioni dovute a Strict Mode, rerender e navigazione client-side. */
export function trackEventOnce(
  dedupeKey: string,
  eventName: string,
  params: TrackParams = {}
) {
  if (onceKeys.has(dedupeKey)) return;
  onceKeys.add(dedupeKey);
  trackEvent(eventName, params);
}

/** user_status per gli eventi: mai id/email, solo lo stato d'accesso. */
export type UserStatus = "anonymous" | "free" | "premium";

export function userStatusFrom(user: { premium?: boolean } | null): UserStatus {
  if (!user) return "anonymous";
  return user.premium ? "premium" : "free";
}

export function analyticsUserStateFrom(user: { premium?: boolean; trial?: boolean } | null): AnalyticsUserState {
  if (!user) return "anonymous";
  if (user.trial) return "trial";
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
