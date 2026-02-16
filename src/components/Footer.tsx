// src/components/Footer.tsx
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { dict, type Locale, legalPath } from "@/lib/i18n";

type Status = "idle" | "loading" | "ok" | "err";

function aboutPath(lang: Locale) {
  if (lang === "it") return "/it/chi-sono";
  if (lang === "fr") return "/fr/a-propos";
  if (lang === "es") return "/es/sobre-mi";
  return "/about"; // en
}

export default function Footer({ lang }: { lang: Locale }) {
  const t = dict[lang];
  const year = new Date().getFullYear();

  const [email, setEmail] = useState("");
  const [hp, setHp] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [msg, setMsg] = useState("");

  const s = status;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Bot trap: se compilato, fingi successo e non fare nulla
    if (hp) {
      setStatus("ok");
      setMsg(t.newsletterOk ?? "Subscribed!");
      setEmail("");
      return;
    }

    const cleanEmail = email.trim();
    if (!cleanEmail || s === "loading") return;

    setStatus("loading");
    setMsg("");

    try {
      const res = await fetch("/api/backend/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, lang }),
      });

      let data: { message?: string } = {};
      try {
        data = await res.json();
      } catch {
        // ignore non-JSON
      }

      if (res.ok) {
        setStatus("ok");
        setMsg(data.message || t.newsletterOk || "Subscribed!");
        setEmail("");
        return;
      }

      setStatus("err");
      setMsg(data.message || t.newsletterErr || "Something went wrong. Please try again.");
    } catch {
      setStatus("err");
      setMsg(t.newsletterErr || "Something went wrong. Please try again.");
    }
  }

  return (
    <footer className="border-t bg-white">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 md:grid-cols-3">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-gray-900 text-xs font-bold text-white">
              CQ
            </div>
            <span className="font-semibold">CertifyQuiz</span>
          </div>

          <p className="mt-3 text-sm text-gray-600">
            {lang === "it"
              ? "Quiz realistici, spiegazioni dettagliate e badge per certificazioni IT."
              : lang === "es"
              ? "Tests realistas, explicaciones detalladas y badges para certificaciones IT."
              : lang === "fr"
              ? "Tests réalistes, explications détaillées et badges pour les certifications IT."
              : "Realistic quizzes, detailed explanations and badges for IT certifications."}
          </p>
        </div>

        {/* Links */}
        <nav>
          <h3 className="mb-2 text-sm font-semibold">{t.links ?? "Useful links"}</h3>
          <ul className="space-y-1">
            <li>
              <Link href={legalPath(lang, "privacy")} className="text-sm text-gray-700 hover:underline">
                {t.nav.privacy ?? "Privacy"}
              </Link>
            </li>
            <li>
              <Link href={legalPath(lang, "terms")} className="text-sm text-gray-700 hover:underline">
                {t.nav.terms ?? "Terms"}
              </Link>
            </li>
            <li>
              <Link href={legalPath(lang, "cookies")} className="text-sm text-gray-700 hover:underline">
                {t.nav.cookies ?? "Cookies"}
              </Link>
            </li>
            <li>
              <Link href={legalPath(lang, "contact")} className="text-sm text-gray-700 hover:underline">
                {t.nav.contact ?? "Contact"}
              </Link>
            </li>
          </ul>
        </nav>
<Link href={aboutPath(lang)} className="...classi-del-menu...">
  {lang === "it"
    ? "Chi sono"
    : lang === "fr"
    ? "À propos"
    : lang === "es"
    ? "Sobre mí"
    : "About"}
</Link>

        {/* Newsletter */}
        <div>
          <h3 className="mb-2 text-sm font-semibold">{t.newsletterTitle ?? "Newsletter"}</h3>
          <p className="text-sm text-gray-600">
            {t.newsletterBlurb ?? "Subscribe for updates on new certifications and features."}
          </p>

          {s === "ok" ? (
            <p className="mt-3 text-sm text-emerald-700" role="status" aria-live="polite">
              {msg || (t.newsletterOk ?? "Subscribed!")}
            </p>
          ) : (
            <>
              <form onSubmit={onSubmit} className="mt-3 flex gap-2" noValidate>
                {/* honeypot */}
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="hidden"
                  value={hp}
                  onChange={(e) => setHp(e.target.value)}
                />

                <label htmlFor="newsletter-email" className="sr-only">
                  Email
                </label>

                <input
                  id="newsletter-email"
                  type="email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.newsletterPlaceholder ?? "you@example.com"}
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  autoComplete="email"
                  inputMode="email"
                  disabled={s === "loading"}
                />

                <button
                  type="submit"
                  disabled={s === "loading"}
                  className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
                  aria-busy={s === "loading"}
                >
                  {s === "loading" ? "…" : (t.newsletterCta ?? "Subscribe")}
                </button>
              </form>

              {s === "err" && msg ? (
                <p className="mt-2 text-sm text-red-600" role="status" aria-live="polite">
                  {msg}
                </p>
              ) : null}
            </>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 text-xs text-gray-500">
          <span>
            © {year} CertifyQuiz. {t.rights ?? "All rights reserved."}
          </span>
          <span>vNext</span>
        </div>
      </div>
    </footer>
  );
}