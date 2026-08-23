"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AlertTriangle } from "lucide-react";
import ReviewMicroQuiz from "./ReviewMicroQuiz";
import ReviewModuleAssessment from "./ReviewModuleAssessment";
import { moduleLabels } from "./reviewModuleLabels";
import type { Locale } from "@/lib/quiz-types";
import type { ReviewModuleSection } from "@/lib/review-module-types";

type Props = {
  lang: Locale;
  section: ReviewModuleSection;
  isCompleted: boolean;
  isFirst: boolean;
  isLast: boolean;
  reviewId: number;
  certSlug: string;
  onPrev: () => void;
  onNext: () => void;
  onMarkComplete: () => void;
  onAssessmentFinish: (score: number, total: number) => void;
  onFinishModule: () => void;
};

export default function ReviewModuleSectionCard({
  lang,
  section,
  isCompleted,
  isFirst,
  isLast,
  reviewId,
  certSlug,
  onPrev,
  onNext,
  onMarkComplete,
  onAssessmentFinish,
  onFinishModule,
}: Props) {
  const t = moduleLabels[lang];

  return (
    <div className="not-prose mt-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
      <h2 className="text-xl font-bold text-slate-950 sm:text-2xl">{section.title}</h2>

      <div className="prose prose-slate mt-4 max-w-none prose-headings:scroll-mt-24 prose-a:text-blue-700">
        {section.type === "intro" && <ReactMarkdown remarkPlugins={[remarkGfm]}>{section.body}</ReactMarkdown>}

        {(section.type === "lesson" || section.type === "practice") && (
          <>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{section.body}</ReactMarkdown>
            {section.microQuiz && <ReviewMicroQuiz topicId={section.microQuiz.topicId} lang={lang} />}
          </>
        )}

        {section.type === "assessment" && (
          <div className="not-prose">
            <ReviewModuleAssessment
              lang={lang}
              reviewId={reviewId}
              topicId={section.topicId}
              certificationId={section.certificationId}
              certSlug={certSlug}
              topicTitle={section.title}
              questionLimit={section.questionLimit}
              onFinish={(summary) => onAssessmentFinish(summary.correct, summary.total)}
            />
          </div>
        )}

        {section.type === "summary" && (
          <div className="not-prose space-y-6">
            {!!section.keyPoints?.length && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">{t.keyPoints}</h3>
                <ul className="mt-2 space-y-1.5">
                  {section.keyPoints.map((point) => (
                    <li key={point} className="flex gap-2 text-sm leading-6 text-slate-800">
                      <span className="text-blue-600" aria-hidden="true">
                        •
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!!section.keyTerms?.length && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">{t.keyTerms}</h3>
                <dl className="mt-2 divide-y divide-slate-100 rounded-xl border border-slate-100">
                  {section.keyTerms.map((item) => (
                    <div key={item.term} className="flex flex-col gap-0.5 px-3 py-2 sm:flex-row sm:gap-3">
                      <dt className="shrink-0 text-sm font-semibold text-slate-900 sm:w-44">{item.term}</dt>
                      <dd className="text-sm text-slate-600">{item.definition}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {!!section.commonMistakes?.length && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">{t.commonMistakes}</h3>
                <ul className="mt-2 space-y-1.5">
                  {section.commonMistakes.map((mistake) => (
                    <li key={mistake} className="flex gap-2 text-sm leading-6 text-amber-900">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
                      {mistake}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="not-prose mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onPrev}
          disabled={isFirst}
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ← {t.previous}
        </button>

        <div className="flex flex-col gap-3 sm:flex-row">
          {section.type !== "assessment" && (
            <button
              type="button"
              onClick={onMarkComplete}
              className={`inline-flex min-h-11 items-center justify-center rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                isCompleted ? "bg-emerald-50 text-emerald-800" : "bg-slate-900 text-white hover:bg-slate-800"
              }`}
            >
              {isCompleted ? `✓ ${t.completed}` : t.markComplete}
            </button>
          )}

          {isLast ? (
            <button
              type="button"
              onClick={onFinishModule}
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              {t.finishModule}
            </button>
          ) : (
            <button
              type="button"
              onClick={onNext}
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              {t.next} →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
