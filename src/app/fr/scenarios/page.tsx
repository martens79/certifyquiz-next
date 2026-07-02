import type { Metadata } from "next";
import { getScenariosList } from "@/lib/data";
import CertificationOverviewGrid from "@/components/CertificationOverviewGrid";

export const metadata: Metadata = {
  title: "Scénarios de certification | CertifyQuiz",
  description:
    "Entraînez-vous avec des scénarios réalistes pour les principales certifications IT. Améliorez votre prise de décision grâce à des situations proches de l'examen.",
  keywords: [
    "scénarios certification",
    "certifications IT",
    "scenario based",
    "examens IT",
    "quiz certification",
    "CertifyQuiz",
  ],
  alternates: {
    canonical: "https://www.certifyquiz.com/fr/scenarios",
    languages: {
      en: "https://www.certifyquiz.com/scenarios",
      it: "https://www.certifyquiz.com/it/scenari",
      fr: "https://www.certifyquiz.com/fr/scenarios",
      es: "https://www.certifyquiz.com/es/escenarios",
    },
  },
  openGraph: {
    title: "Scénarios de certification | CertifyQuiz",
    description:
      "Entraînez-vous avec des scénarios réalistes pour les principales certifications IT.",
    url: "https://www.certifyquiz.com/fr/scenarios",
    siteName: "CertifyQuiz",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Scénarios de certification | CertifyQuiz",
    description:
      "Entraînez-vous avec des scénarios réalistes pour les principales certifications IT.",
  },
};

export default async function ScenariosFrPage() {
  const scenarios = await getScenariosList("fr");

  return (
    <CertificationOverviewGrid
      lang="fr"
      items={scenarios}
      mode="scenarios"
    />
  );
}