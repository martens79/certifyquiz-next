// src/components/quiz/QuizEngine.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

import type { Answer, Question, QuizSummary, Locale, QuizContext } from '@/lib/quiz-types';
import { loadProgress, saveProgress, clearProgress } from '@/lib/quiz-storage';
import { makeSeed, seededShuffle, hashIds } from '@/lib/seeded-shuffle';
import {
  calculateCompletedBlock,
  getCompletedBlockWrongPositions,
  getNextBlockQuestionCount,
  shouldPauseAtBlockBoundary,
} from '@/lib/quiz-blocks';
import { withLang, getDict } from '@/lib/i18n';
import {
  claimWrongExplanationConsumption,
  isWrongExplanationLocked,
} from '@/lib/quiz-explanation-access';
import {
  claimBlockReviewGateOpening,
  explanationPaywallParams,
} from '@/lib/quiz-block-review-tracking';
import { pricingPath } from "@/lib/paths";
import { apiFetch } from "@/lib/auth";
import { trackMetaPixel } from "@/lib/metaPixel";
import { trackEvent as trackAnalyticsEvent, trackFunnelEvent } from "@/lib/analytics";
import { readConversionContext, withConversionContext } from "@/lib/conversion-context";
import { useAuth } from "@/components/auth/AuthProvider";

// ✅ (opzionale) box upsell solo in punti consentiti (fine quiz)
// Se non ce l’hai ancora, commenta import + uso.
import PremiumTeaserBox from '@/components/premium/PremiumTeaserBox';


import RegistrationGate from '@/components/quiz/RegistrationGate';
import { useGuestQuizCount } from '@/hooks/useGuestQuizCount';
import { useQuizTutor } from '@/components/quiz/QuizTutorContext';


// ------------------------------------------------------------------
// Local labels (indipendenti da QuizDict)
// ------------------------------------------------------------------
const L = {
  training: { it: 'Allenamento', en: 'Training', fr: 'Entraînement', es: 'Entrenamiento' },
  exam: { it: 'Esame', en: 'Exam', fr: 'Examen', es: 'Examen' },
  assessment: {
  it: 'Free test',
  en: 'Free test',
  fr: 'Test gratuit',
  es: 'Test gratuito'
},
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
  gotoUnShort: { it: 'Non risolta', en: 'Unanswered', fr: 'Non répondue', es: 'Sin responder' },

  score: { it: 'Punteggio', en: 'Score', fr: 'Score', es: 'Puntuación' },
  summaryTitle: { it: 'Risultato esame', en: 'Exam summary', fr: 'Résumé de l’examen', es: 'Resumen del examen' },
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
} as const;

function label(key: keyof typeof L, lang: Locale) {
  return L[key][lang] ?? L[key].it;
}
type Mode = 'training' | 'exam' | 'assessment';

const BLOCK_COPY = {
  title: {
    it: 'Sessione completata',
    en: 'Session complete',
    fr: 'Session terminée',
    es: 'Sesión completada',
  },
  correct: {
    it: 'corrette',
    en: 'correct',
    fr: 'correctes',
    es: 'correctas',
  },
  covered: {
    it: 'In questo blocco hai affrontato {count} domande su {topic}.',
    en: 'In this block, you covered {count} questions on {topic}.',
    fr: 'Dans ce bloc, vous avez traité {count} questions sur {topic}.',
    es: 'En este bloque has trabajado {count} preguntas sobre {topic}.',
  },
  coveredGeneric: {
    it: 'In questo blocco hai completato {count} domande.',
    en: 'You completed {count} questions in this block.',
    fr: 'Vous avez terminé {count} questions dans ce bloc.',
    es: 'Has completado {count} preguntas en este bloque.',
  },
  mistakes: {
    it: '{count} risposte richiedono ancora attenzione.',
    en: '{count} answers still need attention.',
    fr: '{count} réponses demandent encore votre attention.',
    es: '{count} respuestas todavía requieren atención.',
  },
  noMistakes: {
    it: 'Nessun errore in questo blocco.',
    en: 'No mistakes in this block.',
    fr: 'Aucune erreur dans ce bloc.',
    es: 'Ningún error en este bloque.',
  },
  continue: {
    it: 'Continua con le prossime {count}',
    en: 'Continue with the next {count}',
    fr: 'Continuer avec les {count} suivantes',
    es: 'Continuar con las siguientes {count}',
  },
  reviewErrors: {
    it: 'Rivedi errori',
    en: 'Review mistakes',
    fr: 'Revoir les erreurs',
    es: 'Revisar errores',
  },
} as const;

const BLOCK_MOTIVATION = {
  low: {
    it: ['Questo blocco indica dove concentrare il prossimo ripasso.', 'Una base più solida nasce dal correggere pochi punti alla volta.', 'Usa questi errori per orientare il prossimo tratto di studio.'],
    en: ['This block shows where to focus your next review.', 'A stronger foundation comes from correcting a few points at a time.', 'Use these mistakes to guide the next part of your study.'],
    fr: ['Ce bloc indique où concentrer votre prochaine révision.', 'Une base plus solide se construit en corrigeant quelques points à la fois.', 'Utilisez ces erreurs pour orienter la suite de votre étude.'],
    es: ['Este bloque indica dónde centrar el próximo repaso.', 'Una base más sólida se construye corrigiendo pocos puntos cada vez.', 'Utiliza estos errores para orientar la siguiente parte del estudio.'],
  },
  developing: {
    it: ['La base è presente; ora conviene consolidare i punti meno sicuri.', 'Sei a metà strada: un ripasso mirato può rendere il risultato più stabile.', 'I concetti principali ci sono, ma alcuni dettagli meritano attenzione.'],
    en: ['The foundation is there; now consolidate the less certain points.', 'You are halfway there: focused review can make the result more consistent.', 'The main concepts are in place, but some details need attention.'],
    fr: ['La base est présente ; consolidez maintenant les points moins sûrs.', 'Vous êtes à mi-chemin : une révision ciblée rendra le résultat plus stable.', 'Les notions principales sont acquises, mais certains détails demandent de l’attention.'],
    es: ['La base está presente; ahora conviene consolidar los puntos menos seguros.', 'Estás a mitad de camino: un repaso dirigido puede estabilizar el resultado.', 'Los conceptos principales están, pero algunos detalles requieren atención.'],
  },
  good: {
    it: ['Preparazione buona: mantieni la precisione nel prossimo blocco.', 'Il risultato è solido; continua lavorando sugli errori residui.', 'Buon livello di comprensione, con margine per rendere il risultato più costante.'],
    en: ['Good preparation: maintain this accuracy in the next block.', 'The result is solid; keep working on the remaining mistakes.', 'Good understanding, with room to make the result more consistent.'],
    fr: ['Bonne préparation : conservez cette précision dans le prochain bloc.', 'Le résultat est solide ; continuez à travailler sur les erreurs restantes.', 'Bon niveau de compréhension, avec une marge pour gagner en régularité.'],
    es: ['Buena preparación: mantén esta precisión en el siguiente bloque.', 'El resultado es sólido; sigue trabajando en los errores restantes.', 'Buen nivel de comprensión, con margen para ganar regularidad.'],
  },
  excellent: {
    it: ['Padronanza molto buona: prosegui mantenendo lo stesso livello di attenzione.', 'Risultato molto solido; il prossimo obiettivo è confermare la continuità.', 'Ottima precisione nel blocco: continua con lo stesso metodo.'],
    en: ['Very good command: continue with the same level of attention.', 'A very solid result; the next goal is to confirm this consistency.', 'Excellent accuracy in this block: keep using the same method.'],
    fr: ['Très bonne maîtrise : poursuivez avec le même niveau d’attention.', 'Résultat très solide ; le prochain objectif est de confirmer cette régularité.', 'Excellente précision dans ce bloc : continuez avec la même méthode.'],
    es: ['Muy buen dominio: continúa con el mismo nivel de atención.', 'Un resultado muy sólido; el siguiente objetivo es confirmar esta regularidad.', 'Excelente precisión en este bloque: continúa con el mismo método.'],
  },
} as const;

function interpolate(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''));
}

function BlockResultsScreen({
  lang,
  correct,
  total,
  percentage,
  topicTitle,
  blockNumber,
  nextBlockSize,
  categoryColor,
  onReviewErrors,
  onContinue,
}: {
  lang: Locale;
  correct: number;
  total: number;
  percentage: number;
  topicTitle?: string;
  blockNumber: number;
  nextBlockSize: number;
  categoryColor: string;
  onReviewErrors?: () => void;
  onContinue: () => void;
}) {
  const band = correct <= 4 ? 'low' : correct <= 6 ? 'developing' : correct <= 8 ? 'good' : 'excellent';
  const variants = BLOCK_MOTIVATION[band][lang];
  const motivation = variants[(blockNumber - 1) % variants.length];
  const wrong = total - correct;
  const covered = topicTitle
    ? interpolate(BLOCK_COPY.covered[lang], { count: total, topic: topicTitle })
    : interpolate(BLOCK_COPY.coveredGeneric[lang], { count: total });

  return (
    <div className={`min-h-screen bg-gradient-to-b ${categoryColor} text-white grid place-items-center px-4 py-8`}>
      <section className="w-full max-w-xl rounded-3xl border border-white/20 bg-black/20 p-6 shadow-2xl backdrop-blur sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/70">
          {BLOCK_COPY.title[lang]}
        </p>

        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-4xl font-bold tabular-nums sm:text-5xl">
              {correct} / {total}
            </p>
            <p className="mt-1 text-base text-white/80">{BLOCK_COPY.correct[lang]}</p>
          </div>
          <p className="text-4xl font-bold tabular-nums sm:text-5xl">{percentage}%</p>
        </div>

        <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/15">
          <div className="h-full rounded-full bg-emerald-400" style={{ width: `${percentage}%` }} />
        </div>

        <div className="mt-6 space-y-2 rounded-2xl bg-white/10 p-4 text-sm leading-relaxed text-white/90">
          <p>{covered}</p>
          <p>
            {wrong === 0
              ? BLOCK_COPY.noMistakes[lang]
              : interpolate(BLOCK_COPY.mistakes[lang], { count: wrong })}
          </p>
        </div>

        <p className="mt-6 text-lg font-medium leading-relaxed">{motivation}</p>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          {onReviewErrors && (
            <button
              type="button"
              className="rounded-xl border border-white/25 bg-white/10 px-5 py-3 font-semibold text-white transition hover:bg-white/15"
              onClick={onReviewErrors}
            >
              {BLOCK_COPY.reviewErrors[lang]}
            </button>
          )}
          <button
            type="button"
            className={`rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-white transition hover:bg-emerald-600 ${onReviewErrors ? '' : 'sm:col-span-2'}`}
            onClick={onContinue}
          >
            {interpolate(BLOCK_COPY.continue[lang], { count: nextBlockSize })}
          </button>
        </div>
      </section>
    </div>
  );
}

type Props = {
  lang: Locale;

  /** Carica IL POOL di domande (idealmente molte, es. 500 max). */
  fetchQuestions: () => Promise<Question[]>;

  /** Chiave base per autosave locale (internamente separiamo per mode). */
  storageScope: string;

  // UI
  categoryColor?: string;

  /** default interno (usato solo se NON passi mode come prop) */
  initialMode?: Mode;

  /** ✅ Controlled mode: se lo passi, QuizEngine usa SEMPRE questo */
  mode?: Mode;

  /**
   * TIMER (legacy):
   * - se usi solo questo: comportamento vecchio (durationSec totale o qs.length * 60)
   * - se invece passi durationsByMode, quello vince.
   */
  durationSec?: number | null;

  /** Timer per modalità */
  durationsByMode?: Partial<Record<Mode, number | null>>;

  /** Numero domande per modalità */
  limitsByMode?: Partial<Record<Mode, number>>;

  /**
   * Dimensione dei blocchi in training (es. 10): ogni multiplo mette in
   * pausa l'avanzamento con una schermata di riepilogo blocco. Ignorato
   * fuori da training (vedi condizione in next()). Passata solo da
   * QuizTopicClient — exam/assessment/mixed/mock-exam non la usano.
   */
  blockSize?: number;

  /** callback best-effort quando finisce */
  onFinish?: (summary: QuizSummary & { mode: Mode }) => Promise<void> | void;

  /** URL per tornare indietro */
  backToHref?: string;

  /** Contesto visivo sopra al quiz (breadcrumb + badge + link back) */
  context?: QuizContext;

  /** notifica quando cambia modalità */
  onModeChange?: (mode: Mode) => void;

  /** Nasconde il toggle Training / Exam (usato per Mock Exam) */
  hideModeSwitch?: boolean;

    /** Segnala un problema sulla domanda (typo/errata/etc.) */

  onFeedback?: (p: {
    questionId: number;
    type: "typo" | "wrong_answer" | "outdated" | "other";
    description?: string;
  }) => Promise<void>;
};


