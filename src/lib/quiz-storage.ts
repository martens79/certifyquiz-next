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
  mode: 'training' | 'exam';

  // Secondi rimanenti (solo in exam)
  remainingSec: number | null;

  // Timestamp di inizio quiz (per timer reale)
  startedAt: number | null;

  // ✅ NEW
  // Indice della domanda corrente
  // Opzionale per compatibilità con quiz salvati in passato
  idx?: number;
};

// Chiave storage isolata per quiz (topic/mixed + lingua)
const KEY = (scope: string) => `cq:quiz:${scope}`;

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
}
