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
  title: "Mappe concettuali PDF | CertifyQuiz",
  description:
    "Mappe concettuali in PDF per le certificazioni IT. Anteprima gratuita, versione completa inclusa in Premium.",
  alternates: {
    canonical: ALTERNATES.it,
    languages: ALTERNATES,
  },
  openGraph: {
    title: "Mappe concettuali PDF | CertifyQuiz",
    description:
      "Mappe concettuali in PDF per le certificazioni IT, con anteprima gratuita.",
    url: ALTERNATES.it,
    siteName: "CertifyQuiz",
    locale: "it_IT",
    type: "website",
  },
};

export default async function MappeItPage() {
  const maps = await getMapCards("it");

  return <MapOverviewGrid lang="it" items={maps} />;
}
