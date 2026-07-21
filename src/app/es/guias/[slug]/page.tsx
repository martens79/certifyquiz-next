import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGuideBySlug } from "@/lib/data";
import { guidePath } from "@/lib/paths";
import GuideDetailView from "@/components/guides/GuideDetailView";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug, "es");

  if (!guide) {
    return {
      title: "Guía PDF de estudio | CertifyQuiz",
      description: "Guía PDF descargable para preparar una certificación IT.",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com";
  const title = `${guide.title} (PDF) | CertifyQuiz`;
  const description = `Descarga la guía PDF de ${guide.certification_name}${
    guide.page_count ? ` (${guide.page_count} páginas)` : ""
  }. Vista previa gratuita disponible.`;
  const pageUrl = `${siteUrl}${guidePath("es", guide.slug)}`;

  return {
    title,
    description,
    alternates: { canonical: pageUrl },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "CertifyQuiz",
      locale: "es_ES",
      type: "website",
    },
  };
}

export default async function GuideDetailEsPage({ params }: Props) {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug, "es");

  if (!guide) notFound();

  return <GuideDetailView lang="es" guide={guide} />;
}
