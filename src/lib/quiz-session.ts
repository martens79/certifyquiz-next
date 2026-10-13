// ============================================================================
// Snapshot della sessione quiz
//
// Perche' esiste: MIXED e mock-exam ricevono dal server un campione CASUALE di
// domande a ogni fetch (ORDER BY RAND()). Un reload completo (tab scartata dal
// browser mobile, pull-to-refresh, ritorno dal background) rifa' il fetch e
// otterrebbe un set diverso: i qIds salvati non combaciano piu' e la sessione
// ripartirebbe da zero. Lo snapshot conserva le domande GIA' CONSEGNATE, cosi'
// il ripristino non dipende da una nuova estrazione.
//
// Cosa contiene: solo cio' che il server ha gia' mandato al browser come
// payload della domanda (testo, risposte senza chiave, exhibit). MAI
// correttezza, risposta corretta o spiegazione: dopo Paywall Phase 2 quelle
// informazioni arrivano solo da /answers/check e non vengono persistite.
//
// Fiducia: lo snapshot e' dato non attendibile (localStorage e' modificabile
// dall'utente). Serve solo a rimostrare domande; correttezza, spiegazioni,
// quota FREE e gate restano decisi dal server a ogni risposta.
// ============================================================================

import type { Locale, Question } from '@/lib/quiz-types';

export type SessionMode = 'training' | 'exam' | 'assessment';

/** Incrementare se cambia la forma: i salvataggi di versione diversa vengono scartati. */
export const SNAPSHOT_VERSION = 1;

const HOUR = 60 * 60 * 1000;

/**
 * Vita massima di uno snapshot, dall'ultima attivita' (viene riscritto a ogni
 * ripristino). L'exam e' piu' corto: oltre alla scadenza dello snapshot vale
 * comunque la scadenza del timer (vedi examRemainingAfterAway).
 */
export const SNAPSHOT_TTL_MS: Record<SessionMode, number> = {
  training: 24 * HOUR,
  exam: 6 * HOUR,
  assessment: 3 * HOUR,
};

/** Tolleranza per orologi di sistema che vanno indietro. */
const CLOCK_SKEW_MS = 5 * 60 * 1000;

const MAX_QUESTIONS = 500;
const MAX_ANSWERS = 12;
const MAX_TEXT = 20_000;

export type SnapshotAnswer = { id: number | string; text: string };

export type SnapshotQuestion = {
  id: number | string;
  question: string;
  questionType?: string | null;
  blueprintDomain?: string | null;
  blueprintObjectiveId?: string | null;
  skillType?: string | null;
  exhibit?: { title?: string; kind?: 'cli' | 'table' | 'topology' | 'wlan-gui' | 'text'; content?: string } | null;
  answers: SnapshotAnswer[];
};

export type SessionSnapshot = {
  v: number;
  /** epoch ms dell'ultima scrittura */
  savedAt: number;
  /** scopedKey completa: storageScope:mode:(anon|user:<id>) */
  scope: string;
  userKey: string;
  mode: SessionMode;
  lang: Locale;
  /** chi ha ricevuto queste domande: 'premium' non e' ripristinabile da un account non premium */
  entitlement: 'premium' | 'standard';
  /** ordine esatto delle domande della sessione */
  qIds: Array<number | string>;
  questions: SnapshotQuestion[];
};

const EXHIBIT_KINDS = new Set(['cli', 'table', 'topology', 'wlan-gui', 'text']);

const isId = (v: unknown): v is number | string =>
  (typeof v === 'number' && Number.isFinite(v)) || (typeof v === 'string' && v.length > 0 && v.length < 64);

const optString = (v: unknown): string | null | undefined => {
  if (v === null) return null;
  if (typeof v !== 'string') return undefined;
  return v.length > MAX_TEXT ? undefined : v;
};

