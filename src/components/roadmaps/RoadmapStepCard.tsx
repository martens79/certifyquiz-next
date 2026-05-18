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
            Step {index}
          </p>

          <h2 className="mt-1 text-2xl font-extrabold leading-tight text-slate-950">
            {title}
          </h2>

          <div className="mt-2 flex flex-wrap gap-2">
            {index === 0 ? (
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                FREE
              </span>
            ) : (
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                PREMIUM
              </span>
            )}

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
              {index <= 1 ? "Beginner" : index <= 3 ? "Intermediate" : "Advanced"}
            </span>
          </div>
        </div>
      </div>

      <p className="text-base leading-relaxed text-slate-700">{level.body}</p>

      {level.recommended?.length ? (
        <div className="mt-5 grid gap-3">
          {level.recommended.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Recommended certification
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
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
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
      )}
    </article>
  );
}