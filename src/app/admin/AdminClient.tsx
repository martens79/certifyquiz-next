"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import AdminFeedbackClient from "./feedback/AdminFeedbackClient";
import AdminSubscriptionsClient from "./subscriptions/AdminSubscriptionsClient";
import AdminOrganizationsClient from "./organizations/AdminOrganizationsClient";
import AdminPushClient from "./push/AdminPushClient";
import {
  BUSINESS_STEPS,
  businessStepCounts,
  eventCategory,
  normalizedBusinessEvents,
  type AdminFunnelEvent,
} from "@/lib/admin-analytics";
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
  updated_at: string;
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
type PaywallUser = {
  id: number;
  username: string;
  email: string;
  premium: number | null;
  premium_status: string | null;
  free_wrong_explanations_used: number;
  free_wrong_explanations_limit: number;
};

type Paywall20 = {
  totals: {
    users_at_limit: number;
    users_at_limit_premium: number;
    users_at_limit_free: number;
  };
  usersAtLimit: PaywallUser[];
};

type DateFilter = "today" | "7d" | "30d" | "all";
type ModeFilter = "all" | "assessment" | "lead_magnet";
type Tab = "dashboard" | "feedback" | "subscriptions" | "organizations" | "push";

export default function AdminClient() {
  const { user, isAdmin, token } = useAuth();

  const [tab, setTab] = useState<Tab>("dashboard");

  const [overview, setOverview] = useState<Overview | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [funnelSummary, setFunnelSummary] = useState<FunnelSummary | null>(null);
  const [funnelEvents, setFunnelEvents] = useState<AdminFunnelEvent[]>([]);
  const [hotLeads, setHotLeads] = useState<HotLead[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("all");
  const [langFilter, setLangFilter] = useState("all");
  const [certFilter, setCertFilter] = useState("all");
  const [modeFilter, setModeFilter] = useState<ModeFilter>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("30d");

  const [paywall20, setPaywall20] = useState<Paywall20 | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

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
      const matchesDate = matchesDateFilter(lead.updated_at || lead.created_at, dateFilter);

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

  const businessFilteredEvents = useMemo(
    () =>
      funnelEvents.filter((event) => {
        const matchesLang = langFilter === "all" || event.lang === langFilter;
        const matchesCert = certFilter === "all" || event.cert_slug === certFilter;
        const matchesDate = matchesDateFilter(event.created_at, dateFilter);
        return matchesLang && matchesCert && matchesDate;
      }),
    [funnelEvents, langFilter, certFilter, dateFilter],
  );

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

  const businessCounts = useMemo(
    () => businessStepCounts(businessFilteredEvents),
    [businessFilteredEvents],
  );

  const normalizedEvents = useMemo(
    () => normalizedBusinessEvents(businessFilteredEvents),
    [businessFilteredEvents],
  );

  const assessmentAverageScore = useMemo(() => {
    const scores = normalizedEvents
      .filter((event) => event.step === "assessment_completed" && event.score !== null)
      .map((event) => Number(event.score))
      .filter(Number.isFinite);
    if (!scores.length) return null;
    return Math.round((scores.reduce((sum, score) => sum + score, 0) / scores.length) * 10) / 10;
  }, [normalizedEvents]);

  const certificationPerformance = useMemo(() => {
    const rows = new Map<string, Record<string, number>>();
    normalizedEvents.forEach((event) => {
      if (!event.cert_slug) return;
      const row = rows.get(event.cert_slug) ?? {};
      row[event.step] = (row[event.step] ?? 0) + 1;
      rows.set(event.cert_slug, row);
    });
    return Array.from(rows.entries())
      .map(([certification, counts]) => ({ certification, counts }))
      .sort((a, b) => (b.counts.assessment_started ?? 0) - (a.counts.assessment_started ?? 0));
  }, [normalizedEvents]);

  const paywallStats = useMemo(() => {
  const gateShown = filteredFunnelEvents.filter(
    (event) => event.event === "wrong_explanation_gate_shown"
  ).length;

  const ctaClicked = filteredFunnelEvents.filter(
    (event) => event.event === "premium_cta_clicked"
  ).length;

  const conversion =
    gateShown > 0 ? Math.round((ctaClicked / gateShown) * 1000) / 10 : 0;

  return {
    gateShown,
    ctaClicked,
    conversion,
    usersAtLimit: paywall20?.totals.users_at_limit ?? 0,
    usersAtLimitFree: paywall20?.totals.users_at_limit_free ?? 0,
    usersAtLimitPremium: paywall20?.totals.users_at_limit_premium ?? 0,
  };
}, [filteredFunnelEvents, paywall20]);

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
        paywall20Res,
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
        fetch("/api/backend/admin/paywall-20", {
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
      if (!paywall20Res.ok) throw new Error(`Paywall 20 HTTP ${paywall20Res.status}`);

      const overviewJson = await overviewRes.json();
      const leadsJson = await leadsRes.json();
      const funnelSummaryJson = await funnelSummaryRes.json();
      const funnelEventsJson = await funnelEventsRes.json();
      const hotLeadsJson = await hotLeadsRes.json();
      const paywall20Json = await paywall20Res.json();

      setOverview(overviewJson);
      setLeads(leadsJson.leads ?? []);
      setFunnelSummary(funnelSummaryJson);
      setFunnelEvents(funnelEventsJson.events ?? []);
      setHotLeads(hotLeadsJson.hotLeads ?? []);
      setPaywall20(paywall20Json);
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
      updated_at: lead.updated_at,
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
        <button onClick={() => setTab("push")} style={tab === "push" ? styles.tabActive : styles.tab}>Notifiche push</button>

        {tab === "dashboard" && (
          <button
            onClick={loadDashboard}
            disabled={loading}
            style={styles.refreshButton}
          >
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
            <div style={styles.reliabilityNote}>
              <strong>Copertura:</strong> i KPI usano gli eventi DB caricati (massimo 500) e
              rispettano i filtri. Visitors, sessioni e revenue non sono disponibili in questa
              API; non vengono stimati. Legacy e canonici accoppiati non sono contati due volte.
            </div>

            <div style={styles.kpiGrid}>
              <KpiCard label="Visitors / Sessions" value="—" hint="GA4 non collegato a questa dashboard" />
              <KpiCard label="Assessment avviati" value={businessCounts.assessment_started} hint="Evento canonico + legacy non duplicati" />
              <KpiCard label="Assessment completati" value={businessCounts.assessment_completed} hint={rateHint(businessCounts.assessment_completed, businessCounts.assessment_started, "completion")} />
              <KpiCard label="Lead acquisiti" value={businessCounts.email_captured} hint={rateHint(businessCounts.email_captured, businessCounts.assessment_completed, "assessment → email")} />
              <KpiCard label="Studio avviato" value={businessCounts.study_started} hint={rateHint(businessCounts.study_started, businessCounts.email_captured, "lead → study")} />
              <KpiCard label="Paywall raggiunto" value={businessCounts.paywall_reached} hint="Occorrenze normalizzate, non utenti unici" />
              <KpiCard label="Checkout avviati" value={businessCounts.checkout_started} hint={rateHint(businessCounts.checkout_started, businessCounts.paywall_reached, "paywall → checkout")} />
              <KpiCard label="Acquisti" value={businessCounts.purchase_completed} hint={rateHint(businessCounts.purchase_completed, businessCounts.checkout_started, "checkout → purchase")} />
              <KpiCard label="Revenue" value="—" hint="Importi non presenti in funnel_events" />
            </div>

            <div style={styles.funnelCard}>
              <div style={styles.tableHeader}>
                <div>
                  <h2 style={styles.sectionTitle}>Funnel di conversione</h2>
                  <p style={styles.sectionHint}>Conteggi di eventi; il traffico iniziale non è disponibile nel DB admin.</p>
                </div>
                <div style={styles.tableCount}>Score medio: {assessmentAverageScore === null ? "n/d" : `${assessmentAverageScore}%`}</div>
              </div>
              <div style={styles.funnelSteps}>
                {BUSINESS_STEPS.map((step, index) => {
                  const count = businessCounts[step.key];
                  const previous = index === 0 ? null : businessCounts[BUSINESS_STEPS[index - 1].key];
                  const conversion = previous && previous > 0 ? Math.round((count / previous) * 1000) / 10 : null;
                  return (
                    <div key={step.key} style={styles.funnelStep}>
                      <div style={styles.funnelStepHeader}><span>{step.label}</span><strong>{count}</strong></div>
                      {previous !== null && (
                        <div style={styles.funnelRate}>
                          {conversion === null ? "Conversione n/d" : `${conversion}% dal passaggio precedente · drop-off ${Math.max(0, Math.round((100 - conversion) * 10) / 10)}%`}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ ...styles.tableCard, marginTop: 24 }}>
              <div style={styles.tableHeader}>
                <div>
                  <h2 style={styles.sectionTitle}>Performance certificazioni</h2>
                  <p style={styles.sectionHint}>Attribution parziale basata sul `cert_slug` presente nel singolo evento.</p>
                </div>
              </div>
              <div style={styles.tableWrap}>
                <table style={styles.table}>
                  <thead><tr><Th>Certification</Th><Th>Views</Th><Th>Assessments</Th><Th>Leads</Th><Th>Study starts</Th><Th>Purchases</Th><Th>Revenue</Th><Th>Assessment → lead</Th></tr></thead>
                  <tbody>
                    {certificationPerformance.map(({ certification, counts }) => (
                      <tr key={certification} style={styles.row}>
                        <Td strong>{certification}</Td><Td>n/d</Td>
                        <Td>{counts.assessment_started ?? 0}</Td><Td>{counts.email_captured ?? 0}</Td>
                        <Td>{counts.study_started ?? 0}</Td><Td>{counts.purchase_completed ?? 0}</Td><Td>n/d</Td>
                        <Td>{formatRate(counts.email_captured ?? 0, counts.assessment_started ?? 0)}</Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {!loading && certificationPerformance.length === 0 && <div style={styles.empty}>Nessun evento correlabile a una certificazione.</div>}
            </div>
          </>
        )}

        <button onClick={() => setShowAdvanced((value) => !value)} style={styles.advancedToggle}>
          {showAdvanced ? "Nascondi Advanced Events" : "Mostra Advanced Events"}
        </button>

        {showAdvanced && (
          <>
            <div style={styles.advancedHeader}>
              <h2 style={styles.sectionTitle}>Advanced Events</h2>
              <p style={styles.sectionHint}>Telemetria operativa, legacy e debug. Non è usata come KPI principale.</p>
            </div>

            <details style={styles.legendCard} open>
              <summary style={styles.legendSummary}>Legenda eventi e categorie</summary>
              <p style={styles.sectionHint}>
                Una riga rappresenta un evento registrato, non necessariamente una persona unica.
              </p>
              <div style={styles.legendGrid}>
                <div>
                  <h3 style={styles.legendTitle}>Eventi principali</h3>
                  <LegendItem code="assessment_started" text="Una persona ha iniziato il test di valutazione." />
                  <LegendItem code="assessment_completed" text="Il test è stato completato e il risultato calcolato." />
                  <LegendItem code="email_captured" text="È stata lasciata un’email per ricevere il report." />
                  <LegendItem code="study_started" text="È iniziato realmente un quiz di studio o un Interactive Lab." />
                  <LegendItem code="free_limit_reached" text="Un account free ha consumato l’ultima quota gratuita." />
                  <LegendItem code="paywall_viewed" text="È stato mostrato un blocco Premium/acquisto. Non significa che l’utente abbia comprato." />
                  <LegendItem code="checkout_started / checkout_created" text="È stata avviata la procedura di pagamento." />
                  <LegendItem code="purchase_completed" text="Il pagamento è stato confermato." />
                  <LegendItem code="map_preview_viewed / guide_preview_viewed" text="È stata aperta l’anteprima di una mappa o guida." />
                  <LegendItem code="pwa_install_prompt_shown" text="È comparso l’invito a installare CertifyQuiz come app." />
                </div>
                <div>
                  <h3 style={styles.legendTitle}>Categorie</h3>
                  <LegendItem code="CORE KPI" text="Passaggio fondamentale del funnel business." />
                  <LegendItem code="FUNNEL" text="Passaggio che avvicina l’utente alla conversione." />
                  <LegendItem code="PRODUCT" text="Utilizzo o interesse verso contenuti e funzionalità." />
                  <LegendItem code="COMMERCE" text="Checkout, pagamento, acquisto o relativo lifecycle." />
                  <LegendItem code="DEBUG/TECHNICAL" text="Telemetria utile per controllare il prodotto, non un risultato commerciale diretto." />
                  <LegendItem code="LEGACY" text="Vecchio nome conservato per continuità storica; il KPI normalizzato evita il doppio conteggio." />
                </div>
              </div>
            </details>

            <div style={styles.insightGrid}>
              {filteredTopCerts.length > 0 && <RankingCard title="Top certificazioni lead" items={filteredTopCerts} keyName="name" />}
              {filteredTopTopics.length > 0 && <RankingCard title="Top topic lead" items={filteredTopTopics} keyName="name" />}
              <RankingCard title="Tutti gli eventi grezzi" items={filteredEventCounts} keyName="name" />
              <div style={styles.insightCard}>
                <h3 style={styles.cardTitle}>Paywall tecnico</h3>
                <div style={styles.compactStatsGrid}>
                  <MiniStat label="Gate legacy" value={paywallStats.gateShown} />
                  <MiniStat label="CTA click" value={paywallStats.ctaClicked} />
                  <MiniStat label="Utenti al limite" value={paywallStats.usersAtLimit} />
                </div>
              </div>
            </div>

            <div style={styles.compactCard}>
              <h3 style={styles.cardTitle}>PWA / product telemetry</h3>
              <div style={styles.compactStatsGrid}>
                <MiniStat label="Prompt" value={pwaStats.promptShown} />
                <MiniStat label="Click" value={pwaStats.clicked} />
                <MiniStat label="Install" value={pwaStats.installed} />
                <MiniStat label="Open" value={pwaStats.opened} />
                <MiniStat label="Conv." value={`${pwaStats.conversion}%`} />
              </div>
            </div>

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
                    <Th>Ultima attività</Th>
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
                      <Td>{formatDate(lead.updated_at || lead.created_at)}</Td>
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
                      <Td><EventBadge event={event.event} /> <span style={styles.eventCategory}>{eventCategory(event.event)}</span></Td>
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
          </>
        )}
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
      {tab === "push" && <div style={styles.panel}><AdminPushClient /></div>}
    </div>
  );
}

function KpiCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: number | string;
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
function MiniStat({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div style={styles.miniStat}>
      <div style={styles.miniStatLabel}>{label}</div>
      <div style={styles.miniStatValue}>{value}</div>
    </div>
  );
}

function LegendItem({ code, text }: { code: string; text: string }) {
  return (
    <div style={styles.legendItem}>
      <code style={styles.legendCode}>{code}</code>
      <span style={styles.legendText}>{text}</span>
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

function formatRate(value: number, denominator: number) {
  if (denominator <= 0) return "n/d";
  return `${Math.round((value / denominator) * 1000) / 10}%`;
}

function rateHint(value: number, denominator: number, label: string) {
  return `${label}: ${formatRate(value, denominator)}`;
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

  reliabilityNote: {
    border: "1px solid #bfdbfe",
    background: "#eff6ff",
    color: "#1e3a8a",
    padding: 14,
    borderRadius: 14,
    marginBottom: 18,
    fontSize: 13,
    lineHeight: 1.5,
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

  funnelCard: {
    border: "1px solid #cbd5e1",
    borderRadius: 18,
    background: "#fff",
    overflow: "hidden",
    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.05)",
  },

  funnelSteps: {
    display: "grid",
    gap: 1,
    background: "#e2e8f0",
  },

  funnelStep: {
    background: "#fff",
    padding: "14px 18px",
  },

  funnelStepHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 20,
    color: "#0f172a",
    fontSize: 16,
  },

  funnelRate: {
    color: "#64748b",
    fontSize: 12,
    marginTop: 5,
  },

  advancedToggle: {
    display: "block",
    margin: "24px 0 16px auto",
    border: "1px solid #cbd5e1",
    background: "#f8fafc",
    color: "#334155",
    padding: "10px 14px",
    borderRadius: 12,
    fontWeight: 800,
    cursor: "pointer",
  },

  advancedHeader: {
    borderTop: "1px solid #e2e8f0",
    paddingTop: 20,
    marginBottom: 16,
  },

  eventCategory: {
    marginLeft: 8,
    color: "#64748b",
    fontSize: 10,
    fontWeight: 800,
  },

  legendCard: {
    border: "1px solid #cbd5e1",
    borderRadius: 16,
    padding: 16,
    background: "#f8fafc",
    marginBottom: 18,
  },

  legendSummary: {
    cursor: "pointer",
    fontWeight: 900,
    fontSize: 17,
    color: "#0f172a",
  },

  legendGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 24,
    marginTop: 14,
  },

  legendTitle: {
    fontSize: 14,
    fontWeight: 900,
    margin: "0 0 10px",
    color: "#334155",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  legendItem: {
    display: "grid",
    gridTemplateColumns: "minmax(145px, auto) 1fr",
    gap: 12,
    alignItems: "start",
    padding: "8px 0",
    borderBottom: "1px solid #e2e8f0",
  },

  legendCode: {
    color: "#1e3a8a",
    fontSize: 11,
    fontWeight: 800,
    overflowWrap: "anywhere",
  },

  legendText: {
    color: "#475569",
    fontSize: 12,
    lineHeight: 1.45,
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

  compactCard: {
  border: "1px solid #e2e8f0",
  borderRadius: 18,
  padding: 18,
  background: "#fff",
  boxShadow: "0 10px 25px rgba(15, 23, 42, 0.04)",
  marginBottom: 24,
},

compactStatsGrid: {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
  gap: 10,
  marginTop: 14,
},

miniStat: {
  border: "1px solid #e2e8f0",
  borderRadius: 14,
  padding: 12,
  background: "#f8fafc",
},

miniStatLabel: {
  fontSize: 12,
  color: "#64748b",
  fontWeight: 800,
},

miniStatValue: {
  fontSize: 22,
  fontWeight: 950,
  marginTop: 4,
  color: "#0f172a",
},
};
