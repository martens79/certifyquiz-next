// src/app/[lang]/quiz/topic/[topicId]/QuizTopicClient.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import QuizEngine from "@/components/quiz/QuizEngine";

import type { Question as UiQuestion, Locale, QuizSummary } from "@/lib/quiz-types";

import {
  getQuestionsByTopic,
  type Question as ApiQuestion,
  getAccessToken,
  getTopicMetaById,
} from "@/lib/apiClient";

import { getCertSlugById } from "@/lib/certs";
import { getExamSpecForCert } from "@/lib/exam-specs";

/** Normalizza la domanda API → formato UI atteso dal QuizEngine */
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

  // Serve per:
  // - salvare risultato su cert corretta
  // - costruire backToHref
  // - applicare examSpec (domande+tempo)
  const [certificationId, setCertificationId] = useState<number | null>(null);
  const [backToHref, setBackToHref] = useState<string>(`/${L}/quiz-home`);

  /* -------------------- Redirect base -------------------- */

  useEffect(() => {
    if (Number.isNaN(numericId)) {
      router.replace(`/${L}/quiz-home`);
      setBlocked(true);
    }
  }, [numericId, router, L]);

  useEffect(() => {
    const tok = getAccessToken();
    if (!tok) {
      setBlocked(true);
      router.replace(`/${L}/login?redirect=/${L}/quiz/topic/${numericId}`);
    }
  }, [L, numericId, router]);

  /* -------------------- Meta topic → certId + back link -------------------- */
  useEffect(() => {
    if (Number.isNaN(numericId)) return;

    let cancelled = false;

    (async () => {
      try {
        const meta = await getTopicMetaById(numericId);
        const certId = meta?.topic?.certification_id;

        if (!cancelled && typeof certId === "number" && !Number.isNaN(certId)) {
          setCertificationId(certId);

          const slug = getCertSlugById(certId);
          setBackToHref(slug ? `/${L}/quiz/${slug}` : `/${L}/quiz-home`);
        } else if (!cancelled) {
          setBackToHref(`/${L}/quiz-home`);
        }
      } catch {
        if (!cancelled) setBackToHref(`/${L}/quiz-home`);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [numericId, L]);

  if (blocked || Number.isNaN(numericId)) return null;

  const categoryColor = "from-blue-900 to-blue-700";

  /**
   * EXAM SPEC:
   * - training: puoi caricare anche 200/500 domande (pool grande)
   * - exam: deve rispettare numero domande + tempo ufficiale della cert
   */
  const examSpec = useMemo(() => {
    // Il poolSize reale lo conoscerà l’engine dopo fetch,
    // qui passiamo un fallback “safe” (usato solo se certId non mappata).
    return getExamSpecForCert(certificationId, 90);
  }, [certificationId]);

  return (
    <QuizEngine
      lang={L}
      storageScope={`topic:${numericId}:${L}`}
      categoryColor={categoryColor}
      backToHref={backToHref}
      /**
       * Fetch pool grande:
       * - limit 500 (cap backend)
       * - shuffle=0: eviti ORDER BY RAND() lato DB (più veloce), lo shuffle lo fa l’engine.
       */
      fetchQuestions={async (): Promise<UiQuestion[]> => {
        try {
          const res = await getQuestionsByTopic(numericId, L, { limit: 500, shuffle: false });

          const raw: ApiQuestion[] = Array.isArray(res)
            ? res
            : (res as any).questions;

          return (raw ?? []).map(normalizeQuestion);
        } catch (e: any) {
          if (e?.status === 401) {
            router.replace(`/${L}/login?redirect=/${L}/quiz/topic/${numericId}`);
            return [];
          }
          throw e;
        }
      }}
      /**
       * ✅ Regole:
       * - training: no timer (null) oppure undefined (60s * domande). Qui mettiamo null.
       * - exam: durata ufficiale (es. Security+ 90 min)
       */
      durationsByMode={{
        training: null,
        exam: examSpec.durationSec,
      }}
      /**
       * ✅ Regole:
       * - training: fai vedere tante domande (pool grande)
       * - exam: solo quelle dell’esame ufficiale
       */
      limitsByMode={{
        training: 500,
        exam: examSpec.questions,
      }}
      /**
       * Salvataggio best-effort:
       * - salva SOLO quando finisce, con total/correct reali della sessione.
       */
      onFinish={async (s: QuizSummary & { mode: "training" | "exam" }) => {
        // Salviamo solo se ha senso (di solito solo exam)
        // Se vuoi salvarlo anche in training, togli questo if.
        if (s.mode !== "exam") return;

        const token = getAccessToken();
        if (!token) return;

        const payload = {
          topicId: numericId,
          certification_id: certificationId,
          totalQuestions: s.total ?? 0,
          correctAnswers: s.correct ?? 0,
          isExam: true,
          quizId: null,
        };

        try {
          const res = await fetch("/api/backend/save-exam", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          });

          if (!res.ok) {
            const txt = await res.text().catch(() => "");
            throw new Error(`HTTP ${res.status} ${res.statusText} ${txt}`);
          }
        } catch (e) {
          console.error("🟥 save-exam FAILED", e);
        }
      }}
    />
  );
}
