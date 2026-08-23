import React from "react";
import { moduleLabels } from "./reviewModuleLabels";
import type { Locale } from "@/lib/quiz-types";

export default function ReviewModuleProgressHeader({
  lang,
  completed,
  total,
}: {
  lang: Locale;
  completed: number;
  total: number;
}) {
  const t = moduleLabels[lang];
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="not-prose">
      <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
        <span>{t.sectionsCompleted(completed, total)}</span>
        <span className="text-slate-500">{pct}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={t.sectionsCompleted(completed, total)}
        className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100"
      >
        <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
