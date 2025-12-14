// src/app/[lang]/quiz/topic/[topicId]/QuizTopicClient.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  getTopicMetaById,
} from "@/lib/apiClient";

// Helper per mappare certification_id → slug certificazione
import { getCertSlugById } from "@/lib/certs";

/* ─────────────────────────  Normalizzazione domanda  ───────────────────────── */

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

/* ─────────────────────────  Component client  ───────────────────────── */

export default function QuizTopicClient({
  lang,
  topicId,
}: {
  lang: Locale;
  topicId: number;
}) {
  const router = useRouter();
  const L = lang;
  const numericId = topicId;

  const [blocked, setBlocked] = useState(false);

  // Info per salvataggio + bottone "Torna ai quiz"
  const [certificationId, setCertificationId] = useState<number | null>(null);
  const [backToHref, setBackToHref] = useState<string>(`/${L}/quiz-home`);

  /* ─────────────────────────  Redirect base  ───────────────────────── */

  // redirect se topicId non valido
  useEffect(() => {
    if (Number.isNaN(numericId)) {
      router.replace(`/${L}/quiz-home`);
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

  /* ─────────────────────────  Meta topic → backToHref  ───────────────────────── */

  useEffect(() => {
    if (Number.isNaN(numericId)) return;

    let cancelled = false;

    (async () => {
      try {
        // Usa l'endpoint /topics/meta/by-topic/:id
        const meta = await getTopicMetaById(numericId);

        const certId = meta?.topic?.certification_id;

        if (!cancelled && typeof certId === "number" && !Number.isNaN(certId)) {
          setCertificationId(certId);

          const slug = getCertSlugById(certId);
          if (slug) {
            // Es: /it/quiz/aws-cloud-practitioner
            setBackToHref(`/${L}/quiz/${slug}`);
          } else {
            // se manca la mappatura → fallback sicuro
            setBackToHref(`/${L}/quiz-home`);
          }
        } else if (!cancelled) {
          setBackToHref(`/${L}/quiz-home`);
        }
      } catch {
        if (!cancelled) {
          setBackToHref(`/${L}/quiz-home`);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [numericId, L]);

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
      // URL per il bottone "Torna ai quiz" (certificazione corretta)
      backToHref={backToHref}
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
            certification_id: certificationId,
            score: (s as any)?.score ?? 0,
          });
        } catch {
          // ignora errori di rete/salvataggio
        }
      }}
    />
  );
}
