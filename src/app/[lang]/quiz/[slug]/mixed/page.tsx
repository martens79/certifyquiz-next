// src/app/[lang]/quiz/[slug]/mixed/page.tsx
'use client';

import { useParams } from 'next/navigation';
import QuizEngine from '@/components/quiz/QuizEngine';
import type { Locale, Question, QuizSummary } from '@/lib/quiz-types';
import { backendUrl } from '@/lib/auth';
import { saveResult } from '@/lib/apiClient';

async function fetchMixedQuestions(slug: string, lang: Locale): Promise<Question[]> {
  const res = await fetch(
    backendUrl(`/quiz/mixed/${slug}?lang=${lang}`),
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    throw new Error('Failed to load mixed quiz questions');
  }

  const data = await res.json();
  // adattamento: se il backend restituisce { questions: [...] } o direttamente [...]
  const arr = Array.isArray(data) ? data : data.questions ?? [];
  return arr as Question[];
}

export default function MixedQuizPage() {
  const { lang, slug } = useParams<{ lang: Locale; slug: string }>();
  const currentLang = (lang ?? 'it') as Locale;
  const currentSlug = slug ?? '';

  return (
    <QuizEngine
      lang={currentLang}
      storageScope={`mixed:${currentSlug}:${currentLang}`}
      categoryColor="from-blue-900 to-blue-700"
      fetchQuestions={() => fetchMixedQuestions(currentSlug, currentLang)}   // ← sostituisce getQuizMixedByCert
      durationSec={undefined}
      onFinish={async (s: QuizSummary) => {
        // usa la funzione ESISTENTE saveResult al posto di saveQuizResult
        await saveResult({
          scope: 'mixed',
          certId: currentSlug,
          lang: currentLang as any,
          total: s.total,
          correct: s.correct,
          scorePct: s.scorePct,
          marked: s.marked,
          durationSec: s.durationSec,
        } as any);
      }}
    />
  );
}
