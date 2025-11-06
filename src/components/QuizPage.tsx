// src/components/QuizPage.tsx
"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";

export type QuizPageProps = {
  lang: Locale;
  certSlug: string;
  defaultMode?: "exam" | "training";
};

type Copy = {
  title: string;
  training: string;
  exam: string;
  start: string;
  note: string;
};

export default function QuizPage({ lang, certSlug, defaultMode = "training" }: QuizPageProps) {
  const [mode, setMode] = useState<"exam" | "training">(defaultMode);

  const t = useMemo<Copy>(() => {
    const map: Record<Locale, Copy> = {
      it: {
        title: "Modalità quiz",
        training: "Allenamento",
        exam: "Esame",
        start: "Inizia",
        note:
          "Questo runtime è pronto: collega le tue API per domande, timer e salvataggio risultati.",
      },
      en: {
        title: "Quiz mode",
        training: "Training",
        exam: "Exam",
        start: "Start",
        note: "Runtime is ready: plug in your APIs for questions, timer and results.",
      },
      fr: {
        title: "Mode quiz",
        training: "Entraînement",
        exam: "Examen",
        start: "Commencer",
        note:
          "Runtime prêt : branchez vos APIs pour questions, minuterie et résultats.",
      },
      es: {
        title: "Modo de cuestionario",
        training: "Entrenamiento",
        exam: "Examen",
        start: "Empezar",
        note:
          "Runtime listo: conecta tus APIs para preguntas, temporizador y resultados.",
      },
    };
    return map[lang];
  }, [lang]);

  const handleStart = () => {
    // hook-in API/Router qui
  };

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
      <header className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">
          {t.title}: <span className="font-normal">{mode === "exam" ? t.exam : t.training}</span>
        </h2>

        <div className="inline-flex rounded-xl border p-1">
          <button
            type="button"
            onClick={() => setMode("training")}
            className={`px-3 py-1 text-sm rounded-lg ${
              mode === "training"
                ? "bg-blue-600 text-white"
                : "text-gray-700 dark:text-neutral-200"
            }`}
          >
            {t.training}
          </button>
          <button
            type="button"
            onClick={() => setMode("exam")}
            className={`px-3 py-1 text-sm rounded-lg ${
              mode === "exam"
                ? "bg-blue-600 text-white"
                : "text-gray-700 dark:text-neutral-200"
            }`}
          >
            {t.exam}
          </button>
        </div>
      </header>

      <div className="text-sm text-gray-700 dark:text-neutral-300">
        <p className="mb-4">
          <strong>Slug:</strong> {certSlug} — <strong>Lang:</strong> {lang}
        </p>
        <p className="mb-6">{t.note}</p>

        <button
          type="button"
          onClick={handleStart}
          className="rounded-2xl bg-blue-600 px-4 py-2 text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {t.start} 🚀
        </button>
      </div>
    </section>
  );
}
