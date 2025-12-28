// src/app/layout.tsx
import type { Metadata } from "next";
import "@/app/globals.css";
import { Inter, Manrope } from "next/font/google";
import LayoutShellClient from "@/components/layout/LayoutShellClient";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.certifyquiz.com"),
  title: {
    default: "CertifyQuiz",
    template: "%s | CertifyQuiz",
  },
  robots: {
    index: true,
    follow: true,
  },
  twitter: {
    card: "summary_large_image",
    site: "@CertifyQuiz",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  alternates: {
    languages: {
      "x-default": "/",
    },
  },
  other: {
    "format-detection": "telephone=no",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ✅ GA4 Measurement ID (must be NEXT_PUBLIC_*)
  // Example: G-XXXXXXXXXX
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* ✅ Google Analytics 4 (loaded only if GA_ID exists in Vercel env) */}
        {GA_ID && (
          <>
            {/* Load gtag library */}
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />

            {/* Initialize dataLayer + config */}
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){window.dataLayer.push(arguments);}
                gtag('js', new Date());

                // Basic config (App Router friendly)
                gtag('config', '${GA_ID}', {
                  anonymize_ip: true,
                  page_path: window.location.pathname
                });
              `}
            </Script>
          </>
        )}
      </head>

      <body className={`${inter.variable} ${manrope.variable}`}>
        {/* EN root passa SEMPRE da LayoutShellClient */}
        <LayoutShellClient lang="en">{children}</LayoutShellClient>
      </body>
    </html>
  );
}
