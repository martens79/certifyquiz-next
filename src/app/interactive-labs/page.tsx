import type { Metadata } from "next";
import InteractiveLabsLanding from "@/features/labs/InteractiveLabsLanding";
import { getLabsCatalog, type LabsCatalog } from "@/lib/server/labs";

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

type Props = { searchParams: Promise<{ certification?: string | string[] }> };

export default async function Page({ searchParams }: Props) {
  const { certification } = await searchParams;
  const initialCertificationSlug =
    typeof certification === "string" ? certification.trim() : null;
  // Fallback qui, non dentro getLabsCatalog: vedi il commento su quella funzione.
  // Scatta solo se non esiste alcuna versione precedente da servire.
  let catalog: LabsCatalog = { labs: [], certifications: [] };
  try {
    catalog = await getLabsCatalog("en");
  } catch (error) {
    console.error("[interactive-labs] getLabsCatalog failed, falling back to legacy-only catalog", error);
  }
  return <InteractiveLabsLanding lang="en" dbLabs={catalog.labs} dbCertifications={catalog.certifications} initialCertificationSlug={initialCertificationSlug} />;
}
