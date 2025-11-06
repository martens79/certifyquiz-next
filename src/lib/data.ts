// src/lib/data.ts
import "server-only";

/**
 * Data layer SEO-friendly con ISR:
 *  - tag: "certs:list" (lista) e `cert:${slug}` (dettaglio)
 *  - revalidate fallback: 24h (86400)
 */

export type Cert = {
  slug: string;
  locale: "it" | "en" | "fr" | "es";
  title: string;
  h1: string;
  intro: string;
  seoDescription: string;
  faq: { q: string; a: string }[];
  // NEW: immagine opzionale per OG/cover
  imageUrl?: string;
  // opzionali (se il backend usa nomi diversi)
  ogImage?: string;
  image?: string;
};
export type Locale = Cert["locale"];

// Usa il proxy Next se non definisci API_BASE_URL (vedi app/api/backend/*)
const API = "/api/backend";

// ✅ Slug già online/abilitati in staging (lista bianca)
const LIVE = new Set([
  "jncie",
  "f5",
  "aws-cloud-practitioner",
  "cisco-ccst-networking",
  // aggiunti per test
  "eipass",
  "pekit",
  "ecdl",
]);

/* ---------------------------- Helpers & guards ---------------------------- */

const IS_BUILD = process.env.NEXT_PHASE === "phase-production-build";

function isRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object";
}
function getString(r: Record<string, unknown>, key: string): string | undefined {
  const v = r[key];
  return typeof v === "string" ? v : undefined;
}
function getNumber(r: Record<string, unknown>, key: string): number | undefined {
  const v = r[key];
  return typeof v === "number" ? v : undefined;
}
function getBoolean(r: Record<string, unknown>, key: string): boolean | undefined {
  const v = r[key];
  return typeof v === "boolean" ? v : undefined;
}
const sanitize = (s?: string) => (s ?? "").trim();

