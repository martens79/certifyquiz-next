"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type Lang = "it" | "en" | "fr" | "es";

const SUPPORTED_LANGS: Lang[] = ["it", "en", "fr", "es"];

const LABELS: Record<Lang, string> = {
  it: "Vuoi vedere CertifyQuiz in italiano?",
  en: "Do you want to view CertifyQuiz in English?",
  fr: "Voulez-vous voir CertifyQuiz en français ?",
  es: "¿Quieres ver CertifyQuiz en español?",
};

const BUTTONS: Record<Lang, { change: string; stay: string }> = {
  it: { change: "Cambia lingua", stay: "Rimani qui" },
  en: { change: "Switch language", stay: "Stay here" },
  fr: { change: "Changer de langue", stay: "Rester ici" },
  es: { change: "Cambiar idioma", stay: "Quedarme aquí" },
};

function getCurrentLang(pathname: string): Lang {
  if (pathname.startsWith("/it")) return "it";
  if (pathname.startsWith("/fr")) return "fr";
  if (pathname.startsWith("/es")) return "es";
  return "en";
}

function stripLangPrefix(pathname: string): string {
  return pathname.replace(/^\/(it|fr|es)(?=\/|$)/, "") || "/";
}

function buildLocalizedPath(pathname: string, lang: Lang): string {
  const cleanPath = stripLangPrefix(pathname);

  if (lang === "en") {
    return cleanPath;
  }

  return cleanPath === "/" ? `/${lang}` : `/${lang}${cleanPath}`;
}

export default function LanguageSuggestionBanner() {
  const pathname = usePathname() ?? "/";
  const router = useRouter();

  const [suggestedLang, setSuggestedLang] = useState<Lang | null>(null);

  useEffect(() => {
    const preferred = localStorage.getItem("preferred_lang");
    const dismissed = localStorage.getItem("lang_banner_dismissed");

    if (preferred || dismissed) {
      setSuggestedLang(null);
      return;
    }

    const browserLang = navigator.language
      .slice(0, 2)
      .toLowerCase() as Lang;

    if (!SUPPORTED_LANGS.includes(browserLang)) {
      setSuggestedLang(null);
      return;
    }

    const currentLang = getCurrentLang(pathname);

    if (browserLang !== currentLang) {
      setSuggestedLang(browserLang);
    } else {
      setSuggestedLang(null);
    }
  }, [pathname]);

  function switchLang() {
    if (!suggestedLang) return;

    localStorage.setItem("preferred_lang", suggestedLang);
    localStorage.removeItem("lang_banner_dismissed");

    setSuggestedLang(null);

    const target = buildLocalizedPath(pathname, suggestedLang);
    router.push(target);
  }

  function dismiss() {
    localStorage.setItem("lang_banner_dismissed", "1");
    setSuggestedLang(null);
  }

  if (!suggestedLang) return null;

  return (
    <div className="fixed left-4 right-4 bottom-24 md:bottom-4 z-[9999] mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-xl">
      <p className="mb-3 font-semibold text-slate-900">
        {LABELS[suggestedLang]}
      </p>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={switchLang}
          className="flex-1 rounded-lg bg-blue-600 px-3 py-2 font-semibold text-white hover:bg-blue-700"
        >
          {BUTTONS[suggestedLang].change}
        </button>

        <button
          type="button"
          onClick={dismiss}
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 font-medium text-slate-700 hover:bg-slate-50"
        >
          {BUTTONS[suggestedLang].stay}
        </button>
      </div>
    </div>
  );
}