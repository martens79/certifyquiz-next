"use client";

import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n";

// ✅ componenti reali (dalla tua cartella)
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
// opzionali se li usi
// import BottomNavbar from "@/components/BottomNavbar";

type Props = {
  lang: Locale;
  children: ReactNode;
};

export default function LayoutShellClient({ lang, children }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      {/* 🔝 Header */}
      <Header lang={lang} />

      {/* 📄 Contenuto pagina */}
      <main className="flex-1">{children}</main>

      {/* 🍪 Cookie banner (se previsto) */}
      <CookieBanner />

      {/* 🔻 Footer */}
      <Footer lang={lang} />

      {/* 📱 Bottom nav mobile (se lo usi) */}
      {/* <BottomNavbar /> */}
    </div>
  );
}
