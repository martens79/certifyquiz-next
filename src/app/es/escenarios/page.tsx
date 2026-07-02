import type { Metadata } from "next";
import { getScenariosList } from "@/lib/data";
import CertificationOverviewGrid from "@/components/CertificationOverviewGrid";

export const metadata: Metadata = {
  title: "Escenarios de certificación | CertifyQuiz",
  description:
    "Practica con escenarios realistas para las principales certificaciones de TI. Mejora tu capacidad de decisión con situaciones similares a las del examen.",
  keywords: [
    "escenarios certificación",
    "certificaciones TI",
    "scenario based",
    "exámenes TI",
    "quiz certificación",
    "CertifyQuiz",
  ],
  alternates: {
    canonical: "https://www.certifyquiz.com/es/escenarios",
    languages: {
      en: "https://www.certifyquiz.com/scenarios",
      it: "https://www.certifyquiz.com/it/scenari",
      fr: "https://www.certifyquiz.com/fr/scenarios",
      es: "https://www.certifyquiz.com/es/escenarios",
    },
  },
  openGraph: {
    title: "Escenarios de certificación | CertifyQuiz",
    description:
      "Practica con escenarios realistas para las principales certificaciones de TI.",
    url: "https://www.certifyquiz.com/es/escenarios",
    siteName: "CertifyQuiz",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Escenarios de certificación | CertifyQuiz",
    description:
      "Practica con escenarios realistas para las principales certificaciones de TI.",
  },
};

export default async function EscenariosPage() {
  const scenarios = await getScenariosList("es");

  return (
    <CertificationOverviewGrid
      lang="es"
      items={scenarios}
      mode="scenarios"
    />
  );
}