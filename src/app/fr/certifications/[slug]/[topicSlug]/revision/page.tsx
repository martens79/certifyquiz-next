import type { Metadata } from "next";
import TopicReviewPageShell, {
  generateTopicReviewMetadata,
} from "@/components/TopicReviewPageShell";

type PageProps = {
  params: Promise<{
    slug: string;
    topicSlug: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, topicSlug } = await params;

  return generateTopicReviewMetadata({
    lang: "fr",
    slug,
    topicSlug,
  });
}

export default async function FrenchTopicReviewPage({ params }: PageProps) {
  const { slug, topicSlug } = await params;

  return (
    <TopicReviewPageShell lang="fr" slug={slug} topicSlug={topicSlug} />
  );
}