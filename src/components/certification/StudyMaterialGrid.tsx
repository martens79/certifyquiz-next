import Link from "next/link";
import type { Locale } from "@/lib/paths";
import type { CertificationResources } from "@/lib/data";

type Props = {
  lang: Locale;
  resources: CertificationResources | null;
  quizHref: string;
  reviewsHref: string;
  scenariosHref: string;
  guideHref: string | null;
  mapsHref: string;
};

const LABELS = {
  it: {
    heading: "Materiale di studio",
    quiz: "Quiz",
    quizDesc: "Allenati con domande d'esame",
    reviews: "Ripassi",
    reviewsDesc: "Rivedi i concetti chiave",
    guide: "Guida Premium",
    guideDesc: "Guida PDF scaricabile",
    maps: "Mappe Premium",
    mapsDesc: "Mappe concettuali PDF",
    scenarios: "Scenari pratici",
    scenariosDesc: "Simulazioni in stile esame",
    questions: (n: number) => `${n.toLocaleString("it-IT")} domande`,
    topics: (n: number) => `${n} argomenti`,
    pages: (n: number) => `${n} pagine`,
    mapCount: (n: number) => `${n} mappe concettuali`,
    scenarioCount: (n: number) => `${n} scenari`,
    soon: "In arrivo",
    premium: "Premium",
  },
  en: {
    heading: "Study material",
    quiz: "Quiz",
    quizDesc: "Practise with exam questions",
    reviews: "Reviews",
    reviewsDesc: "Go over the key concepts",
    guide: "Premium guide",
    guideDesc: "Downloadable PDF guide",
    maps: "Premium maps",
    mapsDesc: "PDF concept maps",
    scenarios: "Practice scenarios",
    scenariosDesc: "Exam-style simulations",
    questions: (n: number) => `${n.toLocaleString("en-US")} questions`,
    topics: (n: number) => `${n} topics`,
    pages: (n: number) => `${n} pages`,
    mapCount: (n: number) => `${n} concept maps`,
    scenarioCount: (n: number) => `${n} scenarios`,
    soon: "Coming soon",
    premium: "Premium",
  },
  fr: {
    heading: "Matériel d'étude",
    quiz: "Quiz",
    quizDesc: "Entraînez-vous aux questions d'examen",
    reviews: "Révisions",
    reviewsDesc: "Revoyez les concepts clés",
    guide: "Guide Premium",
    guideDesc: "Guide PDF téléchargeable",
    maps: "Cartes Premium",
    mapsDesc: "Cartes conceptuelles PDF",
    scenarios: "Scénarios pratiques",
    scenariosDesc: "Simulations type examen",
    questions: (n: number) => `${n.toLocaleString("fr-FR")} questions`,
    topics: (n: number) => `${n} domaines`,
    pages: (n: number) => `${n} pages`,
    mapCount: (n: number) => `${n} cartes conceptuelles`,
    scenarioCount: (n: number) => `${n} scénarios`,
    soon: "Bientôt",
    premium: "Premium",
  },
  es: {
    heading: "Material de estudio",
    quiz: "Quiz",
    quizDesc: "Practica con preguntas de examen",
    reviews: "Repasos",
    reviewsDesc: "Repasa los conceptos clave",
    guide: "Guía Premium",
    guideDesc: "Guía PDF descargable",
    maps: "Mapas Premium",
    mapsDesc: "Mapas conceptuales PDF",
    scenarios: "Escenarios prácticos",
    scenariosDesc: "Simulaciones tipo examen",
    questions: (n: number) => `${n.toLocaleString("es-ES")} preguntas`,
    topics: (n: number) => `${n} temas`,
    pages: (n: number) => `${n} páginas`,
    mapCount: (n: number) => `${n} mapas conceptuales`,
    scenarioCount: (n: number) => `${n} escenarios`,
    soon: "Próximamente",
    premium: "Premium",
  },
} as const;

const CARD_BASE =
  "flex flex-col rounded-xl border p-3 transition sm:p-4";

