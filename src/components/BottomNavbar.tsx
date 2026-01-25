"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";

function getLocaleFromPath(pathname: string): Locale {
  const m = pathname.match(/^\/(it|fr|es)(?=\/|$)/);
  return (m?.[1] as Locale) ?? "en";
}

function homeHref(lang: Locale) {
  return lang === "en" ? "/" : `/${lang}`;
}

function certsHref(lang: Locale) {
  if (lang === "it") return "/it/certificazioni";
  if (lang === "fr") return "/fr/certifications";
  if (lang === "es") return "/es/certificaciones";
  return "/certifications";
}

function profileHref(lang: Locale) {
  // nel tuo progetto Profile è /[lang]/profile (EN /profile)
  return lang === "en" ? "/profile" : `/${lang}/profile`;
}

function isHomePage(pathname: string, lang: Locale) {
  const base = homeHref(lang); // "/" oppure "/it" "/fr" "/es"
  return pathname === base || pathname === `${base}/`;
}

function isCertificationsPage(pathname: string, lang: Locale) {
  const base = certsHref(lang);
  return pathname === base || pathname.startsWith(base + "/");
}

function isProfilePage(pathname: string, lang: Locale) {
  const base = profileHref(lang);
  return pathname === base || pathname.startsWith(base + "/");
}

export default function BottomNavbar() {
  const pathname = usePathname() || "/";
  const lang = getLocaleFromPath(pathname);

  // ✅ nascondi SOLO nei quiz veri
  const QUIZ_PAGE_RE = /^\/(?:(it|fr|es|en)\/)?quiz\/[^/]+/i;
  if (QUIZ_PAGE_RE.test(pathname)) return null;

  const onHome = isHomePage(pathname, lang);
  const onCerts = isCertificationsPage(pathname, lang);
  const onProfile = isProfilePage(pathname, lang);

  const items = [
    { key: "home", href: homeHref(lang), label: "Home", icon: "🏠" },
    { key: "certs", href: certsHref(lang), label: "Certs", icon: "📜" },
    { key: "profile", href: profileHref(lang), label: "Profile", icon: "👤" },
  ].filter((it) => {
    // ✅ nascondi l’icona della pagina corrente
    if (onHome && it.key === "home") return false;
    if (onCerts && it.key === "certs") return false;
    if (onProfile && it.key === "profile") return false;
    return true;
  });

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white md:hidden">
      <div className="mx-auto flex max-w-screen-sm items-center justify-around px-2 py-2 text-xs">
        {items.map((it) => (
          <Link
            key={it.key}
            href={it.href}
            className="flex flex-col items-center gap-1 px-2 py-1 text-gray-700"
          >
            <span className="text-lg">{it.icon}</span>
            <span>{it.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
