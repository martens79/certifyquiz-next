// app/layout.tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import "./globals.css";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.certifyquiz.com";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-W0YB8XL3FE";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "CertifyQuiz — Quiz per certificazioni IT",
    template: "%s — CertifyQuiz",
  },
  description:
    "CertifyQuiz ti aiuta a preparare le certificazioni IT con quiz realistici e spiegazioni dettagliate, in più lingue.",
  alternates: {
    canonical: "/",
    languages: {
      "it-IT": "/it",
      "en-US": "/en",
      "fr-FR": "/fr",
      "es-ES": "/es",
      "x-default": "/en",
    },
  },
  robots: { index: true, follow: true },
  twitter: {
    card: "summary_large_image",
    title: "CertifyQuiz — Quiz per certificazioni IT",
    description:
      "Quiz realistici e spiegazioni per preparare le certificazioni IT, in più lingue.",
    images: [`${SITE}/og-home.jpg`],
  },
  // openGraph lo demandiamo a lista/dettaglio (meglio per titoli/descrizioni specifiche)
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="it">
      <head>
        {/* Perf hints per GA */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* PWA / theming */}
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#1a73e8" />
        <link rel="icon" href="/favicon.ico" />

        {/* GA4 (afterInteractive) */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
