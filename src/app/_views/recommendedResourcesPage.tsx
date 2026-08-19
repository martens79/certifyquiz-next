import type { Metadata } from "next";

import RecommendedResourcesPage from "@/components/recommended-resources/RecommendedResourcesPage";
import { recommendedResourcesPath, type Locale } from "@/lib/paths";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.certifyquiz.com").replace(/\/+$/, "");

const SEO: Record<Locale, { title: string; description: string }> = {
  it: {
    title: "Materiale consigliato per certificazioni | CertifyQuiz",
    description: "Libri, corsi e strumenti selezionati per preparare certificazioni IT, cloud, cybersecurity e project management.",
  },
  en: {
    title: "Recommended certification resources | CertifyQuiz",
    description: "Selected books, courses and tools for IT, cloud, cybersecurity and project management certifications.",
  },
  fr: {
    title: "Ressources recommandées pour les certifications | CertifyQuiz",
    description: "Livres, cours et outils sélectionnés pour préparer les certifications IT, cloud, cybersécurité et gestion de projet.",
  },
  es: {
    title: "Material recomendado para certificaciones | CertifyQuiz",
    description: "Libros, cursos y herramientas seleccionados para certificaciones IT, cloud, ciberseguridad y gestión de proyectos.",
  },
};

export function recommendedResourcesMetadata(lang: Locale): Metadata {
  const canonical = `${SITE}${recommendedResourcesPath(lang)}`;
  const languages = {
    it: `${SITE}${recommendedResourcesPath("it")}`,
    en: `${SITE}${recommendedResourcesPath("en")}`,
    fr: `${SITE}${recommendedResourcesPath("fr")}`,
    es: `${SITE}${recommendedResourcesPath("es")}`,
    "x-default": `${SITE}${recommendedResourcesPath("en")}`,
  };

  return {
    ...SEO[lang],
    alternates: { canonical, languages },
    openGraph: { ...SEO[lang], url: canonical, type: "website", siteName: "CertifyQuiz" },
    // Pagina senza contenuto reale (catalogo risorse vuoto): noindex finché non
    // pubblichiamo materiali affiliati verificati.
    robots: { index: false, follow: true },
  };
}

export function RecommendedResourcesView({ lang }: { lang: Locale }) {
  return <RecommendedResourcesPage lang={lang} />;
}
