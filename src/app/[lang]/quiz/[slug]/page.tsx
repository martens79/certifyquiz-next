// src/app/[lang]/quiz/[slug]/page.tsx
// QuizTopicsPage — lista dei topic per certificazione, con SEO multilingua

import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";

import { getCertBySlug, CERT_SLUGS } from "@/certifications/registry";
import { getCategoryStyle, CERT_CATEGORY_BY_SLUG } from "@/lib/certs";
import { locales, isLocale, type Locale } from "@/lib/i18n";
import type { CertificationData } from "@/certifications/types";
import { categoryPath, type CategoryKey } from "@/lib/paths";

export const runtime = "nodejs";
export const revalidate = 60;
export const dynamicParams = true;

const RAW_SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com";
const SITE = RAW_SITE.replace(/\/+$/, "");
const API_BASE_URL = (process.env.API_BASE_URL || "").replace(/\/+$/, "");

// ─────────────────── Tipi ───────────────────
type TopicRow = {
  id: number;
  certification_id: number;
  title?: string;
  title_it?: string;
  title_en?: string;
  title_fr?: string;
  title_es?: string;
  description?: string;
  description_it?: string;
  description_en?: string;
  description_fr?: string;
  description_es?: string;

  // ✅ nuovi slug topic per linkare la TopicPage SEO
  slug_it?: string;
  slug_en?: string;
  slug_fr?: string;
  slug_es?: string;
};

// ─────────────────── Helpers ───────────────────

// 🔧 headers() nel tuo progetto è Promise<ReadonlyHeaders> → serve await
async function getInternalBase(): Promise<string> {
  try {
    const h = await headers();
    const host = h.get("x-forwarded-host") || h.get("host");
    if (!host) return "";
    const proto = h.get("x-forwarded-proto") || (process.env.VERCEL ? "https" : "http");
    return `${proto}://${host}`;
  } catch {
    return "";
  }
}

async function fetchTopics(certId: number): Promise<TopicRow[]> {
  try {
    const base = API_BASE_URL || (await getInternalBase());
    if (!base) return [];

    const url = API_BASE_URL
      ? `${API_BASE_URL}/topics/${certId}`
      : `${base}/api/backend/topics/${certId}`;

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    return (await res.json()) as TopicRow[];
  } catch {
    return [];
  }
}

// Segmento per /quiz (se un giorno cambi per EN, tocchi solo qui)
function quizSeg(_lang: Locale) {
  return "quiz";
}

/**
 * ✅ In questa sezione (/[lang]/quiz/...) la lingua è SEMPRE prefissata, anche per EN.
 * Quindi:
 *  - /en/quiz/ceh
 *  - /it/quiz/ceh
 */
function langPrefix(lang: Locale) {
  return `/${lang}`;
}

// ✅ builder URL pagina quiz topics per cert
function quizCertPath(lang: Locale, slug: string) {
  return `${langPrefix(lang)}/${quizSeg(lang)}/${slug}`;
}

// ✅ builder URL quiz mixed
function quizMixedPath(lang: Locale, slug: string) {
  return `${langPrefix(lang)}/${quizSeg(lang)}/${slug}/mixed`;
}

function certPath(lang: Locale, slug: string) {
  const base = lang === "en" ? "" : `/${lang}`;
  const seg = lang === "it" ? "certificazioni" : lang === "es" ? "certificaciones" : "certifications";
  return `${base}/${seg}/${slug}`;
}

// ✅ builder URL TopicPage SEO
function topicPagePath(lang: Locale, certSlug: string, topic: TopicRow) {
  const topicSlug =
    lang === "en"
      ? topic.slug_en || topic.slug_it
      : lang === "fr"
      ? topic.slug_fr || topic.slug_it
      : lang === "es"
      ? topic.slug_es || topic.slug_it
      : topic.slug_it;

  if (!topicSlug) return null;

  const base = lang === "en" ? "" : `/${lang}`;
  const seg =
    lang === "it"
      ? "certificazioni"
      : lang === "es"
      ? "certificaciones"
      : "certifications";

  return `${base}/${seg}/${certSlug}/${topicSlug}`;
}

// ✅ builder URL quiz mock exam
function quizMockExamPath(lang: Locale, slug: string) {
  return `${langPrefix(lang)}/${quizSeg(lang)}/${slug}/mock-exam`;
}

