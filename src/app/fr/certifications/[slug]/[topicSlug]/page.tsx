import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getTopicPageData } from "@/lib/server/topic-page";
import ContextualLeadMagnetBox from "@/components/newsletter/ContextualLeadMagnetBox";

function getLabels() {
  return {
    back: "← Retour à la certification",
    startQuiz: "🚀 Commencer le quiz",
    availableQuestions: "Questions disponibles",
    relatedTopics: "Sujets liés",
    whatYouWillLearn: "Ce que vous apprendrez dans ce sujet",
    whyItMatters: "Pourquoi ce sujet est important",
    practiceIntro: "Ce sujet fait partie du parcours",
    learnText1:
      "Sur cette page, vous pouvez mieux comprendre ce que couvre ce sujet, quels concepts sont les plus importants et pourquoi il est utile de s’exercer avec un quiz dédié avant de passer à l’examen complet ou aux quiz mixtes.",
    learnText2: "Le quiz sur",
    learnText3:
      "vous aide à vous concentrer sur des notions spécifiques, des définitions, des scénarios pratiques et des concepts récurrents qui peuvent apparaître pendant la préparation à la certification.",
    whyText1: "Bien étudier",
    whyText2:
      "est important, car ce sujet contribue à la compréhension globale de la certification",
    whyText3:
      "Une bonne préparation sur chaque sujet facilite la gestion des questions théoriques et pratiques, tout en améliorant la confiance et la rapidité de réponse.",
    whyText4:
      "S’entraîner sujet par sujet vous permet aussi d’identifier plus précisément vos points faibles, de mieux réviser et de construire une préparation plus solide dans le temps.",
    faqTitle: "FAQ",
    contentTitle: "Guide rapide",
    mobileHint: "🎯 Quiz rapide sur ce sujet",
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
    lang: "fr",
  });

  if (!data) {
    return {
      title: "Sujet | CertifyQuiz",
      description: "Pratiquez des sujets de certification sur CertifyQuiz.",
    };
  }

  const title =
    data.topic.seoTitle ||
    `${data.topic.title} | ${data.certification.title} | CertifyQuiz`;

  const description =
    data.topic.seoDescription ||
    data.topic.description ||
    "Pratiquez ce sujet de certification sur CertifyQuiz.";

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com";

  const pageUrl = `${siteUrl}/fr/certifications/${slug}/${topicSlug}`;

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
    `${data.certification.title} Questions d’entraînement gratuites`
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

export default async function TopicPageFr({
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
    lang: "fr",
  });

  if (!data) return notFound();

  const labels = getLabels();
  const quizHref = `/fr/quiz/topic/${data.topic.id}`;

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-10 pb-28 md:pb-10">
        <Link
          href={`/fr/certifications/${slug}`}
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

          {data.topic.intro && (
            <div className="max-w-3xl text-slate-700 leading-7 mb-6">
              <p>{data.topic.intro}</p>
            </div>
          )}

          <ContextualLeadMagnetBox
            lang="fr"
            variant="topic"
            certificationSlug={slug}
            topicSlug={topicSlug}
            quizHref={quizHref}
            className="mb-8"
          />
        </section>

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
                  <p className="text-slate-700 mt-2 leading-7">
                    {item.a}
                  </p>
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
                href={`/fr/certifications/${slug}/${t.slug}`}
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