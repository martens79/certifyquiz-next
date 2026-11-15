// src/lib/analytics-privacy.ts
//
// Cosa NON deve mai uscire verso gli strumenti di analytics (funnel DB, GA4, Meta Pixel):
//  - indirizzi email e altri dati anagrafici nei payload;
//  - segreti che viaggiano nell'URL (token di reset password, token di login Google, codici OAuth, id di sessione di pagamento).
// Gli identificatori tecnici strettamente necessari all'attribuzione restano: session_id/visitor_id anonimi
// (UUID casuali), page_view_id, gate_instance_id, cert_slug, paywall_type. L'user_id lo ricava il backend dal token.

/** Chiavi vietate nei payload analytics (confronto case-insensitive, anche annidate in metadata). */
export const FORBIDDEN_PAYLOAD_KEYS = [
  "email", "e_mail", "mail", "user_email", "customer_email",
  "username", "user_name", "first_name", "last_name", "full_name", "phone", "telephone",
  "password", "token", "access_token", "refresh_token", "id_token", "client_secret", "api_key",
] as const;

const EMAIL_VALUE_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;

export function looksLikeEmail(value: unknown): boolean {
  return typeof value === "string" && EMAIL_VALUE_RE.test(value);
}

/**
 * Copia dell'oggetto senza chiavi vietate e senza valori che sembrano email.
 * Lavora in profondita' (oggetti e array) con un limite di sicurezza.
 */
export function scrubAnalyticsPayload<T>(input: T, depth = 0): T {
  if (depth > 6 || input === null || typeof input !== "object") return input;
  if (Array.isArray(input)) return input.map((v) => scrubAnalyticsPayload(v, depth + 1)).filter((v) => !looksLikeEmail(v)) as unknown as T;
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    if ((FORBIDDEN_PAYLOAD_KEYS as readonly string[]).includes(key.toLowerCase())) continue;
    if (looksLikeEmail(value)) continue;
    out[key] = scrubAnalyticsPayload(value, depth + 1);
  }
  return out as T;
}

/** Parametri di query che non devono mai arrivare a servizi esterni. */
export const SENSITIVE_QUERY_KEYS = [
  "token", "access_token", "refresh_token", "id_token", "code", "state", "email", "password", "otp",
  "secret", "client_secret", "key", "reset", "session_id", "payment_intent", "setup_intent",
] as const;

/**
 * Pagine il cui URL contiene segreti: li' GA4 e Pixel non devono nemmeno partire.
 * (La pagina di esito pagamento NON e' qui: serve alle conversioni; il suo session_id viene tolto da sanitizeAnalyticsUrl.)
 */
const SENSITIVE_PATH_RES = [
  /^\/(?:(?:it|en|fr|es)\/)?reset-password(?:\/|$)/i,
  /^\/(?:(?:it|en|fr|es)\/)?forgot-password(?:\/|$)/i,
  /^\/auth\/callback(?:\/|$)/i,
];

export function isSensitiveAnalyticsPath(pathname: unknown): boolean {
  return typeof pathname === "string" && SENSITIVE_PATH_RES.some((re) => re.test(pathname));
}

/** URL pronto per analytics: senza parametri sensibili; sulle pagine sensibili anche senza alcuna query. */
export function sanitizeAnalyticsUrl(href: string): string {
  try {
    const url = new URL(href);
    if (isSensitiveAnalyticsPath(url.pathname)) {
      url.search = "";
      url.hash = "";
      return url.toString();
    }
    for (const key of [...url.searchParams.keys()]) {
      if ((SENSITIVE_QUERY_KEYS as readonly string[]).includes(key.toLowerCase())) url.searchParams.delete(key);
    }
    if (/(?:^|[#&])(?:access_token|id_token|token|code)=/i.test(url.hash)) url.hash = "";
    return url.toString();
  } catch {
    return "";
  }
}