function Card({
  href,
  icon,
  title,
  desc,
  meta,
  premium,
  tone,
  className = "",
  soonLabel,
}: {
  href: string | null;
  icon: string;
  title: string;
  desc: string;
  meta?: string | null;
  premium?: boolean;
  tone: "primary" | "neutral" | "premium";
  className?: string;
  soonLabel?: string;
}) {
  const toneClass =
    tone === "primary"
      ? "border-blue-600 bg-blue-600 text-white hover:bg-blue-700"
      : tone === "premium"
      ? "border-amber-200 bg-amber-50 text-slate-900 hover:border-amber-300 hover:bg-amber-100"
      : "border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50";

  const body = (
    <>
      <div className="mb-1 flex items-start justify-between gap-2">
        <span className="text-xl leading-none" aria-hidden>
          {icon}
        </span>
        {premium ? (
          <span className="shrink-0 rounded-full bg-amber-200/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-900">
            🔒 Premium
          </span>
        ) : null}
      </div>

      <span
        className={`text-sm font-extrabold leading-tight sm:text-base ${
          tone === "primary" ? "text-white" : "text-slate-900"
        }`}
      >
        {title}
      </span>

      <span
        className={`mt-0.5 text-xs leading-snug ${
          tone === "primary" ? "text-blue-100" : "text-slate-600"
        }`}
      >
        {desc}
      </span>

      {meta ? (
        <span
          className={`mt-auto pt-2 text-xs font-bold ${
            tone === "primary" ? "text-white" : "text-slate-700"
          }`}
        >
          {meta}
        </span>
      ) : null}
    </>
  );

  if (!href) {
    return (
      <div
        className={`${CARD_BASE} ${className} cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500`}
        aria-disabled="true"
      >
        {body}
        <span className="mt-auto pt-2 text-xs font-bold text-slate-500">
          🚧 {soonLabel}
        </span>
      </div>
    );
  }

  return (
    <Link href={href} className={`${CARD_BASE} ${toneClass} ${className} shadow-sm hover:shadow`}>
      {body}
    </Link>
  );
}

/**
 * Griglia "Materiale di studio": tutte le risorse della certificazione in un
 * punto solo. I conteggi arrivano dall'endpoint aggregato
 * /api/certifications/:slug/resources — mai valori fissi nel codice.
 *
 * Guida e Mappe compaiono solo se esistono per quella certificazione, così
 * non restano card senza destinazione.
 */
export default function StudyMaterialGrid({
  lang,
  resources,
  quizHref,
  reviewsHref,
  scenariosHref,
  guideHref,
  mapsHref,
}: Props) {
  const t = LABELS[lang];

  const questionCount = resources?.quiz.questionCount ?? 0;
  const topicCount = resources?.quiz.topicCount ?? 0;
  const reviewCount = resources?.reviews.count ?? 0;
  const scenarioCount = resources?.scenarios.count ?? 0;

  const showGuide = !!resources?.guide.available && !!guideHref;
  const showMaps = !!resources?.maps.available;

  const quizMeta = [
    questionCount > 0 ? t.questions(questionCount) : null,
    topicCount > 0 ? t.topics(topicCount) : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <section className="mb-6">
      <h2 className="mb-3 text-lg font-bold text-blue-900">{t.heading}</h2>

      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <Card
          href={quizHref}
          icon="📝"
          title={t.quiz}
          desc={t.quizDesc}
          meta={quizMeta || null}
          tone="primary"
        />

        <Card
          href={reviewsHref}
          icon="📖"
          title={t.reviews}
          desc={t.reviewsDesc}
          meta={reviewCount > 0 ? t.topics(reviewCount) : null}
          tone="neutral"
        />

        {showGuide ? (
          <Card
            href={guideHref}
            icon="📕"
            title={t.guide}
            desc={t.guideDesc}
            meta={
              resources?.guide.pageCount ? t.pages(resources.guide.pageCount) : null
            }
            premium
            tone="premium"
          />
        ) : null}

        {showMaps ? (
          <Card
            href={mapsHref}
            icon="🗺️"
            title={t.maps}
            desc={t.mapsDesc}
            meta={
              resources?.maps.mapCount ? t.mapCount(resources.maps.mapCount) : null
            }
            premium
            tone="premium"
          />
        ) : null}

        <Card
          href={scenarioCount > 0 ? scenariosHref : null}
          icon="🎯"
          title={t.scenarios}
          desc={t.scenariosDesc}
          meta={scenarioCount > 0 ? t.scenarioCount(scenarioCount) : null}
          premium
          tone="premium"
          soonLabel={t.soon}
          className="col-span-2"
        />
      </div>
    </section>
  );
}
