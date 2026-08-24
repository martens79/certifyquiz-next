import type { Metadata } from "next";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getTopicReviewPage, getCertTopicReviews, type Locale, type TopicReviewPage } from "@/lib/data";
import { reviewsCertPath, roadmapPath, topicReviewPath, toHreflang } from "@/lib/paths";
import { evaluateReviewClusterIndexability } from "@/lib/review-indexability";
import StructuredData from "@/components/StructuredData";
import ReviewPremiumContent from "@/components/reviews/ReviewPremiumContent";
import ReviewModuleShell from "@/components/reviews/module/ReviewModuleShell";

type Props = {
  lang: Locale;
  slug: string;
  topicSlug: string;
};

const labels = {
  it: {
    badge: "Ripasso rapido",
    comingTitle: "Ripasso rapido in arrivo",
    comingText:
      "Stiamo preparando una scheda di ripasso teorico per questo topic. Nel frattempo puoi tornare alla pagina del topic.",
    certification: "Certificazione",
    topic: "Topic",
    startQuiz: "🚀 Vai al quiz",
    backToTopic: "← Torna al topic",
    nextReview: "Ripasso successivo",
    backToReviewsIndex: "Torna all'indice ripassi",
    finalTitle: "Ora metti alla prova quello che hai ripassato",
    finalText:
      "Dopo il ripasso, passa al quiz per verificare se hai davvero capito i concetti principali.",
    roadmap: "Continua con la roadmap correlata",
    comingMetaTitle: "Ripasso rapido in arrivo | CertifyQuiz",
    comingMetaDescription:
      "Questa scheda di ripasso rapido sarà disponibile prossimamente su CertifyQuiz.",
  },
  en: {
    badge: "Quick review",
    comingTitle: "Quick review coming soon",
    comingText:
      "We are preparing a theory review sheet for this topic. In the meantime, you can return to the topic page.",
    certification: "Certification",
    topic: "Topic",
    startQuiz: "🚀 Start quiz",
    backToTopic: "← Back to topic",
    nextReview: "Next review",
    backToReviewsIndex: "Back to reviews index",
    finalTitle: "Now test what you reviewed",
    finalText:
      "After the review, start the quiz to check whether you really understand the key concepts.",
    roadmap: "Continue with the related roadmap",
    comingMetaTitle: "Quick review coming soon | CertifyQuiz",
    comingMetaDescription:
      "This quick review page will be available soon on CertifyQuiz.",
  },
  fr: {
    badge: "Révision rapide",
    comingTitle: "Révision rapide bientôt disponible",
    comingText:
      "Nous préparons une fiche de révision théorique pour ce sujet. En attendant, vous pouvez revenir à la page du sujet.",
    certification: "Certification",
    topic: "Sujet",
    startQuiz: "🚀 Commencer le quiz",
    backToTopic: "← Retour au sujet",
    nextReview: "Révision suivante",
    backToReviewsIndex: "Retour à l'index des révisions",
    finalTitle: "Testez maintenant ce que vous avez révisé",
    finalText:
      "Après la révision, passez au quiz pour vérifier si vous maîtrisez vraiment les concepts principaux.",
    roadmap: "Continuer avec la roadmap associée",
    comingMetaTitle: "Révision rapide bientôt disponible | CertifyQuiz",
    comingMetaDescription:
      "Cette fiche de révision rapide sera bientôt disponible sur CertifyQuiz.",
  },
  es: {
    badge: "Repaso rápido",
    comingTitle: "Repaso rápido próximamente",
    comingText:
      "Estamos preparando una ficha de repaso teórico para este tema. Mientras tanto, puedes volver a la página del tema.",
    certification: "Certificación",
    topic: "Tema",
    startQuiz: "🚀 Ir al quiz",
    backToTopic: "← Volver al tema",
    nextReview: "Repaso siguiente",
    backToReviewsIndex: "Volver al índice de repasos",
    finalTitle: "Ahora pon a prueba lo que has repasado",
    finalText:
      "Después del repaso, pasa al quiz para comprobar si realmente has entendido los conceptos principales.",
    roadmap: "Continúa con la roadmap relacionada",
    comingMetaTitle: "Repaso rápido próximamente | CertifyQuiz",
    comingMetaDescription:
      "Esta ficha de repaso rápido estará disponible próximamente en CertifyQuiz.",
  },
};

const locales: readonly Locale[] = ["it", "en", "fr", "es"];
const RAW_SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com";
const SITE = RAW_SITE.replace(/\/+$/, "");

