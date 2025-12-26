// src/app/[lang]/quiz-home/page.tsx
import type { Metadata } from "next";
import QuizHomeView from "./QuizHomeView";

type Locale = "it" | "en" | "fr" | "es";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com";
const ogLocale: Record<Locale, string> = {
  it: "it_IT",
  en: "en_US",
  fr: "fr_FR",
  es: "es_ES",
};

const getLabel = (d: Partial<Record<Locale, string>>, lang: Locale) =>
  d[lang] ?? d.it ?? d.en ?? d.fr ?? d.es ?? "";

/* ── SEO: generateMetadata (params = Promise) ─────────────────────────── */
export async function generateMetadata(props: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang: raw } = await props.params;
  const lang = (["it", "en", "fr", "es"].includes(raw) ? raw : "it") as Locale;

  const title = getLabel(
    {
      it: "Quiz online per certificazioni IT — CertifyQuiz",
      en: "Online IT Certification Quizzes — CertifyQuiz",
      fr: "Quiz en ligne pour certifications IT — CertifyQuiz",
      es: "Cuestionarios online para certificaciones IT — CertifyQuiz",
    },
    lang
  );

  const description = getLabel(
    {
      it: "Accedi a tutte le categorie di quiz IT: sicurezza, reti, cloud, database, programmazione e altro. Scegli la certificazione e inizia subito.",
      en: "Access all IT quiz categories: security, networking, cloud, databases, programming and more. Choose your certification and start now.",
      fr: "Accédez à toutes les catégories de quiz IT : sécurité, réseaux, cloud, bases de données, programmation, etc.",
      es: "Accede a todas las categorías de cuestionarios IT: seguridad, redes, nube, bases de datos, programación y más.",
    },
    lang
  );

  // ✅ SEO A: EN canonical = /quiz-home
  const canonical =
    lang === "en" ? `${SITE}/quiz-home` : `${SITE}/${lang}/quiz-home`;

  return {
    metadataBase: new URL(SITE),
    title,
    description,
    alternates: {
      canonical,
      languages: {
        it: `${SITE}/it/quiz-home`,
        en: `${SITE}/quiz-home`,          // ✅ EN root
        fr: `${SITE}/fr/quiz-home`,
        es: `${SITE}/es/quiz-home`,
        "x-default": `${SITE}/quiz-home`, // ✅ x-default su EN root
      },
    },
    openGraph: {
      url: canonical,
      type: "website",
      title,
      description,
      siteName: "CertifyQuiz",
      locale: ogLocale[lang],
      images: [{ url: `${SITE}/og/quiz-home-${lang}.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE}/og/quiz-home-${lang}.png`],
      site: "@CertifyQuiz",
    },
    // ✅ /en/quiz-home è route tecnica: noindex
    robots: lang === "en" ? { index: false, follow: true } : { index: true, follow: true },
  };
}

/* ── Pagina server (params = Promise) ─────────────────────────────────── */
export default async function Page(props: { params: Promise<{ lang: Locale }> }) {
  const { lang: raw } = await props.params;
  const lang = (["it", "en", "fr", "es"].includes(raw) ? raw : "it") as Locale;

  return <QuizHomeView lang={lang} />;
}
