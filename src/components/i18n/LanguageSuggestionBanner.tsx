"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const LANG_MAP: Record<string, "it" | "en" | "fr" | "es"> = {
  it: "it",
  en: "en",
  fr: "fr",
  es: "es",
};

export default function LanguageSuggestionBanner() {
  const pathname = usePathname();
  const router = useRouter();
  const [suggestedLang, setSuggestedLang] = useState<"it" | "en" | "fr" | "es" | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("preferred_lang");
    const dismissed = localStorage.getItem("lang_banner_dismissed");

    if (saved || dismissed) return;

    const browserLang = navigator.language.slice(0, 2).toLowerCase();
    const detected = LANG_MAP[browserLang];

    if (!detected) return;

    const currentLang =
      pathname.startsWith("/it") ? "it" :
      pathname.startsWith("/fr") ? "fr" :
      pathname.startsWith("/es") ? "es" :
      "en";

    if (detected !== currentLang) {
      setSuggestedLang(detected);
    }
  }, [pathname]);

  if (!suggestedLang) return null;

  const labels = {
    it: "Vuoi vedere CertifyQuiz in italiano?",
    en: "Do you want to view CertifyQuiz in English?",
    fr: "Voulez-vous voir CertifyQuiz en français ?",
    es: "¿Quieres ver CertifyQuiz en español?",
  };

  function switchLang() {
    localStorage.setItem("preferred_lang", suggestedLang!);

    let cleanPath = pathname
      .replace(/^\/it/, "")
      .replace(/^\/fr/, "")
      .replace(/^\/es/, "");

    const target =
      suggestedLang === "en"
        ? cleanPath || "/"
        : `/${suggestedLang}${cleanPath || ""}`;

    router.push(target);
  }

  function dismiss() {
    localStorage.setItem("lang_banner_dismissed", "1");
    setSuggestedLang(null);
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md rounded-xl bg-white p-4 shadow-xl border text-sm">
      <p className="mb-3 font-medium text-slate-800">
        {labels[suggestedLang]}
      </p>

      <div className="flex gap-2">
        <button
          onClick={switchLang}
          className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-white font-semibold"
        >
          Cambia lingua
        </button>

        <button
          onClick={dismiss}
          className="flex-1 rounded-lg border px-3 py-2 text-slate-600"
        >
          Rimani qui
        </button>
      </div>
    </div>
  );
}