"use client";

import { useEffect, useMemo, useState } from "react";

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

function clampPct(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

export default function ReadinessCard({
  certificationId,
  title,
}: {
  certificationId: number | null;
  title?: string;
}) {
  const [data, setData] = useState<Readiness | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("cq:access") : null;

  useEffect(() => {
    if (!certificationId || !token) {
      setData(null);
      return;
    }

    let alive = true;
    setLoading(true);
    setErr(null);

    (async () => {
      try {
        const res = await fetch(
          `/api/backend/user/readiness/${certificationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          }
        );

        if (!res.ok) {
          const t = await res.text().catch(() => "");
          throw new Error(t || `HTTP ${res.status}`);
        }

        const json = (await res.json()) as Readiness;
        if (!alive) return;
        setData(json);
      } catch (e: any) {
        if (!alive) return;
        setErr(e?.message || "Errore caricamento readiness");
        setData(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [certificationId, token]);

  const readinessPct = useMemo(() => {
    if (!data) return 0;
    // formula semplice e stabile (puoi cambiarla dopo)
    const a = clampPct(data.accuracyPct);
    const c = clampPct(data.coveragePct);
    const s = clampPct(data.consistencyPct);
    return clampPct(Math.round(a * 0.55 + c * 0.35 + s * 0.10));
  }, [data]);

  const missingPct = 100 - readinessPct;

  if (!certificationId) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="text-sm text-slate-600">
          Seleziona una certificazione per vedere la preparazione all’esame.
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="text-sm text-slate-600">
          Accedi per vedere la tua preparazione.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-base font-semibold text-slate-900">
            {title || "Preparazione all’esame"}
          </div>
          <div className="text-sm text-slate-600">
            {loading
              ? "Calcolo in corso…"
              : data
              ? `Ti manca circa il ${missingPct}% per essere “pronto” (stima).`
              : "—"}
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-slate-900">
            {loading ? "…" : `${readinessPct}%`}
          </div>
          <div className="text-xs text-slate-500">Readiness</div>
        </div>
      </div>

      {/* progress bar */}
      <div className="mt-3 h-3 w-full rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all"
          style={{ width: `${readinessPct}%` }}
        />
      </div>

      {/* KPI */}
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <Kpi
          label="Accuracy"
          value={loading ? "…" : `${clampPct(data?.accuracyPct ?? 0)}%`}
        />
        <Kpi
          label="Coverage"
          value={
            loading
              ? "…"
              : `${clampPct(data?.coveragePct ?? 0)}% (${data?.seenQuestions ?? 0}/${
                  data?.totalQuestions ?? 0
                })`
          }
        />
        <Kpi
          label="Costanza"
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

      <div className="mt-3 text-xs text-slate-500">
        Nota: è una stima. Migliora coverage (più domande viste) e accuracy (più
        punteggio) per salire.
      </div>
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
