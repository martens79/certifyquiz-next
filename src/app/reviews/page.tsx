import type { Metadata } from "next";
import ReviewsIndexPage from "@/components/ReviewsIndexPage";

export const metadata: Metadata = {
  title: "Certification Reviews | CertifyQuiz",
  description:
    "Review the key concepts of IT certifications with concise study guides. Quickly revise topics before your exam with CertifyQuiz.",
  keywords: [
    "certification reviews",
    "IT certification study",
    "exam review",
    "certification revision",
    "CertifyQuiz",
  ],
  alternates: {
    canonical: "https://www.certifyquiz.com/reviews",
    languages: {
      en: "https://www.certifyquiz.com/reviews",
      it: "https://www.certifyquiz.com/it/ripassi",
      fr: "https://www.certifyquiz.com/fr/revisions",
      es: "https://www.certifyquiz.com/es/repasos",
    },
  },
  openGraph: {
    title: "Certification Reviews | CertifyQuiz",
    description:
      "Quickly review the key concepts of your IT certifications.",
    url: "https://www.certifyquiz.com/reviews",
    siteName: "CertifyQuiz",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Certification Reviews | CertifyQuiz",
    description:
      "Quickly review the key concepts of your IT certifications.",
  },
};

export default function Page() {
  return <ReviewsIndexPage lang="en" />;
}