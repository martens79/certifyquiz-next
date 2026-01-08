// src/components/layout/MobileBottomNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { withLang } from "@/lib/i18n";
import type { MinimalUser } from "@/lib/auth";

type Props = {
  lang: Locale;
  isAuthenticated?: boolean;
  user?: MinimalUser | null;
};

type ItemKey = "home" | "quiz" | "certs" | "profile";

type Item = {
  key: ItemKey;
  href: string;
  label: string;
  icon: ReactNode;
  match: (pathNoQuery: string) => boolean;
};

function tLabel(lang: Locale, key: ItemKey) {
  const labels: Record<ItemKey, Record<Locale, string>> = {
    home: { it: "Home", en: "Home", fr: "Accueil", es: "Inicio" },
    quiz: { it: "Quiz", en: "Quizzes", fr: "Quiz", es: "Quiz" },
    certs: { it: "Cert", en: "Certs", fr: "Cert", es: "Cert" },
    profile: { it: "Profilo", en: "Profile", fr: "Profil", es: "Perfil" },
  };
  return labels[key][lang];
}

/**
 * ✅ Standard: tutte le pagine pubbliche sono sotto /{lang}/...
 * (EN incluso)
 */
function publicHref(lang: Locale, path: string) {
  return withLang(lang, path);
}

/**
 * Hide SOLO durante quiz flow vero: /{lang}/quiz/<qualcosa>
 * Deve RESTARE visibile su /{lang}/quiz-home e /{lang}/quiz-suggeriti
 */
function isQuizFlow(pathNoQuery: string, lang: Locale) {
  const quizPrefix = `/${lang}/quiz/`;
  return pathNoQuery.startsWith(quizPrefix);
}

export default function MobileBottomNav({
  lang,
  isAuthenticated = false,
}: Props) {
  const pathname = usePathname() || `/${lang}`;
  const pathNoQuery = pathname.split("?")[0].split("#")[0];

  // Durante il quiz vero e proprio, nascondi la bottom nav
  if (isQuizFlow(pathNoQuery, lang)) return null;

  // HREF base
  const homeHref = publicHref(lang, "/");
  const quizHomeHref = publicHref(lang, "/quiz-home");
  const suggestedHref = publicHref(lang, "/quiz-suggeriti");

  // Cert list: ora standardizzata con /{lang}/... (EN incluso)
  // (Se in futuro vuoi EN-root /certifications, lo fai con rewrite/canonical, non qui)
  const certsHref =
    lang === "it"
      ? publicHref(lang, "/certificazioni")
      : lang === "es"
      ? publicHref(lang, "/certificaciones")
      : publicHref(lang, "/certifications"); // en/fr

  // Se non loggato → login con redirect all'URL attuale
  const loginHref = publicHref(
    lang,
    `/login?redirect=${encodeURIComponent(pathname)}`
  );

  const profileHref = publicHref(lang, "/profile");

  const items: Item[] = [
    {
      key: "home",
      href: homeHref,
      label: tLabel(lang, "home"),
      match: (p) => p === homeHref,
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 9.75L12 4l9 5.75v8.25A2.25 2.25 0 0 1 18.75 21H5.25A2.25 2.25 0 0 1 3 18V9.75z"
          />
        </svg>
      ),
    },
    {
      key: "quiz",
      href: quizHomeHref,
      label: tLabel(lang, "quiz"),
      match: (p) => p === quizHomeHref || p === suggestedHref,
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 3.75h-9A2.25 2.25 0 0 0 5.25 6v12A2.25 2.25 0 0 0 7.5 20.25h9a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 16.5 3.75z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 8.25h7.5M8.25 12h7.5M8.25 15.75h4.5"
          />
        </svg>
      ),
    },
    {
      key: "certs",
      href: certsHref,
      label: tLabel(lang, "certs"),
      match: (p) => p === certsHref || p.startsWith(certsHref + "/"),
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 2.25c-2.485 0-4.5 2.015-4.5 4.5v.75H6A2.25 2.25 0 0 0 3.75 9.75v9A2.25 2.25 0 0 0 6 21h12a2.25 2.25 0 0 0 2.25-2.25v-9A2.25 2.25 0 0 0 18 7.5h-1.5v-.75c0-2.485-2.015-4.5-4.5-4.5z"
          />
        </svg>
      ),
    },
    {
      key: "profile",
      href: isAuthenticated ? profileHref : loginHref,
      label: tLabel(lang, "profile"),
      match: (p) =>
        p === profileHref ||
        p.startsWith(profileHref + "/") ||
        p.startsWith(publicHref(lang, "/login")),
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.5 20.25a7.5 7.5 0 0 1 15 0"
          />
        </svg>
      ),
    },
  ];

  // ✅ REGOLA UX: non mostrare la voce della pagina/sezione corrente
  const visibleItems = items.filter((it) => !it.match(pathNoQuery));

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/80 pb-[env(safe-area-inset-bottom)]"
      aria-label="Bottom navigation"
    >
      <div className="mx-auto max-w-6xl px-2">
        <div className="flex h-14 items-center justify-around">
          {visibleItems.map((it) => (
            <Link
              key={it.key}
              href={it.href}
              aria-label={it.label}
              className="flex w-full flex-col items-center justify-center gap-1 rounded-lg py-2 text-xs text-gray-500 transition hover:text-gray-900"
            >
              <span className="opacity-90" aria-hidden>
                {it.icon}
              </span>
              <span className="font-medium">{it.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
