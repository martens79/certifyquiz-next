// src/app/[lang]/quiz/[slug]/mixed/page.tsx
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

/* --------------------------- normalize API → UI -------------------------- */
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

/* --------------------------- i18n microcopy --------------------------- */
type Copy = {
  title: (certName: string) => string;
  introA: string;
  introB: string;
  bullets: {
    a: string;
    b: string;
    c: string;
    // keywords (bold)
    k_mixed: string;
    k_pool: string;
    k_exam: string;
    k_timer: string;
    k_progress: string;
  };
  stats: {
    pool: string;
    trainingCap: string;
    exam: string;
    questions: string;
  };
};

const COPY: Record<Locale, Copy> = {
  it: {
    title: (certName) => `Quiz misto — ${certName}`,
    introA: 'Allenati con un',
    introB:
      'che combina domande da tutti i topic: perfetto per ripassare “a giro” e testare la preparazione complessiva.',
    bullets: {
      a: 'Allenamento: usa il',
      b: 'Esame: simulazione con',
      c: 'I',
      k_mixed: 'quiz misto',
      k_pool: 'pool completo',
      k_exam: 'numero domande realistico',
      k_timer: 'timer',
      k_progress: 'progressi',
    },
    stats: {
      pool: 'Pool',
      trainingCap: 'Cap allenamento',
      exam: 'Esame',
      questions: 'domande',
    },
  },
  en: {
    title: (certName) => `Mixed quiz — ${certName}`,
    introA: 'Practice with a',
    introB:
      'that combines questions from all topics: great for spaced review and a full readiness check.',
    bullets: {
      a: 'Training: uses the',
      b: 'Exam: simulation with an',
      c: '',
      k_mixed: 'mixed quiz',
      k_pool: 'full pool',
      k_exam: 'official-like question count',
      k_timer: 'timer',
      k_progress: 'progress',
    },
    stats: {
      pool: 'Pool',
      trainingCap: 'Training cap',
      exam: 'Exam',
      questions: 'questions',
    },
  },
  fr: {
    title: (certName) => `Quiz mixte — ${certName}`,
    introA: 'Entraînez-vous avec un',
    introB:
      'qui combine des questions de tous les sujets : idéal pour réviser et vérifier votre niveau global.',
    bullets: {
      a: 'Entraînement : utilise le',
      b: 'Examen : simulation avec un',
      c: 'Vos',
      k_mixed: 'quiz mixte',
      k_pool: 'pool complet',
      k_exam: 'nombre de questions proche de l’officiel',
      k_timer: 'chronomètre',
      k_progress: 'progrès',
    },
    stats: {
      pool: 'Pool',
      trainingCap: 'Plafond entraînement',
      exam: 'Examen',
      questions: 'questions',
    },
  },
  es: {
    title: (certName) => `Quiz mixto — ${certName}`,
    introA: 'Entrena con un',
    introB:
      'que combina preguntas de todos los temas: ideal para repasar y medir tu preparación general.',
    bullets: {
      a: 'Entrenamiento: usa el',
      b: 'Examen: simulación con',
      c: 'El',
      k_mixed: 'quiz mixto',
      k_pool: 'pool completo',
      k_exam: 'número de preguntas similar al oficial',
      k_timer: 'temporizador',
      k_progress: 'progreso',
    },
    stats: {
      pool: 'Pool',
      trainingCap: 'Límite entrenamiento',
      exam: 'Examen',
      questions: 'preguntas',
    },
  },
};

