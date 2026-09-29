// src/lib/legacyRedirects.ts
//
// Redirect legacy (301) recuperati dal vecchio next.config.ts.
//
// Quel file non è mai stato caricato: Next cerca next.config.js → .mjs → .ts
// e si ferma al primo trovato, quindi vinceva sempre next.config.mjs.
// Audit 2026-09-29 (476 regole, confrontate una per una con la produzione):
// qui sono migrate SOLO le regole che oggi finiscono in 404 e hanno una
// destinazione viva. Scartate: duplicate, oscurate da wildcard, già gestite
// dal middleware, in conflitto con decisioni più recenti del middleware,
// che redirigevano pagine vive, con destinazione morta o in loop.
//
// Regole:
// - ogni destinazione è la pagina finale (un solo salto, nessuna catena);
// - le destinazioni localizzate usano gli slug canonici di src/lib/paths.ts;
// - il middleware consulta questo modulo PRIMA della normalizzazione /en e
//   delle regole prefix generiche (es. google-cloud → google-cloud-digital-leader).

import { categoryPath, type CategoryKey, type Locale } from "./paths";

/* ------------------------------------------------------------------ */
/* Vecchie radici categoria: /{it,fr,es,en}/<slug-italiano>             */
/* ------------------------------------------------------------------ */

const LEGACY_CATEGORY_ROOTS: Record<string, CategoryKey> = {
  base: "base",
  sicurezza: "sicurezza",
  reti: "reti",
  cloud: "cloud",
  database: "database",
  programmazione: "programmazione",
  virtualizzazione: "virtualizzazione",
  "intelligenza-artificiale": "ai",
};

const CATEGORY_ROOT_LOCALES: Locale[] = ["it", "fr", "es", "en"];

