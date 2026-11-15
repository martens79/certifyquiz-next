"use client";

import { useMemo, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import {
  STATUS_LABEL,
  coverageLabel,
  deltaLabel,
  formatDay,
  formatInt,
  formatMoney,
  formatPct,
  isMoneyList,
  kpiText,
  largestDrop,
  sortCertRows,
  type CertRow,
  type Filters,
  type FunnelStage,
  type Kpi,
  type MetricInfo,
  type Reliability,
} from "@/lib/admin-analytics-dashboard";
import type { DailyPoint } from "./DailyChart";
import styles from "./analytics.module.css";

const DailyChart = dynamic(() => import("./DailyChart"), {
  ssr: false,
  loading: () => (
    <div
      className={styles.skeleton}
      role="status"
      aria-label="Caricamento grafico"
    />
  ),
});

export type Dict = Map<string, MetricInfo>;
const label = (dict: Dict, id: string) => dict.get(id)?.label ?? id;

export function Loading({ rows = 3 }: { rows?: number }) {
  return (
    <div
      role="status"
      aria-label="Caricamento in corso"
      className={styles.grid}
    >
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className={styles.skeleton} />
      ))}
    </div>
  );
}
export function ErrorBox({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div role="alert" className={styles.errorBox}>
      <span>{message}</span>
      <button type="button" onClick={onRetry}>
        Riprova
      </button>
    </div>
  );
}
export function Empty({ children }: { children: ReactNode }) {
  return <p className={styles.state}>{children}</p>;
}

