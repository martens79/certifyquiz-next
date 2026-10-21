// src/lib/checkout-intent.ts
//
// Intenzione di acquisto Premium di un visitatore NON autenticato: conserva il
// piano scelto mentre passa da login/registrazione (anche Google, che esce dal
// sito e torna sulla stessa scheda), cosi' la pricing puo' riprendere da dove
// era rimasto invece di chiedergli di ripartire.
//
// Regole di sicurezza:
// - niente checkout prima dell'autenticazione: questo modulo non chiama mai
//   Stripe, decide solo *se* e *con quale piano* riprendere;
// - la ripresa automatica richiede due prove insieme: parametri `resume=1&plan=`
//   nell'URL di ritorno E un'intenzione salvata in questa scheda (sessionStorage),
//   valida (TTL breve), di uso singolo e con lo stesso piano. Un link copiato,
//   un segnalibro o un parametro manipolato non avviano mai un pagamento;
// - redirect solo interni (stesso filtro di conversion-context) e query
//   ricostruita da un elenco chiuso di chiavi, mai copiata cosi' com'e';
// - nessun dato personale: piano, slug, etichette fisse.

import { normalizeCtaId, normalizeSlug } from "@/lib/commercial-origin";
import { safeInternalRedirect, withConversionContext } from "@/lib/conversion-context";

export const CHECKOUT_PLANS = ["premium_monthly", "premium_quarterly", "premium_annual"] as const;
export type CheckoutPlan = (typeof CHECKOUT_PLANS)[number];

export const CHECKOUT_SOURCE = "premium_checkout";

// Le Preview Vercel e gli host di prova usano comunque il backend e Stripe LIVE (il rewrite verso
// api.certifyquiz.com e' fisso): un click su "Start Premium" creerebbe una vera sessione di pagamento.
// Il checkout si avvia solo dal sito di produzione e da localhost (sviluppo/E2E con mock).
const CHECKOUT_ALLOWED_HOSTS = ["www.certifyquiz.com", "certifyquiz.com", "localhost", "127.0.0.1", "[::1]"];
export function isCheckoutAllowedHost(hostname: unknown): boolean {
  return typeof hostname === "string" && CHECKOUT_ALLOWED_HOSTS.includes(hostname.toLowerCase());
}
export const CHECKOUT_BLOCKED_NOTICE =
  "Checkout disabled on preview/test deployments: it would use the LIVE payment backend. Test on localhost with mocks or on www.certifyquiz.com.";
const STORAGE_KEY = "cq_checkout_intent";
export const INTENT_TTL_MS = 30 * 60 * 1000;
const LABEL_RE = /^[a-z0-9][a-z0-9_-]{0,63}$/i;

export type CheckoutIntent = {
  plan: CheckoutPlan;
  promo: string | null; // valore di ?promo= (solo etichetta fissa), null se assente
  originCertSlug: string | null;
  paywallSource: string | null; // valore di ?source= (etichetta)
  ctaId: string | null;
  createdAt: number;
};

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function defaultStorage(): StorageLike | null {
  try {
    return typeof sessionStorage === "undefined" ? null : sessionStorage;
  } catch {
    return null;
  }
}

export function normalizePlan(value: unknown): CheckoutPlan | null {
  return typeof value === "string" && (CHECKOUT_PLANS as readonly string[]).includes(value) ? (value as CheckoutPlan) : null;
}

function label(value: unknown): string | null {
  return typeof value === "string" && LABEL_RE.test(value) ? value : null;
}

export function saveCheckoutIntent(
  input: { plan: unknown; promo?: unknown; originCertSlug?: unknown; paywallSource?: unknown; ctaId?: unknown },
  { storage = defaultStorage(), now = Date.now() }: { storage?: StorageLike | null; now?: number } = {}
): CheckoutIntent | null {
  const plan = normalizePlan(input.plan);
  if (!plan) return null;
  const intent: CheckoutIntent = {
    plan,
    promo: label(input.promo),
    originCertSlug: normalizeSlug(input.originCertSlug),
    paywallSource: label(input.paywallSource),
    ctaId: normalizeCtaId(input.ctaId),
    createdAt: now,
  };
  if (!storage) return intent;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(intent));
  } catch {
    // storage pieno/bloccato: senza intenzione salvata la ripresa non e' automatica
    // ma il percorso resta valido (l'utente preme il pulsante al ritorno).
  }
  return intent;
}

