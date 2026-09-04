"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Clock3, LockKeyhole, Milestone, Play, Terminal } from "lucide-react";
import { apiFetch } from "@/lib/auth";
import { interactiveLabsPath, type Locale } from "@/lib/paths";
import type { JobTrackDetailData, JobTrackLabItem } from "@/lib/server/jobTracks";

const DIFFICULTY_RANK: Record<JobTrackLabItem["difficulty"], number> = { base: 1, intermediate: 2, final: 3 };
const DIFFICULTY_LABEL_KEY: Record<JobTrackLabItem["difficulty"], "beginner" | "intermediate" | "advanced"> = {
  base: "beginner", intermediate: "intermediate", final: "advanced",
};

const copy = {
  it: { eyebrow: "Job Track", back: "Torna a tutti i laboratori", labs: "Lab", minute: "min", level: "Livello", progress: "Progresso complessivo", beginner: "Principiante", intermediate: "Intermedio", advanced: "Avanzato", completed: "Completato", premiumBadge: "Premium", start: "Avvia", viewPreview: "Vedi anteprima", optional: "Facoltativo" },
  en: { eyebrow: "Job Track", back: "Back to all labs", labs: "Labs", minute: "min", level: "Level", progress: "Overall progress", beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced", completed: "Completed", premiumBadge: "Premium", start: "Start", viewPreview: "View preview", optional: "Optional" },
  fr: { eyebrow: "Job Track", back: "Retour aux laboratoires", labs: "Labs", minute: "min", level: "Niveau", progress: "Progression globale", beginner: "Débutant", intermediate: "Intermédiaire", advanced: "Avancé", completed: "Terminé", premiumBadge: "Premium", start: "Démarrer", viewPreview: "Voir l'aperçu", optional: "Facultatif" },
  es: { eyebrow: "Job Track", back: "Volver a los laboratorios", labs: "Labs", minute: "min", level: "Nivel", progress: "Progreso global", beginner: "Principiante", intermediate: "Intermedio", advanced: "Avanzado", completed: "Completado", premiumBadge: "Premium", start: "Iniciar", viewPreview: "Ver vista previa", optional: "Opcional" },
} as const;

export default function JobTrackDetail({ lang, slug, initialTrack }: { lang: Locale; slug: string; initialTrack: JobTrackDetailData }) {
  const t = copy[lang];
  const base = interactiveLabsPath(lang);

  // Overlay di sola autorizzazione/completamento (stesso principio di
  // accessById/completedById in InteractiveLabsLanding.tsx): initialTrack
  // arriva risolto SSR con lo stato anonimo/di cache; questa fetch client-side
  // (con apiFetch, quindi con il token se presente) sovrappone lo stato reale
  // per l'utente corrente. Nessuno skip per l'anonimo: GET /job-tracks/:slug
  // e' pubblica, la chiamata resta valida anche senza token.
  const [labs, setLabs] = useState<JobTrackLabItem[]>(initialTrack.labs);
  const [completedLabs, setCompletedLabs] = useState(initialTrack.completedLabs);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await apiFetch(`/job-tracks/${encodeURIComponent(slug)}?lang=${lang}`);
        if (!active || !res.ok) return;
        const json = await res.json();
        if (!Array.isArray(json.labs)) return;
        setLabs(json.labs.map((item: Record<string, unknown>) => ({
          id: Number(item.id), slug: String(item.slug), title: String(item.title), description: String(item.description),
          difficulty: item.difficulty as JobTrackLabItem["difficulty"], estimatedMinutes: Number(item.estimatedMinutes),
          sortOrder: Number(item.sortOrder), isOptional: !!item.isOptional,
          locked: !!item.locked, accessReason: String(item.accessReason ?? ""), completed: !!item.completed,
        })));
        setCompletedLabs(Number(json.completedLabs ?? 0));
      } catch {
        // silenzioso: fail-soft, stesso trattamento delle altre overlay di accesso
      }
    })();
    return () => { active = false; };
  }, [lang, slug]);

  // Ordine di TRACK, mai quello del singolo lab: job_track_labs.sort_order,
  // gia' l'ordine in cui il backend restituisce l'array (ORDER BY
  // jtl.sort_order in GET /job-tracks/:slug) -- il sort qui e' difensivo, non
  // una fonte di ordinamento alternativa.
  const orderedLabs = useMemo(() => labs.slice().sort((a, b) => a.sortOrder - b.sortOrder), [labs]);
  const labCount = orderedLabs.length;
  const progress = labCount ? Math.round((completedLabs / labCount) * 100) : 0;

  const difficultyRanks = orderedLabs.map((lab) => DIFFICULTY_RANK[lab.difficulty]);
  const minDifficulty = difficultyRanks.length ? Math.min(...difficultyRanks) : null;
  const maxDifficulty = difficultyRanks.length ? Math.max(...difficultyRanks) : null;
  const levelLabel = (rank: number | null) => rank == null ? null : t[({ 1: "beginner", 2: "intermediate", 3: "advanced" } as const)[rank as 1 | 2 | 3]];
  const minLevelLabel = levelLabel(minDifficulty);
  const maxLevelLabel = levelLabel(maxDifficulty);

  return (
    <main id="main" className="min-h-[75vh] bg-slate-50/70 px-3 py-8 text-slate-950 sm:px-4 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <Link href={base} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:text-indigo-900">
          <ArrowLeft size={17} />{t.back}
        </Link>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-950 to-indigo-950 p-6 text-white shadow-sm sm:p-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-indigo-100">
            <Milestone size={14} />{t.eyebrow}
          </span>
          <h1 className="mt-4 text-2xl font-black sm:text-4xl">{initialTrack.track.title}</h1>
          <p className="mt-3 max-w-2xl text-slate-200">{initialTrack.track.description}</p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-white/15 bg-white/10 p-3">
              <dt className="text-xs text-indigo-200">{t.labs}</dt>
              <dd className="mt-1 text-xl font-black">{labCount}</dd>
            </div>
            {minLevelLabel && maxLevelLabel && (
              <div className="rounded-xl border border-white/15 bg-white/10 p-3">
                <dt className="text-xs text-indigo-200">{t.level}</dt>
                <dd className="mt-1 text-sm font-black sm:text-base">{minLevelLabel === maxLevelLabel ? minLevelLabel : `${minLevelLabel} → ${maxLevelLabel}`}</dd>
              </div>
            )}
            <div className="rounded-xl border border-white/15 bg-white/10 p-3">
              <dt className="text-xs text-indigo-200">{t.progress}</dt>
              <dd className="mt-1 text-xl font-black">{completedLabs} / {labCount}</dd>
            </div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/15">
            <div className="h-full rounded-full bg-cyan-400 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </section>

        <ol className="mt-6 space-y-3">
          {orderedLabs.map((lab, index) => (
            <li key={lab.slug}>
              <TrackLabRow lab={lab} order={index + 1} base={base} t={t} />
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}

function TrackLabRow({ lab, order, base, t }: { lab: JobTrackLabItem; order: number; base: string; t: (typeof copy)[Locale] }) {
  const difficultyLabel = t[DIFFICULTY_LABEL_KEY[lab.difficulty]];
  const difficultyColor = { beginner: "bg-emerald-100 text-emerald-700", intermediate: "bg-amber-100 text-amber-800", advanced: "bg-rose-100 text-rose-700" }[DIFFICULTY_LABEL_KEY[lab.difficulty]];
  return (
    <article className="group flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-200 hover:shadow-md sm:flex-row sm:items-center">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-50 text-sm font-black text-indigo-700">{order}</span>
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-700">{lab.locked ? <LockKeyhole size={19} /> : <Terminal size={19} />}</span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-extrabold text-slate-950">{lab.title}</h3>
          {lab.completed && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700"><Check size={12} />{t.completed}</span>}
          {lab.locked && <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800"><LockKeyhole size={12} />{t.premiumBadge}</span>}
          {lab.isOptional && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">{t.optional}</span>}
        </div>
        <p className="mt-1 truncate text-sm text-slate-600">{lab.description}</p>
      </div>
      <div className="flex items-center gap-2 sm:shrink-0">
        <span className={`rounded-lg px-2.5 py-1.5 text-xs font-bold ${difficultyColor}`}>{difficultyLabel}</span>
        <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-600"><Clock3 size={13} />{lab.estimatedMinutes} {t.minute}</span>
      </div>
      <Link href={`${base}/${lab.slug}`} className="inline-flex min-h-10 min-w-[10rem] items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-bold text-white transition hover:bg-indigo-700 sm:shrink-0">
        {lab.locked ? <LockKeyhole size={15} /> : <Play size={15} fill="currentColor" />}{lab.locked ? t.viewPreview : t.start}<ArrowRight size={15} />
      </Link>
    </article>
  );
}
