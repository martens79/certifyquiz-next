import React from "react";
import type { Locale } from "@/lib/i18n";

const labels: Record<Locale, string> = {
  it: "Ascolta l’articolo",
  en: "Listen to the article",
  fr: "Écouter l’article",
  es: "Escucha el artículo",
};

export default function ArticleAudio({ audioUrl, lang }: {
  audioUrl?: string | null;
  lang: Locale;
}) {
  if (!audioUrl) return null;
  const label = labels[lang];
  return (
    <section lang={lang} aria-label={label} className="mt-8 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
      <p className="mb-3 font-semibold text-zinc-900">{label}</p>
      <audio className="block w-full" controls preload="none" src={audioUrl} aria-label={label}>
        <a href={audioUrl}>{label}</a>
      </audio>
    </section>
  );
}
