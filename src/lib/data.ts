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

  imageUrl?: string;
  ogImage?: string;
  image?: string;

  // Conteggi reali domande per lingua
  questionCount?: number;
  questionCountByLang?: Partial<Record<"it" | "en" | "fr" | "es", number>>;
};
export type TopicReviewListItem = {
  id: number;
  topicId: number;
  certificationId: number;
  certificationTitle: string;
  certSlug: string;
  title: string;
  href: string;
};

export type Locale = Cert["locale"];

// Usa il proxy Next se non definisci API_BASE_URL (vedi app/api/backend/*)
const API_REMOTE = process.env.API_BASE_URL || "https://api.certifyquiz.com/api";
const API_PROXY = "/api/backend";

// build + server → remoto
// client → proxy
const API = typeof window === "undefined" ? API_REMOTE : API_PROXY;

export async function getTopicReviewsList(lang: Locale) {
  const res = await fetch(`${API}/topic-reviews?lang=${lang}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) return [];

  return (await res.json()) as TopicReviewListItem[];
}
export type ScenarioOverviewItem = {
  id: number;
  certificationId: number;
  certificationTitle: string;
  certificationSlug: string;
  title: string;
  href: string;
  intro_text: string;
  difficulty: "base" | "advanced" | "exam";
  is_premium: boolean;
  question_count: number;
  locked: boolean;
};

export async function getScenariosList(
  lang: Locale
): Promise<ScenarioOverviewItem[]> {
  const res = await fetch(`${API}/scenarios/list?lang=${lang}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) return [];

  const json = await res.json();

  return Array.isArray(json.items) ? json.items : [];
}

export type GuideOverviewItem = {
  id: number;
  slug: string;
  title: string;
  lang_available: boolean;
  price: number;
  page_count: number | null;
  certification_slug: string;
  certification_name: string;
  access: "premium" | "purchased" | "locked";
};

