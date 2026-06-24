// src/components/ScenarioQuizPage.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Lang = "it" | "en" | "fr" | "es";

type Answer = {
  id: number;
  text: string;
  is_correct: boolean;
};

type Question = {
  id: number;
  index: number;
  question: string;
  explanation: string;
  correct_answer: string;
  answers: Answer[];
};

type Scenario = {
  id: number;
  cert_slug: string;
  cert_name: string;
  title: string;
  intro_text: string;
  difficulty: string;
  question_count: number;
  questions: Question[];
};

const labels: Record<Lang, {
  question: string;
  of: string;
  correct: string;
  wrong: string;
  next: string;
  finish: string;
  result: string;
  score: string;
  retry: string;
  backToList: string;
  scenario: string;
  explanation: string;
  loading: string;
  error: string;
  premiumRequired: string;
}> = {
  it: {
    question: "Domanda", of: "di", correct: "Corretto! ✅", wrong: "Sbagliato ❌",
    next: "Prossima domanda", finish: "Vedi risultato", result: "Risultato finale",
    score: "Punteggio", retry: "Ricomincia", backToList: "← Tutti gli scenari",
    scenario: "Scenario", explanation: "Spiegazione",
    loading: "Caricamento scenario...", error: "Errore nel caricamento.",
    premiumRequired: "Questo scenario è riservato agli utenti Premium.",
  },
  en: {
    question: "Question", of: "of", correct: "Correct! ✅", wrong: "Wrong ❌",
    next: "Next question", finish: "See result", result: "Final result",
    score: "Score", retry: "Retry", backToList: "← All scenarios",
    scenario: "Scenario", explanation: "Explanation",
    loading: "Loading scenario...", error: "Loading error.",
    premiumRequired: "This scenario is reserved for Premium users.",
  },
  fr: {
    question: "Question", of: "sur", correct: "Correct ! ✅", wrong: "Incorrect ❌",
    next: "Question suivante", finish: "Voir le résultat", result: "Résultat final",
    score: "Score", retry: "Recommencer", backToList: "← Tous les scénarios",
    scenario: "Scénario", explanation: "Explication",
    loading: "Chargement du scénario...", error: "Erreur de chargement.",
    premiumRequired: "Ce scénario est réservé aux utilisateurs Premium.",
  },
  es: {
    question: "Pregunta", of: "de", correct: "¡Correcto! ✅", wrong: "Incorrecto ❌",
    next: "Siguiente pregunta", finish: "Ver resultado", result: "Resultado final",
    score: "Puntuación", retry: "Reintentar", backToList: "← Todos los escenarios",
    scenario: "Escenario", explanation: "Explicación",
    loading: "Cargando escenario...", error: "Error de carga.",
    premiumRequired: "Este escenario está reservado para usuarios Premium.",
  },
};

function listHref(lang: Lang, certSlug: string): string {
  switch (lang) {
    case "it": return `/it/certificazioni/${certSlug}/scenari`;
    case "en": return `/certifications/${certSlug}/scenarios`;
    case "fr": return `/fr/certifications/${certSlug}/scenarios`;
    case "es": return `/es/certificaciones/${certSlug}/escenarios`;
  }
}

const LETTERS = ["A", "B", "C", "D"];

type Props = {
  lang: Lang;
  certSlug: string;
  scenarioId: number;
};

