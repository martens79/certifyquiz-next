import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getTopicPageData } from "@/lib/server/topic-page";

type Lang = "en";

function getLabels(lang: Lang) {
  return {
    back: {
      en: "← Back to certification",
    }[lang],

    startQuiz: {
      en: "🚀 Start quiz",
    }[lang],

    availableQuestions: {
      en: "Available questions",
    }[lang],

    relatedTopics: {
      en: "Related topics",
    }[lang],

    whatYouWillLearn: {
      en: "What you will learn in this topic",
    }[lang],

    whyItMatters: {
      en: "Why this topic matters",
    }[lang],

    practiceIntro: {
      en: "This topic is part of the",
    }[lang],

    contentTitle: {
      en: "Quick guide",
    }[lang],

    faqTitle: {
      en: "FAQ",
    }[lang],
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    slug: string;
    topicSlug: string;
  }>;
}): Promise<Metadata> {
  const { slug, topicSlug } = await params;

  const data = await getTopicPageData({
    certSlug: slug,
    topicSlug,
    lang: "en",
  });

  if (!data) {
    return {
      title: "Topic | CertifyQuiz",
      description: "Practice certification topics on CertifyQuiz.",
    };
  }

  const title =
    data.topic.seoTitle ||
    `${data.topic.title} | ${data.certification.title} | CertifyQuiz`;

  const description =
    data.topic.seoDescription ||
    data.topic.description ||
    "Practice certification topics on CertifyQuiz.";

  return {
    title,
    description,
    alternates: {
      canonical: `/certifications/${slug}/${topicSlug}`,
    },
  };
}

export default async function TopicPageEn({
  params,
}: {
  params: Promise<{
    slug: string;
    topicSlug: string;
  }>;
}) {
  const { slug, topicSlug } = await params;

  const data = await getTopicPageData({
    certSlug: slug,
    topicSlug,
    lang: "en",
  });

  if (!data) return notFound();

  const labels = getLabels("en");

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Link
        href={`/certifications/${slug}`}
        className="text-sm text-blue-600 hover:underline"
      >
        {labels.back}
      </Link>

      <section className="mt-6">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          {data.topic.title}
        </h1>

        <p className="text-lg text-slate-700 max-w-3xl mb-4">
          {data.topic.description}
        </p>

        {data.topic.intro && (
          <div className="max-w-3xl text-slate-700 leading-7 mb-6">
            <p>{data.topic.intro}</p>
          </div>
        )}

        <Link
          href={`/quiz/topic/${data.topic.id}`}
          className="inline-block bg-yellow-400 hover:bg-yellow-300 px-6 py-3 rounded-full font-semibold text-slate-900 mb-6"
        >
          {labels.startQuiz}
        </Link>

        {data.questionCount !== null && (
          <p className="text-sm text-slate-500 mb-8">
            {labels.availableQuestions}: {data.questionCount}
          </p>
        )}
      </section>

      <section className="bg-white border rounded-2xl p-6 mb-8">
        <h2 className="text-2xl font-semibold text-slate-900 mb-3">
          {labels.whatYouWillLearn}
        </h2>
        <p className="text-slate-700 leading-7">
          {labels.practiceIntro} <strong>{data.certification.title}</strong> path.
          This page helps you understand what this topic covers, which concepts
          matter most, and why practicing with a focused quiz can improve your
          exam preparation.
        </p>
        <p className="text-slate-700 leading-7 mt-4">
          The quiz on <strong>{data.topic.title}</strong> helps you focus on
          definitions, practical scenarios, recurring concepts, and the kind of
          knowledge that often appears during certification study and review.
        </p>
      </section>

      <section className="bg-white border rounded-2xl p-6 mb-8">
        <h2 className="text-2xl font-semibold text-slate-900 mb-3">
          {labels.whyItMatters}
        </h2>
        <p className="text-slate-700 leading-7">
          Studying <strong>{data.topic.title}</strong> properly is important
          because it strengthens your overall understanding of the{" "}
          <strong>{data.certification.title}</strong> certification. Good
          topic-level preparation makes it easier to answer both theoretical and
          practical questions with more confidence and speed.
        </p>
        <p className="text-slate-700 leading-7 mt-4">
          Training one topic at a time also helps you identify weak points,
          review more efficiently, and build a more structured preparation path
          before moving to mixed quizzes or full exam simulations.
        </p>
      </section>

      {data.topic.content && (
        <section className="bg-white border rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-3">
            {labels.contentTitle}
          </h2>
          <div className="text-slate-700 leading-7 whitespace-pre-line">
            {data.topic.content}
          </div>
        </section>
      )}

      {data.topic.faq && data.topic.faq.length > 0 && (
        <section className="bg-white border rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">
            {labels.faqTitle}
          </h2>

          <div className="space-y-5">
            {data.topic.faq.map((item, index) => (
              <div key={`${item.q}-${index}`}>
                <h3 className="font-semibold text-slate-900">{item.q}</h3>
                <p className="text-slate-700 mt-2 leading-7">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">
          {labels.relatedTopics}
        </h2>

        <div className="grid gap-4">
          {data.relatedTopics.map((t) => (
            <Link
              key={t.id}
              href={`/certifications/${slug}/${t.slug}`}
              className="block p-5 border rounded-2xl hover:bg-slate-50 transition"
            >
              <div className="font-semibold text-slate-900">{t.title}</div>
              <div className="text-sm text-slate-600 mt-2">{t.description}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}