"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import AdminFeedbackClient from "./feedback/AdminFeedbackClient";
import AdminSubscriptionsClient from "./subscriptions/AdminSubscriptionsClient";
import AdminOrganizationsClient from "./organizations/AdminOrganizationsClient";
type Lead = {
  id: number;
  email: string;
  cert_slug: string | null;
  topic_slug: string | null;
  mode: string | null;
  source: string | null;
  assessment_score: number | null;
  assessment_completed_at: string | null;
  lang: string | null;
  created_at: string;
};

type Overview = {
  totals: {
    total_leads: number;
    assessment_leads: number;
    lead_magnet_leads: number;
  };
  topCerts: { cert_slug: string; total: number }[];
  topTopics: { topic_slug: string; total: number }[];
};

type FunnelEvent = {
  id: number;
  email: string | null;
  event: string;
  cert_slug: string | null;
  topic_slug: string | null;
  lang: string | null;
  score: number | null;
  created_at: string;
};

type FunnelSummary = {
  events: { event: string; total: number }[];
  topCerts: { cert_slug: string; event: string; total: number }[];
};

type HotLead = {
  email: string;
  cert_slug: string | null;
  lang: string | null;
  best_score: number | null;
  premium_clicks: number;
  total_events: number;
  last_event_at: string;
};

type DateFilter = "today" | "7d" | "30d" | "all";
type ModeFilter = "all" | "assessment" | "lead_magnet";
type Tab = "dashboard" | "feedback" | "subscriptions" | "organizations";

