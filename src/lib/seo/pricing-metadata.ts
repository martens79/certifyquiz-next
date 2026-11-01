// Metadata delle quattro pagine Premium (/it/prezzi, /pricing, /fr/prix, /es/precios).
//
// Una sola fonte per title, description, canonical e hreflang: gli URL derivano da pricingPath() (lib/paths.ts),
// la stessa funzione usata da header, CTA, LocaleSwitcher e sitemap. Ogni variante e' self-canonical e rimanda alle
// altre tre; x-default punta alla versione inglese (radice), come le altre landing localizzate del sito.
// I testi descrivono solo cio' che la pagina mostra davvero (nessun prezzo o promo: cambiano senza toccare la SEO).
import type { Metadata } from "next";

import { isLocale, pricingPath, type Locale } from "@/lib/paths";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.certifyquiz.com").replace(/\/+$/, "");

const LANGS: readonly Locale[] = ["it", "en", "fr", "es"];

const OG_LOCALE: Record<Locale, string> = { it: "it_IT", en: "en_US", fr: "fr_FR", es: "es_ES" };

export const PRICING_SEO: Record<Locale, { title: string; description: string }> = {
  it: {
    title: "CertifyQuiz Premium: prezzi e piani mensile e annuale",
    description:
      "Scopri i piani Premium di CertifyQuiz, mensile o annuale: spiegazioni complete, ripasso degli errori, Mock Review, guide PDF, mappe concettuali e Tutor AI.",
  },
  en: {
    title: "CertifyQuiz Premium: Pricing and Monthly or Annual Plans",
    description:
      "Compare CertifyQuiz Premium monthly and annual plans: full explanations, error review, Mock Review, PDF guides, concept maps and an AI Tutor.",
  },
  fr: {
    title: "CertifyQuiz Premium : tarifs et offres mensuelle ou annuelle",
    description:
      "Découvrez les offres Premium de CertifyQuiz, mensuelle ou annuelle : explications complètes, révision des erreurs, Mock Review, guides PDF, cartes et tuteur IA.",
  },
  es: {
    title: "CertifyQuiz Premium: precios y planes mensual o anual",
    description:
      "Descubre los planes Premium de CertifyQuiz, mensual o anual: explicaciones completas, repaso de errores, Mock Review, guías PDF, mapas conceptuales y Tutor AI.",
  },
};

// /<lang>/prezzi e' valido solo per l'italiano (route [lang]/prezzi): per le altre lingue supportate la pagina
// canonica e' pricingPath(lang). Null = nessun redirect (it, oppure segmento non supportato -> 404).
export function pricingSlugRedirect(lang: string): string | null {
  return isLocale(lang) && lang !== "it" ? pricingPath(lang) : null;
}

export const pricingUrl =(lang: Locale): string => `${SITE}${pricingPath(lang)}`;

export function pricingMetadata(lang: Locale): Metadata {
  const { title, description } = PRICING_SEO[lang];
  const canonical = pricingUrl(lang);
  const languages: Record<string, string> = Object.fromEntries(LANGS.map((l) => [l, pricingUrl(l)]));
  languages["x-default"] = pricingUrl("en");

  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: { title, description, url: canonical, type: "website", siteName: "CertifyQuiz", locale: OG_LOCALE[lang] },
  };
}
