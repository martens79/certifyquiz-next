// src/app/page.tsx
import type { Metadata } from "next";
import HomeWithAuth from "@/components/home/HomeWithAuth";

const SITE =
  (process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com").replace(
    /\/+$/,
    ""
  );

const HOME_TITLE = "CertifyQuiz — IT Certification Practice Tests & Quizzes";
const HOME_DESCRIPTION =
  "Open doors you can't knock on yet. Free practice tests, exam simulations and labs for AWS, CCNA, Security+, Azure, CompTIA and 50+ IT certifications.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
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
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    siteName: "CertifyQuiz",
    locale: "en_US",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function HomeRootEN() {
  return <HomeWithAuth lang="en" />;
}

