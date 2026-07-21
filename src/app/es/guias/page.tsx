import type { Metadata } from "next";
import { getGuidesList } from "@/lib/data";
import GuideOverviewGrid from "@/components/guides/GuideOverviewGrid";

export const metadata: Metadata = {
  title: "Guías PDF de estudio | CertifyQuiz",
  description:
    "Guías PDF descargables para preparar certificaciones IT. Vista previa gratuita, incluidas en Premium o disponibles como compra única.",
  alternates: {
    canonical: "https://www.certifyquiz.com/es/guias",
    languages: {
      en: "https://www.certifyquiz.com/guide",
      it: "https://www.certifyquiz.com/it/guide",
      fr: "https://www.certifyquiz.com/fr/guides",
      es: "https://www.certifyquiz.com/es/guias",
    },
  },
  openGraph: {
    title: "Guías PDF de estudio | CertifyQuiz",
    description:
      "Guías PDF descargables para preparar certificaciones IT, con vista previa gratuita.",
    url: "https://www.certifyquiz.com/es/guias",
    siteName: "CertifyQuiz",
    locale: "es_ES",
    type: "website",
  },
};

export default async function GuiasEsPage() {
  const guides = await getGuidesList("es");

  return <GuideOverviewGrid lang="es" items={guides} />;
}