function absoluteUrl(path: string) {
  return `${SITE}${path.startsWith("/") ? path : `/${path}`}`;
}

function relatedRoadmap(certSlug: string): "networking" | "cybersecurity" | null {
  if (["ccna", "cisco-ccst-networking", "comptia-network-plus", "ccnp-enterprise", "networking-foundations"].includes(certSlug)) return "networking";
  if (["isc2-cc", "cisco-ccst-cybersecurity", "security-plus", "ceh", "cissp", "cybersecurity-foundations"].includes(certSlug)) return "cybersecurity";
  return null;
}

function getCertificationPath(lang: Locale, slug: string) {
  if (lang === "en") return `/certifications/${slug}`;
  if (lang === "fr") return `/fr/certifications/${slug}`;
  if (lang === "es") return `/es/certificaciones/${slug}`;
  return `/it/certificazioni/${slug}`;
}

function getTopicPath(lang: Locale, slug: string, topicSlug: string) {
  return `${getCertificationPath(lang, slug)}/${topicSlug}`;
}

function getQuizPath(lang: Locale, topicId: number) {
  return lang === "en"
    ? `/quiz/topic/${topicId}`
    : `/${lang}/quiz/topic/${topicId}`;
}

async function getReviewLocaleCluster(slug:string, topicId:number):Promise<Array<{locale:Locale;href:string;review:TopicReviewPage}>> {
  const localized=await Promise.all(locales.map(async locale=>{
    const {items}=await getCertTopicReviews(slug,locale);
    const item=items.find(candidate=>candidate.topicId===topicId);
    if(!item)return null;
    const review=await getTopicReviewPage({certSlug:slug,topicSlug:item.topicSlug,lang:locale});
    return review?{locale,href:item.href,review}:null;
  }));
  return localized.filter((item):item is {locale:Locale;href:string;review:TopicReviewPage}=>!!item);
}

export async function generateTopicReviewMetadata({
  lang,
  slug,
  topicSlug,
}: Props): Promise<Metadata> {
  const t = labels[lang];

  const review = await getTopicReviewPage({
    certSlug: slug,
    topicSlug,
    lang,
  });

  if (!review || !review.content) {
    return {
      title: t.comingMetaTitle,
      description: t.comingMetaDescription,
      robots: {
        index: false,
        follow: true,
      },
      alternates: {
        canonical: absoluteUrl(topicReviewPath(lang, slug, topicSlug)),
      },
    };
  }

  const localizedReviews=await getReviewLocaleCluster(slug,review.topicId);
  const indexability = evaluateReviewClusterIndexability(localizedReviews.map(item=>item.review));
  const canonical = absoluteUrl(topicReviewPath(lang, slug, topicSlug));
  const languages: Record<string, string> = {};

  if (indexability.indexable) {
    for (const localized of localizedReviews) {
      languages[toHreflang(localized.locale)] = absoluteUrl(localized.href);
    }
    if (languages["en-US"]) languages["x-default"] = languages["en-US"];
  }

  return {
    title:
      review.metaTitle ||
      review.title ||
      `${review.topicTitle} | CertifyQuiz`,
    description:
      review.metaDescription || review.intro || t.comingMetaDescription,
    robots: {
      index: indexability.indexable,
      follow: true,
    },
    alternates: {
      canonical,
      languages:
        indexability.indexable && Object.keys(languages).length > 0
          ? languages
          : undefined,
    },
  };
}

