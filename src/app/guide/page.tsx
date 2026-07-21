import type { Metadata } from "next";
import { getGuidesList } from "@/lib/data";
import GuideOverviewGrid from "@/components/guides/GuideOverviewGrid";

export const metadata: Metadata = {
  title: "Study Guides (PDF) | CertifyQuiz",
  description:
    "Downloadable PDF study guides for IT certifications. Free preview, included in Premium, or available as a single purchase.",
  alternates: {
    canonical: "https://www.certifyquiz.com/guide",
    languages: {
      en: "https://www.certifyquiz.com/guide",
      it: "https://www.certifyquiz.com/it/guide",
      fr: "https://www.certifyquiz.com/fr/guides",
      es: "https://www.certifyquiz.com/es/guias",
    },
  },
  openGraph: {
    title: "Study Guides (PDF) | CertifyQuiz",
    description:
      "Downloadable PDF study guides for IT certifications, with free preview.",
    url: "https://www.certifyquiz.com/guide",
    siteName: "CertifyQuiz",
    locale: "en_US",
    type: "website",
  },
};

export default async function GuidesPage() {
  const guides = await getGuidesList("en");

  return <GuideOverviewGrid lang="en" items={guides} />;
}
