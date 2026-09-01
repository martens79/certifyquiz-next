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
const SEQUENCE_KEY = "cq_analytics_sequence";
const onceKeys = new Set<string>();
const pendingEvents: Array<{ eventName: string; params: TrackParams }> = [];
let currentPageView: { pathname: string; id: string } | null = null;
let fallbackSequence = 0;

export function getAnonymousSessionId(): string | undefined {
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

export function trackEvent(eventName: string, params: TrackParams = {}) {
  if (typeof window === "undefined") return;

  const w = window as typeof window & { gtag?: (...args: unknown[]) => void };
  if (typeof w.gtag !== "function") {
    pendingEvents.push({ eventName, params });
    return;
  }

  w.gtag("event", eventName, {
    anonymous_session_id: getAnonymousSessionId(),
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

/** Nomi evento per la nuova UX Review a moduli (vedi FASE 12 del piano). */
export type ReviewModuleEventName =
  | "review_module_started"
  | "review_section_started"
  | "review_section_completed"
  | "review_module_completed"
  | "review_module_assessment_completed";

export function trackReviewModuleEvent(
  eventName: ReviewModuleEventName,
  params: {
    certification_slug: string;
    review_slug: string;
    section_id?: string;
    score?: number;
    total?: number;
    language: string;
    user_state: AnalyticsUserState;
  }
) {
  trackEvent(eventName, params);
}

type FunnelEventBody = {
  event: string;
  email?: string | null;
  cert_slug?: string | null;
  topic_slug?: string | null;
  lang?: string | null;
  score?: number | null;
  plan?: string | null;
  paywall_type?: string | null;
  gate_instance_id?: string | null;
  metadata?: Record<string, JsonValue> | null;
};

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

function currentPathname(): string {
  return window.location?.pathname || "/";
}

export function getPageViewId(): string | undefined {
  if (typeof window === "undefined") return undefined;
  const pathname = currentPathname();
  if (!currentPageView || currentPageView.pathname !== pathname) {
    currentPageView = { pathname, id: crypto.randomUUID() };
  }
  return currentPageView.id;
}

function nextClientSequence(): number {
  if (typeof window === "undefined") return 0;
  try {
    const previous = Number.parseInt(sessionStorage.getItem(SEQUENCE_KEY) || "0", 10);
    const next = Number.isSafeInteger(previous) && previous >= 0 ? previous + 1 : 1;
    sessionStorage.setItem(SEQUENCE_KEY, String(next));
    return next;
  } catch {
    fallbackSequence += 1;
    return fallbackSequence;
  }
}

function safeReferrer(): { referrer_origin: string | null; referrer_path: string | null } {
  if (typeof document === "undefined" || !document.referrer) {
    return { referrer_origin: null, referrer_path: null };
  }
  try {
    const referrer = new URL(document.referrer);
    return {
      referrer_origin: referrer.origin,
      referrer_path: referrer.pathname,
    };
  } catch {
    return { referrer_origin: null, referrer_path: null };
  }
}

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

  const referrer = safeReferrer();
  const metadata = body.metadata || (body.plan ? { plan: body.plan } : null);
  const payload = JSON.stringify({
    ...body,
    metadata,
    event_id: crypto.randomUUID(),
    session_id: getAnonymousSessionId() ?? null,
    pathname: currentPathname(),
    page_view_id: getPageViewId() ?? null,
    client_sequence: nextClientSequence(),
    source_type: "web_client",
    schema_version: 2,
    client_created_at: new Date().toISOString(),
    ...referrer,
  });

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
