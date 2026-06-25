import CloudRoadmapPage from "@/components/roadmaps/CloudRoadmapPage";
import type { Metadata } from "next";

type Locale = "it" | "en" | "es" | "fr";

const SEO: Record<Locale, { title: string; description: string }> = {
  en: {
    title: "Cloud Certification Roadmap 2026 | AWS, Azure, Google Cloud",
    description:
      "Step-by-step cloud certification roadmap for 2026. From AWS Cloud Practitioner and AZ-900 to Solutions Architect and beyond — with practice quizzes and salary outlook.",
  },
  it: {
    title: "Roadmap Certificazioni Cloud 2026 | AWS, Azure, Google Cloud",
    description:
      "Percorso completo per le certificazioni cloud 2026: da AWS Cloud Practitioner e AZ-900 fino a Solutions Architect. Con quiz di pratica e guida agli stipendi.",
  },
  es: {
    title: "Ruta Certificaciones Cloud 2026 | AWS, Azure, Google Cloud",
    description:
      "Ruta paso a paso para certificaciones cloud en 2026. De AWS Cloud Practitioner y AZ-900 hasta Solutions Architect — con tests de práctica y salarios.",
  },
  fr: {
    title: "Parcours Certifications Cloud 2026 | AWS, Azure, Google Cloud",
    description:
      "Parcours complet pour les certifications cloud 2026 : d'AWS Cloud Practitioner et AZ-900 jusqu'à Solutions Architect — avec quiz pratiques et salaires.",
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
  return <CloudRoadmapPage lang={lang} />;
}