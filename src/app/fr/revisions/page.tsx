import type { Metadata } from "next";
import ReviewsIndexPage from "@/components/ReviewsIndexPage";

export const metadata: Metadata = {
  title: "Révisions de certification | CertifyQuiz",
  description:
    "Révisez rapidement les concepts essentiels des principales certifications IT grâce aux guides de révision de CertifyQuiz.",
  keywords: [
    "révisions certification",
    "certifications IT",
    "révision examen",
    "guide certification",
    "CertifyQuiz",
  ],
  alternates: {
    canonical: "https://www.certifyquiz.com/fr/revisions",
    languages: {
      en: "https://www.certifyquiz.com/reviews",
      it: "https://www.certifyquiz.com/it/ripassi",
      fr: "https://www.certifyquiz.com/fr/revisions",
      es: "https://www.certifyquiz.com/es/repasos",
    },
  },
  openGraph: {
    title: "Révisions de certification | CertifyQuiz",
    description:
      "Révisez rapidement les concepts essentiels des principales certifications IT.",
    url: "https://www.certifyquiz.com/fr/revisions",
    siteName: "CertifyQuiz",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Révisions de certification | CertifyQuiz",
    description:
      "Révisez rapidement les concepts essentiels des principales certifications IT.",
  },
};

export default function Page() {
  return <ReviewsIndexPage lang="fr" />;
}