import Link from "next/link";
import { Gamepad2, Terminal } from "lucide-react";

import type { Locale } from "@/lib/paths";
import {
  certificationsPath,
  guidesPath,
  gamesPath,
  interactiveLabsPath,
  mapsPath,
  reviewsPath,
  scenariosPath,
} from "@/lib/paths";

type Props = { lang: Locale };

const COPY = {
  it: {
    kicker: "Sette modi per prepararti",
    heading: "Tutto ciò che serve per preparare la tua certificazione",
    quiz: "Quiz",
    quizDesc: "Domande in stile esame con spiegazioni",
    reviews: "Ripassi",
    reviewsDesc: "I concetti chiave, argomento per argomento",
    guides: "Guide Premium",
    guidesDesc: "Guide PDF complete da studiare anche offline",
    maps: "Mappe concettuali",
    mapsDesc: "Schemi visivi per fissare tutto in pochi minuti",
    scenarios: "Scenari pratici",
    scenariosDesc: "Simulazioni che riproducono le domande d'esame",
    labs: "Laboratori interattivi",
    labsDesc: "Impara facendo, passo dopo passo",
    games: "Mini giochi",
    gamesDesc: "Allena le tue competenze divertendoti",
    newBadge: "Nuovo",
  },
  en: {
    kicker: "Seven ways to prepare",
    heading: "Everything you need to prepare for your certification",
    quiz: "Quizzes",
    quizDesc: "Exam-style questions with explanations",
    reviews: "Reviews",
    reviewsDesc: "The key concepts, topic by topic",
    guides: "Premium guides",
    guidesDesc: "Complete PDF guides you can also study offline",
    maps: "Concept maps",
    mapsDesc: "Visual outlines to lock it all in minutes",
    scenarios: "Practice scenarios",
    scenariosDesc: "Simulations that mirror real exam questions",
    labs: "Interactive labs",
    labsDesc: "Learn by doing, step by step",
    games: "Mini games",
    gamesDesc: "Build your skills while having fun",
    newBadge: "New",
  },
  fr: {
    kicker: "Sept façons de vous préparer",
    heading: "Tout ce qu'il faut pour préparer votre certification",
    quiz: "Quiz",
    quizDesc: "Questions type examen avec explications",
    reviews: "Révisions",
    reviewsDesc: "Les concepts clés, domaine par domaine",
    guides: "Guides Premium",
    guidesDesc: "Guides PDF complets à étudier aussi hors ligne",
    maps: "Cartes conceptuelles",
    mapsDesc: "Des schémas visuels pour tout retenir en quelques minutes",
    scenarios: "Scénarios pratiques",
    scenariosDesc: "Des simulations proches des questions réelles",
    labs: "Laboratoires interactifs",
    labsDesc: "Apprenez par la pratique, étape par étape",
    games: "Mini-jeux",
    gamesDesc: "Développez vos compétences en vous amusant",
    newBadge: "Nouveau",
  },
  es: {
    kicker: "Siete formas de prepararte",
    heading: "Todo lo que necesitas para preparar tu certificación",
    quiz: "Cuestionarios",
    quizDesc: "Preguntas tipo examen con explicaciones",
    reviews: "Repasos",
    reviewsDesc: "Los conceptos clave, tema a tema",
    guides: "Guías Premium",
    guidesDesc: "Guías PDF completas para estudiar también sin conexión",
    maps: "Mapas conceptuales",
    mapsDesc: "Esquemas visuales para fijarlo todo en minutos",
    scenarios: "Escenarios prácticos",
    scenariosDesc: "Simulaciones que reproducen las preguntas del examen",
    labs: "Laboratorios interactivos",
    labsDesc: "Aprende haciendo, paso a paso",
    games: "Minijuegos",
    gamesDesc: "Entrena tus habilidades mientras te diviertes",
    newBadge: "Nuevo",
  },
} as const;

/**
 * Le sette risorse di preparazione di CertifyQuiz.
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
    {
      icon: <Terminal size={18} strokeWidth={2.25} />,
      title: t.labs,
      desc: t.labsDesc,
      href: interactiveLabsPath(lang),
      isNew: true,
    },
    {
      icon: <Gamepad2 size={19} strokeWidth={2.25} />,
      title: t.games,
      desc: t.gamesDesc,
      href: gamesPath(lang),
      isNew: true,
    },
  ];

  return (
    <section className="mx-auto mt-5 max-w-6xl md:mt-6" aria-label={t.heading}>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-blue-700">
          🎯 {t.kicker}
        </div>

        <h2 className="mt-1 text-lg font-extrabold text-slate-800 md:text-xl">
          {t.heading}
        </h2>

        <ul className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-3 2xl:grid-cols-7">
          {items.map(({ icon, title, desc, href, isNew }) => (
            <li key={href} className="min-w-0">
              <Link
                href={href}
                className="group flex h-full min-w-0 items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50 p-3 transition hover:border-blue-300 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 sm:gap-3 lg:flex-col lg:gap-2"
              >
                <span
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-100 text-base leading-none"
                  aria-hidden
                >
                  {icon}
                </span>

                <span className="min-w-0">
                  <span className="flex min-w-0 flex-wrap items-center gap-1.5">
                    <span className="min-w-0 text-sm font-bold leading-tight text-slate-900">
                      {title}
                    </span>
                    {isNew && (
                      <span className="shrink-0 rounded-full bg-blue-600 px-1.5 py-0.5 text-[9px] font-extrabold uppercase leading-none tracking-wide text-white">
                        {t.newBadge}
                      </span>
                    )}
                  </span>
                  <span className="mt-1 block break-words text-[11px] leading-snug text-slate-600 sm:text-xs">
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
