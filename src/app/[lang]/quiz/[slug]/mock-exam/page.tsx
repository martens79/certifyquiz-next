// src/app/[lang]/quiz/[slug]/mock-exam/page.tsx
'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';

import QuizEngine from '@/components/quiz/QuizEngine';
import type { Locale, Question as UiQuestion } from '@/lib/quiz-types';
import { withLang } from '@/lib/i18n';

// slug → certification_id
import { IDS_BY_SLUG } from '@/certifications/data';

import {
  getMixedQuestions,
  saveExam,
  type Question as ApiQuestion,
} from '@/lib/apiClient';

import { getExamSpecForCert } from '@/lib/exam-specs';

/* --------------------------- normalize API → UI -------------------------- */
function normalizeMixedQuestion(q: ApiQuestion): UiQuestion {
  return {
    id: q.id,
    question: q.question ?? '',
    explanation: q.explanation ?? undefined,
    answers: (q.answers ?? []).map((a) => ({
      id: a.id,
      text: (a as any).text ?? '',
      isCorrect: a.is_correct === true || a.is_correct === 1,
    })),
  };
}

export default function MockExamPage() {
  const { lang, slug } = useParams<{ lang: Locale; slug: string }>();

  const currentLang = (lang ?? 'it') as Locale;
  const currentSlug = slug ?? '';
  const certId = IDS_BY_SLUG[currentSlug];

  const [poolTotal, setPoolTotal] = useState<number | null>(null);

  // Nome “leggibile”
  const certName = useMemo(() => currentSlug.replace(/-/g, ' '), [currentSlug]);

  // slug non mappato
  if (!certId) {
    return (
      <div className="mx-auto max-w-3xl p-6 text-center">
        <h1 className="text-lg font-semibold text-red-700">
          {currentLang === 'it'
            ? 'Mock exam non disponibile'
            : currentLang === 'fr'
            ? 'Mock exam indisponible'
            : currentLang === 'es'
            ? 'Mock exam no disponible'
            : 'Mock exam not available'}
        </h1>
        <p className="mt-2 text-sm text-slate-700">
          {currentLang === 'it'
            ? 'Questa certificazione non è mappata in IDS_BY_SLUG.'
            : currentLang === 'fr'
            ? "Cette certification n'est pas mappée dans IDS_BY_SLUG."
            : currentLang === 'es'
            ? 'Esta certificación no está mapeada en IDS_BY_SLUG.'
            : 'This certification is not mapped in IDS_BY_SLUG.'}
        </p>
      </div>
    );
  }

  /* --------------------- poolTotal (light call) --------------------- */
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await getMixedQuestions(certId, currentLang, {
          limit: 1,
          shuffle: false,
          strict: currentLang !== 'it',
        });

        const total = (res as any)?.poolTotal;
        if (!cancelled) setPoolTotal(typeof total === 'number' ? total : null);
      } catch {
        if (!cancelled) setPoolTotal(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [certId, currentLang]);

  // Pool size (safety coerente col backend)
  const poolSize = useMemo(() => {
    if (poolTotal == null) return 500; // fallback mentre carica
    return Math.min(poolTotal, 5000);
  }, [poolTotal]);

  // Exam spec “realistico”
  const examSpec = useMemo(() => {
    return getExamSpecForCert(certId, poolSize);
  }, [certId, poolSize]);

  /* ------------------------- fetch exam questions ------------------------- */
  const fetchExamQuestions = useCallback(async (): Promise<UiQuestion[]> => {
    const res = await getMixedQuestions(certId, currentLang, {
      limit: Math.max(1, examSpec.questions),
      shuffle: true,
      strict: currentLang !== 'it',
    });

    const raw: ApiQuestion[] = Array.isArray(res)
      ? (res as any)
      : (res as any).questions ?? [];

    return raw.map(normalizeMixedQuestion);
  }, [certId, currentLang, examSpec.questions]);

  const title =
    currentLang === 'it'
      ? `Mock exam — ${certName}`
      : currentLang === 'fr'
      ? `Mock exam — ${certName}`
      : currentLang === 'es'
      ? `Mock exam — ${certName}`
      : `Mock exam — ${certName}`;

  const desc =
    currentLang === 'it'
      ? 'Simulazione d’esame: timer attivo, punteggio finale, niente feedback immediato.'
      : currentLang === 'fr'
      ? "Simulation d’examen : chrono actif, score final, pas de feedback immédiat."
      : currentLang === 'es'
      ? 'Simulación de examen: temporizador, puntuación final, sin feedback inmediato.'
      : 'Exam simulation: timer on, final score, no instant feedback.';

 return (
  <div className="min-h-screen">
    {/* Intro box */}
    <div className="mx-auto max-w-5xl px-4 pt-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5 shadow-sm">

        {/* Exam badge + rules */}
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700">
            🛡️ Official Exam Simulation
          </span>

          <span className="text-xs text-slate-500">
            ⏱️ Timer attivo · ❌ Nessun feedback immediato · 📄 Review finale
          </span>
        </div>

        {/* Title */}
        <h1 className="mt-3 text-xl md:text-2xl font-semibold">
          {title}
        </h1>

        {/* Description */}
        <p className="mt-2 text-sm md:text-base text-slate-700">
          {desc}
        </p>

        {/* Official conditions note */}
        <p className="mt-2 text-sm text-slate-600">
          Questa simulazione replica le condizioni reali dell’esame ufficiale.
        </p>

        {/* Meta info */}
        <div className="mt-3 text-xs uppercase tracking-wide text-slate-500">
          Pool{' '}
          <span className="font-semibold">
            {poolTotal == null ? '…' : poolTotal.toLocaleString()}
          </span>{' '}
          ·{' '}
          <span className="font-semibold">
            {examSpec.questions.toLocaleString()}
          </span>{' '}
          {currentLang === 'es'
            ? 'preguntas'
            : currentLang === 'fr'
            ? 'questions'
            : currentLang === 'it'
            ? 'domande'
            : 'questions'}{' '}
          ·{' '}
          <span className="font-semibold">
            {Math.round(examSpec.durationSec / 60)} min
          </span>
        </div>

      </div>
    </div>


      {/* Quiz (EXAM ONLY) */}
      <QuizEngine
        key={`mock:${currentSlug}:${currentLang}`}
        lang={currentLang}
        storageScope={`mock-exam:${currentSlug}:${currentLang}`}
        categoryColor="from-orange-900 to-orange-700"
        initialMode="exam"
        hideModeSwitch // ✅ nasconde Training/Exam switch
        durationsByMode={{
          training: undefined,
          exam: examSpec.durationSec,
        }}
        limitsByMode={{
          training: 0,
          exam: examSpec.questions,
        }}
        // 🔒 blocca cambio modalità (mock exam = solo exam)
        onModeChange={() => {}}
        fetchQuestions={async () => {
          try {
            return await fetchExamQuestions();
          } catch (e: any) {
            // quiz pubblico: se qualcosa va storto, restituiamo vuoto (meglio: gestire errore in QuizEngine)
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