function parse(raw: string | null, now: number): CheckoutIntent | null {
  if (!raw) return null;
  try {
    const p = JSON.parse(raw) as Record<string, unknown>;
    const plan = normalizePlan(p.plan);
    if (!plan || typeof p.createdAt !== "number") return null;
    if (now - p.createdAt > INTENT_TTL_MS || p.createdAt > now + 60_000) return null;
    return {
      plan,
      promo: label(p.promo),
      originCertSlug: normalizeSlug(p.originCertSlug),
      paywallSource: label(p.paywallSource),
      ctaId: normalizeCtaId(p.ctaId),
      createdAt: p.createdAt,
    };
  } catch {
    return null;
  }
}

export function clearCheckoutIntent({ storage = defaultStorage() }: { storage?: StorageLike | null } = {}): void {
  try {
    storage?.removeItem(STORAGE_KEY);
  } catch {
    /* ignora */
  }
}

/** Legge e CANCELLA l'intenzione (uso singolo): una seconda lettura restituisce null. */
export function consumeCheckoutIntent({
  storage = defaultStorage(),
  now = Date.now(),
}: { storage?: StorageLike | null; now?: number } = {}): CheckoutIntent | null {
  if (!storage) return null;
  let raw: string | null = null;
  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
  clearCheckoutIntent({ storage });
  return parse(raw, now);
}

// Chiavi della query della pricing che sopravvivono al giro login/registrazione.
const PASS_THROUGH_KEYS = ["source", "certification_slug", "guide_slug", "cert_slug", "cta", "promo"] as const;

/**
 * URL di ritorno dalla pricing dopo l'autenticazione: percorso interno della
 * pricing + solo le chiavi note + `plan` valido + `resume=1`.
 */
export function buildResumePath(pricingPathname: string, search: string, plan: unknown): string | null {
  const validPlan = normalizePlan(plan);
  if (!validPlan) return null;
  const path = safeInternalRedirect(pricingPathname.split("?")[0].split("#")[0]);
  if (!path) return null;
  const source = new URLSearchParams(search);
  const out = new URLSearchParams();
  for (const key of PASS_THROUGH_KEYS) {
    const value = source.get(key);
    if (!value) continue;
    const ok = key === "cta" ? normalizeCtaId(value) : key.endsWith("slug") ? normalizeSlug(value) : label(value);
    if (ok) out.set(key, String(ok));
  }
  out.set("plan", validPlan);
  out.set("resume", "1");
  return `${path}?${out.toString()}`;
}

/** Link alla pagina di login (che propone anche la registrazione e Google) con ritorno alla pricing. */
export function buildLoginHref(lang: string, resumePath: string | null): string {
  const safeLang = /^(it|en|fr|es)$/.test(lang) ? lang : "en";
  return withConversionContext(`/${safeLang}/login`, { source: CHECKOUT_SOURCE, redirect: resumePath });
}

export type ResumeDecision = "none" | "auto" | "manual";

/**
 * Cosa fare quando la pricing si carica.
 * - "none": nessuna richiesta di ripresa (o utente non autenticato / gia' Premium);
 * - "auto": ripresa con il piano `plan` (intenzione valida, stessa scheda);
 * - "manual": si arriva da un login ma senza intenzione valida (altra scheda,
 *   scaduta, link copiato): si preseleziona il piano e si lascia premere il pulsante.
 */
export function decideResume(args: {
  search: string;
  authenticated: boolean;
  alreadyPremium: boolean;
  intent: CheckoutIntent | null;
}): { decision: ResumeDecision; plan: CheckoutPlan | null } {
  const params = new URLSearchParams(args.search);
  if (params.get("resume") !== "1") return { decision: "none", plan: null };
  const plan = normalizePlan(params.get("plan"));
  if (!plan || !args.authenticated || args.alreadyPremium) return { decision: "none", plan: null };
  if (args.intent && args.intent.plan === plan) return { decision: "auto", plan };
  return { decision: "manual", plan };
}

/** Rimuove i parametri di ripresa dall'URL corrente (da usare con history.replaceState). */
export function stripResumeParams(search: string): string {
  const params = new URLSearchParams(search);
  params.delete("resume");
  params.delete("plan");
  const q = params.toString();
  return q ? `?${q}` : "";
}

const BANNER: Record<string, string> = {
  it: "Per attivare Premium serve un account gratuito: accedi o registrati (anche con Google) e torni direttamente al pagamento.",
  en: "A free account is needed to start Premium: log in or sign up (Google works too) and you'll come straight back to checkout.",
  fr: "Un compte gratuit est nécessaire pour activer Premium : connectez-vous ou inscrivez-vous (Google possible) et vous reviendrez directement au paiement.",
  es: "Se necesita una cuenta gratuita para activar Premium: inicia sesión o regístrate (también con Google) y volverás directamente al pago.",
};
export function checkoutAuthBanner(lang: string): string {
  return BANNER[lang] ?? BANNER.en;
}