export default function MixedQuizPage() {
  const router = useRouter();
  const { lang, slug } = useParams<{ lang: Locale; slug: string }>();

  const currentLang = (lang ?? 'it') as Locale;
  const currentSlug = slug ?? '';
  const certId = IDS_BY_SLUG[currentSlug];

  const [mode, setMode] = useState<'training' | 'exam'>('training');
  const [poolTotal, setPoolTotal] = useState<number | null>(null);

  // Nome “leggibile”
  const certName = useMemo(() => currentSlug.replace(/-/g, ' '), [currentSlug]);
  const copy = COPY[currentLang] ?? COPY.it;

  // slug non mappato
  if (!certId) {
    return (
      <div className="mx-auto max-w-3xl p-6 text-center">
        <h1 className="text-lg font-semibold text-red-700">
          {currentLang === 'it'
            ? 'Quiz misto non disponibile'
            : currentLang === 'fr'
            ? 'Quiz mixte indisponible'
            : currentLang === 'es'
            ? 'Quiz mixto no disponible'
            : 'Mixed quiz not available'}
        </h1>
        <p className="mt-2 text-sm text-slate-700">
          {currentLang === 'it'
            ? 'Questa certificazione non è mappata in IDS_BY_SLUG.'
            : currentLang === 'fr'
            ? "Cette certification n'est pas mappée dans IDS_BY_SLUG."
            : currentLang === 'es'
            ? 'Esta certificación no está mapeada en IDS_BY_SLUG.'
            : 'This certification is not mapped in IDS_BY_SLUG.'}
        </p>
      </div>
    );
  }

  /* Tolto questo pezzo per consentire il free login per Seo -----
   ---------------------------- auth redirect ---------------------------- 
  useEffect(() => {
    const tok = getAccessToken();
    if (!tok) {
      router.replace(
        `/${currentLang}/login?redirect=/${currentLang}/quiz/${currentSlug}/mixed`
      );
    }
  }, [currentLang, currentSlug, router]);       
     */

  /* --------------------- poolTotal (light call) --------------------- */
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await getMixedQuestions(certId, currentLang, {
          limit: 1,
          shuffle: false,
          strict: currentLang !== 'it',
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

  // ------------------------- pool sizing + caps -------------------------
  // Pool size (quanto è grande davvero il pool) — per stats + examSpec (safety coerente col backend)
  const poolSize = useMemo(() => {
    if (poolTotal == null) return 500; // fallback mentre carica
    return Math.min(poolTotal, 5000); // safety
  }, [poolTotal]);

  // Training cap (quante domande per sessione training) — NOTA: diverso dal pool
  const TRAINING_CAP = 40;

  const trainingCap = useMemo(() => {
    return Math.min(TRAINING_CAP, poolSize);
  }, [poolSize]);

  const examSpec = useMemo(() => {
    return getExamSpecForCert(certId, poolSize);
  }, [certId, poolSize]);

  /* ------------------------- fetch pool for engine ------------------------- */
  const fetchPool = useCallback(async (): Promise<UiQuestion[]> => {
    const effectiveLimit =
      mode === 'exam' ? Math.max(1, examSpec.questions) : trainingCap;

    const res = await getMixedQuestions(certId, currentLang, {
      limit: effectiveLimit,
      shuffle: true,
      strict: currentLang !== 'it', // ✅ NO fallback EN/FR/ES
    });

    const raw: ApiQuestion[] = Array.isArray(res)
      ? (res as any)
      : (res as any).questions ?? [];

    return raw.map(normalizeMixedQuestion);
  }, [certId, currentLang, trainingCap, mode, examSpec.questions]);

  return (
    <div className="min-h-screen">
      {/* Intro box (SEO + UX) */}
      <div className="mx-auto max-w-5xl px-4 pt-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5 shadow-sm">
          <h1 className="text-xl md:text-2xl font-semibold">
            {copy.title(certName)}
          </h1>

          <p className="mt-2 text-sm md:text-base text-slate-700">
            {copy.introA}{' '}
            <strong>{copy.bullets.k_mixed}</strong>{' '}
            {copy.introB}
          </p>

          <ul className="mt-4 grid gap-1 text-sm text-slate-700 list-disc pl-5">
            <li>
              {copy.bullets.a}{' '}
              <strong>{copy.bullets.k_pool}</strong>
              {currentLang === 'en' ? '' : '.'}
            </li>
            <li>
              {copy.bullets.b}{' '}
              <strong>{copy.bullets.k_exam}</strong> +{' '}
              <strong>{copy.bullets.k_timer}</strong>.
            </li>
            <li>
              {copy.bullets.c}{' '}
              <strong>{copy.bullets.k_progress}</strong>{' '}
              {currentLang === 'it'
                ? 'vengono salvati (se sei loggato).'
                : currentLang === 'fr'
                ? 'sont sauvegardés (si vous êtes connecté).'
                : currentLang === 'es'
                ? 'se guardan (si inicias sesión).'
                : 'is saved (when logged in).'}
            </li>
          </ul>

          <div className="mt-3 text-xs text-slate-500">
            {copy.stats.pool}:{' '}
            <span className="font-semibold">
              {poolTotal == null ? '…' : poolTotal.toLocaleString()}
            </span>{' '}
            · {copy.stats.trainingCap}:{' '}
            <span className="font-semibold">{trainingCap.toLocaleString()}</span>{' '}
            · {copy.stats.exam}:{' '}
            <span className="font-semibold">
              {examSpec.questions.toLocaleString()} {copy.stats.questions}
            </span>
          </div>
        </div>
      </div>

       {/* Quiz */}
  <QuizEngine
    key={`${currentSlug}:${currentLang}`} // ✅ non includere mode nella key
    lang={currentLang}
    storageScope={`mixed:${currentSlug}:${currentLang}`}
    categoryColor="from-blue-900 to-blue-700"
    context={{
      kind: "mixed",
      certificationName: currentSlug.toUpperCase(),
      certificationSlug: currentSlug,
      backHref: withLang(currentLang, `/quiz/${currentSlug}`),
      backLabel:
        currentLang === "it"
          ? "← Torna alla certificazione"
          : currentLang === "es"
          ? "← Volver a la certificación"
          : currentLang === "fr"
          ? "← Retour à la certification"
          : "← Back to certification",
    }}
    initialMode={mode}
    durationsByMode={{
      training: undefined,
      exam: examSpec.durationSec,
    }}
    limitsByMode={{
      training: trainingCap,
      exam: examSpec.questions,
    }}
    onModeChange={(m) => setMode(m)}
    fetchQuestions={async () => {
      try {
        return await fetchPool();
      } catch (e: any) {
        if (e?.status === 401) {
          // Non forziamo login: quiz pubblico.
          // Mostra semplicemente zero domande o un messaggio (meglio: setErr in QuizEngine)
          return [];
        }

        throw e;
      }
    }}
    onFinish={async (s: any) => {
      try {
        const finishedMode: "training" | "exam" =
          s?.mode === "exam" || s?.mode === "training" ? s.mode : mode;

        await saveExam({
          certification_id: certId,
          totalQuestions: s.total,
          correctAnswers: s.correct,
          isExam: finishedMode === "exam",
        });
      } catch {
        // best-effort
      }
    }}
    backToHref={withLang(currentLang, `/quiz/${currentSlug}`)}
  />
</div>
);
}
