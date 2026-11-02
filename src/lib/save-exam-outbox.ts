// ============================================================================
// Registrazione affidabile del risultato di un quiz in cronologia (/save-exam).
//
// Distingue due fatti che prima coincidevano:
//   1. la VALUTAZIONE e' completata (il punteggio e' noto e mostrato);
//   2. il RISULTATO e' REGISTRATO in cronologia (il server ha risposto 2xx).
// Se il punto 2 fallisce l'utente lo vede e puo' riprovare senza rispondere di
// nuovo alle domande.
//
// - Write-ahead: la voce (payload + attemptId stabile) viene scritta in
//   localStorage PRIMA della richiesta e rimossa solo a 2xx.
// - Idempotenza: ogni retry riusa lo stesso attemptId; il backend risponde 200
//   `deduped` se il tentativo e' gia' registrato (risposta HTTP persa).
// - Nessun retry illimitato: una richiesta + UN solo retry automatico (solo
//   rete/timeout/5xx), poi solo retry manuale con cooldown (429: 30 s).
// - Le voci sono legate all'utente (chiave `...:user:<id>`): il logout le
//   rimuove con le altre chiavi `cq:quiz:` dell'utente (clearAllProgressForUser)
//   e non vengono mai inviate con il token di un altro account.
// ============================================================================

import type { SaveExamRequest } from '@/lib/apiClient';

export type SaveFailureKind = 'network' | 'timeout' | 'server' | 'busy' | 'rate' | 'auth' | 'rejected' | 'interrupted';
export type SaveFailure = { kind: SaveFailureKind; retryable: boolean; status: number | null };

export type OutboxEntry = {
  v: 1;
  attemptId: string;
  userId: string;
  scope: string;
  createdAt: number;
  payload: SaveExamRequest & { attemptId: string };
};

export type OutboxItem = {
  entry: OutboxEntry;
  status: 'saving' | 'failed' | 'saved';
  failure: SaveFailure | null;
  /** la voce e' davvero in localStorage (false = solo in memoria, si perde chiudendo la pagina) */
  persisted: boolean;
  /** creata in questo caricamento di pagina (false = recuperata da un caricamento precedente) */
  fresh: boolean;
  /** epoch ms prima del quale il retry manuale e' disabilitato */
  retryAt: number;
};

export class SaveExamFailure extends Error {
  readonly failure: SaveFailure;
  readonly persisted: boolean;
  constructor(failure: SaveFailure, persisted: boolean) {
    super(`save-exam failed: ${failure.kind}${failure.status ? ` (${failure.status})` : ''}`);
    this.name = 'SaveExamFailure';
    this.failure = failure;
    this.persisted = persisted;
  }
}

export type OutboxDeps = {
  send?: (payload: SaveExamRequest, signal: AbortSignal) => Promise<unknown>;
  now?: () => number;
  wait?: (ms: number) => Promise<void>;
  timeoutMs?: number;
};

export const SAVE_TIMEOUT_MS = 20_000;
export const AUTO_RETRY_DELAY_MS = 1_500;
export const COOLDOWN_MS = 3_000;
export const RATE_COOLDOWN_MS = 30_000;
const MAX_AGE_MS = 30 * 24 * 3_600_000;
const PREFIX = 'cq:quiz:pending-save:';
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Chiave sotto `cq:quiz:` e con suffisso `:user:<id>`: il logout la rimuove con le altre dell'utente. */
export const outboxKey = (attemptId: string, userId: string | number) => `${PREFIX}${attemptId}:user:${userId}`;

