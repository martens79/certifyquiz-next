// src/components/quiz/QuizEngine.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Answer, Question, QuizSummary, Locale } from '@/lib/quiz-types';
import { loadProgress, saveProgress, clearProgress } from '@/lib/quiz-storage';
import { withLang, getDict } from '@/lib/i18n';



type Mode = 'training' | 'exam';

type Props = {
  lang: Locale;

  /**
   * Carica IL POOL di domande (idealmente tutte o molte, es. 500 max).
   * Poi l’engine decide quante usarne in training/exam.
   */
  fetchQuestions: () => Promise<Question[]>;

  /**
   * Chiave base per autosave locale.
   * Nota: internamente l’engine separa training vs exam usando storageScope + ":" + mode
   * così non si “sporcano” a vicenda.
   */
  storageScope: string;

  // UI
  categoryColor?: string;
  initialMode?: Mode;

  /**
   * TIMER (legacy):
   * - se usi solo questo: comportamento vecchio (durationSec totale o qs.length * 60)
   * - se invece passi durationsByMode, quello vince.
   */
  durationSec?: number | null;

  /**
   * ✅ Nuovo: timer diverso per training vs exam
   * - exam: di solito durata ufficiale (es. 90 min)
   * - training: puoi mettere null (no timer) o undefined (60s * domande)
   */
  durationsByMode?: Partial<Record<Mode, number | null>>;

  /**
   * ✅ Nuovo: numero domande diverso per training vs exam
   * - exam: numero ufficiale (es. 90)
   * - training: 200 / 500 / tutto il pool
   */
  limitsByMode?: Partial<Record<Mode, number>>;

  /** callback best-effort quando finisce (di solito salva risultato su backend) */
  onFinish?: (summary: QuizSummary & { mode: Mode }) => Promise<void> | void;

  /** URL per tornare indietro */
  backToHref?: string;

  /** opzionale: notifica quando cambia modalità */
  onModeChange?: (mode: Mode) => void;
};

