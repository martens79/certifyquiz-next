import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGuideBySlug } from "@/lib/data";
import { guidePath } from "@/lib/paths";
import GuideDetailView from "@/components/guides/GuideDetailView";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug, "en");

  if (!guide) {
    return {
      title: "Study Guide (PDF) | CertifyQuiz",
      description: "Downloadable PDF study guide for IT certifications.",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com";
  const title = `${guide.title} (PDF) | CertifyQuiz`;
  const description = `Download the ${guide.certification_name} study guide in PDF${
    guide.page_count ? ` (${guide.page_count} pages)` : ""
  }. Free preview available.`;
  const pageUrl = `${siteUrl}${guidePath("en", guide.slug)}`;

  return {
    title,
    description,
    alternates: { canonical: pageUrl },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "CertifyQuiz",
      locale: "en_US",
      type: "website",
    },
  };
}

export default async function GuideDetailPage({ params }: Props) {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug, "en");

  if (!guide) notFound();

  return <GuideDetailView lang="en" guide={guide} />;
}
