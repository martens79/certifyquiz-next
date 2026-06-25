import ProgrammingRoadmapPage from "@/components/roadmaps/ProgrammingRoadmapPage";
import type { Metadata } from "next";

type Locale = "it" | "en" | "es" | "fr";

const SEO: Record<Locale, { title: string; description: string }> = {
  en: {
    title: "Programming Certification Roadmap 2026 | Python, Java, JavaScript",
    description:
      "Step-by-step programming certification roadmap for 2026. From Python and Java fundamentals to advanced developer certifications — with practice quizzes and salary outlook.",
  },
  it: {
    title: "Roadmap Certificazioni Programmazione 2026 | Python, Java, JavaScript",
    description:
      "Percorso completo per le certificazioni programmazione 2026: da Python e Java fino alle certificazioni developer avanzate. Con quiz di pratica e guida agli stipendi.",
  },
  es: {
    title: "Ruta Certificaciones Programación 2026 | Python, Java, JavaScript",
    description:
      "Ruta paso a paso para certificaciones de programación en 2026. De Python y Java hasta certificaciones developer avanzadas — con tests de práctica y salarios.",
  },
  fr: {
    title: "Parcours Certifications Programmation 2026 | Python, Java, JavaScript",
    description:
      "Parcours complet pour les certifications programmation 2026 : de Python et Java jusqu'aux certifications developer avancées — avec quiz pratiques et salaires.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const { title, description } = SEO[lang] ?? SEO.en;
  return { title, description };
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  return <ProgrammingRoadmapPage lang={lang} />;
}