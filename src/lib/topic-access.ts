// src/lib/topic-access.ts
// Topic gate (PLC Fundamentals). Backend contract:
// docs/plc-fundamentals/PLC_FUNDAMENTALS_TOPIC_ACCESS_GATE.md (backend repo).
//
// - 403 { error: "TOPIC_PREMIUM_REQUIRED", access: {...}, poolTotal: 0, questions: [] }
//   = the topic is Premium and the user is not entitled. Show the Premium invitation, not an error page.
//   The server answers before serving or counting anything, so no question and no attempt is involved.
// - 404 { error: "TOPIC_NOT_AVAILABLE" } = the topic is not launched.

export const TOPIC_PREMIUM_REQUIRED = "TOPIC_PREMIUM_REQUIRED";
export const TOPIC_NOT_AVAILABLE = "TOPIC_NOT_AVAILABLE";

type ApiErrorLike = { status?: unknown; detail?: { error?: unknown } } | null | undefined;

export function isTopicPremiumRequiredError(err: unknown): boolean {
  const e = err as ApiErrorLike;
  return e?.status === 403 && e?.detail?.error === TOPIC_PREMIUM_REQUIRED;
}

export function isTopicNotAvailableError(err: unknown): boolean {
  const e = err as ApiErrorLike;
  return e?.status === 404 && e?.detail?.error === TOPIC_NOT_AVAILABLE;
}

export type TopicAccessLang = "it" | "en" | "fr" | "es";

export function premiumHref(lang: TopicAccessLang): string {
  return lang === "en" ? "/premium" : `/${lang}/premium`;
}
