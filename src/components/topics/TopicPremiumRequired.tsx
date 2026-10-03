// src/components/topics/TopicPremiumRequired.tsx
// Shown instead of the quiz when the backend answers 403 TOPIC_PREMIUM_REQUIRED
// (or 404 TOPIC_NOT_AVAILABLE). Presentational only: it never receives questions.

import React from "react";
import Link from "next/link";
import { premiumHref, type TopicAccessLang } from "@/lib/topic-access";

const TEXT: Record<
  TopicAccessLang,
  { premiumTitle: string; premiumBody: string; cta: string; back: string; unavailableTitle: string; unavailableBody: string }
> = {
  it: {
    premiumTitle: "Questo argomento è Premium",
    premiumBody: "Le domande di questo argomento sono incluse nel Premium. Gli argomenti gratuiti di questo percorso restano disponibili.",
    cta: "Passa a Premium",
    back: "Torna agli argomenti",
    unavailableTitle: "Argomento non ancora disponibile",
    unavailableBody: "Questo argomento non è ancora stato pubblicato.",
  },
  en: {
    premiumTitle: "This topic is Premium",
    premiumBody: "The questions of this topic are included in Premium. The free topics of this path remain available.",
    cta: "Go Premium",
    back: "Back to the topics",
    unavailableTitle: "Topic not available yet",
    unavailableBody: "This topic has not been published yet.",
  },
  fr: {
    premiumTitle: "Ce sujet est Premium",
    premiumBody: "Les questions de ce sujet sont incluses dans Premium. Les sujets gratuits de ce parcours restent disponibles.",
    cta: "Passer à Premium",
    back: "Retour aux sujets",
    unavailableTitle: "Sujet pas encore disponible",
    unavailableBody: "Ce sujet n'a pas encore été publié.",
  },
  es: {
    premiumTitle: "Este tema es Premium",
    premiumBody: "Las preguntas de este tema están incluidas en Premium. Los temas gratuitos de esta ruta siguen disponibles.",
    cta: "Pasar a Premium",
    back: "Volver a los temas",
    unavailableTitle: "Tema aún no disponible",
    unavailableBody: "Este tema todavía no se ha publicado.",
  },
};

export default function TopicPremiumRequired({
  lang,
  backHref,
  kind = "premium",
}: {
  lang: TopicAccessLang;
  backHref: string;
  kind?: "premium" | "unavailable";
}) {
  const t = TEXT[lang] ?? TEXT.en;
  const premium = kind === "premium";

  return (
    <div className="mx-auto max-w-xl px-4 py-10" data-topic-access-panel={kind}>
      <div className="rounded-2xl border border-slate-300 bg-slate-50 p-5">
        <h1 className="mb-2 text-lg font-semibold">
          {premium ? <span aria-hidden="true">🔒 </span> : null}
          {premium ? t.premiumTitle : t.unavailableTitle}
        </h1>
        <p className="text-sm text-slate-700">{premium ? t.premiumBody : t.unavailableBody}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {premium ? (
            <Link
              href={premiumHref(lang)}
              className="inline-flex items-center justify-center rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
            >
              {t.cta}
            </Link>
          ) : null}
          <Link href={backHref} className="text-sm font-semibold text-blue-700 underline">
            {t.back}
          </Link>
        </div>
      </div>
    </div>
  );
}
