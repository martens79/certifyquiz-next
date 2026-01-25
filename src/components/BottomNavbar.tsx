"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";

// --------------------------------------------------
// Helpers
// --------------------------------------------------

function getLocaleFromPath(pathname: string): Locale {
  const m = pathname.match(/^\/(it|fr|es)(?=\/|$)/);
  return (m?.[1] as Locale) ?? "en";
}

// EN root per pagine SEO
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
  // Profile è sempre /<lang>/profile per it/fr/es, e /profile per EN
  return lang === "en" ? "/profile" : `/${lang}/profile`;
}

// --------------------------------------------------
// Component
// --------------------------------------------------

export default function BottomNavbar() {
  const pathname = usePathname() || "/";
  const lang = getLocaleFromPath(pathname);

  // ❌ Nascondi nei quiz (coerente con UX attuale)
  if (pathname.includes("/quiz/")) return null;

  const items = [
    { href: homeHref(lang), label: "Home", icon: "🏠" },
    { href: certsHref(lang), label: "Certs", icon: "📜" },
    { href: profileHref(lang), label: "Profile", icon: "👤" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white md:hidden">
      <div className="mx-auto flex max-w-screen-sm items-center justify-around px-2 py-2 text-xs">
        {items.map((it) => {
          const active =
            pathname === it.href ||
            (it.href !== "/" && pathname.startsWith(it.href));

          return (
            <Link
              key={it.href}
              href={it.href}
              className={`flex flex-col items-center gap-1 px-2 py-1 ${
                active ? "font-semibold text-gray-900" : "text-gray-500"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <span className="text-lg">{it.icon}</span>
              <span>{it.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
