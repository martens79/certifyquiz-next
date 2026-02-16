// src/components/layout/Header.tsx
"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  Suspense,
} from "react";
import { usePathname, useRouter } from "next/navigation";

import { dict, type Locale, withLang } from "@/lib/i18n";
import LocaleSwitcher from "./LocaleSwitcher";
import { getToken, clearToken, getUser } from "@/lib/auth";
import type { MinimalUser } from "@/lib/auth";

import {
  certificationsPath,
  pricingPath,
  quizHomePath,
} from "@/lib/paths";

/* ------------------------------------------------------------------ */
/* UI labels                                                           */
/* ------------------------------------------------------------------ */

const UI: Record<
  Locale,
  {
    home: string;
    certifications: string;
    blog: string;
    pricing: string;
    quiz: string;
    suggested: string;
    profile: string;
    login: string;
    logout: string;
    start: string;
    quick: string;
    skip: string;
    openMenu: string;
    closeMenu: string;
    secondaryNav: string;
  }
> = {
  it: {
    home: "Home",
    certifications: "Certificazioni",
    blog: "Blog",
    pricing: "Premium",
    quiz: "Quiz",
    suggested: "Suggeriti",
    profile: "Profilo",
    login: "Accedi",
    logout: "Esci",
    start: "Inizia",
    quick: "Azioni rapide",
    skip: "Salta al contenuto",
    openMenu: "Apri menu",
    closeMenu: "Chiudi menu",
    secondaryNav: "Menu",
  },
  en: {
    home: "Home",
    certifications: "Certifications",
    blog: "Blog",
    pricing: "Premium",
    quiz: "Quizzes",
    suggested: "Suggested",
    profile: "Profile",
    login: "Log in",
    logout: "Log out",
    start: "Start",
    quick: "Quick actions",
    skip: "Skip to content",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    secondaryNav: "Menu",
  },
  fr: {
    home: "Accueil",
    certifications: "Certifications",
    blog: "Blog",
    pricing: "Premium",
    quiz: "Quiz",
    suggested: "Suggérés",
    profile: "Profil",
    login: "Connexion",
    logout: "Déconnexion",
    start: "Commencer",
    quick: "Actions rapides",
    skip: "Aller au contenu",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    secondaryNav: "Menu",
  },
  es: {
    home: "Inicio",
    certifications: "Certificaciones",
    blog: "Blog",
    pricing: "Premium",
    quiz: "Cuestionarios",
    suggested: "Sugeridos",
    profile: "Perfil",
    login: "Acceder",
    logout: "Cerrar sesión",
    start: "Empezar",
    quick: "Acciones rápidas",
    skip: "Saltar al contenido",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    secondaryNav: "Menú",
  },
};

/* ------------------------------------------------------------------ */
/* Icons (inline SVG, no deps)                                         */
/* ------------------------------------------------------------------ */

function IconHome() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 4l9 5.75v8.25A2.25 2.25 0 0 1 18.75 21H5.25A2.25 2.25 0 0 1 3 18V9.75z" />
    </svg>
  );
}
function IconCerts() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6.75A2.25 2.25 0 0 1 6.25 4.5h11.5A2.25 2.25 0 0 1 20 6.75v10.5A2.25 2.25 0 0 1 17.75 19.5H6.25A2.25 2.25 0 0 1 4 17.25V6.75z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 8h8M8 12h8M8 16h5" />
    </svg>
  );
}
function IconBlog() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6.75A2.25 2.25 0 0 1 6.25 4.5h9.5A4.75 4.75 0 0 1 20.5 9.25v10.25A2.25 2.25 0 0 1 18.25 21H6.25A2.25 2.25 0 0 1 4 18.75V6.75z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 8.5h8M8 12h8M8 15.5h6" />
    </svg>
  );
}
function IconPricing() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m0-12c-2.5 0-4.5 1.25-4.5 2.75S9.5 11.5 12 11.5s4.5 1.25 4.5 2.75S14.5 17 12 17m0-11c2.5 0 4.5 1.25 4.5 2.75" />
    </svg>
  );
}
function IconQuiz() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75h-9A2.25 2.25 0 0 0 5.25 6v12A2.25 2.25 0 0 0 7.5 20.25h9a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 16.5 3.75z" />
    </svg>
  );
}
function IconSuggested() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a9 9 0 1 0 9 9" />
    </svg>
  );
}
function IconUser() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.5 20.25a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}
function IconSearch() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type Props = {
  lang: Locale;
  user?: MinimalUser | null;
};

