// src/components/premium/PremiumTeaserBox.tsx
"use client";

/**
 * PremiumTeaserBox
 * ----------------
 * Box informativo NON invasivo per presentare le funzionalità Premium.
 *
 * ⚠️ Questo componente:
 * - NON applica paywall
 * - NON legge i flags direttamente
 * - NON blocca funzionalità
 *
 * Serve solo come "gancio" UX soft.
 *
 * La logica di BLOCCO/SBLOCCO delle feature Premium
 * è demandata a:
 * - flags (src/lib/flags.ts)
 * - controlli backend
 * - componenti specifici (quiz, spiegazioni, modalità)
 *
 * Questo è VOLUTAMENTE stupido e riutilizzabile.
 */
/**
 * NOTA STRATEGICA
 * ---------------
 * Questo componente NON deve mai contenere:
 * - logica di isPremium
 * - logica di flags
 * - controlli di accesso
 *
 * Serve solo come comunicazione soft.
 * Qualsiasi enforcement Premium va fatto altrove.
 */

import Link from "next/link";

type Props = {
  /**
   * Titolo del box.
   * Utile per riutilizzarlo in contesti diversi:
   * - fine quiz
   * - profilo
   * - pagina /premium
   */
  title?: string;

  /**
   * Lista delle feature Premium da mostrare.
   * Non è vincolante: serve solo come spiegazione all’utente.
   *
   * ATTENZIONE:
   * - una feature può essere mostrata qui
   * - anche se in beta è ancora gratuita
   */
  features?: string[];

  /**
   * Etichetta del bottone CTA.
   * Sempre soft: niente "Compra ora".
   */
  ctaLabel?: string;
};

export default function PremiumTeaserBox({
  title = "Preparazione completa con Premium",
  features = [
    "Spiegazioni complete",
    "Varianti extra delle domande",
    "Ripasso errori",
  ],
  ctaLabel = "Scopri Premium",
}: Props) {
  return (
    <div
      className="
        mt-6
        rounded-lg
        border border-gray-200
        bg-gray-50
        p-4
        text-sm
      "
    >
      {/* Titolo informativo, non marketing */}
      <h3 className="mb-2 font-medium text-gray-900">
        {title}
      </h3>

      {/* Elenco feature Premium
          - NON implica che siano attive
          - NON implica che siano bloccate
          - serve solo a spiegare il valore */}
      <ul className="mb-3 list-disc pl-5 text-gray-700">
        {features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>

      {/* CTA soft
          Punta SEMPRE a /premium
          Tutti i ganci Premium devono convergere lì */}
      <Link
        href="/premium"
        className="
          inline-block
          rounded-md
          bg-gray-900
          px-3 py-1.5
          text-xs font-medium
          text-white
          hover:opacity-90
        "
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
