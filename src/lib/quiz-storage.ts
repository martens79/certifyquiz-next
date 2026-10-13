// ============================================================================
// Quiz local storage helper
// - Salva e ripristina lo stato del quiz (autosave)
// - Usato da QuizEngine per resume / refresh / reload
// ============================================================================

export type PersistPayload = {
  // Ordine delle domande (serve per capire se il quiz è lo stesso)
  qIds: Array<string | number>;

  // Risposte date: questionId -> answerId | null
  marked: Record<string | number, string | number | null>;

  // Domande segnate ★ "rivedi dopo"
  reviewLater: Array<string | number>;

  // Modalità quiz corrente
  mode: 'training' | 'exam' | 'assessment';

  // Secondi rimanenti (solo in exam)
  remainingSec: number | null;

  // Timestamp di inizio quiz (per timer reale)
  startedAt: number | null;

  // ✅ NEW
  // Indice della domanda corrente
  // Opzionale per compatibilità con quiz salvati in passato
  idx?: number;

  // ✅ NEW
  // Seed dello shuffle deterministico: stesso seed = stesso ordine domande.
  // Opzionale per compatibilità con quiz salvati prima di questo campo
  // (in quel caso il resume fallisce e riparte da un nuovo seed, comportamento
  // identico a oggi per i salvataggi vecchi).
  seed?: number;

  // Istante (epoch ms) dell'ultimo salvataggio. Serve a dedurre quanto tempo
  // e' passato lontano dalla pagina (countdown exam) e a validare lo snapshot.
  savedAt?: number;

  // Schermata di riepilogo blocco aperta (solo training con blockSize):
  // senza, un reload sul confine di blocco salterebbe il checkpoint.
  blockPaused?: boolean;
  // Links progress to the independent deadline/tombstone record.
  attemptId?: string;
};

// Chiave storage isolata per quiz (topic/mixed + lingua)
const KEY = (scope: string) => `cq:quiz:${scope}`;
const KEY_PREFIX = "cq:quiz:";

// Snapshot delle domande consegnate (vedi lib/quiz-session.ts). Resta sotto il
// prefisso `cq:quiz:` e termina con la stessa scope: cosi' i confronti per
// prefisso/suffisso (clearAllProgressForUser: `...:user:<id>`) lo includono
// senza regole speciali, e al logout non resta nulla dell'utente uscente.
const SNAPSHOT_KEY = (scope: string) => `cq:quiz:snap:${scope}`;

/**
 * Salva lo stato del quiz in localStorage
 * (best-effort: errori ignorati)
 */
export function saveProgress(scope: string, data: PersistPayload) {
  try {
    localStorage.setItem(KEY(scope), JSON.stringify(data));
  } catch {
    // silenzioso: non blocca UX se storage pieno o disabilitato
  }
}

/**
 * Carica lo stato del quiz dal localStorage
 * Ritorna null se:
 * - non esiste
 * - parsing fallisce
 */
export function loadProgress(scope: string): PersistPayload | null {
  try {
    const raw = localStorage.getItem(KEY(scope));
    if (!raw) return null;
    return JSON.parse(raw) as PersistPayload;
  } catch {
    return null;
  }
}

/**
 * Cancella lo stato salvato del quiz
 * (usato a fine quiz o restart)
 */
export function clearProgress(scope: string) {
  try {
    localStorage.removeItem(KEY(scope));
  } catch {
    // noop
  }
  // Il progresso senza le sue domande non e' ripristinabile e viceversa:
  // fine quiz, Restart e cambio mode cancellano entrambi.
  clearSnapshot(scope);
}

/** Salva lo snapshot (best-effort: quota piena => si ricade nel resume per id). */
export function saveSnapshot(scope: string, snapshot: unknown) {
  try {
    localStorage.setItem(SNAPSHOT_KEY(scope), JSON.stringify(snapshot));
  } catch {
    // silenzioso
  }
}

/**
 * Elimina gli snapshot piu' vecchi di `maxAgeMs` (sessioni abbandonate).
 * Il TTL e' gia' verificato in lettura: questo evita solo che localStorage si
 * riempia di sessioni mai riprese (ognuna pesa decine di KB).
 */
export function pruneStaleSnapshots(maxAgeMs: number, now: number = Date.now()) {
  try {
    const prefix = "cq:quiz:snap:";
    const stale: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || !k.startsWith(prefix)) continue;
      let savedAt: unknown;
      try {
        savedAt = JSON.parse(localStorage.getItem(k) ?? "null")?.savedAt;
      } catch {
        savedAt = undefined;
      }
      if (typeof savedAt !== "number" || now - savedAt > maxAgeMs) stale.push(k);
    }
    stale.forEach((k) => localStorage.removeItem(k));
  } catch {
    // silenzioso
  }
}

/** Legge lo snapshot grezzo; la validazione e' di restoreSnapshot(). */
export function loadSnapshot(scope: string): unknown {
  try {
    const raw = localStorage.getItem(SNAPSHOT_KEY(scope));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearSnapshot(scope: string) {
  try {
    localStorage.removeItem(SNAPSHOT_KEY(scope));
  } catch {
    // noop
  }
}

/**
 * Rimuove tutte le chiavi di progresso quiz associate a uno specifico utente
 * loggato (chiamata al logout, vedi lib/auth.ts). Le chiavi hanno la forma
 * "cq:quiz:...:user:<id>" (vedi scopedKey in QuizEngine.tsx): senza questo,
 * il progresso di un utente resterebbe leggibile nel browser da chiunque
 * effettui il login successivo sullo stesso dispositivo — un PC condiviso
 * (aula, ufficio) è la norma per questo prodotto, non un caso limite.
 */
export function clearAllProgressForUser(userId: number | string) {
  try {
    const suffix = `:user:${userId}`;
    const toRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(KEY_PREFIX) && k.endsWith(suffix)) toRemove.push(k);
    }
    toRemove.forEach((k) => localStorage.removeItem(k));
  } catch {
    // silenzioso, come il resto del modulo
  }
}