export function createAttemptId(): string {
  const c = (globalThis as { crypto?: Crypto }).crypto;
  if (c?.randomUUID) return c.randomUUID();
  const b = new Uint8Array(16);
  if (c?.getRandomValues) c.getRandomValues(b);
  else for (let i = 0; i < 16; i++) b[i] = Math.floor(Math.random() * 256);
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

export function classifySaveError(err: unknown): SaveFailure {
  const e = err as { name?: string; status?: unknown; detail?: unknown } | null;
  if (e?.name === 'AbortError' || e?.name === 'TimeoutError') return { kind: 'timeout', retryable: true, status: null };
  const status = typeof e?.status === 'number' ? e.status : null;
  if (status == null) return { kind: 'network', retryable: true, status: null };
  if (status === 401 || status === 403) return { kind: 'auth', retryable: true, status };
  if (status === 429) return { kind: 'rate', retryable: true, status };
  const code = (e?.detail as { error?: unknown } | null | undefined)?.error;
  if (status === 503 && code === 'SAVE_EXAM_BUSY') return { kind: 'busy', retryable: true, status };
  if (status >= 500) return { kind: 'server', retryable: true, status };
  // 4xx restanti (400 INVALID_*, 409 ATTEMPT_ID_CONFLICT, ...): il payload non sara' mai accettato
  return { kind: 'rejected', retryable: false, status };
}

const cooldownFor = (f: SaveFailure) => (f.kind === 'rate' ? RATE_COOLDOWN_MS : f.retryable ? COOLDOWN_MS : 0);
const AUTO_RETRY_KINDS: ReadonlySet<SaveFailureKind> = new Set(['network', 'timeout', 'server', 'busy']);

// ── store ──────────────────────────────────────────────────────────────────
const items = new Map<string, OutboxItem>();
const inflight = new Map<string, Promise<void>>();
const listeners = new Set<() => void>();
let version = 0;
const snapshots = new Map<string, { version: number; list: OutboxItem[] }>();

function emit() {
  version++;
  listeners.forEach((l) => l());
}
export function subscribeOutbox(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
/** Snapshot stabile (stessa referenza finche' lo store non cambia) per useSyncExternalStore. */
export function getOutboxItems(userId: string | number): OutboxItem[] {
  const uid = String(userId);
  const cached = snapshots.get(uid);
  if (cached && cached.version === version) return cached.list;
  const list = [...items.values()].filter((i) => i.entry.userId === uid).sort((a, b) => a.entry.createdAt - b.entry.createdAt);
  snapshots.set(uid, { version, list });
  return list;
}
export const EMPTY_OUTBOX: OutboxItem[] = [];

// ── storage ────────────────────────────────────────────────────────────────
function persist(entry: OutboxEntry): boolean {
  try {
    localStorage.setItem(outboxKey(entry.attemptId, entry.userId), JSON.stringify(entry));
    return true;
  } catch {
    return false;
  }
}
function unpersist(entry: OutboxEntry) {
  try { localStorage.removeItem(outboxKey(entry.attemptId, entry.userId)); } catch { /* best effort */ }
}
function validEntry(v: unknown, userId: string, now: number): v is OutboxEntry {
  const e = v as Partial<OutboxEntry> | null;
  const p = e?.payload as Partial<OutboxEntry['payload']> | undefined;
  return !!e && e.v === 1 && typeof e.attemptId === 'string' && UUID_RE.test(e.attemptId) && e.userId === userId &&
    typeof e.scope === 'string' && typeof e.createdAt === 'number' && now - e.createdAt <= MAX_AGE_MS && e.createdAt <= now + 3_600_000 &&
    !!p && p.attemptId === e.attemptId && Number.isFinite(p.totalQuestions) && Number.isFinite(p.correctAnswers) && typeof p.isExam === 'boolean';
}

/**
 * Carica nello store le voci rimaste da un caricamento precedente (risultato
 * valutato ma mai registrato). Idempotente. Voci corrotte o scadute (30 giorni)
 * vengono scartate.
 */
export function hydrateOutbox(userId: string | number, now: number = Date.now()) {
  const uid = String(userId);
  const suffix = `:user:${uid}`;
  let changed = false;
  try {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(PREFIX) && k.endsWith(suffix)) keys.push(k);
    }
    for (const k of keys) {
      let parsed: unknown = null;
      try { parsed = JSON.parse(localStorage.getItem(k) ?? 'null'); } catch { /* corrotta */ }
      if (!validEntry(parsed, uid, now)) { localStorage.removeItem(k); continue; }
      if (items.has(parsed.attemptId)) continue;
      items.set(parsed.attemptId, {
        entry: parsed, status: 'failed', failure: { kind: 'interrupted', retryable: true, status: null },
        persisted: true, fresh: false, retryAt: 0,
      });
      changed = true;
    }
  } catch { /* storage non disponibile */ }
  if (changed) emit();
}

// ── invio ──────────────────────────────────────────────────────────────────
async function defaultSend(payload: SaveExamRequest, signal: AbortSignal) {
  const { saveExam } = await import('@/lib/apiClient');
  return saveExam(payload, { signal });
}