/**
 * Copia in whitelist di UNA domanda. Tutto cio' che non e' elencato
 * (isCorrect, explanation, correct_answer_id, campi futuri) viene scartato:
 * e' la barriera che impedisce di persistere soluzioni lato client.
 * Ritorna null se la domanda non e' una domanda valida.
 */
function pickQuestion(raw: unknown): SnapshotQuestion | null {
  if (!raw || typeof raw !== 'object') return null;
  const q = raw as Record<string, unknown>;
  if (!isId(q.id)) return null;
  if (typeof q.question !== 'string' || q.question.length > MAX_TEXT) return null;
  if (!Array.isArray(q.answers) || q.answers.length < 2 || q.answers.length > MAX_ANSWERS) return null;

  const answers: SnapshotAnswer[] = [];
  for (const a of q.answers) {
    if (!a || typeof a !== 'object') return null;
    const ar = a as Record<string, unknown>;
    if (!isId(ar.id) || typeof ar.text !== 'string' || ar.text.length > MAX_TEXT) return null;
    answers.push({ id: ar.id, text: ar.text });
  }

  const out: SnapshotQuestion = { id: q.id, question: q.question, answers };

  const questionType = optString(q.questionType);
  if (questionType !== undefined) out.questionType = questionType;
  const domain = optString(q.blueprintDomain);
  if (domain !== undefined) out.blueprintDomain = domain;
  const objective = optString(q.blueprintObjectiveId);
  if (objective !== undefined) out.blueprintObjectiveId = objective;
  const skill = optString(q.skillType);
  if (skill !== undefined) out.skillType = skill;

  if (q.exhibit === null) {
    out.exhibit = null;
  } else if (q.exhibit && typeof q.exhibit === 'object') {
    const e = q.exhibit as Record<string, unknown>;
    const exhibit: NonNullable<SnapshotQuestion['exhibit']> = {};
    if (typeof e.title === 'string' && e.title.length <= MAX_TEXT) exhibit.title = e.title;
    if (typeof e.content === 'string' && e.content.length <= MAX_TEXT) exhibit.content = e.content;
    if (typeof e.kind === 'string' && EXHIBIT_KINDS.has(e.kind)) {
      exhibit.kind = e.kind as NonNullable<SnapshotQuestion['exhibit']>['kind'];
    }
    out.exhibit = exhibit;
  }

  return out;
}

export function buildSnapshot(input: {
  scope: string;
  userKey: string;
  mode: SessionMode;
  lang: Locale;
  isPremium: boolean;
  questions: Question[];
  now?: number;
}): SessionSnapshot | null {
  if (!input.questions.length || input.questions.length > MAX_QUESTIONS) return null;

  const questions: SnapshotQuestion[] = [];
  for (const q of input.questions) {
    const picked = pickQuestion(q);
    if (!picked) return null; // una domanda non serializzabile invalida l'intero snapshot
    questions.push(picked);
  }

  return {
    v: SNAPSHOT_VERSION,
    savedAt: input.now ?? Date.now(),
    scope: input.scope,
    userKey: input.userKey,
    mode: input.mode,
    lang: input.lang,
    entitlement: input.isPremium ? 'premium' : 'standard',
    qIds: questions.map((q) => q.id),
    questions,
  };
}

/**
 * True se `raw` e' uno snapshot DELLO STESSO insieme ordinato di domande
 * consegnato a un account premium. Serve a non "lavare" l'etichetta: se
 * l'utente perde il premium a sessione aperta, riscrivere lo snapshot con
 * l'entitlement corrente lo renderebbe ripristinabile da un account free.
 */
export function wasDeliveredToPremium(raw: unknown, qIds: Array<number | string>): boolean {
  if (!raw || typeof raw !== 'object') return false;
  const s = raw as Partial<SessionSnapshot>;
  return (
    s.entitlement === 'premium' &&
    Array.isArray(s.qIds) &&
    s.qIds.length === qIds.length &&
    s.qIds.every((v, i) => String(v) === String(qIds[i]))
  );
}

