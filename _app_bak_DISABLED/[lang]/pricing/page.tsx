import { isLocale, defaultLocale, type Locale, dict } from "@/lib/i18n";
import type { Metadata } from "next";
import { prettyPricing } from "@/lib/prettyPaths";

const SUPPORTED = ["it", "en", "fr", "es"] as const;
type Lang = (typeof SUPPORTED)[number];

// usa NEXT_PUBLIC_SITE_URL in prod, fallback locale
const ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.certifyquiz.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: raw } = await params;
  const lang: Lang = (SUPPORTED as readonly string[]).includes(raw)
    ? (raw as Lang)
    : "it";

  const canonicalRel = prettyPricing(lang);

  const titleByLang: Record<Lang, string> = {
    it: "Prezzi e Abbonamenti | CertifyQuiz",
    en: "Pricing and Plans | CertifyQuiz",
    fr: "Tarifs et abonnements | CertifyQuiz",
    es: "Precios y suscripciones | CertifyQuiz",
  };

  const descByLang: Record<Lang, string> = {
    it: "Scopri i piani di abbonamento CertifyQuiz: quiz illimitati, spiegazioni premium e badge ufficiali.",
    en: "Discover CertifyQuiz subscription plans: unlimited quizzes, premium explanations and official badges.",
    fr: "Découvrez les abonnements CertifyQuiz : quiz illimités, explications premium et badges officiels.",
    es: "Descubre los planes de suscripción CertifyQuiz: cuestionarios ilimitados, explicaciones premium y credenciales oficiales.",
  };

  return {
    title: titleByLang[lang],
    description: descByLang[lang],
    alternates: {
      canonical: canonicalRel,
      languages: {
        "it-IT": `${ORIGIN}${prettyPricing("it")}`,
        "en-US": `${ORIGIN}${prettyPricing("en")}`,
        "fr-FR": `${ORIGIN}${prettyPricing("fr")}`,
        "es-ES": `${ORIGIN}${prettyPricing("es")}`,
        "x-default": `${ORIGIN}${prettyPricing("en")}`,
      },
    },
    openGraph: {
      url: `${ORIGIN}${canonicalRel}`,
      title: titleByLang[lang],
      description: descByLang[lang],
      siteName: "CertifyQuiz",
      type: "website",
    },
  };
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: raw } = await params;
  const lang: Locale = isLocale(raw) ? (raw as Locale) : defaultLocale;
  const t = dict[lang];

  return (
    <main className="container mx-auto py-8">
      <h1 className="text-2xl font-semibold">
        {lang === "it" ? "Prezzi" : t.pricing}
      </h1>
      <p className="mt-4 text-gray-600">
        {lang === "it"
          ? "Scegli il piano più adatto: accesso gratuito con quiz di base oppure abbonamento premium per spiegazioni complete e badge ufficiali."
          : "Choose the plan that fits you: free access with basic quizzes or premium subscription for full explanations and official badges."}
      </p>
      {/* qui puoi inserire la tabella piani o i box prezzi */}
    </main>
  );
}
