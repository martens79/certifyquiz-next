// src/app/[lang]/quiz/[slug]/mixed/page.tsx
'use client';

import { useParams } from 'next/navigation';
import QuizEngine from '@/components/quiz/QuizEngine';
import type { Locale, QuizSummary } from '@/lib/quiz-types';
import { getQuizMixedByCert, saveQuizResult } from '@/lib/apiClient';

export default function MixedQuizPage() {
  const { lang, slug } = useParams<{ lang: Locale; slug: string }>();

  return (
    <QuizEngine
      lang={lang ?? 'it'}
      storageScope={`mixed:${slug}:${lang}`}
      categoryColor="from-blue-900 to-blue-700"
      fetchQuestions={() => getQuizMixedByCert(slug)}   // ← usa slug come id/slug back-end
      durationSec={undefined}
      onFinish={async (s: QuizSummary) => {
        await saveQuizResult({
          scope: 'mixed',
          certId: slug,
          lang: (lang ?? 'it') as any,
          total: s.total,
          correct: s.correct,
          scorePct: s.scorePct,
          marked: s.marked,
          durationSec: s.durationSec,
        });
      }}
    />
  );
}
