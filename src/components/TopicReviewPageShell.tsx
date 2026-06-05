import type { Metadata } from "next";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getTopicReviewPage, type Locale } from "@/lib/data";

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
      "Stiamo preparando una scheda di ripasso teorico per questo topic. Nel frattempo puoi comunque allenarti con il quiz e tornare alla pagina del topic.",
    certification: "Certificazione",
    topic: "Topic",
    startQuiz: "🚀 Vai al quiz",
    backToTopic: "← Torna al topic",
    finalTitle: "Ora metti alla prova quello che hai ripassato",
    finalText:
      "Dopo il ripasso, passa al quiz per verificare se hai davvero capito i concetti principali.",
    comingMetaTitle: "Ripasso rapido in arrivo | CertifyQuiz",
    comingMetaDescription:
      "Questa scheda di ripasso rapido sarà disponibile prossimamente su CertifyQuiz.",
  },
  en: {
    badge: "Quick review",
    comingTitle: "Quick review coming soon",
    comingText:
      "We are preparing a theory review sheet for this topic. In the meantime, you can still practice with the quiz and return to the topic page.",
    certification: "Certification",
    topic: "Topic",
    startQuiz: "🚀 Start quiz",
    backToTopic: "← Back to topic",
    finalTitle: "Now test what you reviewed",
    finalText:
      "After the review, start the quiz to check whether you really understand the key concepts.",
    comingMetaTitle: "Quick review coming soon | CertifyQuiz",
    comingMetaDescription:
      "This quick review page will be available soon on CertifyQuiz.",
  },
  fr: {
    badge: "Révision rapide",
    comingTitle: "Révision rapide bientôt disponible",
    comingText:
      "Nous préparons une fiche de révision théorique pour ce sujet. En attendant, vous pouvez vous entraîner avec le quiz et revenir à la page du sujet.",
    certification: "Certification",
    topic: "Sujet",
    startQuiz: "🚀 Commencer le quiz",
    backToTopic: "← Retour au sujet",
    finalTitle: "Testez maintenant ce que vous avez révisé",
    finalText:
      "Après la révision, passez au quiz pour vérifier si vous maîtrisez vraiment les concepts principaux.",
    comingMetaTitle: "Révision rapide bientôt disponible | CertifyQuiz",
    comingMetaDescription:
      "Cette fiche de révision rapide sera bientôt disponible sur CertifyQuiz.",
  },
  es: {
    badge: "Repaso rápido",
    comingTitle: "Repaso rápido próximamente",
    comingText:
      "Estamos preparando una ficha de repaso teórico para este tema. Mientras tanto, puedes practicar con el quiz y volver a la página del tema.",
    certification: "Certificación",
    topic: "Tema",
    startQuiz: "🚀 Ir al quiz",
    backToTopic: "← Volver al tema",
    finalTitle: "Ahora pon a prueba lo que has repasado",
    finalText:
      "Después del repaso, pasa al quiz para comprobar si realmente has entendido los conceptos principales.",
    comingMetaTitle: "Repaso rápido próximamente | CertifyQuiz",
    comingMetaDescription:
      "Esta ficha de repaso rápido estará disponible próximamente en CertifyQuiz.",
  },
};

function getCertificationPath(lang: Locale, slug: string) {
  if (lang === "en") return `/certifications/${slug}`;
  if (lang === "fr") return `/fr/certifications/${slug}`;
  if (lang === "es") return `/es/certificaciones/${slug}`;
  return `/it/certificazioni/${slug}`;
}

function getTopicPath(lang: Locale, slug: string, topicSlug: string) {
  return `${getCertificationPath(lang, slug)}/${topicSlug}`;
}

function getQuizPath(lang: Locale, slug: string, topicSlug: string) {
  return `/${lang}/quiz/${slug}/${topicSlug}`;
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
    };
  }

  return {
    title:
      review.metaTitle ||
      review.title ||
      `${review.topicTitle} | CertifyQuiz`,
    description:
      review.metaDescription ||
      review.intro ||
      t.comingMetaDescription,
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
  const quizPath = getQuizPath(lang, slug, topicSlug);

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

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href={quizPath}
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
            >
              {t.startQuiz}
            </Link>

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

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
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
        <div className="prose prose-slate max-w-none prose-headings:scroll-mt-24 prose-a:text-blue-700">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {review.content}
          </ReactMarkdown>
        </div>
      </section>

      {review.faq && (
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

        <div className="mt-4">
          <Link
            href={quizPath}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            {t.startQuiz}
          </Link>
        </div>
      </section>
    </main>
  );
}