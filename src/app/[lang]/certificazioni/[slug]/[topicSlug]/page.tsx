import { notFound } from "next/navigation";
import { getTopicPageData } from "@/lib/server/topic-page";
import Link from "next/link";

export default async function TopicPage({
  params,
}: {
  params: Promise<{
    lang: "it" | "en" | "fr" | "es";
    slug: string;
    topicSlug: string;
  }>;
}) {
  const { lang, slug, topicSlug } = await params;

  const data = await getTopicPageData({
    certSlug: slug,
    topicSlug,
    lang,
  });

  if (!data) return notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* BACK */}
      <Link
        href={`/${lang}/certificazioni/${slug}`}
        className="text-sm text-blue-600 hover:underline"
      >
        ← Torna alla certificazione
      </Link>

      {/* TITLE */}
      <h1 className="text-3xl font-bold mt-4 mb-4">
        {data.topic.title}
      </h1>

      {/* DESCRIPTION */}
      <p className="text-gray-700 mb-6">
        {data.topic.description}
      </p>

      {/* CTA */}
      <Link
        href={`/${lang}/quiz/topic/${data.topic.id}`}
        className="inline-block bg-yellow-400 px-6 py-3 rounded-full font-semibold mb-8"
      >
        🚀 Inizia quiz
      </Link>

      {/* INFO */}
      {data.questionCount !== null && (
        <p className="text-sm text-gray-500 mb-6">
          Domande disponibili: {data.questionCount}
        </p>
      )}

      {/* RELATED */}
      <h2 className="text-xl font-semibold mb-4">
        Argomenti correlati
      </h2>

      <div className="grid gap-4">
        {data.relatedTopics.map((t) => (
          <Link
            key={t.id}
            href={`/${lang}/certificazioni/${slug}/${t.slug}`}
            className="block p-4 border rounded-lg hover:bg-gray-50"
          >
            <div className="font-medium">{t.title}</div>
            <div className="text-sm text-gray-500">
              {t.description}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}