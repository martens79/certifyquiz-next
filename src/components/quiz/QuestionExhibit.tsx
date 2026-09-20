import type { Question } from "@/lib/quiz-types";

type Exhibit = NonNullable<Question["exhibit"]>;

/**
 * Evidenza tecnica di una domanda (output CLI, log, tabella…).
 * Markup allineato a quello di QuizEngine; usato dove la domanda NON passa da
 * QuizEngine (es. ReviewMicroQuiz). Si mostra ogni volta che esiste un exhibit
 * con `content` valido: non dipende da `question_type`.
 * `not-prose`: puo' stare dentro contenitori Tailwind Typography.
 */
export default function QuestionExhibit({ exhibit }: { exhibit?: Exhibit | null }) {
  if (!exhibit?.content) return null;

  return (
    <figure className="not-prose mb-4 overflow-hidden rounded-xl border border-slate-300 bg-slate-950 text-slate-100">
      <figcaption className="border-b border-slate-700 bg-slate-900 px-4 py-2 text-xs font-bold uppercase tracking-wide text-slate-300">
        {exhibit.title || "Exhibit"}
      </figcaption>
      <pre
        className="overflow-x-auto whitespace-pre p-4 font-mono text-xs leading-relaxed sm:text-sm"
        aria-label={exhibit.title || "Question exhibit"}
      >
        {exhibit.content}
      </pre>
    </figure>
  );
}
