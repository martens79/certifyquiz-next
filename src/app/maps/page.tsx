import type { Metadata } from "next";
import { getMapCards } from "@/lib/server/maps";
import MapOverviewGrid from "@/components/maps/MapOverviewGrid";

const ALTERNATES = {
  en: "https://www.certifyquiz.com/maps",
  it: "https://www.certifyquiz.com/it/mappe",
  fr: "https://www.certifyquiz.com/fr/cartes",
  es: "https://www.certifyquiz.com/es/mapas",
};

export const metadata: Metadata = {
  title: "Concept Maps (PDF) | CertifyQuiz",
  description:
    "Downloadable PDF concept maps for IT certifications. Free preview, full version included in Premium.",
  alternates: {
    canonical: ALTERNATES.en,
    languages: ALTERNATES,
  },
  openGraph: {
    title: "Concept Maps (PDF) | CertifyQuiz",
    description:
      "Downloadable PDF concept maps for IT certifications, with free preview.",
    url: ALTERNATES.en,
    siteName: "CertifyQuiz",
    locale: "en_US",
    type: "website",
  },
};

export default async function MapsPage() {
  const maps = await getMapCards("en");

  return <MapOverviewGrid lang="en" items={maps} />;
}
