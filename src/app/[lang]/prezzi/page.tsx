import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { withLang } from "@/lib/i18n";
import StructuredData from "@/components/StructuredData";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com").replace(
  /\/+$/,
  ""
);

const ogLocale: Record<Locale, string> = {
  it: "it_IT",
  en: "en_US",
  fr: "fr_FR",
  es: "es_ES",
};

const labels = {
  title: {
    it: "Premium & acquisti singoli | CertifyQuiz",
    en: "Premium & one-time purchases | CertifyQuiz",
    fr: "Premium & achats à l’unité | CertifyQuiz",
    es: "Premium y compras únicas | CertifyQuiz",
  },
  h1: {
    it: "Come funziona l’accesso Premium",
    en: "How Premium access works",
    fr: "Comment fonctionne l’accès Premium",
    es: "Cómo funciona el acceso Premium",
  },
  subtitle: {
    it: "Scegli se abbonarti o sbloccare solo ciò che ti serve.",
    en: "Choose between a subscription or unlocking only what you need.",
    fr: "Choisissez un abonnement ou débloquez seulement ce dont vous avez besoin.",
    es: "Elige entre suscripción o desbloquear solo lo que necesitas.",
  },
} as const;

function L(map: Record<Locale, string>, lang: Locale): string {
  return map[lang] ?? map.it;
}

export async function generateMetadata(
  props: { params: Promise<{ lang: Locale }> }
): Promise<Metadata> {
  const { lang } = await props.params;

  const title = L(labels.title, lang);
  const description =
    lang === "it"
      ? "Scopri la differenza tra abbonamento Premium e acquisti singoli su CertifyQuiz: sblocca spiegazioni, quiz completi e badge ufficiali nel modo che preferisci."
      : lang === "en"
      ? "Learn the difference between Premium subscription and one-time purchases on CertifyQuiz: unlock explanations, full quizzes and official badges the way you prefer."
      : lang === "fr"
      ? "Découvrez la différence entre l’abonnement Premium et les achats à l’unité sur CertifyQuiz : débloquez explications, quiz complets et badges officiels comme vous le souhaitez."
      : "Descubre la diferencia entre suscripción Premium y compras únicas en CertifyQuiz: desbloquea explicaciones, cuestionarios completos e insignias oficiales como prefieras.";

  const canonical = `${SITE}/${lang}/prezzi`;

  return {
    metadataBase: new URL(SITE),
    title,
    description,
    alternates: {
      canonical,
      languages: {
        it: `${SITE}/it/prezzi`,
        en: `${SITE}/en/prezzi`,
        fr: `${SITE}/fr/prezzi`,
        es: `${SITE}/es/prezzi`,
      },
    },
    openGraph: {
      url: canonical,
      title,
      description,
      siteName: "CertifyQuiz",
      locale: ogLocale[lang],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: "@CertifyQuiz",
    },
    robots: { index: true, follow: true },
  };
}

