"use client";

import Link from "next/link";

import { useEffect, useRef, useState } from "react";
import { downloadCsvText } from "@/lib/download-csv";
import { fetchFunnelExportCsv } from "@/lib/funnel-export";
import type { FunnelExportIdentity } from "@/lib/funnel-export";
import styles from "./admin-events.module.css";

// Presentation only: keep technical names and do not normalize or count events.
export const EVENT_LABELS: Record<string, string> = {
  assessment_started: "Assessment avviato",
  assessment_completed: "Assessment completato",
  email_captured: "Email acquisita",
  registration_completed: "Registrazione completata",
  study_started: "Studio avviato",
  quiz_completed: "Quiz completato",
  paywall_viewed: "Paywall visualizzato",
  free_limit_reached: "Limite gratuito raggiunto",
  wrong_explanation_gate_shown: "Blocco spiegazione visualizzato (legacy)",
  gate_hit: "Blocco raggiunto (legacy)",
  premium_clicked: "Clic su Premium",
  premium_cta_clicked: "Clic sull’invito Premium",
  checkout_started: "Checkout richiesto",
  checkout_created: "Sessione checkout creata",
  checkout_auth_required: "Accesso richiesto per il checkout",
  purchase_completed: "Evento acquisto registrato",
  result_viewed: "Risultato visualizzato (legacy)",
  quiz_result_viewed: "Risultato quiz visualizzato (legacy)",
  diagnostic_quiz_started: "Quiz diagnostico avviato (legacy)",
  trial_started: "Prova avviata",
  pwa_install_prompt_shown: "Invito installazione mostrato",
  pwa_install_clicked: "Clic su installazione",
  pwa_install_accepted: "Installazione accettata",
  pwa_installed: "App installata",
  pwa_open: "App aperta",
};

type EventRow = {
  id: number;
  created_at: string;
  event: string;
  email: string | null;
  cert_slug: string | null;
  lang: string | null;
  topic_slug: string | null;
  score: number | null;
};
type Pagination = {
  page: number;
  pages: number;
  total: number;
  hasPrevious: boolean;
  hasNext: boolean;
};
type Query = {
  page: number;
  date: string;
  q: string;
  event: string;
  cert: string;
  lang: string;
};
type Result = {
  key: string;
  events?: EventRow[];
  pagination?: Pagination;
  error?: number;
};
const INITIAL: Query = {
  page: 1,
  date: "30d",
  q: "",
  event: "",
  cert: "",
  lang: "all",
};
const LIMIT = 50;

// Explicit projection: never retain or display arbitrary payload, session IDs,
// tokens or newly added backend fields in the details panel.
function readPage(value: unknown): {
  events: EventRow[];
  pagination: Pagination;
} {
  const data = value as {
    ok?: boolean;
    events?: Record<string, unknown>[];
    pagination?: Pagination;
  };
  const p = data?.pagination;
  if (
    !data?.ok ||
    !Array.isArray(data.events) ||
    !p ||
    !Number.isInteger(p.page) ||
    !Number.isInteger(p.pages) ||
    !Number.isInteger(p.total) ||
    p.page < 1 ||
    p.pages < p.page ||
    p.total < 0 ||
    typeof p.hasNext !== "boolean" ||
    typeof p.hasPrevious !== "boolean"
  ) {
    throw new Error("Invalid events response");
  }
  const text = (v: unknown) => (typeof v === "string" && v.trim() ? v : null);
  const events = data.events.map((row) => {
    if (
      !row ||
      typeof row.id !== "number" ||
      typeof row.event !== "string" ||
      typeof row.created_at !== "string"
    )
      throw new Error("Invalid event");
    return {
      id: row.id,
      event: row.event,
      created_at: row.created_at,
      email: text(row.email),
      cert_slug: text(row.cert_slug),
      lang: text(row.lang),
      topic_slug: text(row.topic_slug),
      score:
        typeof row.score === "number" && Number.isFinite(row.score)
          ? row.score
          : null,
    };
  });
  return { events, pagination: p };
}

