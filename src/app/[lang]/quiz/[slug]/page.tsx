// src/app/[lang]/quiz/[slug]/page.tsx
// QuizTopicsPage — lista dei topic per certificazione, con SEO multilingua

import type { Metadata } from "next";
import { headers } from "next/headers";
import { IDS_BY_SLUG, CERT_SLUGS } from "@/certifications/data";
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
function quizSeg(lang: Locale) {
  return "quiz";
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
  lang === "it" ? "it-IT" :
  lang === "en" ? "en-US" :
  lang === "fr" ? "fr-FR" : "es-ES";

// ─────────────────── Metadata ───────────────────
export async function generateMetadata(
  { params }: { params: Promise<{ lang: string; slug: string }> }
): Promise<Metadata> {
  const { lang, slug } = await params;
  const L: Locale = isLocale(lang) ? (lang as Locale) : "it";

  const base = SEO_BASE[L];

  const certName = slug.replace(/-/g, " ");
  const title = `${base.quizLabel} — ${certName}`;
  const description = base.desc;

  const canonicalPath = `/${L}/${quizSeg(L)}/${slug}`;
  const canonical = `${SITE}${canonicalPath}`;

  // hreflang per tutte le lingue, stesso slug
  const languages: Record<string, string> = {};
  for (const loc of locales as readonly Locale[]) {
    const localeKey =
      loc === "it" ? "it-IT" :
      loc === "en" ? "en-US" :
      loc === "fr" ? "fr-FR" : "es-ES";

    languages[localeKey] = `${SITE}/${loc}/${quizSeg(loc as Locale)}/${slug}`;
  }
  languages["x-default"] = `${SITE}/it/${quizSeg("it")}/${slug}`;

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
export default async function QuizTopicsPage(
  { params }: { params: Promise<{ lang: string; slug: string }> }
) {
  const { lang, slug } = await params;
  const L: Locale = isLocale(lang) ? (lang as Locale) : "it";
  const certId = IDS_BY_SLUG[slug];

  if (!certId) {
    const list = [...CERT_SLUGS].sort();
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
              <a className="text-blue-700 underline" href={`/${L}/${quizSeg(L)}/${s}`}>{s}</a>
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
          Lang: <code>{L}</code> · certId: <code>{certId}</code> · topics:{" "}
          <code>{topics.length}</code>
        </p>
      </header>

      {topics.length === 0 ? (
        <div className="text-gray-700">
          <p className="mb-2">
            Nessun topic disponibile (route OK, ma l’API ha risposto vuoto o non raggiungibile).
          </p>
          <p className="text-sm">
            Endpoint chiamato:&nbsp;
            <code className="bg-gray-100 px-2 py-1 rounded">
              {API_BASE_URL
                ? `${API_BASE_URL}/topics/${certId}`
                : `/api/backend/topics/${certId}`}
            </code>
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {topics.map((t) => {
            const title =
              t.title_it ||
              t.title ||
              t.title_en ||
              t.title_fr ||
              t.title_es ||
              `Topic ${t.id}`;

            const desc =
              t.description_it ||
              t.description ||
              t.description_en ||
              t.description_fr ||
              t.description_es ||
              "";

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
                {desc && (
                  <div className="text-sm opacity-80 mt-1">{desc}</div>
                )}
                <a
                  href={`/${L}/quiz/topic/${t.id}`}
                  className="inline-block mt-3 text-blue-700 underline"
                >
                  {ctaLabel}
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
