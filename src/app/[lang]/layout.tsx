// src/app/[lang]/layout.tsx

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { dict, locales, type Locale, isLocale } from "@/lib/i18n";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner"; // ← NEW

const SITE = "https://www.certifyquiz.com";

const ogLocale: Record<Locale, string> = {
  it: "it_IT",
  en: "en_US",
  fr: "fr_FR",
  es: "es_ES",
};

// ✅ Il validator vuole Promise qui; usiamo `string` e facciamo narrowing runtime
export async function generateMetadata(
  { params }: { params: Promise<{ lang: string }> }
): Promise<Metadata> {
  const { lang } = await params;
  const L: Locale = isLocale(lang) ? lang : "it";

  const t = dict[L];

  const defTitle =
    t.seo?.titles?.["/"] ??
    (L === "it"
      ? "CertifyQuiz — Quiz per certificazioni IT"
      : "CertifyQuiz — IT Certification Practice");

  const defDesc =
    t.seo?.descriptions?.["/"] ??
    (L === "it"
      ? "Allenati alle certificazioni IT con quiz reali e spiegazioni passo-passo."
      : "Prepare for IT certifications with realistic quizzes and detailed explanations.");

  const languages = Object.fromEntries(locales.map((l) => [l, `${SITE}/${l}`])) as Record<string, string>;

  return {
    title: defTitle,
    description: defDesc,
    alternates: {
      canonical: `${SITE}/${L}`,
      languages: { ...languages, "x-default": `${SITE}/it` },
    },
    openGraph: {
      title: defTitle,
      description: defDesc,
      url: `${SITE}/${L}`,
      siteName: "CertifyQuiz",
      type: "website",
      locale: ogLocale[L],
      alternateLocale: locales.filter((l) => l !== L).map((l) => ogLocale[l]),
    },
    twitter: { card: "summary_large_image", title: defTitle, description: defDesc },
  };
}

// ✅ Anche il layout: Promise + string, poi narrowing a Locale
export default async function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const L: Locale = isLocale(lang) ? lang : "it";

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Header lang={L} />
      <main id="main" className="flex-1">{children}</main>
      <Footer lang={L} />
      <CookieBanner /> {/* ← NEW */}
    </div>
  );
}
