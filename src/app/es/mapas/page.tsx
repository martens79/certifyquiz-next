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
  title: "Mapas conceptuales PDF | CertifyQuiz",
  description:
    "Mapas conceptuales en PDF para las certificaciones IT. Vista previa gratuita, versión completa incluida en Premium.",
  alternates: {
    canonical: ALTERNATES.es,
    languages: ALTERNATES,
  },
  openGraph: {
    title: "Mapas conceptuales PDF | CertifyQuiz",
    description:
      "Mapas conceptuales en PDF para las certificaciones IT, con vista previa gratuita.",
    url: ALTERNATES.es,
    siteName: "CertifyQuiz",
    locale: "es_ES",
    type: "website",
  },
};

export default async function MapasEsPage() {
  const maps = await getMapCards("es");

  return <MapOverviewGrid lang="es" items={maps} />;
}
