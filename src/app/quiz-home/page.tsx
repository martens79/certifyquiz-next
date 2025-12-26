import type { Metadata } from "next";
import QuizHomeView from "@/app/[lang]/quiz-home/QuizHomeView";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Online IT Certification Quizzes — CertifyQuiz";
  const description =
    "Access all IT quiz categories: security, networking, cloud, databases, programming and more. Choose your certification and start now.";
  const canonical = `${SITE}/quiz-home`;

  return {
    metadataBase: new URL(SITE),
    title,
    description,
    alternates: {
      canonical,
      languages: {
        it: `${SITE}/it/quiz-home`,
        en: `${SITE}/quiz-home`,
        fr: `${SITE}/fr/quiz-home`,
        es: `${SITE}/es/quiz-home`,
        "x-default": `${SITE}/quiz-home`,
      },
    },
    openGraph: {
      url: canonical,
      type: "website",
      title,
      description,
      siteName: "CertifyQuiz",
      locale: "en_US",
      images: [{ url: `${SITE}/og/quiz-home-en.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE}/og/quiz-home-en.png`],
      site: "@CertifyQuiz",
    },
    robots: { index: true, follow: true },
  };
}

export default function Page() {
  return <QuizHomeView lang="en" />;
}