export default function QuizEngine({
  lang,
  fetchQuestions,
  storageScope,
  categoryColor = 'from-blue-900 to-blue-700',
  initialMode = 'training',
  mode: controlledMode,
  durationSec,
  durationsByMode,
  limitsByMode,
  blockSize,
  onFinish,
  backToHref,
  onModeChange,
  hideModeSwitch = false,
  context,
  onFeedback,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const conversionContext = useMemo(() => readConversionContext(searchParams), [searchParams]);
  const { user } = useAuth();

  // i18n quiz microcopy
  const tQuiz = getDict(lang).quiz;

  /* ─────────────────────────────────────────────────────────────
     PREMIUM (non invasivo)
     ------------------------------------------------------------
     - QuizEngine NON legge flags direttamente.
     - Riceve dal caller la decisione finale: context.premiumLocked
  ───────────────────────────────────────────────────────────── */
   const isPremiumUser = !!context?.isPremiumUser;
  const premiumLocked = !!context?.premiumLocked;
  

  const isLoggedIn = !!context?.isAuthenticated || !!context?.isPremiumUser;

  const { registerLimitReached, increment } = useGuestQuizCount(isLoggedIn);

  // ── NUOVO: contatore spiegazioni errori free ──────────────
  // null = illimitato (premium/admin o non ancora caricato)
  // numero = quante spiegazioni-errore free restano
  const [wrongExpLeft, setWrongExpLeft] = useState<number | null>(
    context?.freeWrongExpLeft ?? null
  );
  // Limite effettivo (10 per il Gruppo A/controllo, eventualmente diverso per
  // il Gruppo B dell'esperimento Rewarded Ads): serve per il testo del gate,
  // che altrimenti resterebbe hardcoded su "10" anche per chi ha un limite diverso.
  const [wrongExpLimit, setWrongExpLimit] = useState<number>(10);
  const [experimentVariant, setExperimentVariant] = useState<string | null>(null);
  // Domande sbloccate via rewarded ad in questa sessione: bypassano il gate
  // senza toccare wrongExpLeft (il reward non è credito extra, è mirato a
  // UNA domanda specifica, vedi rewardedAdsService.consumeGrant lato backend).
  const [adUnlockedQuestionIds, setAdUnlockedQuestionIds] = useState<Set<number>>(new Set());
  const consumedWrongExplanationQuestionIdsRef = useRef(new Set<string>());
  const blockReviewGateTrackedOpeningsRef = useRef(new Set<number>());
  const blockReviewOpeningCounterRef = useRef(0);

  // Carica lo stato dal backend al mount (solo utenti loggati non premium)
useEffect(() => {
  if (!isLoggedIn || isPremiumUser) return;

  apiFetch(`/me/explanation-status${context?.certificationId ? `?certification_id=${context.certificationId}` : ""}`)
    .then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then((data) => {
      if (data.unlimited) setWrongExpLeft(null);
      else setWrongExpLeft(data.remaining ?? 0);
      if (typeof data.limit === "number") setWrongExpLimit(data.limit);
      if (data.experimentVariant) setExperimentVariant(data.experimentVariant);
    })
    .catch((err) => {
      console.error("Errore explanation-status:", err);
    });
}, [isLoggedIn, isPremiumUser, context?.certificationId]);

  // Chiamato quando l'utente free vede la spiegazione di un errore
const consumeWrongExplanation = async (questionId: number | string): Promise<boolean> => {
  // premium/admin/non loggato: sempre ok
  if (isPremiumUser || !isLoggedIn) return true;

  // già a 0: blocca subito senza chiamata
  if (wrongExpLeft !== null && wrongExpLeft <= 0) return false;

  if (!claimWrongExplanationConsumption(
    consumedWrongExplanationQuestionIdsRef.current,
    questionId
  )) return true;

  try {
   const res = await apiFetch("/me/explanation-seen", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    certification_id: context?.certificationId ?? null,
    cert_slug: context?.certificationSlug ?? null,
    topic_slug: context?.topicSlug ?? null,
    lang,
  }),
});

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    if (typeof data.limit === "number") setWrongExpLimit(data.limit);
    if (data.experimentVariant) setExperimentVariant(data.experimentVariant);

    if (data.locked) {
      setWrongExpLeft(0);
      return false;
    }

    const remaining = data.remaining ?? 0;
    setWrongExpLeft(remaining);
    if (remaining === 0) {
      trackQuizEvent('free_limit_reached', {
        language: lang,
        certification_slug: context?.certificationSlug ?? null,
        limit_type: 'wrong_explanations',
        limit: data.limit ?? wrongExpLimit,
      });
    }
    return true;
  } catch (err) {
    console.error("Errore explanation-seen:", err);
    return true; // mantieni il comportamento attuale
  }
};


  // ---------------- Sticky timer (UI-only) ----------------
  const examDurationSec = durationsByMode?.exam ?? durationSec ?? null;

  const timeStrFromSec = (s: number) => {
    const mm = Math.floor(s / 60);
    const ss = s % 60;
    return `${mm}:${String(ss).padStart(2, '0')}`;
  };

  const timerLabel =
    lang === 'it'
      ? 'Tempo rimanente'
      : lang === 'fr'
      ? 'Temps restant'
      : lang === 'es'
      ? 'Tiempo restante'
      : 'Time remaining';

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [, setActionsOpen] = useState(false);

const [fbOpen, setFbOpen] = useState(false);
const [fbType, setFbType] = useState<"typo" | "wrong_answer" | "outdated" | "other">("typo");
const [fbText, setFbText] = useState("");
const [fbSending, setFbSending] = useState(false);
const [fbSent, setFbSent] = useState(false);

const [reportEmail, setReportEmail] = useState("");
const [reportSending, setReportSending] = useState(false);
const [reportSubmitted, setReportSubmitted] = useState(false);
const [reportMessage, setReportMessage] = useState<string | null>(null);