// ✅ localizzazione topic: preferisci lingua corrente, fallback su base/it
function pickTopicField(t: TopicRow, lang: Locale, field: "title" | "description") {
  switch (lang) {
    case "en":
      return (t as any)[`${field}_en`] || (t as any)[field] || (t as any)[`${field}_it`] || "";
    case "fr":
      return (t as any)[`${field}_fr`] || (t as any)[field] || (t as any)[`${field}_it`] || "";
    case "es":
      return (t as any)[`${field}_es`] || (t as any)[field] || (t as any)[`${field}_it`] || "";
    default:
      return (t as any)[`${field}_it`] || (t as any)[field] || "";
  }
}

function pickCertTitle(
  cert: CertificationData | undefined,
  lang: Locale,
  fallbackSlug: string
) {
  const t = cert?.title;
  if (t) {
    return t[lang] ?? t.it ?? t.en ?? t.fr ?? t.es ?? "";
  }

  return fallbackSlug
    .replace(/-/g, " ")
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// Testi base per SEO pagina topics per cert
const SEO_BASE: Record<Locale, { quizLabel: string; desc: string }> = {
  it: { quizLabel: "Quiz", desc: "Allenati con i topic ufficiali di questa certificazione." },
  en: { quizLabel: "Quiz", desc: "Practice with the official topics of this certification." },
  fr: { quizLabel: "Quiz", desc: "Entraînez-vous avec les sujets officiels de cette certification." },
  es: { quizLabel: "Quiz", desc: "Entrena con los temas oficiales de esta certificación." },
};

const ogLocale = (lang: Locale) =>
  lang === "it" ? "it-IT" : lang === "en" ? "en-US" : lang === "fr" ? "fr-FR" : "es-ES";

// ✅ Alias/compat per slug quiz (vecchi link / hardcode / GSC)
function resolveQuizSlug(inputRaw: string): string {
  const input = (inputRaw || "").trim().toLowerCase();

  const ALIASES: Record<string, string> = {
    itfplus: "comptia-itf-plus",
    "cisco-ccna": "ccna",
    ecdl: "icdl",
    "mysql-certification": "mysql",
    javascript: "javascript-developer",
    java: "java-se",
    python: "python-developer",
    vmware: "vmware-vcp",
    "oracle-sql": "oracle-database-sql",
    "ibm-cloud": "ibm-cloud-v5",
    "aws-cloud": "aws-cloud-practitioner",
    "ai-fundamentals": "microsoft-ai-fundamentals",
    "azure-fundamentals": "microsoft-azure-fundamentals",
    "eipass-basic": "eipass",
  };

  return ALIASES[input] ?? input;
}

function categoryLabel(key: CategoryKey, lang: Locale) {
  const map: Record<CategoryKey, { it: string; en: string; fr: string; es: string }> = {
    default: { it: "Categoria", en: "Category", fr: "Catégorie", es: "Categoría" },
    base: { it: "Base", en: "Basic", fr: "Bases", es: "Básico" },
    sicurezza: { it: "Sicurezza", en: "Security", fr: "Sécurité", es: "Seguridad" },
    reti: { it: "Reti", en: "Networking", fr: "Réseaux", es: "Redes" },
    cloud: { it: "Cloud", en: "Cloud", fr: "Cloud", es: "Cloud" },
    database: { it: "Database", en: "Database", fr: "Base de données", es: "Base de datos" },
    programmazione: { it: "Programmazione", en: "Programming", fr: "Programmation", es: "Programación" },
    virtualizzazione: { it: "Virtualizzazione", en: "Virtualization", fr: "Virtualisation", es: "Virtualización" },
    ai: { it: "Intelligenza Artificiale", en: "Artificial Intelligence", fr: "Intelligence Artificielle", es: "Inteligencia Artificial" },
  };

  const o = map[key] ?? map.default;
  return o[lang] ?? o.it;
}

function titleCase(s: string) {
  return s
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// ─────────────────── Metadata ───────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const L: Locale = isLocale(lang) ? (lang as Locale) : "it";

  const base = SEO_BASE[L];
  const resolvedSlug = resolveQuizSlug(slug);
  const certName = titleCase(resolvedSlug.replace(/-/g, " "));
  const title = `${base.quizLabel} — ${certName}`;
  const description = base.desc;

  const canonicalPath = quizCertPath(L, resolvedSlug);
  const canonical = `${SITE}${canonicalPath}`;

  const languages: Record<string, string> = {};
  for (const loc of locales as readonly Locale[]) {
    const localeKey =
      loc === "it" ? "it-IT" : loc === "en" ? "en-US" : loc === "fr" ? "fr-FR" : "es-ES";
    languages[localeKey] = `${SITE}${quizCertPath(loc as Locale, resolvedSlug)}`;
  }
  languages["x-default"] = `${SITE}${quizCertPath("en", resolvedSlug)}`;

  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: { canonical, languages },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "CertifyQuiz",
      locale: ogLocale(L),
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

// ─────────────────── Pagina ───────────────────
export default async function QuizTopicsPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const L: Locale = isLocale(lang) ? (lang as Locale) : "it";

  const resolvedSlug = resolveQuizSlug(slug);

  const cert = getCertBySlug(resolvedSlug);
  const certId = cert?.id;

  if (!certId) {
    const list = [...CERT_SLUGS].slice().sort();

    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-2xl font-bold mb-4">Quiz — Slug non mappato</h1>

        <p className="mb-2">
          Cliccato: <code className="bg-gray-100 px-2 py-1 rounded">{slug}</code>
        </p>

        <p className="mb-6 text-sm text-gray-600">
          Lo slug non esiste nel <code>registry</code> delle certificazioni.
          <span className="ml-1">Allinea i link/CTA allo slug reale (es. </span>
          <code className="bg-gray-100 px-2 py-1 rounded">eipass</code>
          <span>). </span>
        </p>

        <h2 className="text-lg font-semibold mb-2">Slug disponibili:</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {list.map((s) => (
            <li key={s} className="text-sm">
              <a className="text-blue-700 underline" href={quizCertPath(L, s)}>
                {s}
              </a>
            </li>
          ))}
        </ul>
      </main>
    );
  }

  const rawCategoryKey = (CERT_CATEGORY_BY_SLUG[resolvedSlug] ?? "default") as CategoryKey;
  const styleCategoryKey: CategoryKey = rawCategoryKey === "default" ? "base" : rawCategoryKey;
  const css = getCategoryStyle(styleCategoryKey);

  const topics = await fetchTopics(certId);
  const categoryName = categoryLabel(rawCategoryKey, L);
  const base = SEO_BASE[L];
  const categoryHref =
    rawCategoryKey === "default" ? `${langPrefix(L)}/quiz-home` : categoryPath(L, rawCategoryKey);

  const certName = pickCertTitle(cert, L, resolvedSlug);

  const mixedLabel =
    L === "it" ? "Quiz misto" : L === "en" ? "Mixed quiz" : L === "fr" ? "Quiz mixte" : "Quiz mixto";

  const mixedDesc =
    L === "it"
      ? "Domande miste da tutti i topic di questa certificazione."
      : L === "en"
      ? "Mixed questions from all topics of this certification."
      : L === "fr"
      ? "Questions mixtes de tous les sujets de cette certification."
      : "Preguntas mixtas de todos los temas de esta certificación.";

  const mixedCta =
    L === "it"
      ? "Avvia quiz misto →"
      : L === "en"
      ? "Start mixed quiz →"
      : L === "fr"
      ? "Lancer le quiz mixte →"
      : "Iniciar quiz mixto →";

  const mockLabel = "Mock exam";
  const mockDesc =
    L === "it"
      ? "Simulazione d’esame con timer e punteggio finale."
      : L === "en"
      ? "Real exam simulation with time limit and final score."
      : L === "fr"
      ? "Simulation d’examen avec chronomètre et score final."
      : "Simulación de examen con temporizador y puntuación final.";

  const mockCta =
    L === "it"
      ? "Avvia mock exam 🎯 →"
      : L === "en"
      ? "Start mock exam 🎯 →"
      : L === "fr"
      ? "Démarrer le mock exam 🎯 →"
      : "Iniciar mock exam 🎯 →";

  const certBtnLabel =
    L === "it"
      ? "Pagina certificazione"
      : L === "en"
      ? "View certification"
      : L === "fr"
      ? "Voir la certification"
      : "Ver certificación";

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <header className={`rounded-2xl p-6 mb-8 shadow-sm ${css.header}`}>
        {/* Desktop (md+): LEFT CTA — CENTER title — RIGHT badge */}
        <div className="relative hidden md:flex md:items-center md:mb-2">
          <div className="absolute left-0">
            <Link
              href={certPath(L, resolvedSlug)}
              className="inline-flex items-center justify-center rounded-full border border-white/70 bg-white/70 px-4 py-1.5 text-sm font-semibold hover:bg-white"
              prefetch={false}
            >
              {certBtnLabel}
            </Link>
          </div>

          <h1 className="mx-auto text-2xl font-bold text-center">
            {base.quizLabel} — {certName}
          </h1>

          <div className="absolute right-0">
            <Link
              href={categoryHref}
              className={`inline-flex items-center gap-2 text-xs font-extrabold px-3 py-1 rounded-full shadow-sm bg-white/80 border hover:bg-white transition ${
                css.header.split(" ").find((c) => c.startsWith("border-")) ?? "border-gray-200"
              }`}
              title={categoryName}
            >
              <span className="inline-block h-2 w-2 rounded-full bg-red-500" aria-hidden="true" />
              {categoryName}
            </Link>
          </div>
        </div>

        {/* Mobile (<md): title centered + pills centered below */}
        <div className="md:hidden">
          <h1 className="text-2xl font-bold text-center">
            {base.quizLabel} — {certName}
          </h1>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <Link
              href={certPath(L, resolvedSlug)}
              className="inline-flex items-center justify-center rounded-full border border-white/70 bg-white/70 px-4 py-1.5 text-sm font-semibold hover:bg-white"
              prefetch={false}
            >
              {certBtnLabel}
            </Link>

            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full shadow-sm bg-white/70 border ${
                css.header.split(" ").find((c) => c.startsWith("border-")) ?? "border-gray-200"
              }`}
            >
              {categoryName}
            </span>
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-sm opacity-70 text-center mt-3">
          {L === "it"
            ? `${topics.length} topic disponibili`
            : L === "en"
            ? `${topics.length} topics available`
            : L === "fr"
            ? `${topics.length} sujets disponibles`
            : `${topics.length} temas disponibles`}
        </p>
      </header>

      {/* 🔹 BOX QUIZ MISTO + MOCK EXAM (stessa riga) */}
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* --- Mixed quiz --- */}
          <div className="flex flex-col gap-3 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-base font-semibold">{mixedLabel}</h2>
              <p className="text-sm text-slate-700">{mixedDesc}</p>
            </div>

            <Link
              href={quizMixedPath(L, resolvedSlug)}
              className="inline-flex items-center justify-center rounded-full border border-sky-500 px-4 py-1.5 text-sm font-semibold text-sky-700 hover:bg-sky-100"
            >
              {mixedCta}
            </Link>
          </div>

          {/* --- Mock exam --- */}
          <div className="flex flex-col gap-3 rounded-2xl border border-orange-100 bg-orange-50 px-4 py-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-base font-semibold">{mockLabel}</h2>
              <p className="text-sm text-slate-700">{mockDesc}</p>
            </div>

            <Link
              href={quizMockExamPath(L, resolvedSlug)}
              className="inline-flex items-center justify-center rounded-full border border-orange-500 px-4 py-1.5 text-sm font-semibold text-orange-700 hover:bg-orange-100"
            >
              {mockCta}
            </Link>
          </div>
        </div>
      </section>

      {topics.length === 0 ? (
        <div className="text-gray-700">
          <p className="mb-2">
            Nessun topic disponibile (route OK, ma l’API ha risposto vuoto o non raggiungibile).
          </p>
          <p className="text-sm">
            Endpoint chiamato:&nbsp;
            <code className="bg-gray-100 px-2 py-1 rounded">
              {API_BASE_URL ? `${API_BASE_URL}/topics/${certId}` : `/api/backend/topics/${certId}`}
            </code>
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {topics.map((t) => {
            const title = pickTopicField(t, L, "title") || `Topic ${t.id}`;
            const desc = pickTopicField(t, L, "description") || "";
            const topicHref = topicPagePath(L, resolvedSlug, t);

            const ctaLabel =
              L === "it"
                ? "Apri topic →"
                : L === "en"
                ? "Open topic →"
                : L === "fr"
                ? "Ouvrir le sujet →"
                : "Abrir tema →";

            return (
              <li
                key={t.id}
                className={`rounded-2xl p-4 md:p-5 bg-white shadow-sm transition ${css.wrapper}`}
              >
                <div className="font-semibold">{title}</div>
                {desc && <div className="text-sm opacity-80 mt-1">{desc}</div>}

                {topicHref ? (
                  <Link href={topicHref} className="inline-block mt-3 text-blue-700 underline">
                    {ctaLabel}
                  </Link>
                ) : (
                  <span className="inline-block mt-3 text-gray-400">{ctaLabel}</span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}