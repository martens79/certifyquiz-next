import { Locale } from "@/lib/i18n";

type Props = {
  lang: Locale;
};

const CONTENT = {
  it: {
    title: "Scenari di certificazione",
    p1: "Gli scenari di CertifyQuiz simulano situazioni realistiche che potresti incontrare durante un esame di certificazione. A differenza dei classici quiz, dovrai analizzare il contesto, valutare le possibili soluzioni e scegliere la decisione migliore.",
    p2: "Questa modalità di studio è particolarmente utile per certificazioni come CISSP, AWS, Azure, Kubernetes, Scrum, ITIL, CCNA e molte altre, dove la comprensione pratica è fondamentale.",
    p3: "Gli scenari sono riservati agli utenti Premium e vengono costantemente ampliati con nuovi contenuti."
  },
  en: {
    title: "Certification Scenarios",
    p1: "CertifyQuiz scenarios simulate realistic situations you may encounter during certification exams. Unlike traditional quizzes, you must analyze the context, evaluate different options and choose the best solution.",
    p2: "Scenario-based training is especially valuable for certifications such as CISSP, AWS, Azure, Kubernetes, Scrum, ITIL, CCNA and many others where practical decision-making is essential.",
    p3: "Scenarios are available exclusively to Premium members and are continuously expanded."
  },
  fr: {
    title: "Scénarios de certification",
    p1: "Les scénarios CertifyQuiz reproduisent des situations réalistes que vous pourriez rencontrer lors d'un examen de certification. Contrairement aux quiz classiques, vous devez analyser le contexte et choisir la meilleure décision.",
    p2: "Cette méthode d'entraînement est particulièrement adaptée aux certifications CISSP, AWS, Azure, Kubernetes, Scrum, ITIL, CCNA et bien d'autres.",
    p3: "Les scénarios sont réservés aux membres Premium et sont enrichis régulièrement."
  },
  es: {
    title: "Escenarios de certificación",
    p1: "Los escenarios de CertifyQuiz simulan situaciones reales que puedes encontrar en un examen de certificación. A diferencia de un cuestionario tradicional, tendrás que analizar el contexto y elegir la mejor decisión.",
    p2: "Este tipo de entrenamiento es especialmente útil para certificaciones como CISSP, AWS, Azure, Kubernetes, Scrum, ITIL, CCNA y muchas más.",
    p3: "Los escenarios están disponibles exclusivamente para usuarios Premium y se amplían continuamente."
  }
};

export default function ScenarioIntro({ lang }: Props) {
  const c = CONTENT[lang];

  return (
    <section className="mx-auto max-w-6xl px-4 pt-8 pb-2">
      <div className="rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold">{c.title}</h1>

        <div className="mt-6 space-y-4 text-gray-700 leading-7">
          <p>{c.p1}</p>
          <p>{c.p2}</p>

          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
            <p className="font-medium">
              ⭐ {c.p3}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}