// app/layout.tsx  ← (attenzione: NON src/app/)
import type { Metadata } from "next";
import "./globals.css";

const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.certifyquiz.com";

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: "CertifyQuiz — Quiz per certificazioni IT",
  description:
    "CertifyQuiz ti aiuta a preparare le certificazioni IT con quiz realistici e spiegazioni dettagliate, in più lingue.",
  alternates: {
    canonical: "/",
    languages: {
      it: "/it",
      en: "/en",
      fr: "/fr",
      es: "/es",
      "x-default": "/en",
    },
  },
  // ❌ NIENTE openGraph qui: lo impostano le singole pagine (lista/dettaglio)
  twitter: {
    card: "summary_large_image",
    title: "CertifyQuiz — Quiz per certificazioni IT",
    description:
      "Quiz realistici e spiegazioni per preparare le certificazioni IT, in più lingue.",
    images: [`${site}/og-home.jpg`],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const GA_ID = "G-W0YB8XL3FE";
  return (
    <html lang="it">
      <head>
        {/* GA4 */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `,
          }}
        />
        {/* PWA / icone */}
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#1a73e8" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}
