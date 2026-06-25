import NetworkingRoadmapPage from "@/components/roadmaps/NetworkingRoadmapPage";
import type { Metadata } from "next";

type Locale = "it" | "en" | "es" | "fr";

const SEO: Record<Locale, { title: string; description: string }> = {
  en: {
    title: "Networking Certification Roadmap 2026 | Network+, CCNA, CCNP",
    description:
      "Step-by-step networking certification roadmap for 2026. From CompTIA Network+ and CCST to CCNA and CCNP Enterprise — with practice quizzes and salary outlook.",
  },
  it: {
    title: "Roadmap Certificazioni Networking 2026 | Network+, CCNA, CCNP",
    description:
      "Percorso completo per le certificazioni networking 2026: da CompTIA Network+ e CCST fino a CCNA e CCNP Enterprise. Con quiz di pratica e guida agli stipendi.",
  },
  es: {
    title: "Ruta Certificaciones Networking 2026 | Network+, CCNA, CCNP",
    description:
      "Ruta paso a paso para certificaciones de networking en 2026. De CompTIA Network+ y CCST hasta CCNA y CCNP Enterprise — con tests de práctica y salarios.",
  },
  fr: {
    title: "Parcours Certifications Networking 2026 | Network+, CCNA, CCNP",
    description:
      "Parcours complet pour les certifications networking 2026 : de CompTIA Network+ et CCST jusqu'à CCNA et CCNP Enterprise — avec quiz pratiques et salaires.",
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
  return <NetworkingRoadmapPage lang={lang} />;
}