export type SnapshotExpectation = {
  scope: string;
  userKey: string;
  mode: SessionMode;
  lang: Locale;
  isPremium: boolean;
  /** qIds del salvataggio di progresso a cui lo snapshot deve corrispondere */
  qIds: Array<number | string> | undefined;
  now?: number;
};

const sameIds = (a: Array<number | string>, b: Array<number | string>) =>
  a.length === b.length && a.every((v, i) => String(v) === String(b[i]));

/**
 * Valida uno snapshot letto da localStorage e, se tutto torna, ne ricostruisce
 * le domande. Qualunque dubbio => null (si riparte da una sessione nuova).
 */
export function restoreSnapshot(raw: unknown, expect: SnapshotExpectation): Question[] | null {
  if (!raw || typeof raw !== 'object') return null;
  const s = raw as Partial<SessionSnapshot>;

  if (s.v !== SNAPSHOT_VERSION) return null;
  if (s.scope !== expect.scope) return null;
  if (s.userKey !== expect.userKey) return null;
  if (s.mode !== expect.mode) return null;
  if (s.lang !== expect.lang) return null;
  if (s.entitlement !== 'premium' && s.entitlement !== 'standard') return null;
  if (s.entitlement === 'premium' && !expect.isPremium) return null;

  const now = expect.now ?? Date.now();
  if (typeof s.savedAt !== 'number' || !Number.isFinite(s.savedAt)) return null;
  const age = now - s.savedAt;
  if (age < -CLOCK_SKEW_MS || age > SNAPSHOT_TTL_MS[expect.mode]) return null;

  if (!Array.isArray(s.qIds) || !Array.isArray(s.questions)) return null;
  if (s.questions.length === 0 || s.questions.length > MAX_QUESTIONS) return null;

  const picked: SnapshotQuestion[] = [];
  for (const q of s.questions) {
    const p = pickQuestion(q);
    if (!p) return null;
    picked.push(p);
  }

  const ids = picked.map((q) => q.id);
  if (!sameIds(ids, s.qIds as Array<number | string>)) return null;
  // Deve essere LO STESSO ordine del progresso salvato: indice e risposte
  // hanno senso solo su quell'ordine.
  if (!expect.qIds || !sameIds(ids, expect.qIds)) return null;

  // Duplicati: un id ripetuto renderebbe ambigue le risposte (marked e' per id).
  if (new Set(ids.map(String)).size !== ids.length) return null;

  return picked as unknown as Question[];
}

/**
 * Errori di fetch dopo i quali e' lecito ripristinare dallo snapshot senza
 * aver visto il server: SOLO guasti di trasporto/disponibilita'. Mai un
 * rifiuto di accesso (401/403/404/409...): il gate paywall, il lock post-gate
 * e le eccezioni dei mock devono vincere sullo snapshot.
 */
export function isTransientFetchError(err: unknown): boolean {
  if (err instanceof TypeError) return true; // fetch() senza rete / DNS / CORS
  const status = (err as { status?: unknown } | null)?.status;
  return typeof status === 'number' && (status === 408 || status === 429 || status >= 500);
}

/**
 * Secondi rimasti all'exam dopo il tempo trascorso lontano dalla pagina.
 * Il countdown NON si ferma quando la pagina e' chiusa/in background: chiudere
 * il tab non deve regalare tempo. Se `savedAt` non c'e' (salvataggi precedenti)
 * si riparte dal valore salvato, senza dedurre nulla.
 */
export function examRemainingAfterAway(input: {
  remainingSec: number | null | undefined;
  savedAt: number | null | undefined;
  totalSec: number;
  now?: number;
}): number {
  const now = input.now ?? Date.now();
  const saved = typeof input.remainingSec === 'number' ? input.remainingSec : input.totalSec;
  const away =
    typeof input.savedAt === 'number' && Number.isFinite(input.savedAt)
      ? Math.max(0, Math.floor((now - input.savedAt) / 1000))
      : 0;
  return Math.max(0, Math.min(input.totalSec, saved - away));
}
