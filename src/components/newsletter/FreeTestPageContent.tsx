import Link from "next/link";
import FreeTestForm from "@/components/newsletter/FreeTestForm";

type Lang = "it" | "en" | "fr" | "es";

type Props = {
  lang: Lang;
  cert: string;
  topic: string;
  source: string;
  quizHref: string;
};

const COPY = {
  it: {
    badge: "Test gratuito",
    title: "Scopri il tuo livello in 2 minuti",
    text: "Fai un breve test gratuito e scopri subito quanto sei pronto per questa certificazione.",
    selected: "Percorso selezionato",
    topic: "Argomento",
    benefits: [
      "Solo 10 domande",
      "Circa 2 minuti",
      "Risultato immediato",
      "Consigli di studio personalizzati",
    ],
    privacy: "Niente spam. Solo domande, spiegazioni e consigli utili.",
    back: "← Torna a CertifyQuiz",
  },
  en: {
    badge: "Free test",
    title: "Check your level in 2 minutes",
    text: "Take a short free test and instantly see how ready you are for this certification.",
    selected: "Selected path",
    topic: "Topic",
    benefits: [
      "Only 10 questions",
      "About 2 minutes",
      "Instant result",
      "Personalized study tips",
    ],
    privacy: "No spam. Just useful practice questions, explanations and preparation tips.",
    back: "← Back to CertifyQuiz",
  },
  fr: {
    badge: "Test gratuit",
    title: "Évaluez votre niveau en 2 minutes",
    text: "Passez un court test gratuit et découvrez immédiatement votre niveau de préparation.",
    selected: "Parcours sélectionné",
    topic: "Sujet",
    benefits: [
      "Seulement 10 questions",
      "Environ 2 minutes",
      "Résultat immédiat",
      "Conseils d’étude personnalisés",
    ],
    privacy: "Pas de spam. Seulement des questions, des explications et des conseils utiles.",
    back: "← Retour à CertifyQuiz",
  },
  es: {
    badge: "Test gratuito",
    title: "Comprueba tu nivel en 2 minutos",
    text: "Haz un breve test gratuito y descubre al instante qué tan preparado estás para esta certificación.",
    selected: "Ruta seleccionada",
    topic: "Tema",
    benefits: [
      "Solo 10 preguntas",
      "Aproximadamente 2 minutos",
      "Resultado inmediato",
      "Consejos de estudio personalizados",
    ],
    privacy: "Sin spam. Solo preguntas, explicaciones y consejos útiles.",
    back: "← Volver a CertifyQuiz",
  },
} as const;

export default function FreeTestPageContent({
  lang,
  cert,
  topic,
  source,
  quizHref,
}: Props) {
  const t = COPY[lang];
  const homeHref = lang === "en" ? "/" : `/${lang}`;

  return (
    <main className="min-h-screen bg-blue-50 px-4 py-10">
      <section className="mx-auto max-w-3xl rounded-3xl border border-blue-100 bg-white p-6 shadow-xl md:p-10">
        <div className="mb-4 inline-flex rounded-full bg-blue-100 px-4 py-1 text-xs font-bold uppercase tracking-wide text-blue-700">
          {t.badge}
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
          {t.title}
        </h1>

        <p className="mt-4 text-base leading-relaxed text-slate-700 md:text-lg">
          {t.text}
        </p>

        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {t.benefits.map((item) => (
            <li
              key={item}
              className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-slate-800"
            >
              ✅ {item}
            </li>
          ))}
        </ul>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-600">
            {t.selected}: <strong className="text-slate-900">{cert}</strong>
            {topic !== "general" && (
              <>
                {" "}
                · {t.topic}:{" "}
                <strong className="text-slate-900">{topic}</strong>
              </>
            )}
          </p>
        </div>

        <FreeTestForm
          lang={lang}
          cert={cert}
          topic={topic}
          source={source}
          quizHref={quizHref}
        />

        <p className="mt-4 text-xs text-slate-500">{t.privacy}</p>

        <div className="mt-8 border-t pt-6">
          <Link
            href={homeHref}
            className="text-sm font-semibold text-blue-700 hover:underline"
          >
            {t.back}
          </Link>
        </div>
      </section>
    </main>
  );
}