// src/features/offensive-path/OffensiveSecurityPathPage.tsx
// Offensive Security Path (/offensive-security, /{it,fr,es}/offensive-security).
// Stages come from ./stages.ts; live counts and the CEH lab list from ./data.ts.
// Stages that are not "available" never render a link.

import Link from "next/link";

import {
  certPath,
  interactiveLabPath,
  interactiveLabsPath,
  roadmapPath,
  type Locale,
} from "@/lib/paths";
import { PATH_COPY, type PathPageCopy } from "./copy";
import { getPathLiveData, type PathLiveData } from "./data";
import {
  CERT_LABELS,
  PATH_STAGES,
  type CtaTarget,
  type PathStage,
  type StageStatus,
} from "./stages";

const STATUS_STYLE: Record<StageStatus, string> = {
  available: "border-emerald-200 bg-emerald-50 text-emerald-800",
  next: "border-amber-200 bg-amber-50 text-amber-800",
  planned: "border-slate-200 bg-slate-100 text-slate-600",
};

const STAGE_BORDER: Record<StageStatus, string> = {
  available: "border-slate-200 bg-white",
  next: "border-amber-200 bg-amber-50/40",
  planned: "border-dashed border-slate-300 bg-slate-50/60",
};

function resolveHref(lang: Locale, target: CtaTarget): string {
  switch (target.to) {
    case "cert":
      return certPath(lang, target.certSlug);
    case "quiz":
      return `/${lang}/quiz/${target.certSlug}`;
    case "mock":
      return `/${lang}/quiz/${target.certSlug}/mock-exam`;
    case "labs":
      return `${interactiveLabsPath(lang)}?certification=${encodeURIComponent(target.certSlug)}`;
    case "lab":
      return interactiveLabPath(lang, target.labSlug);
  }
}

function ctaLabel(t: PathPageCopy, target: CtaTarget): string {
  if (target.to === "lab") return t.cta.lab("");
  return t.cta[target.to](CERT_LABELS[target.certSlug] ?? target.certSlug);
}

