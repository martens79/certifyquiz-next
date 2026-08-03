"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import BottomNavbar from "@/components/BottomNavbar";

type Props = {
  lang: Locale;
  children: ReactNode;
};

export default function LayoutShellClient({ lang, children }: Props) {
  const pathname = usePathname();

  // Evita che la navigazione mobile copra CTA, piani e preview nei passaggi
  // ad alta intenzione. La navigazione principale resta disponibile nell'header.
  const hideBottomNav =
    pathname.includes("/quiz/") ||
    pathname === "/pricing" ||
    pathname.endsWith("/prezzi") ||
    pathname.endsWith("/prix") ||
    pathname.endsWith("/precios") ||
    pathname.includes("/guide/") ||
    pathname === "/maps" ||
    pathname.endsWith("/mappe") ||
    pathname.endsWith("/cartes") ||
    pathname.endsWith("/mapas");

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      {/* ✅ NON passare user: HeaderAuthSlot gestisce tutto */}
      <Header lang={lang} />

      <main className={`flex-1 ${hideBottomNav ? "pb-0" : "pb-16"}`}>
        {children}
      </main>

      <CookieBanner />
      <Footer lang={lang} />

      {!hideBottomNav && <BottomNavbar />}
    </div>
  );
}