export default function QuizEngine({
  lang,
  fetchQuestions,
  storageScope,
  categoryColor = 'from-blue-900 to-blue-700',
  initialMode = 'training',
  durationSec,
  durationsByMode,
  limitsByMode,
  onFinish,
  backToHref,
  onModeChange,
}: Props) {
  const router = useRouter();

  // 📘 Dizionario i18n del Quiz (badge modalità, timer, micro-messaggi)
// Le stringhe sono centralizzate in src/lib/i18n.ts → dict[lang].quiz
const tQuiz = getDict(lang).quiz;

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  /** Pool completo (training vede tutto, exam ne pesca un sottoinsieme) */
  const [pool, setPool] = useState<Question[]>([]);

  /** Modalità corrente */
  const [mode, setMode] = useState<Mode>(initialMode);

  /** Domande ATTIVE (dipendono da mode: training=pool, exam=subset) */
  const [questions, setQuestions] = useState<Question[]>([]);

  /** Indice domanda corrente */
  const [idx, setIdx] = useState(0);

  const [reviewMode, setReviewMode] = useState(false);

  // q.id -> answer.id | null
  const [marked, setMarked] = useState<Record<string | number, string | number | null>>({});
  const [reviewLater, setReviewLater] = useState<Set<string | number>>(new Set());

  const [finished, setFinished] = useState(false);
  const [lastSummary, setLastSummary] = useState<(QuizSummary & { mode: Mode }) | null>(null);

  // timer
  const [remaining, setRemaining] = useState<number | null>(null);
  const tickRef = useRef<number | null>(null);
  const startedAtRef = useRef<number | null>(null);

  /**
   * Storage scope separato per modalità:
   * - topic:65:en:training
   * - topic:65:en:exam
   */
  const scopedKey = `${storageScope}:${mode}`;

  /* -------------------- helpers: limit + duration -------------------- */

  const effectiveLimit = useMemo(() => {
    const lim = limitsByMode?.[mode];
    if (!lim) return undefined;
    return Math.max(1, lim);
  }, [limitsByMode, mode]);

  const effectiveDuration = useMemo(() => {
    // 1) se hai durationsByMode → usa quello
    if (durationsByMode && durationsByMode[mode] !== undefined) {
      return durationsByMode[mode] as number | null;
    }
    // 2) fallback legacy
    return durationSec;
  }, [durationsByMode, durationSec, mode]);

  /** Pesca subset per EXAM: shuffle del pool e slice a limit */
  function buildActiveQuestions(p: Question[], m: Mode): Question[] {
    if (!p?.length) return [];

    if (m === 'training') {
      // training: usa tutto il pool (o un limite se lo vuoi)
      if (!limitsByMode?.training) return p;
      return p.slice(0, Math.min(p.length, limitsByMode.training));
    }

    // exam: subset con limit
    const target = effectiveLimit ?? p.length;
    const n = Math.min(p.length, target);

    // shuffle in memoria (non mutare il pool)
    const copy = [...p];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, n);
  }

    /* -------------------- LOAD POOL + RIPRISTINO PER MODE -------------------- */
  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      setErr(null);

      try {
        const qs = await fetchQuestions();
        if (!alive) return;

        const poolQ = Array.isArray(qs) ? qs : [];
        setPool(poolQ);

        const active = buildActiveQuestions(poolQ, mode);
        setQuestions(active);

        const total =
          effectiveDuration === null ? null : effectiveDuration ?? active.length * 60;

        const persisted = loadProgress(scopedKey);

        const activeIds = active.map((q) => q.id);
        const canRestore =
          persisted &&
          Array.isArray((persisted as any).qIds) &&
          arraysEqual((persisted as any).qIds, activeIds);

        if (canRestore) {
          const p: any = persisted;

          setMarked(p.marked ?? {});
          setReviewLater(new Set(p.reviewLater ?? []));
          setIdx(Math.min(p.idx ?? 0, Math.max(0, active.length - 1)));

          if (total == null) setRemaining(null);
          else setRemaining(Math.min(total, p.remainingSec ?? total));

          startedAtRef.current = p.startedAt ?? null;
        } else {
          setMarked({});
          setReviewLater(new Set());
          setIdx(0);
          setRemaining(total);
          startedAtRef.current = null;
          clearProgress(scopedKey);
        }

        setFinished(false);
        setLastSummary(null);
        setReviewMode(false);
      } catch (e: unknown) {
        if (!alive) return;

        const err: any = e;
        const status: number | undefined =
          typeof err?.status === "number" ? err.status : undefined;

        if (status === 401) {
          setErr(
            lang === "it"
              ? "Non sei loggato su questo dispositivo. Accedi per salvare progressi e sbloccare le funzioni premium."
              : "You are not logged in. Sign in to save progress and unlock premium features."
          );
          return;
        }

        setErr(
          typeof err?.message === "string" && err.message.trim()
            ? err.message
            : "Load error"
        );
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchQuestions, scopedKey, mode, effectiveDuration, effectiveLimit]);

  /* -------------------- MODE SWITCH (notifica + rebuild subset exam) -------------------- */
  const setModeSafe = (m: Mode) => {
    if (m === mode) return;
    if (Object.keys(marked).length > 0) return;

  clearProgress(storageScope);

    // quando cambi modalità: azzera timer/progress della modalità “nuova” se vuoi
    setMode(m);
    onModeChange?.(m);

    // reset indice immediato (evita flash su idx vecchio)
    setIdx(0);
    setReviewMode(false);
    startedAtRef.current = null;
  };
/* -------------------------------------------------------------
   TIMER EXAM — INIT + TICK (FIX doppio click + effect stabile)
   -------------------------------------------------------------
   Problema (prima):
   - in training `remaining` è null
   - al primo click su EXAM il timer non partiva perché il tick effect
     usciva subito (remaining == null)
   - inoltre il tick effect dipendeva da `remaining` → si ri-attivava
     continuamente e poteva creare comportamento "a rimbalzo"

   Soluzione (ora):
   1) Quando entri in EXAM:
      - resettiamo startedAt
      - inizializziamo remaining con la durata totale (se era null)
   2) Quando esci da EXAM:
      - stop del RAF
      - reset remaining + startedAt
   3) Tick timer stabile:
      - NON dipende da `remaining`
      - un solo loop RAF che aggiorna `remaining` via setState
------------------------------------------------------------- */