const openFeedback = () => {
  setActionsOpen(false);      // se usi il menu azioni
  setFbType("typo");
  setFbText("");
  setFbSent(false);
  setFbOpen(true);
};

  /** Pool completo */
  const [pool, setPool] = useState<Question[]>([]);

  /** Mode interno (solo se NON controlled) */
  const [internalMode, setInternalMode] = useState<Mode>(initialMode);

  /** ✅ Mode effettivo */
  const effectiveMode: Mode = controlledMode ?? internalMode;

  /** Domande attive (dipendono da mode) */
  const [questions, setQuestions] = useState<Question[]>([]);

  /** Indice domanda corrente */
  const [idx, setIdx] = useState(0);

  const [reviewMode, setReviewMode] = useState(false);

  /** true tra un blocco da blockSize e il successivo (solo training, vedi next()) */
  const [blockPaused, setBlockPaused] = useState(false);
  const [blockReview, setBlockReview] = useState<{
    positions: number[];
    cursor: number;
    openingId: number;
  } | null>(null);

  // q.id -> answer.id | null
  const [marked, setMarked] = useState<Record<string | number, string | number | null>>({});
  const [reviewLater, setReviewLater] = useState<Set<string | number>>(new Set());

  const [finished, setFinished] = useState(false);
  const [lastSummary, setLastSummary] = useState<(QuizSummary & { mode: Mode }) | null>(null);

  // timer
  const [remaining, setRemaining] = useState<number | null>(null);
  const tickRef = useRef<number | null>(null);
  const startedAtRef = useRef<number | null>(null);
  const assessmentStartedTrackedRef = useRef(false);
  const studyStartedTrackedRef = useRef(false);
  const completedTrackedRef = useRef(false);
  const milestoneTrackedRef = useRef(new Set<number>());
  const abandonedTrackedRef = useRef(false);
  const latestProgressRef = useRef({ idx: 0, finished: false, answered: 0 });
  const premiumClickedRef = useRef(false);
  const [premiumClicked, setPremiumClicked] = useState(false);

  // Seed dello shuffle deterministico della sessione corrente (per scopedKey).
  // Impostato nell'effetto di load/resume e in restart(), letto dall'autosave.
  const seedRef = useRef<number | null>(null);

  // Contatore monotono per scope: sale a ogni salvataggio (locale o DB),
  // usato come tiebreak dal guard server-side su quiz_progress.rev. Dopo
  // OGNI PUT riuscita viene riallineato al rev restituito dal server,
  // incondizionatamente (non solo quando si sospetta un conflitto): è così
  // che un client con rev disallineato (rete caduta, riga DB sconosciuta)
  // si autocorregge al primo giro andato a buon fine, invece di continuare
  // a scrivere nel vuoto scartato in silenzio dal guard >=.
  const revRef = useRef<number>(0);

  // true solo dopo che la riconciliazione locale/DB del load è conclusa:
  // finché è false, l'autosave verso il DB non parte (nemmeno su
  // visibilitychange/pagehide). Senza questo gate, un click nella finestra
  // fra il mount e la risposta della GET (stato ancora "vuoto", seed
  // fresco, rev 0) potrebbe far partire una PUT che compete con la
  // riconciliazione stessa.
  const hydratedRef = useRef(false);

  // Ancora per il countdown exam quando la fonte è il server (sync riuscito
  // via GET o PUT): {remainingAtSync, perfAtSync}. Il tick calcola SOLO un
  // delta monotono locale da perfAtSync (performance.now(), immune a salti
  // dell'orologio di sistema) — mai un timestamp assoluto del server
  // reinterpretato lato client, mai l'orologio di parete per il confronto.
  // Resta null (fallback al meccanismo Date.now()/startedAtRef esistente,
  // invariato) finché nessun sync col server è ancora avvenuto: anonimo,
  // rete giù, o sessione appena iniziata.
  const examServerSyncRef = useRef<{ remainingAtSync: number; perfAtSync: number } | null>(null);

  /**
   * Storage separato per modalità E per utente:
   * - mixed:security-plus:en:training:user:42
   * - mixed:security-plus:en:exam:anon
   * Senza lo user id nella chiave, il localStorage (scoped solo per
   * origine/topic/lingua/mode, non per account) fa "sanguinare" lo stato di
   * un utente in quello del successivo che accede sullo stesso browser —
   * scoperto testando dal vivo il resume cross-device: le risposte di un
   * utente finivano nella riga DB di un altro. Su un device condiviso (aula,
   * ufficio — la norma per questo prodotto) non è un caso limite.
   */
  const userKeyPart = user?.id != null ? `user:${user.id}` : 'anon';
  const scopedKey = `${storageScope}:${effectiveMode}:${userKeyPart}`;

  useEffect(() => {
    assessmentStartedTrackedRef.current = false;
    studyStartedTrackedRef.current = false;
    completedTrackedRef.current = false;
    milestoneTrackedRef.current.clear();
    abandonedTrackedRef.current = false;
  }, [scopedKey]);

  /* -------------------- helpers: limit + duration -------------------- */

  const effectiveLimit = useMemo(() => {
    const lim = limitsByMode?.[effectiveMode];
    if (!lim) return undefined;
    return Math.max(1, lim);
  }, [limitsByMode, effectiveMode]);

  const effectiveDuration = useMemo(() => {
    if (durationsByMode && durationsByMode[effectiveMode] !== undefined) {
      return durationsByMode[effectiveMode] as number | null;
    }
    return durationSec;
  }, [durationsByMode, durationSec, effectiveMode]);

  /** Pesca subset per TRAINING/EXAM: shuffle seedato del pool + slice a limit (no mutazione del pool) */
  function buildActiveQuestions(p: Question[], m: Mode, seed: number): Question[] {
    if (!p?.length) return [];

    const target =
  m === 'training'
    ? (limitsByMode?.training ?? p.length)
    : m === 'assessment'
    ? (limitsByMode?.assessment ?? effectiveLimit ?? 10)
    : (effectiveLimit ?? p.length);

    const n = Math.max(1, Math.min(p.length, target));

    const shuffled = seededShuffle(p, seed);

    return shuffled.slice(0, n);
  }

  /* -------------------- LOAD POOL + RIPRISTINO PER MODE -------------------- */
  useEffect(() => {
    let alive = true;
    const controller = new AbortController();
    hydratedRef.current = false;

    (async () => {
      setLoading(true);
      setErr(null);

      try {
        const qs = await fetchQuestions();
        if (!alive) return;

        const poolQ = Array.isArray(qs) ? qs : [];
        setPool(poolQ);

        let local = loadProgress(scopedKey) as any;

        // Migrazione anon -> user: se l'utente è loggato ma non ha ancora
        // nulla sotto la propria chiave, e c'era una sessione anonima
        // precedente per lo stesso scope (stesso browser, tipicamente
        // registrazione avvenuta a metà quiz), la adotto e la rinomino.
        // Senza questo, dopo il login la chiave letta non è più quella
        // anonima e il progresso fatto da ospite sparirebbe silenziosamente
        // — il caso "DB vuoto + locale presente -> adotta il locale" più
        // sotto non avrebbe più nulla da trovare.
        let migratedFromAnon = false;
        if (user?.id != null && !local) {
          const anonKey = `${storageScope}:${effectiveMode}:anon`;
          const anonLocal = loadProgress(anonKey) as any;
          if (anonLocal) {
            saveProgress(scopedKey, anonLocal);
            clearProgress(anonKey);
            local = anonLocal;
            migratedFromAnon = true;
          }
        }

        // DB solo per loggati, e non per assessment (test one-shot, submit
        // unico, nessun concetto di "riprendi dopo" — vedi onFinish in
        // QuizTopicClient: assessment non ha resume, quiz_progress non va
        // wired lì anche se il mode è nell'ENUM).
        const topicId = context?.topicId;
        const dbEligible = isLoggedIn && effectiveMode !== 'assessment' && !!topicId;

        let dbRow: any = null;
        let dbReachable = true; // true = risposta definitiva (riga o null); false = rete/errore

        if (dbEligible) {
          try {
            const res = await apiFetch(
              `/me/quiz-progress/${topicId}?lang=${lang}&mode=${effectiveMode}`,
              { signal: controller.signal }
            );
            if (!alive) return;

            if (res.ok) {
              const data = await res.json();
              if (!alive) return;
              dbRow = data?.row ?? null;
            } else {
              dbReachable = false;
            }
          } catch {
            if (!alive) return;
            dbReachable = false;
          }
        }
        if (!alive) return;

        // ---- scelta della fonte ----
        // (1) rete giù -> locale se c'è, mai azzerare un progresso che sta
        //     letteralmente sul disco dell'utente solo perché non ho potuto
        //     leggere il DB.
        // (2) DB raggiungibile ma vuoto (prima volta, o subito dopo una
        //     registrazione a metà quiz) -> adotta il locale se c'è.
        // (3) DB ha una riga: locale vince SOLO se stesso seed e rev locale
        //     più alto (es. l'ultimo flush prima della chiusura non è mai
        //     arrivato) — in ogni altro caso vince il DB.
        let source: { data: any; kind: 'local' | 'db' } | null = null;

        // Se ho appena migrato una sessione anonima nella chiave dell'utente,
        // quel locale vince SEMPRE, saltando il confronto seed/rev con la
        // DB — perché l'utente lo ha appena fatto, su questo device, un
        // attimo fa. Senza questo scavalco esplicito, un'eventuale riga DB
        // preesistente (anche vecchia o vuota, es. da una visita precedente
        // loggata sullo stesso topic) vince quasi sempre per il confronto
        // standard (seed diverso = certo, dato che il seed anonimo è nuovo
        // di zecca) e il progresso appena migrato sparisce silenziosamente
        // — bug trovato testando dal vivo in produzione, non dedotto.
        if (migratedFromAnon) {
          source = { data: local, kind: 'local' };
        } else if (!dbEligible) {
          source = local ? { data: local, kind: 'local' } : null; // step 1 invariato (anonimo/assessment)
        } else if (!dbReachable) {
          source = local ? { data: local, kind: 'local' } : null;
        } else if (!dbRow) {
          source = local ? { data: local, kind: 'local' } : null;
        } else if (local && local.seed === dbRow.seed && (local.rev ?? 0) > dbRow.rev) {
          source = { data: local, kind: 'local' };
        } else {
          source = { data: dbRow, kind: 'db' };
        }

        // Seed "candidato" dalla fonte scelta (se c'è) — usato SOLO per
        // verificare se è ancora valido contro il pool attuale.
        const candidateSeed =
          source && typeof source.data.seed === 'number' ? source.data.seed : makeSeed();

        let active = buildActiveQuestions(poolQ, effectiveMode, candidateSeed);
        let activeIds = active.map((q) => q.id);

        // Guard sull'ordine domande: primitiva diversa a seconda della fonte
        // (array intero per il locale, hash per il DB — vedi migrazione per
        // il perché), stessa garanzia: se il pool è cambiato da quando la
        // riga/il salvataggio è stato scritto, non ripristinare idx/risposte
        // su un ordine che non corrisponde più.
        const canRestore =
          !!source &&
          (source.kind === 'local'
            ? Array.isArray(source.data.qIds) && arraysEqual(source.data.qIds, activeIds)
            : typeof source.data.qidsHash === 'number' && hashIds(activeIds) === source.data.qidsHash);

        // Se il candidato non è valido (pool cambiato, o nessuna fonte),
        // il seed candidato NON va riusato per la sessione nuova: genero un
        // seed davvero nuovo e ricostruisco active di conseguenza. Senza
        // questo, un mismatch produceva un "reset" che azzerava risposte/
        // indice ma continuava a usare il seed (eventualmente disallineato)
        // della fonte scartata — trovato testando dal vivo, non dedotto.
        let seed = candidateSeed;
        if (!canRestore) {
          seed = makeSeed();
          active = buildActiveQuestions(poolQ, effectiveMode, seed);
          activeIds = active.map((q) => q.id);
        }
        seedRef.current = seed;
        setQuestions(active);

        const total =
          effectiveDuration === null ? null : effectiveDuration ?? active.length * 60;

        examServerSyncRef.current = null;

        if (canRestore && source!.kind === 'local') {
          const p = source!.data;

          setMarked(p.marked ?? {});
          setReviewLater(new Set(p.reviewLater ?? []));
          setIdx(Math.min(p.idx ?? 0, Math.max(0, active.length - 1)));

          if (total == null) setRemaining(null);
          else setRemaining(Math.min(total, p.remainingSec ?? total));

          startedAtRef.current = p.startedAt ?? null;
          // Mai sotto il pavimento noto della DB (se una riga esiste, anche
          // scartata/non usata come fonte, es. nel caso di migrazione
          // anon->user sopra): altrimenti la prima PUT verrebbe scartata in
          // silenzio dal guard >= lato server, e il progresso appena
          // ripristinato non si sincronizzerebbe mai.
          revRef.current = Math.max(p.rev ?? 0, dbEligible && dbRow ? dbRow.rev + 1 : 0);
        } else if (canRestore && source!.kind === 'db') {
          const row = source!.data;
          const st = row.state ?? {};

          setMarked(st.marked ?? {});
          setReviewLater(new Set(st.reviewLater ?? []));
          setIdx(Math.min(row.currentIndex ?? 0, Math.max(0, active.length - 1)));
          startedAtRef.current = null;

          if (effectiveMode === 'exam' && typeof row.remainingSec === 'number') {
            setRemaining(Math.max(0, row.remainingSec));
            examServerSyncRef.current = { remainingAtSync: row.remainingSec, perfAtSync: performance.now() };
          } else {
            setRemaining(total);
          }

          revRef.current = row.rev ?? 0;
        } else {
          setMarked({});
          setReviewLater(new Set());
          setIdx(0);
          setRemaining(total);
          startedAtRef.current = null;
          clearProgress(scopedKey);

          // rev non riparte mai da 0 se sapevamo di una riga DB (anche se
          // scartata per hash non combaciante): altrimenti la prima PUT del
          // nuovo tentativo verrebbe scartata in silenzio dal guard >= lato
          // server, e l'utente gioca una sessione intera mai persistita.
          revRef.current = dbEligible && dbRow ? dbRow.rev + 1 : 0;
        }

        setFinished(false);
        setLastSummary(null);
        setReviewMode(false);
        setBlockPaused(false);
        setBlockReview(null);
        consumedWrongExplanationQuestionIdsRef.current.clear();
      } catch (e: unknown) {
        if (!alive) return;

        const err: any = e;
        const status: number | undefined =
          typeof err?.status === 'number' ? err.status : undefined;

        if (status === 401) {
          setErr(
            lang === 'it'
              ? 'Non sei loggato su questo dispositivo. Accedi per salvare progressi e (in futuro) funzioni premium.'
              : 'You are not logged in. Sign in to save progress and (later) premium features.'
          );
          return;
        }

        setErr(
          typeof err?.message === 'string' && err.message.trim()
            ? err.message
            : 'Load error'
        );
      } finally {
        if (alive) {
          setLoading(false);
          hydratedRef.current = true;
        }
      }
    })();

    return () => {
      alive = false;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchQuestions, scopedKey, effectiveMode, effectiveDuration, effectiveLimit, isLoggedIn, context?.topicId]);

    // ✅ Analytics — traccia quando un assessment/free test viene realmente avviato.
  // Usiamo un ref per evitare eventi doppi causati da re-render o Strict Mode.
  useEffect(() => {
    if (effectiveMode !== 'assessment') return;
    if (loading || err || !questions.length) return;
    if (assessmentStartedTrackedRef.current) return;

    assessmentStartedTrackedRef.current = true;

    const assessmentStartProperties = {
      lang,
      quiz_mode: effectiveMode,
      certification_slug: context?.certificationSlug ?? null,
      storage_scope: storageScope,
      certification: context?.certificationName ?? null,
      topic: context?.topicTitle ?? null,
      kind: context?.kind ?? null,
      total_questions: questions.length,
    };
    trackQuizEvent('assessment_started', assessmentStartProperties);
    trackQuizEvent('diagnostic_quiz_started', assessmentStartProperties);
    trackFunnelEvent({
      event: 'assessment_started',
      cert_slug: context?.certificationSlug ?? null,
      topic_slug: context?.topicSlug ?? null,
      lang,
    });
  }, [
    effectiveMode,
    loading,
    err,
    questions.length,
    lang,
    storageScope,
    context?.certificationName,
    context?.certificationSlug,
    context?.topicSlug,
    context?.topicTitle,
    context?.kind,
  ]);

  useEffect(() => {
    if (effectiveMode === 'assessment') return;
    if (loading || err || !questions.length || studyStartedTrackedRef.current) return;
    studyStartedTrackedRef.current = true;

    trackQuizEvent('study_started', {
      language: lang,
      quiz_mode: effectiveMode,
      certification_slug: context?.certificationSlug ?? null,
      topic_slug: context?.topicSlug ?? null,
      source_page: 'quiz',
      conversion_source: conversionContext.source,
      assessment_score: conversionContext.score,
    });
    trackFunnelEvent({
      event: 'study_started',
      cert_slug: context?.certificationSlug ?? null,
      topic_slug: context?.topicSlug ?? null,
      lang,
    });
  }, [
    effectiveMode,
    loading,
    err,
    questions.length,
    lang,
    context?.certificationSlug,
    context?.topicSlug,
    conversionContext.source,
    conversionContext.score,
  ]);

  useEffect(() => {
    const reached = idx + 1;
    if (![1, 5, 10, 20, 40].includes(reached)) return;
    if (milestoneTrackedRef.current.has(reached)) return;
    milestoneTrackedRef.current.add(reached);
    trackQuizEvent("quiz_question_reached", {
      language: lang,
      quiz_mode: effectiveMode,
      question_milestone: reached,
      certification_slug: context?.certificationSlug ?? null,
      source_page: "quiz",
    });
  }, [idx, lang, effectiveMode, context?.certificationSlug]);

  useEffect(() => {
    latestProgressRef.current = {
      idx,
      finished,
      answered: Object.values(marked).filter((value) => value != null).length,
    };
  }, [idx, finished, marked]);

  useEffect(() => {
    const onPageHide = () => {
      const progress = latestProgressRef.current;
      if (abandonedTrackedRef.current || progress.finished || progress.answered === 0) return;
      abandonedTrackedRef.current = true;
      trackQuizEvent("quiz_abandoned", {
        language: lang,
        quiz_mode: effectiveMode,
        last_question_reached: progress.idx + 1,
        answered_questions: progress.answered,
        certification_slug: context?.certificationSlug ?? null,
        source_page: "quiz",
      });
    };
    window.addEventListener("pagehide", onPageHide);
    return () => window.removeEventListener("pagehide", onPageHide);
  }, [lang, effectiveMode, context?.certificationSlug]);

  /* -------------------- QUIZ TUTOR CONTEXT SYNC -------------------- */
  const { setQuizTutorData } = useQuizTutor();

  useEffect(() => {
    const tutorIndex = blockReview?.positions[blockReview.cursor] ?? idx;
    const current = questions[tutorIndex];
    if (!current) return;

    const chosenId = marked[current.id];
    const chosenAnswer =
      chosenId != null
        ? current.answers.find((a) => String(a.id) === String(chosenId))
        : undefined;
    const correct = current.answers.find((a) => !!a.isCorrect);

    setQuizTutorData({
      question: current.question ?? null,
      userAnswer: chosenAnswer?.text ?? null,
      correctAnswer: correct?.text ?? null,
      topicTitle: context?.topicTitle ?? null,
      certificationName: context?.certificationName ?? null,
    });
  }, [idx, marked, questions, blockReview, context?.topicTitle, context?.certificationName, setQuizTutorData]);

  // Reset del context tutor quando il quiz viene smontato
  useEffect(() => {
    return () => setQuizTutorData(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* -------------------- MODE SWITCH (controlled-friendly) -------------------- */
  const setModeSafe = (m: Mode) => {
    if (m === effectiveMode) return;

    // blocca switch se già risposto qualcosa (se ti rompe, commenta)
    if (Object.keys(marked).length > 0) return;

    clearProgress(`${storageScope}:training`);
clearProgress(`${storageScope}:exam`);
clearProgress(`${storageScope}:assessment`);

    onModeChange?.(m);

    if (controlledMode == null) setInternalMode(m);

    setIdx(0);
    setReviewMode(false);
    setBlockReview(null);
    consumedWrongExplanationQuestionIdsRef.current.clear();
    // Esplicito e non solo dedotto dal guard "marked non vuoto" sopra:
    // se quel guard cambiasse in futuro, blockPaused non deve mai
    // sopravvivere a un cambio di mode (schermata blocco visibile in
    // training che resta appesa dopo lo switch a exam).
    setBlockPaused(false);
    startedAtRef.current = null;
  };

  /* -------------------------------------------------------------
     TIMER EXAM — INIT + TICK stabile
  ------------------------------------------------------------- */

  useEffect(() => {
    if (effectiveMode === 'exam') {
      startedAtRef.current = null;

      const total =
        effectiveDuration === null ? null : effectiveDuration ?? questions.length * 60;

      if (total == null) return;

      setRemaining((prev) => (prev == null ? total : prev));
      return;
    }

    if (tickRef.current) cancelAnimationFrame(tickRef.current);
    tickRef.current = null;
    startedAtRef.current = null;
    setRemaining(null);
  }, [effectiveMode, effectiveDuration, questions.length]);

  useEffect(() => {
    if (effectiveMode !== 'exam' || finished) {
      if (tickRef.current) cancelAnimationFrame(tickRef.current);
      tickRef.current = null;
      return;
    }

    if (remaining == null) return;

    const total =
      effectiveDuration === null ? null : effectiveDuration ?? questions.length * 60;

    if (total == null) return;

    if (startedAtRef.current == null) startedAtRef.current = Date.now();

    const loop = () => {
      tickRef.current = requestAnimationFrame(loop);

      // Se abbiamo un'ancora dal server (resume cross-device riuscito),
      // il countdown scala da lì con un delta monotono locale
      // (performance.now(), immune a salti dell'orologio di sistema) invece
      // che dal meccanismo Date.now()/startedAtRef qui sotto — quel valore
      // arriva già calcolato dal server (TIMESTAMPDIFF su NOW()), non è mai
      // un timestamp assoluto che il client reinterpreta.
      let rest: number;
      if (examServerSyncRef.current) {
        const { remainingAtSync, perfAtSync } = examServerSyncRef.current;
        rest = Math.max(0, Math.floor(remainingAtSync - (performance.now() - perfAtSync) / 1000));
      } else {
        const elapsed = Math.floor(
          (Date.now() - (startedAtRef.current || Date.now())) / 1000
        );
        rest = Math.max(0, total - elapsed);
      }

      setRemaining(rest);

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
  // doFinish reads the latest quiz state; including it would restart the RAF
  // loop on every render and disturb timer scheduling.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveMode, finished, effectiveDuration, questions.length, remaining]);

  /* -------------------------- AUTOSAVE LOCALE ------------------------- */
  useEffect(() => {
    // Nuova "versione" dello stato a ogni cambiamento significativo. Sale
    // anche per i cambi innescati dal ripristino nel load effect (non solo
    // dalle azioni utente): non è un problema, resta monotono, che è
    // l'unica garanzia che serve al tiebreak server-side.
    revRef.current += 1;

    const payload = {
      qIds: questions.map((q) => q.id),
      marked,
      reviewLater: Array.from(reviewLater),
      mode: effectiveMode,
      remainingSec: remaining,
      startedAt: startedAtRef.current,
      idx,
      seed: seedRef.current ?? undefined,
      rev: revRef.current,
    };

    const flush = () => saveProgress(scopedKey, payload);
    const id = requestAnimationFrame(flush);

    // Chrome (e altri) sospendono i callback rAF nei tab in background: senza
    // questo, "rispondi -> cambia tab/chiudi" perde l'ultimo autosave in modo
    // silenzioso. visibilitychange/pagehide forzano il flush immediato.
    const onHide = () => {
      if (document.hidden) {
        cancelAnimationFrame(id);
        flush();
      }
    };
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('pagehide', flush);

    return () => {
      cancelAnimationFrame(id);
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('pagehide', flush);
    };
  }, [questions, marked, reviewLater, effectiveMode, remaining, idx, scopedKey]);

  /* -------------------------- SYNC DB (resume cross-device) -------------------------
     Effetto separato da quello locale sopra, deliberatamente: quello locale
     ha `remaining` fra le dipendenze (serve, per salvare il countdown ogni
     tick), ma se lo stesso dep facesse ripartire anche il debounce verso il
     DB, un countdown che cambia ogni secondo lo resetterebbe continuamente e
     la PUT non partirebbe mai durante un esame attivo. Qui `remaining` non
     c'è di proposito.
  ------------------------------------------------------------------- */
  useEffect(() => {
    const topicId = context?.topicId;
    const dbSyncEnabled = isLoggedIn && effectiveMode !== 'assessment' && !!topicId;
    if (!dbSyncEnabled) return;

    const flushDb = async () => {
      // Gate di idratazione: finché il load effect non ha concluso la
      // riconciliazione locale/DB, non scrivere — altrimenti una PUT con
      // seed fresco e rev 0 competerebbe con la riconciliazione stessa
      // (il guard >= lato server la scarterebbe comunque, ma è comunque
      // uno stato transitorio da evitare, non solo da tollerare).
      if (!hydratedRef.current) return;
      if (seedRef.current == null) return;

      // Dirty-state gate: niente PUT finché non c'è almeno una risposta data
      // o un avanzamento reale (idx > 0) — altrimenti ogni apertura di un
      // topic da loggato crea una riga vuota e genera traffico a vuoto.
      // ECCEZIONE deliberata: in exam mode è sempre "dirty" fin dall'inizio.
      // Il countdown parte comunque al mount (vedi tick loop sopra) — se
      // aspettassimo la prima risposta anche lì, un utente potrebbe evitare
      // di persistere mai l'inizio dell'esame semplicemente non rispondendo
      // subito, chiudere e riaprire, e ottenere un countdown pieno ogni
      // volta: esattamente l'exploit "pausa chiudendo il tab" che expires_at
      // esiste per chiudere. Per training (e implicitamente assessment, già
      // escluso sopra) non c'è un orologio da proteggere, quindi il gate si
      // applica per intero.
      const isDirty =
        effectiveMode === 'exam' || Object.keys(marked).length > 0 || idx > 0;
      if (!isDirty) return;

      // Fuori dal training currentBlock deve restare 0 anche quando la
      // stessa istanza di QuizTopicClient conserva blockSize durante lo
      // switch runtime a exam. La colonna è INT UNSIGNED NOT NULL ed è
      // validata server-side con isUInt; il doppio guard evita sia NaN
      // quando la prop è assente, sia blocchi spurii nelle altre modalità.
      const body: Record<string, unknown> = {
        seed: seedRef.current,
        qidsHash: hashIds(questions.map((q) => q.id)),
        currentIndex: idx,
        currentBlock:
          effectiveMode === 'training' && blockSize
            ? Math.floor(idx / blockSize)
            : 0,
        state: { marked, reviewLater: Array.from(reviewLater) },
        rev: revRef.current,
      };

      // Mandata a OGNI PUT in exam mode, non solo alla "prima" — è il
      // server a decidere quando usarla (VALUES(seed) <> seed): il client
      // non può sapere in modo affidabile quale PUT è la prima in assoluto
      // per questo seed (rete/pagehide possono far perdere quella "giusta").
      if (effectiveMode === 'exam' && effectiveDuration != null) {
        body.durationSec = effectiveDuration;
      }

      try {
        const res = await apiFetch(
          `/me/quiz-progress/${topicId}?lang=${lang}&mode=${effectiveMode}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            keepalive: true,
          }
        );
        if (!res.ok) return;

        const data = await res.json();
        const row = data?.row;
        if (!row) return;

        // Incondizionato: è così che un client con rev disallineato (rete
        // caduta prima, riga DB sconosciuta) si autocorregge al primo giro
        // riuscito, invece di continuare a scrivere con un rev troppo
        // basso che il guard server-side scarta in silenzio per sempre.
        revRef.current = row.rev;

        if (effectiveMode === 'exam' && typeof row.remainingSec === 'number') {
          examServerSyncRef.current = { remainingAtSync: row.remainingSec, perfAtSync: performance.now() };
        }
      } catch {
        // offline: il prossimo giro (debounce, o il prossimo hide/pagehide) riprova
      }
    };

    const timeoutId = setTimeout(flushDb, 2500);

    const onHideDb = () => {
      if (document.hidden) {
        clearTimeout(timeoutId);
        flushDb();
      }
    };
    document.addEventListener('visibilitychange', onHideDb);
    window.addEventListener('pagehide', flushDb);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('visibilitychange', onHideDb);
      window.removeEventListener('pagehide', flushDb);
    };
  }, [questions, marked, reviewLater, effectiveMode, idx, scopedKey, isLoggedIn, context?.topicId, lang, effectiveDuration]);

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

  const blockResult = useMemo(() => {
    if (!blockPaused || effectiveMode !== 'training' || !blockSize) return null;

    // next() ha già avanzato idx alla prima domanda del blocco successivo.
    // Il blocco appena concluso è quindi [idx - blockSize, idx), senza
    // dipendere dall'ordine delle chiavi di marked o da query aggiuntive.
    return calculateCompletedBlock({
      questions,
      marked,
      nextQuestionIndex: idx,
      blockSize,
    });
  }, [blockPaused, blockSize, effectiveMode, idx, marked, questions]);

  const blockWrongPositions = useMemo(() => {
    if (!blockPaused || effectiveMode !== 'training' || !blockSize) return [];
    return getCompletedBlockWrongPositions({
      questions,
      marked,
      nextQuestionIndex: idx,
      blockSize,
    });
  }, [blockPaused, blockSize, effectiveMode, idx, marked, questions]);

  /* ----------------------------- HANDLER ------------------------------ */
 const choose = (q: Question, a: Answer) => {
  setActionsOpen(false);
  if (blockReview) return;
  setMarked((m) => ({ ...m, [q.id]: a.id }));
  if (!isLoggedIn) increment(); // ✅ aggiunto
};

  const next = () => {
  setActionsOpen(false); // ✅ chiude menu quando vai avanti

  if (blockReview) {
    if (blockReview.cursor < blockReview.positions.length - 1) {
      setBlockReview((current) => current ? { ...current, cursor: current.cursor + 1 } : null);
    } else {
      setBlockReview(null);
      setBlockPaused(true);
    }
    return;
  }

  if (reviewMode) {
    const currentPos = reviewPositions.indexOf(idx);
    const nextPos = reviewPositions[currentPos + 1];

    if (nextPos !== undefined) setIdx(nextPos);
    else setReviewMode(false);
    return;
  }

  if (idx < questions.length - 1) {
    if (shouldPauseAtBlockBoundary({
      mode: effectiveMode,
      blockSize,
      currentIndex: idx,
      questionCount: questions.length,
    })) {
      setBlockPaused(true);
    }
    setIdx((i) => i + 1);
    return;
  }

  if (effectiveMode === 'training' && reviewPositions.length > 0) {
    setReviewMode(true);
    setIdx(reviewPositions[0]);
  }
};

const prev = () => {
  setActionsOpen(false); // ✅ chiude menu quando vai indietro
  if (blockReview) {
    setBlockReview((current) =>
      current && current.cursor > 0 ? { ...current, cursor: current.cursor - 1 } : current
    );
    return;
  }
  setIdx((i) => Math.max(i - 1, 0));
};

const exitBlockReview = () => {
  setBlockReview(null);
  setBlockPaused(true);
};


const toggleReviewLater = (qId: Question['id']) => {
  setActionsOpen(false); // ✅ chiude menu quando usi azione

  setReviewLater((old) => {
    const n = new Set(old);
    if (n.has(qId)) n.delete(qId);
    else n.add(qId);
    return n;
  });

  setReviewMode(false);
};

const goToFirstUnanswered = () => {
  setActionsOpen(false); // ✅ chiude menu quando salti domanda

  if (reviewUnansweredPositions.length > 0) {
    setIdx(reviewUnansweredPositions[0]);
    return;
  }

  if (unansweredPositions.length > 0) {
    setIdx(unansweredPositions[0]);
  }
};

 async function doFinish(timeExpired = false) {
  void timeExpired;
  setFinished(true);

  const total = questions.length;

  // ⚠️ meglio calcolarlo “vero”, non dal % arrotondato
  let correctCount = 0;
  for (const q of questions) {
    const chosen = marked[q.id];
    const right = q.answers.find((a) => !!a.isCorrect)?.id;
    if (chosen != null && right != null && Number(chosen) === Number(right)) {
      correctCount++;
    }
  }

  const correct = correctCount;

  const elapsedSec =
    startedAtRef.current != null
      ? Math.floor((Date.now() - startedAtRef.current) / 1000)
      : 0;

  // ✅ attempts COMPLETE: contiene anche isCorrect + usa nomi “camelCase”
  const attempts = questions.map((q) => {
    const chosen = marked[q.id] ?? null;
    const right = q.answers.find((a) => !!a.isCorrect)?.id ?? null;

    return {
      questionId: Number(q.id),
      chosenAnswerId: chosen != null ? Number(chosen) : null,
      isCorrect:
        chosen != null &&
        right != null &&
        Number(chosen) === Number(right),
    };
  });

  // ✅ tipo pulito (non usare typeof attempts nel type intersection)
  const summary: QuizSummary & { mode: Mode; attempts: typeof attempts } = {
    total,
    correct,
    scorePct, // puoi anche ricalcolarlo, ma ok lasciarlo
    marked,
    durationSec: elapsedSec,
    mode: effectiveMode,
    attempts,
  };

  setLastSummary(summary);


  // ✅ Analytics — completamento quiz / assessment.
// Serve per capire quanti utenti finiscono davvero il free test.
if (!completedTrackedRef.current) {
  completedTrackedRef.current = true;

  if (effectiveMode === "assessment") {
    const funnelContext = {
      cert_slug: context?.certificationSlug ?? null,
      topic_slug: context?.topicSlug ?? null,
      lang,
      score: scorePct,
    };
    trackFunnelEvent({ event: "assessment_completed", ...funnelContext });
    trackFunnelEvent({ event: "quiz_result_viewed", ...funnelContext });
  }

  trackQuizEvent(
    effectiveMode === 'assessment'
      ? 'assessment_completed'
      : 'quiz_completed',
    {
      lang,
      mode: effectiveMode,
      storage_scope: storageScope,
      certification: context?.certificationName ?? null,
      topic: context?.topicTitle ?? null,
      kind: context?.kind ?? null,
      total_questions: total,
      correct,
      score_pct: scorePct,
      duration_sec: elapsedSec,
    }
  );
  trackQuizEvent("quiz_result_viewed", {
    language: lang,
    quiz_mode: effectiveMode,
    certification_slug: context?.certificationSlug ?? null,
    source_page: "quiz_result",
    score_pct: scorePct,
  });
}

  try {
    await onFinish?.(summary);
  } catch {
    /* ignore */
  }

  clearProgress(scopedKey);
}

const submitAssessmentReport = async () => {
  if (!lastSummary || reportSubmitted) return;

  const email = reportEmail.trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setReportMessage(
      lang === "it"
        ? "Inserisci un'email valida."
        : lang === "fr"
        ? "Entre une adresse email valide."
        : lang === "es"
        ? "Introduce un email válido."
        : "Enter a valid email."
    );
    return;
  }

  setReportSending(true);
  setReportMessage(null);

  try {
    const res = await fetch("/api/backend/assessment-report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
  email,
  lang,
  source: "assessment_result",

  certification: context?.certificationSlug ?? null,
  topic: context?.topicSlug ?? null,

  kind: context?.kind ?? null,
  scorePct: lastSummary.scorePct,
  correct: lastSummary.correct,
  total: lastSummary.total,
}),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.ok) {
      throw new Error(data?.message || "Report failed");
    }

    setReportSubmitted(true);

   trackQuizEvent("assessment_email_submitted", {
  lang,
  source: "assessment_result",
  certification: context?.certificationSlug ?? null,
  topic: context?.topicSlug ?? null,
  score_pct: lastSummary.scorePct,
});
    setReportMessage(
      lang === "it"
        ? "Perfetto. Ti invieremo il report e i prossimi quiz consigliati."
        : lang === "fr"
        ? "Parfait. Nous t’enverrons le rapport et les prochains quiz conseillés."
        : lang === "es"
        ? "Perfecto. Te enviaremos el informe y los próximos cuestionarios recomendados."
        : "Perfect. We’ll send your report and recommended next quizzes."
    );
  } catch (e) {
    console.error("assessment report submit failed", e);
    setReportMessage(
      lang === "it"
        ? "Errore durante l'invio. Riprova tra poco."
        : lang === "fr"
        ? "Erreur pendant l’envoi. Réessaie dans un instant."
        : lang === "es"
        ? "Error durante el envío. Inténtalo de nuevo en un momento."
        : "Send failed. Please try again in a moment."
    );
  } finally {
    setReportSending(false);
  }
};

  const restart = () => {
  clearProgress(scopedKey);

  assessmentStartedTrackedRef.current = false;
  completedTrackedRef.current = false;
  setReportSubmitted(false);
  setReportMessage(null);

  setIdx(0);
  setMarked({});
  setReviewLater(new Set());
  setFinished(false);
  setLastSummary(null);
  startedAtRef.current = null;
  setReviewMode(false);
  setBlockPaused(false);
  setBlockReview(null);
  consumedWrongExplanationQuestionIdsRef.current.clear();

  const newSeed = makeSeed();
  seedRef.current = newSeed;
  const active = buildActiveQuestions(pool, effectiveMode, newSeed);
  setQuestions(active);

  const total =
    effectiveDuration === null ? null : effectiveDuration ?? active.length * 60;

  setRemaining(total);
};

  /* --------------------------- STATO BASE ----------------------------- */
  if (loading) return <div className="min-h-screen grid place-items-center">⏳</div>;
  if (err) return <div className="min-h-screen grid place-items-center text-red-600">{err}</div>;
  if (!questions.length) return <div className="min-h-screen grid place-items-center">No questions.</div>;

  const gradient = `bg-gradient-to-b ${categoryColor} text-white`;

  /* ---------------------- CHECKPOINT BLOCCO TRAINING ---------------------- */
  if (blockPaused && effectiveMode === 'training' && blockSize && blockResult) {
    return (
      <BlockResultsScreen
        lang={lang}
        correct={blockResult.correct}
        total={blockResult.total}
        percentage={blockResult.percentage}
        topicTitle={context?.topicTitle}
        blockNumber={blockResult.blockNumber}
        nextBlockSize={getNextBlockQuestionCount({
          blockSize,
          nextQuestionIndex: idx,
          questionCount: questions.length,
        })}
        categoryColor={categoryColor}
        onReviewErrors={blockWrongPositions.length > 0 ? () => {
          blockReviewOpeningCounterRef.current += 1;
          setBlockReview({
            positions: blockWrongPositions,
            cursor: 0,
            openingId: blockReviewOpeningCounterRef.current,
          });
          setBlockPaused(false);
        } : undefined}
        onContinue={() => setBlockPaused(false)}
      />
    );
  }

  /* ------------------------- SCHERMATA FINALE ------------------------- */
  if (finished) {
    const total = lastSummary?.total ?? questions.length;
    const correct = lastSummary?.correct ?? 0;
    const wrong = total - correct;
    const duration =
      lastSummary && lastSummary.durationSec ? fmt(lastSummary.durationSec) : '--:--';

    const backUrl = backToHref || withLang(lang, '/quiz-home');
    const markedMap = lastSummary?.marked ?? marked;

    const isAssessmentResult = effectiveMode === 'assessment';
    const assessmentStudyHref = withConversionContext(context?.backHref || backUrl, {
      source: 'assessment_result',
      certificationSlug: context?.certificationSlug,
      topicSlug: context?.topicSlug,
      score: scorePct,
    });
    const assessmentRegisterHref = withConversionContext(withLang(lang, '/register'), {
      source: 'assessment_result',
      certificationSlug: context?.certificationSlug,
      topicSlug: context?.topicSlug,
      score: scorePct,
      redirect: assessmentStudyHref,
    });

const assessmentCopy =
  scorePct < 50
    ? {
        badge: '⚠️',
        title: {
          it: 'Non sei ancora pronto per l’esame',
          en: 'You are not ready for the exam yet',
          fr: "Tu n'es pas encore prêt pour l'examen",
          es: 'Todavía no estás listo para el examen',
        },
        subtitle: {
          it: 'Hai ancora lacune importanti. Se facessi l’esame oggi, rischieresti seriamente di non superarlo.',
          en: 'You still have important gaps. If you took the exam today, you would seriously risk failing it.',
          fr: "Tu as encore des lacunes importantes. Si tu passais l'examen aujourd'hui, tu risquerais sérieusement de ne pas le réussir.",
          es: 'Todavía tienes lagunas importantes. Si hicieras el examen hoy, correrías un riesgo real de no aprobarlo.',
        },
        cta: {
          it: 'Inizia la preparazione seriamente',
          en: 'Start preparing seriously',
          fr: 'Commencer une vraie préparation',
          es: 'Empieza a prepararte en serio',
        },
      }
    : scorePct < 75
    ? {
        badge: '📘',
        title: {
          it: 'Sei sulla strada giusta',
          en: 'You are on the right track',
          fr: 'Tu es sur la bonne voie',
          es: 'Vas por el buen camino',
        },
        subtitle: {
          it: 'Hai buone basi, ma ci sono ancora errori che potrebbero costarti caro in un esame reale.',
          en: 'You have a decent base, but there are still mistakes that could cost you in a real exam.',
          fr: "Tu as de bonnes bases, mais il reste des erreurs qui pourraient te coûter cher lors d'un vrai examen.",
          es: 'Tienes una buena base, pero aún hay errores que podrían costarte caro en un examen real.',
        },
        cta: {
          it: 'Colma le lacune',
          en: 'Close your gaps',
          fr: 'Combler tes lacunes',
          es: 'Corrige tus puntos débiles',
        },
      }
    : {
        badge: '🔥',
        title: {
          it: 'Sei vicino a passare l’esame',
          en: 'You are close to passing the exam',
          fr: "Tu es proche de réussir l'examen",
          es: 'Estás cerca de aprobar el examen',
        },
        subtitle: {
          it: 'Il livello è buono. Ora devi consolidare gli errori e allenarti con simulazioni più realistiche.',
          en: 'Your level is good. Now you need to fix your weak spots and train with more realistic simulations.',
          fr: 'Ton niveau est bon. Il faut maintenant consolider tes erreurs et t’entraîner avec des simulations plus réalistes.',
          es: 'Tu nivel es bueno. Ahora debes consolidar tus errores y practicar con simulaciones más realistas.',
        },
        cta: {
          it: 'Preparati a passarlo davvero',
          en: 'Get ready to actually pass it',
          fr: 'Te préparer à vraiment le réussir',
          es: 'Prepárate para aprobarlo de verdad',
        },
      };

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
            {isAssessmentResult ? (
  <div className="space-y-3">
    <div className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-800">
      {label('assessment', lang)}
    </div>

    <div className="flex items-end gap-3">
      <div className="text-6xl font-black tracking-tight text-gray-950">
        {scorePct}%
      </div>
      <div className="pb-2 text-sm text-gray-500">
        {correct}/{total} {label('correctLabel', lang).toLowerCase()}
      </div>
    </div>

    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
      <h1 className="text-2xl font-bold text-amber-950">
        {assessmentCopy.badge} {assessmentCopy.title[lang]}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-amber-900">
        {assessmentCopy.subtitle[lang]}
      </p>
    </div>
  </div>
) : (
  <>
    <h1 className="text-2xl font-semibold mb-2">
      {label('summaryTitle', lang)}
    </h1>
    <p className="text-sm text-gray-600">
      {label('score', lang)} {scorePct}% · {total} {label('questionsLabel', lang)}
    </p>
  </>
)}

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

            {isAssessmentResult && (
  <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
    <h2 className="text-lg font-bold text-emerald-950">
      {lang === "it"
        ? "📩 Ricevi il report del tuo risultato"
        : lang === "fr"
        ? "📩 Reçois le rapport de ton résultat"
        : lang === "es"
        ? "📩 Recibe el informe de tu resultado"
        : "📩 Get your result report"}
    </h2>

    <p className="mt-2 text-sm leading-relaxed text-emerald-900">
      {lang === "it"
        ? "Ti invieremo il riepilogo del test, i prossimi quiz consigliati e consigli pratici per migliorare."
        : lang === "fr"
        ? "Nous t’enverrons le résumé du test, les prochains quiz conseillés et des conseils pratiques pour progresser."
        : lang === "es"
        ? "Te enviaremos el resumen del test, los próximos cuestionarios recomendados y consejos prácticos para mejorar."
        : "We’ll send your test summary, recommended next quizzes, and practical tips to improve."}
    </p>

    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
      <input
        type="email"
        value={reportEmail}
        onChange={(e) => setReportEmail(e.target.value)}
        placeholder={
          lang === "it"
            ? "La tua email"
            : lang === "fr"
            ? "Ton email"
            : lang === "es"
            ? "Tu email"
            : "Your email"
        }
        className="min-w-0 flex-1 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-emerald-500"
      />

      <button
        type="button"
        disabled={reportSending || reportSubmitted}
        onClick={submitAssessmentReport}
        className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
      >
        {reportSending
          ? lang === "it"
            ? "Invio..."
            : lang === "fr"
            ? "Envoi..."
            : lang === "es"
            ? "Enviando..."
            : "Sending..."
          : lang === "it"
          ? "Invia report"
          : lang === "fr"
          ? "Envoyer le rapport"
          : lang === "es"
          ? "Enviar informe"
          : "Send report"}
      </button>
    </div>

    {reportMessage && (
      <p className="mt-2 text-xs font-medium text-emerald-900">
        {reportMessage}
      </p>
    )}

    <p className="mt-2 text-[11px] text-emerald-900/70">
      {lang === "it"
        ? "Niente spam. Puoi disiscriverti quando vuoi."
        : lang === "fr"
        ? "Pas de spam. Tu peux te désinscrire à tout moment."
        : lang === "es"
        ? "Sin spam. Puedes darte de baja cuando quieras."
        : "No spam. You can unsubscribe anytime."}
    </p>

    {!user && (
      <Link
        href={assessmentRegisterHref}
        className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-emerald-300 bg-white px-5 py-3 text-sm font-bold text-emerald-800 hover:bg-emerald-50"
      >
        {lang === 'it'
          ? 'Salva il risultato e continua a studiare'
          : lang === 'fr'
          ? 'Enregistrer le résultat et continuer à étudier'
          : lang === 'es'
          ? 'Guardar el resultado y seguir estudiando'
          : 'Save your result and continue studying'}
      </Link>
    )}
  </div>
)}

           {!isAssessmentResult && !!wrongDetails.length && (
              <div className="mt-4 border-t pt-4">
                <h2 className="text-sm font-semibold text-gray-800 mb-2">
                  {label('wrongSummaryTitle', lang)} ({wrongDetails.length})
                </h2>
                <ul className="space-y-3 max-h-72 overflow-auto pr-1">
                  {wrongDetails.map((item, i) => (
                    <li key={item.key} className="bg-slate-50 rounded-xl p-3 text-sm">
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

            {isAssessmentResult && (
  <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
    <h2 className="text-lg font-bold text-gray-950">
      🔒 {lang === 'it'
        ? 'Review completa disponibile con Premium'
        : lang === 'fr'
        ? 'Correction complète disponible avec Premium'
        : lang === 'es'
        ? 'Revisión completa disponible con Premium'
        : 'Full review available with Premium'}
    </h2>

    <p className="mt-2 text-sm leading-relaxed text-gray-600">
      {lang === 'it'
        ? 'Sblocca spiegazioni dettagliate, ripasso errori e simulazioni realistiche per capire dove stai sbagliando davvero.'
        : lang === 'fr'
        ? 'Débloque les explications détaillées, la révision des erreurs et les simulations réalistes pour comprendre tes vrais points faibles.'
        : lang === 'es'
        ? 'Desbloquea explicaciones detalladas, repaso de errores y simulaciones realistas para entender tus puntos débiles reales.'
        : 'Unlock detailed explanations, mistake review, and realistic simulations to understand your real weak spots.'}
    </p>

   {!isPremiumUser && (
  <button
    type="button"
    disabled={premiumClicked}
    className="mt-4 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-600 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
    onClick={() => {
  if (premiumClickedRef.current) return;
  premiumClickedRef.current = true;
  setPremiumClicked(true);

  // ✅ GA / analytics frontend
  trackQuizEvent('premium_cta_clicked', {
    lang,
    mode: effectiveMode,
    source: 'assessment_result',
    storage_scope: storageScope,
    certification: context?.certificationName ?? null,
    topic: context?.topicTitle ?? null,
    score_pct: scorePct,
  });

  // ✅ Funnel tracking backend → DB/admin
  trackFunnelEvent({
    event: "premium_clicked",
    cert_slug: context?.certificationSlug ?? null,
    topic_slug: context?.topicSlug ?? null,
    lang,
    score: scorePct,
  });

  const pricing = new URL(pricingPath(lang), window.location.origin);
  pricing.searchParams.set("source", "quiz_result");
  if (context?.certificationSlug) pricing.searchParams.set("certification_slug", context.certificationSlug);
  router.push(`${pricing.pathname}${pricing.search}`);
}}
  >
    {lang === "it"
      ? `Sblocca il tuo piano ${context?.certificationName ?? "di preparazione"}`
      : lang === "fr"
      ? `Débloquez votre plan ${context?.certificationName ?? "de préparation"}`
      : lang === "es"
      ? `Desbloquea tu plan ${context?.certificationName ?? "de preparación"}`
      : `Unlock your ${context?.certificationName ?? "study"} plan`}
  </button>
)}
 </div>
)}

           {/* ✅ Upsell consentito SOLO a fine quiz (non invasivo) */}
{!isAssessmentResult && !isPremiumUser && (
  <div className="pt-2">
    <PremiumTeaserBox
      lang={lang}
      certificationSlug={context?.certificationSlug}
      topicSlug={context?.topicSlug}
      score={scorePct}
    />
  </div>
)}

<div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-5">
  <h2 className="text-lg font-bold text-blue-950">
    {lang === "it"
      ? "Continua ad allenarti"
      : lang === "fr"
      ? "Continuez à vous entraîner"
      : lang === "es"
      ? "Sigue practicando"
      : "Keep practicing"}
  </h2>

  <p className="mt-2 text-sm leading-relaxed text-blue-900">
    {lang === "it"
      ? "Hai completato questo quiz. Ora puoi tornare alla certificazione, riprovare il quiz o continuare la preparazione con altri argomenti."
      : lang === "fr"
      ? "Vous avez terminé ce quiz. Vous pouvez maintenant revenir à la certification, refaire le quiz ou continuer votre préparation avec d’autres sujets."
      : lang === "es"
      ? "Has completado este quiz. Ahora puedes volver a la certificación, repetir el quiz o continuar la preparación con otros temas."
      : "You completed this quiz. You can now go back to the certification, retry the quiz, or continue preparing with other topics."}
  </p>

  <div className="mt-4 flex flex-wrap gap-2">
    {context?.backHref && (
      <Link
        href={context.backHref}
        className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
      >
        {lang === "it"
  ? "Prova altri topic"
  : lang === "fr"
  ? "Essayer d’autres sujets"
  : lang === "es"
  ? "Probar otros temas"
  : "Try other topics"}
      </Link>
    )}

    <button
      type="button"
      onClick={restart}
      className="rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-800 hover:bg-blue-100"
    >
      {lang === "it"
        ? "Riprova il quiz"
        : lang === "fr"
        ? "Refaire le quiz"
        : lang === "es"
        ? "Repetir el quiz"
        : "Retry quiz"}
    </button>

    {!isPremiumUser && (
      <button
        type="button"
        onClick={() => router.push(pricingPath(lang))}
        className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
      >
        {lang === "it"
          ? "Sblocca spiegazioni Premium"
          : lang === "fr"
          ? "Débloquer les explications Premium"
          : lang === "es"
          ? "Desbloquear explicaciones Premium"
          : "Unlock Premium explanations"}
      </button>
    )}
  </div>
</div>

<div className="mt-4 flex flex-wrap gap-3 items-center justify-between">
  <div className="flex flex-wrap gap-2 text-sm">
    <button
      type="button"
      className="px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 cursor-pointer"
      onClick={() => router.push(backUrl)}
    >
      {label("backToQuizHome", lang)}
    </button>

    <button
      type="button"
      className="px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 cursor-pointer"
      onClick={() => router.push(withLang(lang, "/profile"))}
    >
      {label("seeProfile", lang)}
    </button>
  </div>
</div>
          </div>
        </div>
      </div>
    );
  }

  /* --------------------------- UI QUIZ NORMALE ------------------------ */
const displayedIndex = blockReview?.positions[blockReview.cursor] ?? idx;
const q = questions[displayedIndex];

const isExam = effectiveMode === 'exam';
const isAssessment = effectiveMode === 'assessment';
const isTestLike = isExam || isAssessment;



const submitFeedback = async () => {
  if (!onFeedback) return;
  if (!q?.id) return;

  setFbSending(true);
  setFbSent(false);

  try {
    await onFeedback({
      questionId: Number(q.id),
      type: fbType,
      description: fbText.trim() || undefined,
    });

    setFbSent(true);
    setFbOpen(false);
    setFbText("");
    setFbType("typo");
  } catch (e) {
    console.error("🟥 feedback FAILED", e);
    alert(lang === "it" ? "Errore invio feedback" : "Failed to send feedback");
  } finally {
    setFbSending(false);
  }
};

const chosen = marked[q.id];

const reviewTotal = reviewPositions.length;
const reviewIndex = reviewMode ? Math.max(0, reviewPositions.indexOf(idx)) + 1 : 0;
const blockReviewIndex = blockReview ? blockReview.cursor + 1 : 0;

const canGoNext =
  !!blockReview ||
  idx < questions.length - 1 ||
  (effectiveMode === 'training' && reviewPositions.length > 0);
   /* ============================================================
   GATING QUIZ — 3 livelli

   1. REGISTRATION GATE (guest, dopo 5 domande)
      - utente non loggato che ha risposto >= 5 domande
      - mostra RegistrationGate con score parziale
      - escape hatch: "Continua senza account" (onBack vuoto)
      - NON scatta in modalità assessment

   2. PREMIUM GATE (free loggato, dopo 20 domande)
      - utente loggato ma non premium
      - mostra PremiumQuestionLimitGate con score reale
      - "Continua gratis domani" → torna all'ultima domanda free
      - NON scatta in modalità assessment

   3. SPIEGAZIONI LOCKED (free loggato, in training)
      - premiumLocked arriva dal context (single source of truth)
      - se backend locka: q.explanation arriva null per i free
      - premium/admin: spiegazione completa
      - free: preview + CTA

   Regole generali:
   - NON ricalcolare isPremiumUser/premiumLocked dentro QuizEngine
   - usare SOLO context.isPremiumUser, context.premiumLocked, context.isAuthenticated
   - l'assessment bypassa tutti i gate (ha il suo flusso)

   Backend contract:
   - explanation === null quando lock attivo + utente free
   - explanation !== null per premium/admin

   Flags:
   - Railway: PREMIUM_ENABLED=1, PREMIUM_LOCK_EXPLANATIONS=1
   - Vercel:  NEXT_PUBLIC_PREMIUM_ENABLED=1,
              NEXT_PUBLIC_PREMIUM_LOCK_EXPLANATIONS=1
============================================================ */

// ------------------------------------------------------------------
// PREMIUM (frontend) — single source of truth
// - isLoggedIn: context.isAuthenticated || context.isPremiumUser
// - isPremiumUser: viene dal context
// - premiumLocked: viene dal context
// - q.explanation: se backend locka, può arrivare null per i free
// - REGISTER_LIMIT: gate registrazione dopo 5 domande (guest)
// - FREE_LIMIT: gate Premium dopo 20 domande (free loggato)
// ------------------------------------------------------------------

const explainText = q.explanation ? stripExplainPrefix(q.explanation) : '';

// ------------------------------------------------------------------
// GATE 1 — Registrazione (guest, non assessment)
// ------------------------------------------------------------------
if (!isLoggedIn && registerLimitReached && !isAssessment) {
  const answeredValues = Object.values(marked).filter(v => v != null);
  const correctSoFar = questions.slice(0, 5).filter(q => {
    const chosen = marked[q.id];
    const right = q.answers.find(a => !!a.isCorrect)?.id;
    return chosen != null && right != null && Number(chosen) === Number(right);
  }).length;

  return (
    <div className={`min-h-[100dvh] ${gradient}`}>
      <div className="mobile-safe-top max-w-5xl mx-auto px-4 pt-20 pb-28">
        <RegistrationGate
          lang={lang}
          certificationSlug={context?.certificationSlug}
          topicSlug={context?.topicSlug}
          correctCount={correctSoFar}
          totalAnswered={Math.min(answeredValues.length, 5)}
          onBack={() => {}}
        />
      </div>
    </div>
  );
}
return (
  <div className={`min-h-[100dvh] ${gradient} flex flex-col`}>
    {/* ===================== TOP (non scrolla) ===================== */}
    <div className="mobile-safe-top max-w-5xl mx-auto w-full px-3 sm:px-4 pt-3 sm:pt-6">

      {/* header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <div className="text-sm opacity-90">
          {blockReview
            ? `${BLOCK_COPY.reviewErrors[lang]} ${blockReviewIndex}/${blockReview.positions.length}`
            : `${label('question', lang)} ${idx + 1}/${questions.length}`} ·{' '}
          {label('answered', lang)} {answeredCount}
          <span className="ml-2 inline-flex items-center rounded-full bg-white/10 px-2 py-0.5 text-xs">
            {isAssessment ? label('assessment', lang) : isExam ? tQuiz.modeExam : tQuiz.modeTraining}
          </span>

          {hideModeSwitch && isExam && (
            <span className="ml-2 inline-flex items-center rounded-full bg-white/10 px-2 py-0.5 text-xs">
              🧪{' '}
              {lang === 'it'
                ? 'Mock Exam'
                : lang === 'fr'
                ? 'Mock examen'
                : lang === 'es'
                ? 'Simulacro'
                : 'Mock Exam'}
            </span>
          )}

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
            </>
          )}
        </div>

        {!hideModeSwitch && (
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
        )}
      </div>


        {/* ✅ Sticky timer — exam mode (top area, stabile) */}
        {effectiveMode === 'exam' &&
          typeof remaining === 'number' &&
          typeof examDurationSec === 'number' && (
            <div className="mb-2">
              <div className="mx-auto w-fit rounded-full border border-slate-200 bg-white/90 px-2 py-1 text-xs sm:text-sm font-semibold shadow-sm backdrop-blur">

                <span className="opacity-80">⏱️</span>{' '}
                <span className="text-slate-600">{timerLabel}:</span>{' '}
                <span
                  className={[
                    'tabular-nums',
                    remaining <= examDurationSec * 0.2 ? 'text-amber-700' : 'text-slate-900',
                  ].join(' ')}
                >
                  {timeStrFromSec(remaining)}
                </span>
              </div>
            </div>
          )}

       {/* Exam / Free Test notice */}
{isTestLike && (
  <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
    <p className="text-sm font-semibold">
      ⚠️{' '}
      {lang === 'it'
        ? isAssessment
          ? 'Free test: niente soluzioni immediate'
          : 'Modalità esame: niente feedback immediato'
        : lang === 'fr'
        ? isAssessment
          ? 'Test gratuit : aucune solution immédiate'
          : "Mode examen : aucun retour immédiat"
        : lang === 'es'
        ? isAssessment
          ? 'Test gratuito: sin soluciones inmediatas'
          : 'Modo examen: sin feedback inmediato'
        : isAssessment
        ? 'Free test: no instant answers'
        : 'Exam mode: no instant feedback'}
    </p>

    <p className="mt-1 text-sm text-amber-900/90">
      {lang === 'it'
        ? isAssessment
          ? 'Rispondi come in un vero esame. Vedrai il risultato alla fine.'
          : 'Concentrati su gestione del tempo e precisione. Potrai rivedere le risposte alla fine.'
        : lang === 'fr'
        ? isAssessment
          ? "Réponds comme à un vrai examen. Tu verras le résultat à la fin."
          : "Concentre-toi sur le temps et la précision. Tu pourras revoir tes réponses à la fin."
        : lang === 'es'
        ? isAssessment
          ? 'Responde como en un examen real. Verás el resultado al final.'
          : 'Concéntrate en el tiempo y la precisión. Podrás revisar tus respuestas al final.'
        : isAssessment
        ? 'Answer like a real exam. You will see your result at the end.'
        : 'Focus on time management and accuracy. You can review your answers at the end.'}
    </p>
  </div>
)}

        {context && (
          <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-white/90">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium">{context.certificationName}</span>

              {context.topicTitle && (
                <>
                  <span className="opacity-70">›</span>
                  <span className="opacity-95">{context.topicTitle}</span>
                </>
              )}

              <span className="ml-1 inline-flex items-center rounded-full bg-white/10 px-2 py-0.5 text-xs">
                {context.kind === 'topic' ? 'TOPIC' : context.kind === 'mixed' ? 'MIXED' : 'MOCK EXAM'}
              </span>

              {premiumLocked && (
                <span className="ml-1 inline-flex items-center rounded-full bg-white/10 px-2 py-0.5 text-xs">
                  Premium
                </span>
              )}
            </div>

            {context.backHref && (
              <a
                href={context.backHref}
                className="ml-auto text-xs underline underline-offset-2 opacity-80 hover:opacity-100"
              >
                {context.backLabel ?? '← Back'}
              </a>
            )}
          </div>
        )}
      </div>

      {/* ===================== MIDDLE (solo qui scroll) ===================== */}
     <div className="max-w-5xl mx-auto w-full px-3 sm:px-4 flex-1 min-h-0 overflow-y-auto pb-24 sm:pb-16">


        {/* domanda + exhibit realmente necessario per gli item pratici */}
        <div className="bg-white text-gray-900 rounded-2xl shadow-lg p-5 mb-4 min-h-32">
          {q.exhibit?.content && (
            <figure className="mb-5 overflow-hidden rounded-xl border border-slate-300 bg-slate-950 text-slate-100">
              <figcaption className="border-b border-slate-700 bg-slate-900 px-4 py-2 text-xs font-bold uppercase tracking-wide text-slate-300">
                {q.exhibit.title || (lang === "it" ? "Exhibit" : "Exhibit")}
              </figcaption>
              <pre className="overflow-x-auto whitespace-pre p-4 font-mono text-xs leading-relaxed sm:text-sm" aria-label={q.exhibit.title || "Question exhibit"}>
                {q.exhibit.content}
              </pre>
            </figure>
          )}
          <p className="font-medium leading-relaxed text-[17px]">{q.question}</p>
        </div>

        {/* feedback (sempre disponibile se onFeedback è passato) */}
{onFeedback && (
  <div className="mb-3">
    <button
      type="button"
      className="text-xs underline underline-offset-2 opacity-80 hover:opacity-100"
      onClick={() => {
        setFbSent(false);
        setFbOpen((v) => !v);
      }}
    >
      {lang === "it"
        ? "Segnala un problema"
        : lang === "fr"
        ? "Signaler un problème"
        : lang === "es"
        ? "Reportar un problema"
        : "Report an issue"}
    </button>

    {fbOpen && (
      <div className="mt-2 rounded-xl border border-white/15 bg-black/20 backdrop-blur p-3">
        <div className="flex flex-wrap items-center gap-2">
          <select
            className="rounded-lg bg-white/10 px-2 py-1 text-xs"
            value={fbType}
            onChange={(e) => setFbType(e.target.value as any)}
          >
            <option value="typo">{lang === "it" ? "Refuso" : "Typo"}</option>
            <option value="wrong_answer">{lang === "it" ? "Risposta errata" : "Wrong answer"}</option>
            <option value="outdated">{lang === "it" ? "Non aggiornato" : "Outdated"}</option>
            <option value="other">{lang === "it" ? "Altro" : "Other"}</option>
          </select>

          <button
            type="button"
            className="ml-auto rounded-lg bg-emerald-500 px-3 py-1 text-xs font-semibold text-white disabled:opacity-40"
            onClick={submitFeedback}
            disabled={fbSending}
          >
            {fbSending
              ? (lang === "it" ? "Invio..." : "Sending...")
              : (lang === "it" ? "Invia" : "Send")}
          </button>
        </div>

        <textarea
          className="mt-2 w-full rounded-lg bg-white/10 p-2 text-xs"
          rows={3}
          placeholder={
            lang === "it"
              ? "Descrivi il problema (opzionale)"
              : lang === "fr"
              ? "Décris le problème (optionnel)"
              : lang === "es"
              ? "Describe el problema (opcional)"
              : "Describe the issue (optional)"
          }
          value={fbText}
          onChange={(e) => setFbText(e.target.value)}
        />

        {fbSent && (
          <div className="mt-2 text-xs text-emerald-200">
            ✅ {lang === "it" ? "Inviato" : "Sent"}
          </div>
        )}
      </div>
    )}
  </div>
)}
        {/* risposte (altezza stabile + no scale) */}
        <div className="space-y-3">
          {q.answers.map((a) => {
            const isChosen = chosen === a.id;
            const isRight = !!a.isCorrect;
            const showFeedback = !isTestLike && chosen != null;

            let btnClasses =
              'bg-white text-gray-900 border border-white/20 hover:bg-white/90';

            if (isTestLike) {
              if (isChosen) {
                btnClasses =
                  'bg-emerald-500 text-white border-2 border-white shadow-[0_0_10px_rgba(255,255,255,0.5)] ring-2 ring-white/70';
              }
            } else {
              if (!showFeedback) {
                if (isChosen) {
                  btnClasses =
                    'bg-emerald-500 text-white border-2 border-white shadow-[0_0_10px_rgba(255,255,255,0.5)] ring-2 ring-white/70';
                }
              } else {
                if (isRight) {
                  btnClasses =
                    'bg-emerald-500 text-white border-2 border-white shadow-[0_0_10px_rgba(255,255,255,0.5)]';
                } else if (isChosen && !isRight) {
                  btnClasses =
                    'bg-red-500 text-white border-2 border-white shadow-[0_0_10px_rgba(255,255,255,0.5)] ring-2 ring-white/70';
                }
              }
            }

            return (
              <button
                key={String(a.id)}
                type="button"
                onClick={() => choose(q, a)}
                disabled={!!blockReview}
                className={`w-full text-left rounded-2xl px-4 py-3 min-h-[56px] leading-snug whitespace-normal transition border-2 ${btnClasses} ${blockReview ? 'cursor-default' : ''}`}
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

 {/* spiegazione (training) — gate errori free */}
  {!isTestLike && chosen != null && q.explanation && (() => {
    const isWrong = chosen !== q.answers.find((a) => !!a.isCorrect)?.id;

    // Spiegazione su risposta CORRETTA: sempre visibile a tutti
    if (!isWrong) {
      return (
        <div className="mt-4 bg-white/10 rounded-xl p-4 text-sm">
          <b>{label('explain', lang)}</b>{' '}
          {explainText}
        </div>
      );
    }

    // Risposta SBAGLIATA — controlla se restano spiegazioni free
    const isLocked = isWrongExplanationLocked({
      isPremiumUser,
      isLoggedIn,
      wrongExpLeft,
      adUnlocked: adUnlockedQuestionIds.has(Number(q.id)),
    });

   if (isLocked) {
  // Gate mini — mostra solo su risposte sbagliate quando finito il credito
  return (
    <div className="mt-4 bg-white/10 rounded-xl p-4 text-sm">
      <GateShownTracker
        questionId={q.id}
        lang={lang}
        mode={effectiveMode}
        certificationSlug={context?.certificationSlug ?? null}
        topicSlug={context?.topicSlug ?? null}
        source={blockReview ? 'block-review' : undefined}
        onBlockReviewGateViewed={blockReview ? () => {
          if (!claimBlockReviewGateOpening(
            blockReviewGateTrackedOpeningsRef.current,
            blockReview.openingId
          )) return;

          void apiFetch('/me/block-review-gate-viewed', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              cert_slug: context?.certificationSlug ?? null,
              topic_slug: context?.topicSlug ?? null,
              lang,
            }),
          });
        } : undefined}
      />

      <div className="flex items-start gap-3">
        <span className="text-xl">🔒</span>

        <div>
          <p className="font-semibold text-white">
            {lang === "it"
              ? `Hai esaurito le ${wrongExpLimit} spiegazioni gratuite.`
              : lang === "fr"
              ? `Vous avez épuisé vos ${wrongExpLimit} explications gratuites.`
              : lang === "es"
              ? `Has agotado tus ${wrongExpLimit} explicaciones gratuitas.`
              : `You've used all ${wrongExpLimit} free explanations.`}
          </p>

          <p className="mt-1 text-xs text-white/75">
            {lang === "it"
              ? "Sblocca tutte le spiegazioni e continua la preparazione senza limiti."
              : lang === "fr"
              ? "À partir de maintenant, vous risquez de refaire les mêmes erreurs sans savoir pourquoi. Les explications détaillées et le Tutor IA sont réservés à Premium."
              : lang === "es"
              ? "A partir de ahora puedes seguir fallando las mismas preguntas sin saber por qué. Las explicaciones detalladas y el Tutor IA solo están disponibles con Premium."
              : "Unlock every explanation and continue preparing without limits."}
          </p>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-white/20 bg-black/20 p-3">
            <p className="font-semibold text-white text-xs">
              🔒{' '}
              {lang === 'it'
                ? "Il Tutor AI ti spiega ogni errore all'istante"
                : lang === 'fr'
                ? 'Le Tutor IA explique chaque erreur instantanément'
                : lang === 'es'
                ? 'El Tutor IA explica cada error al instante'
               : "The AI Tutor explains every mistake instantly"}
            </p>
            <p className="mt-1 text-xs text-white/70">
              {lang === 'it'
                ? 'Chiedi "perché ho sbagliato?" e ricevi una spiegazione su misura, non un testo generico. Illimitato con Premium.'
                : lang === 'fr'
                ? 'Demandez "pourquoi je me suis trompé ?" et recevez une explication sur mesure. Illimité avec Premium.'
                : lang === 'es'
                ? 'Pregunta "¿por qué me equivoqué?" y recibe una explicación a medida. Ilimitado con Premium.'
                : 'Ask "why did I get this wrong?" and get a tailored explanation, not generic text. Unlimited with Premium.'}
            </p>
            <Link
              href={`${pricingPath(lang)}?source=explanation_paywall${context?.certificationSlug ? `&certification_slug=${encodeURIComponent(context.certificationSlug)}` : ""}`}
              onClick={() => {
                trackQuizEvent('premium_cta_clicked', {
                  lang,
                  mode: effectiveMode,
                  source: 'locked_wrong_explanation',
                  question_id: Number(q.id),
                  experiment_variant: experimentVariant,
                });

                // ✅ Tracking click Premium nel funnel (DB), oltre a GA4 sopra
                trackFunnelEvent({
                  event: "premium_clicked_locked_explanation",
                  email: user?.email || null,
                  cert_slug: context?.certificationSlug ?? null,
                  topic_slug: context?.topicSlug ?? null,
                  lang,
                });
              }}
              className="mt-2 inline-block rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-600"
            >
              {lang === 'it'
                ? 'Passa a Premium'
                : lang === 'fr'
                ? 'Passer à Premium'
                : lang === 'es'
                ? 'Pasar a Premium'
                : 'Go Premium'}
            </Link>
          </div>
        </div>
      );
    }

    // Risposta sbagliata + credito disponibile: mostra e consuma
    // useEffect per consumare il credito (evita chiamate doppie su re-render)
    // NB: questo blocco viene renderizzato una volta sola per domanda grazie a chosen != null
    // ma per sicurezza usiamo un ref per non chiamare due volte.
    // → Vedi nota sotto sul WrongExplanation wrapper component.
    return (
      <div className="mt-4 bg-white/10 rounded-xl p-4 text-sm">
        <b>{label('explain', lang)}</b>{' '}
        {explainText}
        <WrongExplanationTracker
          key={String(q.id)}
          questionId={q.id}
          isLoggedIn={isLoggedIn}
          isPremiumUser={isPremiumUser}
          onConsume={consumeWrongExplanation}
        />
      </div>
    );
  })()}
      </div>
{/* ===================== BOTTOM (fixed) + PROGRESS (attached) ===================== */}
<div className="fixed inset-x-0 bottom-0 z-30">
  <div className="mx-auto max-w-5xl px-3 sm:px-4 pb-[env(safe-area-inset-bottom)] relative">

    {/* PROGRESS BAR (WOW) — sempre sopra la barra, mai sopra i bottoni */}
    <div className="absolute -top-3 left-3 right-3 sm:left-4 sm:right-4">
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ease-out
            ${
              isExam
                ? scorePct < 50
                  ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.75)]'
                  : scorePct < 75
                  ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.75)]'
                  : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.75)]'
                : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]'
            }`}
          style={{ width: `${((idx + 1) / questions.length) * 100}%` }}
        />
      </div>
    </div>

    {/* NAV BAR */}
    <div className="rounded-xl bg-black/20 backdrop-blur border border-white/10 p-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

        {/* ROW 1 */}
        <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-2">
          <button
            type="button"
            className="w-full px-3 py-2 rounded-lg bg-white/10 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={prev}
            disabled={blockReview ? blockReview.cursor === 0 : idx === 0}
          >
            ‹ {label('back', lang)}
          </button>

          <button
            type="button"
            className="w-full px-4 py-2 rounded-lg bg-emerald-500 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={next}
            disabled={!canGoNext}
          >
            {label('next', lang)} ›
          </button>
        </div>

{/* ROW 2 */}
<div className="flex flex-wrap items-center gap-2 sm:flex-nowrap sm:justify-end">

  {/* ✅ Segnala (solo se onFeedback esiste) */}
  {onFeedback && (
    <button
      type="button"
      className="flex-1 sm:flex-none px-3 py-2 rounded-lg bg-white/10 text-sm"
      onClick={openFeedback}
    >
      {lang === "it"
        ? "Segnala"
        : lang === "fr"
        ? "Signaler"
        : lang === "es"
        ? "Reportar"
        : "Report"}
    </button>
  )}

  {!blockReview && <button
    type="button"
    className="flex-1 sm:flex-none px-3 py-2 rounded-lg bg-white/10 text-sm"
    onClick={() => toggleReviewLater(q.id)}
  >
    {label('review', lang)} {reviewLater.has(q.id) ? '★' : '☆'}
  </button>}

  {!blockReview && <button
    type="button"
    className="flex-1 sm:flex-none px-3 py-2 rounded-lg bg-white/10 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
    onClick={goToFirstUnanswered}
    disabled={!hasUnanswered && reviewUnansweredPositions.length === 0}
  >
    <span className="sm:hidden">{label('gotoUnShort', lang)}</span>
    <span className="hidden sm:inline">{label('gotoUn', lang)}</span>
  </button>}

  {blockReview && (
    <button
      type="button"
      className="flex-1 sm:flex-none px-3 py-2 rounded-lg bg-white/10 text-sm"
      onClick={exitBlockReview}
    >
      {lang === 'it' ? 'Torna al riepilogo' : lang === 'fr' ? 'Retour au récapitulatif' : lang === 'es' ? 'Volver al resumen' : 'Back to summary'}
    </button>
  )}

  {blockReview ? null : isTestLike ? (
  <button
    type="button"
    className="flex-1 sm:flex-none px-3 py-2 rounded-lg bg-red-500 text-sm font-semibold"
    onClick={() => doFinish(false)}
  >
    {isAssessment
      ? lang === "it"
        ? "Vedi risultato"
        : lang === "fr"
        ? "Voir le résultat"
        : lang === "es"
        ? "Ver resultado"
        : "See result"
      : label("finish", lang)}
  </button>
) : idx === questions.length - 1 ? (
  <button
    type="button"
    className="flex-1 sm:flex-none px-3 py-2 rounded-lg bg-emerald-500 text-sm font-semibold text-white"
    onClick={() => doFinish(false)}
  >
    {lang === "it"
      ? "Vedi risultato"
      : lang === "fr"
      ? "Voir le résultat"
      : lang === "es"
      ? "Ver resultado"
      : "See result"}
  </button>
) : (
  <button
    type="button"
    className="flex-1 sm:flex-none px-3 py-2 rounded-lg bg-white/10 text-sm"
    onClick={restart}
  >
    {label("restart", lang)}
  </button>
)}
</div>

      </div>
    </div>

  </div>
</div>
    </div>
  );
} 

 /**
 * Componente invisibile che chiama consumeWrongExplanation una sola volta
 * per ogni domanda sbagliata. Usa useEffect + ref per evitare doppie chiamate.
 */
function WrongExplanationTracker({
  questionId,
  isLoggedIn,
  isPremiumUser,
  onConsume,
}: {
  questionId: number | string;
  isLoggedIn: boolean;
  isPremiumUser: boolean;
  onConsume: (questionId: number | string) => Promise<boolean>;
}) {
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    if (!isLoggedIn || isPremiumUser) return;
    calledRef.current = true;
    onConsume(questionId);
  }, [questionId]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

function GateShownTracker({
  questionId,
  lang,
  mode,
  certificationSlug,
  topicSlug,
  source,
  onBlockReviewGateViewed,
}: {
  questionId: number | string;
  lang: string;
  mode: string;
  certificationSlug: string | null;
  topicSlug: string | null;
  source?: 'block-review';
  onBlockReviewGateViewed?: () => void;
}) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;

    trackQuizEvent("explanation_paywall_viewed", explanationPaywallParams({
      language: lang,
      quizMode: mode,
      questionId: Number(questionId),
      certificationSlug,
      source,
    }));
    trackQuizEvent('paywall_viewed', {
      language: lang,
      quiz_mode: mode,
      certification_slug: certificationSlug,
      topic_slug: topicSlug,
      paywall_type: 'wrong_explanation',
      source: source ?? 'quiz',
    });
    trackFunnelEvent({
      event: 'paywall_viewed',
      cert_slug: certificationSlug,
      topic_slug: topicSlug,
      lang,
    });
    onBlockReviewGateViewed?.();
    trackMetaPixel("Lead");
  }, [questionId, lang, mode, certificationSlug, topicSlug, source, onBlockReviewGateViewed]);

  return null;
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

function stripExplainPrefix(text: string) {
  if (!text) return text;

  return text
    .replace(/^(Explanation|Explication|Spiegazione|Explicación)\s*:\s*/i, '')
    .replace(/^(Explanation|Explication|Spiegazione|Explicación)\s*:\s*/i, '')
    .trim();
}

function trackQuizEvent(
  eventName: string,
  params: Record<string, string | number | boolean | null | undefined> = {}
) {
  trackAnalyticsEvent(eventName, {
    event_category: 'quiz',
    ...params,
  });
}
