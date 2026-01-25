// src/app/[lang]/quiz/topic/[topicId]/QuizTopicClient.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import QuizEngine from "@/components/quiz/QuizEngine";
import ComingSoonBox from "@/components/ui/ComingSoonBox";

// ✅ Premium: flags globali (ready-to-flip)
import { isPremiumLocked } from "@/lib/flags";

import type { Question as UiQuestion, Locale, QuizSummary } from "@/lib/quiz-types";

import {
  getQuestionsByTopic,
  type Question as ApiQuestion,
  getAccessToken,
  getTopicMetaById,
} from "@/lib/apiClient";

import { getCertSlugById } from "@/lib/certs";
import { getExamSpecForCert } from "@/lib/exam-specs";
import { getPremiumState } from "@/lib/premium";

// TODO futuro: sostituire con user reale da /me
const premium = getPremiumState({
  user: null, // anonimo o free
});

/* ─────────────────────────────────────────────────────────────
   NORMALIZZAZIONE DATI
   API → formato atteso dal QuizEngine
   (isola il frontend da cambi futuri del backend)
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

/**
 * Helper: fetch profilo utente (solo se loggato).
 * ------------------------------------------------
 * Scopo: sapere is_premium per preparare l'infrastruttura Premium.
 *
 * Regole prodotto (IMPORTANTI):
 * - Quiz è pubblico: mai redirect/login obbligatorio per “giocare”.
 * - Login serve solo per: salvataggio risultati e (in futuro) Premium.
 *
 * Nota tecnica:
 * - uso /api/backend/me perché nel tuo progetto hai proxy Next → backend.
 * - se l’endpoint non esiste o fallisce, semplicemente consideriamo l’utente non-premium.
 */
