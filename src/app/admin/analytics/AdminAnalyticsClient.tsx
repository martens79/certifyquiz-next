"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_FILTERS,
  buildQuery,
  customRangeError,
  formatDay,
  formatInt,
  type CertRow,
  type Filters,
  type FunnelStage,
  type Kpi,
  type MetricInfo,
} from "@/lib/admin-analytics-dashboard";
import {
  CertificationsTable,
  DailySeries,
  Empty,
  ErrorBox,
  FiltersBar,
  FunnelPanel,
  KpiGrid,
  Loading,
  MetricDetails,
  QuickAnswers,
  ReturnPanel,
  RevenuePanel,
  stageLabel,
  type Cohort,
  type Dict,
  type FilterMeta,
  type Series,
} from "./panels";
import { useAnalytics } from "./useAnalytics";
import styles from "./analytics.module.css";

type Overview = {
  range: {
    from: string;
    to: string;
    days: number;
    tz: string;
    previous: { from: string; to: string };
  };
  kpis: Kpi[];
  series: { current: Series; previous: Series };
  funnels: { complete: FunnelStage[]; commercial: FunnelStage[] };
  population: {
    identities: number;
    unattributedEvents: number;
    unattributedShare: number | null;
  };
  quality: { truncated: boolean };
  notes: string[];
};
type CertsResponse = {
  rows: CertRow[];
  columns: string[];
  notes: string[];
  unattributedToCertification: number;
  truncated: boolean;
};
type CertDetail = {
  slug: string;
  series: Series;
  funnels: { complete: FunnelStage[]; commercial: FunnelStage[] };
  totals: Record<string, number | null>;
};
type RetentionResponse = {
  cohorts: Cohort[];
  summary: Record<
    "d1" | "d7" | "d28",
    { eligible: number; returned: number; rate: number | null }
  > | null;
  unavailable?: string;
  notes?: string[];
};
type RevenueResponse = {
  reconciliation: { message: string };
  sections: {
    metric: string;
    status: "verified" | "partial" | "unavailable";
    value: unknown;
    reason?: string | null;
  }[];
  webhooks: { event_type: string; n: number }[] | null;
  notes: string[];
};

