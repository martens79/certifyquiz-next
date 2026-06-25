import VirtualizationRoadmapPage from "@/components/roadmaps/VirtualizationRoadmapPage";
import type { Metadata } from "next";

type Locale = "it" | "en" | "es" | "fr";

const SEO: Record<Locale, { title: string; description: string }> = {
  en: {
    title: "Virtualization Certification Roadmap 2026 | VMware VCP, Kubernetes",
    description:
      "Step-by-step virtualization certification roadmap for 2026. From VMware VCP and Hyper-V basics to Kubernetes and container orchestration — with practice quizzes and salary outlook.",
  },
  it: {
    title: "Roadmap Certificazioni Virtualizzazione 2026 | VMware VCP, Kubernetes",
    description:
      "Percorso completo per le certificazioni virtualizzazione 2026: da VMware VCP e Hyper-V fino a Kubernetes e container orchestration. Con quiz di pratica e guida agli stipendi.",
  },
  es: {
    title: "Ruta Certificaciones Virtualización 2026 | VMware VCP, Kubernetes",
    description:
      "Ruta paso a paso para certificaciones de virtualización en 2026. De VMware VCP e Hyper-V hasta Kubernetes y orquestación de contenedores — con tests de práctica y salarios.",
  },
  fr: {
    title: "Parcours Certifications Virtualisation 2026 | VMware VCP, Kubernetes",
    description:
      "Parcours complet pour les certifications virtualisation 2026 : de VMware VCP et Hyper-V jusqu'à Kubernetes et l'orchestration de conteneurs — avec quiz pratiques et salaires.",
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
  return <VirtualizationRoadmapPage lang={lang} />;
}