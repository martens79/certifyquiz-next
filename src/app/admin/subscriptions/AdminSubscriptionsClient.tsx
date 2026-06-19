"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

type Subscription = {
  id: string;
  email: string;
  status: "active" | "trialing" | "past_due" | "canceled" | "unpaid";
  amount: number;
  currency: string;
  interval: string;
  currentPeriodEnd: string;
  trialEnd: string | null;
  createdAt: string;
};

export default function AdminSubscriptionsClient() {
  const { token } = useAuth();
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  async function load() {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/backend/admin/subscriptions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setSubs(json.subscriptions ?? []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Errore caricamento abbonamenti");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const filtered = useMemo(
    () => subs.filter((s) => statusFilter === "all" || s.status === statusFilter),
    [subs, statusFilter]
  );

  const kpis = useMemo(() => {
    const active = subs.filter((s) => s.status === "active").length;
    const trialing = subs.filter((s) => s.status === "trialing").length;
    const pastDue = subs.filter((s) => s.status === "past_due").length;
    const canceled = subs.filter((s) => s.status === "canceled").length;
    const mrr = subs
      .filter((s) => s.status === "active")
      .reduce((sum, s) => sum + s.amount, 0);

    return { active, trialing, pastDue, canceled, mrr };
  }, [subs]);

  return (
    <div style={styles.wrap}>
      {error && <div style={styles.errorBox}>{error}</div>}

      <div style={styles.kpiGrid}>
        <KpiCard label="MRR attivo" value={`€${kpis.mrr.toFixed(2)}`} />
        <KpiCard label="Attivi" value={kpis.active} />
        <KpiCard label="In trial" value={kpis.trialing} />
        <KpiCard label="Pagamento fallito" value={kpis.pastDue} />
        <KpiCard label="Cancellati" value={kpis.canceled} />
      </div>

      <div style={styles.toolbar}>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={styles.select}
        >
          <option value="all">Tutti gli stati</option>
          <option value="active">Active</option>
          <option value="trialing">Trialing</option>
          <option value="past_due">Past due</option>
          <option value="canceled">Canceled</option>
        </select>

        <button onClick={load} disabled={loading} style={styles.refreshButton}>
          {loading ? "Carico..." : "Ricarica"}
        </button>
      </div>

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Stato</th>
              <th style={styles.th}>Importo</th>
              <th style={styles.th}>Trial fino a</th>
              <th style={styles.th}>Rinnovo</th>
              <th style={styles.th}>Creato</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} style={styles.row}>
                <td style={styles.tdStrong}>{s.email}</td>
                <td style={styles.td}>
                  <StatusBadge status={s.status} />
                </td>
                <td style={styles.td}>
                  €{s.amount}/{s.interval}
                </td>
                <td style={styles.td}>
                  {s.trialEnd ? formatDate(s.trialEnd) : "-"}
                </td>
                <td style={styles.td}>{formatDate(s.currentPeriodEnd)}</td>
                <td style={styles.td}>{formatDate(s.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!loading && filtered.length === 0 && (
        <div style={styles.empty}>Nessun abbonamento trovato.</div>
      )}
    </div>
  );
}

function KpiCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={styles.kpiCard}>
      <div style={styles.kpiLabel}>{label}</div>
      <div style={styles.kpiValue}>{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, CSSProperties> = {
    active: { background: "#dcfce7", color: "#166534", border: "1px solid #bbf7d0" },
    trialing: { background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe" },
    past_due: { background: "#fef3c7", color: "#92400e", border: "1px solid #fde68a" },
    canceled: { background: "#fee2e2", color: "#991b1b", border: "1px solid #fecaca" },
    unpaid: { background: "#fee2e2", color: "#991b1b", border: "1px solid #fecaca" },
  };

  return (
    <span style={{ ...styles.badge, ...(map[status] ?? {}) }}>{status}</span>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

const styles: Record<string, CSSProperties> = {
  wrap: { padding: 18 },
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
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 14,
    marginBottom: 18,
  },
  kpiCard: {
    border: "1px solid #e2e8f0",
    borderRadius: 18,
    padding: 16,
    background: "#fff",
    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.04)",
  },
  kpiLabel: { color: "#64748b", fontSize: 13, fontWeight: 800 },
  kpiValue: { fontSize: 28, fontWeight: 950, marginTop: 6 },
  toolbar: {
    display: "flex",
    gap: 10,
    marginBottom: 14,
    flexWrap: "wrap",
  },
  select: {
    border: "1px solid #cbd5e1",
    borderRadius: 12,
    padding: "10px 12px",
    background: "#fff",
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
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 14 },
  th: {
    textAlign: "left",
    padding: "13px 14px",
    background: "#f8fafc",
    color: "#475569",
    fontSize: 12,
    textTransform: "uppercase",
    borderBottom: "1px solid #e2e8f0",
    whiteSpace: "nowrap",
  },
  row: { borderBottom: "1px solid #f1f5f9" },
  td: { padding: "13px 14px", color: "#334155", whiteSpace: "nowrap" },
  tdStrong: {
    padding: "13px 14px",
    color: "#0f172a",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  badge: {
    padding: "4px 9px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
  },
  empty: { padding: 22, color: "#64748b" },
};