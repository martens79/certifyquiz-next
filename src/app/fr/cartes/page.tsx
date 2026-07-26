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
  title: "Cartes conceptuelles PDF | CertifyQuiz",
  description:
    "Cartes conceptuelles en PDF pour les certifications IT. Aperçu gratuit, version complète incluse dans Premium.",
  alternates: {
    canonical: ALTERNATES.fr,
    languages: ALTERNATES,
  },
  openGraph: {
    title: "Cartes conceptuelles PDF | CertifyQuiz",
    description:
      "Cartes conceptuelles en PDF pour les certifications IT, avec aperçu gratuit.",
    url: ALTERNATES.fr,
    siteName: "CertifyQuiz",
    locale: "fr_FR",
    type: "website",
  },
};

export default async function CartesFrPage() {
  const maps = await getMapCards("fr");

  return <MapOverviewGrid lang="fr" items={maps} />;
}
