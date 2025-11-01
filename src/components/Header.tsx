// src/components/layout/Header.tsx
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { dict, type Locale, withLang, legalPath } from "@/lib/i18n";
import LocaleSwitcher from "./LocaleSwitcher";
import { NavLink } from "./NavLink";
// import { Menu, X } from "lucide-react";

export default function Header({ lang }: { lang: Locale }) {
  const t = dict[lang];
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);

  // Nav principale (top)
  const nav = [
    { href: withLang(lang, "/certificazioni"), label: t.certifications },
    { href: withLang(lang, "/blog"), label: t.blog },
    { href: withLang(lang, "/prezzi"), label: t.pricing },
  ] as const;

  // Nav legale (secondaria) — usa slug localizzati centralizzati
  const legalNav = [
    { href: legalPath(lang, "privacy"), label: t.nav.privacy },
    { href: legalPath(lang, "terms"),   label: t.nav.terms },
    { href: legalPath(lang, "cookies"), label: t.nav.cookies },
    { href: legalPath(lang, "contact"), label: t.nav.contact },
  ] as const;

  // Chiudi il menu quando cambia la route
  useEffect(() => {
    if (open) setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // ESC + click fuori; blocca scroll body quando aperto
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onClick(e: MouseEvent) {
      if (!open) return;
      const target = e.target as Node;
      if (
        drawerRef.current &&
        !drawerRef.current.contains(target) &&
        btnRef.current &&
        !btnRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);

    const html = document.documentElement;
    if (open) html.classList.add("overflow-y-hidden");
    else html.classList.remove("overflow-y-hidden");

    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
      html.classList.remove("overflow-y-hidden");
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      {/* Skip to content */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-gray-900 focus:px-3 focus:py-2 focus:text-white"
      >
        {t.skipToContent ?? "Salta al contenuto"}
      </a>

      <div className="mx-auto max-w-6xl px-4">
        {/* Riga principale */}
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link href={withLang(lang, "/")} className="flex items-center gap-2" aria-label="CertifyQuiz – Home">
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-gray-900 text-xs font-bold text-white">
                CQ
              </div>
              <span className="font-semibold">CertifyQuiz</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav
            className="hidden items-center gap-1 md:flex"
            aria-label={t.mainNavigation ?? "Navigazione principale"}
          >
            {nav.map((n) => (
              <NavLink key={n.href} href={n.href}>
                {n.label}
              </NavLink>
            ))}
          </nav>

          {/* Right (desktop) */}
          <div className="hidden items-center gap-3 md:flex">
            <LocaleSwitcher current={lang} />
            <Link
              href={withLang(lang, "/login")}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100"
            >
              {t.login}
            </Link>
            <Link
              href={withLang(lang, "/inizia")}
              className="rounded-md bg-gray-900 px-3 py-2 text-sm text-white hover:opacity-90"
            >
              {t.start} 🚀
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            ref={btnRef}
            className="inline-flex items-center justify-center rounded-md border px-2.5 py-2 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? (t.closeMenu ?? "Chiudi menu") : (t.openMenu ?? "Apri menu")}
            aria-expanded={open}
            aria-controls="mobile-drawer"
          >
            {/* {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />} */}
            <span aria-hidden>{open ? "✕" : "☰"}</span>
          </button>
        </div>

        {/* Riga legale (solo desktop): link subtle allineati a destra */}
        <div className="hidden md:flex items-center justify-end gap-3 py-1 text-xs text-gray-600">
          {legalNav.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={active ? "underline underline-offset-4" : "hover:opacity-80"}
                aria-current={active ? "page" : undefined}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile Drawer */}
        <div
          id="mobile-drawer"
          ref={drawerRef}
          className={`md:hidden overflow-hidden transition-[max-height] duration-200 ease-in-out ${open ? "max-h-96 border-t" : "max-h-0"}`}
          aria-hidden={!open}
        >
          <div className="py-3">
            {/* Nav principale (mobile) */}
            <nav className="flex flex-col gap-1" aria-label={t.mainNavigation ?? "Navigazione principale"}>
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="rounded-md px-3 py-2 text-sm hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  {n.label}
                </Link>
              ))}
            </nav>

            {/* Nav legale (mobile) */}
            <div className="mt-3 border-t pt-3">
              <nav className="flex flex-col gap-1" aria-label="Link legali">
                {legalNav.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="rounded-md px-3 py-2 text-sm hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Azioni + lingua (mobile) */}
            <div className="mt-3 flex items-center gap-2">
              <LocaleSwitcher current={lang} />
              <Link
                href={withLang(lang, "/login")}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                {t.login}
              </Link>
              <Link
                href={withLang(lang, "/inizia")}
                className="rounded-md bg-gray-900 px-3 py-2 text-sm text-white hover:opacity-90"
                onClick={() => setOpen(false)}
              >
                {t.start} 🚀
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
