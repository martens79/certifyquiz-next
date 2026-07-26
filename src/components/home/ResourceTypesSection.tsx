import Link from "next/link";

import type { Locale } from "@/lib/paths";
import {
  certificationsPath,
  guidesPath,
  mapsPath,
  reviewsPath,
  scenariosPath,
} from "@/lib/paths";

type Props = { lang: Locale };

const COPY = {
  it: {
    kicker: "Cinque modi per prepararti",
    heading: "Tutto ciò che serve per preparare la tua certificazione",
    quiz: "Quiz",
    quizDesc: "Domande in stile esame con spiegazioni",
    reviews: "Ripassi",
    reviewsDesc: "I concetti chiave, argomento per argomento",
    guides: "Guide Premium",
    guidesDesc: "Guide PDF scaricabili per studiare offline",
    maps: "Mappe concettuali",
    mapsDesc: "Schemi visivi per fissare tutto in pochi minuti",
    scenarios: "Scenari pratici",
    scenariosDesc: "Simulazioni che riproducono le domande d'esame",
  },
  en: {
    kicker: "Five ways to prepare",
    heading: "Everything you need to prepare for your certification",
    quiz: "Quizzes",
    quizDesc: "Exam-style questions with explanations",
    reviews: "Reviews",
    reviewsDesc: "The key concepts, topic by topic",
    guides: "Premium guides",
    guidesDesc: "Downloadable PDF guides to study offline",
    maps: "Concept maps",
    mapsDesc: "Visual outlines to lock it all in minutes",
    scenarios: "Practice scenarios",
    scenariosDesc: "Simulations that mirror real exam questions",
  },
  fr: {
    kicker: "Cinq façons de vous préparer",
    heading: "Tout ce qu'il faut pour préparer votre certification",
    quiz: "Quiz",
    quizDesc: "Questions type examen avec explications",
    reviews: "Révisions",
    reviewsDesc: "Les concepts clés, domaine par domaine",
    guides: "Guides Premium",
    guidesDesc: "Guides PDF téléchargeables pour étudier hors ligne",
    maps: "Cartes conceptuelles",
    mapsDesc: "Des schémas visuels pour tout retenir en quelques minutes",
    scenarios: "Scénarios pratiques",
    scenariosDesc: "Des simulations proches des questions réelles",
  },
  es: {
    kicker: "Cinco formas de prepararte",
    heading: "Todo lo que necesitas para preparar tu certificación",
    quiz: "Cuestionarios",
    quizDesc: "Preguntas tipo examen con explicaciones",
    reviews: "Repasos",
    reviewsDesc: "Los conceptos clave, tema a tema",
    guides: "Guías Premium",
    guidesDesc: "Guías PDF descargables para estudiar sin conexión",
    maps: "Mapas conceptuales",
    mapsDesc: "Esquemas visuales para fijarlo todo en minutos",
    scenarios: "Escenarios prácticos",
    scenariosDesc: "Simulaciones que reproducen las preguntas del examen",
  },
} as const;

/**
 * Le cinque risorse di CertifyQuiz in una riga sola.
 *
 * NB: finisce nel bundle client, perché Home.tsx è "use client" e i
 * componenti che importa lo diventano a loro volta. Resta comunque leggero:
 * nessuno stato, nessun dato remoto, nessun effetto — solo markup e link.
 *
 * Icone come emoji e non da lucide-react: sono le stesse della griglia
 * "Materiale di studio" della pagina certificazione, quindi la home e quella
 * pagina si parlano, e non entra nulla nel bundle.
 */
export default function ResourceTypesSection({ lang }: Props) {
  const t = COPY[lang];

  // Emoji, le stesse della griglia "Materiale di studio" della pagina
  // certificazione: chi arriva da qui ritrova gli stessi simboli là.
  const items = [
    { icon: "📝", title: t.quiz, desc: t.quizDesc, href: certificationsPath(lang) },
    { icon: "📖", title: t.reviews, desc: t.reviewsDesc, href: reviewsPath(lang) },
    { icon: "📕", title: t.guides, desc: t.guidesDesc, href: guidesPath(lang) },
    { icon: "🗺️", title: t.maps, desc: t.mapsDesc, href: mapsPath(lang) },
    { icon: "🎯", title: t.scenarios, desc: t.scenariosDesc, href: scenariosPath(lang) },
  ];

  return (
    <section className="mt-5 md:mt-6 max-w-5xl mx-auto" aria-label={t.heading}>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-blue-700">
          🎯 {t.kicker}
        </div>

        <h2 className="mt-1 text-lg font-extrabold text-slate-800 md:text-xl">
          {t.heading}
        </h2>

        <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3">
          {items.map(({ icon, title, desc, href }) => (
            <li key={href}>
              <Link
                href={href}
                className="flex h-full items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 transition hover:border-blue-300 hover:bg-blue-50 lg:flex-col lg:gap-2"
              >
                <span
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-100 text-base leading-none"
                  aria-hidden
                >
                  {icon}
                </span>

                <span className="min-w-0">
                  <span className="block text-sm font-bold leading-tight text-slate-900">
                    {title}
                  </span>
                  <span className="mt-0.5 block text-xs leading-snug text-slate-600">
                    {desc}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
