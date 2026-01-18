// src/app/layout.tsx
import "@/app/globals.css";
import { Inter, Manrope } from "next/font/google";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import RootShellClient from "@/components/layout/RootShellClient";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-heading", display: "swap" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${manrope.variable}`}>
        <GoogleAnalytics />

        {/* ✅ Header/Footer anche per EN root (/, /pricing, /certifications, ecc.) */}
        <RootShellClient>{children}</RootShellClient>
      </body>
    </html>
  );
}
