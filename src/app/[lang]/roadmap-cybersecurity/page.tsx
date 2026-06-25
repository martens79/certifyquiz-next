import CybersecurityRoadmapPage from "@/components/roadmaps/CybersecurityRoadmapPage";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Lang = "it" | "es" | "fr";

const SEO: Record<Lang, { title: string; description: string }> = {
  it: {
    title: "Roadmap Certificazioni Cybersecurity 2026 | ISC2 CC, CEH, CISSP",
    description:
      "Percorso completo per le certificazioni cybersecurity 2026: da ISC2 CC e CompTIA Security+ fino a CEH e CISSP. Con quiz di pratica e guida agli stipendi.",
  },
  es: {
    title: "Ruta Certificaciones Ciberseguridad 2026 | ISC2 CC, CEH, CISSP",
    description:
      "Ruta paso a paso para certificaciones de ciberseguridad en 2026. De ISC2 CC y Security+ hasta CEH y CISSP — con tests de práctica y salarios.",
  },
  fr: {
    title: "Parcours Certifications Cybersécurité 2026 | ISC2 CC, CEH, CISSP",
    description:
      "Parcours complet pour les certifications cybersécurité 2026 : d'ISC2 CC et Security+ jusqu'à CEH et CISSP — avec quiz pratiques et salaires.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const seo = SEO[lang as Lang];
  if (!seo) return {};
  return { title: seo.title, description: seo.description };
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!["it", "es", "fr"].includes(lang)) notFound();

  return <CybersecurityRoadmapPage lang={lang as Lang} />;
}