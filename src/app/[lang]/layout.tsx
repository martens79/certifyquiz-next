// src/app/[lang]/layout.tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import LayoutShellClient from "@/components/layout/LayoutShellClient";
import { dict, locales, type Locale, isLocale } from "@/lib/i18n";

const SITE = "https://www.certifyquiz.com";

const ogLocale: Record<Locale, string> = {
  it: "it_IT",
  en: "en_US",
  fr: "fr_FR",
  es: "es_ES",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
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

  const languages = Object.fromEntries(locales.map((l) => [l, `${SITE}/${l}`])) as Record<
    string,
    string
  >;

  return {
    title: defTitle,
    description: defDesc,
    alternates: {
      canonical: `${SITE}/${L}`,
      languages: { ...languages, "x-default": `${SITE}/` },
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
    twitter: {
      card: "summary_large_image",
      title: defTitle,
      description: defDesc,
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const L: Locale = isLocale(lang) ? lang : "it";

  // ✅ Vercel env: NEXT_PUBLIC_GA_ID = "G-...."
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <>
      {/* ================= GOOGLE ANALYTICS 4 ================= */}
      {GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', {
                anonymize_ip: true,
                // niente page_path manuale: con App Router rischi di rompere i page_view
              });
            `}
          </Script>
        </>
      )}

      {/* ================= APP SHELL ================= */}
      <LayoutShellClient lang={L}>{children}</LayoutShellClient>
    </>
  );
}
