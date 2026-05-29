// src/app/[lang]/quiz/[slug]/mock-exam/page.tsx
"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams } from "next/navigation";

import QuizEngine from "@/components/quiz/QuizEngine";
import type { Locale, Question as UiQuestion } from "@/lib/quiz-types";
import { withLang } from "@/lib/i18n";
import { CERT_ID_BY_SLUG } from "@/lib/certs";

import {
  getMixedQuestions,
  saveExam,
  type Question as ApiQuestion,
  getAccessToken,
} from "@/lib/apiClient";

import { getExamSpecForCert } from "@/lib/exam-specs";

/* --------------------------- normalize API → UI -------------------------- */
function normalizeMixedQuestion(q: ApiQuestion): UiQuestion {
  return {
    id: q.id,
    question: q.question ?? "",
    explanation: q.explanation ?? undefined,
    answers: (q.answers ?? []).map((a) => ({
      id: a.id,
      text: (a as any).text ?? "",
      isCorrect: a.is_correct === true || a.is_correct === 1,
    })),
  };
}

export default function MockExamPage() {
  const { lang, slug } = useParams<{ lang: Locale; slug: string }>();

  const currentLang = (lang ?? "it") as Locale;
  const currentSlug = slug ?? "";
  const certId = CERT_ID_BY_SLUG[currentSlug];

  const [poolTotal, setPoolTotal] = useState<number | null>(null);

  const certName = useMemo(() => currentSlug.replace(/-/g, " "), [currentSlug]);
  const isAuthenticated = !!getAccessToken();

  const mockCopy = {
    it: {
      unavailable: "Simulazione d'esame non disponibile",
      notMapped: "Questa certificazione non è mappata.",
      badge: "🛡️ Simulazione d'esame",
      rules: "⏱️ Timer attivo · ❌ Nessun feedback immediato · 📄 Revisione finale",
      title: `Simulazione d'esame — ${certName}`,
      desc: "Simulazione d'esame: timer attivo, punteggio finale, nessun feedback immediato.",
      note: "Questa simulazione replica le condizioni reali dell’esame ufficiale.",
      questions: "domande",
      backLabel: "← Torna alla certificazione",
    },
    en: {
      unavailable: "Mock exam not available",
      notMapped: "This certification is not mapped.",
      badge: "🛡️ Mock Exam",
      rules: "⏱️ Active timer · ❌ No immediate feedback · 📄 Final review",
      title: `Mock Exam — ${certName}`,
      desc: "Mock exam: active timer, final score, no immediate feedback.",
      note: "This simulation replicates the real conditions of the official exam.",
      questions: "questions",
      backLabel: "← Back to certification",
    },
    fr: {
      unavailable: "Examen blanc indisponible",
      notMapped: "Cette certification n’est pas mappée.",
      badge: "🛡️ Examen blanc",
      rules: "⏱️ Chronomètre actif · ❌ Aucun retour immédiat · 📄 Révision finale",
      title: `Examen blanc — ${certName}`,
      desc: "Examen blanc : chronomètre actif, score final, aucun retour immédiat.",
      note: "Cette simulation reproduit les conditions réelles de l’examen officiel.",
      questions: "questions",
      backLabel: "← Retour à la certification",
    },
    es: {
      unavailable: "Simulación de examen no disponible",
      notMapped: "Esta certificación no está mapeada.",
      badge: "🛡️ Simulación de examen",
      rules: "⏱️ Temporizador activo · ❌ Sin retroalimentación inmediata · 📄 Revisión final",
      title: `Simulación de examen — ${certName}`,
      desc: "Simulación de examen: temporizador activo, puntuación final, sin retroalimentación inmediata.",
      note: "Esta simulación reproduce las condiciones reales del examen oficial.",
      questions: "preguntas",
      backLabel: "← Volver a la certificación",
    },
  } as const;

  const t = mockCopy[currentLang] ?? mockCopy.en;

  if (!certId) {
    return (
      <div className="mx-auto max-w-3xl p-6 text-center">
        <h1 className="text-lg font-semibold text-red-700">
          {t.unavailable}
        </h1>
        <p className="mt-2 text-sm text-slate-700">{t.notMapped}</p>
      </div>
    );
  }

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await getMixedQuestions(certId, currentLang, {
          limit: 1,
          shuffle: false,
          strict: currentLang !== "it",
        });

        const total = (res as any)?.poolTotal;
        if (!cancelled) setPoolTotal(typeof total === "number" ? total : null);
      } catch {
        if (!cancelled) setPoolTotal(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [certId, currentLang]);

  const poolSize = useMemo(() => {
    if (poolTotal == null) return 500;
    return Math.min(poolTotal, 5000);
  }, [poolTotal]);

  const examSpec = useMemo(() => {
    return getExamSpecForCert(certId, poolSize);
  }, [certId, poolSize]);

  const fetchExamQuestions = useCallback(async (): Promise<UiQuestion[]> => {
    const res = await getMixedQuestions(certId, currentLang, {
      limit: Math.max(1, examSpec.questions),
      shuffle: true,
      strict: currentLang !== "it",
    });

    const raw: ApiQuestion[] = Array.isArray(res)
      ? (res as any)
      : (res as any).questions ?? [];

    return raw.map(normalizeMixedQuestion);
  }, [certId, currentLang, examSpec.questions]);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-5xl px-4 pt-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700">
              {t.badge}
            </span>

            <span className="text-xs text-slate-500">{t.rules}</span>
          </div>

          <h1 className="mt-3 text-xl font-semibold md:text-2xl">
            {t.title}
          </h1>

          <p className="mt-2 text-sm text-slate-700 md:text-base">
            {t.desc}
          </p>

          <p className="mt-2 text-sm text-slate-600">{t.note}</p>

          <div className="mt-3 text-xs uppercase tracking-wide text-slate-500">
            Pool{" "}
            <span className="font-semibold">
              {poolTotal == null ? "…" : poolTotal.toLocaleString()}
            </span>{" "}
            ·{" "}
            <span className="font-semibold">
              {examSpec.questions.toLocaleString()}
            </span>{" "}
            {t.questions} ·{" "}
            <span className="font-semibold">
              {Math.round(examSpec.durationSec / 60)} min
            </span>
          </div>
        </div>
      </div>

      <QuizEngine
        key={`mock:${currentSlug}:${currentLang}`}
        lang={currentLang}
        storageScope={`mock-exam:${currentSlug}:${currentLang}`}
        categoryColor="from-orange-900 to-orange-700"
        initialMode="exam"
        hideModeSwitch
        context={{
          kind: "mock",
          certificationName: certName.toUpperCase(),
          certificationSlug: currentSlug,
          backHref: withLang(currentLang, `/quiz/${currentSlug}`),
          backLabel: t.backLabel,
          isPremiumUser: false,
          premiumLocked: false,
          isAuthenticated,
        }}
        durationsByMode={{
          training: undefined,
          exam: examSpec.durationSec,
        }}
        limitsByMode={{
          training: 0,
          exam: examSpec.questions,
        }}
        onModeChange={() => {}}
        fetchQuestions={async () => {
          try {
            return await fetchExamQuestions();
          } catch {
            return [];
          }
        }}
        onFinish={async (s: any) => {
          try {
            await saveExam({
              certification_id: certId,
              totalQuestions: s.total,
              correctAnswers: s.correct,
              isExam: true,
              attempts: s.attempts,
            });
          } catch {
            // best-effort
          }
        }}
        backToHref={withLang(currentLang, `/quiz/${currentSlug}`)}
      />
    </div>
  );
}