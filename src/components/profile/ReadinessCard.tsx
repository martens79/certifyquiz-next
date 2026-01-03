"use client";

import { useEffect, useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";

type Readiness = {
  certificationId: number;
  accuracyPct: number;
  coveragePct: number;
  consistencyPct: number;
  sessionsLast14d: number;
  seenQuestions: number;
  totalQuestions: number;
  confidencePct: number;
};

const LBL = {
  defaultTitle: {
    it: "Preparazione all’esame",
    en: "Exam readiness",
    fr: "Préparation à l’examen",
    es: "Preparación para el examen",
  },
  calculating: {
    it: "Calcolo in corso…",
    en: "Calculating…",
    fr: "Calcul en cours…",
    es: "Calculando…",
  },
  cannotCalc: {
    it: "Impossibile calcolare la readiness.",
    en: "Couldn’t calculate readiness.",
    fr: "Impossible de calculer la préparation.",
    es: "No se pudo calcular la preparación.",
  },
  loginNeeded: {
    it: "Accedi per vedere la tua preparazione.",
    en: "Log in to see your readiness.",
    fr: "Connectez-vous pour voir votre préparation.",
    es: "Inicia sesión para ver tu preparación.",
  },
  awayFmt: {
    it: "Ti manca circa il {n}% per essere “pronto” (stima).",
    en: "You’re about {n}% away from being “ready” (estimate).",
    fr: "Il vous manque environ {n}% pour être « prêt » (estimation).",
    es: "Te falta aproximadamente un {n}% para estar “listo” (estimación).",
  },
  readiness: {
    it: "Readiness",
    en: "Readiness",
    fr: "Préparation",
    es: "Preparación",
  },
  accuracy: {
    it: "Accuracy",
    en: "Accuracy",
    fr: "Précision",
    es: "Precisión",
  },
  coverage: {
    it: "Coverage",
    en: "Coverage",
    fr: "Couverture",
    es: "Cobertura",
  },
  consistency: {
    it: "Costanza",
    en: "Consistency",
    fr: "Régularité",
    es: "Constancia",
  },
  note: {
    it: "Nota: è una stima. Migliora coverage (più domande viste) e accuracy (più punteggio) per salire.",
    en: "Note: this is an estimate. Improve coverage (more questions seen) and accuracy (higher score) to increase it.",
    fr: "Note : il s’agit d’une estimation. Améliorez la couverture (plus de questions vues) et la précision (meilleur score) pour l’augmenter.",
    es: "Nota: es una estimación. Mejora la cobertura (más preguntas vistas) y la precisión (mejor puntuación) para aumentarla.",
  },
};

function t(map: Record<Locale, string>, lang: Locale) {
  return map[lang] ?? map.it;
}

function fmt(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}

function clampPct(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

export default function ReadinessCard({
  certificationId,
  title,
  lang = "it",
}: {
  certificationId: number;
  title?: string;
  lang?: Locale;
}) {
  const [data, setData] = useState<Readiness | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    const ac = new AbortController();

    setData(null);
    setErr(null);
    setLoading(true);

    (async () => {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("cq:access")
            : null;

        if (!token) {
          throw new Error(t(LBL.loginNeeded, lang));
        }

        const res = await fetch(`/api/backend/user/readiness/${certificationId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
          signal: ac.signal,
        });

        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(txt || `HTTP ${res.status}`);
        }

        const json = (await res.json()) as Readiness;

        if (!alive) return;
        setData(json);
      } catch (e: any) {
        if (ac.signal.aborted) return;
        if (!alive) return;

        setErr(e?.message || t(LBL.cannotCalc, lang));
        setData(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
      ac.abort();
    };
  }, [certificationId, lang]);

  const readinessPct = useMemo(() => {
    if (!data) return 0;
    const a = clampPct(data.accuracyPct);
    const c = clampPct(data.coveragePct);
    const s = clampPct(data.consistencyPct);
    return clampPct(Math.round(a * 0.55 + c * 0.35 + s * 0.10));
  }, [data]);

  const missingPct = 100 - readinessPct;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-base font-semibold text-slate-900">
            {title || t(LBL.defaultTitle, lang)}
          </div>

          <div className="text-sm text-slate-600">
            {loading
              ? t(LBL.calculating, lang)
              : err
              ? t(LBL.cannotCalc, lang)
              : data
              ? fmt(t(LBL.awayFmt, lang), { n: missingPct })
              : "—"}
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-slate-900">
            {loading ? "…" : `${readinessPct}%`}
          </div>
          <div className="text-xs text-slate-500">{t(LBL.readiness, lang)}</div>
        </div>
      </div>

      <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all"
          style={{ width: `${readinessPct}%` }}
        />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <Kpi
          label={t(LBL.accuracy, lang)}
          value={loading ? "…" : `${clampPct(data?.accuracyPct ?? 0)}%`}
        />
        <Kpi
          label={t(LBL.coverage, lang)}
          value={
            loading
              ? "…"
              : `${clampPct(data?.coveragePct ?? 0)}% (${data?.seenQuestions ?? 0}/${data?.totalQuestions ?? 0})`
          }
        />
        <Kpi
          label={t(LBL.consistency, lang)}
          value={
            loading
              ? "…"
              : `${clampPct(data?.consistencyPct ?? 0)}% (${data?.sessionsLast14d ?? 0}/14g)`
          }
        />
      </div>

      {err && (
        <div className="mt-3 text-xs text-red-600 break-words">{err}</div>
      )}

      <div className="mt-3 text-xs text-slate-500">{t(LBL.note, lang)}</div>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-2">
      <div className="text-[11px] uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="text-sm font-semibold text-slate-900">{value}</div>
    </div>
  );
}
