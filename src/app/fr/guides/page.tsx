import type { Metadata } from "next";
import { getGuidesList } from "@/lib/data";
import GuideOverviewGrid from "@/components/guides/GuideOverviewGrid";

export const metadata: Metadata = {
  title: "Guides PDF d'étude | CertifyQuiz",
  description:
    "Guides PDF téléchargeables pour préparer les certifications IT. Aperçu gratuit, inclus dans Premium ou achetables à l'unité.",
  alternates: {
    canonical: "https://www.certifyquiz.com/fr/guides",
    languages: {
      en: "https://www.certifyquiz.com/guide",
      it: "https://www.certifyquiz.com/it/guide",
      fr: "https://www.certifyquiz.com/fr/guides",
      es: "https://www.certifyquiz.com/es/guias",
    },
  },
  openGraph: {
    title: "Guides PDF d'étude | CertifyQuiz",
    description:
      "Guides PDF téléchargeables pour préparer les certifications IT, avec aperçu gratuit.",
    url: "https://www.certifyquiz.com/fr/guides",
    siteName: "CertifyQuiz",
    locale: "fr_FR",
    type: "website",
  },
};

export default async function GuidesFrPage() {
  const guides = await getGuidesList("fr");

  return <GuideOverviewGrid lang="fr" items={guides} />;
}
