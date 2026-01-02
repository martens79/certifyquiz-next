// src/components/readiness/ReadinessPanel.tsx
"use client";

import React from "react";

function clamp100(n: number) {
  return Math.max(0, Math.min(100, n));
}

function Ring({ value }: { value: number }) {
  const v = clamp100(value);
  const r = 46;
  const c = 2 * Math.PI * r;
  const dash = (v / 100) * c;

  return (
    <svg viewBox="0 0 120 120" className="h-28 w-28">
      <circle cx="60" cy="60" r={r} fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="10" />
      <circle
        cx="60"
        cy="60"
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${c - dash}`}
        transform="rotate(-90 60 60)"
      />
    </svg>
  );
}

function Bar({ label, value }: { label: string; value: number }) {
  const v = clamp100(value);
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-zinc-700">{label}</span>
        <span className="text-zinc-700">{v}%</span>
      </div>
      <div className="mt-2 h-2 w-full rounded-full bg-zinc-200 overflow-hidden">
        <div className="h-full rounded-full bg-zinc-900" style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}

export type ReadinessViewModel = {
  score: number;
  confidence: number;
  parts: {
    accuracyPct: number;
    coveragePct: number;
    consistencyPct: number;
  };
  estimate?: {
    daysToTarget?: number; // opzionale
    targetScore?: number;  // es. 80
  };
};

export function ReadinessPanel({
  title = "Prontezza Esame",
  data,
}: {
  title?: string;
  data: ReadinessViewModel;
}) {
  const score = clamp100(data.score);

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900">{title}</h3>
          <p className="mt-1 text-sm text-zinc-600">
            Stima basata su accuratezza, copertura e costanza. Affidabilità: <b>{data.confidence}%</b>
          </p>

          {data.estimate?.targetScore && (
            <p className="mt-2 text-sm text-zinc-600">
              Target: <b>{data.estimate.targetScore}%</b>
              {typeof data.estimate.daysToTarget === "number" ? (
                <> · Stima giorni al target: <b>{data.estimate.daysToTarget}</b></>
              ) : null}
            </p>
          )}
        </div>

        <div className="text-zinc-900 flex flex-col items-center">
          <Ring value={score} />
          <div className="-mt-2 text-2xl font-bold">{score}%</div>
          <div className="text-xs text-zinc-600">readiness</div>
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        <Bar label="Accuratezza" value={data.parts.accuracyPct} />
        <Bar label="Copertura" value={data.parts.coveragePct} />
        <Bar label="Costanza" value={data.parts.consistencyPct} />
      </div>
    </div>
  );
}
