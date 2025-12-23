// src/components/layout/MobileBottomNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { withLang } from "@/lib/i18n";

type Props = {
  lang: Locale;
  isAuthenticated: boolean;
};

type Item = {
  key: "home" | "quiz" | "certs" | "profile";
  href: string;
  label: string;
  icon: ReactNode;
  match: (pathNoQuery: string) => boolean;
};

export default function MobileBottomNav({ lang, isAuthenticated }: Props) {
  const pathname = usePathname() || withLang(lang, "/");
  const pathNoQuery = pathname.split("?")[0].split("#")[0];

  // Nascondi la bottom nav durante il "quiz flow" (evita tap accidentali in quiz)
  // Mostriamo invece su /quiz-home e /quiz-suggeriti (che NON sono /quiz/...)
  const quizRoot = withLang(lang, "/quiz");
  const isQuizFlow = pathNoQuery.startsWith(quizRoot);
  if (isQuizFlow) return null;

  const profileHref = isAuthenticated
    ? withLang(lang, "/profile")
    : withLang(lang, `/login?redirect=${encodeURIComponent(pathname)}`);

  const items: Item[] = [
    {
      key: "home",
      href: withLang(lang, "/"),
      label: lang === "it" ? "Home" : lang === "fr" ? "Accueil" : lang === "es" ? "Inicio" : "Home",
      match: (p) => p === withLang(lang, "/"),
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 4l9 5.75v8.25A2.25 2.25 0 0 1 18.75 21H5.25A2.25 2.25 0 0 1 3 18V9.75z" />
        </svg>
      ),
    },
    {
      key: "quiz",
      href: withLang(lang, "/quiz-home"),
      label:
        lang === "it" ? "Quiz" : lang === "fr" ? "Quiz" : lang === "es" ? "Quiz" : "Quizzes",
      match: (p) => p === withLang(lang, "/quiz-home") || p === withLang(lang, "/quiz-suggeriti"),
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75h-9A2.25 2.25 0 0 0 5.25 6v12A2.25 2.25 0 0 0 7.5 20.25h9a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 16.5 3.75z" />
        </svg>
      ),
    },
    {
      key: "certs",
      href: withLang(lang, "/certificazioni"),
      label:
        lang === "it" ? "Cert" : lang === "fr" ? "Cert" : lang === "es" ? "Cert" : "Certs",
      match: (p) => p === withLang(lang, "/certificazioni") || p.startsWith(withLang(lang, "/certificazioni") + "/"),
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75" />
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
      href: profileHref,
      label:
        lang === "it" ? "Profilo" : lang === "fr" ? "Profil" : lang === "es" ? "Perfil" : "Profile",
      match: (p) => p === withLang(lang, "/profile") || p.startsWith(withLang(lang, "/login")),
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.5 20.25a7.5 7.5 0 0 1 15 0" />
        </svg>
      ),
    },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t bg-white/90 backdrop-blur supports-backdrop-filter:bg-white/70 pb-[env(safe-area-inset-bottom)]"
      aria-label="Bottom navigation"
    >
      <div className="mx-auto max-w-6xl px-2">
        <div className="flex h-14 items-center justify-around">
          {items.map((it) => {
            const active = it.match(pathNoQuery);
            return (
              <Link
                key={it.key}
                href={it.href}
                aria-label={it.label}
                aria-current={active ? "page" : undefined}
                className={`flex w-full flex-col items-center justify-center gap-1 rounded-lg py-2 text-xs transition ${
                  active ? "text-gray-900" : "text-gray-500"
                }`}
              >
                <span className={active ? "" : "opacity-90"} aria-hidden>
                  {it.icon}
                </span>
                <span className={active ? "font-semibold" : "font-medium"}>{it.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
