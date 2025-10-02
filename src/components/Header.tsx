"use client";

import Link from "next/link";
import { useState } from "react";
import { dict, type Locale, withLang } from "@/lib/i18n";
import LocaleSwitcher from "./LocaleSwitcher";
import { NavLink } from "./NavLink";

export default function Header({ lang }: { lang: Locale }) {
  const t = dict[lang];
  const [open, setOpen] = useState(false);

  const nav = [
    { href: withLang(lang, "/certificazioni"), label: t.certifications },
    { href: withLang(lang, "/blog"), label: t.blog },
    { href: withLang(lang, "/prezzi"), label: t.pricing },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link href={withLang(lang, "/")} className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-gray-900 text-white grid place-items-center text-xs font-bold">
                CQ
              </div>
              <span className="font-semibold">CertifyQuiz</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {nav.map((n) => (
              <NavLink key={n.href} href={n.href}>
                {n.label}
              </NavLink>
            ))}
          </nav>

          {/* Right */}
          <div className="hidden md:flex items-center gap-3">
            <LocaleSwitcher current={lang} />
            <Link
              href={withLang(lang, "/login")}
              className="text-sm px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
            >
              {t.login}
            </Link>
            <Link
              href={withLang(lang, "/inizia")}
              className="text-sm px-3 py-2 rounded-md bg-gray-900 text-white hover:opacity-90"
            >
              {t.start} 🚀
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden inline-flex items-center justify-center rounded-md border px-2.5 py-2"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span className="i">☰</span>
          </button>
        </div>

        {/* Mobile Drawer */}
        {open && (
          <div className="md:hidden border-t py-3">
            <nav className="flex flex-col gap-1">
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="px-3 py-2 rounded-md text-sm hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  {n.label}
                </Link>
              ))}
            </nav>
            <div className="mt-3 flex items-center gap-2">
              <LocaleSwitcher current={lang} />
              <Link
                href={withLang(lang, "/login")}
                className="text-sm px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                {t.login}
              </Link>
              <Link
                href={withLang(lang, "/inizia")}
                className="text-sm px-3 py-2 rounded-md bg-gray-900 text-white hover:opacity-90"
                onClick={() => setOpen(false)}
              >
                {t.start} 🚀
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