export default function ScenarioQuizPage({ lang, certSlug, scenarioId }: Props) {
  const t = labels[lang];
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<"error" | "premium" | null>(null);

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("cq:access") ?? undefined;

    fetch(`/api/backend/scenarios/${scenarioId}?lang=${lang}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(async (r) => {
        if (r.status === 403) { setError("premium"); return; }
        if (!r.ok) { setError("error"); return; }
        const json = await r.json();
        if (json?.scenario) setScenario(json.scenario);
        else setError("error");
      })
      .catch(() => setError("error"))
      .finally(() => setLoading(false));
  }, [scenarioId, lang]);

  function handleSelect(answerId: number, isCorrect: boolean) {
    if (answered) return;
    setSelected(answerId);
    setAnswered(true);
    if (isCorrect) setScore((s) => s + 1);
  }

  function handleNext() {
    if (!scenario) return;
    if (current === scenario.questions.length - 1) {
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  }

  function handleRetry() {
    setCurrent(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setFinished(false);
  }

  // --- LOADING ---
  if (loading) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10 text-center text-slate-500">
        {t.loading}
      </main>
    );
  }

  // --- ERRORE ---
  if (error === "premium") {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10">
        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-8 text-center">
          <p className="text-4xl mb-4">⭐</p>
          <p className="font-bold text-yellow-800 mb-4">{t.premiumRequired}</p>
          <Link href={listHref(lang, certSlug)} className="text-sm text-blue-700 hover:underline">
            {t.backToList}
          </Link>
        </div>
      </main>
    );
  }

  if (error || !scenario) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10 text-center text-red-500">
        {t.error}
      </main>
    );
  }

  const q = scenario.questions[current];
  const isLast = current === scenario.questions.length - 1;
  const pct = Math.round((score / scenario.questions.length) * 100);

  // --- RESULT ---
  if (finished) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10">
        <div className="rounded-3xl bg-white border border-slate-200 shadow-lg p-8 text-center">
          <p className="text-5xl mb-4">{pct >= 70 ? "🎉" : "📚"}</p>
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2">{t.result}</h1>
          <p className="text-slate-600 mb-6">{scenario.title}</p>
          <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-blue-50 border-4 border-blue-200 mb-6">
            <span className="text-3xl font-extrabold text-blue-700">{pct}%</span>
          </div>
          <p className="text-slate-700 mb-8">
            {t.score}: <strong>{score}</strong> / {scenario.questions.length}
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={handleRetry}
              className="px-5 py-2.5 rounded-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold transition"
            >
              {t.retry}
            </button>
            <Link
              href={listHref(lang, certSlug)}
              className="px-5 py-2.5 rounded-full border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold transition"
            >
              {t.backToList}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // --- QUIZ ---
  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <Link href={listHref(lang, certSlug)} className="text-sm text-blue-700 hover:underline mb-4 inline-block">
        {t.backToList}
      </Link>

      {/* Intro collassabile */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50 mb-5">
        <button
          onClick={() => setShowIntro((v) => !v)}
          className="w-full flex items-center justify-between px-5 py-3 text-sm font-bold text-blue-800"
        >
          <span>📋 {t.scenario}: {scenario.title}</span>
          <span>{showIntro ? "▲" : "▼"}</span>
        </button>
        {showIntro && (
          <div className="px-5 pb-4 text-sm text-blue-900 whitespace-pre-line leading-relaxed border-t border-blue-200 pt-3">
            {scenario.intro_text}
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between mb-3 text-sm text-slate-500">
        <span>{t.question} {current + 1} {t.of} {scenario.questions.length}</span>
        <span>{score} ✅</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-1.5 mb-5">
        <div
          className="bg-blue-500 h-1.5 rounded-full transition-all"
          style={{ width: `${((current + 1) / scenario.questions.length) * 100}%` }}
        />
      </div>

      {/* Domanda */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 mb-4">
        <p className="text-base font-semibold text-slate-900 mb-5 leading-snug">
          {q.question}
        </p>
        <div className="space-y-3">
          {q.answers.map((a, idx) => {
            const isSelected = selected === a.id;
            let style = "border-slate-200 bg-slate-50 hover:border-blue-400 hover:bg-blue-50 cursor-pointer";
            if (answered) {
              if (a.is_correct) style = "border-green-400 bg-green-50 cursor-default";
              else if (isSelected) style = "border-red-400 bg-red-50 cursor-default";
              else style = "border-slate-200 bg-slate-50 cursor-default opacity-60";
            }
            return (
              <button
                key={a.id}
                onClick={() => handleSelect(a.id, a.is_correct)}
                disabled={answered}
                className={`w-full text-left flex items-start gap-3 px-4 py-3 rounded-xl border-2 transition ${style}`}
              >
                <span className="shrink-0 w-6 h-6 rounded-full bg-white border border-slate-300 flex items-center justify-center text-xs font-bold text-slate-700">
                  {LETTERS[idx]}
                </span>
                <span className="text-sm text-slate-800">{a.text}</span>
              </button>
            );
          })}
        </div>

        {answered && (
          <div className={`mt-5 rounded-xl p-4 text-sm ${q.answers.find((a) => a.id === selected)?.is_correct ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
            <p className="font-bold mb-1">
              {q.answers.find((a) => a.id === selected)?.is_correct ? t.correct : t.wrong}
            </p>
            {q.explanation && (
              <>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-2 mb-1">{t.explanation}</p>
                <p className="text-slate-700 leading-relaxed">{q.explanation}</p>
              </>
            )}
          </div>
        )}
      </div>

      {answered && (
        <div className="text-right">
          <button
            onClick={handleNext}
            className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
          >
            {isLast ? t.finish : t.next} →
          </button>
        </div>
      )}
    </main>
  );
}