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
  "Prepare for IT certifications with free practice quizzes and detailed explanations. AWS, Azure, Security+, CCNA, PMP and more.";

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

