// app/[lang]/quiz/topic/[topicId]/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import QuizEngine from "@/components/quiz/QuizEngine";

// Tipi UI richiesti dal tuo engine
import type {
  Question as UiQuestion,
  Locale,
  QuizSummary,
} from "@/lib/quiz-types";

// API backend
import {
  getQuestionsByTopic,
  saveResult,
  type Question as ApiQuestion,
  getAccessToken,
} from "@/lib/apiClient";

/** Normalizza la domanda backend → tipo UI */
function normalizeQuestion(q: ApiQuestion): UiQuestion {
  return {
    id: q.id,
    question: q.question ?? "",
    explanation: q.explanation ?? undefined,
    answers: (q.answers ?? []).map((a) => ({
      id: a.id,
      text: (a as any).text ?? "",
      isCorrect: a.is_correct === true || a.is_correct === 1,
    })),
  } as UiQuestion;
}

export default function QuizTopicPage() {
  const router = useRouter();
  const params = useParams<{ lang: Locale; topicId: string }>();

  const langParam = params?.lang ?? "it";
  const L: Locale = langParam as Locale;

  const numericId = useMemo(() => Number(params.topicId), [params.topicId]);
  const [blocked, setBlocked] = useState(false);

  // redirect se topicId non valido
  useEffect(() => {
    if (Number.isNaN(numericId)) {
      router.replace(`/${L}/quiz`);
      setBlocked(true);
    }
  }, [numericId, router, L]);

  // redirect immediato se non loggato
  useEffect(() => {
    const tok = getAccessToken();
    if (!tok) {
      setBlocked(true);
      router.replace(`/${L}/login?redirect=/${L}/quiz/topic/${numericId}`);
    }
  }, [L, numericId, router]);

  // se sto per fare redirect, non mostro ancora il quiz
  if (blocked || Number.isNaN(numericId)) {
    return null;
  }

  // placeholder per colore categoria (in futuro: mappare topic→categoria)
  const categoryColor = "from-blue-900 to-blue-700";

  return (
    <QuizEngine
      lang={L}
      storageScope={`topic:${numericId}:${L}`}
      categoryColor={categoryColor}
      /** Fetch + normalizzazione; se 401 → redirect al login */
      fetchQuestions={async (): Promise<UiQuestion[]> => {
        try {
          const res = await getQuestionsByTopic(numericId, L);
          const raw: ApiQuestion[] = Array.isArray(res)
            ? res
            : (res as any).questions;
          return (raw ?? []).map(normalizeQuestion);
        } catch (e: any) {
          if (e?.status === 401) {
            router.replace(
              `/${L}/login?redirect=/${L}/quiz/topic/${numericId}`
            );
            return [];
          }
          throw e;
        }
      }}
      /** undefined ⇒ 60s per domanda (default engine) */
      durationSec={undefined}
      /** Salvataggio best-effort (non blocca la UX) */
      onFinish={async (s: QuizSummary) => {
        try {
          await saveResult({
            topic_id: numericId,
            certification_id: null,
            score: (s as any)?.score ?? 0,
          });
        } catch {
          // ignora errori di rete/salvataggio
        }
      }}
    />
  );
}
