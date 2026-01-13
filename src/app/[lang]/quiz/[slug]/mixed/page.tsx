// src/app/[lang]/quiz/[slug]/mixed/MixedQuizPage.tsx
'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';

import QuizEngine from '@/components/quiz/QuizEngine';
import type { Locale, Question as UiQuestion } from '@/lib/quiz-types';
import { withLang } from '@/lib/i18n';

// slug → certification_id
import { IDS_BY_SLUG } from '@/certifications/data';

import {
  getMixedQuestions,
  saveExam,
  type Question as ApiQuestion,
  getAccessToken,
} from '@/lib/apiClient';

import { getExamSpecForCert } from '@/lib/exam-specs';

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

  // ✅ modalità gestita dal parent SOLO per:
  // - initialMode
  // - salvataggio risultato
  const [mode, setMode] = useState<'training' | 'exam'>('training');

  const [poolTotal, setPoolTotal] = useState<number | null>(null);

  if (!certId) {
    return (
      <div className="p-4 text-center text-sm text-red-600">
        Mixed quiz non disponibile per questa certificazione.
      </div>
    );
  }

  // Redirect se non loggato
  useEffect(() => {
    const tok = getAccessToken();
    if (!tok) {
      router.replace(`/${currentLang}/login?redirect=/${currentLang}/quiz/${currentSlug}/mixed`);
    }
  }, [currentLang, currentSlug, router]);

  // ✅ poolTotal dal backend (chiamata leggera)
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await getMixedQuestions(certId, currentLang, {
          limit: 1,
          shuffle: false,
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

  // training pool limit: cap “anti-suicidio” coerente col backend
  const trainingPoolLimit = useMemo(() => {
    if (poolTotal == null) return 500;      // mentre carica
    return Math.min(poolTotal, 5000);
  }, [poolTotal]);

  const examSpec = useMemo(() => {
    return getExamSpecForCert(certId, trainingPoolLimit);
  }, [certId, trainingPoolLimit]);

  // ✅ IMPORTANTE: fetchQuestions deve SEMPRE caricare un pool grande.
  // QuizEngine poi fa subset in memoria per exam.
  const fetchPool = useCallback(async (): Promise<UiQuestion[]> => {
   const effectiveLimit =
  mode === "exam"
    ? Math.max(1, examSpec.questions)
    : trainingPoolLimit;

const res = await getMixedQuestions(certId, currentLang, {
  limit: effectiveLimit,
  shuffle: true,
  strict: currentLang !== "it", // 🔥 niente fallback se EN/FR/ES
});



    const raw: ApiQuestion[] = Array.isArray(res)
      ? (res as any)
      : (res as any).questions ?? [];

    return raw.map(normalizeMixedQuestion);
  }, [certId, currentLang, trainingPoolLimit]);

  return (
    <QuizEngine
      // ✅ NON mettere mode nella key → altrimenti smonti/rimonti l’engine e serve doppio click
      key={`${currentSlug}:${currentLang}`}
      lang={currentLang}
      storageScope={`mixed:${currentSlug}:${currentLang}`}
      categoryColor="from-blue-900 to-blue-700"

      // ✅ così l’engine parte nella modalità giusta se arrivi già in exam (o per restore)
      initialMode={mode}

      // ✅ timer e limiti per modalità (QUI è il posto corretto)
      durationsByMode={{
        training: undefined,              // default: questions.length * 60 (o come hai nel QuizEngine)
        exam: examSpec.durationSec,       // durata ufficiale
      }}
      limitsByMode={{
        training: trainingPoolLimit,      // pool grande
        exam: examSpec.questions,         // numero ufficiale
      }}

      onModeChange={(m) => setMode(m)}

      fetchQuestions={async () => {
        try {
          return await fetchPool();
        } catch (e: any) {
          if (e?.status === 401) {
            router.replace(`/${currentLang}/login?redirect=/${currentLang}/quiz/${currentSlug}/mixed`);
            return [];
          }
          throw e;
        }
      }}

      // ⚠️ se il tuo QuizEngine NON passa mode nel summary, tieni parent mode (come qui)
      onFinish={async (s: any) => {
        try {
          const finishedMode: 'training' | 'exam' =
            (s?.mode === 'exam' || s?.mode === 'training') ? s.mode : mode;

          await saveExam({
            certification_id: certId,
            totalQuestions: s.total,
            correctAnswers: s.correct,
            isExam: finishedMode === 'exam',
          });
        } catch {}
      }}

      backToHref={withLang(currentLang, `/quiz/${currentSlug}`)}
    />
  );
}
