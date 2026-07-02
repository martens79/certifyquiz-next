import type { Metadata } from "next";
import ReviewsIndexPage from "@/components/ReviewsIndexPage";

export const metadata: Metadata = {
  title: "Ripassi certificazioni | CertifyQuiz",
  description:
    "Ripassa rapidamente gli argomenti principali delle certificazioni IT con guide sintetiche, chiare e aggiornate. Preparati all'esame con CertifyQuiz.",
  keywords: [
    "ripassi certificazioni",
    "certificazioni IT",
    "ripasso esame",
    "guide certificazioni",
    "CertifyQuiz",
  ],
  alternates: {
    canonical: "https://www.certifyquiz.com/it/ripassi",
    languages: {
      en: "https://www.certifyquiz.com/reviews",
      it: "https://www.certifyquiz.com/it/ripassi",
      fr: "https://www.certifyquiz.com/fr/revisions",
      es: "https://www.certifyquiz.com/es/repasos",
    },
  },
  openGraph: {
    title: "Ripassi certificazioni | CertifyQuiz",
    description:
      "Ripassa rapidamente gli argomenti principali delle certificazioni IT.",
    url: "https://www.certifyquiz.com/it/ripassi",
    siteName: "CertifyQuiz",
    locale: "it_IT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ripassi certificazioni | CertifyQuiz",
    description:
      "Ripassa rapidamente gli argomenti principali delle certificazioni IT.",
  },
};

export default function Page() {
  return <ReviewsIndexPage lang="it" />;
}