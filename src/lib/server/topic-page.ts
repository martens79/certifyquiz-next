import "server-only";

export type Lang = "it" | "en" | "fr" | "es";

export type TopicPageData = {
  topic: {
    id: number;
    quiz_id: number | null;
    slug: string;
    title: string;
    description: string;
  };
  certification: {
    id: number;
    slug: string;
    title: string;
  };
  relatedTopics: Array<{
    id: number;
    slug: string;
    title: string;
    description: string;
  }>;
  questionCount: number | null;
};

const API_BASE_URL = process.env.API_BASE_URL!;

export async function getTopicPageData({
  certSlug,
  topicSlug,
  lang,
}: {
  certSlug: string;
  topicSlug: string;
  lang: Lang;
}): Promise<TopicPageData | null> {
  const res = await fetch(
    `${API_BASE_URL}/topic-pages/${certSlug}/${topicSlug}?lang=${lang}`,
    {
      next: {
        revalidate: 3600,
        tags: [`topic:${certSlug}:${topicSlug}:${lang}`],
      },
    }
  );

  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed topic page fetch");

  return res.json();
}