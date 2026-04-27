import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getTopicPageData } from "@/lib/server/topic-page";
import ContextualLeadMagnetBox from "@/components/newsletter/ContextualLeadMagnetBox";
import TopicContent from "@/components/TopicContent";

function getLabels() {
  return {
    back: "← Volver a la certificación",
    startQuiz: "🚀 Empezar quiz",
    availableQuestions: "Preguntas disponibles",
    relatedTopics: "Temas relacionados",
    whatYouWillLearn: "Qué aprenderás en este tema",
    whyItMatters: "Por qué este tema es importante",
    practiceIntro: "Este tema forma parte del recorrido",
    learnText1: "...",
    learnText2: "El quiz sobre",
    learnText3: "...",
    whyText1: "Estudiar bien",
    whyText2: "...",
    whyText3: "...",
    whyText4: "...",
    faqTitle: "Preguntas frecuentes",
    contentTitle: "Guía rápida",

    // 👇 AGGIUNGI QUESTO
    mobileHint: "🎯 Quiz rápido sobre este tema",
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
    lang: "es",
  });

  if (!data) {
    return {
      title: "Tema | CertifyQuiz",
      description: "Practica temas de certificación en CertifyQuiz.",
    };
  }

  const title =
    data.topic.seoTitle ||
    `${data.topic.title} | ${data.certification.title} | CertifyQuiz`;

  const description =
    data.topic.seoDescription ||
    data.topic.description ||
    "Practica este tema de certificación en CertifyQuiz.";

  const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com";

const pageUrl = `${siteUrl}/es/certificaciones/${slug}/${topicSlug}`;

const category =
  slug.includes("security") ||
  slug.includes("ceh") ||
  slug.includes("cissp") ||
  slug.includes("isc2")
    ? "security"
    : slug.includes("aws") ||
        slug.includes("azure") ||
        slug.includes("google-cloud")
      ? "cloud"
      : slug.includes("ccna") || slug.includes("network")
        ? "networking"
        : "default";

const ogImage = `${siteUrl}/api/og?type=topic&title=${encodeURIComponent(
  data.topic.title
)}&subtitle=${encodeURIComponent(
  `${data.certification.title} Preguntas de práctica gratis`
)}&category=${category}`;

return {
  title,
  description,
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title,
    description,
    url: pageUrl,
    siteName: "CertifyQuiz",
    type: "website",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: `${data.topic.title} - ${data.certification.title}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImage],
  },
};
}

export default async function TopicPageEs({
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
    lang: "es",
  });

  if (!data) return notFound();

  const labels = getLabels();
  const quizHref = `/es/quiz/topic/${data.topic.id}`;

  return (
  <>
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-10 pb-28 md:pb-10">
      <Link
        href={`/es/certificaciones/${slug}`}
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

        {/* CTA sopra la piega */}
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

        {/* Intro SEO */}
        {data.topic.intro && (
          <div className="max-w-3xl text-slate-700 leading-7 mb-6">
            <p>{data.topic.intro}</p>
          </div>
        )}

        {/* 🔥 LEAD MAGNET */}
        <ContextualLeadMagnetBox
          lang="es"
          variant="topic"
          certificationSlug={slug}
          topicSlug={topicSlug}
          quizHref={quizHref}
          className="mb-8"
        />
      </section>

      {/* WHAT YOU WILL LEARN */}
      <section className="bg-white border rounded-2xl p-6 mb-8">
        <h2 className="text-2xl font-semibold text-slate-900 mb-3">
          {labels.whatYouWillLearn}
        </h2>
        <p className="text-slate-700 leading-7">
          {labels.practiceIntro} <strong>{data.certification.title}</strong>.{" "}
          {labels.learnText1}
        </p>
        <p className="text-slate-700 leading-7 mt-4">
          {labels.learnText2} <strong>{data.topic.title}</strong>{" "}
          {labels.learnText3}
        </p>
      </section>

      {/* WHY IT MATTERS */}
      <section className="bg-white border rounded-2xl p-6 mb-8">
        <h2 className="text-2xl font-semibold text-slate-900 mb-3">
          {labels.whyItMatters}
        </h2>
        <p className="text-slate-700 leading-7">
          {labels.whyText1} <strong>{data.topic.title}</strong>{" "}
          {labels.whyText2} <strong>{data.certification.title}</strong>.{" "}
          {labels.whyText3}
        </p>
        <p className="text-slate-700 leading-7 mt-4">
          {labels.whyText4}
        </p>
      </section>

      {/* CONTENT */}
      {data.topic.content && (
  <section className="bg-white border rounded-2xl p-6 mb-8">
    <TopicContent
      content={data.topic.content}
      quizRoute={quizHref}
      lang="es"
    />
  </section>
)}

      {/* FAQ */}
      {data.topic.faq && data.topic.faq.length > 0 && (
        <section className="bg-white border rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">
            {labels.faqTitle}
          </h2>

          <div className="space-y-5">
            {data.topic.faq.map((item, index) => (
              <div key={`${item.q}-${index}`}>
                <h3 className="font-semibold text-slate-900">{item.q}</h3>
                <p className="text-slate-700 mt-2 leading-7">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* RELATED */}
      <section>
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">
          {labels.relatedTopics}
        </h2>

        <div className="grid gap-4">
          {data.relatedTopics.map((t) => (
            <Link
              key={t.id}
              href={`/es/certificaciones/${slug}/${t.slug}`}
              className="block p-5 border rounded-2xl hover:bg-slate-50 transition"
            >
              <div className="font-semibold text-slate-900">
                {t.title}
              </div>
              <div className="text-sm text-slate-600 mt-2">
                {t.description}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>

    {/* 📱 STICKY CTA MOBILE */}
    <div className="md:hidden fixed left-4 right-4 bottom-20 z-40">
      <div className="rounded-2xl bg-white/95 backdrop-blur border shadow-lg p-3">
        <div className="text-xs text-slate-500 mb-2">
          {labels.mobileHint}
        </div>
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