export default async function PremiumPage(
  props: { params: Promise<{ lang: Locale }> }
) {
  const { lang } = await props.params;

  // FAQ (testo base, semplice ma SEO-friendly)
  const faq = (() => {
    if (lang === "it") {
      return [
        {
          q: "Qual è la differenza tra Premium e acquisto singolo?",
          a: "Con Premium hai accesso a più certificazioni e a tutte le spiegazioni incluse nel piano. Con l’acquisto singolo sblocchi solo una certificazione, un argomento o un pacchetto specifico, senza abbonamento.",
        },
        {
          q: "Posso iniziare con un acquisto singolo e poi passare a Premium?",
          a: "Sì, in futuro potrai passare a un abbonamento Premium anche se hai già sbloccato certificazioni singole.",
        },
        {
          q: "Per quanto tempo rimane valido un acquisto singolo?",
          a: "L’acquisto singolo rimane valido finché la relativa certificazione è disponibile su CertifyQuiz.",
        },
      ];
    }
    if (lang === "en") {
      return [
        {
          q: "What is the difference between Premium and a one-time purchase?",
          a: "With Premium you get access to multiple certifications and all explanations included in the plan. With a one-time purchase you only unlock a specific certification, topic or bundle, with no subscription.",
        },
        {
          q: "Can I start with a one-time purchase and upgrade to Premium later?",
          a: "Yes, in the future you will be able to upgrade to a Premium subscription even if you already unlocked single certifications.",
        },
        {
          q: "How long does a one-time purchase remain valid?",
          a: "Your one-time purchase remains valid as long as the related certification is available on CertifyQuiz.",
        },
      ];
    }
    if (lang === "fr") {
      return [
        {
          q: "Quelle est la différence entre Premium et un achat à l’unité ?",
          a: "Avec Premium, vous avez accès à plusieurs certifications et à toutes les explications incluses dans l’abonnement. Avec un achat à l’unité, vous débloquez seulement une certification, un sujet ou un pack spécifique, sans abonnement.",
        },
        {
          q: "Puis-je commencer par un achat à l’unité puis passer à Premium ?",
          a: "Oui, vous pourrez passer à un abonnement Premium même si vous avez déjà débloqué des certifications individuelles.",
        },
        {
          q: "Combien de temps un achat à l’unité reste-t-il valide ?",
          a: "Votre achat à l’unité reste valide tant que la certification correspondante est disponible sur CertifyQuiz.",
        },
      ];
    }
    // es
    return [
      {
        q: "¿Cuál es la diferencia entre Premium y una compra única?",
        a: "Con Premium tienes acceso a varias certificaciones y a todas las explicaciones incluidas en el plan. Con una compra única solo desbloqueas una certificación, tema o paquete específico, sin suscripción.",
      },
      {
        q: "¿Puedo empezar con una compra única y luego pasar a Premium?",
        a: "Sí, en el futuro podrás pasar a una suscripción Premium incluso si ya has desbloqueado certificaciones individuales.",
      },
      {
        q: "¿Durante cuánto tiempo es válida una compra única?",
        a: "Tu compra única sigue siendo válida mientras la certificación correspondiente esté disponible en CertifyQuiz.",
      },
    ];
  })();

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  } as const;

  return (
    <>
      <StructuredData id="ld-premium-faq" data={faqLd} />

      <main id="main" className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-slate-900">
            {L(labels.h1, lang)}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {L(labels.subtitle, lang)}
          </p>
        </header>

        {/* Sezione 1: Abbonamento Premium */}
        <section className="mb-8 rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="mb-2 text-xl font-bold text-slate-900">
            {lang === "it"
              ? "Abbonamento Premium"
              : lang === "en"
              ? "Premium subscription"
              : lang === "fr"
              ? "Abonnement Premium"
              : "Suscripción Premium"}
          </h2>
          <p className="mb-3 text-sm text-slate-700">
            {lang === "it"
              ? "L’abbonamento Premium ti dà accesso illimitato alle spiegazioni complete, a tutti i quiz inclusi nel piano e a funzionalità extra come statistiche avanzate e badge ufficiali."
              : lang === "en"
              ? "The Premium subscription gives you unlimited access to full explanations, all quizzes included in the plan and extra features such as advanced stats and official badges."
              : lang === "fr"
              ? "L’abonnement Premium vous donne un accès illimité aux explications complètes, à tous les quiz inclus dans l’offre et à des fonctionnalités avancées comme les statistiques détaillées et les badges officiels."
              : "La suscripción Premium te da acceso ilimitado a explicaciones completas, a todos los cuestionarios incluidos en el plan y a funciones avanzadas como estadísticas detalladas e insignias oficiales."}
          </p>
          <ul className="mb-4 list-disc space-y-1 pl-5 text-sm text-slate-700">
            <li>
              {lang === "it"
                ? "Ideale se stai preparando più certificazioni nello stesso periodo."
                : lang === "en"
                ? "Ideal if you are preparing multiple certifications at the same time."
                : lang === "fr"
                ? "Idéal si vous préparez plusieurs certifications en même temps."
                : "Ideal si estás preparando varias certificaciones al mismo tiempo."}
            </li>
            <li>
              {lang === "it"
                ? "Accesso automatico ai nuovi quiz aggiunti alle certificazioni incluse."
                : lang === "en"
                ? "Automatic access to new quizzes added to the included certifications."
                : lang === "fr"
                ? "Accès automatique aux nouveaux quiz ajoutés aux certifications incluses."
                : "Acceso automático a los nuevos cuestionarios añadidos a las certificaciones incluidas."}
            </li>
          </ul>
          <p className="text-xs text-slate-500">
            {lang === "it"
              ? "I prezzi definitivi verranno pubblicati qui prima del lancio ufficiale."
              : lang === "en"
              ? "Final pricing will be published here before the official launch."
              : lang === "fr"
              ? "Les tarifs définitifs seront publiés ici avant le lancement officiel."
              : "Los precios definitivos se publicarán aquí antes del lanzamiento oficial."}
          </p>
        </section>

        {/* Sezione 2: Acquisti singoli */}
        <section className="mb-8 rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="mb-2 text-xl font-bold text-slate-900">
            {lang === "it"
              ? "Acquisti singoli"
              : lang === "en"
              ? "One-time purchases"
              : lang === "fr"
              ? "Achats à l’unité"
              : "Compras únicas"}
          </h2>
          <p className="mb-3 text-sm text-slate-700">
            {lang === "it"
              ? "Se preferisci, puoi sbloccare solo una singola certificazione, un singolo argomento o un pacchetto tematico, senza abbonarti."
              : lang === "en"
              ? "If you prefer, you can unlock just a single certification, a single topic or a themed bundle, without subscribing."
              : lang === "fr"
              ? "Si vous préférez, vous pouvez débloquer uniquement une certification, un sujet ou un pack thématique, sans abonnement."
              : "Si lo prefieres, puedes desbloquear solo una certificación, un tema o un paquete temático, sin suscripción."}
          </p>
          <ul className="mb-4 list-disc space-y-1 pl-5 text-sm text-slate-700">
            <li>
              {lang === "it"
                ? "Paghi una volta sola e mantieni l’accesso finché l’esame resta disponibile su CertifyQuiz."
                : lang === "en"
                ? "You pay once and keep access as long as the exam is available on CertifyQuiz."
                : lang === "fr"
                ? "Vous payez une seule fois et gardez l’accès tant que l’examen reste disponible sur CertifyQuiz."
                : "Pagas una sola vez y mantienes el acceso mientras el examen siga disponible en CertifyQuiz."}
            </li>
            <li>
              {lang === "it"
                ? "Perfetto se ti serve solo una certificazione specifica o un singolo argomento."
                : lang === "en"
                ? "Perfect if you only need a specific certification or a single topic."
                : lang === "fr"
                ? "Parfait si vous avez seulement besoin d’une certification ou d’un sujet précis."
                : "Perfecto si solo necesitas una certificación específica o un único tema."}
            </li>
          </ul>
        </section>

        {/* Sezione 3: Quale scegliere? */}
        <section className="mb-10 rounded-2xl border bg-slate-50 p-5">
          <h2 className="mb-2 text-lg font-bold text-slate-900">
            {lang === "it"
              ? "Qual è la soluzione giusta per te?"
              : lang === "en"
              ? "Which option is right for you?"
              : lang === "fr"
              ? "Quelle option est faite pour vous ?"
              : "¿Qué opción es mejor para ti?"}
          </h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
            <li>
              {lang === "it"
                ? "Scegli l’abbonamento Premium se stai preparando più certificazioni o vuoi avere sempre nuovi quiz."
                : lang === "en"
                ? "Choose the Premium subscription if you are preparing multiple certifications or want continuous new quizzes."
                : lang === "fr"
                ? "Choisissez l’abonnement Premium si vous préparez plusieurs certifications ou souhaitez de nouveaux quiz en continu."
                : "Elige la suscripción Premium si estás preparando varias certificaciones o quieres tener siempre nuevos cuestionarios."}
            </li>
            <li>
              {lang === "it"
                ? "Scegli l’acquisto singolo se ti serve solo una certificazione specifica o vuoi testare CertifyQuiz su un singolo esame."
                : lang === "en"
                ? "Choose a one-time purchase if you only need one specific certification or want to test CertifyQuiz on a single exam."
                : lang === "fr"
                ? "Choisissez l’achat à l’unité si vous avez seulement besoin d’une certification spécifique ou souhaitez tester CertifyQuiz sur un seul examen."
                : "Elige una compra única si solo necesitas una certificación específica o quieres probar CertifyQuiz en un único examen."}
            </li>
          </ul>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="mb-3 text-lg font-bold text-slate-900">
            {lang === "it"
              ? "Domande frequenti"
              : lang === "en"
              ? "Frequently Asked Questions"
              : lang === "fr"
              ? "Questions fréquentes"
              : "Preguntas frecuentes"}
          </h2>
          <div className="space-y-3">
            {faq.map((item, idx) => (
              <details
                key={idx}
                className="rounded-xl border bg-white p-3 text-sm shadow-sm"
              >
                <summary className="cursor-pointer font-semibold text-slate-900">
                  {item.q}
                </summary>
                <p className="mt-1 text-slate-700">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA finale */}
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href={withLang(lang, "/quiz-home")}
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-blue-700"
          >
            {lang === "it"
              ? "Vai ai quiz"
              : lang === "en"
              ? "Go to quizzes"
              : lang === "fr"
              ? "Accéder aux quiz"
              : "Ir a los cuestionarios"}
          </a>
         <a
  href={withLang(lang, "/register")}
  className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-white"
>
  {lang === "it"
    ? "Crea un account gratuito"
    : lang === "en"
    ? "Create a free account"
    : lang === "fr"
    ? "Créer un compte gratuit"
    : "Crear una cuenta gratuita"}
</a>

        </div>
      </main>
    </>
  );
}