function StatusChip({ status, t }: { status: StageStatus; t: PathPageCopy }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-extrabold ${STATUS_STYLE[status]}`}>
      {t.status[status]}
    </span>
  );
}

function CertRow({ lang, slug, live, t }: { lang: Locale; slug: string; live: PathLiveData; t: PathPageCopy }) {
  const r = live.resourcesBySlug[slug];
  const stats = [
    r?.quiz.questionCount ? `${r.quiz.questionCount} ${t.questions}` : null,
    r?.scenarios.count ? `${r.scenarios.count} ${t.scenarios}` : null,
    r?.labs?.count ? `${r.labs.count} ${t.labs}` : null,
  ].filter(Boolean);

  return (
    <li className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-slate-100 py-2 last:border-0">
      <Link href={certPath(lang, slug)} className="font-semibold text-blue-700 hover:underline">
        {CERT_LABELS[slug] ?? slug}
      </Link>
      {stats.length > 0 && <span className="text-xs text-slate-500">{stats.join(" · ")}</span>}
    </li>
  );
}

function StageCard({ stage, index, lang, live, t }: { stage: PathStage; index: number; lang: Locale; live: PathLiveData; t: PathPageCopy }) {
  const c = stage.copy[lang];
  const isAvailable = stage.status === "available";
  const labs = stage.labsCertSlug ? live.labsByCertSlug[stage.labsCertSlug] : null;

  return (
    <article id={stage.id} aria-labelledby={`${stage.id}-title`} className={`scroll-mt-24 rounded-3xl border p-5 shadow-sm md:p-7 ${STAGE_BORDER[stage.status]}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-extrabold uppercase tracking-wide text-slate-500">{t.stepLabel(index + 1)}</span>
        <StatusChip status={stage.status} t={t} />
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-700">{t.level[stage.level]}</span>
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-700">{t.nature[stage.assessmentNature]}</span>
      </div>

      <h2 id={`${stage.id}-title`} className="mt-4 text-2xl font-extrabold text-slate-950">{c.title}</h2>

      <dl className="mt-3 grid gap-2 text-sm md:grid-cols-[auto_1fr] md:gap-x-4">
        <dt className="font-bold text-slate-500">{t.targetLabel}</dt>
        <dd className="text-slate-800">{c.target}</dd>
        <dt className="font-bold text-slate-500">{t.objectiveLabel}</dt>
        <dd className="text-slate-800">{c.objective}</dd>
      </dl>

      {c.body.map((p) => (
        <p key={p.slice(0, 32)} className="mt-4 leading-relaxed text-slate-700">{p}</p>
      ))}

      <h3 className="mt-5 text-sm font-extrabold uppercase tracking-wide text-slate-500">{t.skillsLabel}</h3>
      <ul className="mt-2 grid gap-1 text-slate-700 md:grid-cols-2">
        {c.skills.map((s) => (
          <li key={s} className="flex gap-2"><span aria-hidden="true" className="text-slate-400">▸</span>{s}</li>
        ))}
      </ul>

      <h3 className="mt-5 text-sm font-extrabold uppercase tracking-wide text-slate-500">
        {isAvailable ? t.availableNowLabel : t.plannedFormatLabel}
      </h3>
      <ul className="mt-2 flex flex-wrap gap-2">
        {stage.resources.map((kind) => (
          <li
            key={kind}
            className={
              isAvailable
                ? "rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-800"
                : "rounded-full border border-dashed border-slate-300 bg-white px-3 py-1 text-xs font-bold text-slate-500"
            }
          >
            {t.resource[kind]}
          </li>
        ))}
      </ul>

      {isAvailable && stage.certSlugs.length > 1 && (
        <>
          <h3 className="mt-5 text-sm font-extrabold uppercase tracking-wide text-slate-500">{t.certsLabel}</h3>
          <ul className="mt-1">
            {stage.certSlugs.map((slug) => (
              <CertRow key={slug} lang={lang} slug={slug} live={live} t={t} />
            ))}
          </ul>
        </>
      )}

      {isAvailable && stage.certSlugs.length === 1 && (() => {
        const r = live.resourcesBySlug[stage.certSlugs[0]];
        const stats = [
          r?.quiz.questionCount ? `${r.quiz.questionCount} ${t.questions}` : null,
          r?.labs?.count ? `${r.labs.count} ${t.labs}` : null,
        ].filter(Boolean);
        return stats.length > 0 ? <p className="mt-3 text-sm text-slate-500">{stats.join(" · ")}</p> : null;
      })()}

      {isAvailable && labs && labs.length > 0 && (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="font-extrabold text-slate-900">{t.labsListTitle}</h3>
          <ol className="mt-3 space-y-3">
            {labs.map((lab, i) => (
              <li key={lab.slug} className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">{i + 1}</span>
                <div>
                  <p className="flex flex-wrap items-center gap-2">
                    <Link href={interactiveLabPath(lang, lab.slug)} className="font-semibold text-blue-700 hover:underline">{lab.title}</Link>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-extrabold ${lab.free ? "bg-emerald-100 text-emerald-800" : "bg-indigo-100 text-indigo-800"}`}>
                      {lab.free ? t.freeLab : t.premiumLab}
                    </span>
                    {lab.estimatedMinutes > 0 && <span className="text-xs text-slate-500">{lab.estimatedMinutes} {t.minutes}</span>}
                  </p>
                  {lab.description && <p className="text-sm text-slate-600">{lab.description}</p>}
                </div>
              </li>
            ))}
          </ol>
          {stage.labsCertSlug && (
            <Link href={resolveHref(lang, { to: "labs", certSlug: stage.labsCertSlug })} className="mt-3 inline-block text-sm font-bold text-blue-700 hover:underline">
              {t.cta.labs(CERT_LABELS[stage.labsCertSlug] ?? stage.labsCertSlug)} →
            </Link>
          )}
        </div>
      )}

      {c.note && <p className="mt-4 text-sm italic text-slate-500">{c.note}</p>}

      {isAvailable && stage.ctas.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-3">
          {stage.ctas.map((cta) => (
            <Link
              key={resolveHref(lang, cta.target)}
              href={resolveHref(lang, cta.target)}
              className={
                cta.primary
                  ? "inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                  : "inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-800 transition hover:bg-slate-50"
              }
            >
              {ctaLabel(t, cta.target)}
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}

export default async function OffensiveSecurityPathPage({ lang }: { lang: Locale }) {
  const t = PATH_COPY[lang];
  const live = await getPathLiveData(lang);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-10">
        <p className="text-sm font-extrabold uppercase tracking-wide text-rose-700">{t.eyebrow}</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 md:text-5xl">{t.h1}</h1>
        {t.intro.map((p) => (
          <p key={p.slice(0, 32)} className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-700">{p}</p>
        ))}
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="#ceh" className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700">{t.heroPrimary}</a>
          <a href="#fundamentals" className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-800 transition hover:bg-slate-50">{t.heroSecondary}</a>
        </div>
      </header>

      <nav aria-labelledby="path-overview" className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 id="path-overview" className="text-lg font-extrabold text-slate-950">{t.overviewTitle}</h2>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PATH_STAGES.map((stage, i) => (
            <li key={stage.id}>
              <a href={`#${stage.id}`} className="flex h-full flex-col gap-2 rounded-2xl border border-slate-200 p-3 transition hover:border-blue-300 hover:bg-blue-50/40">
                <span className="text-xs font-bold uppercase tracking-wide text-slate-500">{t.stepLabel(i + 1)} · {t.level[stage.level]}</span>
                <span className="font-bold text-slate-900">{stage.copy[lang].title}</span>
                <span><StatusChip status={stage.status} t={t} /></span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <section aria-labelledby="path-legend" className="mb-10 grid gap-4 md:grid-cols-2">
        <h2 id="path-legend" className="sr-only">{t.legendTitle}</h2>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-extrabold text-slate-900">{t.legendTitle}</p>
          <ul className="mt-3 space-y-2 text-sm">
            {(Object.keys(t.status) as StageStatus[]).map((s) => (
              <li key={s} className="flex flex-wrap items-center gap-2">
                <StatusChip status={s} t={t} />
                <span className="text-slate-600">{t.statusHelp[s]}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <ul className="space-y-2 text-sm">
            {(Object.keys(t.nature) as Array<keyof PathPageCopy["nature"]>).map((n) => (
              <li key={n}>
                <span className="font-bold text-slate-900">{t.nature[n]}</span>
                <span className="text-slate-600"> — {t.natureHelp[n]}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="relative space-y-6">
        {PATH_STAGES.map((stage, i) => (
          <StageCard key={stage.id} stage={stage} index={i} lang={lang} live={live} t={t} />
        ))}
      </div>

      <section className="mt-12 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
        <h2 className="text-2xl font-extrabold text-slate-950">{t.examTypesTitle}</h2>
        {t.examTypes.map((p) => (
          <p key={p.slice(0, 32)} className="mt-4 leading-relaxed text-slate-700">{p}</p>
        ))}
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-extrabold text-slate-950">{t.faqTitle}</h2>
        <div className="mt-4 space-y-3">
          {t.faq.map((f) => (
            <details key={f.q} className="rounded-2xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer font-bold text-slate-900">{f.q}</summary>
              <p className="mt-2 leading-relaxed text-slate-700">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-blue-200 bg-blue-50 p-5">
        <h2 className="text-lg font-extrabold text-slate-900">{t.relatedTitle}</h2>
        <ul className="mt-3 space-y-2">
          <li><Link href={roadmapPath(lang, "cybersecurity")} className="font-semibold text-blue-700 hover:underline">{t.relatedRoadmap} →</Link></li>
          <li><Link href={interactiveLabsPath(lang)} className="font-semibold text-blue-700 hover:underline">{t.relatedLabs} →</Link></li>
        </ul>
      </section>

      <p className="mt-8 text-xs leading-relaxed text-slate-500">{t.disclaimer}</p>
    </main>
  );
}
