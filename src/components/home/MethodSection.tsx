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
    <section className="mx-auto mt-6 max-w-6xl px-4 sm:mt-8 md:mt-10">
      <div className="mx-auto mb-3 max-w-2xl text-center sm:mb-6">
        <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl md:text-3xl">
          {t.heading}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {t.steps.map((step, index) => (
          <div
            key={step.title}
            className="flex gap-3 border-b border-slate-200 py-3 last:border-b-0 sm:block sm:rounded-2xl sm:border sm:bg-white sm:p-5 sm:shadow-sm sm:last:border-b"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-extrabold text-white sm:mb-2 sm:h-8 sm:w-8">
              {index + 1}
            </div>
            <div>
              <h3 className="font-bold text-slate-900">{step.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-600 sm:mt-2">
                {step.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
