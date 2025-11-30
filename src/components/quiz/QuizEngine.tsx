'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Answer, Question, QuizSummary, Locale } from '@/lib/quiz-types';
import { loadProgress, saveProgress, clearProgress } from '@/lib/quiz-storage';

type Props = {
  lang: Locale;
  // carica le domande
  fetchQuestions: () => Promise<Question[]>;
  // chiave unica per l’autosave locale (es. "topic:17:it" o "mixed:2:it")
  storageScope: string;
  // UI
  categoryColor?: string;
  initialMode?: 'training' | 'exam';
  // TIMER: se null → nessun timer; se undefined → 60s * numero domande
  durationSec?: number | null;
  // callback di salvataggio su backend quando si chiude l’esame
  onFinish?: (summary: QuizSummary) => Promise<void> | void;
};

export default function QuizEngine({
  lang,
  fetchQuestions,
  storageScope,
  categoryColor = 'from-blue-900 to-blue-700',
  initialMode = 'training',
  durationSec,
  onFinish,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [mode, setMode] = useState<'training' | 'exam'>(initialMode);
  const [marked, setMarked] = useState<Record<string | number, string | number | null>>({});
  const [reviewLater, setReviewLater] = useState<Set<string | number>>(new Set());
  const [finished, setFinished] = useState(false);
  const [lastSummary, setLastSummary] = useState<QuizSummary | null>(null);

  // timer
  const [remaining, setRemaining] = useState<number | null>(null);
  const tickRef = useRef<number | null>(null);
  const startedAtRef = useRef<number | null>(null);

  // LOAD
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErr(null);

    (async () => {
      try {
        const qs = await fetchQuestions();
        if (!alive) return;
        setQuestions(qs ?? []);

        // prepara timer
        const total = durationSec === null ? null : (durationSec ?? (qs.length * 60));

        // tenta ripristino locale
        const persisted = loadProgress(storageScope);
        if (persisted && arraysEqual(persisted.qIds, qs.map((q) => q.id))) {
          setMode(persisted.mode);
          setMarked(persisted.marked);
          setReviewLater(new Set(persisted.reviewLater));
          setRemaining(total == null ? null : Math.min(total, persisted.remainingSec ?? total));
          startedAtRef.current = persisted.startedAt ?? null;
        } else {
          setMode(initialMode);
          setMarked({});
          setReviewLater(new Set());
          setRemaining(total);
          startedAtRef.current = null;
          clearProgress(storageScope);
        }
      } catch (e: any) {
        if (!alive) return;
        setErr(e?.message || 'Load error');
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchQuestions, storageScope]);

  // TICK (solo in exam con timer attivo)
  useEffect(() => {
    if (mode !== 'exam' || remaining == null || finished) {
      if (tickRef.current) cancelAnimationFrame(tickRef.current);
      tickRef.current = null;
      return;
    }
    if (startedAtRef.current == null) startedAtRef.current = Date.now();

    const total = durationSec ?? questions.length * 60;

    const loop = () => {
      tickRef.current = requestAnimationFrame(loop);
      const elapsed = Math.floor((Date.now() - (startedAtRef.current || Date.now())) / 1000);
      const rest = Math.max(0, total - elapsed);
      setRemaining(rest);
      if (rest === 0) {
        // tempo scaduto
        if (tickRef.current) cancelAnimationFrame(tickRef.current);
        tickRef.current = null;
        doFinish(true);
      }
    };
    loop();

    return () => {
      if (tickRef.current) cancelAnimationFrame(tickRef.current);
      tickRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, remaining, finished, durationSec, questions.length]);

  // AUTOSAVE locale ad ogni cambiamento significativo
  useEffect(() => {
    const payload = {
      qIds: questions.map((q) => q.id),
      marked,
      reviewLater: Array.from(reviewLater),
      mode,
      remainingSec: remaining,
      startedAt: startedAtRef.current,
    };
    // piccolo debounce “frame” gratis
    const id = requestAnimationFrame(() => saveProgress(storageScope, payload));
    return () => cancelAnimationFrame(id);
  }, [questions, marked, reviewLater, mode, remaining, storageScope]);

  const answeredCount = useMemo(
    () => Object.values(marked).filter((v) => v != null).length,
    [marked]
  );

  const hasUnanswered = useMemo(
    () => questions.some((q) => marked[q.id] === undefined || marked[q.id] === null),
    [questions, marked]
  );

  const choose = (q: Question, a: Answer) => {
    setMarked((m) => ({ ...m, [q.id]: a.id }));
  };

  const next = () => setIdx((i) => Math.min(i + 1, questions.length - 1));
  const prev = () => setIdx((i) => Math.max(i - 1, 0));

  const toggleReviewLater = (qId: Question['id']) => {
    setReviewLater((old) => {
      const n = new Set(old);
      if (n.has(qId)) n.delete(qId);
      else n.add(qId);
      return n;
    });
  };

  const goToFirstUnanswered = () => {
    const pos = questions.findIndex(
      (q) => marked[q.id] === undefined || marked[q.id] === null
    );
    if (pos >= 0) setIdx(pos);
  };

  const scorePct = useMemo(() => {
    if (!questions.length) return 0;
    let ok = 0;
    for (const q of questions) {
      const chosen = marked[q.id];
      const right = q.answers.find((a) => a.isCorrect)?.id;
      if (chosen != null && right != null && chosen === right) ok++;
    }
    return Math.round((ok / questions.length) * 100);
  }, [marked, questions]);

  async function doFinish(timeExpired = false) {
    setFinished(true);
    const total = questions.length;
    const correct = Math.round((scorePct / 100) * total);
    const elapsedSec =
      startedAtRef.current != null
        ? Math.floor((Date.now() - startedAtRef.current) / 1000)
        : 0;

    const summary: QuizSummary = {
      total,
      correct,
      scorePct,
      marked,
      durationSec: elapsedSec,
    };

    setLastSummary(summary);

    // salva su backend (best-effort)
    try {
      await onFinish?.(summary);
    } catch {
      /* ignore */
    }
    // pulisci autosave
    clearProgress(storageScope);
  }

  const restart = () => {
    setIdx(0);
    setMarked({});
    setReviewLater(new Set());
    setFinished(false);
    setLastSummary(null);
    startedAtRef.current = null;
    setMode('training');
    const total = durationSec === null ? null : durationSec ?? questions.length * 60;
    setRemaining(total);
    clearProgress(storageScope);
  };

  // UI base
  if (loading) return <div className="min-h-screen grid place-items-center">⏳</div>;
  if (err) return <div className="min-h-screen grid place-items-center text-red-600">{err}</div>;
  if (!questions.length) return <div className="min-h-screen grid place-items-center">No questions.</div>;

  const gradient = `bg-gradient-to-b ${categoryColor} text-white`;

  // UI riepilogo finale
  if (finished) {
    const total = lastSummary?.total ?? questions.length;
    const correct = lastSummary?.correct ?? 0;
    const wrong = total - correct;
    const duration =
      lastSummary && lastSummary.durationSec
        ? fmt(lastSummary.durationSec)
        : '--:--';

    return (
      <div className={`min-h-screen ${gradient}`}>
        <div className="mobile-safe-top max-w-3xl mx-auto px-4 pt-20 pb-28">
          <div className="bg-white text-gray-900 rounded-2xl shadow-xl p-6 space-y-4">
            <h1 className="text-2xl font-semibold mb-2">
              {label('summaryTitle', lang)}
            </h1>
            <p className="text-sm text-gray-600">
              {label('score', lang)} {scorePct}% · {total} {label('questionsLabel', lang)}
            </p>

            <div className="grid grid-cols-3 gap-3 text-center text-sm">
              <div className="bg-emerald-50 rounded-xl p-3">
                <div className="text-xs uppercase text-emerald-700">
                  {label('correctLabel', lang)}
                </div>
                <div className="text-xl font-semibold text-emerald-900">
                  {correct}
                </div>
              </div>
              <div className="bg-red-50 rounded-xl p-3">
                <div className="text-xs uppercase text-red-700">
                  {label('wrongLabel', lang)}
                </div>
                <div className="text-xl font-semibold text-red-900">
                  {wrong}
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-xs uppercase text-slate-700">
                  {label('durationLabel', lang)}
                </div>
                <div className="text-xl font-semibold text-slate-900">
                  {duration}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 justify-end pt-2">
              <button
                className="px-4 py-2 rounded-lg bg-white/10 text-sm"
                onClick={restart}
              >
                {label('restart', lang)}
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-white/10 text-sm"
                onClick={() => router.push(`/${lang}/quiz-home`)}
              >
                {label('backToQuizHome', lang)}
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-white/10 text-sm"
                onClick={() => router.push(`/${lang}/profile`)}
              >
                {label('seeProfile', lang)}
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm"
                onClick={() => router.push(`/${lang}/prezzi`)}
              >
                {label('seePremium', lang)}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // UI quiz normale
  const q = questions[idx];
  const isExam = mode === 'exam';
  const chosen = marked[q.id];

  return (
    <div className={`min-h-screen ${gradient}`}>
      <div className="mobile-safe-top max-w-5xl mx-auto px-4 pt-20 pb-28">
        {/* header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="text-sm opacity-90">
            {label('question', lang)} {idx + 1}/{questions.length} ·{' '}
            {label('answered', lang)} {answeredCount}
            {isExam && (
              <>
                {' '}
                · {label('score', lang)} {scorePct}%{' '}
                {remaining != null && (
                  <>
                    · ⏱ {fmt(remaining)}
                  </>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              className={`px-3 py-1.5 rounded-full text-sm ${
                !isExam ? 'bg-emerald-500' : 'bg-white/10'
              }`}
              onClick={() => setMode('training')}
            >
              {label('training', lang)}
            </button>
            <button
              className={`px-3 py-1.5 rounded-full text-sm ${
                isExam ? 'bg-emerald-500' : 'bg-white/10'
              }`}
              onClick={() => setMode('exam')}
            >
              {label('exam', lang)}
            </button>
          </div>
        </div>

        {/* domanda */}
        <div className="bg-white text-gray-900 rounded-2xl shadow-lg p-5 mb-4">
          <p className="font-medium">{q.question}</p>
        </div>

        {/* risposte */}
        <div className="space-y-3">
          {q.answers.map((a) => {
            const isChosen = chosen === a.id;
            const isRight = a.isCorrect === true;
            const showFeedback = !isExam && chosen != null;

            return (
              <button
                key={String(a.id)}
                onClick={() => choose(q, a)}
                className={`w-full text-left rounded-2xl px-4 py-3 transition border-2
                  ${
  isChosen
    ? 'bg-emerald-500 text-white border-2 border-white shadow-[0_0_10px_rgba(255,255,255,0.5)] scale-[1.01]'
    : 'bg-white text-gray-900 border border-white/20 hover:bg-white/90'
}

                `}
              >
                {a.text}
                {showFeedback && (
                  <span className="ml-2 text-xs opacity-80">
                    {isRight ? '✓' : isChosen ? '✗' : ''}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* spiegazione (training) */}
        {!isExam && chosen != null && q.explanation && (
          <div className="mt-4 bg-white/10 rounded-xl p-4 text-sm">
            <b>{label('explain', lang)}</b> {q.explanation}
          </div>
        )}

        {/* footer nav */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              className="px-4 py-2 rounded-lg bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={prev}
              disabled={idx === 0}
            >
              ‹ {label('back', lang)}
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={next}
              disabled={idx === questions.length - 1}
            >
              {label('next', lang)} ›
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="px-4 py-2 rounded-lg bg-white/10"
              onClick={() => toggleReviewLater(q.id)}
            >
              {label('review', lang)} {reviewLater.has(q.id) ? '★' : '☆'}
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={goToFirstUnanswered}
              disabled={!hasUnanswered}
            >
              {label('gotoUn', lang)}
            </button>
            {isExam ? (
              <button
                className="px-4 py-2 rounded-lg bg-red-500"
                onClick={() => doFinish(false)}
              >
                {label('finish', lang)}
              </button>
            ) : (
              <button
                className="px-4 py-2 rounded-lg bg-white/10"
                onClick={restart}
              >
                {label('restart', lang)}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== helpers ===== */
function arraysEqual(a: Array<any>, b: Array<any>) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (String(a[i]) !== String(b[i])) return false;
  return true;
}

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, '0')}`;
}

function label(key: keyof typeof L, lang: Locale) {
  return L[key][lang] ?? L[key].it;
}

const L = {
  training: { it: 'Allenamento', en: 'Training', fr: 'Entraînement', es: 'Entrenamiento' },
  exam: { it: 'Esame', en: 'Exam', fr: 'Examen', es: 'Examen' },
  question: { it: 'Domanda', en: 'Question', fr: 'Question', es: 'Pregunta' },
  answered: { it: 'Risposte date', en: 'Answered', fr: 'Répondues', es: 'Respondidas' },
  back: { it: 'Indietro', en: 'Back', fr: 'Retour', es: 'Atrás' },
  next: { it: 'Avanti', en: 'Next', fr: 'Suiv.', es: 'Siguiente' },
  restart: { it: 'Ricomincia', en: 'Restart', fr: 'Recommencer', es: 'Reiniciar' },
  finish: { it: 'Termina esame', en: 'Finish exam', fr: 'Terminer', es: 'Terminar' },
  explain: { it: 'Spiegazione:', en: 'Explanation:', fr: 'Explication :', es: 'Explicación:' },
  review: { it: 'Rivedi dopo', en: 'Review later', fr: 'Revoir plus tard', es: 'Revisar después' },
  gotoUn: {
    it: 'Vai alla prima non risolta',
    en: 'Go to first unanswered',
    fr: 'Aller à la première non répondue',
    es: 'Ir a la primera sin responder',
  },
  score: { it: 'Punteggio', en: 'Score', fr: 'Score', es: 'Puntuación' },

  // Riepilogo
  summaryTitle: {
    it: 'Risultato esame',
    en: 'Exam summary',
    fr: 'Résumé de l’examen',
    es: 'Resumen del examen',
  },
  questionsLabel: {
    it: 'domande',
    en: 'questions',
    fr: 'questions',
    es: 'preguntas',
  },
  correctLabel: {
    it: 'Corrette',
    en: 'Correct',
    fr: 'Correctes',
    es: 'Correctas',
  },
  wrongLabel: {
    it: 'Errate',
    en: 'Wrong',
    fr: 'Fausses',
    es: 'Incorrectas',
  },
  durationLabel: {
    it: 'Durata',
    en: 'Duration',
    fr: 'Durée',
    es: 'Duración',
  },
  backToQuizHome: {
    it: 'Torna ai quiz',
    en: 'Back to quizzes',
    fr: 'Retour aux quiz',
    es: 'Volver a los cuestionarios',
  },
  seeProfile: {
    it: 'Vai al profilo',
    en: 'Go to profile',
    fr: 'Aller au profil',
    es: 'Ir al perfil',
  },
  seePremium: {
    it: 'Scopri Premium',
    en: 'See Premium',
    fr: 'Découvrir Premium',
    es: 'Descubrir Premium',
  },
};
