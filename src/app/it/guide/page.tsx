import type { Metadata } from "next";
import { getGuidesList } from "@/lib/data";
import GuideOverviewGrid from "@/components/guides/GuideOverviewGrid";

export const metadata: Metadata = {
  title: "Guide PDF di studio | CertifyQuiz",
  description:
    "Guide PDF scaricabili per prepararti alle certificazioni IT. Anteprima gratuita, incluse in Premium o acquistabili singolarmente.",
  alternates: {
    canonical: "https://www.certifyquiz.com/it/guide",
    languages: {
      en: "https://www.certifyquiz.com/guide",
      it: "https://www.certifyquiz.com/it/guide",
      fr: "https://www.certifyquiz.com/fr/guides",
      es: "https://www.certifyquiz.com/es/guias",
    },
  },
  openGraph: {
    title: "Guide PDF di studio | CertifyQuiz",
    description:
      "Guide PDF scaricabili per prepararti alle certificazioni IT, con anteprima gratuita.",
    url: "https://www.certifyquiz.com/it/guide",
    siteName: "CertifyQuiz",
    locale: "it_IT",
    type: "website",
  },
};

export default async function GuideItPage() {
  const guides = await getGuidesList("it");

  return <GuideOverviewGrid lang="it" items={guides} />;
}
