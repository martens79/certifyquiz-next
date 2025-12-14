'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import QuizEngine from '@/components/quiz/QuizEngine';
import type { Locale, Question as UiQuestion, QuizSummary } from '@/lib/quiz-types';
import { withLang } from '@/lib/i18n';
import { IDS_BY_SLUG } from '@/certifications/data';

import {
  getMixedQuestions,
  saveExam,
  type Question as ApiQuestion,
  getAccessToken,
} from '@/lib/apiClient';

/** Normalizza la domanda API → formato UI atteso da QuizEngine */
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

  /* ─────────────────  Redirect se non loggato (nessun token) ───────────────── */

  useEffect(() => {
    const tok = getAccessToken();
    if (!tok) {
      router.replace(
        `/${currentLang}/login?redirect=/${currentLang}/quiz/${currentSlug}/mixed`
      );
    }
  }, [currentLang, currentSlug, router]);

  // Se proprio manca la mappatura slug → id, evitiamo di rompere il QuizEngine
  if (!certId) {
    return (
      <div className="p-4 text-center text-sm text-red-600">
        Mixed quiz non disponibile per questa certificazione.
      </div>
    );
  }

  return (
    <QuizEngine
      lang={currentLang}
      storageScope={`mixed:${currentSlug}:${currentLang}`}
      categoryColor="from-blue-900 to-blue-700"
      /** Fetch domande; su 401 → redirect al login */
      fetchQuestions={async (): Promise<UiQuestion[]> => {
        try {
          const res = await getMixedQuestions(certId, currentLang);
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
      /** undefined ⇒ usa il default del QuizEngine (60s per domanda) */
      durationSec={undefined}
      /** Salvataggio risultato come esame misto legato alla certificazione */
      onFinish={async (s: QuizSummary) => {
        try {
          await saveExam({
            certification_id: certId,
            totalQuestions: s.total,
            correctAnswers: s.correct,
            isExam: (s as any)?.mode === 'exam',
          });
        } catch {
          // best effort: non blocca la UX se il salvataggio fallisce
        }
      }}
      backToHref={withLang(currentLang, `/quiz/${currentSlug}`)}
    />
  );
}
