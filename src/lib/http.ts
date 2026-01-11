/**
 * http.ts
 *
 * Helper centrale per TUTTE le chiamate HTTP del frontend.
 *
 * OBIETTIVO PRINCIPALE:
 * - evitare crash React quando il backend risponde con 401 (Unauthorized)
 * - specialmente su mobile / incognito / utente non loggato
 *
 * Regola d’oro:
 * ❌ MAI usare fetch().then(res => res.json()) direttamente nei componenti
 * ✅ Usare SEMPRE fetchJSON / fetchJSONSafe
 */

/* -------------------------------------------------------------------------- */
/*                                   ERROR                                    */
/* -------------------------------------------------------------------------- */

/**
 * Errore HTTP “controllato”.
 * Serve per distinguere:
 * - errori di rete
 * - errori backend con status code (401, 403, 500, ecc.)
 */
export class HttpError extends Error {
  status: number;     // status HTTP (401, 403, 500…)
  body?: unknown;     // payload restituito dal backend (se presente)

  constructor(status: number, message: string, body?: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

/* -------------------------------------------------------------------------- */
/*                               TIPI UTILITY                                 */
/* -------------------------------------------------------------------------- */

/**
 * Estensione delle opzioni fetch standard.
 *
 * expectAuth:
 * - true  → endpoint che richiede login (storico, salvataggi, premium)
 * - false → endpoint pubblico (domande quiz)
 *
 * NOTA: non cambia il comportamento automatico,
 * serve solo a rendere il codice più leggibile dove lo usi.
 */
type FetchJSONOpts = RequestInit & {
  expectAuth?: boolean;
};

/* -------------------------------------------------------------------------- */
/*                          PARSING JSON “SAFE”                                */
/* -------------------------------------------------------------------------- */

/**
 * Parsing JSON robusto.
 *
 * Perché esiste:
 * - alcuni backend rispondono con testo semplice su errore
 * - fetch().json() lancia eccezione → crash React
 *
 * Questo evita eccezioni non gestite.
 */
function safeJsonParse(text: string) {
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    // fallback: ritorniamo il testo grezzo
    return text || null;
  }
}

/* -------------------------------------------------------------------------- */
/*                           FETCH “STRICT”                                    */
/* -------------------------------------------------------------------------- */

/**
 * fetchJSON
 *
 * Wrapper “strict” di fetch:
 * - se tutto ok → ritorna i dati
 * - se status != 2xx → lancia HttpError (MAI crash diretto)
 *
 * USO:
 * - quando vuoi gestire manualmente try/catch
 */
export async function fetchJSON<T>(
  url: string,
  opts: FetchJSONOpts = {}
): Promise<T> {
  const res = await fetch(url, {
    ...opts,

    /**
     * 🔥 FONDAMENTALE
     *
     * Permette al browser di inviare i cookie di sessione.
     * Senza questo:
     * - desktop loggato può “sembrare” ok
     * - mobile / incognito → 401 → crash
     */
    credentials: "include",

    headers: {
      ...(opts.headers || {}),
    },
  });

  /**
   * ⚠️ NON usare res.json() direttamente
   * Perché:
   * - se il body non è JSON valido → eccezione
   * - eccezione non gestita → React crash
   */
  const raw = await res.text();
  const body = safeJsonParse(raw);

  /**
   * Se la risposta NON è OK:
   * - NON facciamo crashare l’app
   * - trasformiamo l’errore in HttpError gestibile
   */
  if (!res.ok) {
    const msg =
      (body && (body.message || body.error)) ||
      res.statusText ||
      "Request failed";

    throw new HttpError(res.status, msg, body);
  }

  // Tutto ok → ritorniamo i dati tipizzati
  return body as T;
}

/* -------------------------------------------------------------------------- */
/*                         FETCH “SAFE” (CONSIGLIATO)                          */
/* -------------------------------------------------------------------------- */

/**
 * fetchJSONSafe
 *
 * Wrapper “safe” di fetchJSON.
 *
 * DIFFERENZA CHIAVE:
 * ❌ NON lancia MAI eccezioni
 * ✅ ritorna SEMPRE uno stato gestibile dalla UI
 *
 * Questo è il cuore dell’ANTI-CRASH.
 */
export async function fetchJSONSafe<T>(
  url: string,
  opts: FetchJSONOpts = {}
): Promise<
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      status: number;
      message: string;
      needsLogin: boolean;
    }
> {
  try {
    const data = await fetchJSON<T>(url, opts);

    // Caso successo
    return { ok: true, data };
  } catch (e) {
    /**
     * Caso errore HTTP gestito (401, 403, 500…)
     */
    if (e instanceof HttpError) {
      return {
        ok: false,
        status: e.status,
        message: e.message,

        /**
         * 🔐 Punto CHIAVE
         *
         * needsLogin = true solo se:
         * - backend risponde 401
         *
         * Il componente UI userà questo flag per:
         * - mostrare CTA login
         * - NON crashare
         */
        needsLogin: e.status === 401,
      };
    }

    /**
     * Caso errore sconosciuto (rete, timeout, bug JS)
     * → comunque NON crashiamo
     */
    return {
      ok: false,
      status: 0,
      message: "Network or unexpected error",
      needsLogin: false,
    };
  }
}
