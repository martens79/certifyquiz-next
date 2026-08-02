import type { Metadata } from "next";
import InteractiveLabsLanding from "@/features/labs/InteractiveLabsLanding";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.certifyquiz.com").replace(/\/+$/, "");
export const metadata: Metadata = {
  title: "Interactive certification practice labs | CertifyQuiz",
  description: "Task-based practice and simulated environments for hands-on certification training.",
  alternates: {
    canonical: `${SITE}/interactive-labs`,
    languages: { it: `${SITE}/it/interactive-labs`, en: `${SITE}/interactive-labs`, fr: `${SITE}/fr/interactive-labs`, es: `${SITE}/es/interactive-labs`, "x-default": `${SITE}/interactive-labs` },
  },
  openGraph: { title: "Interactive certification practice labs | CertifyQuiz", description: "Task-based practice and simulated environments for hands-on certification training.", url: `${SITE}/interactive-labs`, siteName: "CertifyQuiz", type: "website" },
};

export default function Page() {
  return <InteractiveLabsLanding lang="en" />;
}
