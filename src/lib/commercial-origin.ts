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
  // Punto di partenza del click Premium (vedi PREMIUM_CTA_IDS). null se la CTA
  // non ne dichiara uno: non si inventa.
  ctaId: string | null;
};

// Identificatori stabili dei punti da cui parte un click verso Premium/pricing.
// Sono etichette fisse (mai testo libero, mai dati utente): l'elenco e' chiuso
// cosi' un valore manipolato in query string o storage viene scartato. Non
// rinominare un id gia' emesso: i report storici lo raggruppano per questo valore.
export const PREMIUM_CTA_IDS = [
  "certification_card", // card "Premium" nella pagina certificazione
  "header_pricing", // voce Pricing dell'header
  "teaser_box", // box teaser Premium nei contenuti
  "quiz_result_unlock", // pulsante nel risultato del quiz
  "quiz_result_upsell", // pulsante upsell a fine quiz (senza evento dedicato)
  "post_gate_quiz_limit", // limite domande dopo il gate
  "wrong_explanation_locked", // spiegazione risposta errata bloccata
  "review_gate", // ripasso bloccato
  "guide_gate", // anteprima guida
  "map_locked", // mappa bloccata
  "mock_review", // revisione simulazione bloccata
  "error_review_gate", // ripasso errori bloccato
  "package_offers_premium", // Premium dentro le offerte pacchetto
] as const;
export type PremiumCtaId = (typeof PREMIUM_CTA_IDS)[number];

export function normalizeCtaId(value: unknown): PremiumCtaId | null {
  return typeof value === "string" && (PREMIUM_CTA_IDS as readonly string[]).includes(value) ? (value as PremiumCtaId) : null;
}

// Tipo di pagina da cui parte il click, derivato dal solo percorso (nessun id,
// nessuna query). Serve a leggere i click senza dover rianalizzare pathname.
export function pageKindForPath(pathname: unknown): string {
  if (typeof pathname !== "string") return "other";
  const segments = pathname.split("?")[0].split("#")[0].split("/").filter(Boolean).map((x) => x.toLowerCase());
  if (segments.length && /^(it|en|fr|es)$/.test(segments[0])) segments.shift();
  const first = segments[0] ?? "";
  if (!first) return "home";
  if (/^(pricing|prezzi|prix|precios)$/.test(first)) return "pricing";
  if (/^(certifications|certificazioni|certificaciones)$/.test(first)) return "certification";
  if (/^(quiz|assessment)$/.test(first)) return "quiz";
  if (/^(reviews?|ripassi|revisions|repasos|resumenes)$/.test(first)) return "review";
  if (/^(guides?|guide|guias)$/.test(first)) return "guide";
  if (/^(maps?|mappe|cartes|mapas)$/.test(first)) return "map";
  if (/^(profile|profilo|profil|perfil)$/.test(first)) return "profile";
  if (/^(interactive-labs?|labs?)$/.test(first)) return "lab";
  if (/^(blog|roadmap|scenarios?|scenari|scenarios|escenarios)$/.test(first)) return first.startsWith("blog") ? "blog" : "content";
  return "other";
}

// Metadati da accodare a un evento premium_clicked*: solo etichette fisse.
export function premiumClickMetadata(ctaId: PremiumCtaId, pathname?: string): { cta_id: PremiumCtaId; page_kind: string } {
  const path = pathname ?? (typeof window !== "undefined" ? window.location.pathname : "");
  return { cta_id: ctaId, page_kind: pageKindForPath(path) };
}

// Accoda ?cta=<id> a un href verso la pricing, cosi' pricing_viewed e checkout
// conservano il punto di partenza. Id non valido: href invariato.
export function withCtaParam(href: string, ctaId: PremiumCtaId): string {
  if (!normalizeCtaId(ctaId)) return href;
  const hashAt = href.indexOf("#");
  const base = hashAt >= 0 ? href.slice(0, hashAt) : href;
  const hash = hashAt >= 0 ? href.slice(hashAt) : "";
  if (/[?&]cta=/.test(base)) return href;
  return `${base}${base.includes("?") ? "&" : "?"}cta=${ctaId}${hash}`;
}

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
  mock_review: "mock_review",
};

export function normalizeSlug(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim().toLowerCase();
  return SLUG_RE.test(trimmed) ? trimmed : null;
}

// Solo chiavi proprie: "?source=constructor" o "__proto__" non devono risolvere
// a membri ereditati di Object.
export function paywallTypeForSource(source: string | null): string | null {
  return source && Object.prototype.hasOwnProperty.call(PAYWALL_TYPE_BY_SOURCE, source) ? PAYWALL_TYPE_BY_SOURCE[source] : null;
}

export function paywallTypeForEvent(event: string): string | null {
  return Object.prototype.hasOwnProperty.call(PAYWALL_TYPE_BY_EVENT, event) ? PAYWALL_TYPE_BY_EVENT[event] : null;
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
  origin: { certSlug?: unknown; paywallType?: unknown; ctaId?: unknown },
  { storage = defaultStorage(), now = Date.now() }: { storage?: StorageLike | null; now?: number } = {}
): void {
  if (!storage) return;
  try {
    storage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        originCertSlug: normalizeSlug(origin.certSlug),
        paywallType: normalizeSlug(origin.paywallType),
        ctaId: normalizeCtaId(origin.ctaId),
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
    const parsed = JSON.parse(raw) as { originCertSlug?: unknown; paywallType?: unknown; ctaId?: unknown; recordedAt?: unknown };
    if (typeof parsed.recordedAt !== "number" || now - parsed.recordedAt > TTL_MS) return null;
    return {
      originCertSlug: normalizeSlug(parsed.originCertSlug),
      paywallType: normalizeSlug(parsed.paywallType),
      ctaId: normalizeCtaId(parsed.ctaId),
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
    // cert_slug: il link del ripasso bloccato usa questo nome (prima veniva ignorato).
    originCertSlug:
      normalizeSlug(params.get("certification_slug")) ??
      normalizeSlug(params.get("guide_slug")) ??
      normalizeSlug(params.get("cert_slug")),
    paywallType: paywallTypeForSource(params.get("source")),
    ctaId: normalizeCtaId(params.get("cta")),
  };
  const stored = storage ? readStored(storage, now) : null;
  return {
    originCertSlug: fromUrl.originCertSlug ?? stored?.originCertSlug ?? null,
    paywallType: fromUrl.paywallType ?? stored?.paywallType ?? null,
    ctaId: fromUrl.ctaId ?? stored?.ctaId ?? null,
  };
}
