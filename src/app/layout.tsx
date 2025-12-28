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
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${manrope.variable}`}>
        {/* ✅ GOOGLE ANALYTICS 4 — MUST BE IN BODY */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){window.dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  anonymize_ip: true,
                  page_path: window.location.pathname
                });
              `}
            </Script>
          </>
        )}

        {/* App shell */}
        <LayoutShellClient lang="en">{children}</LayoutShellClient>
      </body>
    </html>
  );
}
