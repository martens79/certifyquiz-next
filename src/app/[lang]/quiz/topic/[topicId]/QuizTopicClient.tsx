// src/app/[lang]/quiz/topic/[topicId]/QuizTopicClient.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import QuizEngine from "@/components/quiz/QuizEngine";
import ComingSoonBox from "@/components/ui/ComingSoonBox";
import { useAuth } from "@/components/auth/AuthProvider";

import type { Question as UiQuestion, Locale, QuizSummary } from "@/lib/quiz-types";

import {
  getQuestionsByTopic,
  type Question as ApiQuestion,
  getAccessToken,
  getTopicMetaById,
} from "@/lib/apiClient";

import { getCertSlugById } from "@/lib/certs";
import { getExamSpecForCert } from "@/lib/exam-specs";

/* ─────────────────────────────────────────────────────────────
   NORMALIZZAZIONE DATI
   API → formato atteso dal QuizEngine
───────────────────────────────────────────────────────────── */
function normalizeQuestion(q: ApiQuestion): UiQuestion {
  return {
    id: Number(q.id),
    question: q.question ?? "",
    explanation: q.explanation ?? undefined,
    answers: (q.answers ?? []).map((a: any) => ({
      id: Number(a.id),
      text: a.text ?? "",
      isCorrect: a.is_correct === true || a.is_correct === 1 || a.is_correct === "1",
    })),
  };
}