export default function AdminClient() {
  const { user, isAdmin, token } = useAuth();

  const [tab, setTab] = useState<Tab>("dashboard");

  const [overview, setOverview] = useState<Overview | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [funnelSummary, setFunnelSummary] = useState<FunnelSummary | null>(null);
  const [funnelEvents, setFunnelEvents] = useState<FunnelEvent[]>([]);
  const [hotLeads, setHotLeads] = useState<HotLead[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("all");
  const [langFilter, setLangFilter] = useState("all");
  const [certFilter, setCertFilter] = useState("all");
  const [modeFilter, setModeFilter] = useState<ModeFilter>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("30d");

  const availableCerts = useMemo(() => {
    const set = new Set<string>();

    leads.forEach((lead) => {
      if (lead.cert_slug) set.add(lead.cert_slug);
    });

    funnelEvents.forEach((event) => {
      if (event.cert_slug) set.add(event.cert_slug);
    });

    hotLeads.forEach((lead) => {
      if (lead.cert_slug) set.add(lead.cert_slug);
    });

    return Array.from(set).sort();
  }, [leads, funnelEvents, hotLeads]);

  const availableEvents = useMemo(() => {
    const set = new Set<string>();

    funnelEvents.forEach((event) => {
      if (event.event) set.add(event.event);
    });

    return Array.from(set).sort();
  }, [funnelEvents]);

  const filteredLeads = useMemo(() => {
    const q = search.trim().toLowerCase();

    return leads.filter((lead) => {
      const matchesSearch =
        !q ||
        lead.email?.toLowerCase().includes(q) ||
        lead.cert_slug?.toLowerCase().includes(q) ||
        lead.topic_slug?.toLowerCase().includes(q) ||
        lead.mode?.toLowerCase().includes(q) ||
        lead.lang?.toLowerCase().includes(q);

      const matchesMode = modeFilter === "all" || lead.mode === modeFilter;
      const matchesLang = langFilter === "all" || lead.lang === langFilter;
      const matchesCert = certFilter === "all" || lead.cert_slug === certFilter;
      const matchesDate = matchesDateFilter(lead.created_at, dateFilter);

      return matchesSearch && matchesMode && matchesLang && matchesCert && matchesDate;
    });
  }, [leads, search, modeFilter, langFilter, certFilter, dateFilter]);

  const filteredFunnelEvents = useMemo(() => {
    const q = search.trim().toLowerCase();

    return funnelEvents.filter((event) => {
      const matchesSearch =
        !q ||
        event.email?.toLowerCase().includes(q) ||
        event.cert_slug?.toLowerCase().includes(q) ||
        event.topic_slug?.toLowerCase().includes(q) ||
        event.event?.toLowerCase().includes(q) ||
        event.lang?.toLowerCase().includes(q);

      const matchesEvent = eventFilter === "all" || event.event === eventFilter;
      const matchesLang = langFilter === "all" || event.lang === langFilter;
      const matchesCert = certFilter === "all" || event.cert_slug === certFilter;
      const matchesDate = matchesDateFilter(event.created_at, dateFilter);

      return matchesSearch && matchesEvent && matchesLang && matchesCert && matchesDate;
    });
  }, [funnelEvents, search, eventFilter, langFilter, certFilter, dateFilter]);

  const filteredHotLeads = useMemo(() => {
    const q = search.trim().toLowerCase();

    return hotLeads.filter((lead) => {
      const matchesSearch =
        !q ||
        lead.email?.toLowerCase().includes(q) ||
        lead.cert_slug?.toLowerCase().includes(q) ||
        lead.lang?.toLowerCase().includes(q);

      const matchesLang = langFilter === "all" || lead.lang === langFilter;
      const matchesCert = certFilter === "all" || lead.cert_slug === certFilter;
      const matchesDate = matchesDateFilter(lead.last_event_at, dateFilter);

      return matchesSearch && matchesLang && matchesCert && matchesDate;
    });
  }, [hotLeads, search, langFilter, certFilter, dateFilter]);

  const filteredStats = useMemo(() => {
    const premiumClicks = filteredFunnelEvents.filter(
      (event) => event.event === "premium_clicked"
    ).length;

    const resultViewed = filteredFunnelEvents.filter(
      (event) => event.event === "result_viewed"
    ).length;

    const assessmentStarted = filteredFunnelEvents.filter(
      (event) => event.event === "assessment_started"
    ).length;

    const assessmentCompleted = filteredLeads.filter(
      (lead) => lead.mode === "assessment"
    ).length;

    const leadMagnets = filteredLeads.filter(
      (lead) => lead.mode === "lead_magnet"
    ).length;

    const anonymousPremiumClicks = filteredFunnelEvents.filter(
      (event) => event.event === "premium_clicked" && !event.email
    ).length;

    return {
      totalLeads: filteredLeads.length,
      assessmentCompleted,
      leadMagnets,
      premiumClicks,
      resultViewed,
      assessmentStarted,
      hotLeads: filteredHotLeads.length,
      anonymousPremiumClicks,
    };
  }, [filteredLeads, filteredFunnelEvents, filteredHotLeads]);

  const pwaStats = useMemo(() => {
  const getEventTotal = (name: string) =>
    funnelSummary?.events.find((e) => e.event === name)?.total ?? 0;

  const promptShown = getEventTotal("pwa_install_prompt_shown");
  const clicked = getEventTotal("pwa_install_clicked");
  const accepted = getEventTotal("pwa_install_accepted");
  const installed = getEventTotal("pwa_installed");
  const opened = getEventTotal("pwa_open");

  const conversion =
    promptShown > 0 ? Math.round((installed / promptShown) * 1000) / 10 : 0;

  return {
    promptShown,
    clicked,
    accepted,
    installed,
    opened,
    conversion,
  };
}, [funnelSummary]);

  const filteredTopCerts = useMemo(() => {
    return getTopItems(
      filteredLeads
        .map((lead) => lead.cert_slug)
        .filter((value): value is string => Boolean(value))
    );
  }, [filteredLeads]);

  const filteredTopTopics = useMemo(() => {
    return getTopItems(
      filteredLeads
        .map((lead) => lead.topic_slug)
        .filter((value): value is string => Boolean(value))
    );
  }, [filteredLeads]);

  const filteredEventCounts = useMemo(() => {
    return getTopItems(
      filteredFunnelEvents
        .map((event) => event.event)
        .filter((value): value is string => Boolean(value))
    );
  }, [filteredFunnelEvents]);

  async function loadDashboard() {
    if (!token) return;

    setLoading(true);
    setError("");

    try {
      const [
        overviewRes,
        leadsRes,
        funnelSummaryRes,
        funnelEventsRes,
        hotLeadsRes,
      ] = await Promise.all([
        fetch("/api/backend/admin/leads-overview", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/backend/admin/leads", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/backend/admin/funnel-summary", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/backend/admin/funnel-events", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/backend/admin/hot-leads", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!overviewRes.ok) throw new Error(`Overview HTTP ${overviewRes.status}`);
      if (!leadsRes.ok) throw new Error(`Leads HTTP ${leadsRes.status}`);
      if (!funnelSummaryRes.ok) {
        throw new Error(`Funnel summary HTTP ${funnelSummaryRes.status}`);
      }
      if (!funnelEventsRes.ok) {
        throw new Error(`Funnel events HTTP ${funnelEventsRes.status}`);
      }
      if (!hotLeadsRes.ok) throw new Error(`Hot leads HTTP ${hotLeadsRes.status}`);

      const overviewJson = await overviewRes.json();
      const leadsJson = await leadsRes.json();
      const funnelSummaryJson = await funnelSummaryRes.json();
      const funnelEventsJson = await funnelEventsRes.json();
      const hotLeadsJson = await hotLeadsRes.json();

      setOverview(overviewJson);
      setLeads(leadsJson.leads ?? []);
      setFunnelSummary(funnelSummaryJson);
      setFunnelEvents(funnelEventsJson.events ?? []);
      setHotLeads(hotLeadsJson.hotLeads ?? []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Errore caricamento dashboard");
    } finally {
      setLoading(false);
    }
  }

  function resetFilters() {
    setSearch("");
    setEventFilter("all");
    setLangFilter("all");
    setCertFilter("all");
    setModeFilter("all");
    setDateFilter("30d");
  }

  function exportLeadsCsv() {
    const rows = filteredLeads.map((lead) => ({
      email: lead.email,
      cert_slug: lead.cert_slug ?? "",
      topic_slug: lead.topic_slug ?? "",
      mode: lead.mode ?? "",
      source: lead.source ?? "",
      assessment_score: lead.assessment_score ?? "",
      lang: lead.lang ?? "",
      created_at: lead.created_at,
    }));

    downloadCsv("certifyquiz-leads.csv", rows);
  }

  function exportEventsCsv() {
    const rows = filteredFunnelEvents.map((event) => ({
      email: event.email ?? "",
      event: event.event,
      cert_slug: event.cert_slug ?? "",
      topic_slug: event.topic_slug ?? "",
      score: event.score ?? "",
      lang: event.lang ?? "",
      created_at: event.created_at,
    }));

    downloadCsv("certifyquiz-funnel-events.csv", rows);
  }

  useEffect(() => {
    if (token && tab === "dashboard") {
      loadDashboard();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, tab]);

  if (!user) {
    return <StateBox title="Accesso richiesto" text="Devi essere loggato." />;
  }

  if (!isAdmin) {
    return <StateBox title="Accesso negato" text="Questa sezione è riservata agli admin." />;
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <div style={styles.kicker}>CertifyQuiz control room</div>
          <h1 style={styles.title}>Admin Dashboard</h1>
          <p style={styles.subtitle}>
            Lead, assessment, funnel e feedback in un unico posto.
          </p>
        </div>

        <div style={styles.headerActions}>
          <button
            onClick={() => setTab("dashboard")}
            style={tab === "dashboard" ? styles.tabActive : styles.tab}
          >
            Dashboard
          </button>

          <button
            onClick={() => setTab("feedback")}
            style={tab === "feedback" ? styles.tabActive : styles.tab}
          >
            Feedback
          </button>

          <button
          onClick={() => setTab("subscriptions")}
          style={tab === "subscriptions" ? styles.tabActive : styles.tab}
           >
           Abbonamenti
           </button>

          <button
            onClick={() => setTab("organizations")}
            style={tab === "organizations" ? styles.tabActive : styles.tab}
          >
            Aziende
          </button>

          {tab === "dashboard" && (
            <button onClick={loadDashboard} disabled={loading} style={styles.refreshButton}>
              {loading ? "Carico..." : "Ricarica"}
            </button>
          )}
        </div>
      </div>

      {tab === "dashboard" && (
        <section>
          {error && <div style={styles.errorBox}>{error}</div>}

          <div style={styles.filterPanel}>
            <div>
              <h2 style={styles.filterTitle}>Filtri dashboard</h2>
              <p style={styles.filterHint}>
                Usa questi filtri per leggere lead, eventi funnel e interesse Premium.
              </p>
            </div>

            <div style={styles.filterGrid}>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cerca email, cert, topic, evento..."
                style={styles.input}
              />

              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as DateFilter)}
                style={styles.select}
              >
                <option value="today">Oggi</option>
                <option value="7d">Ultimi 7 giorni</option>
                <option value="30d">Ultimi 30 giorni</option>
                <option value="all">Tutto</option>
              </select>

              <select
                value={langFilter}
                onChange={(e) => setLangFilter(e.target.value)}
                style={styles.select}
              >
                <option value="all">Tutte le lingue</option>
                <option value="it">IT</option>
                <option value="en">EN</option>
                <option value="es">ES</option>
                <option value="fr">FR</option>
              </select>

              <select
                value={certFilter}
                onChange={(e) => setCertFilter(e.target.value)}
                style={styles.select}
              >
                <option value="all">Tutte le certificazioni</option>
                {availableCerts.map((cert) => (
                  <option key={cert} value={cert}>
                    {cert}
                  </option>
                ))}
              </select>

              <select
                value={modeFilter}
                onChange={(e) => setModeFilter(e.target.value as ModeFilter)}
                style={styles.select}
              >
                <option value="all">Tutti i lead</option>
                <option value="assessment">Assessment</option>
                <option value="lead_magnet">Lead magnet</option>
              </select>

              <select
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value)}
                style={styles.select}
              >
                <option value="all">Tutti gli eventi</option>
                {availableEvents.map((event) => (
                  <option key={event} value={event}>
                    {event}
                  </option>
                ))}
              </select>

              <button onClick={resetFilters} style={styles.secondaryButton}>
                Reset filtri
              </button>
            </div>
          </div>

          {overview && (
            <>
              <div style={styles.kpiGrid}>
                <KpiCard
                  label="Lead filtrati"
                  value={filteredStats.totalLeads}
                  hint={`Totale reale: ${overview.totals.total_leads}`}
                />

                <KpiCard
                  label="Assessment completati"
                  value={filteredStats.assessmentCompleted}
                  hint={`Totale reale: ${overview.totals.assessment_leads}`}
                />

                <KpiCard
                  label="Lead magnet"
                  value={filteredStats.leadMagnets}
                  hint={`Totale reale: ${overview.totals.lead_magnet_leads}`}
                />

                <KpiCard
                  label="Premium click"
                  value={filteredStats.premiumClicks}
                  hint={`Totale reale: ${
                    funnelSummary?.events.find((e) => e.event === "premium_clicked")?.total ?? 0
                  }`}
                />

                <KpiCard
                  label="Result viewed"
                  value={filteredStats.resultViewed}
                  hint={`Totale reale: ${
                    funnelSummary?.events.find((e) => e.event === "result_viewed")?.total ?? 0
                  }`}
                />

                <KpiCard
                  label="Assessment started"
                  value={filteredStats.assessmentStarted}
                  hint={`Totale reale: ${
                    funnelSummary?.events.find((e) => e.event === "assessment_started")?.total ?? 0
                  }`}
                />

                <KpiCard
                  label="Lead caldi"
                  value={filteredStats.hotLeads}
                  hint="Score alto, eventi o click Premium"
                />

                <KpiCard
                  label="Premium anonimi"
                  value={filteredStats.anonymousPremiumClicks}
                  hint="Click Premium senza email"
                />

                <KpiCard
                  label="📱 PWA Prompt"
                  value={pwaStats.promptShown}
                  hint="Banner installazione mostrato"
                />

                <KpiCard
                  label="📱 PWA Click"
                  value={pwaStats.clicked}
                  hint="Click sul bottone Installa"
                />

                <KpiCard
                  label="📱 PWA Install"
                  value={pwaStats.installed}
                  hint={`Conversione: ${pwaStats.conversion}%`}
                />

                <KpiCard
                  label="📱 PWA Open"
                  value={pwaStats.opened}
                  hint="Aperture da app installata"
/>
              </div>

              <div style={styles.insightGrid}>
                <RankingCard
                  title="Top certificazioni filtrate"
                  items={filteredTopCerts}
                  keyName="name"
                />

                <RankingCard
                  title="Top topic filtrati"
                  items={filteredTopTopics}
                  keyName="name"
                />

                <RankingCard
                  title="Eventi funnel filtrati"
                  items={filteredEventCounts}
                  keyName="name"
                />

                <div style={styles.insightCard}>
                  <h3 style={styles.cardTitle}>Lettura veloce</h3>
                  <p style={styles.note}>
                    Se i click Premium sono alti ma i lead caldi restano bassi, significa che
                    l’interesse c’è, ma spesso non è ancora collegato a una email. In quel caso
                    conviene spingere email capture prima o subito dopo il click Premium.
                  </p>
                </div>
              </div>
            </>
          )}

          <div style={styles.actionBar}>
            <button onClick={exportLeadsCsv} style={styles.exportButton}>
              Esporta lead CSV
            </button>

            <button onClick={exportEventsCsv} style={styles.exportButton}>
              Esporta eventi CSV
            </button>
          </div>

          <div style={styles.tableCard}>
            <div style={styles.tableHeader}>
              <div>
                <h2 style={styles.sectionTitle}>Ultimi lead</h2>
                <p style={styles.sectionHint}>
                  Qui vedi chi entra nel funnel, da dove arriva e se completa assessment.
                </p>
              </div>

              <div style={styles.tableCount}>
                {filteredLeads.length} / {leads.length}
              </div>
            </div>

            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <Th>Email</Th>
                    <Th>Cert</Th>
                    <Th>Topic</Th>
                    <Th>Mode</Th>
                    <Th>Score</Th>
                    <Th>Lang</Th>
                    <Th>Data</Th>
                  </tr>
                </thead>

                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} style={styles.row}>
                      <Td strong>{lead.email}</Td>
                      <Td>{lead.cert_slug || "-"}</Td>
                      <Td>{lead.topic_slug || "-"}</Td>
                      <Td>
                        <ModeBadge mode={lead.mode} />
                      </Td>
                      <Td>
                        {lead.assessment_score !== null &&
                        lead.assessment_score !== undefined ? (
                          <ScoreBadge score={lead.assessment_score} />
                        ) : (
                          "-"
                        )}
                      </Td>
                      <Td>{lead.lang || "-"}</Td>
                      <Td>{formatDate(lead.created_at)}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {!loading && filteredLeads.length === 0 && (
              <div style={styles.empty}>Nessun lead trovato con questi filtri.</div>
            )}
          </div>

          <div style={{ ...styles.tableCard, marginTop: 24 }}>
            <div style={styles.tableHeader}>
              <div>
                <h2 style={styles.sectionTitle}>Lead caldi</h2>
                <p style={styles.sectionHint}>
                  Utenti con score alto, più eventi o click Premium.
                </p>
              </div>

              <div style={styles.tableCount}>
                {filteredHotLeads.length} / {hotLeads.length}
              </div>
            </div>

            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <Th>Email</Th>
                    <Th>Cert</Th>
                    <Th>Lang</Th>
                    <Th>Best score</Th>
                    <Th>Premium click</Th>
                    <Th>Eventi</Th>
                    <Th>Ultimo evento</Th>
                  </tr>
                </thead>

                <tbody>
                  {filteredHotLeads.map((lead, idx) => (
                    <tr key={`${lead.email}-${idx}`} style={styles.row}>
                      <Td strong>{lead.email}</Td>
                      <Td>{lead.cert_slug || "-"}</Td>
                      <Td>{lead.lang || "-"}</Td>
                      <Td>
                        {lead.best_score !== null && lead.best_score !== undefined ? (
                          <ScoreBadge score={lead.best_score} />
                        ) : (
                          "-"
                        )}
                      </Td>
                      <Td>{lead.premium_clicks}</Td>
                      <Td>{lead.total_events}</Td>
                      <Td>{formatDate(lead.last_event_at)}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {!loading && filteredHotLeads.length === 0 && (
              <div style={styles.empty}>
                Nessun lead caldo trovato. Se hai molti Premium click ma qui vedi 0,
                probabilmente quei click non hanno ancora email associata.
              </div>
            )}
          </div>

          <div style={{ ...styles.tableCard, marginTop: 24 }}>
            <div style={styles.tableHeader}>
              <div>
                <h2 style={styles.sectionTitle}>Funnel events</h2>
                <p style={styles.sectionHint}>
                  Qui vedi assessment_started, result_viewed, premium_clicked e altri eventi.
                </p>
              </div>

              <div style={styles.tableCount}>
                {filteredFunnelEvents.length} / {funnelEvents.length}
              </div>
            </div>

            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <Th>Email</Th>
                    <Th>Evento</Th>
                    <Th>Cert</Th>
                    <Th>Topic</Th>
                    <Th>Score</Th>
                    <Th>Lang</Th>
                    <Th>Data</Th>
                  </tr>
                </thead>

                <tbody>
                  {filteredFunnelEvents.map((event) => (
                    <tr key={event.id} style={styles.row}>
                      <Td strong>{event.email || "-"}</Td>
                      <Td>
                        <EventBadge event={event.event} />
                      </Td>
                      <Td>{event.cert_slug || "-"}</Td>
                      <Td>{event.topic_slug || "-"}</Td>
                      <Td>
                        {event.score !== null && event.score !== undefined ? (
                          <ScoreBadge score={event.score} />
                        ) : (
                          "-"
                        )}
                      </Td>
                      <Td>{event.lang || "-"}</Td>
                      <Td>{formatDate(event.created_at)}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {!loading && filteredFunnelEvents.length === 0 && (
              <div style={styles.empty}>Nessun evento funnel trovato con questi filtri.</div>
            )}
          </div>
        </section>
      )}

      {tab === "feedback" && (
        <div style={styles.panel}>
          <AdminFeedbackClient />
        </div>
      )}

      {tab === "subscriptions" && (
  <div style={styles.panel}>
    <AdminSubscriptionsClient />
  </div>
)}

      {tab === "organizations" && (
        <div style={styles.panel}>
          <AdminOrganizationsClient />
        </div>
      )}
    </div>
  );
}

function KpiCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: number;
  hint: string;
}) {
  return (
    <div style={styles.kpiCard}>
      <div style={styles.kpiLabel}>{label}</div>
      <div style={styles.kpiValue}>{value}</div>
      <div style={styles.kpiHint}>{hint}</div>
    </div>
  );
}

function RankingCard({
  title,
  items,
  keyName,
}: {
  title: string;
  items: any[];
  keyName: string;
}) {
  return (
    <div style={styles.insightCard}>
      <h3 style={styles.cardTitle}>{title}</h3>

      {items.length === 0 && <p style={styles.muted}>Nessun dato.</p>}

      {items.map((item, idx) => (
        <div key={`${item[keyName]}-${idx}`} style={styles.rankRow}>
          <span style={styles.rankName}>{item[keyName] || "-"}</span>
          <strong>{item.total}</strong>
        </div>
      ))}
    </div>
  );
}

function ModeBadge({ mode }: { mode: string | null }) {
  const label = mode || "-";

  const style =
    mode === "assessment"
      ? styles.badgeAssessment
      : mode === "lead_magnet"
      ? styles.badgeLead
      : styles.badgeNeutral;

  return <span style={style}>{label}</span>;
}

function EventBadge({ event }: { event: string }) {
  const style =
    event === "premium_clicked"
      ? styles.badgePremium
      : event === "assessment_started"
      ? styles.badgeAssessment
      : event === "result_viewed"
      ? styles.badgeLead
      : styles.badgeNeutral;

  return <span style={style}>{event}</span>;
}

function ScoreBadge({ score }: { score: number }) {
  const style =
    score >= 80 ? styles.scoreGood : score >= 50 ? styles.scoreMid : styles.scoreLow;

  return <span style={style}>{score}%</span>;
}

function Th({ children }: { children: ReactNode }) {
  return <th style={styles.th}>{children}</th>;
}

function Td({
  children,
  strong = false,
}: {
  children: ReactNode;
  strong?: boolean;
}) {
  return <td style={strong ? styles.tdStrong : styles.td}>{children}</td>;
}

function StateBox({ title, text }: { title: string; text: string }) {
  return (
    <div style={styles.stateBox}>
      <h1 style={styles.title}>{title}</h1>
      <p style={styles.subtitle}>{text}</p>
    </div>
  );
}

function formatDate(value: string | null | undefined) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function matchesDateFilter(value: string | null | undefined, filter: DateFilter) {
  if (filter === "all") return true;
  if (!value) return false;

  const date = new Date(value);
  const now = new Date();

  if (Number.isNaN(date.getTime())) return false;

  if (filter === "today") {
    return date.toDateString() === now.toDateString();
  }

  const diffMs = now.getTime() - date.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (filter === "7d") return diffDays <= 7;
  if (filter === "30d") return diffDays <= 30;

  return true;
}

function getTopItems(values: string[]) {
  const counts = new Map<string, number>();

  values.forEach((value) => {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  });

  return Array.from(counts.entries())
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);
}

function downloadCsv(filename: string, rows: Record<string, string | number>[]) {
  if (rows.length === 0) {
    alert("Nessun dato da esportare con questi filtri.");
    return;
  }

  const headers = Object.keys(rows[0]);

  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      headers
        .map((header) => {
          const value = row[header] ?? "";
          const escaped = String(value).replace(/"/g, '""');
          return `"${escaped}"`;
        })
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

const styles: Record<string, CSSProperties> = {
  page: {
    maxWidth: 1500,
    margin: "0 auto",
    padding: "32px 24px 60px",
    color: "#0f172a",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 20,
    marginBottom: 28,
    flexWrap: "wrap",
  },

  kicker: {
    fontSize: 13,
    fontWeight: 700,
    color: "#2563eb",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 6,
  },

  title: {
    fontSize: 34,
    lineHeight: 1.1,
    fontWeight: 900,
    margin: 0,
  },

  subtitle: {
    marginTop: 8,
    color: "#64748b",
    fontSize: 15,
  },

  headerActions: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },

  tab: {
    border: "1px solid #e2e8f0",
    background: "#fff",
    color: "#334155",
    padding: "10px 14px",
    borderRadius: 999,
    fontWeight: 700,
    cursor: "pointer",
  },

  tabActive: {
    border: "1px solid #0f172a",
    background: "#0f172a",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: 999,
    fontWeight: 800,
    cursor: "pointer",
  },

  refreshButton: {
    border: "1px solid #bfdbfe",
    background: "#eff6ff",
    color: "#1d4ed8",
    padding: "10px 14px",
    borderRadius: 999,
    fontWeight: 800,
    cursor: "pointer",
  },

  errorBox: {
    border: "1px solid #fecaca",
    background: "#fef2f2",
    color: "#991b1b",
    padding: 14,
    borderRadius: 12,
    marginBottom: 18,
  },

  filterPanel: {
    border: "1px solid #e2e8f0",
    borderRadius: 18,
    padding: 18,
    background: "#ffffff",
    marginBottom: 20,
    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.04)",
  },

  filterTitle: {
    fontSize: 20,
    fontWeight: 900,
    margin: 0,
  },

  filterHint: {
    color: "#64748b",
    margin: "6px 0 14px",
    fontSize: 14,
  },

  filterGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(260px, 2fr) repeat(5, minmax(140px, 1fr)) auto",
    gap: 10,
    alignItems: "center",
  },

  input: {
    border: "1px solid #cbd5e1",
    borderRadius: 12,
    padding: "11px 12px",
    minWidth: 220,
    background: "#fff",
    color: "#0f172a",
  },

  select: {
    border: "1px solid #cbd5e1",
    borderRadius: 12,
    padding: "11px 12px",
    background: "#fff",
    color: "#0f172a",
  },

  secondaryButton: {
    border: "1px solid #e2e8f0",
    background: "#fff",
    color: "#334155",
    padding: "11px 14px",
    borderRadius: 12,
    fontWeight: 800,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  actionBar: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginBottom: 16,
    flexWrap: "wrap",
  },

  exportButton: {
    border: "1px solid #bbf7d0",
    background: "#f0fdf4",
    color: "#166534",
    padding: "10px 14px",
    borderRadius: 12,
    fontWeight: 800,
    cursor: "pointer",
  },

  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: 14,
    marginBottom: 20,
  },

  kpiCard: {
    border: "1px solid #e2e8f0",
    borderRadius: 18,
    padding: 18,
    background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.06)",
  },

  kpiLabel: {
    color: "#64748b",
    fontSize: 13,
    fontWeight: 800,
  },

  kpiValue: {
    fontSize: 36,
    fontWeight: 950,
    marginTop: 8,
  },

  kpiHint: {
    color: "#64748b",
    fontSize: 13,
    marginTop: 4,
  },

  insightGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 14,
    marginBottom: 24,
  },

  insightCard: {
    border: "1px solid #e2e8f0",
    borderRadius: 18,
    padding: 18,
    background: "#fff",
    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.04)",
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: 900,
    margin: "0 0 12px",
  },

  rankRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 14,
    padding: "8px 0",
    borderBottom: "1px solid #f1f5f9",
  },

  rankName: {
    color: "#334155",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  note: {
    color: "#475569",
    lineHeight: 1.6,
    margin: 0,
  },

  muted: {
    color: "#94a3b8",
  },

  tableCard: {
    border: "1px solid #e2e8f0",
    borderRadius: 18,
    background: "#fff",
    overflow: "hidden",
    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.04)",
  },

  tableHeader: {
    padding: 18,
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    alignItems: "center",
    borderBottom: "1px solid #e2e8f0",
    flexWrap: "wrap",
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: 900,
    margin: 0,
  },

  sectionHint: {
    color: "#64748b",
    margin: "6px 0 0",
    fontSize: 14,
  },

  tableCount: {
    border: "1px solid #e2e8f0",
    background: "#f8fafc",
    color: "#475569",
    padding: "8px 12px",
    borderRadius: 999,
    fontWeight: 800,
    fontSize: 13,
  },

  tableWrap: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 14,
  },

  th: {
    textAlign: "left",
    padding: "13px 14px",
    background: "#f8fafc",
    color: "#475569",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    borderBottom: "1px solid #e2e8f0",
    whiteSpace: "nowrap",
  },

  row: {
    borderBottom: "1px solid #f1f5f9",
  },

  td: {
    padding: "13px 14px",
    color: "#334155",
    whiteSpace: "nowrap",
  },

  tdStrong: {
    padding: "13px 14px",
    color: "#0f172a",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },

  badgeAssessment: {
    background: "#dcfce7",
    color: "#166534",
    border: "1px solid #bbf7d0",
    padding: "4px 9px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
  },

  badgeLead: {
    background: "#eff6ff",
    color: "#1d4ed8",
    border: "1px solid #bfdbfe",
    padding: "4px 9px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
  },

  badgeNeutral: {
    background: "#f8fafc",
    color: "#64748b",
    border: "1px solid #e2e8f0",
    padding: "4px 9px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
  },

  badgePremium: {
    background: "#fef3c7",
    color: "#92400e",
    border: "1px solid #fde68a",
    padding: "4px 9px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 900,
  },

  scoreGood: {
    background: "#dcfce7",
    color: "#166534",
    padding: "4px 9px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 900,
  },

  scoreMid: {
    background: "#fef9c3",
    color: "#854d0e",
    padding: "4px 9px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 900,
  },

  scoreLow: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "4px 9px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 900,
  },

  empty: {
    padding: 22,
    color: "#64748b",
  },

  panel: {
    border: "1px solid #e2e8f0",
    borderRadius: 18,
    background: "#fff",
    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.04)",
    overflow: "hidden",
  },

  stateBox: {
    maxWidth: 700,
    margin: "60px auto",
    padding: 24,
  },
};