const slugify = (s: unknown) =>
  String(s ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function normalizeFaq(x: unknown): { q: string; a: string }[] {
  if (!Array.isArray(x)) return [];
  const out: { q: string; a: string }[] = [];
  for (const it of x) {
    if (!isRecord(it)) continue;
    const q = getString(it, "q") ?? getString(it, "question") ?? "";
    const a = getString(it, "a") ?? getString(it, "answer") ?? "";
    if (q || a) out.push({ q, a });
  }
  return out;
}

/** name localizzato se disponibile, altrimenti fallback a name; sempre trim */
function pickNameByLocale(raw: Record<string, unknown>, locale: Locale): string {
  const byLocale: Record<Locale, string | undefined> = {
    it: getString(raw, "name"),
    en: getString(raw, "name_en"),
    fr: getString(raw, "name_fr"),
    es: getString(raw, "name_es"),
  };
  return sanitize(byLocale[locale]) || sanitize(getString(raw, "name")) || "";
}

/** ✅ accetta sia Response che Promise<Response> (fix TS2345) */
async function okOrThrow(res: Response | Promise<Response>) {
  const r = await res;
  if (!r.ok) {
    const text = await r.text().catch(() => "");
    throw new Error(`Fetch failed ${r.status}: ${text}`);
  }
  return r;
}

/** Tipizzazione dell’opzione `next` per fetch (evita TS2345 sugli oggetti literal) */
type NextFetchInit = RequestInit & { next?: { revalidate?: number; tags?: string[] } };

/** fetch con timeout (default 3000ms) */
async function fetchWithTimeout(input: RequestInfo | URL, init: NextFetchInit = {}, ms = 3000) {
  const ac = new AbortController();
  const id = setTimeout(() => ac.abort(), ms);
  try {
    return await fetch(input, { ...init, signal: ac.signal });
  } finally {
    clearTimeout(id);
  }
}

/** Converte URL relativa in assoluta rispetto al sito */
function toAbsoluteUrl(url?: string): string | undefined {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  const BASE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com").replace(/\/+$/, "");
  const clean = url.startsWith("/") ? url : `/${url}`;
  return `${BASE}${clean}`;
}

/** Estrae l’immagine dal payload, accettando vari campi possibili */
function pickImageUrl(rec: Record<string, unknown>): string | undefined {
  const candidates = [
    getString(rec, "imageUrl"),
    getString(rec, "ogImage"),
    getString(rec, "image"),
    getString(rec, "image_url"),
  ].filter(Boolean) as string[];
  return toAbsoluteUrl(candidates[0]);
}

/* --------------------------------- MOCK ---------------------------------- */

const MOCK: Cert[] = [
  {
    slug: "jncie",
    locale: "it",
    title: "JNCIE",
    h1: "JNCIE — Juniper Networks Certified Internet Expert",
    intro: "Preparati all’esame JNCIE con quiz realistici e spiegazioni.",
    seoDescription: "Quiz JNCIE con spiegazioni in italiano per preparare l’esame Expert di Juniper.",
    faq: [{ q: "Quanto dura l’esame JNCIE?", a: "Dipende dalla traccia; tipicamente è un lab di più ore." }],
    imageUrl: "/og/cert-default.png",
  },
  {
    slug: "f5",
    locale: "it",
    title: "F5 Certified Professional",
    h1: "F5 Certified Professional",
    intro: "Application delivery e sicurezza: metti alla prova le tue competenze.",
    seoDescription: "Quiz per certificazioni F5 con focus su ADC e sicurezza applicativa.",
    faq: [],
    imageUrl: "/og/cert-default.png",
  },
  {
    slug: "aws-cloud-practitioner",
    locale: "it",
    title: "AWS Cloud Practitioner",
    h1: "AWS Certified Cloud Practitioner",
    intro: "Fondamenti del cloud AWS: servizi base, pricing e best practice.",
    seoDescription: "Quiz AWS Cloud Practitioner in italiano con spiegazioni passo-passo.",
    faq: [],
    imageUrl: "/og/cert-default.png",
  },
  {
    slug: "cisco-ccst-networking",
    locale: "it",
    title: "Cisco CCST – Networking",
    h1: "Cisco CCST – Networking",
    intro: "Reti di base, modelli, indirizzamento e troubleshooting entry-level.",
    seoDescription: "Quiz Cisco CCST Networking con spiegazioni e domande aggiornate.",
    faq: [],
    imageUrl: "/og/cert-default.png",
  },

  // 👇 MOCK minimi per staging (nuovi)
  {
    slug: "eipass",
    locale: "it",
    title: "EIPASS",
    h1: "EIPASS",
    intro: "Quiz e spiegazioni per EIPASS.",
    seoDescription: "Allenati per EIPASS con domande aggiornate.",
    faq: [],
    imageUrl: "/og/cert-default.png",
  },
  {
    slug: "pekit",
    locale: "it",
    title: "PEKIT",
    h1: "PEKIT",
    intro: "Quiz e spiegazioni per PEKIT.",
    seoDescription: "Allenati per PEKIT con domande aggiornate.",
    faq: [],
    imageUrl: "/og/cert-default.png",
  },
  {
    slug: "ecdl",
    locale: "it",
    title: "ECDL",
    h1: "ECDL",
    intro: "Quiz e spiegazioni per ECDL/ICDL.",
    seoDescription: "Allenati per ICDL/ECDL con domande aggiornate.",
    faq: [],
    imageUrl: "/og/cert-default.png",
  },
];

/* =============================== Public API =============================== */

/** Slugs disponibili (utile per sitemap) */
export async function getAllCertSlugs(locale: Locale = "it"): Promise<string[]> {
  // In fase di build usiamo i MOCK per evitare timeout
  if (IS_BUILD) {
    return MOCK.filter((c) => c.locale === locale && LIVE.has(c.slug)).map((c) => c.slug);
  }

  const pick = (arr: unknown[]): string[] => {
    const out: string[] = [];
    for (const item of arr) {
      if (isRecord(item)) {
        const s = getString(item, "slug");
        if (s && LIVE.has(s)) out.push(s);
      }
    }
    return out;
  };

  try {
    const r = await okOrThrow(
      fetchWithTimeout(`${API}/certifications?locale=${locale}`, {
        next: { tags: ["certs:list"], revalidate: 86400 },
      } as NextFetchInit)
    );
    const data: unknown = await r.json();

    if (Array.isArray(data)) {
      const slugs = pick(data);
      if (slugs.length) return slugs;
    }
  } catch {
    /* noop → fallback sotto */
  }

  // fallback ai mock, sempre filtrati sui LIVE
  return MOCK.filter((c) => c.locale === locale && LIVE.has(c.slug)).map((c) => c.slug);
}

/** Dettaglio certificazione: supporta sia payload oggetto sia array (backend non filtra `?slug=`) */
export async function getCertBySlug(slug: string, locale: Locale = "it"): Promise<Cert | null> {
  // In fase di build: no fetch → mock
  if (IS_BUILD) {
    return MOCK.find((c) => c.slug === slug && c.locale === locale) ?? null;
  }

  // selettore robusto dall'array
  const pickFromArray = (arr: unknown): Record<string, unknown> | undefined => {
    if (!Array.isArray(arr)) return undefined;
    // 1) match slug preciso
    for (const x of arr) {
      if (isRecord(x) && getString(x, "slug") === slug) return x;
    }
    // 2) fallback: slugify(name) === slug
    for (const x of arr) {
      if (isRecord(x) && slugify(getString(x, "name")) === slug) return x;
    }
    return undefined;
  };

  try {
    // Il proxy può restituire un oggetto o un array non filtrato.
    const r = await okOrThrow(
      fetchWithTimeout(`${API}/certifications/${encodeURIComponent(slug)}?locale=${locale}`, {
        next: { tags: [`cert:${slug}`, "certs:list"], revalidate: 86400 },
      } as NextFetchInit)
    );

    let raw: unknown;
    try {
      raw = await r.json();
    } catch {
      raw = null;
    }

    let obj: Record<string, unknown> | undefined =
      Array.isArray(raw) ? pickFromArray(raw) : (isRecord(raw) ? raw : undefined);

    // Ultimo fallback: scarica la lista e filtra localmente
    if (!obj) {
      const rList = await okOrThrow(
        fetchWithTimeout(`${API}/certifications?locale=${locale}`, {
          next: { tags: ["certs:list"], revalidate: 86400 },
        } as NextFetchInit)
      );
      const arr2: unknown = await rList.json();
      obj = pickFromArray(arr2);
    }

    if (!obj) {
      const fb = MOCK.find((c) => c.slug === slug && c.locale === locale);
      return fb ?? null;
    }

    const title = pickNameByLocale(obj, locale) || slug;
    const h1 = title;

    const intro = getString(obj, "intro") ?? getString(obj, "description") ?? "";

    const seoDescription =
      getString(obj, "seoDescription") ??
      getString(obj, "seo") ??
      getString(obj, "description") ??
      "";

    const faq = normalizeFaq(obj["faq"]);

    return {
      slug, locale, title, h1, intro, seoDescription, faq,
      imageUrl: pickImageUrl(obj),
      ogImage: getString(obj, "ogImage") ?? undefined,
      image: getString(obj, "image") ?? undefined,
    };
  } catch {
    const fb = MOCK.find((c) => c.slug === slug && c.locale === locale);
    return fb ?? null;
  }
}

/** Lista per /[lang]/certificazioni */
export async function getCertList(locale: Locale = "it"): Promise<Cert[]> {
  // In fase di build: no fetch → mock
  if (IS_BUILD) {
    return MOCK.filter((c) => c.locale === locale && LIVE.has(c.slug));
  }

  try {
    const r = await okOrThrow(
      fetchWithTimeout(`${API}/certifications?locale=${locale}`, {
        next: { tags: ["certs:list"], revalidate: 86400 },
      } as NextFetchInit)
    );
    const arr: unknown = await r.json();
    if (!Array.isArray(arr)) throw new Error("Invalid array");

    const list: Cert[] = [];
    for (const raw of arr) {
      if (!isRecord(raw)) continue;

      const slug = getString(raw, "slug");
      if (!slug || !LIVE.has(slug)) continue; // 👈 gate: mostra solo gli slug live

      const title = pickNameByLocale(raw, locale) || slug;
      const h1 = title;
      const intro = getString(raw, "intro") ?? getString(raw, "description") ?? "";
      const seoDescription =
        getString(raw, "seoDescription") ??
        getString(raw, "seo") ??
        getString(raw, "description") ??
        "";
      const faq = normalizeFaq(raw["faq"]);

      list.push({
        slug, locale, title, h1, intro, seoDescription, faq,
        imageUrl: pickImageUrl(raw),
        ogImage: getString(raw, "ogImage") ?? undefined,
        image: getString(raw, "image") ?? undefined,
      });
    }

    // fallback ai mock, sempre filtrati sui LIVE
    return list.length ? list : MOCK.filter((c) => c.locale === locale && LIVE.has(c.slug));
  } catch {
    return MOCK.filter((c) => c.locale === locale && LIVE.has(c.slug));
  }
}

/* ---------------------------- Quiz intro (SSR) ---------------------------- */

export type QuizIntro = {
  title: string;
  subtitle?: string;
  questionCount?: number;
  premiumRequired?: boolean;
  seoDescription?: string;
};

// endpoint robusto: prova /quiz-intro/:slug, poi fallback da /certifications/:slug
export async function getQuizIntroBySlug(slug: string, locale: Locale = "it"): Promise<QuizIntro | null> {
  // In fase di build: deriviamo dai dati della certificazione
  if (IS_BUILD) {
    const cert = MOCK.find((c) => c.slug === slug && c.locale === locale);
    return cert
      ? { title: cert.title, subtitle: cert.intro, seoDescription: cert.seoDescription || cert.intro }
      : null;
  }

  try {
    const r1 = await okOrThrow(
      fetchWithTimeout(`${API}/quiz-intro/${encodeURIComponent(slug)}?locale=${locale}`, {
        next: { tags: [`quiz:${slug}`, "quiz:intros"], revalidate: 86400 },
      } as NextFetchInit)
    );
    const j1: unknown = await r1.json();
    if (isRecord(j1)) {
      const title = sanitize(getString(j1, "title")) || slug;
      const rec = j1 as Record<string, unknown>;
      return {
        title,
        subtitle: sanitize(getString(rec, "subtitle")),
        questionCount: getNumber(rec, "questionCount"),
        premiumRequired: getBoolean(rec, "premiumRequired"),
        seoDescription: sanitize(getString(rec, "seoDescription")) || sanitize(getString(rec, "description")),
      };
    }
  } catch {
    /* fallback sotto */
  }

  // Fallback: derive dall’oggetto certificazione (intro/descrizione)
  try {
    const cert = await getCertBySlug(slug, locale);
    if (!cert) return null;
    return {
      title: cert.title,
      subtitle: cert.intro,
      seoDescription: cert.seoDescription || cert.intro,
    };
  } catch {
    return null;
  }
}
/* ------------------------------- URL helper ------------------------------- */

export const certPath = (lang: "it" | "en" | "fr" | "es", slug: string): string => {
  switch (lang) {
    case "it":
      return `/it/certificazioni/${slug}`;
    case "en":
      return `/en/certifications/${slug}`;
    case "fr":
      return `/fr/certifications/${slug}`;
    case "es":
      return `/es/certificaciones/${slug}`;
    default:
      return `/it/certificazioni/${slug}`;
  }
};
