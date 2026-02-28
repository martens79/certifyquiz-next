// src/components/premium/PremiumTeaserBox.tsx
"use client";

import Link from "next/link";
import type { Locale } from "@/lib/quiz-types";
import { pricingPath } from "@/lib/paths";

type Props = {
  lang?: Locale;

  // opzionali: override per casi speciali (se un giorno vuoi)
  title?: string;
  features?: string[];
  ctaLabel?: string;
};

const COPY = {
  title: {
    it: "Preparazione completa con Premium",
    en: "Full preparation with Premium",
    fr: "Préparation complète avec Premium",
    es: "Preparación completa con Premium",
  },
  features: {
    it: ["Spiegazioni complete", "Varianti extra delle domande", "Ripasso errori"],
    en: ["Full explanations", "Extra question variants", "Error review"],
    fr: ["Explications complètes", "Variantes supplémentaires", "Révision des erreurs"],
    es: ["Explicaciones completas", "Variantes extra", "Repaso de errores"],
  },
  cta: {
    it: "Scopri Premium",
    en: "See Premium",
    fr: "Découvrir Premium",
    es: "Descubrir Premium",
  },
  // microcopy “soft”
  note: {
    it: "Nessun blocco: è solo un’anteprima delle funzioni Premium.",
    en: "No paywall: this is just a preview of Premium features.",
    fr: "Aucun paywall : aperçu des fonctionnalités Premium.",
    es: "Sin paywall: solo una vista previa de Premium.",
  },
} as const;

function safeLang(lang?: Locale): Locale {
  return lang === "it" || lang === "en" || lang === "fr" || lang === "es" ? lang : "en";
}

export default function PremiumTeaserBox({
  lang,
  title,
  features,
  ctaLabel,
}: Props) {
  const L = safeLang(lang);

  const finalTitle = title ?? COPY.title[L];
  const finalFeatures = features ?? COPY.features[L];
  const finalCta = ctaLabel ?? COPY.cta[L];

  return (
    <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm">
      <h3 className="mb-2 font-semibold text-gray-900">{finalTitle}</h3>

      <ul className="mb-3 list-disc pl-5 text-gray-700">
        {finalFeatures.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>

      <p className="mb-3 text-xs text-gray-600">{COPY.note[L]}</p>

      <Link
        href={pricingPath(L)}
        className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white hover:opacity-90"
      >
        {finalCta}
      </Link>
    </div>
  );
}