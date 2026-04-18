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

    mobileHint: {
      en: "🎯 Quick quiz on this topic",
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
  const quizHref = `/quiz/topic/${data.topic.id}`;

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-10 pb-28 md:pb-10">
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

          <p className="text-base md:text-lg text-slate-700 max-w-3xl mb-4">
            {data.topic.description}
          </p>

          {/* CTA spostata più in alto: visibile prima su mobile */}
          <div className="mb-6">
            <Link
              href={quizHref}
              className="inline-flex items-center justify-center bg-yellow-400 hover:bg-yellow-300 px-6 py-3 rounded-full font-semibold text-slate-900 shadow-sm"
            >
              {labels.startQuiz}
            </Link>

            {data.questionCount !== null && (
              <p className="text-sm text-slate-500 mt-3">
                {labels.availableQuestions}: {data.questionCount}
              </p>
            )}
          </div>

          {/* Intro SEO lasciata sotto la CTA */}
          {data.topic.intro && (
            <div className="max-w-3xl text-slate-700 leading-7 mb-6">
              <p>{data.topic.intro}</p>
            </div>
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
            <div
              className="prose max-w-none text-slate-700"
              dangerouslySetInnerHTML={{ __html: data.topic.content }}
            />
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

      {/* CTA sticky mobile: sopra la bottom nav */}
      <div className="md:hidden fixed left-4 right-4 bottom-20 z-40">
        <div className="rounded-2xl bg-white/95 backdrop-blur border shadow-lg p-3">
          <div className="text-xs text-slate-500 mb-2">{labels.mobileHint}</div>
          <Link
            href={quizHref}
            className="flex items-center justify-center w-full bg-yellow-400 hover:bg-yellow-300 px-5 py-3 rounded-full font-semibold text-slate-900"
          >
            {labels.startQuiz}
          </Link>
        </div>
      </div>
    </>
  );
}