type QuickItem = { href: string; label: string; icon: ReactNode };

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function Header({ lang, user }: Props) {
  const t = dict[lang];
  const ui = UI[lang];

  const router = useRouter();
  const pathname = usePathname() || (lang === "en" ? "/" : withLang(lang, "/"));
  const pathNoQuery = pathname.split("?")[0].split("#")[0];

  /**
   * ✅ Helper: EN = root (nessun /en)
   * IT/FR/ES = prefisso via withLang
   * Usalo SOLO per pagine SEO con path “semplici”
   */
  const H = useMemo(() => {
    return (path: string) => (lang === "en" ? path : withLang(lang, path));
  }, [lang]);

  // ---- routes coerenti (single source of truth) ----
  const homeHref = H("/");
  const blogHref = H("/blog");
  const pricingHref = pricingPath(lang); // EN = /pricing, others = /{lang}/prezzi (o slug locale)
  const certsHref = certificationsPath(lang); // SEO root by lang
  const quizHomeHref = quizHomePath(lang); // QUIZ sempre /{lang}
  const suggestedHref = lang === "en" ? "/suggested" : withLang(lang, "/quiz-suggeriti");
    // ---- about / chi sono ----
  const aboutHref =
    lang === "it" ? "/it/chi-sono" : lang === "fr" ? "/fr/a-propos" : lang === "es" ? "/es/sobre-mi" : "/about";

  const aboutLabel =
    lang === "it" ? "Chi sono" : lang === "fr" ? "À propos" : lang === "es" ? "Sobre mí" : "About";


  // ---- profile/auth ----
  const profilePath = H("/profile");
  const isProfile = pathNoQuery === profilePath;

  const [hasToken, setHasToken] = useState(false);
  const [userLabel, setUserLabel] = useState<string | null>(null);
  const [userInitials, setUserInitials] = useState<string>("U");
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const [openDrawer, setOpenDrawer] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  function initialsFallback(initials: string, label: string) {
    return initials || label[0]?.toUpperCase() || "U";
  }

  useEffect(() => {
    const token = getToken();
    const logged = !!token;
    setHasToken(logged);

    if (!logged) {
      setUserLabel(null);
      setUserInitials("U");
      return;
    }

    const u = getUser?.() as
      | { name?: string; username?: string; email?: string }
      | null
      | undefined;

    const label =
      u?.name?.trim() || u?.username?.trim() || u?.email?.trim() || null;

    setUserLabel(label);

    if (label) {
      const parts = label.split(" ");
      const first = parts[0] || "";
      const second = parts[1] || "";
      const initials =
        (first[0] || "").toUpperCase() + (second[0] || "").toUpperCase();
      setUserInitials(initialsFallback(initials, label));
    } else {
      setUserInitials("U");
    }
  }, [pathname]);

  const isAuthenticated = hasToken || isProfile;

  const profileHref = isAuthenticated
    ? H("/profile")
    : H(`/login?redirect=${encodeURIComponent(pathname)}`);

  // ---- quick actions (desktop bar + reused in mobile drawer) ----
  const quickBase = useMemo<QuickItem[]>(() => {
   const base: QuickItem[] = [
  { href: homeHref, label: ui.home, icon: <IconHome /> },

  { href: certsHref, label: t.certifications ?? ui.certifications, icon: <IconCerts /> },

  // 🔍 Search (porta a Certificazioni e attiva focus input)
  { href: `${certsHref}?search=1`, label: "Search", icon: <IconSearch /> },

  { href: blogHref, label: t.blog ?? ui.blog, icon: <IconBlog /> },
  { href: pricingHref, label: t.pricing ?? ui.pricing, icon: <IconPricing /> },
  { href: quizHomeHref, label: ui.quiz, icon: <IconQuiz /> },
  { href: suggestedHref, label: ui.suggested, icon: <IconSuggested /> },
];


    if (isAuthenticated) {
      base.push({ href: profileHref, label: ui.profile, icon: <IconUser /> });
    }

    return base;
  }, [
    blogHref,
    certsHref,
    homeHref,
    isAuthenticated,
    pricingHref,
    profileHref,
    quizHomeHref,
    suggestedHref,
    t.blog,
    t.certifications,
    t.pricing,
    ui.blog,
    ui.certifications,
    ui.home,
    ui.profile,
    ui.pricing,
    ui.quiz,
    ui.suggested,
  ]);

  const quick = useMemo(
    () => (isProfile ? quickBase.filter((q) => q.label !== ui.profile) : quickBase),
    [isProfile, quickBase, ui.profile]
  );

  // ---- close menus on route change ----
  useEffect(() => {
    setOpenDrawer(false);
    setUserMenuOpen(false);
  }, [pathname]);

  // ---- esc + click outside + lock scroll when drawer open ----
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpenDrawer(false);
        setUserMenuOpen(false);
      }
    }

    function onClick(e: MouseEvent) {
      const target = e.target as Node;

      if (
        openDrawer &&
        drawerRef.current &&
        !drawerRef.current.contains(target) &&
        btnRef.current &&
        !btnRef.current.contains(target)
      ) {
        setOpenDrawer(false);
      }

      if (
        userMenuOpen &&
        userMenuRef.current &&
        !userMenuRef.current.contains(target)
      ) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);

    const html = document.documentElement;
    if (openDrawer) html.classList.add("overflow-y-hidden");
    else html.classList.remove("overflow-y-hidden");

    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
      html.classList.remove("overflow-y-hidden");
    };
  }, [openDrawer, userMenuOpen]);

  const handleLogout = () => {
    clearToken();
    setHasToken(false);
    setUserLabel(null);
    setUserInitials("U");
    setUserMenuOpen(false);
    router.push(withLang(lang, "/login"));
  };

  const isActive = (href: string) => pathNoQuery === href;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur supports-backdrop-filter:bg-white/60">
      {/* Skip link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-gray-900 focus:px-3 focus:py-2 focus:text-white"
      >
        {ui.skip}
      </a>

      <div className="mx-auto max-w-6xl px-4">
        {/* Top row */}
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link
            href={homeHref}
            className="flex items-center gap-2"
            aria-label="CertifyQuiz – Home"
            onClick={() => {
              setOpenDrawer(false);
              setUserMenuOpen(false);
            }}
          >
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-gray-900 text-xs font-bold text-white">
              CQ
            </div>
            <span className="font-semibold">CertifyQuiz</span>
          </Link>

          {/* Right desktop */}
