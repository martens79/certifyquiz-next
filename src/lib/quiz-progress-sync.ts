// ============================================================================
// Helper per la sincronizzazione del progresso quiz con il server (resume
// cross-device) e per la valutazione finale. Isolati dal QuizEngine per poter
// essere testati senza montare il componente.
// ============================================================================

/**
 * Dopo una PUT riuscita il client si riallinea al rev del server SOLO se e'
 * piu' alto del proprio. Una risposta lenta (rev inferiore a quello nel
 * frattempo salito in locale) non deve far regredire il contatore: la PUT
 * successiva partirebbe con un rev piu' basso di quello gia' sul server e il
 * guard `>=` la scarterebbe in silenzio.
 */
export function adoptServerRev(current: number, serverRev: unknown): number {
  return typeof serverRev === 'number' && Number.isFinite(serverRev) ? Math.max(current, serverRev) : current;
}

/** Spezza una lista in blocchi di al piu' `size` elementi (il server valuta max 200 risposte per chiamata). */
export function chunk<T>(items: readonly T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

export type ClosingProgress = { seed: number; rev: number; qidsHash: number };

/** Marker locale: la chiusura lato server non e' andata a buon fine e va ritentata al prossimo caricamento. */
const CLOSING_KEY = (scope: string) => `cq:quiz:closing:${scope}`;

export function savePendingClose(scope: string, value: ClosingProgress) {
  try {
    localStorage.setItem(CLOSING_KEY(scope), JSON.stringify(value));
  } catch {
    // best-effort
  }
}

export function readPendingClose(scope: string): ClosingProgress | null {
  try {
    const raw = localStorage.getItem(CLOSING_KEY(scope));
    if (!raw) return null;
    const v = JSON.parse(raw);
    if (v && Number.isInteger(v.seed) && Number.isInteger(v.rev) && Number.isInteger(v.qidsHash)) return v;
    return null;
  } catch {
    return null;
  }
}

export function clearPendingClose(scope: string) {
  try {
    localStorage.removeItem(CLOSING_KEY(scope));
  } catch {
    // noop
  }
}

type FetchLike = (path: string, init?: RequestInit) => Promise<Response>;

/**
 * Chiude il tentativo sul server (POST .../complete). Riprova su errori di
 * rete/5xx; 4xx e' definitivo. Ritorna true se il server ha risposto 2xx
 * (anche closed:false, cioe' la riga appartiene a un altro tentativo: non c'e'
 * nulla da ritentare).
 */
export async function closeServerProgress(
  fetcher: FetchLike,
  args: { topicId: number | string; lang: string; mode: string } & ClosingProgress,
  opts: { attempts?: number; delayMs?: number } = {}
): Promise<boolean> {
  const attempts = opts.attempts ?? 3;
  const delayMs = opts.delayMs ?? 400;
  const path = `/me/quiz-progress/${args.topicId}/complete?lang=${args.lang}&mode=${args.mode}`;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetcher(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seed: args.seed, rev: args.rev, qidsHash: args.qidsHash }),
        keepalive: true,
      });
      if (res.ok) return true;
      if (res.status >= 400 && res.status < 500 && res.status !== 408 && res.status !== 429) return false;
    } catch {
      // rete: si riprova
    }
    if (i < attempts - 1) await new Promise((r) => setTimeout(r, delayMs * (i + 1)));
  }
  return false;
}
