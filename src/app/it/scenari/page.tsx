import type { Metadata } from "next";
import { getScenariosList } from "@/lib/data";
import CertificationOverviewGrid from "@/components/CertificationOverviewGrid";
import ScenarioIntro from "@/components/ScenarioIntro";

export const metadata: Metadata = {
  title: "Scenari di certificazione | CertifyQuiz",
  description:
    "Allenati con scenari realistici per le principali certificazioni IT. Simula situazioni d'esame e migliora le tue capacità decisionali con CertifyQuiz.",
  keywords: [
    "scenari certificazione",
    "certificazioni IT",
    "scenario based",
    "esami IT",
    "quiz certificazioni",
    "CertifyQuiz",
  ],
  alternates: {
    canonical: "https://www.certifyquiz.com/it/scenari",
    languages: {
      en: "https://www.certifyquiz.com/scenarios",
      it: "https://www.certifyquiz.com/it/scenari",
      fr: "https://www.certifyquiz.com/fr/scenarios",
      es: "https://www.certifyquiz.com/es/escenarios",
    },
  },
  openGraph: {
    title: "Scenari di certificazione | CertifyQuiz",
    description:
      "Allenati con scenari realistici per le principali certificazioni IT.",
    url: "https://www.certifyquiz.com/it/scenari",
    siteName: "CertifyQuiz",
    locale: "it_IT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Scenari di certificazione | CertifyQuiz",
    description:
      "Allenati con scenari realistici per le principali certificazioni IT.",
  },
};

export default async function ScenariPage() {
  const scenarios = await getScenariosList("it");

 return (
  <>
    <ScenarioIntro lang="it" />

    <CertificationOverviewGrid
      lang="it"
      items={scenarios}
      mode="scenarios"
    />
  </>
);
}