export default function QuizTopicClient({ lang, topicId }: { lang: Locale; topicId: number }) {
  const router = useRouter();
  const L = lang;
  const numericId = topicId;

  // ✅ PREMIUM / ADMIN source-of-truth (Provider globale)
  const { isPremiumUser, premiumLocked } = useAuth();

  /* ─────────────────────────────────────────────────────────────
     STATE (core)
  ───────────────────────────────────────────────────────────── */
  const [blocked, setBlocked] = useState(false);

  // Solo se /questions tornasse 401 (finché non è 100% pubblico)
  const [needsLoginForQuestions, setNeedsLoginForQuestions] = useState(false);

  // meta
  const [certificationId, setCertificationId] = useState<number | null>(null);
  const [backToHref, setBackToHref] = useState<string>(`/${L}/quiz-home`);

  // header
  const [topicTitle, setTopicTitle] = useState<string | null>(null);
  const [certSlug, setCertSlug] = useState<string | null>(null);

  // light check “coming soon” (solo lingue non-IT)
  const [topicTotal, setTopicTotal] = useState<number | null>(null);

  /* ─────────────────────────────────────────────────────────────
     VALIDAZIONE PARAMETRI BASE
  ───────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (Number.isNaN(numericId)) {
      setBlocked(true);
      router.replace(`/${L}/quiz-home`);
    } else {
      setBlocked(false);
    }
  }, [numericId, router, L]);

  /* ─────────────────────────────────────────────────────────────
     METADATA TOPIC → cert + back link
  ───────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (Number.isNaN(numericId)) return;

    let cancelled = false;

    (async () => {
      try {
        const meta = await getTopicMetaById(numericId);

        const certId = meta?.topic?.certification_id;
        const t = meta?.topic;

        const title =
          (L === "it"
            ? t?.title_it
            : L === "en"
            ? t?.title_en
            : L === "fr"
            ? t?.title_fr
            : t?.title_es) ?? null;

        if (cancelled) return;

        setTopicTitle(title);

        if (typeof certId === "number") {
          setCertificationId(certId);

          const slug = getCertSlugById(certId);
          setCertSlug(slug ?? null);
          setBackToHref(slug ? `/${L}/quiz/${slug}` : `/${L}/quiz-home`);
        } else {
          setCertificationId(null);
          setCertSlug(null);
          setBackToHref(`/${L}/quiz-home`);
        }
      } catch {
        if (cancelled) return;
        setCertificationId(null);
        setTopicTitle(null);
        setCertSlug(null);
        setBackToHref(`/${L}/quiz-home`);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [numericId, L]);

  /* ─────────────────────────────────────────────────────────────
     topicTotal (light call)
     - se 200 ma vuoto e non-IT → Coming Soon
     - se errore → null (non bloccare)
  ───────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (Number.isNaN(numericId)) return;

    let cancelled = false;

    (async () => {
      try {
        const res = await getQuestionsByTopic(numericId, L, { limit: 1, shuffle: false });

        const poolTotalFromApi = (res as any)?.poolTotal;

        let total: number | null = null;
        if (typeof poolTotalFromApi === "number") total = poolTotalFromApi;
        else if (Array.isArray(res)) total = res.length > 0 ? 1 : 0;
        else if (Array.isArray((res as any)?.questions)) total = (res as any).questions.length > 0 ? 1 : 0;

        if (!cancelled) setTopicTotal(total);
      } catch {
        if (!cancelled) setTopicTotal(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [numericId, L]);

  if (blocked || Number.isNaN(numericId)) return null;

  /* ─────────────────────────────────────────────────────────────
     EXAM SPEC UFFICIALE
  ───────────────────────────────────────────────────────────── */
  const examSpec = useMemo(() => getExamSpecForCert(certificationId, 90), [certificationId]);

  /* ─────────────────────────────────────────────────────────────
     UI SOFT LOGIN (solo se /questions torna 401)
  ───────────────────────────────────────────────────────────── */
  if (needsLoginForQuestions) {
    return (
      <div className="mx-auto max-w-xl px-4 py-10">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h1 className="text-lg font-semibold mb-2">
            {L === "it" ? "Accedi per continuare" : "Sign in to continue"}
          </h1>

          <p className="text-sm text-slate-700">
            {L === "it"
              ? "Questo quiz sarà pubblico. Per ora, su questo dispositivo non sei loggato."
              : "This quiz will be public. For now, you are not signed in on this device."}
          </p>

          <button
            className="mt-4 inline-flex items-center justify-center rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
            onClick={() => router.push(`/${L}/login?redirect=/${L}/quiz/topic/${numericId}`)}
          >
            {L === "it" ? "Accedi" : "Sign in"}
          </button>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────────
     COMING SOON (solo non-IT)
  ───────────────────────────────────────────────────────────── */
  const isComingSoon = topicTotal === 0 && L !== "it";
  if (isComingSoon) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <ComingSoonBox
          lang={L}
          fallbackLang="en"
          fallbackHref={`/en/quiz/topic/${numericId}`}
          browseHref={backToHref}
        />
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────────
     QUIZ ENGINE
  ───────────────────────────────────────────────────────────── */
  return (
    <QuizEngine
      lang={L}
      storageScope={`topic:${numericId}:${L}`}
      categoryColor="from-blue-900 to-blue-700"
      backToHref={backToHref}
      context={{
        kind: "topic",
        certificationName: certSlug ? certSlug.toUpperCase() : "CertifyQuiz",
        certificationSlug: certSlug ?? undefined,
        topicTitle: topicTitle ?? `Topic #${numericId}`,
        backHref: backToHref,
        backLabel:
          L === "it"
            ? "← Torna alla certificazione"
            : L === "es"
            ? "← Volver a la certificación"
            : L === "fr"
            ? "← Retour à la certification"
            : "← Back to certification",

        // ✅ GLOBAL AUTH/PREMIUM FLAGS
        isPremiumUser,
        premiumLocked,
      }}
      onFeedback={async ({ questionId, type, description }) => {
        const token = getAccessToken();
        if (!token) return;

        try {
          const res = await fetch("/api/backend/feedback", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              // ✅ backend /api/feedback si aspetta camelCase
              questionId,
              topicId: numericId,
              type,
              description: description?.trim() || "",
            }),
          });

          if (!res.ok) {
            const txt = await res.text().catch(() => "");
            throw new Error(`HTTP ${res.status} ${txt}`);
          }
        } catch (e) {
          console.error("🟥 feedback failed", e);
        }
      }}
      fetchQuestions={async (): Promise<UiQuestion[]> => {
        try {
          const res = await getQuestionsByTopic(numericId, L, { limit: 500, shuffle: false });

          const raw: ApiQuestion[] = Array.isArray(res) ? res : (res as any).questions;
          return (raw ?? []).map(normalizeQuestion);
        } catch (e: any) {
          if (e?.status === 401) {
            setNeedsLoginForQuestions(true);
            return [];
          }
          console.error("🟥 getQuestionsByTopic FAILED", e);
          return [];
        }
      }}
      durationsByMode={{
        training: null,
        exam: examSpec.durationSec,
      }}
      limitsByMode={{
        training: 500,
        exam: examSpec.questions,
      }}
      onFinish={async (s: QuizSummary & { mode: "training" | "exam"; attempts?: any[] }) => {
        if (s.mode !== "exam") return;

        const token = getAccessToken();
        if (!token) return;

        if (!certificationId) return;

        const rawAttempts = Array.isArray((s as any).attempts) ? (s as any).attempts : [];

        const payload = {
          topicId: numericId,
          certification_id: certificationId,
          totalQuestions: s.total ?? 0,
          correctAnswers: s.correct ?? 0,
          isExam: true,
          quizId: null,
          attempts: rawAttempts
            .filter((a: any) => a?.chosenAnswerId != null)
            .map((a: any) => ({
              question_id: Number(a.questionId),
              selected_answer_id: Number(a.chosenAnswerId),
            })),
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
            throw new Error(`HTTP ${res.status} ${txt}`);
          }
        } catch (e) {
          console.error("🟥 save-exam FAILED", e);
        }
      }}
    />
  );
}