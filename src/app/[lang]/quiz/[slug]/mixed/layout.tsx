import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com").replace(/\/+$/, "");

// La pagina mixed è 'use client' e non esportava metadata: senza robots meta
// Google indicizzava varianti come ?mode=assessment. Come le altre runtime quiz
// (/[lang]/quiz/[slug], mock-exam, topic): noindex, follow + canonical senza parametri.
function displayName(slug: string) {
  if (slug === "ccna" || slug === "cisco-ccna") return "CCNA 200-301";
  if (slug === "isc2-cc") return "ISC2 CC";
  return slug.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale: Locale = isLocale(lang) ? lang : "en";
  const name = displayName(slug);
  const title = {
    it: `Quiz ${name} | CertifyQuiz`,
    en: `${name} Quiz | CertifyQuiz`,
    fr: `Quiz ${name} | CertifyQuiz`,
    es: `Quiz ${name} | CertifyQuiz`,
  }[locale];

  return {
    title,
    robots: { index: false, follow: true },
    alternates: { canonical: `${SITE}/${locale}/quiz/${slug}/mixed` },
  };
}

export default function MixedQuizLayout({ children }: { children: React.ReactNode }) {
  return children;
}
