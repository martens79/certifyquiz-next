"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import MobileBottomNav from "./MobileBottomNav";

// ✅ Promo popup (tutto gratis tempo limitato)
import FreeLimitedTimePopup from "@/components/promo/FreeLimitedTimePopup";

import { getToken, onTokenChange, getUser, onUserChange } from "@/lib/auth";
import type { MinimalUser } from "@/lib/auth";

type Props = {
  lang: Locale;
  children: ReactNode;
};

function stripQueryHash(p: string) {
  return p.split("?")[0].split("#")[0];
}

function shouldHideBottomNav(pathname: string, lang: Locale) {
  const p = stripQueryHash(pathname);

  // ✅ hide SOLO durante quiz flow vero: /{lang}/quiz/...
  const quizPrefix = `/${lang}/quiz/`;
  if (p.startsWith(quizPrefix)) return true;

  // ✅ auth pages: sempre /{lang}/...
  const prefix = `/${lang}`;
  if (p.startsWith(`${prefix}/login`)) return true;
  if (p.startsWith(`${prefix}/register`)) return true;
  if (p.startsWith(`${prefix}/forgot-password`)) return true;

  return false;
}

function shouldHidePromoPopup(pathname: string, lang: Locale) {
  const p = stripQueryHash(pathname);

  // Durante quiz: non interrompere l'esperienza
  const quizPrefix = `/${lang}/quiz/`;
  if (p.startsWith(quizPrefix)) return true;

  // In auth pages: evita distrazioni
  const prefix = `/${lang}`;
  if (p.startsWith(`${prefix}/login`)) return true;
  if (p.startsWith(`${prefix}/register`)) return true;
  if (p.startsWith(`${prefix}/forgot-password`)) return true;

  return false;
}

export default function LayoutShellClient({ lang, children }: Props) {
  const pathnameRaw = usePathname();
  const pathname = pathnameRaw || `/${lang}`;

  const hideBottomNav = useMemo(
    () => shouldHideBottomNav(pathname, lang),
    [pathname, lang]
  );

  const hidePromoPopup = useMemo(
    () => shouldHidePromoPopup(pathname, lang),
    [pathname, lang]
  );

  // ✅ evita hydration mismatch: sul server non esistono token/user
  const [mounted, setMounted] = useState(false);

  // Stato auth/user: inizialmente "safe"
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<MinimalUser | null>(null);

  useEffect(() => {
    setMounted(true);

    // Prima lettura SOLO dopo mount (client)
    const token = getToken();
    setIsAuthenticated(Boolean(token));
    setUser(getUser());

    const unsubToken = onTokenChange((t) => {
      setIsAuthenticated(Boolean(t));
      if (!t) setUser(null);
    });

    const unsubUser = onUserChange((u) => {
      setUser(u);
    });

    return () => {
      unsubToken();
      unsubUser();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      {/* user solo dopo mount (evita mismatch su label/initials) */}
      <Header lang={lang} user={mounted ? user : null} />

      {/* ✅ Popup promo: client-only, max 1 volta al giorno, NON al primo ingresso assoluto */}
      {mounted && !hidePromoPopup && <FreeLimitedTimePopup lang={lang} />}

      {/* ✅ padding per non finire sotto la bottom nav */}
      <main id="main" className="flex-1 pb-16">
        {children}
      </main>

      <Footer lang={lang} />
      <CookieBanner />

      {mounted && !hideBottomNav && (
        <MobileBottomNav
          lang={lang}
          isAuthenticated={isAuthenticated}
          user={user}
        />
      )}
    </div>
  );
}