function Badge({ status }: { status: Reliability }) {
  return (
    <span className={`${styles.badge} ${styles[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}

/** Definizione completa della metrica (dizionario centralizzato del backend). */
export function MetricDetails({
  info,
  kpi,
}: {
  info: MetricInfo | undefined;
  kpi?: Kpi;
}) {
  if (!info) return null;
  const cov = kpi ? coverageLabel(kpi.coverage) : null;
  return (
    <details className={styles.info}>
      <summary>Definizione e limiti</summary>
      <dl>
        <dt>Fonte</dt>
        <dd>{info.source}</dd>
        <dt>Definizione</dt>
        <dd>{info.definition}</dd>
        <dt>Unità</dt>
        <dd>{info.unit}</dd>
        {info.denominator ? (
          <>
            <dt>Denominatore</dt>
            <dd>{info.denominator}</dd>
          </>
        ) : null}
        {cov || info.coverage ? (
          <>
            <dt>Copertura dati</dt>
            <dd>{cov ?? info.coverage}</dd>
          </>
        ) : null}
        <dt>Limiti di affidabilità</dt>
        <dd>{info.limits}</dd>
      </dl>
    </details>
  );
}

function money(v: unknown): string | null {
  return isMoneyList(v)
    ? v.map((m) => formatMoney(m.amount_minor, m.currency)).join(" + ") || "0"
    : null;
}

function KpiValue({ k }: { k: Kpi }) {
  if (k.value == null)
    return <span className={styles.valueNd}>Non disponibile</span>;
  if (typeof k.value === "number")
    return <span className={styles.value}>{kpiText(k)}</span>;
  const v = k.value as Record<string, unknown>;
  if (k.metric === "verified_purchases") {
    return (
      <span
        className={styles.value}
      >{`${formatInt(v.receipts as number | null)} ricevute · ${formatInt(v.ordersPaid as number | null)} ordini`}</span>
    );
  }
  if (k.metric === "verified_revenue") {
    return (
      <span className={styles.sub}>
        <b>Ricevute:</b> {money(v.receipts) ?? "n.d."}
        <br />
        <b>Ordini pacchetto:</b> {money(v.orders) ?? "n.d."}
        <br />
        Fonti separate, mai sommate.
      </span>
    );
  }
  return <span className={styles.valueNd}>Non disponibile</span>;
}

export function KpiCard({ k, dict }: { k: Kpi; dict: Dict }) {
  const d = deltaLabel(k.delta, k.comparable);
  const info = dict.get(k.metric);
  return (
    <article
      className={styles.card}
      aria-label={label(dict, k.metric)}
      data-metric={k.metric}
    >
      <div className={styles.cardHead}>
        <h3 className={styles.cardLabel}>{label(dict, k.metric)}</h3>
        <Badge status={k.status} />
      </div>
      <KpiValue k={k} />
      {k.reason ? <p className={styles.sub}>{k.reason}</p> : null}
      {k.note ? <p className={styles.warn}>{k.note}</p> : null}
      {k.denominator ? (
        <p className={styles.sub}>
          su {formatInt(k.denominator.value)} {k.denominator.label}
          {k.denominator.share != null
            ? ` (${formatPct(k.denominator.share)})`
            : ""}
        </p>
      ) : null}
      {k.value != null && typeof k.value === "number" ? (
        <p className={`${styles.delta} ${styles[d.tone]}`}>{d.text}</p>
      ) : null}
      {k.parts && typeof k.parts === "object" ? (
        <PartsLine metric={k.metric} parts={k.parts} />
      ) : null}
      <MetricDetails info={info} kpi={k} />
    </article>
  );
}

function PartsLine({
  metric,
  parts,
}: {
  metric: string;
  parts: Record<string, unknown>;
}) {
  const bits: string[] = [];
  if (metric === "observed_identities")
    bits.push(
      `${formatInt(parts.accounts as number)} account · ${formatInt(parts.browsers as number)} browser`,
    );
  if (metric === "active_students" && parts.serverAccounts != null)
    bits.push(
      `${formatInt(parts.serverAccounts as number)} account con risposta server`,
    );
  if (metric === "new_questions" && parts.distinctQuestions != null)
    bits.push(
      `${formatInt(parts.distinctQuestions as number)} domande distinte`,
    );
  if (metric === "saved_results" && parts.accounts != null)
    bits.push(`${formatInt(parts.accounts as number)} account`);
  if (metric === "checkout_created" && parts.identities != null)
    bits.push(`${formatInt(parts.identities as number)} identità`);
  if (metric === "registrations" && Array.isArray(parts.providers)) {
    bits.push(
      (parts.providers as { provider: string; n: number }[])
        .map((p) => `${p.provider}: ${p.n}`)
        .join(" · "),
    );
  }
  return bits.length ? <p className={styles.sub}>{bits.join(" · ")}</p> : null;
}

export function KpiGrid({ kpis, dict }: { kpis: Kpi[]; dict: Dict }) {
  const hidden = new Set([
    "observed_accounts",
    "observed_browsers",
    "server_students",
  ]);
  return (
    <div className={styles.grid}>
      {kpis
        .filter((k) => !hidden.has(k.metric))
        .map((k) => (
          <KpiCard key={k.metric} k={k} dict={dict} />
        ))}
    </div>
  );
}

// ---------- Risposte rapide ----------
export function QuickAnswers({
  kpis,
  certs,
  commercial,
  onJump,
}: {
  kpis: Kpi[];
  certs: CertRow[] | null;
  commercial: FunnelStage[] | null;
  onJump: (id: string) => void;
}) {
  const students = kpis.find((k) => k.metric === "active_students");
  const drop = commercial ? largestDrop(commercial) : null;
  const top = certs
    ? [...certs]
        .filter((c) => (c.cells.cert_new_questions ?? 0) > 0)
        .sort(
          (a, b) =>
            (b.cells.cert_new_questions ?? 0) -
            (a.cells.cert_new_questions ?? 0),
        )
        .slice(0, 3)
    : null;
  return (
    <div className={styles.answers}>
      <section
        className={styles.answer}
        aria-label="Quante persone studiano davvero"
      >
        <h3>1 · Quante persone studiano davvero?</h3>
        <span className={styles.answerValue}>
          {students ? kpiText(students) : "…"}
        </span>
        <p>
          Identità con almeno una nuova risposta registrata dal server o
          un’interazione client reale. È un <b>minimo verificabile</b>: i guest
          sono osservabili solo dall’introduzione di <code>study_engaged</code>.
          Aprire una pagina quiz non è studio.
        </p>
      </section>
      <section
        className={styles.answer}
        aria-label="Quali certificazioni generano interesse"
      >
        <h3>2 · Quali certificazioni?</h3>
        {top === null ? (
          <p>Caricamento…</p>
        ) : top.length === 0 ? (
          <p>Nessuna nuova risposta registrata nel periodo.</p>
        ) : (
          <ol>
            {top.map((c) => (
              <li key={c.slug}>
                <b>{c.name}</b> · {formatInt(c.cells.cert_new_questions)} nuove
                domande · {formatInt(c.cells.cert_answering_accounts)} account
              </li>
            ))}
          </ol>
        )}
        <p>
          <button type="button" onClick={() => onJump("certificazioni")}>
            Tabella completa
          </button>
        </p>
      </section>
      <section className={styles.answer} aria-label="Dove smettono di avanzare">
        <h3>3 · Dove smettono di avanzare?</h3>
        {commercial === null ? (
          <p>Caricamento…</p>
        ) : drop === null ? (
          <p>
            Dati insufficienti per individuare il passaggio con il calo
            maggiore.
          </p>
        ) : (
          <>
            <span className={styles.answerValue}>{formatPct(drop.pct, 0)}</span>
            <p>
              delle identità osservate allo stage «{stageLabel(drop.from.key)}»
              non ha un evento successivo allo stage «{stageLabel(drop.to.key)}»
              ({formatInt(drop.lost)} su {formatInt(drop.from.identities)}).{" "}
              <b>Evento mancante ≠ abbandono dimostrato</b>: può mancare il
              tracking.
            </p>
          </>
        )}
        <p>
          <button type="button" onClick={() => onJump("funnel")}>
            Apri il funnel
          </button>
        </p>
      </section>
    </div>
  );
}

export const STAGE_LABEL: Record<string, string> = {
  load: "Caricamento quiz",
  interaction: "Interazione reale",
  result: "Risultato",
  paywall: "Paywall",
  click: "Click commerciale",
  checkout: "Checkout creato",
  payment: "Pagamento verificato",
};
export const stageLabel = (key: string) => STAGE_LABEL[key] ?? key;

// ---------- Andamento giornaliero ----------
export type Series = {
  days: string[];
  [k: string]: (number | null)[] | string[] | null;
};
const SERIES_TABS: { key: string; label: string; previous: boolean }[] = [
  { key: "observed", label: "Identità osservate", previous: true },
  { key: "students", label: "Studenti attivi", previous: true },
  { key: "newQuestions", label: "Nuove domande", previous: true },
  { key: "results", label: "Risultati salvati", previous: false },
  { key: "registrations", label: "Registrazioni", previous: false },
  { key: "paywall", label: "Paywall", previous: false },
  { key: "clicks", label: "Click commerciali", previous: false },
  { key: "checkouts", label: "Checkout creati", previous: false },
];
export function DailySeries({
  current,
  previous,
}: {
  current: Series;
  previous: Series | null;
}) {
  const [key, setKey] = useState("observed");
  const tab = SERIES_TABS.find((t) => t.key === key) ?? SERIES_TABS[0];
  const cur = current[key] as (number | null)[] | null;
  const prev =
    tab.previous && previous
      ? (previous[key] as (number | null)[] | null)
      : null;
  const data: DailyPoint[] = (cur ?? []).map((v, i) => ({
    day: current.days[i],
    value: v,
    previous: prev ? (prev[i] ?? null) : null,
  }));
  return (
    <div className={styles.panel}>
      <div className={styles.tabs} role="group" aria-label="Serie giornaliera">
        {SERIES_TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            aria-pressed={t.key === key}
            aria-current={t.key === key ? "true" : undefined}
            onClick={() => setKey(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {cur === null ? (
        <Empty>Serie non disponibile per i filtri scelti.</Empty>
      ) : (
        <DailyChart title={tab.label} data={data} hasPrevious={!!prev} />
      )}
    </div>
  );
}

// ---------- Funnel ----------
export function FunnelPanel({
  funnels,
  population,
  dict,
}: {
  funnels: { complete: FunnelStage[]; commercial: FunnelStage[] };
  population: {
    identities: number;
    unattributedEvents: number;
    unattributedShare: number | null;
  } | null;
  dict: Dict;
}) {
  const [variant, setVariant] = useState<"complete" | "commercial">("complete");
  const stages = funnels[variant];
  const first = stages.find((s) => s.identities != null)?.identities ?? 0;
  return (
    <div className={styles.panel}>
      <div
        className={styles.tabs}
        role="group"
        aria-label="Percorso del funnel"
      >
        <button
          type="button"
          aria-pressed={variant === "complete"}
          aria-current={variant === "complete" ? "true" : undefined}
          onClick={() => setVariant("complete")}
        >
          Percorso completo
        </button>
        <button
          type="button"
          aria-pressed={variant === "commercial"}
          aria-current={variant === "commercial" ? "true" : undefined}
          onClick={() => setVariant("commercial")}
        >
          Dal primo studio al pagamento
        </button>
      </div>
      <p className={styles.lead}>
        {variant === "complete"
          ? "Ogni identità deve avere TUTTI gli stage in ordine (anche il caricamento e il risultato): è il percorso più restrittivo."
          : "Parte dalla prima interazione reale e non richiede caricamento né risultato: è il percorso commerciale usato nell'audit del 28/10."}
      </p>
      <div>
        {stages.map((s) => {
          const w =
            s.identities != null && first > 0
              ? Math.max(2, Math.round((s.identities / first) * 100))
              : 0;
          return (
            <div className={styles.funnelRow} key={s.key} data-stage={s.key}>
              <div>
                <div className={styles.funnelName}>{stageLabel(s.key)}</div>
                <MetricDetails info={dict.get(s.metric)} />
              </div>
              <div>
                {s.identities == null ? (
                  <p className={styles.valueNd}>
                    Non disponibile{s.reason ? ` · ${s.reason}` : ""}
                  </p>
                ) : (
                  <>
                    <div className={styles.barTrack} aria-hidden="true">
                      <div className={styles.bar} style={{ width: `${w}%` }} />
                    </div>
                    <div className={styles.barText}>
                      <b>{formatInt(s.identities)}</b>
                      <span>
                        {s.pctOfPrevious == null
                          ? "stage iniziale"
                          : `${formatPct(s.pctOfPrevious)} dello stage precedente`}
                      </span>
                      {s.pctOfFirst != null ? (
                        <span>{formatPct(s.pctOfFirst)} del primo stage</span>
                      ) : null}
                      {s.notObservedAdvancing != null ? (
                        <span>
                          {formatInt(s.notObservedAdvancing)} senza evento
                          successivo osservato
                        </span>
                      ) : null}
                    </div>
                  </>
                )}
                {s.note ? <p className={styles.warn}>{s.note}</p> : null}
                {coverageLabel(s.coverage) ? (
                  <p className={styles.sub}>{coverageLabel(s.coverage)}</p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
      {population ? (
        <p className={styles.banner}>
          Popolazione non attribuibile (denominatore: eventi web, esclusi gli
          eventi tecnici PWA e le anteprime; non confrontabile direttamente con
          la quota dell&rsquo;audit generale):{" "}
          {formatInt(population.unattributedEvents)} eventi
          {population.unattributedShare != null
            ? ` (${formatPct(population.unattributedShare)})`
            : ""}{" "}
          senza account, visitor o sessione collegabile restano fuori dal
          funnel. «Senza evento successivo osservato» non significa abbandono:
          può essere un evento non tracciato, un consenso negato o un percorso
          fuori finestra. Il pagamento è collegato solo allo stesso account.
        </p>
      ) : null}
    </div>
  );
}

// ---------- Certificazioni ----------
const CERT_COLS = [
  "cert_interest",
  "cert_loads",
  "cert_answering_accounts",
  "cert_new_questions",
  "cert_saved_results",
  "cert_paywall",
  "cert_clicks",
  "cert_checkouts",
  "cert_purchases",
];
export function CertificationsTable({
  rows,
  columns,
  dict,
  selected,
  onSelect,
}: {
  rows: CertRow[];
  columns: string[];
  dict: Dict;
  selected: string | null;
  onSelect: (slug: string) => void;
}) {
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" }>({
    key: "cert_new_questions",
    dir: "desc",
  });
  const [q, setQ] = useState("");
  const cols = columns.length ? columns : CERT_COLS;
  const shown = useMemo(() => {
    const filtered = q.trim()
      ? rows.filter((r) =>
          `${r.name} ${r.slug}`.toLowerCase().includes(q.trim().toLowerCase()),
        )
      : rows;
    return sortCertRows(filtered, sort.key, sort.dir);
  }, [rows, q, sort]);
  const toggle = (key: string) =>
    setSort((s) =>
      s.key === key
        ? { key, dir: s.dir === "desc" ? "asc" : "desc" }
        : { key, dir: key === "name" ? "asc" : "desc" },
    );
  const aria = (key: string) =>
    sort.key === key
      ? sort.dir === "asc"
        ? "ascending"
        : "descending"
      : "none";
  return (
    <div className={styles.panel}>
      <label>
        Cerca certificazione{" "}
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="es. ccna"
          aria-label="Cerca certificazione"
        />
      </label>
      <p className={styles.sub}>
        {formatInt(shown.length)} di {formatInt(rows.length)} certificazioni del
        catalogo. «—» = non disponibile; «0» = zero accertato dalla fonte.
        Interesse e account che rispondono sono popolazioni diverse: non
        dividerle per ottenere una conversione.
      </p>
      <div
        className={styles.tableWrap}
        tabIndex={0}
        aria-label="Tabella certificazioni, scorri orizzontalmente su schermi stretti"
      >
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th scope="col" aria-sort={aria("name")}>
                <button
                  type="button"
                  className={styles.sortBtn}
                  onClick={() => toggle("name")}
                >
                  Certificazione
                </button>
              </th>
              {cols.map((c) => (
                <th key={c} scope="col" aria-sort={aria(c)}>
                  <button
                    type="button"
                    className={styles.sortBtn}
                    onClick={() => toggle(c)}
                    title={dict.get(c)?.definition}
                  >
                    {label(dict, c)}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr
                key={r.slug}
                className={selected === r.slug ? styles.selected : undefined}
              >
                <th scope="row">
                  <button
                    type="button"
                    className={styles.rowBtn}
                    onClick={() => onSelect(r.slug)}
                    aria-pressed={selected === r.slug}
                  >
                    {r.name}
                  </button>
                  {r.evidence === "none_observed" ? (
                    <span className={styles["none-signal"]}>
                      nessun segnale
                    </span>
                  ) : null}
                </th>
                {cols.map((c) => (
                  <td
                    key={c}
                    className={r.cells[c] == null ? styles.nd : undefined}
                  >
                    {r.cells[c] == null ? "—" : formatInt(r.cells[c])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {shown.length === 0 ? (
        <Empty>Nessuna certificazione corrisponde alla ricerca.</Empty>
      ) : null}
    </div>
  );
}

// ---------- Ritorno ----------
export type Cohort = {
  day: string;
  size: number;
  d1: { eligible: number; returned: number };
  d7: { eligible: number; returned: number };
  d28: { eligible: number; returned: number };
};
export function ReturnPanel({
  cohorts,
  summary,
  unavailable,
}: {
  cohorts: Cohort[];
  summary: Record<
    "d1" | "d7" | "d28",
    { eligible: number; returned: number; rate: number | null }
  > | null;
  unavailable?: string;
}) {
  if (unavailable || !summary)
    return (
      <Empty>
        Ritorno non disponibile: {unavailable ?? "fonte non raggiungibile"}.
      </Empty>
    );
  const cell = (c: { eligible: number; returned: number }) =>
    c.eligible ? `${c.returned}/${c.eligible}` : "—";
  return (
    <div className={styles.panel}>
      <div className={styles.grid}>
        {(["d1", "d7", "d28"] as const).map((k) => (
          <article
            key={k}
            className={styles.card}
            aria-label={`Ritorno ${k.toUpperCase()}`}
          >
            <div className={styles.cardHead}>
              <h3 className={styles.cardLabel}>
                Ritorno a nuove domande {k.toUpperCase()}
              </h3>
              <Badge status={summary[k].eligible ? "partial" : "unavailable"} />
            </div>
            {summary[k].rate == null ? (
              <span className={styles.valueNd}>Non disponibile</span>
            ) : (
              <span className={styles.value}>
                {formatPct(summary[k].rate, 0)}
              </span>
            )}
            <p className={styles.sub}>
              {summary[k].eligible
                ? `${summary[k].returned} su ${summary[k].eligible} account con giorno ${k.toUpperCase()} concluso`
                : "Nessuna coorte con questo giorno già concluso."}
            </p>
          </article>
        ))}
      </div>
      <p className={styles.lead}>
        Proxy limitato alle <b>nuove</b> domande registrate dal server per
        account autenticati: non è retention completa (chi ripete domande già
        viste o è guest non compare).
      </p>
      <div
        className={styles.tableWrap}
        tabIndex={0}
        aria-label="Coorti di ritorno, scorri orizzontalmente su schermi stretti"
      >
        <table className={styles.dataTable} style={{ minWidth: 520 }}>
          <thead>
            <tr>
              <th scope="col">Coorte (primo studio)</th>
              <th scope="col">Account</th>
              <th scope="col">D1</th>
              <th scope="col">D7</th>
              <th scope="col">D28</th>
            </tr>
          </thead>
          <tbody>
            {[...cohorts]
              .reverse()
              .slice(0, 30)
              .map((c) => (
                <tr key={c.day}>
                  <th scope="row">{formatDay(c.day)}</th>
                  <td>{formatInt(c.size)}</td>
                  <td>{cell(c.d1)}</td>
                  <td>{cell(c.d7)}</td>
                  <td>{cell(c.d28)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {cohorts.length === 0 ? (
        <Empty>Nessun account con primo studio nel periodo.</Empty>
      ) : null}
    </div>
  );
}

// ---------- Ricavi ----------
type RevSection = {
  metric: string;
  status: Reliability;
  value: unknown;
  reason?: string | null;
  paidAmounts?: unknown;
  coverage?: { since: string | null; fullWindow: boolean } | null;
};
export function RevenuePanel({
  sections,
  reconciliationMessage,
  webhooks,
  dict,
}: {
  sections: RevSection[];
  reconciliationMessage: string;
  webhooks: { event_type: string; n: number }[] | null;
  dict: Dict;
}) {
  return (
    <div className={styles.panel}>
      <p className={styles.banner}>{reconciliationMessage}</p>
      <div className={styles.grid} style={{ marginTop: 12 }}>
        {sections.map((s) => (
          <article
            key={s.metric}
            className={styles.card}
            data-metric={s.metric}
          >
            <div className={styles.cardHead}>
              <h3 className={styles.cardLabel}>{label(dict, s.metric)}</h3>
              <Badge status={s.value == null ? "unavailable" : s.status} />
            </div>
            <RevValue s={s} />
            {s.reason ? <p className={styles.sub}>{s.reason}</p> : null}
            {s.coverage ? (
              <p className={styles.sub}>
                {coverageLabel({
                  since: s.coverage.since,
                  fullWindow: s.coverage.fullWindow,
                })}
              </p>
            ) : null}
            <MetricDetails info={dict.get(s.metric)} />
          </article>
        ))}
      </div>
      {webhooks && webhooks.length ? (
        <p className={styles.sub} style={{ marginTop: 10 }}>
          Webhook Stripe ricevuti dal backend nel periodo (solo tipo e numero,
          non importi):{" "}
          {webhooks.map((w) => `${w.event_type} ${w.n}`).join(" · ")}.
        </p>
      ) : null}
    </div>
  );
}
function RevValue({ s }: { s: RevSection }) {
  const v = s.value as unknown;
  if (v == null) return <span className={styles.valueNd}>Non disponibile</span>;
  if (typeof v === "number")
    return <span className={styles.value}>{formatInt(v)}</span>;
  if (s.metric === "rev_checkout_created" && Array.isArray(v))
    return v.length ? (
      <ul className={styles.list}>
        {(v as { product: string; n: number }[]).map((x) => (
          <li key={x.product}>
            {x.product}: <b>{x.n}</b>
          </li>
        ))}
      </ul>
    ) : (
      <span className={styles.value}>0</span>
    );
  if (s.metric === "rev_receipts") {
    const r = v as { byType: { type: string; n: number }[]; amounts: unknown };
    return (
      <div>
        <ul className={styles.list}>
          {r.byType.length ? (
            r.byType.map((x) => (
              <li key={x.type}>
                {x.type}: <b>{x.n}</b>
              </li>
            ))
          ) : (
            <li>Nessuna ricevuta nel periodo</li>
          )}
        </ul>
        <p className={styles.sub}>Lordo: {money(r.amounts) ?? "n.d."}</p>
      </div>
    );
  }
  if (s.metric === "rev_orders" && Array.isArray(v))
    return (
      <div>
        <ul className={styles.list}>
          {(v as { status: string; n: number }[]).length ? (
            (v as { status: string; n: number }[]).map((x) => (
              <li key={x.status}>
                {x.status}: <b>{x.n}</b>
              </li>
            ))
          ) : (
            <li>Nessun ordine nel periodo</li>
          )}
        </ul>
        <p className={styles.sub}>
          Pagati (lordo): {money(s.paidAmounts) ?? "0"}
        </p>
      </div>
    );
  if (s.metric === "rev_guides") {
    const g = v as { n: number; amount: number };
    return (
      <span className={styles.value}>
        {formatInt(g.n)} ·{" "}
        {g.amount.toLocaleString("it-IT", {
          style: "currency",
          currency: "EUR",
        })}
      </span>
    );
  }
  if (s.metric === "rev_refunds" && Array.isArray(v))
    return (
      v as {
        currency: string;
        status: string;
        n: number;
        amount_minor: number;
      }[]
    ).length ? (
      <ul className={styles.list}>
        {(
          v as {
            currency: string;
            status: string;
            n: number;
            amount_minor: number;
          }[]
        ).map((x) => (
          <li key={`${x.currency}${x.status}`}>
            {x.status}: <b>{x.n}</b> · {formatMoney(x.amount_minor, x.currency)}
          </li>
        ))}
      </ul>
    ) : (
      <span className={styles.value}>0 registrati</span>
    );
  return <span className={styles.valueNd}>Non disponibile</span>;
}

// ---------- Filtri ----------
export type FilterMeta = {
  certs: { slug: string; name: string }[];
  langs: string[];
  modes: string[];
  maxDays: number;
};
export function FiltersBar({
  value,
  onChange,
  meta,
  error,
}: {
  value: Filters;
  onChange: (patch: Partial<Filters>) => void;
  meta: FilterMeta | null;
  error: string | null;
}) {
  return (
    <form
      className={styles.filters}
      aria-label="Filtri dashboard"
      onSubmit={(e) => e.preventDefault()}
    >
      <label>
        Periodo
        <select
          value={value.range}
          onChange={(e) =>
            onChange({ range: e.target.value as Filters["range"] })
          }
        >
          <option value="7d">Ultimi 7 giorni</option>
          <option value="28d">Ultimi 28 giorni</option>
          <option value="90d">Ultimi 90 giorni</option>
          <option value="custom">Intervallo personalizzato</option>
        </select>
      </label>
      {value.range === "custom" ? (
        <>
          <label>
            Dal
            <input
              type="date"
              value={value.from}
              onChange={(e) => onChange({ from: e.target.value })}
            />
          </label>
          <label>
            Al
            <input
              type="date"
              value={value.to}
              onChange={(e) => onChange({ to: e.target.value })}
            />
          </label>
        </>
      ) : null}
      <label>
        Certificazione
        <select
          value={value.cert}
          onChange={(e) => onChange({ cert: e.target.value })}
        >
          <option value="">Tutte</option>
          {meta?.certs.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Lingua
        <select
          value={value.lang}
          onChange={(e) => onChange({ lang: e.target.value })}
        >
          <option value="">Tutte</option>
          {(meta?.langs ?? ["it", "en", "fr", "es"]).map((l) => (
            <option key={l} value={l}>
              {l.toUpperCase()}
            </option>
          ))}
        </select>
      </label>
      <label>
        Utente
        <select
          value={value.auth}
          onChange={(e) =>
            onChange({ auth: e.target.value as Filters["auth"] })
          }
        >
          <option value="all">Tutti</option>
          <option value="authenticated">Autenticato</option>
          <option value="anonymous">Anonimo (browser)</option>
        </select>
      </label>
      <label>
        Modalità quiz
        <select
          value={value.mode}
          onChange={(e) => onChange({ mode: e.target.value })}
          disabled={!meta || meta.modes.length === 0}
        >
          <option value="">Tutte</option>
          {meta?.modes.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </label>
      <label aria-disabled="true">
        Paese
        <select
          disabled
          title="Non disponibile: nessuna fonte affidabile (non si deduce dalla lingua)"
        >
          <option>Non disponibile</option>
        </select>
      </label>
      <label aria-disabled="true">
        Dispositivo
        <select
          disabled
          title="Non disponibile: nessuna fonte affidabile persistita"
        >
          <option>Non disponibile</option>
        </select>
      </label>
      {error ? (
        <p className={styles.filterError} role="alert">
          {error}
        </p>
      ) : null}
      <details className={styles.filterNote}>
        <summary>Note sui filtri</summary>
        Giorni di calendario in Europe/Rome (gestito il cambio dell&rsquo;ora).
        Lingua e modalità riguardano solo gli eventi che le riportano: le
        risposte e i risultati server non hanno questi campi e risultano «Non
        disponibile» o parziali, mai zero. Paese e dispositivo non hanno una
        fonte affidabile.
      </details>
    </form>
  );
}