async function sendOnce(entry: OutboxEntry, deps: OutboxDeps) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), deps.timeoutMs ?? SAVE_TIMEOUT_MS);
  try {
    await (deps.send ?? defaultSend)(entry.payload, ctl.signal);
  } catch (err) {
    // l'abort del nostro timer arriva come AbortError: lo si classifica come timeout
    if (ctl.signal.aborted) throw Object.assign(new Error('save-exam timeout'), { name: 'TimeoutError' });
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

function run(attemptId: string, auto: boolean, deps: OutboxDeps): Promise<void> {
  const running = inflight.get(attemptId);
  if (running) return running;
  const now = deps.now ?? Date.now;
  const wait = deps.wait ?? ((ms: number) => new Promise<void>((r) => setTimeout(r, ms)));
  const p = (async () => {
    const item = items.get(attemptId);
    if (!item) throw new SaveExamFailure({ kind: 'rejected', retryable: false, status: null }, false);
    items.set(attemptId, { ...item, status: 'saving', failure: null });
    emit();
    let failure: SaveFailure | null = null;
    for (let n = 0; n < (auto ? 2 : 1); n++) {
      try {
        await sendOnce(item.entry, deps);
        unpersist(item.entry);
        const done = items.get(attemptId);
        if (done) { // Assente se l'utente ha scartato la voce mentre la richiesta era in volo
          items.set(attemptId, { ...done, status: 'saved', failure: null, persisted: false, retryAt: 0 });
          emit();
        }
        return;
      } catch (err) {
        failure = classifySaveError(err);
        if (!(auto && n === 0 && failure.retryable && AUTO_RETRY_KINDS.has(failure.kind))) break;
        await wait(AUTO_RETRY_DELAY_MS);
      }
    }
    const f = failure!;
    if (!f.retryable) unpersist(item.entry); // mai accettabile: non va ritentato al prossimo caricamento
    const cur = items.get(attemptId);
    const persisted = !!cur && f.retryable && cur.persisted;
    if (cur) {
      items.set(attemptId, { ...cur, status: 'failed', failure: f, persisted, retryAt: now() + cooldownFor(f) });
      emit();
    }
    throw new SaveExamFailure(f, persisted);
  })().finally(() => { inflight.delete(attemptId); });
  inflight.set(attemptId, p);
  return p;
}

/**
 * Registra il risultato: write-ahead su localStorage, poi POST /save-exam.
 * Risolve a 2xx; a fallimento lancia SaveExamFailure (la voce resta recuperabile).
 */
export function submitResult(
  input: { attemptId: string; userId: string | number; scope: string; payload: SaveExamRequest },
  deps: OutboxDeps = {}
): Promise<void> {
  const uid = String(input.userId);
  const existing = items.get(input.attemptId);
  if (existing && existing.entry.userId === uid) {
    // stesso risultato gia' in volo/fallito: si riusa la voce (un solo attemptId = una sola riga)
    return existing.status === 'saved' ? Promise.resolve() : run(input.attemptId, false, deps);
  }
  const entry: OutboxEntry = {
    v: 1, attemptId: input.attemptId, userId: uid, scope: input.scope, createdAt: (deps.now ?? Date.now)(),
    payload: { ...input.payload, attemptId: input.attemptId },
  };
  const persisted = persist(entry);
  items.set(entry.attemptId, { entry, status: 'saving', failure: null, persisted, fresh: true, retryAt: 0 });
  emit();
  return run(entry.attemptId, true, deps);
}

/** Retry manuale (nessun retry automatico). Rispetta il cooldown. */
export function retryResult(attemptId: string, deps: OutboxDeps = {}): Promise<void> {
  const item = items.get(attemptId);
  const now = (deps.now ?? Date.now)();
  if (!item) return Promise.reject(new SaveExamFailure({ kind: 'rejected', retryable: false, status: null }, false));
  if (item.status === 'saved') return Promise.resolve();
  if (item.failure && !item.failure.retryable) return Promise.reject(new SaveExamFailure(item.failure, false));
  if (!inflight.has(attemptId) && item.retryAt > now) {
    return Promise.reject(new SaveExamFailure(item.failure ?? { kind: 'network', retryable: true, status: null }, item.persisted));
  }
  return run(attemptId, false, deps);
}

/** Scarta una voce (l'utente rinuncia a registrare quel risultato). */
export function discardResult(attemptId: string) {
  const item = items.get(attemptId);
  if (!item) return;
  unpersist(item.entry);
  items.delete(attemptId);
  emit();
}

/** Solo per i test. */
export function __resetOutboxForTests() {
  items.clear();
  inflight.clear();
  snapshots.clear();
  version++;
}
