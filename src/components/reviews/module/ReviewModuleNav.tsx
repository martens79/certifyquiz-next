"use client";

import React from "react";
import { CheckCircle2, Circle, ChevronRight } from "lucide-react";
import { moduleLabels } from "./reviewModuleLabels";
import type { Locale } from "@/lib/quiz-types";
import type { ReviewModuleSection, ReviewModuleSectionOutline } from "@/lib/review-module-types";

type Props = {
  lang: Locale;
  sections: (ReviewModuleSection | ReviewModuleSectionOutline)[];
  activeId: string;
  completedIds: Set<string>;
  onSelect: (id: string) => void;
};

/**
 * Indice del modulo come lista verticale compatta (non sidebar, non
 * drawer): su mobile è semplicemente il primo blocco della pagina, a piena
 * larghezza, righe da min-h-11 per restare toccabili. Ogni voce è un
 * <button> reale (navigabile da tastiera), mai un div cliccabile.
 */
export default function ReviewModuleNav({ lang, sections, activeId, completedIds, onSelect }: Props) {
  const t = moduleLabels[lang];

  return (
    <nav aria-label={t.moduleOutline} className="not-prose mt-5 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
      {sections.map((section, index) => {
        const isDone = completedIds.has(section.id);
        const isActive = section.id === activeId;
        const status = isDone ? t.statusDone : isActive ? t.statusCurrent : t.statusTodo;

        return (
          <button
            key={section.id}
            type="button"
            onClick={() => onSelect(section.id)}
            aria-current={isActive ? "step" : undefined}
            className={`flex min-h-11 w-full items-center gap-3 px-4 py-3 text-left text-sm transition ${
              isActive ? "bg-blue-50 font-semibold text-blue-900" : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            {isDone ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
            ) : (
              <Circle className={`h-5 w-5 shrink-0 ${isActive ? "text-blue-600" : "text-slate-300"}`} aria-hidden="true" />
            )}
            <span className="flex-1">
              {index + 1}. {section.title}
            </span>
            <span className="sr-only"> ({status})</span>
            {isActive && <ChevronRight className="h-4 w-4 shrink-0 text-blue-500" aria-hidden="true" />}
          </button>
        );
      })}
    </nav>
  );
}
