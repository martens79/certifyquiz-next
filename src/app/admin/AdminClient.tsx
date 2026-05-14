"use client";

import { useEffect, useState } from "react";
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

  async function loadDashboard() {
    if (!token) return;
    setLoading(true);

    const [overviewRes, leadsRes] = await Promise.all([
      fetch("/api/backend/admin/leads-overview", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch("/api/backend/admin/leads", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    const overviewJson = await overviewRes.json();
    const leadsJson = await leadsRes.json();

    setOverview(overviewJson);
    setLeads(leadsJson.leads ?? []);
    setLoading(false);
  }

  useEffect(() => {
    if (token && tab === "dashboard") loadDashboard();
  }, [token, tab]);

  if (!user) return <div style={{ padding: 20 }}>Devi essere loggato.</div>;
  if (!isAdmin) return <div style={{ padding: 20 }}>Accesso negato.</div>;

  return (
    <div style={{ padding: 20, maxWidth: 1300, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 20 }}>
        CertifyQuiz Admin
      </h1>

      <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
        <button onClick={() => setTab("dashboard")}>Dashboard</button>
        <button onClick={() => setTab("feedback")}>Feedback</button>
        {tab === "dashboard" && (
          <button onClick={loadDashboard} disabled={loading}>
            {loading ? "Carico..." : "Ricarica"}
          </button>
        )}
      </div>

      {tab === "dashboard" && (
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>
            Leads & Assessment Funnel
          </h2>

          {overview && (
            <>
              <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
                <Card title="Totale lead" value={overview.totals.total_leads} />
                <Card title="Assessment" value={overview.totals.assessment_leads} />
                <Card title="Lead magnet" value={overview.totals.lead_magnet_leads} />
              </div>

              <div style={{ display: "flex", gap: 20, marginBottom: 24 }}>
                <Box title="Top certificazioni">
                  {overview.topCerts.map((c) => (
                    <div key={c.cert_slug}>
                      {c.cert_slug}: <strong>{c.total}</strong>
                    </div>
                  ))}
                </Box>

                <Box title="Top topic">
                  {overview.topTopics.map((t) => (
                    <div key={t.topic_slug}>
                      {t.topic_slug}: <strong>{t.total}</strong>
                    </div>
                  ))}
                </Box>
              </div>
            </>
          )}

          <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>
            Ultimi lead
          </h3>

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
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
              {leads.map((lead) => (
                <tr key={lead.id} style={{ borderTop: "1px solid #ddd" }}>
                  <Td>{lead.email}</Td>
                  <Td>{lead.cert_slug || "-"}</Td>
                  <Td>{lead.topic_slug || "-"}</Td>
                  <Td>{lead.mode || "-"}</Td>
                  <Td>{lead.assessment_score ?? "-"}</Td>
                  <Td>{lead.lang || "-"}</Td>
                  <Td>{new Date(lead.created_at).toLocaleString("it-IT")}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "feedback" && <AdminFeedbackClient />}
    </div>
  );
}

function Card({ title, value }: { title: string; value: number }) {
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 10, padding: 16, minWidth: 170 }}>
      <div style={{ fontSize: 13, color: "#666" }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 800 }}>{value}</div>
    </div>
  );
}

function Box({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 10, padding: 16, minWidth: 260 }}>
      <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>{title}</h3>
      {children}
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th style={{ textAlign: "left", padding: 8 }}>{children}</th>;
}

function Td({ children }: { children: React.ReactNode }) {
  return <td style={{ padding: 8 }}>{children}</td>;
}