// src/app/layout.tsx
import type { Metadata } from "next";
import "@/app/globals.css";
import { Inter, Manrope } from "next/font/google";
import LayoutShellClient from "@/components/layout/LayoutShellClient";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${manrope.variable}`}>
        {/* EN root passa SEMPRE da LayoutShellClient */}
        <LayoutShellClient lang="en">
          {children}
        </LayoutShellClient>
      </body>
    </html>
  );
}
