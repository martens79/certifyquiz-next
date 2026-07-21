import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGuideBySlug } from "@/lib/data";
import { guidePath } from "@/lib/paths";
import GuideDetailView from "@/components/guides/GuideDetailView";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug, "fr");

  if (!guide) {
    return {
      title: "Guide PDF d'étude | CertifyQuiz",
      description: "Guide PDF téléchargeable pour préparer une certification IT.",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com";
  const title = `${guide.title} (PDF) | CertifyQuiz`;
  const description = `Téléchargez le guide PDF pour ${guide.certification_name}${
    guide.page_count ? ` (${guide.page_count} pages)` : ""
  }. Aperçu gratuit disponible.`;
  const pageUrl = `${siteUrl}${guidePath("fr", guide.slug)}`;

  return {
    title,
    description,
    alternates: { canonical: pageUrl },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "CertifyQuiz",
      locale: "fr_FR",
      type: "website",
    },
  };
}

export default async function GuideDetailFrPage({ params }: Props) {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug, "fr");

  if (!guide) notFound();

  return <GuideDetailView lang="fr" guide={guide} />;
}