export default function AdminAnalyticsClient({
  token,
  onOpenEvents,
}: {
  token: string;
  onOpenEvents: () => void;
}) {
  const [draft, setDraft] = useState<Filters>(DEFAULT_FILTERS);
  const [applied, setApplied] = useState<Filters>(DEFAULT_FILTERS);
  const [selected, setSelected] = useState<string | null>(null);
  // I filtri validi si applicano subito (nessuna richiesta con intervalli parziali o invalidi).
  const rangeError =
    draft.range === "custom" && (draft.from || draft.to)
      ? customRangeError(draft)
      : null;
  useEffect(() => {
    if (!customRangeError(draft)) setApplied(draft);
  }, [draft]);
  const change = useCallback(
    (patch: Partial<Filters>) => setDraft((d) => ({ ...d, ...patch })),
    [],
  );

  const query = useMemo(() => buildQuery(applied), [applied]);
  const certQuery = useMemo(
    () => buildQuery({ ...applied, cert: "" }),
    [applied],
  );

  const dictState = useAnalytics<{ metrics: MetricInfo[] }>(
    "dictionary",
    "",
    token,
  );
  const metaState = useAnalytics<FilterMeta>("filters", "", token);
  const overview = useAnalytics<Overview>("overview", query, token);
  const certs = useAnalytics<CertsResponse>("certifications", certQuery, token);
  const detail = useAnalytics<CertDetail>(
    selected ? `certifications/${selected}` : "certifications/_",
    buildQuery({ ...applied, cert: "" }),
    token,
    !!selected,
  );
  const retention = useAnalytics<RetentionResponse>("retention", query, token);
  const revenue = useAnalytics<RevenueResponse>("revenue", query, token);

  const dict: Dict = useMemo(
    () => new Map((dictState.state.data?.metrics ?? []).map((m) => [m.id, m])),
    [dictState.state.data],
  );

  useEffect(() => {
    if (
      selected &&
      certs.state.data &&
      !certs.state.data.rows.some((r) => r.slug === selected)
    )
      setSelected(null);
  }, [certs.state.data, selected]);

  const jump = (id: string) =>
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  const ov = overview.state.data;

  return (
    <div className={styles.root} aria-label="Dashboard analytics">
      <nav className={styles.jump} aria-label="Sezioni della dashboard">
        {[
          ["panoramica", "Panoramica"],
          ["funnel", "Funnel"],
          ["certificazioni", "Certificazioni"],
          ["ritorno", "Registrazioni e ritorno"],
          ["ricavi", "Ricavi e checkout"],
          ["definizioni", "Definizioni"],
        ].map(([id, text]) => (
          <a
            key={id}
            href={`#${id}`}
            onClick={(e) => {
              e.preventDefault();
              jump(id);
            }}
          >
            {text}
          </a>
        ))}
        <button type="button" onClick={onOpenEvents}>
          Apri Funnel Events (dettaglio grezzo)
        </button>
      </nav>

      <FiltersBar
        value={draft}
        onChange={change}
        meta={metaState.state.data}
        error={rangeError}
      />

      <section
        id="panoramica"
        className={styles.section}
        aria-labelledby="h-panoramica"
      >
        <h2 id="h-panoramica">Panoramica</h2>
        {ov ? (
          <p className={styles.lead}>
            Periodo {formatDay(ov.range.from)} – {formatDay(ov.range.to)} (
            {ov.range.days} giorni, {ov.range.tz}) · confronto con{" "}
            {formatDay(ov.range.previous.from)} –{" "}
            {formatDay(ov.range.previous.to)}.
          </p>
        ) : null}
        {overview.state.status === "error" ? (
          <ErrorBox message={overview.state.error} onRetry={overview.reload} />
        ) : null}
        {overview.state.status === "loading" ? <Loading rows={6} /> : null}
        {ov ? (
          <>
            <QuickAnswers
              kpis={ov.kpis}
              certs={certs.state.data?.rows ?? null}
              commercial={ov.funnels.commercial}
              onJump={jump}
            />
            {ov.quality.truncated ? (
              <p className={styles.banner} role="status">
                Attenzione: il volume di eventi ha superato il tetto di lettura.
                I numeri basati sugli eventi sono un minimo, non un totale.
              </p>
            ) : null}
            <KpiGrid kpis={ov.kpis} dict={dict} />
            <DailySeries
              current={ov.series.current}
              previous={ov.series.previous}
            />
            <ul className={styles.notes}>
              {ov.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </>
        ) : null}
      </section>

      <section
        id="funnel"
        className={styles.section}
        aria-labelledby="h-funnel"
      >
        <h2 id="h-funnel">Funnel di conversione</h2>
        <p className={styles.lead}>
          Caricamento quiz → Interazione reale → Risultato → Paywall → Click
          commerciale → Checkout → Pagamento verificato, sulla stessa identità e
          in ordine temporale.
        </p>
        {overview.state.status === "loading" ? <Loading rows={2} /> : null}
        {overview.state.status === "error" ? (
          <ErrorBox message={overview.state.error} onRetry={overview.reload} />
        ) : null}
        {ov ? (
          <FunnelPanel
            funnels={ov.funnels}
            population={ov.population}
            dict={dict}
          />
        ) : null}
      </section>

      <section
        id="certificazioni"
        className={styles.section}
        aria-labelledby="h-cert"
      >
        <h2 id="h-cert">Certificazioni</h2>
        {certs.state.status === "loading" ? <Loading rows={3} /> : null}
        {certs.state.status === "error" ? (
          <ErrorBox message={certs.state.error} onRetry={certs.reload} />
        ) : null}
        {certs.state.data ? (
          <>
            <CertificationsTable
              rows={certs.state.data.rows}
              columns={certs.state.data.columns}
              dict={dict}
              selected={selected}
              onSelect={setSelected}
            />
            <ul className={styles.notes}>
              {certs.state.data.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
              <li>
                {formatInt(certs.state.data.unattributedToCertification)} eventi
                senza certificazione attribuibile non compaiono in nessuna riga.
              </li>
            </ul>
          </>
        ) : null}
        {selected ? (
          <div className={styles.panel} aria-live="polite">
            <h3>
              Dettaglio ·{" "}
              {certs.state.data?.rows.find((r) => r.slug === selected)?.name ??
                selected}
            </h3>
            {detail.state.status === "loading" ? <Loading rows={2} /> : null}
            {detail.state.status === "error" ? (
              <ErrorBox message={detail.state.error} onRetry={detail.reload} />
            ) : null}
            {detail.state.data ? (
              <>
                <DailySeries
                  current={detail.state.data.series}
                  previous={null}
                />
                <FunnelPanel
                  funnels={detail.state.data.funnels}
                  population={null}
                  dict={dict}
                />
              </>
            ) : null}
            <button type="button" onClick={() => setSelected(null)}>
              Chiudi dettaglio
            </button>
          </div>
        ) : (
          <Empty>
            Seleziona una certificazione dalla tabella per vederne andamento
            temporale e percorso commerciale.
          </Empty>
        )}
      </section>

      <section
        id="ritorno"
        className={styles.section}
        aria-labelledby="h-ritorno"
      >
        <h2 id="h-ritorno">Registrazioni e ritorno allo studio</h2>
        {ov ? (
          <div className={styles.twoCols}>
            {ov.kpis
              .filter((k) =>
                [
                  "registrations",
                  "study_return_d1",
                  "study_return_d7",
                  "study_return_d28",
                ].includes(k.metric),
              )
              .slice(0, 1)
              .map((k) => (
                <div key={k.metric} className={styles.panel}>
                  <h3>Registrazioni (account creati)</h3>
                  <p className={styles.value}>
                    {k.value == null
                      ? "Non disponibile"
                      : formatInt(k.value as number)}
                  </p>
                  <p className={styles.sub}>
                    {k.reason ??
                      "Fonte operativa users.created_at, esclusi admin. Non coincide con gli eventi registration_completed."}
                  </p>
                  <MetricDetails info={dict.get("registrations")} kpi={k} />
                </div>
              ))}
          </div>
        ) : null}
        {retention.state.status === "loading" ? <Loading rows={3} /> : null}
        {retention.state.status === "error" ? (
          <ErrorBox
            message={retention.state.error}
            onRetry={retention.reload}
          />
        ) : null}
        {retention.state.data ? (
          <ReturnPanel
            cohorts={retention.state.data.cohorts}
            summary={retention.state.data.summary}
            unavailable={retention.state.data.unavailable}
          />
        ) : null}
        {retention.state.data?.notes ? (
          <ul className={styles.notes}>
            {retention.state.data.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        ) : null}
      </section>

      <section
        id="ricavi"
        className={styles.section}
        aria-labelledby="h-ricavi"
      >
        <h2 id="h-ricavi">Ricavi e checkout</h2>
        {revenue.state.status === "loading" ? <Loading rows={4} /> : null}
        {revenue.state.status === "error" ? (
          <ErrorBox message={revenue.state.error} onRetry={revenue.reload} />
        ) : null}
        {revenue.state.data ? (
          <>
            <RevenuePanel
              sections={revenue.state.data.sections}
              reconciliationMessage={revenue.state.data.reconciliation.message}
              webhooks={revenue.state.data.webhooks}
              dict={dict}
            />
            <ul className={styles.notes}>
              {revenue.state.data.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </>
        ) : null}
      </section>

      <section
        id="definizioni"
        className={styles.section}
        aria-labelledby="h-def"
      >
        <h2 id="h-def">Dizionario delle metriche</h2>
        {dictState.state.status === "error" ? (
          <ErrorBox
            message={dictState.state.error}
            onRetry={dictState.reload}
          />
        ) : null}
        <details className={styles.panel}>
          <summary>Mostra tutte le definizioni ({dict.size})</summary>
          <div
            className={`${styles.tableWrap} ${styles.dictionary}`}
            tabIndex={0}
            aria-label="Dizionario metriche"
          >
            <table>
              <thead>
                <tr>
                  <th>Metrica</th>
                  <th>Fonte</th>
                  <th>Definizione</th>
                  <th>Limiti</th>
                </tr>
              </thead>
              <tbody>
                {[...dict.values()].map((m) => (
                  <tr key={m.id}>
                    <th scope="row">{m.label}</th>
                    <td>{m.source}</td>
                    <td>{m.definition}</td>
                    <td>{m.limits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
        <p className={styles.sub}>
          Fasi del funnel:{" "}
          {[
            "load",
            "interaction",
            "result",
            "paywall",
            "click",
            "checkout",
            "payment",
          ]
            .map(stageLabel)
            .join(" → ")}
          .
        </p>
      </section>
    </div>
  );
}
