import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getTopicPageData } from "@/lib/server/topic-page";

type Lang = "it" | "en" | "fr" | "es";

function getLabels(lang: Lang) {
  return {
    back: {
      it: "← Torna alla certificazione",
      en: "← Back to certification",
      fr: "← Retour à la certification",
      es: "← Volver a la certificación",
    }[lang],

    startQuiz: {
      it: "🚀 Inizia quiz",
      en: "🚀 Start quiz",
      fr: "🚀 Commencer le quiz",
      es: "🚀 Empezar quiz",
    }[lang],

    availableQuestions: {
      it: "Domande disponibili",
      en: "Available questions",
      fr: "Questions disponibles",
      es: "Preguntas disponibles",
    }[lang],

    relatedTopics: {
      it: "Argomenti correlati",
      en: "Related topics",
      fr: "Sujets liés",
      es: "Temas relacionados",
    }[lang],

    whatYouWillLearn: {
      it: "Cosa imparerai in questo topic",
      en: "What you will learn in this topic",
      fr: "Ce que vous apprendrez dans ce sujet",
      es: "Qué aprenderás en este tema",
    }[lang],

    whyItMatters: {
      it: "Perché questo argomento è importante",
      en: "Why this topic matters",
      fr: "Pourquoi ce sujet est important",
      es: "Por qué este tema es importante",
    }[lang],

    practiceIntro: {
      it: "Questo argomento fa parte del percorso",
      en: "This topic is part of the",
      fr: "Ce sujet fait partie du parcours",
      es: "Este tema forma parte del recorrido",
    }[lang],

    learnText1: {
      it: "In questa pagina puoi capire meglio cosa copre questo argomento, quali concetti vengono richiesti e perché è utile esercitarti con un quiz dedicato prima di passare all’esame completo o ai quiz misti.",
      en: "On this page you can better understand what this topic covers, which concepts are most important, and why practicing with a dedicated quiz is useful before moving on to a full exam or mixed quizzes.",
      fr: "Sur cette page, vous pouvez mieux comprendre ce que couvre ce sujet, quels concepts sont les plus importants et pourquoi il est utile de s’exercer avec un quiz dédié avant de passer à l’examen complet ou aux quiz mixtes.",
      es: "En esta página puedes comprender mejor qué cubre este tema, qué conceptos son más importantes y por qué es útil practicar con un cuestionario específico antes de pasar al examen completo o a cuestionarios mixtos.",
    }[lang],

    learnText2: {
      it: "Il quiz su",
      en: "The quiz on",
      fr: "Le quiz sur",
      es: "El quiz sobre",
    }[lang],

    learnText3: {
      it: "ti aiuta a concentrarti su nozioni specifiche, definizioni, scenari pratici e concetti ricorrenti che possono comparire durante la preparazione alla certificazione.",
      en: "helps you focus on specific concepts, definitions, practical scenarios, and recurring ideas that may appear during certification preparation.",
      fr: "vous aide à vous concentrer sur des notions spécifiques, des définitions, des scénarios pratiques et des concepts récurrents qui peuvent apparaître pendant la préparation à la certification.",
      es: "te ayuda a centrarte en conceptos específicos, definiciones, escenarios prácticos e ideas recurrentes que pueden aparecer durante la preparación para la certificación.",
    }[lang],

    whyText1: {
      it: "Studiare bene",
      en: "Studying",
      fr: "Bien étudier",
      es: "Estudiar bien",
    }[lang],

    whyText2: {
      it: "è importante perché questo argomento contribuisce alla comprensione generale della certificazione",
      en: "is important because this topic contributes to the overall understanding of the",
      fr: "est important, car ce sujet contribue à la compréhension globale de la certification",
      es: "es importante porque este tema contribuye a la comprensión general de la certificación",
    }[lang],

    whyText3: {
      it: "Una buona preparazione sui singoli topic rende più semplice affrontare sia le domande teoriche sia quelle applicative, migliorando la sicurezza e la rapidità nel rispondere.",
      en: "Good preparation on individual topics makes it easier to handle both theoretical and practical questions, improving confidence and speed when answering.",
      fr: "Une bonne préparation sur chaque sujet facilite la gestion des questions théoriques et pratiques, tout en améliorant la confiance et la rapidité de réponse.",
      es: "Una buena preparación en cada tema facilita afrontar tanto las preguntas teóricas como las prácticas, mejorando la seguridad y la rapidez al responder.",
    }[lang],

    whyText4: {
      it: "Allenarti topic per topic ti permette anche di individuare con precisione i tuoi punti deboli, ripassare meglio e costruire una preparazione più solida nel tempo.",
      en: "Training topic by topic also helps you identify weak areas more precisely, review more effectively, and build a stronger preparation over time.",
      fr: "S’entraîner sujet par sujet vous permet aussi d’identifier plus précisément vos points faibles, de mieux réviser et de construire une préparation plus solide dans le temps.",
      es: "Practicar tema por tema también te permite identificar con mayor precisión tus puntos débiles, repasar mejor y construir una preparación más sólida con el tiempo.",
    }[lang],

    contentTitle: {
      it: "Guida rapida",
      en: "Quick guide",
      fr: "Guide rapide",
      es: "Guía rápida",
    }[lang],

    faqTitle: {
      it: "Domande frequenti",
      en: "FAQ",
      fr: "FAQ",
      es: "Preguntas frecuentes",
    }[lang],
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    lang: Lang;
    slug: string;
    topicSlug: string;
  }>;
}): Promise<Metadata> {
  const { lang, slug, topicSlug } = await params;

  const data = await getTopicPageData({
    certSlug: slug,
    topicSlug,
    lang,
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
      canonical:
        lang === "en"
          ? `/certifications/${slug}/${topicSlug}`
          : `/${lang}/certificazioni/${slug}/${topicSlug}`,
    },
  };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{
    lang: Lang;
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

  const labels = getLabels(lang);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Link
        href={
          lang === "en"
            ? `/certifications/${slug}`
            : `/${lang}/certificazioni/${slug}`
        }
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
          href={
            lang === "en"
              ? `/quiz/topic/${data.topic.id}`
              : `/${lang}/quiz/topic/${data.topic.id}`
          }
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
          <h2 className="text-2xl font-semibold text-slate-900 mb-3">
            {labels.contentTitle}
          </h2>
          {data.topic.content && (
  <section className="bg-white border rounded-2xl p-6 mb-8">
    <h2 className="text-2xl font-semibold text-slate-900 mb-3">
      {labels.contentTitle}
    </h2>
    <div
      className="prose max-w-none text-slate-700"
      dangerouslySetInnerHTML={{ __html: data.topic.content }}
    />
  </section>
)}
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
              href={
                lang === "en"
                  ? `/certifications/${slug}/${t.slug}`
                  : `/${lang}/certificazioni/${slug}/${t.slug}`
              }
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