<div className="hidden items-center gap-3 md:flex">
  <Suspense fallback={null}>
    <LocaleSwitcher current={lang} />
  </Suspense>

  {/* 🔍 Search certifications */}
  <Link
    href={`${certsHref}?search=1`}
    aria-label="Search certifications"
    title="Search certifications"
    className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-gray-50"
    onClick={() => {
      setOpenDrawer(false);
      setUserMenuOpen(false);
    }}
  >
    <IconSearch />
  </Link>

  {!isAuthenticated ? (
    <>
      <Link
        href={withLang(lang, "/login")}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100"
      >
        {ui.login}
      </Link>
      <Link
        href={withLang(lang, "/inizia")}
        className="rounded-md bg-gray-900 px-3 py-2 text-sm text-white hover:opacity-90"
      >
        {ui.start} 🚀
      </Link>
    </>
  ) : (
    <div ref={userMenuRef} className="relative flex items-center">
      <button
        type="button"
        onClick={() => setUserMenuOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-2 py-1.5 text-sm hover:bg-gray-50"
        aria-haspopup="menu"
        aria-expanded={userMenuOpen}
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white">
          {userInitials}
        </div>
        <span className="max-w-[140px] truncate text-xs md:text-sm">
          {userLabel || "Account"}
        </span>
        <span aria-hidden className="text-xs">
          ▾
        </span>
      </button>

      {userMenuOpen && (
        <div
          role="menu"
          className="absolute right-0 top-10 w-44 rounded-md border bg-white shadow-lg"
        >
          {!isProfile && (
            <Link
              href={withLang(lang, "/profile")}
              className="block px-3 py-2 text-sm hover:bg-gray-100"
              onClick={() => setUserMenuOpen(false)}
            >
              {ui.profile}
            </Link>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
          >
            <span>{ui.logout}</span>
          </button>
        </div>
      )}
    </div>
  )}
</div>

          {/* Right mobile */}
<div className="flex items-center gap-2 md:hidden">
  <Suspense fallback={null}>
    <LocaleSwitcher current={lang} />
  </Suspense>

  {/* 🔍 Search certifications */}
  <Link
    href={`${certsHref}?search=1`}
    aria-label="Search certifications"
    className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-gray-50"
    onClick={() => {
      setOpenDrawer(false);
      setUserMenuOpen(false);
    }}
  >
    <IconSearch />
  </Link>

  <Link
    href={profileHref}
    aria-label={isAuthenticated ? ui.profile : ui.login}
    className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white text-sm hover:bg-gray-50"
    onClick={() => {
      setOpenDrawer(false);
      setUserMenuOpen(false);
    }}
  >
    {isAuthenticated ? (
      <span className="font-semibold">{userInitials}</span>
    ) : (
      <span aria-hidden>👤</span>
    )}
  </Link>

  <button
    ref={btnRef}
    className="inline-flex items-center justify-center rounded-md border px-2.5 py-2"
    onClick={() => setOpenDrawer((v) => !v)}
    aria-label={openDrawer ? ui.closeMenu : ui.openMenu}
    aria-expanded={openDrawer}
    aria-controls="mobile-drawer"
  >
    <span aria-hidden>{openDrawer ? "✕" : "☰"}</span>
  </button>
</div>
        </div>

        {/* Quick actions (desktop) */}
        <div className="hidden items-center justify-between py-1.5 text-sm text-gray-800 md:flex">
          <nav className="flex items-center gap-4" aria-label={ui.quick}>
            {quick.map((q) => {
              const active = isActive(q.href);
              return (
                <Link
                  key={q.href}
                  href={q.href}
                  className={`flex items-center gap-1 ${
                    active ? "underline underline-offset-4" : "hover:opacity-80"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {q.icon}
                  <span>{q.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Mobile drawer (reuse quick) + auth actions */}
        <div
          id="mobile-drawer"
          ref={drawerRef}
          className={`md:hidden overflow-hidden transition-[max-height] duration-200 ease-in-out ${
            openDrawer ? "max-h-[70vh] border-t" : "max-h-0"
          }`}
          aria-hidden={!openDrawer}
        >
          <div className="py-3">
            <nav className="flex flex-col gap-1" aria-label={ui.secondaryNav}>
  {quick.map((q) => (
    <Link
      key={q.href}
      href={q.href}
      className="rounded-md px-3 py-2 text-sm hover:bg-gray-100"
      onClick={() => setOpenDrawer(false)}
    >
      {q.label}
    </Link>
  ))}

  {/* About / Chi sono */}
  <Link
    href={aboutHref}
    className="rounded-md px-3 py-2 text-sm hover:bg-gray-100"
    onClick={() => setOpenDrawer(false)}
  >
    {aboutLabel}
  </Link>
</nav>


            <div className="mt-3 border-t pt-3 flex items-center gap-2 px-3">
              {!isAuthenticated ? (
                <>
                  <Link
                    href={withLang(lang, "/login")}
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100"
                    onClick={() => setOpenDrawer(false)}
                  >
                    {ui.login}
                  </Link>
                  <Link
                    href={withLang(lang, "/inizia")}
                    className="rounded-md bg-gray-900 px-3 py-2 text-sm text-white hover:opacity-90"
                    onClick={() => setOpenDrawer(false)}
                  >
                    {ui.start} 🚀
                  </Link>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    handleLogout();
                    setOpenDrawer(false);
                  }}
                  className="rounded-md border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  {ui.logout}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