function buildCategoryRootRedirects(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const lang of CATEGORY_ROOT_LOCALES) {
    for (const [legacySlug, key] of Object.entries(LEGACY_CATEGORY_ROOTS)) {
      out[`/${lang}/${legacySlug}`] = categoryPath(lang, key);
    }
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Vecchi topic CCST Cybersecurity (pre-riscrittura, stile CEH)         */
/* → pagina certificazione                                              */
/* ------------------------------------------------------------------ */

const CCST_CYBER_LEGACY_TOPICS: Record<Locale, { base: string; slugs: string[] }> = {
  it: {
    base: "/it/certificazioni/cisco-ccst-cybersecurity",
    slugs: [
      "raccolta-informazioni-e-footprinting",
      "tecniche-di-scansione-di-rete-e-porte",
      "enumerazione-di-servizi-e-utenti",
      "identificazione-delle-vulnerabilita",
      "accesso-e-mantenimento-sui-sistemi",
      "tipi-e-comportamenti-dei-malware",
      "intercettazione-e-dirottamento-sessioni",
      "tecniche-di-ingegneria-sociale",
      "attacchi-alle-applicazioni-web",
    ],
  },
  en: {
    base: "/certifications/cisco-ccst-cybersecurity",
    slugs: [
      "information-gathering-and-footprinting",
      "network-and-port-scanning-techniques",
      "service-and-user-enumeration",
      "vulnerability-identification",
      "access-and-maintenance-on-systems",
      "types-and-behaviors-of-malware",
      "session-interception-and-hijacking",
      "social-engineering-techniques",
      "web-application-attacks",
    ],
  },
  fr: {
    base: "/fr/certifications/cisco-ccst-cybersecurity",
    slugs: [
      "collecte-dinformations-et-footprinting",
      "techniques-de-scan-de-reseau-et-de-port",
      "enumeration-de-services-et-dutilisateurs",
      "identification-des-vulnerabilites",
      "acces-et-maintenance-sur-les-systemes",
      "types-et-comportements-des-malwares",
      "interception-et-detournement-de-sessions",
      "techniques-dingenierie-sociale",
      "attaques-sur-les-applications-web",
    ],
  },
  es: {
    base: "/es/certificaciones/cisco-ccst-cybersecurity",
    slugs: [
      "recopilacion-de-informacion-y-footprinting",
      "tecnicas-de-escaneo-de-red-y-puertos",
      "enumeracion-de-servicios-y-usuarios",
      "identificacion-de-vulnerabilidades",
      "acceso-y-mantenimiento-en-sistemas",
      "tipos-y-comportamientos-de-malware",
      "intercepcion-y-secuestro-de-sesiones",
      "tecnicas-de-ingenieria-social",
      "ataques-a-aplicaciones-web",
    ],
  },
};

function buildCcstCyberRedirects(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const { base, slugs } of Object.values(CCST_CYBER_LEGACY_TOPICS)) {
    for (const slug of slugs) out[`${base}/${slug}`] = base;
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Privacy / Terms                                                      */
/* ------------------------------------------------------------------ */

const LEGAL_REDIRECTS: Record<string, string> = {
  "/privacy-policy": "/privacy",
  "/en/privacy-policy": "/privacy",
  "/it/privacy-policy": "/it/privacy",
  "/fr/privacy-policy": "/fr/privacy",
  "/es/privacy-policy": "/es/privacy",
  // La pagina termini EN è /terms (/terms-conditions non esiste).
  "/terms-conditions": "/terms",
  "/en/terms-conditions": "/terms",
  "/fr/terms-conditions": "/fr/conditions",
  "/es/terms-conditions": "/es/terminos",
  // /it/terms-conditions è già gestito nel middleware.
};

/* ------------------------------------------------------------------ */
/* Singoli slug legacy                                                  */
/* ------------------------------------------------------------------ */

const SINGLE_REDIRECTS: Record<string, string> = {
  "/fr/certifications/cisco-ccst": "/fr/certifications/cisco-ccst-networking",
  "/en/certifications/itfplus": "/certifications/comptia-itf-plus",
  "/certifications/ai-foundations/generative-ai-and-real-world-applications":
    "/certifications/ai-foundations/generative-ai-real-world-applications",

  // Google Cloud Digital Leader: vecchi slug di topic. Vanno risolti prima
  // del prefix generico google-cloud → google-cloud-digital-leader del
  // middleware, che manterrebbe lo slug vecchio (inesistente).
  "/it/certificazioni/google-cloud/trasformazione-digitale-google-cloud":
    "/it/certificazioni/google-cloud-digital-leader/trasformazione-digitale-con-google-cloud",
  "/fr/certifications/google-cloud/transformation-numerique-google-cloud":
    "/fr/certifications/google-cloud-digital-leader/transformation-numerique-avec-google-cloud",
  "/fr/certifications/google-cloud/donnees-ia-innovation":
    "/fr/certifications/google-cloud-digital-leader/innovation-avec-les-donnees-et-google-cloud",

  // URL sporchi visti in Search Console
  "/esundefined": "/es",
  "/base-quiz": "/certifications",
};

export const LEGACY_EXACT_REDIRECTS: Readonly<Record<string, string>> = Object.freeze({
  ...buildCategoryRootRedirects(),
  ...buildCcstCyberRedirects(),
  ...LEGAL_REDIRECTS,
  ...SINGLE_REDIRECTS,
});

/* ------------------------------------------------------------------ */
/* Prefix (solo dove serve davvero)                                     */
/* ------------------------------------------------------------------ */

export const LEGACY_PREFIX_REDIRECTS: ReadonlyArray<{ prefix: string; destination: string }> = [
  // Vecchi topic sotto lo slug network-plus: lo slug canonico è
  // comptia-network-plus e i topic non hanno equivalenti 1:1 → pagina cert.
  {
    prefix: "/es/certificaciones/network-plus/",
    destination: "/es/certificaciones/comptia-network-plus",
  },
];

/**
 * Ritorna la destinazione del redirect legacy per `pathname`, oppure null.
 */
export function resolveLegacyRedirect(pathname: string): string | null {
  const exact = LEGACY_EXACT_REDIRECTS[pathname];
  if (exact) return exact;

  for (const { prefix, destination } of LEGACY_PREFIX_REDIRECTS) {
    if (pathname.startsWith(prefix)) return destination;
  }

  return null;
}
