import type { Metadata } from "next";
import ReviewsIndexPage from "@/components/ReviewsIndexPage";

export const metadata: Metadata = {
  title: "Repasos de certificación | CertifyQuiz",
  description:
    "Repasa rápidamente los conceptos clave de las principales certificaciones de TI con guías de estudio claras y concisas de CertifyQuiz.",
  keywords: [
    "repasos certificación",
    "certificaciones TI",
    "repaso examen",
    "guías certificación",
    "CertifyQuiz",
  ],
  alternates: {
    canonical: "https://www.certifyquiz.com/es/repasos",
    languages: {
      en: "https://www.certifyquiz.com/reviews",
      it: "https://www.certifyquiz.com/it/ripassi",
      fr: "https://www.certifyquiz.com/fr/revisions",
      es: "https://www.certifyquiz.com/es/repasos",
    },
  },
  openGraph: {
    title: "Repasos de certificación | CertifyQuiz",
    description:
      "Repasa rápidamente los conceptos clave de las principales certificaciones de TI.",
    url: "https://www.certifyquiz.com/es/repasos",
    siteName: "CertifyQuiz",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Repasos de certificación | CertifyQuiz",
    description:
      "Repasa rápidamente los conceptos clave de las principales certificaciones de TI.",
  },
};

export default function Page() {
  return <ReviewsIndexPage lang="es" />;
}