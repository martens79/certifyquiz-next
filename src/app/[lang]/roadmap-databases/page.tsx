import DatabasesRoadmapPage from "@/components/roadmaps/DatabasesRoadmapPage";
import type { Metadata } from "next";

type Locale = "it" | "en" | "es" | "fr";

const SEO: Record<Locale, { title: string; description: string }> = {
  en: {
    title: "Database Certification Roadmap 2026 | SQL Server, MySQL, Oracle",
    description:
      "Step-by-step database certification roadmap for 2026. From SQL basics to Microsoft SQL Server, DP-300, and Oracle DBA — with practice quizzes and salary outlook.",
  },
  it: {
    title: "Roadmap Certificazioni Database 2026 | SQL Server, MySQL, Oracle",
    description:
      "Percorso completo per le certificazioni database 2026: dalle basi SQL fino a Microsoft SQL Server, DP-300 e Oracle DBA. Con quiz di pratica e guida agli stipendi.",
  },
  es: {
    title: "Ruta Certificaciones Bases de Datos 2026 | SQL Server, MySQL, Oracle",
    description:
      "Ruta paso a paso para certificaciones de bases de datos en 2026. De SQL básico hasta Microsoft SQL Server, DP-300 y Oracle DBA — con tests de práctica y salarios.",
  },
  fr: {
    title: "Parcours Certifications Bases de Données 2026 | SQL Server, MySQL, Oracle",
    description:
      "Parcours complet pour les certifications bases de données 2026 : des bases SQL jusqu'à Microsoft SQL Server, DP-300 et Oracle DBA — avec quiz pratiques et salaires.",
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
  return <DatabasesRoadmapPage lang={lang} />;
}