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
    text: "Ricevi domande gratuite, spiegazioni chiare e consigli utili per prepararti meglio alla certificazione.",
    selected: "Percorso selezionato",
    topic: "Argomento",
    privacy: "Niente spam. Solo domande, spiegazioni e consigli utili.",
    back: "← Torna a CertifyQuiz",
  },
  en: {
    badge: "Free test",
    title: "Check your IT certification level in 2 minutes",
    text: "Get free quiz questions, clear explanations and useful study tips for your certification path.",
    selected: "Selected path",
    topic: "Topic",
    privacy: "No spam. Just useful practice questions, explanations and preparation tips.",
    back: "← Back to CertifyQuiz",
  },
  fr: {
    badge: "Test gratuit",
    title: "Évaluez votre niveau en 2 minutes",
    text: "Recevez des questions gratuites, des explications claires et des conseils utiles pour préparer votre certification.",
    selected: "Parcours sélectionné",
    topic: "Sujet",
    privacy: "Pas de spam. Seulement des questions, des explications et des conseils utiles.",
    back: "← Retour à CertifyQuiz",
  },
  es: {
    badge: "Test gratuito",
    title: "Comprueba tu nivel en 2 minutos",
    text: "Recibe preguntas gratuitas, explicaciones claras y consejos útiles para preparar tu certificación.",
    selected: "Ruta seleccionada",
    topic: "Tema",
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

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-600">
            {t.selected}: <strong className="text-slate-900">{cert}</strong>
            {topic !== "general" && (
              <>
                {" "}
                · {t.topic}: <strong className="text-slate-900">{topic}</strong>
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