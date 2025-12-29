// src/app/layout.tsx
import type { Metadata } from "next";
import "@/app/globals.css";
import { Inter, Manrope } from "next/font/google";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";

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
  title: { default: "CertifyQuiz", template: "%s | CertifyQuiz" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${manrope.variable}`}>
        {/* ✅ GA globale (client) */}
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
