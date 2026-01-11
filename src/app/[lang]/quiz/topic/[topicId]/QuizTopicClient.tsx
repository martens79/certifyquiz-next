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

/* ─────────────────────────────────────────────────────────────
   NORMALIZZAZIONE DATI
   API → formato atteso dal QuizEngine
   (serve per isolare il backend da eventuali cambi futuri)
───────────────────────────────────────────────────────────── */
function normalizeQuestion(q: ApiQuestion): UiQuestion {
  return {
    id: q.id,
    question: q.question ?? "",
    // explanation può essere undefined → training la mostra solo se presente
    explanation: q.explanation ?? undefined,
    answers: (q.answers ?? []).map((a) => ({
      id: a.id,
      text: (a as any).text ?? "",
      isCorrect: a.is_correct === true || a.is_correct === 1,
    })),
  };
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

  /* ─────────────────────────────────────────────────────────────
     STATE
  ───────────────────────────────────────────────────────────── */

  // blocco solo per parametri invalidi (NON per auth)
  const [blocked, setBlocked] = useState(false);

  // usato SOLO se l’endpoint domande risponde 401
  // (finché il backend non è pubblico)
  const [needsLoginForQuestions, setNeedsLoginForQuestions] = useState(false);

  // servono per:
  // - salvare risultati sulla certificazione corretta
  // - costruire link "torna ai quiz"
  // - applicare exam spec ufficiale
  const [certificationId, setCertificationId] = useState<number | null>(null);
  const [backToHref, setBackToHref] = useState<string>(`/${L}/quiz-home`);

  /* ─────────────────────────────────────────────────────────────
     VALIDAZIONE PARAMETRI BASE
     (QUI sì redirect: topicId invalido)
  ───────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (Number.isNaN(numericId)) {
      setBlocked(true);
      router.replace(`/${L}/quiz-home`);
    }
  }, [numericId, router, L]);

  /* ─────────────────────────────────────────────────────────────
     🔥 DECISIONE DI PRODOTTO
     QUIZ PUBBLICO → NIENTE REDIRECT LOGIN
     Il login verrà richiesto SOLO:
     - per salvare risultati
     - per premium / spiegazioni complete
  ───────────────────────────────────────────────────────────── */
  useEffect(() => {
    // niente auth check qui
    setBlocked(false);
  }, []);

  /* ─────────────────────────────────────────────────────────────
     METADATA TOPIC → certificazione + link "indietro"
  ───────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (Number.isNaN(numericId)) return;

    let cancelled = false;

    (async () => {
      try {
        const meta = await getTopicMetaById(numericId);
        const certId = meta?.topic?.certification_id;

        if (!cancelled && typeof certId === "number") {
          setCertificationId(certId);

          const slug = getCertSlugById(certId);
          setBackToHref(slug ? `/${L}/quiz/${slug}` : `/${L}/quiz-home`);
        }
      } catch {
        if (!cancelled) setBackToHref(`/${L}/quiz-home`);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [numericId, L]);

  /* ─────────────────────────────────────────────────────────────
     SE BLOCCATO (parametri rotti) → niente render
  ───────────────────────────────────────────────────────────── */
  if (blocked || Number.isNaN(numericId)) return null;

  /* ─────────────────────────────────────────────────────────────
     EXAM SPEC UFFICIALE
     - training: pool grande
     - exam: numero + tempo ufficiale certificazione
  ───────────────────────────────────────────────────────────── */
  const examSpec = useMemo(() => {
    // fallback safe: 90 domande se cert non mappata
    return getExamSpecForCert(certificationId, 90);
  }, [certificationId]);

  /* ─────────────────────────────────────────────────────────────
     UI SOFT LOGIN
     (temporanea, finché /questions non è pubblico)
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
            onClick={() =>
              router.push(`/${L}/login?redirect=/${L}/quiz/topic/${numericId}`)
            }
          >
            {L === "it" ? "Accedi" : "Sign in"}
          </button>
        </div>
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

      /* ───────────── FETCH DOMANDE (ANTI-CRASH) ───────────── */
      fetchQuestions={async (): Promise<UiQuestion[]> => {
        try {
          /**
           * QUIZ PUBBLICO:
           * - idealmente endpoint NO AUTH
           * - se oggi risponde 401 → MAI crash, MAI redirect
           */
          const res = await getQuestionsByTopic(numericId, L, {
            limit: 500,
            shuffle: false,
          });

          const raw: ApiQuestion[] = Array.isArray(res)
            ? res
            : (res as any).questions;

          return (raw ?? []).map(normalizeQuestion);
        } catch (e: any) {
          // 🔒 backend ancora protetto → UI soft login
          if (e?.status === 401) {
            setNeedsLoginForQuestions(true);
            return [];
          }

          // 🛡️ altri errori: non rilanciare MAI
          console.error("🟥 getQuestionsByTopic FAILED", e);
          return [];
        }
      }}

      /* ───────────── TIMER PER MODALITÀ ───────────── */
      durationsByMode={{
        training: null, // niente timer in training
        exam: examSpec.durationSec,
      }}

      /* ───────────── NUMERO DOMANDE ───────────── */
      limitsByMode={{
        training: 500, // pool grande
        exam: examSpec.questions,
      }}

      /* ───────────── SALVATAGGIO RISULTATI ───────────── */
      onFinish={async (s: QuizSummary & { mode: "training" | "exam" }) => {
        // salviamo solo esame
        if (s.mode !== "exam") return;

        const token = getAccessToken();
        if (!token) return; // anonimo → niente salvataggio

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
            throw new Error(`HTTP ${res.status} ${txt}`);
          }
        } catch (e) {
          console.error("🟥 save-exam FAILED", e);
        }
      }}
    />
  );
}