/* ----------------------- INIT / CLEAN ON MODE ------------------------ */
useEffect(() => {
  if (mode === "exam") {
    // Reset start time: l'esame riparte "da zero" al primo ingresso in exam
    startedAtRef.current = null;

    // Durata totale:
    // - null => timer disattivato
    // - numero => secondi totali
    const total =
      effectiveDuration === null
        ? null
        : (effectiveDuration ?? questions.length * 60);

    // Se timer disattivato, non inizializziamo nulla
    if (total == null) return;

    // ✅ FIX CHIAVE: se arrivi dal training, remaining è null → lo settiamo ORA
    setRemaining((prev) => (prev == null ? total : prev));
    return;
  }

  // Uscendo da exam → stop loop + pulizia stato timer
  if (tickRef.current) cancelAnimationFrame(tickRef.current);
  tickRef.current = null;
  startedAtRef.current = null;
  setRemaining(null);
}, [mode, effectiveDuration, questions.length]);

/* ------------------------------ TICK --------------------------------- */
useEffect(() => {
  // Timer attivo solo in exam e se non abbiamo finito
  if (mode !== "exam" || finished) {
    if (tickRef.current) cancelAnimationFrame(tickRef.current);
    tickRef.current = null;
    return;
  }

  // Se remaining è null, significa che:
  // - stiamo entrando ora e l'init effect deve ancora settarlo
  // - oppure timer disattivo
  // In entrambi i casi: non partire.
  if (remaining == null) return;

  const total =
    effectiveDuration === null
      ? null
      : (effectiveDuration ?? questions.length * 60);

  if (total == null) return;

  // Start time iniziale (solo la prima volta che parte davvero il loop)
  if (startedAtRef.current == null) startedAtRef.current = Date.now();

  const loop = () => {
    tickRef.current = requestAnimationFrame(loop);

    const elapsed = Math.floor(
      (Date.now() - (startedAtRef.current || Date.now())) / 1000
    );

    const rest = Math.max(0, total - elapsed);
    setRemaining(rest);

    // Tempo finito → termina esame
    if (rest === 0) {
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
  // Nota: NON dipendiamo da `remaining` per "far ripartire" il loop,
  // ma lo usiamo come guard (se è null, non partiamo).
}, [mode, finished, effectiveDuration, questions.length, remaining]);


  /* -------------------------- AUTOSAVE LOCALE ------------------------- */
  useEffect(() => {
    const payload = {
      qIds: questions.map((q) => q.id),
      marked,
      reviewLater: Array.from(reviewLater),
      mode,
      remainingSec: remaining,
      startedAt: startedAtRef.current,
      idx,
    };
    const id = requestAnimationFrame(() => saveProgress(scopedKey, payload));
    return () => cancelAnimationFrame(id);
  }, [questions, marked, reviewLater, mode, remaining, idx, scopedKey]);

  /* ----------------------------- DERIVATI ----------------------------- */
  const answeredCount = useMemo(
    () => Object.values(marked).filter((v) => v != null).length,
    [marked]
  );

  const hasUnanswered = useMemo(
    () => questions.some((q) => marked[q.id] === undefined || marked[q.id] === null),
    [questions, marked]
  );

  const unansweredPositions = useMemo(() => {
    return questions
      .map((q, i) => ((marked[q.id] === undefined || marked[q.id] === null) ? i : -1))
      .filter((i) => i >= 0);
  }, [questions, marked]);

  const reviewUnansweredPositions = useMemo(() => {
    return questions
      .map((q, i) => {
        const isUnanswered = marked[q.id] === undefined || marked[q.id] === null;
        return reviewLater.has(q.id) && isUnanswered ? i : -1;
      })
      .filter((i) => i >= 0);
  }, [questions, marked, reviewLater]);

  const reviewPositions = useMemo(() => {
    return questions
      .map((q, i) => (reviewLater.has(q.id) ? i : -1))
      .filter((i) => i >= 0);
  }, [questions, reviewLater]);

  const scorePct = useMemo(() => {
    if (!questions.length) return 0;
    let ok = 0;
    for (const q of questions) {
      const chosen = marked[q.id];
      const right = q.answers.find((a) => !!a.isCorrect)?.id;
      if (chosen != null && right != null && chosen === right) ok++;
    }
    return Math.round((ok / questions.length) * 100);
  }, [marked, questions]);

  /* ----------------------------- HANDLER ------------------------------ */
  const choose = (q: Question, a: Answer) => {
    setMarked((m) => ({ ...m, [q.id]: a.id }));
  };

  const next = () => {
    if (reviewMode) {
      const currentPos = reviewPositions.indexOf(idx);
      const nextPos = reviewPositions[currentPos + 1];

      if (nextPos !== undefined) {
        setIdx(nextPos);
      } else {
        setReviewMode(false);
      }
      return;
    }

    if (idx < questions.length - 1) {
      setIdx((i) => i + 1);
      return;
    }

    if (mode === 'training' && reviewPositions.length > 0) {
      setReviewMode(true);
      setIdx(reviewPositions[0]);
    }
  };

  const prev = () => setIdx((i) => Math.max(i - 1, 0));

  const toggleReviewLater = (qId: Question['id']) => {
    setReviewLater((old) => {
      const n = new Set(old);
      if (n.has(qId)) n.delete(qId);
      else n.add(qId);
      return n;
    });
    setReviewMode(false);
  };

  const goToFirstUnanswered = () => {
    if (reviewUnansweredPositions.length > 0) {
      setIdx(reviewUnansweredPositions[0]);
      return;
    }
    if (unansweredPositions.length > 0) {
      setIdx(unansweredPositions[0]);
    }
  };

  async function doFinish(_timeExpired = false) {
    setFinished(true);
    const total = questions.length;
    const correct = Math.round((scorePct / 100) * total);
    const elapsedSec =
      startedAtRef.current != null
        ? Math.floor((Date.now() - startedAtRef.current) / 1000)
        : 0;

    const summary: QuizSummary & { mode: Mode } = {
      total,
      correct,
      scorePct,
      marked,
      durationSec: elapsedSec,
      mode,
    };

    setLastSummary(summary);

    // best-effort verso backend
    try {
      await onFinish?.(summary);
    } catch {
      /* ignore */
    }

    clearProgress(scopedKey);
  }

  const restart = () => {
    // restart = nuovo tentativo: in exam rigenera subset (perché reload effect ricrea domande)
    clearProgress(scopedKey);
    setIdx(0);
    setMarked({});
    setReviewLater(new Set());
    setFinished(false);
    setLastSummary(null);
    startedAtRef.current = null;
    setReviewMode(false);

    // 🔁 forza rebuild delle domande attive (specie per exam)
    const active = buildActiveQuestions(pool, mode);
    setQuestions(active);

    const total =
      effectiveDuration === null
        ? null
        : effectiveDuration ?? active.length * 60;
    setRemaining(total);
  };

  /* --------------------------- STATO BASE ----------------------------- */
  if (loading) return <div className="min-h-screen grid place-items-center">⏳</div>;
  if (err) return <div className="min-h-screen grid place-items-center text-red-600">{err}</div>;
  if (!questions.length) return <div className="min-h-screen grid place-items-center">No questions.</div>;

  const gradient = `bg-gradient-to-b ${categoryColor} text-white`;

  /* ------------------------- SCHERMATA FINALE ------------------------- */
  if (finished) {
    const total = lastSummary?.total ?? questions.length;
    const correct = lastSummary?.correct ?? 0;
    const wrong = total - correct;
    const duration =
      lastSummary && lastSummary.durationSec
        ? fmt(lastSummary.durationSec)
        : '--:--';

    const backUrl = backToHref || withLang(lang, '/quiz-home');

    const markedMap = lastSummary?.marked ?? marked;
    const wrongDetails = questions
      .map((q, index) => {
        const chosenId = markedMap?.[q.id];
        const rightAns = q.answers.find((a) => !!a.isCorrect);
        const chosenAns = q.answers.find((a) => a.id === chosenId);

        if (!rightAns || chosenId == null || chosenId === rightAns.id) return null;

        return {
          key: `${q.id}-${index}`,
          question: q.question ?? '',
          correct: rightAns.text ?? '',
          chosen: chosenAns?.text ?? '',
        };
      })
      .filter(Boolean) as {
      key: string;
      question: string;
      correct: string;
      chosen: string;
    }[];

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

            {!!wrongDetails.length && (
              <div className="mt-4 border-t pt-4">
                <h2 className="text-sm font-semibold text-gray-800 mb-2">
                  {label('wrongSummaryTitle', lang)} ({wrongDetails.length})
                </h2>
                <ul className="space-y-3 max-h-72 overflow-auto pr-1">
                  {wrongDetails.map((item, i) => (
                    <li
                      key={item.key}
                      className="bg-slate-50 rounded-xl p-3 text-sm"
                    >
                      <p className="font-medium mb-1">
                        {i + 1}. {item.question}
                      </p>
                      {item.chosen && (
                        <p className="text-red-700 text-xs mb-0.5">
                          {label('yourAnswer', lang)} {item.chosen}
                        </p>
                      )}
                      <p className="text-emerald-700 text-xs">
                        {label('correctAnswer', lang)} {item.correct}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-3 items-center justify-between">
              <div className="flex flex-wrap gap-2 text-sm">
                <button
                  type="button"
                  className="px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 cursor-pointer"
                  onClick={restart}
                >
                  {label('restart', lang)}
                </button>
                <button
                  type="button"
                  className="px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 cursor-pointer"
                  onClick={() => router.push(backUrl)}
                >
                  {label('backToQuizHome', lang)}
                </button>
                <button
                  type="button"
                  className="px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 cursor-pointer"
                  onClick={() => router.push(withLang(lang, '/profile'))}
                >
                  {label('seeProfile', lang)}
                </button>
              </div>

              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 cursor-pointer"
                onClick={() => router.push(withLang(lang, '/prezzi'))}
              >
                {label('seePremium', lang)}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* --------------------------- UI QUIZ NORMALE ------------------------ */
  const q = questions[idx];
  const isExam = mode === 'exam';
  const chosen = marked[q.id];

  const reviewTotal = reviewPositions.length;
  const reviewIndex = reviewMode ? Math.max(0, reviewPositions.indexOf(idx)) + 1 : 0;

  const canGoNext =
    idx < questions.length - 1 || (mode === 'training' && reviewPositions.length > 0);

  return (
    <div className={`min-h-screen ${gradient}`}>
      <div className="mobile-safe-top max-w-5xl mx-auto px-4 pt-20 pb-28">
        {/* header */}
<div className="flex flex-wrap items-center justify-between gap-3 mb-6">
  <div className="text-sm opacity-90">
    {label('question', lang)} {idx + 1}/{questions.length} ·{' '}
    {label('answered', lang)} {answeredCount}

    {/* 🔖 Badge modalità */}
  <span className="ml-2 inline-flex items-center rounded-full bg-white/10 px-2 py-0.5 text-xs">
    {isExam ? tQuiz.modeExam : tQuiz.modeTraining}
  </span>

    {reviewMode && reviewTotal > 0 && (
      <>
        {' '}
        ·{' '}
        <span className="inline-flex items-center rounded-full bg-white/10 px-2 py-0.5 text-xs">
          ★ Review {reviewIndex}/{reviewTotal}
        </span>
      </>
    )}

    {isExam && (
      <>
        {' '}
        · {label('score', lang)} {scorePct}%
        {remaining != null && (
          <>
            {' '}
            · ⏱ {tQuiz.time}: {fmt(remaining)}
          </>
        )}
      </>
    )}
  </div>

  {/* ✅ Toggle mode: usa setModeSafe così scatena la logica nuova */}
  <div className="flex items-center gap-2">
    <button
      className={`px-3 py-1.5 rounded-full text-sm ${
        !isExam ? 'bg-emerald-500' : 'bg-white/10'
      }`}
      onClick={() => setModeSafe('training')}
    >
      {label('training', lang)}
    </button>

    <button
      className={`px-3 py-1.5 rounded-full text-sm ${
        isExam ? 'bg-emerald-500' : 'bg-white/10'
      }`}
      onClick={() => setModeSafe('exam')}
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
            const isRight = !!a.isCorrect;
            const showFeedback = !isExam && chosen != null;

            let btnClasses =
              'bg-white text-gray-900 border border-white/20 hover:bg-white/90';

            if (isExam) {
              if (isChosen) {
                btnClasses =
                  'bg-emerald-500 text-white border-2 border-white shadow-[0_0_10px_rgba(255,255,255,0.5)] scale-[1.01]';
              }
            } else {
              if (!showFeedback) {
                if (isChosen) {
                  btnClasses =
                    'bg-emerald-500 text-white border-2 border-white shadow-[0_0_10px_rgba(255,255,255,0.5)] scale-[1.01]';
                }
              } else {
                if (isRight) {
                  btnClasses =
                    'bg-emerald-500 text-white border-2 border-white shadow-[0_0_10px_rgba(255,255,255,0.5)]';
                } else if (isChosen && !isRight) {
                  btnClasses =
                    'bg-red-500 text-white border-2 border-white shadow-[0_0_10px_rgba(255,255,255,0.5)] scale-[1.01]';
                }
              }
            }

            return (
              <button
                key={String(a.id)}
                type="button"
                onClick={() => choose(q, a)}
                className={`w-full text-left rounded-2xl px-4 py-3 transition border-2 ${btnClasses}`}
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
              type="button"
              className="px-4 py-2 rounded-lg bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={prev}
              disabled={idx === 0}
            >
              ‹ {label('back', lang)}
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={next}
              disabled={!canGoNext}
            >
              {label('next', lang)} ›
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-white/10"
              onClick={() => toggleReviewLater(q.id)}
            >
              {label('review', lang)} {reviewLater.has(q.id) ? '★' : '☆'}
            </button>

            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={goToFirstUnanswered}
              disabled={!hasUnanswered && reviewUnansweredPositions.length === 0}
            >
              {label('gotoUn', lang)}
            </button>

            {isExam ? (
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-red-500"
                onClick={() => doFinish(false)}
              >
                {label('finish', lang)}
              </button>
            ) : (
              <button
                type="button"
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

  summaryTitle: {
    it: 'Risultato esame',
    en: 'Exam summary',
    fr: 'Résumé de l’examen',
    es: 'Resumen del examen',
  },
  questionsLabel: { it: 'domande', en: 'questions', fr: 'questions', es: 'preguntas' },
  correctLabel: { it: 'Corrette', en: 'Correct', fr: 'Correctes', es: 'Correctas' },
  wrongLabel: { it: 'Errate', en: 'Wrong', fr: 'Fausses', es: 'Incorrectas' },
  durationLabel: { it: 'Durata', en: 'Duration', fr: 'Durée', es: 'Duración' },
  backToQuizHome: { it: 'Torna ai quiz', en: 'Back to quizzes', fr: 'Retour aux quiz', es: 'Volver a los cuestionarios' },
  seeProfile: { it: 'Vai al profilo', en: 'Go to profile', fr: 'Aller au profil', es: 'Ir al perfil' },
  seePremium: { it: 'Scopri Premium', en: 'See Premium', fr: 'Découvrir Premium', es: 'Descubrir Premium' },
  wrongSummaryTitle: { it: 'Domande da rivedere', en: 'Questions to review', fr: 'Questions à revoir', es: 'Preguntas para revisar' },
  yourAnswer: { it: 'Tua risposta:', en: 'Your answer:', fr: 'Votre réponse :', es: 'Tu respuesta:' },
  correctAnswer: { it: 'Risposta corretta:', en: 'Correct answer:', fr: 'Bonne réponse :', es: 'Respuesta correcta:' },
};
