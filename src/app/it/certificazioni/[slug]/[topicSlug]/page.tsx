import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getTopicPageData } from "@/lib/server/topic-page";
import ContextualLeadMagnetBox from "@/components/newsletter/ContextualLeadMagnetBox";
import TopicContent from "@/components/TopicContent";

function getLabels() {
  return {
    back: "← Torna alla certificazione",
    startQuiz: "🚀 Inizia il quiz",
    quickReview: "📘 Ripasso rapido",
    quickReviewShort: "📘 Ripasso",
    quizShort: "🚀 Quiz",
    availableQuestions: "Domande disponibili",
    relatedTopics: "Argomenti correlati",
    whatYouWillLearn: "Cosa imparerai in questo argomento",
    whyItMatters: "Perché questo argomento è importante",
    practiceIntro: "Questo argomento fa parte del percorso",
    learnText1:
      "In questa pagina puoi capire meglio cosa copre questo argomento, quali concetti sono più importanti e perché è utile esercitarsi con un quiz dedicato prima di affrontare l'esame completo o i quiz misti.",
    learnText2: "Il quiz su",
    learnText3:
      "ti aiuta a concentrarti su nozioni specifiche, definizioni, scenari pratici e concetti ricorrenti che possono comparire durante la preparazione alla certificazione.",
    whyText1: "Studiare bene",
    whyText2:
      "è importante perché questo argomento contribuisce alla comprensione complessiva della certificazione",
    whyText3:
      "Una buona preparazione su ogni argomento facilita la gestione delle domande teoriche e pratiche, migliorando allo stesso tempo la sicurezza e la velocità di risposta.",
    whyText4:
      "Allenarsi argomento per argomento ti permette anche di identificare con maggiore precisione i tuoi punti deboli, ripassare meglio e costruire una preparazione più solida nel tempo.",
    faqTitle: "FAQ",
    contentTitle: "Guida rapida",
    mobileHint: "🎯 Ripassa o allenati su questo argomento",
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
    lang: "it",
  });

  if (!data) {
    return {
      title: "Argomento | CertifyQuiz",
      description:
        "Esercitati sugli argomenti delle certificazioni IT su CertifyQuiz.",
    };
  }

  const title =
    data.topic.seoTitle ||
    `${data.topic.title} | ${data.certification.title} | CertifyQuiz`;

  const description =
    data.topic.seoDescription ||
    data.topic.description ||
    "Esercitati su questo argomento di certificazione su CertifyQuiz.";

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com";

  const pageUrl = `${siteUrl}/it/certificazioni/${slug}/${topicSlug}`;

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
    `${data.certification.title} Domande di allenamento gratuite`
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

export default async function TopicPageIt({
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
    lang: "it",
  });

  if (!data) return notFound();

  const labels = getLabels();

  const quizHref = `/it/quiz/topic/${data.topic.id}`;
  const reviewHref = `/it/certificazioni/${slug}/${topicSlug}/ripasso`;

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-10 pb-28 md:pb-10">
        <Link
          href={`/it/certificazioni/${slug}`}
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
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href={reviewHref}
                className="inline-flex items-center justify-center rounded-full border border-blue-200 bg-blue-50 px-6 py-3 font-semibold text-blue-700 shadow-sm transition hover:bg-blue-100"
              >
                {labels.quickReview}
              </Link>

              <Link
                href={quizHref}
                className="inline-flex items-center justify-center bg-yellow-400 hover:bg-yellow-300 px-6 py-3 rounded-full font-semibold text-slate-900 shadow-sm"
              >
                {labels.startQuiz}
              </Link>
            </div>

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
            lang="it"
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

          <p className="text-slate-700 leading-7 mt-4">{labels.whyText4}</p>
        </section>

        {data.topic.content && (
          <section className="bg-white border rounded-2xl p-6 mb-8">
            <TopicContent
              content={data.topic.content}
              quizRoute={quizHref}
              reviewRoute={reviewHref}
              lang="it"
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
                href={`/it/certificazioni/${slug}/${t.slug}`}
                className="block p-5 border rounded-2xl hover:bg-slate-50 transition"
              >
                <div className="font-semibold text-slate-900">{t.title}</div>
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

          <div className="grid grid-cols-2 gap-2">
            <Link
              href={reviewHref}
              className="flex items-center justify-center w-full rounded-full border border-blue-200 bg-blue-50 px-3 py-3 text-sm font-semibold text-blue-700"
            >
              {labels.quickReviewShort}
            </Link>

            <Link
              href={quizHref}
              className="flex items-center justify-center w-full bg-yellow-400 hover:bg-yellow-300 px-3 py-3 rounded-full text-sm font-semibold text-slate-900"
            >
              {labels.quizShort}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}