import type { Metadata } from "next";
import { notFound } from "next/navigation";
import InteractiveLabsLanding from "@/features/labs/InteractiveLabsLanding";
import { isLocale, type Locale } from "@/lib/paths";
import { getLabsCatalog, type LabsCatalog } from "@/lib/server/labs";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.certifyquiz.com").replace(/\/+$/, "");
const seo: Record<Locale, { title: string; description: string }> = {
  it: { title: "Laboratori interattivi per certificazioni | CertifyQuiz", description: "Esercitazioni pratiche e ambienti simulati per sviluppare competenze orientate alle certificazioni." },
  en: { title: "Interactive certification practice labs | CertifyQuiz", description: "Task-based practice and simulated environments for hands-on certification training." },
  fr: { title: "Laboratoires interactifs de certification | CertifyQuiz", description: "Entraînement pratique axé sur les tâches dans des environnements simulés de certification." },
  es: { title: "Laboratorios interactivos de certificación | CertifyQuiz", description: "Práctica basada en tareas y entornos simulados para formación práctica de certificación." },
};

type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ certification?: string | string[] }>;
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: raw } = await params;
  if (!isLocale(raw)) return { robots: { index: false, follow: false } };
  const canonical = raw === "en" ? `${SITE}/interactive-labs` : `${SITE}/${raw}/interactive-labs`;
  return { ...seo[raw], alternates: { canonical, languages: { it: `${SITE}/it/interactive-labs`, en: `${SITE}/interactive-labs`, fr: `${SITE}/fr/interactive-labs`, es: `${SITE}/es/interactive-labs`, "x-default": `${SITE}/interactive-labs` } }, openGraph: { ...seo[raw], url: canonical, type: "website", siteName: "CertifyQuiz" } };
}

export default async function Page({ params, searchParams }: Props) {
  const [{ lang }, { certification }] = await Promise.all([params, searchParams]);
  if (!isLocale(lang)) notFound();
  const initialCertificationSlug =
    typeof certification === "string" ? certification.trim() : null;
  // Fallback qui, non dentro getLabsCatalog: vedi il commento su quella funzione.
  // Scatta solo se non esiste alcuna versione precedente da servire.
  let catalog: LabsCatalog = { labs: [], certifications: [] };
  try {
    catalog = await getLabsCatalog(lang);
  } catch (error) {
    console.error(`[interactive-labs/${lang}] getLabsCatalog failed, falling back to legacy-only catalog`, error);
  }
  return <InteractiveLabsLanding lang={lang} dbLabs={catalog.labs} dbCertifications={catalog.certifications} initialCertificationSlug={initialCertificationSlug} />;
}
