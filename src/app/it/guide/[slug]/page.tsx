import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGuideBySlug } from "@/lib/data";
import { guidePath } from "@/lib/paths";
import GuideDetailView from "@/components/guides/GuideDetailView";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug, "it");

  if (!guide) {
    return {
      title: "Guida PDF di studio | CertifyQuiz",
      description: "Guida PDF scaricabile per prepararti a una certificazione IT.",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com";
  const title = `${guide.title} (PDF) | CertifyQuiz`;
  const description = `Scarica la guida PDF per ${guide.certification_name}${
    guide.page_count ? ` (${guide.page_count} pagine)` : ""
  }. Anteprima gratuita disponibile.`;
  const pageUrl = `${siteUrl}${guidePath("it", guide.slug)}`;

  return {
    title,
    description,
    alternates: { canonical: pageUrl },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "CertifyQuiz",
      locale: "it_IT",
      type: "website",
    },
  };
}

export default async function GuideDetailItPage({ params }: Props) {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug, "it");

  if (!guide) notFound();

  return <GuideDetailView lang="it" guide={guide} />;
}
