// src/app/layout.tsx
import type { Metadata } from "next";
import "@/app/globals.css";
import { Inter, Manrope } from "next/font/google";

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
    site: "@CertifyQuiz", // aggiorna se/quando avrai l'handle
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  // fallback assoluto (x-default) — le pagine per-lingua aggiungeranno le proprie alternates
  alternates: {
    languages: {
      "x-default": "/it",
    },
  },
  other: {
    // Evita il “tel autodetect” su iOS per numeri
    "format-detection": "telephone=no",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Forziamo lang coerente e sopprimiamo micro-differenze in dev
    <html lang="it-IT" suppressHydrationWarning>
      <body className={`${inter.variable} ${manrope.variable}`}>
        {children}
      </body>
    </html>
  );
}
