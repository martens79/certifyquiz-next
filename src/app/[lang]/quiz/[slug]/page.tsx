// src/app/[lang]/quiz/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, type Locale, isLocale } from "@/lib/i18n";
import { getQuizIntroBySlug, type QuizIntro } from "@/lib/data";
import ClientQuizRuntime from "./ClientQuizRuntime";

export const revalidate = 86400;
export const dynamicParams = true;

// ✅ Base URL normalizzata (no trailing slash)
const RAW_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com";
const SITE_URL = RAW_SITE_URL.replace(/\/+$/, "");

/* ------------------------------- Metadata -------------------------------- */
export async function generateMetadata(
  { params }: { params: Promise<{ lang: string; slug: string }> }
): Promise<Metadata> {
  const { lang, slug } = await params;
  const L: Locale = isLocale(lang) ? lang : "it";

  const intro = await getQuizIntroBySlug(slug, L).catch(() => null);
  if (!intro) {
    return { title: "Quiz — Non trovato", robots: { index: false, follow: false } };
  }

  const title = `${intro.title ?? slug} — Quiz`;
  const description =
    intro.seoDescription || intro.subtitle || "Allenati con quiz realistici e spiegazioni chiare.";

  // hreflang per tutte le lingue + x-default
  const languages = Object.fromEntries(
    locales.map((l) => [l, new URL(`/${l}/quiz/${slug}`, SITE_URL).toString()])
  ) as Record<string, string>;
  languages["x-default"] = new URL(`/it/quiz/${slug}`, SITE_URL).toString();

  const canonical = new URL(`/${L}/quiz/${slug}`, SITE_URL).toString();

  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      type: "website",
      url: canonical,
      title,
      description,
      siteName: "CertifyQuiz",
      // niente image specifica: se ne avrai una in futuro, aggiungila qui
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: { index: true, follow: true },
  };
}

/* --------------------------------- Page ---------------------------------- */
export default async function QuizWrapper(
  {
    params,
    searchParams,
  }: {
    params: Promise<{ lang: string; slug: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
  }
) {
  const { lang, slug } = await params;
  const sp = await searchParams;
  const L: Locale = isLocale(lang) ? lang : "it";

  const intro: QuizIntro | null = await getQuizIntroBySlug(slug, L).catch(() => null);
  if (!intro) return notFound();

  const modeParam = Array.isArray(sp.mode) ? sp.mode[0] : sp.mode;
  const mode = modeParam === "exam" ? "exam" : "training";

  // Breadcrumb JSON-LD (Home → Certificazione → Quiz)
  const detailPathByLang: Record<Locale, string> = {
    it: `/it/certificazioni/${slug}`,
    en: `/en/certifications/${slug}`,
    fr: `/fr/certifications/${slug}`,
    es: `/es/certificaciones/${slug}`,
  };
  const quizUrl = new URL(`/${L}/quiz/${slug}`, SITE_URL).toString();
  const certUrl = new URL(detailPathByLang[L], SITE_URL).toString();

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: new URL(`/${L}`, SITE_URL).toString() },
      { "@type": "ListItem", position: 2, name: intro.title, item: certUrl },
      { "@type": "ListItem", position: 3, name: "Quiz", item: quizUrl },
    ],
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">{intro.title}</h1>
        {intro.subtitle && (
          <p className="mt-2 text-sm text-gray-600 dark:text-neutral-300">{intro.subtitle}</p>
        )}
      </header>

      <ClientQuizRuntime lang={L} certSlug={slug} defaultMode={mode} />

      <script
        id="quiz-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </main>
  );
}