export function formatEventDate(value: string) {
  // MySQL strings without an offset cannot safely be interpreted as local or UTC.
  if (!/(?:Z|[+-]\d{2}:?\d{2})$/i.test(value))
    return `${value} (fuso non specificato)`;
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "Data non disponibile";
  return new Intl.DateTimeFormat("it-IT", {
    timeZone: "Europe/Rome",
    dateStyle: "short",
    timeStyle: "medium",
  }).format(date);
}

function errorText(status: number) {
  if (status === 401)
    return "Sessione scaduta. Accedi nuovamente per visualizzare gli eventi.";
  if (status === 403)
    return "Accesso negato. Questa sezione è riservata agli admin.";
  return "Impossibile caricare gli eventi. Riprova tra poco.";
}

export default function FunnelEventsClient({ token }: { token: string }) {
  const [query, setQuery] = useState<Query>(INITIAL);
  const [revision, setRevision] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState("");
  const [exportStatus, setExportStatus] = useState(0);
  const filters = {
    q: query.q.trim(),
    event: query.event.trim() || "all",
    cert: query.cert.trim() || "all",
    lang: query.lang,
    date: query.date,
  };
  const params = new URLSearchParams({
    ...filters,
    page: String(query.page),
    limit: String(LIMIT),
  }).toString();
  // Data is visible only for the exact request which produced it, even before
  // React runs effect cleanup after a rapid filter change.
  const key = JSON.stringify([token, params, revision]);
  const currentKey = useRef(key);
  currentKey.current = key;
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    void (async () => {
      try {
        const response = await fetch(
          `/api/backend/admin/funnel-events?${params}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
            cache: "no-store",
          },
        );
        if (!response.ok) {
          if (active) setResult({ key, error: response.status });
          return;
        }
        const page = readPage(await response.json());
        if (active) setResult({ key, ...page });
      } catch {
        if (active && !controller.signal.aborted)
          setResult({ key, error: 500 });
      }
    })();
    return () => {
      active = false;
      controller.abort();
    };
  }, [key, params, token]);

  const current = result?.key === key ? result : null;
  const loading = !current;
  const denied =
    current?.error === 401 ||
    current?.error === 403 ||
    exportStatus === 401 ||
    exportStatus === 403;
  const events = !denied ? (current?.events ?? []) : [];
  const pagination = current?.pagination;
  const activeFilters =
    query.date !== "all" ||
    Boolean(filters.q || query.event.trim() || query.cert.trim()) ||
    query.lang !== "all";
  const availableEvents = Array.from(
    new Set([...Object.keys(EVENT_LABELS), ...events.map((e) => e.event)]),
  ).sort();
  const availableCerts = Array.from(
    new Set(
      events.map((e) => e.cert_slug).filter((v): v is string => Boolean(v)),
    ),
  ).sort();

  function changeFilters(patch: Partial<Query>) {
    setQuery((prev) => ({ ...prev, ...patch, page: 1 }));
    setExportMessage("");
  }
  function retry() {
    setExportStatus(0);
    setExportMessage("");
    setRevision((v) => v + 1);
  }

  async function exportCsv(identity: FunnelExportIdentity) {
    if (exporting || denied || loading) return;
    setExporting(true);
    setExportMessage("");
    setExportStatus(0);
    const exportKey = key;
    try {
      const { csv, rows } = await fetchFunnelExportCsv({
        fetchFn: fetch,
        token,
        filters,
        identity,
      });
      if (!mounted.current || currentKey.current !== exportKey) return;
      if (rows === 0) {
        setExportMessage("Nessun evento da esportare con questi filtri.");
        return;
      }
      downloadCsvText(
        identity === "full"
          ? "certifyquiz-funnel-events-with-email.csv"
          : "certifyquiz-funnel-events.csv",
        csv,
      );
      setExportMessage(`Esportazione completata: ${rows} eventi.`);
    } catch (err) {
      if (!mounted.current || currentKey.current !== exportKey) return;
      const status = Number(
        err && typeof err === "object" && "message" in err
          ? /HTTP (\d{3})/.exec(String(err.message))?.[1]
          : 0,
      );
      setExportStatus(status || 500);
      setExportMessage(
        status === 401 || status === 403
          ? errorText(status)
          : "Esportazione non riuscita. Riprova con il pulsante CSV.",
      );
    } finally {
      if (mounted.current) setExporting(false);
    }
  }

  return (
    <section aria-label="Eventi funnel" className={styles.events}>
      <p className={styles.hint}>
        Eventi registrati, dal più recente. Orari in Europe/Rome (ora italiana).
        Una riga è un evento, non una persona unica.
      </p>
      <div className={styles.filters}>
        <label>
          Periodo
          <select
            value={query.date}
            onChange={(e) => changeFilters({ date: e.target.value })}
          >
            <option value="today">Oggi</option>
            <option value="7d">Ultimi 7 giorni</option>
            <option value="30d">Ultimi 30 giorni</option>
            <option value="all">Tutto</option>
          </select>
        </label>
        <label>
          Tipo di evento
          <input
            list="funnel-event-options"
            placeholder="Tutti · nome tecnico"
            value={query.event}
            maxLength={100}
            onChange={(e) => changeFilters({ event: e.target.value })}
          />
        </label>
        <datalist id="funnel-event-options">
          {availableEvents.map((e) => (
            <option key={e} value={e}>
              {EVENT_LABELS[e] ?? e}
            </option>
          ))}
        </datalist>
        <label>
          Certificazione
          <input
            list="funnel-cert-options"
            placeholder="Tutte · slug certificazione"
            value={query.cert}
            maxLength={255}
            onChange={(e) => changeFilters({ cert: e.target.value })}
          />
        </label>
        <datalist id="funnel-cert-options">
          {availableCerts.map((cert) => (
            <option key={cert} value={cert} />
          ))}
        </datalist>
        <label>
          Lingua
          <select
            value={query.lang}
            onChange={(e) => changeFilters({ lang: e.target.value })}
          >
            <option value="all">Tutte le lingue</option>
            {["it", "en", "fr", "es"].map((lang) => (
              <option key={lang} value={lang}>
                {lang.toUpperCase()}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.search}>
          Ricerca
          <input
            type="search"
            value={query.q}
            maxLength={255}
            placeholder="Email storica, cert, topic, evento, lingua"
            aria-describedby="funnel-search-help"
            onChange={(e) => changeFilters({ q: e.target.value })}
          />
        </label>
        <button
          type="button"
          onClick={() => {
            setQuery({ ...INITIAL, date: "all" });
            setExportMessage("");
          }}
        >
          Azzera filtri
        </button>
      </div>
      <p id="funnel-search-help" className={styles.hint}>
        La ricerca email copre il campo storico dell’evento, non le email
        recuperate dall’account. Nome e ID utente non sono ricercabili. Evento e
        certificazione richiedono il valore tecnico esatto; i suggerimenti non
        sono un catalogo completo. I periodi seguono l’orologio del server.
      </p>
      <div className={styles.actions}>
        <button type="button" onClick={retry} disabled={loading}>
          Aggiorna
        </button>
        <button
          type="button"
          disabled={loading || exporting || denied}
          title="Esporta tutti gli eventi che corrispondono ai filtri correnti"
          onClick={() => void exportCsv("pseudonymous")}
        >
          {exporting ? "Esportazione…" : "Esporta CSV"}
        </button>
        <details>
          <summary>Export con dati personali</summary>
          <p className={styles.hint}>
            Include email e ID utente interno. Esporta tutti i risultati dei
            filtri correnti; proteggi il file.
          </p>
          <button
            type="button"
            disabled={loading || exporting || denied}
            onClick={() => void exportCsv("full")}
          >
            Esporta CSV con email
          </button>
        </details>
      </div>
      {exportMessage && !denied && (
        <p role={exportStatus ? "alert" : "status"}>{exportMessage}</p>
      )}
      {loading && (
        <p role="status" className={styles.state}>
          Caricamento eventi…
        </p>
      )}
      {current?.error && (
        <div role="alert" className={styles.error}>
          <p>{errorText(current.error)}</p>
          {current.error === 401 && (
            <Link href="/login?returnTo=%2Fadmin">Accedi</Link>
          )}
          <button type="button" onClick={retry}>
            Riprova
          </button>
        </div>
      )}
      {!current?.error && denied && (
        <div role="alert" className={styles.error}>
          <p>{errorText(exportStatus)}</p>
          {exportStatus === 401 && (
            <Link href="/login?returnTo=%2Fadmin">Accedi</Link>
          )}
          <button type="button" onClick={retry}>
            Riprova
          </button>
        </div>
      )}
      {!loading && !current?.error && !denied && events.length === 0 && (
        <p role="status" className={styles.state}>
          {activeFilters
            ? "Nessun risultato con i filtri attivi."
            : "Nessun evento registrato."}
        </p>
      )}
      {events.length > 0 && (
        <>
          <div className={styles.tableCard}>
            <table className={styles.table}>
              <caption className={styles.caption}>
                Funnel Events · orari Europe/Rome
              </caption>
              <thead>
                <tr>
                  {[
                    "Data e ora · Europe/Rome",
                    "Evento",
                    "Utente",
                    "Certificazione",
                    "Lingua",
                    "Dettagli",
                  ].map((label) => (
                    <th scope="col" key={label}>
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td data-label="Data e ora · Europe/Rome">
                      <time dateTime={event.created_at}>
                        {formatEventDate(event.created_at)}
                      </time>
                    </td>
                    <td data-label="Evento">
                      <strong className={styles.badge}>
                        {EVENT_LABELS[event.event] ??
                          event.event.replaceAll("_", " ")}
                      </strong>
                      <code className={styles.technical}>{event.event}</code>
                    </td>
                    <td data-label="Utente">
                      {event.email || (
                        <>
                          <span>Anonimo / non identificato</span>
                          <small className={styles.technical}>
                            Email non disponibile
                          </small>
                        </>
                      )}
                    </td>
                    <td data-label="Certificazione">
                      {event.cert_slug || "—"}
                    </td>
                    <td data-label="Lingua">
                      {event.lang?.toUpperCase() || "—"}
                    </td>
                    <td data-label="Dettagli">
                      {event.topic_slug || event.score !== null ? (
                        <details>
                          <summary>Mostra dettagli</summary>
                          <dl>
                            {event.topic_slug && (
                              <>
                                <dt>Argomento</dt>
                                <dd>{event.topic_slug}</dd>
                              </>
                            )}
                            {event.score !== null && (
                              <>
                                <dt>Punteggio</dt>
                                <dd>{event.score}%</dd>
                              </>
                            )}
                            <dt>ID evento</dt>
                            <dd>{event.id}</dd>
                          </dl>
                        </details>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pagination && (
            <nav className={styles.pagination} aria-label="Paginazione eventi">
              <button
                type="button"
                disabled={loading || !pagination.hasPrevious}
                onClick={() =>
                  setQuery((prev) => ({ ...prev, page: pagination.page - 1 }))
                }
              >
                ← Precedente
              </button>
              <p role="status">
                Pagina {pagination.page} di {pagination.pages} ·{" "}
                {pagination.total} eventi · {LIMIT} per pagina
              </p>
              <button
                type="button"
                disabled={loading || !pagination.hasNext}
                onClick={() =>
                  setQuery((prev) => ({ ...prev, page: pagination.page + 1 }))
                }
              >
                Successiva →
              </button>
            </nav>
          )}
        </>
      )}
    </section>
  );
}
