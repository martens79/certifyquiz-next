import AIRoadmapPage from "@/components/roadmaps/AIRoadmapPage";
import type { Metadata } from "next";

type Locale = "it" | "en" | "es" | "fr";

const SEO: Record<Locale, { title: string; description: string }> = {
  en: {
    title: "AI Certification Roadmap 2026 | AWS AI, Azure AI, Google ML",
    description:
      "Step-by-step AI and machine learning certification roadmap for 2026. From AWS AI Practitioner and Azure AI-900 to Google ML Engineer — with practice quizzes and salary outlook.",
  },
  it: {
    title: "Roadmap Certificazioni AI 2026 | AWS AI, Azure AI, Google ML",
    description:
      "Percorso completo per le certificazioni intelligenza artificiale 2026: da AWS AI Practitioner e Azure AI-900 fino a Google ML Engineer. Con quiz di pratica e guida agli stipendi.",
  },
  es: {
    title: "Ruta Certificaciones IA 2026 | AWS AI, Azure AI, Google ML",
    description:
      "Ruta paso a paso para certificaciones de inteligencia artificial en 2026. De AWS AI Practitioner y Azure AI-900 hasta Google ML Engineer — con tests de práctica y salarios.",
  },
  fr: {
    title: "Parcours Certifications IA 2026 | AWS AI, Azure AI, Google ML",
    description:
      "Parcours complet pour les certifications intelligence artificielle 2026 : d'AWS AI Practitioner et Azure AI-900 jusqu'à Google ML Engineer — avec quiz pratiques et salaires.",
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
  return <AIRoadmapPage lang={lang} />;
}