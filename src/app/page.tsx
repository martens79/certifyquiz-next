// src/app/page.tsx
import type { Metadata } from "next";
import HomeWithAuth from "@/components/home/HomeWithAuth";

const SITE =
  (process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com").replace(
    /\/+$/,
    ""
  );

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "CertifyQuiz — Prepare for IT Certifications",
  description:
    "Quizzes, explanations and badges to pass IT certifications. Start now with ITF+, A+, AWS, Azure, Security+ and more!",
  alternates: {
    canonical: `${SITE}/`,
    languages: {
      en: `${SITE}/`,
      it: `${SITE}/it`,
      es: `${SITE}/es`,
      fr: `${SITE}/fr`,
      "x-default": `${SITE}/`,
    },
  },
  openGraph: {
    url: `${SITE}/`,
    title: "CertifyQuiz — Prepare for IT Certifications",
    description: "Quizzes, explanations and badges to pass IT certifications.",
    siteName: "CertifyQuiz",
    locale: "en_US",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function HomeRootEN() {
  return (
    <main id="main">
      <HomeWithAuth lang="en" />
    </main>
  );
}