export default async function TopicReviewPageShell({
  lang,
  slug,
  topicSlug,
}: Props) {
  const t = labels[lang];

  const review = await getTopicReviewPage({
    certSlug: slug,
    topicSlug,
    lang,
  });

  const certPath = getCertificationPath(lang, slug);
  const topicPath = getTopicPath(lang, slug, topicSlug);

  if (!review || !review.content) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <nav className="mb-6 text-sm text-slate-500">
          <Link href={certPath} className="hover:text-blue-700">
            {t.certification}
          </Link>
          <span className="mx-2">/</span>
          <Link href={topicPath} className="hover:text-blue-700">
            {t.topic}
          </Link>
        </nav>

        <section className="rounded-3xl border border-blue-100 bg-blue-50 p-6 shadow-sm md:p-8">
          <p className="mb-3 inline-flex rounded-full bg-white px-3 py-1 text-sm font-semibold text-blue-700">
            {t.badge}
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-blue-950 md:text-4xl">
            {t.comingTitle}
          </h1>

          <p className="mt-4 text-lg leading-8 text-blue-900">
            {t.comingText}
          </p>

          <div className="mt-6">
            <Link
              href={topicPath}
              className="inline-flex items-center justify-center rounded-xl border border-blue-200 bg-white px-5 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
            >
              {t.backToTopic}
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const quizPath = getQuizPath(lang, review.topicId);
  const roadmap = relatedRoadmap(slug);
  const localizedReviews=await getReviewLocaleCluster(slug,review.topicId);
  const indexability = evaluateReviewClusterIndexability(localizedReviews.map(item=>item.review));
  const reviewUrl = absoluteUrl(topicReviewPath(lang, slug, topicSlug));
  const reviewLd = indexability.indexable
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: review.title || review.topicTitle,
        description: review.metaDescription || review.intro || undefined,
        mainEntityOfPage: reviewUrl,
        inLanguage: lang,
        author: { "@type": "Organization", name: "CertifyQuiz" },
        publisher: { "@type": "Organization", name: "CertifyQuiz" },
      }
    : null;
  const breadcrumbLd = indexability.indexable
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: review.certificationName, item: absoluteUrl(certPath) },
          { "@type": "ListItem", position: 2, name: review.topicTitle, item: absoluteUrl(topicPath) },
          { "@type": "ListItem", position: 3, name: review.title || review.topicTitle, item: reviewUrl },
        ],
      }
    : null;

  const { items: certReviews } = await getCertTopicReviews(slug, lang);
  const currentIndex = certReviews.findIndex(
    (item) => item.topicId === review.topicId
  );
  const nextItem =
    currentIndex >= 0 && currentIndex < certReviews.length - 1
      ? certReviews[currentIndex + 1]
      : null;
  const nextReviewPath = nextItem ? nextItem.href : reviewsCertPath(lang, slug);
  const nextReviewLabel = nextItem ? t.nextReview : t.backToReviewsIndex;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      {reviewLd && <StructuredData id={`ld-review-${review.id}`} data={reviewLd} />}
      {breadcrumbLd && <StructuredData id={`ld-review-breadcrumb-${review.id}`} data={breadcrumbLd} />}
      <nav className="mb-6 text-sm text-slate-500">
        <Link href={certPath} className="hover:text-blue-700">
          {review.certificationName}
        </Link>
        <span className="mx-2">/</span>
        <Link href={topicPath} className="hover:text-blue-700">
          {review.topicTitle}
        </Link>
      </nav>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <p className="mb-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
          {t.badge}
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
          {review.title || review.topicTitle}
        </h1>

        {review.intro && (
          <p className="mt-4 text-lg leading-8 text-slate-700">
            {review.intro}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href={quizPath}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
          >
            {t.startQuiz}
          </Link>

          <Link
            href={topicPath}
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            {t.backToTopic}
          </Link>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        {review.locked ? (
          <div className="prose prose-slate max-w-none prose-headings:scroll-mt-24 prose-a:text-blue-700">
            <ReviewPremiumContent
              lang={lang}
              certSlug={slug}
              topicSlug={topicSlug}
              reviewId={review.id}
              preview={review.content || ""}
              structureOutline={review.structure}
            />
          </div>
        ) : review.structure ? (
          <ReviewModuleShell lang={lang} review={review} certSlug={slug} />
        ) : (
          <div className="prose prose-slate max-w-none prose-headings:scroll-mt-24 prose-a:text-blue-700">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{review.content}</ReactMarkdown>
          </div>
        )}
      </section>

      {!review.locked && review.faq && (
        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="prose prose-slate max-w-none prose-a:text-blue-700">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {review.faq}
            </ReactMarkdown>
          </div>
        </section>
      )}

      <section className="mt-8 rounded-3xl border border-blue-100 bg-blue-50 p-6">
        <h2 className="text-xl font-bold text-blue-950">{t.finalTitle}</h2>

        <p className="mt-2 text-sm leading-6 text-blue-900">
          {t.finalText}
        </p>

        <div className="mt-4 flex flex-wrap gap-4">
          <Link
            href={quizPath}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            {t.startQuiz}
          </Link>
          {roadmap && (
            <Link href={roadmapPath(lang, roadmap)} className="inline-flex items-center font-bold text-blue-800 hover:underline">
              {t.roadmap} →
            </Link>
          )}
        </div>
      </section>

      <div className="mt-6 text-center">
        <Link
          href={nextReviewPath}
          className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
        >
          {nextReviewLabel} →
        </Link>
      </div>
    </main>
  );
}
