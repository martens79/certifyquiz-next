import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com").replace(
  /\/+$/,
  ""
);

const ogLocale: Record<Locale, string> = {
  it: "it_IT",
  en: "en_US",
  fr: "fr_FR",
  es: "es_ES",
};

export const PRICING_SLUG_BY_LANG: Record<Locale, string> = {
  it: "prezzi",
  en: "pricing",
  fr: "prix",
  es: "precios",
};

const labels = {
  title: {
    it: "Premium & acquisti singoli | CertifyQuiz",
    en: "Premium & one-time purchases | CertifyQuiz",
    fr: "Premium & achats à l’unité | CertifyQuiz",
    es: "Premium y compras únicas | CertifyQuiz",
  },
  description: {
    it: "Scopri la differenza tra abbonamento Premium e acquisti singoli su CertifyQuiz: sblocca spiegazioni, quiz completi e badge ufficiali nel modo che preferisci.",
    en: "Learn the difference between Premium subscription and one-time purchases on CertifyQuiz: unlock explanations, full quizzes and official badges the way you prefer.",
    fr: "Découvrez la différence entre l’abonnement Premium et les achats à l’unité sur CertifyQuiz : débloquez explications, quiz complets et badges officiels comme vous le souhaitez.",
    es: "Descubre la diferencia entre suscripción Premium y compras únicas en CertifyQuiz: desbloquea explicaciones, cuestionarios completos e insignias oficiales como prefieras.",
  },
};

function L(map: Record<Locale, string>, lang: Locale): string {
  return map[lang] ?? map.it;
}

export function pricingUrl(lang: Locale) {
  return `${SITE}/${lang}/${PRICING_SLUG_BY_LANG[lang]}`;
}

export async function generatePricingMetadata(lang: Locale): Promise<Metadata> {
  const title = L(labels.title, lang);
  const description = L(labels.description, lang);

  const canonical = pricingUrl(lang);

  // Se non hai OG dedicata, usa una sola immagine esistente (es. home-it)
  const ogImg = `${SITE}/og/home-it.png`;

  return {
    metadataBase: new URL(SITE),
    title,
    description,
    alternates: {
      canonical,
      languages: {
        it: pricingUrl("it"),
        en: pricingUrl("en"),
        fr: pricingUrl("fr"),
        es: pricingUrl("es"),
        "x-default": pricingUrl("en"),
      },
    },
    openGraph: {
      url: canonical,
      title,
      description,
      siteName: "CertifyQuiz",
      locale: ogLocale[lang],
      type: "website",
      images: [{ url: ogImg, width: 1200, height: 630, alt: "CertifyQuiz Premium" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImg],
      site: "@CertifyQuiz",
    },
    robots: { index: true, follow: true },
  };
}
