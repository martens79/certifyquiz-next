"use client";

import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { getQuestionsByTopic, type Question as ApiQuestion } from "@/lib/apiClient";
import type { Locale } from "@/lib/quiz-types";

type MicroQuestion = {
  id: number | string;
  question: string;
  explanation: string | null;
  answers: { id: number | string; text: string; isCorrect: boolean }[];
};

function normalize(q: ApiQuestion): MicroQuestion {
  return {
    id: q.id,
    question: q.question ?? "",
    explanation: q.explanation ?? null,
    answers: (q.answers ?? []).map((a) => ({
      id: a.id,
      text: a.text ?? "",
      isCorrect: a.is_correct === true || a.is_correct === 1,
    })),
  };
}

const copy = {
  it: { cta: "Verifica subito", loading: "Carico una domanda…", correct: "Corretto!", wrong: "Non proprio.", empty: "Nessuna domanda disponibile per questo topic al momento." },
  en: { cta: "Check yourself", loading: "Loading a question…", correct: "Correct!", wrong: "Not quite.", empty: "No question available for this topic right now." },
  fr: { cta: "Vérifiez tout de suite", loading: "Chargement d'une question…", correct: "Correct !", wrong: "Pas tout à fait.", empty: "Aucune question disponible pour ce sujet pour le moment." },
  es: { cta: "Compruébalo ahora", loading: "Cargando una pregunta…", correct: "¡Correcto!", wrong: "No exactamente.", empty: "No hay preguntas disponibles para este tema por ahora." },
} as const;

/**
 * Micro-quiz opzionale dentro una sezione review: UNA domanda reale, presa
 * a caso dal pool esistente del topic (mai inventata), con feedback
 * immediato. Non è un secondo motore quiz: nessun timer/mode/blocco, solo
 * una singola domanda presentazionale che riusa Question/Answer del sito.
 */
export default function ReviewMicroQuiz({ topicId, lang }: { topicId: number; lang: Locale }) {
  const t = copy[lang];
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState<MicroQuestion | null>(null);
  const [selectedId, setSelectedId] = useState<number | string | null>(null);
  const [failedToLoad, setFailedToLoad] = useState(false);

  async function start() {
    setStarted(true);
    setLoading(true);
    setFailedToLoad(false);
    try {
      const res = await getQuestionsByTopic(topicId, lang, { limit: 1, shuffle: true, strict: lang !== "it" });
      const raw: ApiQuestion[] = Array.isArray(res) ? res : res.questions;
      const first = raw?.[0];
      setQuestion(first ? normalize(first) : null);
    } catch {
      setFailedToLoad(true);
    } finally {
      setLoading(false);
    }
  }

  if (!started) {
    return (
      <button
        type="button"
        onClick={start}
        className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
      >
        {t.cta}
      </button>
    );
  }

  if (loading) {
    return <p className="mt-4 text-sm text-slate-500">{t.loading}</p>;
  }

  if (failedToLoad || !question) {
    return <p className="mt-4 text-sm text-slate-500">{t.empty}</p>;
  }

  const selected = question.answers.find((a) => a.id === selectedId) ?? null;

  return (
    <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
      <p className="text-sm font-semibold text-slate-900">{question.question}</p>

      <div className="mt-3 flex flex-col gap-2">
        {question.answers.map((answer) => {
          const isSelected = answer.id === selectedId;
          const showState = selectedId != null;
          const isCorrectAnswer = answer.isCorrect;

          return (
            <button
              key={answer.id}
              type="button"
              disabled={selectedId != null}
              onClick={() => setSelectedId(answer.id)}
              aria-pressed={isSelected}
              className={[
                "flex min-h-11 items-center gap-2 rounded-xl border px-4 py-2.5 text-left text-sm transition",
                !showState && "border-slate-300 bg-white hover:border-blue-400",
                showState && isCorrectAnswer && "border-emerald-400 bg-emerald-50 text-emerald-900",
                showState && isSelected && !isCorrectAnswer && "border-red-400 bg-red-50 text-red-900",
                showState && !isSelected && !isCorrectAnswer && "border-slate-200 bg-white text-slate-500",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {showState && isCorrectAnswer && <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />}
              {showState && isSelected && !isCorrectAnswer && <XCircle className="h-4 w-4 shrink-0" aria-hidden="true" />}
              <span>{answer.text}</span>
            </button>
          );
        })}
      </div>

      {selected && (
        <div
          role="status"
          className={`mt-3 rounded-xl p-3 text-sm ${selected.isCorrect ? "bg-emerald-100 text-emerald-900" : "bg-red-100 text-red-900"}`}
        >
          <p className="font-bold">{selected.isCorrect ? t.correct : t.wrong}</p>
          {question.explanation && <p className="mt-1 leading-6">{question.explanation}</p>}
        </div>
      )}
    </div>
  );
}