export async function getGuidesList(lang: Locale): Promise<GuideOverviewItem[]> {
  const res = await fetch(`${API}/guides?lang=${lang}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) return [];

  const json = await res.json();

  return Array.isArray(json.items) ? json.items : [];
}

export type GuideDetail = {
  id: number;
  slug: string;
  title: string;
  lang_available: boolean;
  price: number;
  page_count: number | null;
  certification_slug: string;
  certification_name: string;
  hasAccess: boolean;
  accessReason: string;
};

export async function getGuideBySlug(
  slug: string,
  lang: Locale
): Promise<GuideDetail | null> {
  const res = await fetch(
    `${API}/guides/${encodeURIComponent(slug)}?lang=${lang}`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) return null;

  const json = await res.json();

  return json.guide ?? null;
}
/* ------------------------- SLUG NORMALIZATION ------------------------- */
/** Normalizza slug "alias/vecchi" → slug canonici del frontend */
const normalizeSlug = (raw: unknown) => {
  const s = String(raw ?? "").trim();


  if (s === "network-plus") return "comptia-network-plus";
if (s === "tensorflow-developer") return "google-tensorflow";
  // alias CompTIA Security+
  if (s === "comptia-security-plus") return "security-plus";

  // alias CCST cybersecurity (vecchio/DB) → slug canonico che ESISTE (security)
 if (s === "cisco-ccst-security")
  return "cisco-ccst-cybersecurity";

  return s;
};

/* ------------------------- LIVE SLUGS (CANONICI) ------------------------- */
// ✅ Metti QUI SOLO gli slug CANONICI che vuoi esporre sul sito
const LIVE = new Set([
  "jncie",
  "f5",
  "aws-cloud-practitioner",
  "cisco-ccst-networking",

  // aggiunti per test
  "eipass",
  "pekit",
  "ecdl",

  // ✅ canonici corretti
  "security-plus",
  "cisco-ccst-cybersecurity",

   // NUOVI
  "comptia-network-plus",
  "google-cloud",
  "google-cloud-digital-leader",
  "google-tensorflow",
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
      if (!isRecord(item)) continue;
      const rawSlug = getString(item, "slug");
      const s = normalizeSlug(rawSlug);
      if (s && LIVE.has(s)) out.push(s);
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

/** Dettaglio certificazione: supporta sia payload oggetto sia array */
export async function getCertBySlug(slug: string, locale: Locale = "it"): Promise<Cert | null> {
  const canonSlug = normalizeSlug(slug);

  // In fase di build NON usare MOCK per i dettagli certificazione,
// perché servono dati dinamici come questionCountByLang.

  // Selettore robusto dall'array
  const pickFromArray = (arr: unknown): Record<string, unknown> | undefined => {
    if (!Array.isArray(arr)) return undefined;

    // 1) match slug normalizzato
    for (const x of arr) {
      if (!isRecord(x)) continue;
      const s = normalizeSlug(getString(x, "slug"));
      if (s === canonSlug) return x;
    }

    // 2) fallback: slugify(name) === canonSlug
    for (const x of arr) {
      if (isRecord(x) && slugify(getString(x, "name")) === canonSlug) return x;
    }

    return undefined;
  };

  const toCert = (obj: Record<string, unknown>): Cert => {
    const title = pickNameByLocale(obj, locale) || canonSlug;

    return {
  slug: canonSlug,
  locale,
  title,
  h1: title,
  intro: getString(obj, "intro") ?? getString(obj, "description") ?? "",
  seoDescription:
    getString(obj, "seoDescription") ??
    getString(obj, "seo") ??
    getString(obj, "description") ??
    "",
  faq: normalizeFaq(obj["faq"]),
  imageUrl: pickImageUrl(obj),
  ogImage: getString(obj, "ogImage") ?? undefined,
  image: getString(obj, "image") ?? undefined,

  questionCount:
    typeof obj["questionCount"] === "number"
      ? obj["questionCount"]
      : undefined,

  questionCountByLang:
    obj["questionCountByLang"] && typeof obj["questionCountByLang"] === "object"
      ? (obj["questionCountByLang"] as Partial<Record<Locale, number>>)
      : undefined,
};
  };

  // 1) Prova endpoint dettaglio
try {
  const r = await okOrThrow(
    fetchWithTimeout(
      `${API}/certifications/by-slug/${encodeURIComponent(canonSlug)}?locale=${locale}`,
      {
        cache: "no-store",
      } as NextFetchInit
    )
  );

    const raw: unknown = await r.json().catch(() => null);

    const obj: Record<string, unknown> | undefined =
      Array.isArray(raw) ? pickFromArray(raw) : isRecord(raw) ? raw : undefined;

    if (obj) return toCert(obj);
  } catch {
    // Se l'endpoint dettaglio fallisce, NON mandare 404: prova la lista sotto
  }

  // 2) Fallback online: lista certificazioni e filtro locale
  try {
    const rList = await okOrThrow(
      fetchWithTimeout(`${API}/certifications?locale=${locale}`, {
        next: { tags: ["certs:list"], revalidate: 86400 },
      } as NextFetchInit)
    );

    const arr: unknown = await rList.json();
    const obj = pickFromArray(arr);

    if (obj) return toCert(obj);
  } catch {
    // Ultimo fallback sotto
  }

  // 3) Ultimo fallback mock
  return MOCK.find((c) => c.slug === canonSlug && c.locale === locale) ?? null;
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

      const rawSlug = getString(raw, "slug");
      const slug = normalizeSlug(rawSlug);
      if (!slug || !LIVE.has(slug)) continue; // 👈 gate su canonico

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
        slug,
        locale,
        title,
        h1,
        intro,
        seoDescription,
        faq,
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
export type DbTopicLink = {
  title: string;
  slug: string;
};

function pickTopicTitleByLocale(raw: Record<string, unknown>, locale: Locale): string {
  const byLocale: Record<Locale, string | undefined> = {
    it: getString(raw, "title") ?? getString(raw, "title_it"),
    en: getString(raw, "title_en") ?? getString(raw, "title"),
    fr: getString(raw, "title_fr") ?? getString(raw, "title"),
    es: getString(raw, "title_es") ?? getString(raw, "title"),
  };

  return sanitize(byLocale[locale]) || sanitize(getString(raw, "title")) || "";
}

function pickTopicSlugByLocale(raw: Record<string, unknown>, locale: Locale): string {
  const byLocale: Record<Locale, string | undefined> = {
    it: getString(raw, "slug_it") ?? getString(raw, "slug"),
    en: getString(raw, "slug_en") ?? getString(raw, "slug"),
    fr: getString(raw, "slug_fr") ?? getString(raw, "slug"),
    es: getString(raw, "slug_es") ?? getString(raw, "slug"),
  };

  return sanitize(byLocale[locale]) || sanitize(getString(raw, "slug")) || "";
}

export async function getTopicsByCertSlug(
  certSlug: string,
  locale: Locale = "it"
): Promise<DbTopicLink[]> {
  const canonSlug = normalizeSlug(certSlug);

  if (IS_BUILD) return [];

  try {
    const r = await okOrThrow(
      fetchWithTimeout(`${API}/topic-pages/by-cert/${encodeURIComponent(canonSlug)}?lang=${locale}`, {
        next: {
          tags: [`cert:${canonSlug}:topics`, `cert:${canonSlug}`],
          revalidate: 86400,
        },
      } as NextFetchInit)
    );

    const raw: unknown = await r.json();

    const arr = Array.isArray(raw)
      ? raw
      : isRecord(raw) && Array.isArray(raw.topics)
      ? raw.topics
      : [];

    return arr
      .filter(isRecord)
      .map((t) => ({
        title: pickTopicTitleByLocale(t, locale),
        slug: pickTopicSlugByLocale(t, locale),
      }))
      .filter((t) => t.title && t.slug);
  } catch {
    return [];
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
  const canonSlug = normalizeSlug(slug);

  // In fase di build: deriviamo dai dati della certificazione
  if (IS_BUILD) {
    const cert = MOCK.find((c) => c.slug === canonSlug && c.locale === locale);
    return cert
      ? { title: cert.title, subtitle: cert.intro, seoDescription: cert.seoDescription || cert.intro }
      : null;
  }

  try {
    const r1 = await okOrThrow(
      fetchWithTimeout(`${API}/quiz-intro/${encodeURIComponent(canonSlug)}?locale=${locale}`, {
        next: { tags: [`quiz:${canonSlug}`, "quiz:intros"], revalidate: 86400 },
      } as NextFetchInit)
    );
    const j1: unknown = await r1.json();
    if (isRecord(j1)) {
      const title = sanitize(getString(j1, "title")) || canonSlug;
      const rec = j1 as Record<string, unknown>;
      return {
        title,
        subtitle: sanitize(getString(rec, "subtitle")),
        questionCount: getNumber(rec, "questionCount"),
        premiumRequired: getBoolean(rec, "premiumRequired"),
        seoDescription:
          sanitize(getString(rec, "seoDescription")) || sanitize(getString(rec, "description")),
      };
    }
  } catch {
    /* fallback sotto */
  }

  // Fallback: derive dall’oggetto certificazione (intro/descrizione)
  try {
    const cert = await getCertBySlug(canonSlug, locale);
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
// ============================================================
// AGGIUNGI QUESTO BLOCCO in src/lib/data.ts
// Prima della riga: export const certPath = ...
// ============================================================

/* ----------------------------- SCENARIOS ----------------------------- */

// ============================================================
// AGGIUNGI QUESTO BLOCCO in src/lib/data.ts
// Prima della riga: export const certPath = ...
// ============================================================

/* ----------------------------- SCENARIOS ----------------------------- */

export type ScenarioListItem = {
  id: number;
  title: string;
  intro_text: string;
  difficulty: "base" | "advanced" | "exam";
  is_premium: boolean;
  question_count: number;
  locked: boolean;
};

export type ScenarioAnswer = {
  id: number;
  text: string;
  is_correct: boolean;
};

export type ScenarioQuestion = {
  id: number;
  index: number;
  question: string;
  explanation: string;
  correct_answer: string;
  answers: ScenarioAnswer[];
};

export type ScenarioDetail = {
  id: number;
  certification_id: number;
  cert_slug: string;
  cert_name: string;
  title: string;
  intro_text: string;
  difficulty: "base" | "advanced" | "exam";
  is_premium: boolean;
  question_count: number;
  questions: ScenarioQuestion[];
};

/** Lista scenari per certificazione */
export async function getScenariosByCertSlug(
  certSlug: string,
  locale: Locale = "it",
  token?: string
): Promise<ScenarioListItem[]> {
  if (IS_BUILD) return [];

  try {
   const r = await fetchWithTimeout(
  `${API}/scenarios?cert_slug=${encodeURIComponent(certSlug)}&lang=${locale}`,
  {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: "no-store",
  } as NextFetchInit
);

    if (!r.ok) return [];

    const json = await r.json();
    const items = Array.isArray(json?.items) ? json.items : [];

    return items.map((item: Record<string, unknown>) => ({
      id: Number(item.id),
      title: String(item.title ?? ""),
      intro_text: String(item.intro_text ?? ""),
      difficulty: (item.difficulty as "base" | "advanced" | "exam") ?? "exam",
      is_premium: Boolean(item.is_premium),
      question_count: Number(item.question_count ?? 0),
      locked: Boolean(item.locked),
    }));
  } catch {
    return [];
  }
}

/** Scenario singolo con domande */
export async function getScenarioById(
  id: number,
  locale: Locale = "it",
  token?: string
): Promise<ScenarioDetail | null> {
  if (IS_BUILD) return null;

  try {
    const r = await fetchWithTimeout(
      `${API}/scenarios/${id}?lang=${locale}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        cache: "no-store",
      } as NextFetchInit
    );

    if (r.status === 404 || r.status === 403) return null;
    if (!r.ok) return null;

    const json = await r.json();
    const s = json?.scenario;
    if (!s) return null;

    return {
      id: Number(s.id),
      certification_id: Number(s.certification_id),
      cert_slug: String(s.cert_slug ?? ""),
      cert_name: String(s.cert_name ?? ""),
      title: String(s.title ?? ""),
      intro_text: String(s.intro_text ?? ""),
      difficulty: (s.difficulty as "base" | "advanced" | "exam") ?? "exam",
      is_premium: Boolean(s.is_premium),
      question_count: Number(s.question_count ?? 0),
      questions: Array.isArray(s.questions)
        ? s.questions.map((q: Record<string, unknown>, idx: number) => ({
            id: Number(q.id),
            index: idx + 1,
            question: String(q.question ?? ""),
            explanation: String(q.explanation ?? ""),
            correct_answer: String(q.correct_answer ?? ""),
            answers: Array.isArray(q.answers)
              ? (q.answers as Record<string, unknown>[]).map((a) => ({
                  id: Number(a.id),
                  text: String(a.text ?? ""),
                  is_correct: Boolean(a.is_correct),
                }))
              : [],
          }))
        : [],
    };
  } catch {
    return null;
  }
}
/* ------------------------------- URL helper ------------------------------- */
/** ATTENZIONE: EN ufficiale è ROOT (/certifications/...) */
export const certPath = (lang: "it" | "en" | "fr" | "es", slug: string): string => {
  switch (lang) {
    case "it":
      return `/it/certificazioni/${slug}`;
    case "en":
      return `/certifications/${slug}`;
    case "fr":
      return `/fr/certifications/${slug}`;
    case "es":
      return `/es/certificaciones/${slug}`;
    default:
      return `/it/certificazioni/${slug}`;
  }
};
/* ------------------------- TOPIC REVIEW / RIPASSO ------------------------- */

export type TopicReviewPage = {
  id: number;
  topicId: number;
  certificationId: number;
  certificationSlug: string;
  certificationName: string;
  topicSlug: string;
  reviewSlug: string;
  topicTitle: string;
  title: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  intro: string | null;
  content: string | null;
  faq: string | null;
};

export async function getTopicReviewPage(params: {
  certSlug: string;
  topicSlug: string;
  lang: Locale;
}): Promise<TopicReviewPage | null> {
  const { certSlug, topicSlug, lang } = params;

  const res = await fetch(
    `${API}/certifications/${encodeURIComponent(certSlug)}/topics/${encodeURIComponent(topicSlug)}/review?lang=${lang}`,
    {
      next: {
        revalidate: 86400,
        tags: [`topic-review:${certSlug}:${topicSlug}:${lang}`],
      },
    }
  );

  if (res.status === 404) return null;

  if (!res.ok) {
    console.error("Failed to fetch topic review page", {
      certSlug,
      topicSlug,
      lang,
      status: res.status,
    });
    return null;
  }

  return res.json();
}