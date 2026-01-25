"use client";

import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import BottomNavbar from "@/components/BottomNavbar"; // ✅ riattiva

type Props = {
  lang: Locale;
  children: ReactNode;
};

export default function LayoutShellClient({ lang, children }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Header lang={lang} />

      {/* ✅ padding bottom per non coprire contenuto su mobile */}
      <main className="flex-1 pb-16">{children}</main>

      <CookieBanner />
      <Footer lang={lang} />

      {/* ✅ Bottom nav mobile */}
      <BottomNavbar />
    </div>
  );
}
