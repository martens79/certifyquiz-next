import FundamentalsRoadmapPage from "@/components/roadmaps/FundamentalsRoadmapPage";
import type { Metadata } from "next";

type Locale = "it" | "en" | "es" | "fr";

const SEO: Record<Locale, { title: string; description: string }> = {
  en: {
    title: "IT Fundamentals Certification Roadmap 2026 | ITF+, A+, CompTIA",
    description:
      "Step-by-step IT fundamentals certification roadmap for 2026. From CompTIA ITF+ and A+ to core IT skills — with practice quizzes and career outlook.",
  },
  it: {
    title: "Roadmap Certificazioni IT Base 2026 | ITF+, A+, CompTIA",
    description:
      "Percorso completo per le certificazioni IT di base 2026: da CompTIA ITF+ e A+ alle competenze fondamentali IT. Con quiz di pratica e guida alle carriere.",
  },
  es: {
    title: "Ruta Certificaciones Fundamentos IT 2026 | ITF+, A+, CompTIA",
    description:
      "Ruta paso a paso para certificaciones de fundamentos IT en 2026. De CompTIA ITF+ y A+ a las habilidades IT esenciales — con tests de práctica y salidas profesionales.",
  },
  fr: {
    title: "Parcours Certifications Fondamentaux IT 2026 | ITF+, A+, CompTIA",
    description:
      "Parcours complet pour les certifications fondamentaux IT 2026 : de CompTIA ITF+ et A+ aux compétences IT essentielles — avec quiz pratiques et débouchés.",
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
  return <FundamentalsRoadmapPage lang={lang} />;
}