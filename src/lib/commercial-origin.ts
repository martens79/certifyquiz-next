// src/lib/commercial-origin.ts
//
// "Origine commerciale" del percorso Premium: da quale certificazione e da quale
// paywall l'utente e' partito prima di arrivare al checkout. Serve a tenere
// separati, sul funnel, la certificazione (origin_cert_slug), il punto del
// prodotto che ha proposto Premium (paywall_type) e il prodotto acquistato
// (il piano, deciso in pricing) — invece di perderli tra la CTA e Stripe.
//
// Fonti, in ordine: query string della pricing (?certification_slug=&source=),
// poi l'ultimo click Premium ricordato in sessionStorage (TTL breve, per scheda).
// Nessun dato personale: solo slug e un'etichetta di paywall.

const STORAGE_KEY = "cq_commercial_origin";
const TTL_MS = 2 * 60 * 60 * 1000;
const SLUG_RE = /^[a-z0-9][a-z0-9._-]{0,99}$/;

export type CommercialOrigin = {
  originCertSlug: string | null;
  paywallType: string | null;
};

// Stesso vocabolario di paywall_type gia' emesso da paywall_viewed
// (wrong_explanation, post_explanation_quiz_limit, guide, review) piu' "map".
// Deve restare allineato a PAYWALL_TYPE_BY_EVENT nel backend
// (services/funnelExport.js), che lo usa come ripiego sui dati storici.
export const PAYWALL_TYPE_BY_EVENT: Readonly<Record<string, string>> = {
  premium_clicked_locked_explanation: "wrong_explanation",
  premium_clicked_post_gate_quiz_limit: "post_explanation_quiz_limit",
  premium_clicked_review_gate: "review",
  premium_clicked_guide_gate: "guide",
  premium_clicked_map_locked: "map",
};

// Valori di ?source= usati nei link verso la pricing.
export const PAYWALL_TYPE_BY_SOURCE: Readonly<Record<string, string>> = {
  explanation_paywall: "wrong_explanation",
  post_gate_quiz_limit: "post_explanation_quiz_limit",
  review_gate: "review",
  guide_preview: "guide",
  map_preview: "map",
};

export function normalizeSlug(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim().toLowerCase();
  return SLUG_RE.test(trimmed) ? trimmed : null;
}

export function paywallTypeForEvent(event: string): string | null {
  return PAYWALL_TYPE_BY_EVENT[event] ?? null;
}

type StorageLike = Pick<Storage, "getItem" | "setItem">;

function defaultStorage(): StorageLike | null {
  try {
    return typeof sessionStorage === "undefined" ? null : sessionStorage;
  } catch {
    return null;
  }
}

/**
 * Ricorda l'ultimo click Premium. Semantica "ultimo click": un click senza
 * certificazione (es. voce Pricing dell'header) azzera l'origine precedente
 * invece di lasciarne una vecchia e potenzialmente sbagliata.
 */
export function rememberCommercialOrigin(
  origin: { certSlug?: unknown; paywallType?: unknown },
  { storage = defaultStorage(), now = Date.now() }: { storage?: StorageLike | null; now?: number } = {}
): void {
  if (!storage) return;
  try {
    storage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        originCertSlug: normalizeSlug(origin.certSlug),
        paywallType: normalizeSlug(origin.paywallType),
        recordedAt: now,
      })
    );
  } catch {
    // storage pieno/bloccato: l'attribuzione e' best-effort, mai bloccante.
  }
}

function readStored(storage: StorageLike, now: number): CommercialOrigin | null {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { originCertSlug?: unknown; paywallType?: unknown; recordedAt?: unknown };
    if (typeof parsed.recordedAt !== "number" || now - parsed.recordedAt > TTL_MS) return null;
    return {
      originCertSlug: normalizeSlug(parsed.originCertSlug),
      paywallType: normalizeSlug(parsed.paywallType),
    };
  } catch {
    return null;
  }
}

/**
 * Origine da usare al checkout. I parametri espliciti della pricing hanno la
 * precedenza (sono l'ultimo click); il valore ricordato copre le CTA che
 * linkano alla pricing senza parametri (header, card certificazione, teaser).
 */
export function resolveCommercialOrigin(
  search: string,
  { storage = defaultStorage(), now = Date.now() }: { storage?: StorageLike | null; now?: number } = {}
): CommercialOrigin {
  const params = new URLSearchParams(search);
  const fromUrl: CommercialOrigin = {
    // guide_slug: i link dalla guida usano lo slug della guida, che coincide con quello della certificazione.
    originCertSlug: normalizeSlug(params.get("certification_slug")) ?? normalizeSlug(params.get("guide_slug")),
    paywallType: PAYWALL_TYPE_BY_SOURCE[params.get("source") ?? ""] ?? null,
  };
  const stored = storage ? readStored(storage, now) : null;
  return {
    originCertSlug: fromUrl.originCertSlug ?? stored?.originCertSlug ?? null,
    paywallType: fromUrl.paywallType ?? stored?.paywallType ?? null,
  };
}
