import "server-only";

export type Lang = "it" | "en" | "fr" | "es";

// 🔹 FAQ item tipizzato
export type TopicFaqItem = {
  q: string;
  a: string;
};

export type TopicPageData = {
  topic: {
    id: number;
    quiz_id: number | null;
    slug: string;
    title: string;
    description: string;

    // 🔥 NUOVI CAMPI SEO / CONTENT
    intro?: string | null;
    seoTitle?: string | null;
    seoDescription?: string | null;
    content?: string | null;
    faq?: TopicFaqItem[];
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

  const data = await res.json();

  // 🧠 Safety: normalizziamo FAQ se backend non è ancora aggiornato
  if (data?.topic) {
    if (!Array.isArray(data.topic.faq)) {
      data.topic.faq = [];
    }
  }

  return data;
}