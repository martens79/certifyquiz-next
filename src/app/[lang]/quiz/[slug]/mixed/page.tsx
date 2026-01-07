// src/app/[lang]/quiz/[slug]/mixed/MixedQuizPage.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import QuizEngine from '@/components/quiz/QuizEngine';
import type { Locale, Question as UiQuestion, QuizSummary } from '@/lib/quiz-types';
import { withLang } from '@/lib/i18n';

// slug → certification_id (serve per endpoint mixed)
import { IDS_BY_SLUG } from '@/certifications/data';

import {
  getMixedQuestions,
  saveExam,
  type Question as ApiQuestion,
  getAccessToken,
} from '@/lib/apiClient';

// ✅ Exam specs per certId (DB)
import { getExamSpecForCert } from '@/lib/exam-specs';

/* ──────────────────────────────────────────────────────────────────────────────
   Normalizzazione domanda API → formato UI richiesto dal QuizEngine
────────────────────────────────────────────────────────────────────────────── */
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

export default function MixedQuizPage() {
  const router = useRouter();
  const { lang, slug } = useParams<{ lang: Locale; slug: string }>();

  const currentLang = (lang ?? 'it') as Locale;
  const currentSlug = slug ?? '';

  const certId = IDS_BY_SLUG[currentSlug];

  // ✅ Modalità locale: ci serve per applicare limit+timer diversi
  const [mode, setMode] = useState<'training' | 'exam'>('training');

  // ✅ Pool training (massimo)
  const TRAINING_POOL_LIMIT = 500;

  /* ──────────────────────────────────────────────────────────────────────────
     Redirect se non loggato
  ────────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const tok = getAccessToken();
    if (!tok) {
      router.replace(
        `/${currentLang}/login?redirect=/${currentLang}/quiz/${currentSlug}/mixed`
      );
    }
  }, [currentLang, currentSlug, router]);

  // Guard: se manca mappatura slug → id
  if (!certId) {
    return (
      <div className="p-4 text-center text-sm text-red-600">
        Mixed quiz non disponibile per questa certificazione.
      </div>
    );
  }

  /* ──────────────────────────────────────────────────────────────────────────
     Exam spec per questa certificazione:
     - Se presente in EXAM_SPECS_BY_CERT_ID → usa quella (es. 90 domande / 90 min)
     - Se assente → fallback intelligente (60 domande / 60 min, non oltre pool)
     NOTA: poolSize qui è una stima; per mixed usiamo TRAINING_POOL_LIMIT.
  ────────────────────────────────────────────────────────────────────────── */
  const examSpec = useMemo(() => {
    return getExamSpecForCert(certId, TRAINING_POOL_LIMIT);
  }, [certId]);

  // ✅ Limit dinamico:
  // - training: pool grande
  // - exam: esattamente il numero previsto (cap 500 per backend)
  const effectiveLimit =
    mode === 'exam'
      ? Math.max(1, Math.min(examSpec.questions, 500))
      : TRAINING_POOL_LIMIT;

  // ✅ Timer dinamico:
  // - training: undefined ⇒ default QuizEngine (60s * domande)
  // - exam: durata ufficiale in secondi
  const effectiveDurationSec = mode === 'exam' ? examSpec.durationSec : undefined;

  return (
    <QuizEngine
      // ✅ Forza reload completo quando cambi mode
      // (così cambiano limit + timer e non resta “incollato” al vecchio set)
      key={`${currentSlug}:${currentLang}:${mode}`}
      lang={currentLang}
      storageScope={`mixed:${currentSlug}:${currentLang}`}
      categoryColor="from-blue-900 to-blue-700"

      // ✅ notifiche cambio modalità (devi aver aggiunto onModeChange in QuizEngine)
      onModeChange={(m) => setMode(m)}

      /* ──────────────────────────────────────────────────────────────────────
         Fetch domande MISTE
         - limit variabile in base alla modalità
         - shuffle=true (ordine casuale)
      ────────────────────────────────────────────────────────────────────── */
      fetchQuestions={async (): Promise<UiQuestion[]> => {
        try {
          const res = await getMixedQuestions(certId, currentLang, {
            limit: effectiveLimit,
            shuffle: true,
          });

          const raw: ApiQuestion[] = Array.isArray(res)
            ? (res as any)
            : (res as any).questions ?? [];

          return (raw ?? []).map(normalizeMixedQuestion);
        } catch (e: any) {
          if (e?.status === 401) {
            router.replace(
              `/${currentLang}/login?redirect=/${currentLang}/quiz/${currentSlug}/mixed`
            );
            return [];
          }
          throw e;
        }
      }}

      // ✅ timer coerente con mode
      durationSec={effectiveDurationSec}

      /* ──────────────────────────────────────────────────────────────────────
         Salvataggio risultato (best-effort)
         - isExam true solo se eri in modalità exam
      ────────────────────────────────────────────────────────────────────── */
      onFinish={async (s: QuizSummary) => {
        try {
          await saveExam({
            certification_id: certId,
            totalQuestions: s.total,
            correctAnswers: s.correct,
            isExam: mode === 'exam',
          });
        } catch {
          // best effort
        }
      }}

      backToHref={withLang(currentLang, `/quiz/${currentSlug}`)}
    />
  );
}
