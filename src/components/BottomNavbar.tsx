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
  return lang === "en" ? "/profile" : `/${lang}/profile`;
}

// ✅ Nel tuo progetto /quiz è sempre prefissato con lingua anche per EN
function quizCertHref(lang: Locale, slug: string) {
  return `/${lang}/quiz/${slug}`;
}

// ───────────────────────────────
// Path matchers (robusti)
// ───────────────────────────────
function isHomePage(pathname: string, lang: Locale) {
  const base = homeHref(lang);
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

function getQuizContext(pathname: string): { inQuiz: boolean; slug?: string } {
  // /[lang]/quiz/topic/123 -> inQuiz (slug unknown)
  const topic = pathname.match(/^\/(?:(it|en|fr|es)\/)?quiz\/topic\/\d+/i);
  if (topic) return { inQuiz: true };

  // /[lang]/quiz/<slug>[/...]
  const cert = pathname.match(/^\/(?:(it|en|fr|es)\/)?quiz\/([^/]+)(?:\/|$)/i);
  if (cert) return { inQuiz: true, slug: cert[2] };

  return { inQuiz: false };
}

type NavItem = {
  key: "home" | "topics" | "certs" | "profile";
  href: string;
  label: string;
  icon: string;
};

export default function BottomNavbar() {
  const pathname = usePathname() || "/";
  const lang = getLocaleFromPath(pathname);

  const quizCtx = getQuizContext(pathname);

  // ───────────────────────────────
  // Items (quiz-aware)
  // ───────────────────────────────
  const items: NavItem[] = quizCtx.inQuiz
    ? [
        {
          key: "topics",
          href: quizCtx.slug ? quizCertHref(lang, quizCtx.slug) : certsHref(lang),
          label: "Topics",
          icon: "⬅️",
        },
        { key: "certs", href: certsHref(lang), label: "Certs", icon: "📜" },
        { key: "profile", href: profileHref(lang), label: "Profile", icon: "👤" },
      ]
    : [
        { key: "home", href: homeHref(lang), label: "Home", icon: "🏠" },
        { key: "certs", href: certsHref(lang), label: "Certs", icon: "📜" },
        { key: "profile", href: profileHref(lang), label: "Profile", icon: "👤" },
      ];

  // ───────────────────────────────
  // Active detection (highlight)
  // ───────────────────────────────
  const isActive = (key: NavItem["key"]) => {
    if (quizCtx.inQuiz) {
      // In quiz: "topics" attivo quando sei nella lista topic /quiz/<slug>
      if (key === "topics" && quizCtx.slug) {
        const base = quizCertHref(lang, quizCtx.slug);
        return pathname === base || pathname === `${base}/`;
      }
      // In quiz: "certs" attivo se sei sulla pagina certificazioni (puoi arrivarci dal quiz)
      if (key === "certs") return isCertificationsPage(pathname, lang);
      if (key === "profile") return isProfilePage(pathname, lang);
      return false;
    }

    // Fuori quiz
    if (key === "home") return isHomePage(pathname, lang);
    if (key === "certs") return isCertificationsPage(pathname, lang);
    if (key === "profile") return isProfilePage(pathname, lang);
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="mx-auto flex max-w-screen-sm items-center justify-around px-2 py-2 text-xs">
        {items.map((it) => {
          const active = isActive(it.key);

          return (
            <Link
              key={it.key}
              href={it.href}
              aria-current={active ? "page" : undefined}
              className={[
                "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition",
                active
                  ? "text-gray-900 bg-gray-100"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
              ].join(" ")}
            >
              {/* piccolo indicatore sopra (tipo tab) */}
              <span
                className={[
                  "h-0.5 w-6 rounded-full mb-1",
                  active ? "bg-gray-900" : "bg-transparent",
                ].join(" ")}
              />
              <span className="text-lg leading-none">{it.icon}</span>
              <span className="leading-none">{it.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
