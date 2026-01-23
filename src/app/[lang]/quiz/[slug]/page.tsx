// src/app/[lang]/quiz/[slug]/page.tsx
// QuizTopicsPage — lista dei topic per certificazione, con SEO multilingua

import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { CERT_ID_BY_SLUG } from "@/lib/certs";
import { getCategoryStyle, CERT_CATEGORY_BY_SLUG } from "@/lib/certs";
import { locales, isLocale, type Locale } from "@/lib/i18n";

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
 * ✅ FIX DEFINITIVO:
 * In questa sezione (/[lang]/quiz/...) la lingua è SEMPRE prefissata, anche per EN.
 * Quindi:
 *  - /en/quiz/ceh
 *  - /it/quiz/ceh
 *  - /en/quiz/topic/74
 *
 * Se vuoi EN root per i quiz, allora NON dovrebbe esistere /en/quiz/... (ma oggi esiste e funziona così).
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

// ✅ builder URL quiz mock exam
function quizMockExamPath(lang: Locale, slug: string) {
  return `${langPrefix(lang)}/${quizSeg(lang)}/${slug}/mock-exam`;
}

// ✅ builder URL quiz topic (per ID topic)
function quizTopicPath(lang: Locale, topicId: number) {
  return `${langPrefix(lang)}/quiz/topic/${topicId}`;
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

// Testi base per SEO pagina topics per cert
const SEO_BASE: Record<Locale, { quizLabel: string; desc: string }> = {
  it: {
    quizLabel: "Quiz",
    desc: "Allenati con i topic ufficiali di questa certificazione.",
  },
  en: {
    quizLabel: "Quiz",
    desc: "Practice with the official topics of this certification.",
  },
  fr: {
    quizLabel: "Quiz",
    desc: "Entraînez-vous avec les sujets officiels de cette certification.",
  },
  es: {
    quizLabel: "Quiz",
    desc: "Entrena con los temas oficiales de esta certificación.",
  },
};

const ogLocale = (lang: Locale) =>
  lang === "it" ? "it-IT" : lang === "en" ? "en-US" : lang === "fr" ? "fr-FR" : "es-ES";

// ─────────────────── Metadata ───────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const L: Locale = isLocale(lang) ? (lang as Locale) : "it";

  const base = SEO_BASE[L];
  const certName = slug.replace(/-/g, " ");
  const title = `${base.quizLabel} — ${certName}`;
  const description = base.desc;

  // ✅ canonical coerente con /[lang]/quiz/... (EN incluso)
  const canonicalPath = quizCertPath(L, slug);
  const canonical = `${SITE}${canonicalPath}`;

  // ✅ hreflang coerente (EN incluso su /en)
  const languages: Record<string, string> = {};
  for (const loc of locales as readonly Locale[]) {
    const localeKey =
      loc === "it" ? "it-IT" : loc === "en" ? "en-US" : loc === "fr" ? "fr-FR" : "es-ES";
    languages[localeKey] = `${SITE}${quizCertPath(loc as Locale, slug)}`;
  }
  languages["x-default"] = `${SITE}${quizCertPath("en", slug)}`;

  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "CertifyQuiz",
      locale: ogLocale(L),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
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

  const normalizedSlug = slug === "icdl" ? "ecdl" : slug;
const certId = CERT_ID_BY_SLUG[normalizedSlug];



  if (!certId) {
    const list = Object.keys(CERT_ID_BY_SLUG).sort();

    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-2xl font-bold mb-4">Quiz — Slug non mappato</h1>
        <p className="mb-2">
          Cliccato: <code className="bg-gray-100 px-2 py-1 rounded">{slug}</code>
        </p>
        <p className="mb-6 text-sm text-gray-600">
          Lo slug non esiste in <code>IDS_BY_SLUG</code>. Allinea lo <b>slug</b> del modulo certificazione con la mappa.
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

  const categoryKey = CERT_CATEGORY_BY_SLUG[slug] ?? "default";
  const css = getCategoryStyle(categoryKey);
  const topics = await fetchTopics(certId);

  const categoryName =
    categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1).replace(/-/g, " ");

  const base = SEO_BASE[L];
  const certName = slug.replace(/-/g, " ");

  // CTA "Quiz misto" label per lingua
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

      // CTA "Mock exam" label per lingua
const mockLabel =
  L === "it" ? "Mock exam" :
  L === "en" ? "Mock exam" :
  L === "fr" ? "Mock exam" :
  "Mock exam";

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

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      {/* Header con badge categoria */}
      <header className={`rounded-2xl p-6 mb-8 shadow-sm ${css.header}`}>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold">
            {base.quizLabel} — {certName}
          </h1>
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full shadow-sm bg-white/70 border ${
              css.header.split(" ").find((c) => c.startsWith("border-")) ?? "border-gray-200"
            }`}
          >
            {categoryName}
          </span>
        </div>

        {/* Debug info — puoi rimuoverla quando vuoi */}
        <p className="text-xs md:text-sm opacity-70">
          Lang: <code>{L}</code> · certId: <code>{certId}</code> · topics: <code>{topics.length}</code>
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
              href={quizMixedPath(L, normalizedSlug)}
              className="inline-flex items-center justify-center rounded-full border border-sky-500 px-4 py-1.5 text-sm font-semibold text-sky-700 hover:bg-sky-100"
            >
              {mixedCta}
            </Link>
          </div>

          {/* --- Mock exam --- */}
          <div className="flex flex-col gap-3 rounded-2xl border border-orange-100 bg-orange-50 px-4 py-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-base font-semibold">
                {L === "it"
                  ? "Mock exam"
                  : L === "en"
                  ? "Mock exam"
                  : L === "fr"
                  ? "Mock exam"
                  : "Mock exam"}
              </h2>

              <p className="text-sm text-slate-700">
                {L === "it"
                  ? "Simulazione d’esame con timer e punteggio finale."
                  : L === "en"
                  ? "Real exam simulation with time limit and final score."
                  : L === "fr"
                  ? "Simulation d’examen avec chronomètre et score final."
                  : "Simulación de examen con temporizador y puntuación final."}
              </p>
            </div>

            <Link
              href={quizMockExamPath(L, normalizedSlug)}
              className="inline-flex items-center justify-center rounded-full border border-orange-500 px-4 py-1.5 text-sm font-semibold text-orange-700 hover:bg-orange-100"
            >
              {L === "it"
                ? "Avvia mock exam 🎯 →"
                : L === "en"
                ? "Start mock exam 🎯 →"
                : L === "fr"
                ? "Démarrer le mock exam 🎯 →"
                : "Iniciar mock exam 🎯 →"}
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

                {/* ✅ FIX: usa Link e path con prefisso lingua sempre */}
                <Link
                  href={quizTopicPath(L, t.id)}
                  className="inline-block mt-3 text-blue-700 underline"
                >
                  {ctaLabel}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
