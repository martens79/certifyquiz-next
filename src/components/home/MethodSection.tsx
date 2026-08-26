import type { Locale } from "@/lib/paths";

type Props = { lang: Locale };

type Step = { title: string; body: string };

const COPY: Record<Locale, { heading: string; steps: Step[] }> = {
  it: {
    heading: "Da dove sei alla certificazione",
    steps: [
      {
        title: "Misura",
        body: "Un breve assessment mostra il tuo punto di partenza reale.",
      },
      {
        title: "Colma le lacune",
        body: "Esercitati su ciò che hai sbagliato, con una spiegazione su ogni errore.",
      },
      {
        title: "Consolida",
        body: "Ripassi, mappe concettuali, guide e laboratori interattivi trasformano le risposte in comprensione.",
      },
      {
        title: "Verifica di essere pronto",
        body: "Scenari d'esame e simulazioni complete ti dicono quando è il momento di prenotare.",
      },
    ],
  },
  en: {
    heading: "From where you are to certified",
    steps: [
      {
        title: "Measure",
        body: "A short assessment shows your real starting point.",
      },
      {
        title: "Close the gaps",
        body: "Practice on what you got wrong, with an explanation on every mistake.",
      },
      {
        title: "Consolidate",
        body: "Reviews, concept maps, guides and interactive labs turn answers into understanding.",
      },
      {
        title: "Confirm you're ready",
        body: "Exam scenarios and full simulations tell you when it's time to book.",
      },
    ],
  },
  fr: {
    heading: "De votre niveau actuel à la certification",
    steps: [
      {
        title: "Mesurer",
        body: "Une courte évaluation révèle votre point de départ réel.",
      },
      {
        title: "Combler les lacunes",
        body: "Entraînez-vous sur ce que vous avez raté, avec une explication à chaque erreur.",
      },
      {
        title: "Consolider",
        body: "Fiches de révision, cartes conceptuelles, guides et labs interactifs transforment les réponses en compréhension.",
      },
      {
        title: "Vérifiez que vous êtes prêt",
        body: "Scénarios d'examen et simulations complètes vous indiquent quand réserver.",
      },
    ],
  },
  es: {
    heading: "De donde estás a la certificación",
    steps: [
      {
        title: "Mide",
        body: "Una evaluación breve muestra tu punto de partida real.",
      },
      {
        title: "Cierra las brechas",
        body: "Practica lo que fallaste, con una explicación en cada error.",
      },
      {
        title: "Consolida",
        body: "Repasos, mapas conceptuales, guías y laboratorios interactivos convierten respuestas en comprensión.",
      },
      {
        title: "Comprueba que estás listo",
        body: "Escenarios de examen y simulacros completos te dicen cuándo es momento de reservar.",
      },
    ],
  },
};

export default function MethodSection({ lang }: Props) {
  const t = COPY[lang];

  return (
    <section className="mx-auto mt-8 max-w-6xl px-4 md:mt-10">
      <div className="mx-auto mb-6 max-w-2xl text-center">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
          {t.heading}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {t.steps.map((step, index) => (
          <div
            key={step.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-extrabold text-white">
              {index + 1}
            </div>
            <h3 className="font-bold text-slate-900">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {step.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
