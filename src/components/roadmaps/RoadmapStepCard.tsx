import Link from "next/link";

type Locale = "it" | "en" | "es" | "fr";

type Level = {
  title: string;
  body: string;
  recommended?: string[];
  goal?: string;
  ctaQuizSlug?: string;
  ctaCertSlug?: string;
  ctaPrimaryText?: string;
  ctaSecondaryText?: string;
  reality?: string;
  mistakes?: string[];
  outcomes?: string[];
  prerequisites?: string;
  preparationTime?: string;
  role?: string;
  access?: "free" | "premium" | "mixed";
};

type Props = {
  level: Level;
  index: number;
  lang: Locale;
  quizHref: (lang: Locale, slug: string) => string;
  certHref: (lang: Locale, slug: string) => string;
  goalLabel: string;
  practiceCta: string;
  certCta: string;
};

function cleanTitle(title: string) {
  return title.replace(/^[🟢🟡🟠🔴⚫]\s*/, "");
}

function stepColor(index: number) {
  if (index === 0) return "bg-emerald-500";
  if (index === 1) return "bg-blue-500";
  if (index === 2) return "bg-amber-500";
  if (index === 3) return "bg-rose-500";
  return "bg-slate-900";
}

export default function RoadmapStepCard({
  level,
  index,
  lang,
  quizHref,
  certHref,
  goalLabel,
  practiceCta,
  certCta,
}: Props) {
  const title = cleanTitle(level.title);
  const labels = LABELS[lang];
  const access = level.access ?? (index === 0 ? "free" : "mixed");
  const difficulty = index <= 1 ? labels.beginner : index <= 3 ? labels.intermediate : labels.advanced;

  return (
    <article className="relative rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-extrabold text-white ${stepColor(
            index
          )}`}
        >
          {index}
        </div>

        <div>
          <p className="text-xs font-extrabold uppercase tracking-wide text-blue-700">
            {labels.step} {index}
          </p>

          <h2 className="mt-1 text-2xl font-extrabold leading-tight text-slate-950">
            {title}
          </h2>

          <div className="mt-2 flex flex-wrap gap-2">
            {access === "free" ? (
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                FREE
              </span>
            ) : access === "premium" ? (
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                PREMIUM
              </span>
            ) : (
              <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">
                FREE + PREMIUM
              </span>
            )}

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
              {difficulty}
            </span>
          </div>
        </div>
      </div>

      <p className="text-base leading-relaxed text-slate-700">{level.body}</p>

      <dl className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">{labels.prerequisites}</dt>
          <dd className="mt-1 text-sm font-semibold text-slate-800">{level.prerequisites ?? (index === 0 ? labels.none : labels.previous)}</dd>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">{labels.time}</dt>
          <dd className="mt-1 text-sm font-semibold text-slate-800">{level.preparationTime ?? defaultPreparationTime(index, lang)}</dd>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">{labels.role}</dt>
          <dd className="mt-1 text-sm font-semibold text-slate-800">{level.role ?? level.goal ?? title}</dd>
        </div>
      </dl>

      {level.recommended?.length ? (
        <div className="mt-5 grid gap-3">
          {level.recommended.map((item, itemIndex) => (
            <div
              key={item}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                {itemIndex === 0 ? labels.recommended : labels.alternatives}
              </p>
              <p className="mt-1 text-lg font-extrabold text-slate-950">
                {item}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {level.goal ? (
        <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4">
          <p className="text-sm leading-relaxed text-slate-800">
            <span className="font-extrabold">{goalLabel}</span> {level.goal}
          </p>
        </div>
      ) : null}

      {level.reality ? (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="font-extrabold text-amber-900">Reality check</p>
          <p className="mt-1 text-sm leading-relaxed text-amber-900">
            {level.reality}
          </p>
        </div>
      ) : null}

      {level.mistakes?.length ? (
        <div className="mt-4 rounded-2xl border border-rose-100 bg-rose-50 p-4">
          <p className="font-extrabold text-rose-900">Common mistakes</p>
          <ul className="mt-2 space-y-1 text-sm text-rose-900">
            {level.mistakes.map((m) => (
              <li key={m}>• {m}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {level.outcomes?.length ? (
        <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
          <p className="font-extrabold text-emerald-900">
            What you can realistically achieve
          </p>
          <ul className="mt-2 space-y-1 text-sm text-emerald-900">
            {level.outcomes.map((o) => (
              <li key={o}>• {o}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {(level.ctaQuizSlug || level.ctaCertSlug) && (
        <div className="mt-5">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">{labels.resources}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
          {level.ctaQuizSlug ? (
            <Link
              href={quizHref(lang, level.ctaQuizSlug)}
              className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-center font-extrabold text-white transition hover:bg-slate-800"
            >
              {level.ctaPrimaryText ?? practiceCta} →
            </Link>
          ) : null}

          {level.ctaCertSlug ? (
            <Link
              href={certHref(lang, level.ctaCertSlug)}
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-center font-extrabold text-slate-900 transition hover:bg-slate-50"
            >
              {level.ctaSecondaryText ?? certCta}
            </Link>
          ) : null}
          </div>
        </div>
      )}

      <p className="mt-5 border-t border-slate-100 pt-4 text-xs leading-relaxed text-slate-500">{labels.disclaimer}</p>
    </article>
  );
}

const LABELS: Record<Locale, {
  step: string; recommended: string; alternatives: string; prerequisites: string;
  time: string; role: string; resources: string; reality: string; mistakes: string;
  outcomes: string; beginner: string; intermediate: string; advanced: string;
  previous: string; none: string; disclaimer: string;
}> = {
  it: { step: "Livello", recommended: "Certificazione consigliata", alternatives: "Alternative possibili", prerequisites: "Prerequisiti", time: "Tempo indicativo", role: "Ruolo o obiettivo", resources: "Quiz e pagina certificazione", reality: "Nota realistica", mistakes: "Errori comuni", outcomes: "Risultati realistici", beginner: "Principiante", intermediate: "Intermedio", advanced: "Avanzato", previous: "Completare il livello precedente o possedere conoscenze equivalenti.", none: "Nessuna esperienza richiesta.", disclaimer: "Una certificazione può dimostrare conoscenze, ma non garantisce automaticamente un lavoro." },
  en: { step: "Level", recommended: "Recommended certification", alternatives: "Possible alternatives", prerequisites: "Prerequisites", time: "Estimated preparation", role: "Related role or objective", resources: "Quiz and certification page", reality: "Reality check", mistakes: "Common mistakes", outcomes: "Realistic outcomes", beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced", previous: "Complete the previous level or have equivalent knowledge.", none: "No previous experience required.", disclaimer: "A certification can demonstrate knowledge, but it does not automatically guarantee a job." },
  fr: { step: "Niveau", recommended: "Certification recommandée", alternatives: "Alternatives possibles", prerequisites: "Prérequis", time: "Temps de préparation indicatif", role: "Rôle ou objectif associé", resources: "Quiz et page de certification", reality: "Point de vigilance", mistakes: "Erreurs fréquentes", outcomes: "Résultats réalistes", beginner: "Débutant", intermediate: "Intermédiaire", advanced: "Avancé", previous: "Terminer le niveau précédent ou posséder des connaissances équivalentes.", none: "Aucune expérience préalable requise.", disclaimer: "Une certification peut démontrer des connaissances, mais ne garantit pas automatiquement un emploi." },
  es: { step: "Nivel", recommended: "Certificación recomendada", alternatives: "Alternativas posibles", prerequisites: "Prerrequisitos", time: "Tiempo estimado de preparación", role: "Rol u objetivo relacionado", resources: "Quiz y página de certificación", reality: "Nota realista", mistakes: "Errores comunes", outcomes: "Resultados realistas", beginner: "Principiante", intermediate: "Intermedio", advanced: "Avanzado", previous: "Completar el nivel anterior o tener conocimientos equivalentes.", none: "No se requiere experiencia previa.", disclaimer: "Una certificación puede demostrar conocimientos, pero no garantiza automáticamente un empleo." },
};

function defaultPreparationTime(index: number, lang: Locale) {
  const unit = lang === "it" ? ["settimane", "mesi"] : lang === "fr" ? ["semaines", "mois"] : lang === "es" ? ["semanas", "meses"] : ["weeks", "months"];
  if (index === 0) return `2–4 ${unit[0]}`;
  if (index === 1) return `4–8 ${unit[0]}`;
  if (index <= 3) return `2–4 ${unit[1]}`;
  return `3–6+ ${unit[1]}`;
}