async function fetchMe(token: string): Promise<{ is_premium?: boolean | number } | null> {
  try {
    const res = await fetch("/api/backend/me", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as any;
  } catch {
    return null;
  }
}

export default function QuizTopicClient({ lang, topicId }: { lang: Locale; topicId: number }) {
  const router = useRouter();
  const L = lang;
  const numericId = topicId;

  /* ─────────────────────────────────────────────────────────────
     STATE (core)
  ───────────────────────────────────────────────────────────── */

  // Blocco solo per parametri invalidi (NON per auth)
  const [blocked, setBlocked] = useState(false);

  // Usato SOLO se l’endpoint domande risponde 401
  // (finché il backend /questions non è pubblico)
  const [needsLoginForQuestions, setNeedsLoginForQuestions] = useState(false);

  // Meta: servono per back link + exam spec + salvataggio risultati
  const [certificationId, setCertificationId] = useState<number | null>(null);
  const [backToHref, setBackToHref] = useState<string>(`/${L}/quiz-home`);

  // Header contestuale
  const [topicTitle, setTopicTitle] = useState<string | null>(null);
  const [certSlug, setCertSlug] = useState<string | null>(null);

  // Totale pool (light call) per capire “coming soon” sulle lingue non-IT
  const [topicTotal, setTopicTotal] = useState<number | null>(null);

  /* ─────────────────────────────────────────────────────────────
     STATE (Premium infra — NON paywall oggi)
  ───────────────────────────────────────────────────────────── */

  /**
   * isPremiumUser
   * ------------
   * Stato utente “premium” letto da /me (solo se loggato).
   * Serve per cablare fin da ora il flusso Premium (soft hooks).
   * Se non loggato o endpoint non disponibile → false.
   */
  const [isPremiumUser, setIsPremiumUser] = useState(false);

  /**
   * premiumLocked
   * ------------
   * Decisione finale di lock:
   * - Tiene conto dei flags globali (src/lib/flags.ts)
   * - Tiene conto dello stato utente (isPremiumUser)
   *
   * OGGI (config consigliata):
   * - PREMIUM_ENABLED=false → premiumLocked sarà sempre false (nessun blocco)
   * DOMANI (quando monetizzi):
   * - PREMIUM_ENABLED=true e PREMIUM_BETA_FREE=false
   * - premiumLocked diventa true per utenti free → attivi preview spiegazioni, ecc.
   */
  const premiumLocked = isPremiumLocked(isPremiumUser);

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
     🔥 DECISIONE DI PRODOTTO: QUIZ PUBBLICO
     - niente redirect/login per svolgere il quiz
     - login richiesto solo per:
       1) salvare risultati (già così)
       2) premium enforcement (in futuro)
  ───────────────────────────────────────────────────────────── */
  useEffect(() => {
    setBlocked(false);
  }, []);

  /* ─────────────────────────────────────────────────────────────
     PROFILO UTENTE (solo se token esiste)
     Serve esclusivamente a:
     - determinare isPremiumUser (infrastruttura Premium ready-to-flip)
     - NON deve bloccare il quiz se fallisce
  ───────────────────────────────────────────────────────────── */
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const token = getAccessToken();
      if (!token) {
        if (!cancelled) setIsPremiumUser(false);
        return;
      }

      const me = await fetchMe(token);

      // supporta boolean o 0/1
      const premium =
        me?.is_premium === true || me?.is_premium === 1 || (me as any)?.isPremium === true;

      if (!cancelled) setIsPremiumUser(!!premium);
    })();

    return () => {
      cancelled = true;
    };
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

        const t = meta?.topic;
        const title =
          (L === "it"
            ? t?.title_it
            : L === "en"
            ? t?.title_en
            : L === "fr"
            ? t?.title_fr
            : t?.title_es) ?? null;

        if (!cancelled) {
          setTopicTitle(title);

          if (typeof certId === "number") {
            setCertificationId(certId);

            const slug = getCertSlugById(certId);
            setCertSlug(slug ?? null);
            setBackToHref(slug ? `/${L}/quiz/${slug}` : `/${L}/quiz-home`);
          } else {
            setCertSlug(null);
            setBackToHref(`/${L}/quiz-home`);
          }
        }
      } catch {
        if (!cancelled) {
          setTopicTitle(null);
          setCertSlug(null);
          setBackToHref(`/${L}/quiz-home`);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [numericId, L]);

  /* ─────────────────────────────────────────────────────────────
     topicTotal (light call)
     Serve SOLO a capire se ESISTONO domande per questa lingua.
     - Se 401: backend protetto → NON possiamo dedurre "coming soon"
     - Se 200 ma vuoto: coming soon (per non-IT)
  ───────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (Number.isNaN(numericId)) return;

    let cancelled = false;

    (async () => {
      try {
        const res = await getQuestionsByTopic(numericId, L, {
          limit: 1,
          shuffle: false,
        });

        const poolTotalFromApi = (res as any)?.poolTotal;

        let total: number | null = null;

        if (typeof poolTotalFromApi === "number") {
          total = poolTotalFromApi;
        } else if (Array.isArray(res)) {
          total = res.length > 0 ? 1 : 0;
        } else if (Array.isArray((res as any)?.questions)) {
          total = (res as any).questions.length > 0 ? 1 : 0;
        }

        if (!cancelled) setTopicTotal(total);
      } catch {
        // backend protetto o errore: non possiamo stimare → lascia null
        if (!cancelled) setTopicTotal(null);
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
            onClick={() => router.push(`/${L}/login?redirect=/${L}/quiz/topic/${numericId}`)}
          >
            {L === "it" ? "Accedi" : "Sign in"}
          </button>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────────
     COMING SOON (topic senza domande nella lingua corrente)
     Regola:
     - se topicTotal === 0 e NON è IT → coming soon
     - IT è “sorgente”: non blocchiamo
  ───────────────────────────────────────────────────────────── */
  const isComingSoon = topicTotal === 0 && L !== "it";

  if (isComingSoon) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <ComingSoonBox
          lang={L}
          fallbackLang="en"
          // stessa pagina topic, ma in EN
          fallbackHref={`/en/quiz/topic/${numericId}`}
          // torna alla certificazione (se nota)
          browseHref={backToHref}
        />
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────────
   QUIZ ENGINE

   PREMIUM (IMPORTANT):
   -------------------
   QuizTopicClient prepara lo stato premium, ma:
   - il taglio spiegazione / preview
   - la CTA soft nel riepilogo
   - eventuali limiti (pool/varianti)
   DEVONO vivere dentro QuizEngine, perché lì si renderizzano:
   - explanation
   - summary finale
   - modalità speciali (training/exam/mock)

   Attivazione futura:
   - Abiliti i flag ENV (NEXT_PUBLIC_PREMIUM_*)
   - Colleghi user reale (es. /me)
   - QuizEngine usa:
     1) context.premiumLocked → preview explanation + CTA non invasiva
     2) context.isPremiumUser → badge/UI premium
     3) (opzionale) limiti extra su pool/varianti
───────────────────────────────────────────────────────────── */

// ✅ single source of truth (oggi: default ENV = 0 → premiumLocked false)
const premium = getPremiumState({
  // TODO: quando hai /me, passa qui { isPremium: true/false, plan: ... }
  user: null,
});

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

      // ✅ Premium hooks (ready-to-flip, non invasivo)
      isPremiumUser: premium.isPremiumUser,
      premiumLocked: premium.premiumLocked,
    }}
    /* ───────────── FETCH DOMANDE (ANTI-CRASH) ───────────── */
    fetchQuestions={async (): Promise<UiQuestion[]> => {
      try {
        /**
         * QUIZ PUBBLICO (target):
         * - idealmente endpoint NO AUTH
         * - se oggi risponde 401 → MAI crash, MAI redirect automatico
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
        // backend ancora protetto → UI soft login
        if (e?.status === 401) {
          setNeedsLoginForQuestions(true);
          return [];
        }

        // altri errori: non rilanciare MAI
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
