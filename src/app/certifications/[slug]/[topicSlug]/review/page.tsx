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
    lang: "en",
    slug,
    topicSlug,
  });
}

export default async function EnglishTopicReviewPage({ params }: PageProps) {
  const { slug, topicSlug } = await params;

  return (
    <TopicReviewPageShell lang="en" slug={slug} topicSlug={topicSlug} />
  );
}