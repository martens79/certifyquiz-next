"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import AdminFeedbackClient from "./feedback/AdminFeedbackClient";

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

export default function AdminClient() {
  const { user, isAdmin, token } = useAuth();

  const [tab, setTab] = useState<"dashboard" | "feedback">("dashboard");
  const [overview, setOverview] = useState<Overview | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [modeFilter, setModeFilter] = useState<"all" | "assessment" | "lead_magnet">("all");

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesMode = modeFilter === "all" || lead.mode === modeFilter;
      const q = search.trim().toLowerCase();

      const matchesSearch =
        !q ||
        lead.email?.toLowerCase().includes(q) ||
        lead.cert_slug?.toLowerCase().includes(q) ||
        lead.topic_slug?.toLowerCase().includes(q) ||
        lead.lang?.toLowerCase().includes(q);

      return matchesMode && matchesSearch;
    });
  }, [leads, search, modeFilter]);

  async function loadDashboard() {
    if (!token) return;

    setLoading(true);
    setError("");

    try {
      const [overviewRes, leadsRes] = await Promise.all([
        fetch("/api/backend/admin/leads-overview", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/backend/admin/leads", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!overviewRes.ok) throw new Error(`Overview HTTP ${overviewRes.status}`);
      if (!leadsRes.ok) throw new Error(`Leads HTTP ${leadsRes.status}`);

      const overviewJson = await overviewRes.json();
      const leadsJson = await leadsRes.json();

      setOverview(overviewJson);
      setLeads(leadsJson.leads ?? []);
    } catch (e: any) {
      setError(e?.message || "Errore caricamento dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token && tab === "dashboard") loadDashboard();
  }, [token, tab]);

  if (!user) return <StateBox title="Accesso richiesto" text="Devi essere loggato." />;
  if (!isAdmin) return <StateBox title="Accesso negato" text="Questa sezione è riservata agli admin." />;

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

          {overview && (
            <>
              <div style={styles.kpiGrid}>
                <KpiCard
                  label="Totale lead"
                  value={overview.totals.total_leads}
                  hint="Email raccolte nel funnel"
                />
                <KpiCard
                  label="Assessment completati"
                  value={overview.totals.assessment_leads}
                  hint="Utenti con test completato"
                />
                <KpiCard
                  label="Lead magnet"
                  value={overview.totals.lead_magnet_leads}
                  hint="Email da box e pagine cert/topic"
                />
                <KpiCard
                  label="Lead visibili"
                  value={filteredLeads.length}
                  hint="Dopo filtri e ricerca"
                />
              </div>

              <div style={styles.insightGrid}>
                <RankingCard title="Top certificazioni" items={overview.topCerts} keyName="cert_slug" />
                <RankingCard title="Top topic" items={overview.topTopics} keyName="topic_slug" />
                <div style={styles.insightCard}>
                  <h3 style={styles.cardTitle}>Lettura veloce</h3>
                  <p style={styles.note}>
                    CCNA e networking stanno guidando la raccolta lead. Questo è un segnale
                    concreto: la parte networking merita priorità su contenuti, quiz e CTA Premium.
                  </p>
                </div>
              </div>
            </>
          )}

          <div style={styles.tableCard}>
            <div style={styles.tableHeader}>
              <div>
                <h2 style={styles.sectionTitle}>Ultimi lead</h2>
                <p style={styles.sectionHint}>
                  Qui vedi chi entra nel funnel, da dove arriva e se completa assessment.
                </p>
              </div>

              <div style={styles.filters}>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cerca email, cert, topic..."
                  style={styles.input}
                />

                <select
                  value={modeFilter}
                  onChange={(e) => setModeFilter(e.target.value as any)}
                  style={styles.select}
                >
                  <option value="all">Tutti</option>
                  <option value="assessment">Assessment</option>
                  <option value="lead_magnet">Lead magnet</option>
                </select>
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
                        {lead.assessment_score !== null && lead.assessment_score !== undefined ? (
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
        </section>
      )}

      {tab === "feedback" && (
        <div style={styles.panel}>
          <AdminFeedbackClient />
        </div>
      )}
    </div>
  );
}

function KpiCard({ label, value, hint }: { label: string; value: number; hint: string }) {
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

function ScoreBadge({ score }: { score: number }) {
  const style =
    score >= 80 ? styles.scoreGood : score >= 50 ? styles.scoreMid : styles.scoreLow;

  return <span style={style}>{score}%</span>;
}

function Th({ children }: { children: React.ReactNode }) {
  return <th style={styles.th}>{children}</th>;
}

function Td({ children, strong = false }: { children: React.ReactNode; strong?: boolean }) {
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

function formatDate(value: string) {
  if (!value) return "-";
  return new Date(value).toLocaleString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: 1400,
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
    padding: "8px 0",
    borderBottom: "1px solid #f1f5f9",
  },
  rankName: {
    color: "#334155",
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
  filters: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
  input: {
    border: "1px solid #cbd5e1",
    borderRadius: 10,
    padding: "10px 12px",
    minWidth: 240,
  },
  select: {
    border: "1px solid #cbd5e1",
    borderRadius: 10,
    padding: "10px 12px",
    background: "#fff",
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