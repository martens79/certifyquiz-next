import type { Metadata } from "next";
import { getScenariosList } from "@/lib/data";
import CertificationOverviewGrid from "@/components/CertificationOverviewGrid";

export const metadata: Metadata = {
  title: "Certification Scenarios | CertifyQuiz",
  description:
    "Practice real certification scenarios with CertifyQuiz. Train with practical exam-style situations for IT, cloud, cybersecurity, data and project management certifications.",
  alternates: {
    canonical: "https://www.certifyquiz.com/scenarios",
    languages: {
      en: "https://www.certifyquiz.com/scenarios",
      it: "https://www.certifyquiz.com/it/scenari",
      fr: "https://www.certifyquiz.com/fr/scenarios",
      es: "https://www.certifyquiz.com/es/escenarios",
    },
  },
  openGraph: {
    title: "Certification Scenarios | CertifyQuiz",
    description:
      "Practice real certification scenarios with practical exam-style situations.",
    url: "https://www.certifyquiz.com/scenarios",
    siteName: "CertifyQuiz",
    locale: "en_US",
    type: "website",
  },
};

export default async function ScenariosPage() {
  const scenarios = await getScenariosList("en");

  return (
    <CertificationOverviewGrid
      lang="en"
      items={scenarios}
      mode="scenarios"
    />
  );
}