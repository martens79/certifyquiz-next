import Link from "next/link";
import { BookOpen, Gamepad2, Terminal } from "lucide-react";

import type { Locale } from "@/lib/paths";
import {
  certificationsPath,
  guidesPath,
  gamesPath,
  interactiveLabsPath,
  mapsPath,
  recommendedResourcesPath,
  reviewsPath,
  scenariosPath,
} from "@/lib/paths";
import { trackEvent } from "@/lib/analytics";

type Props = { lang: Locale };

const COPY = {
  it: {
    kicker: "GLI STRUMENTI DIETRO LA PROMESSA",
    heading: "Quiz d'esame, simulazioni e strumenti di studio per oltre 50 certificazioni IT",
    quiz: "Quiz",
    quizDesc: "Domande in stile esame costruite sui domini ufficiali — con una spiegazione su ogni risposta sbagliata, non solo un punteggio.",
    reviews: "Ripassi",
    reviewsDesc: "I concetti dietro le domande, argomento per argomento, per quando la risposta non basta.",
    guides: "Guide Premium",
    guidesDesc: "Guide PDF complete da studiare anche offline, in treno, senza venti schede aperte.",
    maps: "Mappe concettuali",
    mapsDesc: "Schemi visivi che ti fanno entrare in testa un dominio intero in pochi minuti.",
    scenarios: "Scenari d'esame",
    scenariosDesc: "Situazioni che funzionano come funziona l'esame vero: leggi, ragiona, decidi.",
    labs: "Laboratori interattivi",
    labsDesc: "Esegui procedure reali passo dopo passo, perché sapere il comando non è la stessa cosa che sapere quando usarlo.",
    games: "Mini giochi",
    gamesDesc: "Ripetizione che non sembra ripetizione, per i dettagli che continuano a sfuggirti.",
    recommended: "Risorse consigliate",
    recommendedDesc: "I libri, i corsi e gli strumenti che valgono il tuo tempo. Nient'altro.",
    newBadge: "Nuovo",
  },
  en: {
    kicker: "THE TOOLS BEHIND THE PROMISE",
    heading: "Practice tests, exam simulations and study tools for 50+ IT certifications",
    quiz: "Quizzes",
    quizDesc: "Exam-style questions built on the official exam domains — with an explanation on every wrong answer, not just a score.",
    reviews: "Reviews",
    reviewsDesc: "The concepts behind the questions, topic by topic, for when the answer isn't enough.",
    guides: "Premium guides",
    guidesDesc: "Complete PDF guides you can study offline, on the train, without a screen full of tabs.",
    maps: "Concept maps",
    mapsDesc: "Visual outlines that make a whole domain fit in your head in minutes.",
    scenarios: "Exam scenarios",
    scenariosDesc: "Situations that work the way the real exam does: read, reason, decide.",
    labs: "Interactive labs",
    labsDesc: "Work through real procedures step by step, because knowing the command isn't the same as knowing when to run it.",
    games: "Mini games",
    gamesDesc: "Repetition that doesn't feel like repetition, for the details that keep slipping.",
    recommended: "Recommended resources",
    recommendedDesc: "The books, courses and tools worth your time, and nothing else.",
    newBadge: "New",
  },
  fr: {
    kicker: "LES OUTILS DERRIÈRE LA PROMESSE",
    heading: "Quiz d'examen, simulations et outils d'étude pour plus de 50 certifications IT",
    quiz: "Quiz",
    quizDesc: "Des questions au format de l'examen, construites sur les domaines officiels — avec une explication à chaque erreur, pas seulement un score.",
    reviews: "Fiches de révision",
    reviewsDesc: "Les concepts derrière les questions, sujet par sujet, quand la réponse ne suffit pas.",
    guides: "Guides Premium",
    guidesDesc: "Des guides PDF complets à étudier hors ligne, dans le train, sans vingt onglets ouverts.",
    maps: "Cartes conceptuelles",
    mapsDesc: "Des schémas visuels qui font tenir un domaine entier dans votre tête en quelques minutes.",
    scenarios: "Scénarios d'examen",
    scenariosDesc: "Des situations qui fonctionnent comme le vrai examen : lire, raisonner, décider.",
    labs: "Labs interactifs",
    labsDesc: "Déroulez de vraies procédures étape par étape, parce que connaître la commande n'est pas la même chose que savoir quand l'utiliser.",
    games: "Mini-jeux",
    gamesDesc: "De la répétition qui n'en a pas l'air, pour les détails qui continuent de vous échapper.",
    recommended: "Ressources recommandées",
    recommendedDesc: "Les livres, cours et outils qui valent votre temps. Rien d'autre.",
    newBadge: "Nouveau",
  },
  es: {
    kicker: "LAS HERRAMIENTAS DETRÁS DE LA PROMESA",
    heading: "Tests de examen, simulacros y herramientas de estudio para más de 50 certificaciones IT",
    quiz: "Tests",
    quizDesc: "Preguntas al estilo del examen, construidas sobre los dominios oficiales — con una explicación en cada error, no solo una puntuación.",
    reviews: "Repasos",
    reviewsDesc: "Los conceptos detrás de las preguntas, tema por tema, para cuando la respuesta no basta.",
    guides: "Guías Premium",
    guidesDesc: "Guías PDF completas para estudiar también sin conexión, en el transporte, sin veinte pestañas abiertas.",
    maps: "Mapas conceptuales",
    mapsDesc: "Esquemas visuales que te meten un dominio entero en la cabeza en pocos minutos.",
    scenarios: "Escenarios de examen",
    scenariosDesc: "Situaciones que funcionan como funciona el examen real: lee, razona, decide.",
    labs: "Laboratorios interactivos",
    labsDesc: "Recorre procedimientos reales paso a paso, porque saber el comando no es lo mismo que saber cuándo usarlo.",
    games: "Minijuegos",
    gamesDesc: "Repetición que no parece repetición, para los detalles que se siguen escapando.",
    recommended: "Recursos recomendados",
    recommendedDesc: "Los libros, cursos y herramientas que valen tu tiempo. Nada más.",
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
    {
      icon: <BookOpen size={19} strokeWidth={2.25} />,
      title: t.recommended,
      desc: t.recommendedDesc,
      href: recommendedResourcesPath(lang),
      trackingEvent: "recommended_materials_card_clicked",
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

        <ul className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-3">
          {items.map(({ icon, title, desc, href, isNew, trackingEvent }) => (
            <li key={href} className="min-w-0">
              <Link
                href={href}
                onClick={() => {
                  if (trackingEvent) {
                    trackEvent(trackingEvent, { page_language: lang });
                  }
                }}
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
