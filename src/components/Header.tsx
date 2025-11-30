// src/components/layout/Header.tsx
"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { dict, type Locale, withLang } from "@/lib/i18n";
import LocaleSwitcher from "./LocaleSwitcher";
import { NavLink } from "./NavLink";
import { getToken, clearToken, getUser } from "@/lib/auth";

const UI: Record<
  Locale,
  {
    home: string;
    quiz: string;
    suggested: string;
    profile: string;
    login: string;
    logout: string;
    start: string;
    mainNav: string;
    quick: string;
    skip: string;
    openMenu: string;
    closeMenu: string;
  }
> = {
  it: {
    home: "Home",
    quiz: "Quiz",
    suggested: "Suggeriti",
    profile: "Profilo",
    login: "Accedi",
    logout: "Esci",
    start: "Inizia",
    mainNav: "Navigazione principale",
    quick: "Azioni rapide",
    skip: "Salta al contenuto",
    openMenu: "Apri menu",
    closeMenu: "Chiudi menu",
  },
  en: {
    home: "Home",
    quiz: "Quizzes",
    suggested: "Suggested",
    profile: "Profile",
    login: "Log in",
    logout: "Log out",
    start: "Start",
    mainNav: "Main navigation",
    quick: "Quick actions",
    skip: "Skip to content",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  fr: {
    home: "Accueil",
    quiz: "Quiz",
    suggested: "Suggérés",
    profile: "Profil",
    login: "Connexion",
    logout: "Déconnexion",
    start: "Commencer",
    mainNav: "Navigation principale",
    quick: "Actions rapides",
    skip: "Aller au contenu",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
  },
  es: {
    home: "Inicio",
    quiz: "Cuestionarios",
    suggested: "Sugeridos",
    profile: "Perfil",
    login: "Acceder",
    logout: "Cerrar sesión",
    start: "Empezar",
    mainNav: "Navegación principal",
    quick: "Acciones rápidas",
    skip: "Saltar al contenido",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
  },
};

export default function Header({ lang }: { lang: Locale }) {
  const t = dict[lang];
  const ui = UI[lang];

  const pathname = usePathname() || withLang(lang, "/");
  const pathNoQuery = pathname.split("?")[0].split("#")[0];

  const profilePath = withLang(lang, "/profile");
  const isProfile = pathNoQuery === profilePath;

  // flusso quiz: /it/quiz, /it/quiz/eipass, /it/quiz/topic/123, ecc.
  const quizRoot = withLang(lang, "/quiz");
  const isQuizFlow = pathNoQuery.startsWith(quizRoot);

  // certificazioni
  const certRoot = withLang(lang, "/certificazioni");
  const isCertDetail = pathNoQuery.startsWith(certRoot + "/");

  const router = useRouter();

  const [openDrawer, setOpenDrawer] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);

  // ---- stato utente ----
  const [hasToken, setHasToken] = useState(false);
  const [userLabel, setUserLabel] = useState<string | null>(null);
  const [userInitials, setUserInitials] = useState<string>("U");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

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
      u?.name?.trim() ||
      u?.username?.trim() ||
      u?.email?.trim() ||
      null;

    setUserLabel(label);

    if (label) {
      const parts = label.split(" ");
      const first = parts[0] || "";
      const second = parts[1] || "";
      const initials =
        (first[0] || "").toUpperCase() +
        (second[0] || "").toUpperCase();
      setUserInitials(initials || label[0]?.toUpperCase() || "U");
    } else {
      setUserInitials("U");
    }
  }, []);

  // consideriamo autenticato anche chi è già su /profile
  const isAuthenticated = hasToken || isProfile;

  // ---- nav principale (Certificazioni / Blog / Prezzi) ----
  const nav = useMemo(
    () =>
      [
        { href: withLang(lang, "/certificazioni"), label: t.certifications },
        { href: withLang(lang, "/blog"), label: t.blog },
        { href: withLang(lang, "/prezzi"), label: t.pricing },
      ] as const,
    [lang, t]
  );

  // ---- quick nav (Home / Quiz / Suggeriti / Profilo) ----
  type QuickItem = { href: string; label: string; icon: ReactNode };

  const profileHref = isAuthenticated
    ? withLang(lang, "/profile")
    : withLang(lang, `/login?redirect=${encodeURIComponent(pathname)}`);

  const quickBase = useMemo<QuickItem[]>(() => {
    const base: QuickItem[] = [
      {
        href: withLang(lang, "/"),
        label: ui.home,
        icon: (
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
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
        href: withLang(lang, "/quiz"),
        label: ui.quiz,
        icon: (
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 3.75h-9A2.25 2.25 0 0 0 5.25 6v12A2.25 2.25 0 0 0 7.5 20.25h9a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 16.5 3.75z"
            />
          </svg>
        ),
      },
      {
        href: withLang(lang, "/suggeriti"),
        label: ui.suggested,
        icon: (
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6l4 2"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3a9 9 0 1 0 9 9"
            />
          </svg>
        ),
      },
    ];

    if (isAuthenticated) {
      base.push({
        href: profileHref,
        label: ui.profile,
        icon: (
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.5 20.25a7.5 7.5 0 0 1 15 0"
            />
          </svg>
        ),
      });
    }

    return base;
  }, [
    lang,
    ui.home,
    ui.quiz,
    ui.suggested,
    ui.profile,
    profileHref,
    isAuthenticated,
  ]);

  const quick = useMemo(
    () => (isProfile ? quickBase.filter((q) => q.label !== ui.profile) : quickBase),
    [isProfile, quickBase, ui.profile]
  );

  // ---- effetti: cambio route, ESC, click fuori ----
  useEffect(() => {
    setOpenDrawer(false);
    setUserMenuOpen(false);
  }, [pathname]);

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
        {/* RIGA PRINCIPALE */}
        <div className="flex h-14 items-center justify-between">
          {/* LOGO */}
          <div className="flex items-center gap-3">
            <Link
              href={withLang(lang, "/")}
              className="flex items-center gap-2"
              aria-label="CertifyQuiz – Home"
            >
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-gray-900 text-xs font-bold text-white">
                CQ
              </div>
              <span className="font-semibold">CertifyQuiz</span>
            </Link>
          </div>

          {/* NAV DESKTOP: nascosta su /profile, /quiz..., /certificazioni/[slug] */}
          {!isProfile && !isQuizFlow && !isCertDetail && (
            <nav
              className="hidden items-center gap-1 md:flex"
              aria-label={ui.mainNav}
            >
              {nav.map((n) => (
                <NavLink key={n.href} href={n.href}>
                  {n.label}
                </NavLink>
              ))}
            </nav>
          )}

          {/* DESTRA DESKTOP */}
          <div className="hidden items-center gap-3 md:flex">
            <LocaleSwitcher current={lang} />

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
                  <span aria-hidden className="text-xs">▾</span>
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

          {/* TOGGLE MOBILE */}
          <button
            ref={btnRef}
            className="inline-flex items-center justify-center rounded-md border px-2.5 py-2 md:hidden"
            onClick={() => setOpenDrawer((v) => !v)}
            aria-label={openDrawer ? ui.closeMenu : ui.openMenu}
            aria-expanded={openDrawer}
            aria-controls="mobile-drawer"
          >
            <span aria-hidden>{openDrawer ? "✕" : "☰"}</span>
          </button>
        </div>

        {/* AZIONI RAPIDE (desktop) */}
        <div className="hidden items-center justify-between py-1.5 text-sm text-gray-800 md:flex">
          <nav className="flex items-center gap-4" aria-label={ui.quick}>
            {quick.map((q) => {
              const active = pathNoQuery === q.href;
              return (
                <Link
                  key={q.href}
                  href={q.href}
                  className={`flex items-center gap-1 ${
                    active
                      ? "underline underline-offset-4"
                      : "hover:opacity-80"
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

        {/* DRAWER MOBILE */}
        <div
          id="mobile-drawer"
          ref={drawerRef}
          className={`md:hidden overflow-hidden transition-[max-height] duration-200 ease-in-out ${
            openDrawer ? "max-h-[70vh] border-t" : "max-h-0"
          }`}
          aria-hidden={!openDrawer}
        >
          <div className="py-3">
            {/* Nav principale mobile: nascosta su /profile, /quiz..., /certificazioni/[slug] */}
            {!isProfile && !isQuizFlow && !isCertDetail && (
              <nav className="flex flex-col gap-1" aria-label={ui.mainNav}>
                {nav.map((n) => (
                  <Link
                    key={n.href}
                    href={n.href}
                    className="rounded-md px-3 py-2 text-sm hover:bg-gray-100"
                    onClick={() => setOpenDrawer(false)}
                  >
                    {n.label}
                  </Link>
                ))}
              </nav>
            )}

            {/* Azioni rapide (mobile) */}
            <div className="mt-3 border-t pt-3">
              <nav className="flex flex-col gap-1" aria-label={ui.quick}>
                {quick.map((q) => (
                  <Link
                    key={q.href}
                    href={q.href}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100"
                    onClick={() => setOpenDrawer(false)}
                  >
                    {q.icon}
                    <span>{q.label}</span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Azioni + lingua (mobile) */}
            <div className="mt-3 flex items-center gap-2">
              <LocaleSwitcher current={lang} />
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
                <>
                  {!isProfile && (
                    <Link
                      href={withLang(lang, "/profile")}
                      className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100"
                      onClick={() => setOpenDrawer(false)}
                    >
                      {ui.profile}
                    </Link>
                  )}
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
