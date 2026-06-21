"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

type FeedbackItem = {
  id: number;
  question_id: number;
  user_id: number;
  topic_id: number | null;
  type: string;
  description: string | null;
  created_at: string;
  archived: 0 | 1;
  resolved: 0 | 1;
  resolved_at: string | null;
  resolved_by: number | null;
};

type ApiResp = {
  page: number;
  limit: number;
  total: number;
  pages: number;
  items: FeedbackItem[];
};

function buildQS(params: Record<string, any>) {
  const u = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    u.set(k, String(v));
  }
  return u.toString();
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function TypeBadge({ type }: { type: string }) {
  const label = type || "altro";
  const palette =
    label === "error" || label === "bug"
      ? S.badgeBad
      : label === "suggestion" || label === "suggerimento"
      ? S.badgeInfo
      : S.badgeNeutral;
  return <span style={palette}>{label}</span>;
}

function StatusBadges({ item }: { item: FeedbackItem }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {item.resolved ? (
        <span style={S.badgeGood}>Risolto</span>
      ) : (
        <span style={S.badgeWarn}>Aperto</span>
      )}
      {item.archived ? <span style={S.badgeNeutral}>Archiviato</span> : null}
    </div>
  );
}

export default function AdminFeedbackClient() {
  const { user, isAdmin, token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ApiResp | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [archived, setArchived] = useState<"" | "0" | "1">("0");
  const [resolved, setResolved] = useState<"" | "0" | "1">("");
  const [q, setQ] = useState("");

  const queryString = useMemo(
    () => buildQS({ page, limit, archived, resolved, q }),
    [page, limit, archived, resolved, q]
  );

  async function load() {
    if (!token) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/backend/admin/feedback?${queryString}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = (await res.json()) as ApiResp;
      setData(json);
    } catch (e: any) {
      setError(e?.message || "Errore caricamento");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  async function patchArchive(id: number, archivedVal: boolean) {
    if (!token) return;
    setBusyId(id);
    try {
      await fetch(`/api/backend/admin/feedback/${id}/archive`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ archived: archivedVal }),
      });
      await load();
    } finally {
      setBusyId(null);
    }
  }

  async function patchResolve(id: number, resolvedVal: boolean) {
    if (!token) return;
    setBusyId(id);
    try {
      await fetch(`/api/backend/admin/feedback/${id}/resolve`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ resolved: resolvedVal }),
      });
      await load();
    } finally {
      setBusyId(null);
    }
  }

  useEffect(() => {
    if (token) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, queryString]);

  // resetta la pagina quando cambiano i filtri (non quando cambia solo `page`)
  useEffect(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [archived, resolved, q]);

  if (!user) return <div style={S.stateBox}>Devi essere loggato.</div>;
  if (!isAdmin) return <div style={S.stateBox}>Accesso negato (solo admin).</div>;

  const items = data?.items ?? [];
  const totalPages = data?.pages ?? 1;

  return (
    <div style={S.wrap}>
      <div style={S.headerRow}>
        <div>
          <h2 style={S.title}>Feedback</h2>
          <p style={S.subtitle}>
            Segnalazioni degli utenti sulle domande dei quiz.
            {data ? ` ${data.total} totali.` : ""}
          </p>
        </div>
        <div style={S.headerActions}>
          <input
            placeholder="Cerca nel testo..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={S.input}
          />
          <select value={resolved} onChange={(e) => setResolved(e.target.value as any)} style={S.input}>
            <option value="">Stato: tutti</option>
            <option value="0">Da risolvere</option>
            <option value="1">Risolti</option>
          </select>
          <select value={archived} onChange={(e) => setArchived(e.target.value as any)} style={S.input}>
            <option value="">Archiviati: tutti</option>
            <option value="0">Non archiviati</option>
            <option value="1">Archiviati</option>
          </select>
          <button onClick={load} disabled={loading} style={S.secondaryButton}>
            {loading ? "Carico..." : "Ricarica"}
          </button>
        </div>
      </div>

      {error && <div style={S.errorBox}>{error}</div>}

      <div style={S.listCard}>
        {items.map((it) => (
          <div key={it.id} style={{ ...S.item, opacity: it.archived ? 0.6 : 1 }}>
            <div style={S.itemHeader}>
              <div style={S.itemMeta}>
                <span style={S.idTag}>#{it.id}</span>
                <TypeBadge type={it.type} />
                <span style={S.muted}>Domanda {it.question_id}</span>
                <span style={S.muted}>· Utente {it.user_id}</span>
                <span style={S.muted}>· {formatDate(it.created_at)}</span>
              </div>
              <StatusBadges item={it} />
            </div>

            <p style={S.description}>{it.description || <span style={S.muted}>Nessuna descrizione.</span>}</p>

            <div style={S.itemActions}>
              <button
                onClick={() => patchResolve(it.id, !it.resolved)}
                disabled={busyId === it.id}
                style={it.resolved ? S.secondaryButton : S.successButton}
              >
                {it.resolved ? "Riapri" : "Segna come risolto"}
              </button>

              <button
                onClick={() => patchArchive(it.id, !it.archived)}
                disabled={busyId === it.id}
                style={S.secondaryButton}
              >
                {it.archived ? "Ripristina" : "Archivia"}
              </button>
            </div>
          </div>
        ))}

        {!loading && items.length === 0 && (
          <div style={S.empty}>Nessun feedback trovato con questi filtri.</div>
        )}
      </div>

      {data && totalPages > 1 && (
        <div style={S.pagination}>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            style={S.secondaryButton}
          >
            ← Precedente
          </button>
          <span style={S.muted}>
            Pagina {page} di {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            style={S.secondaryButton}
          >
            Successiva →
          </button>
        </div>
      )}
    </div>
  );
}

const S: Record<string, React.CSSProperties> = {
  wrap: { padding: 20 },

  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: 14,
    marginBottom: 18,
  },

  title: { fontSize: 22, fontWeight: 900, margin: 0, color: "#0f172a" },
  subtitle: { color: "#64748b", margin: "6px 0 0", fontSize: 14 },

  headerActions: { display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" },

  input: {
    border: "1px solid #cbd5e1",
    borderRadius: 12,
    padding: "10px 12px",
    background: "#fff",
    color: "#0f172a",
    fontSize: 14,
  },

  secondaryButton: {
    border: "1px solid #e2e8f0",
    background: "#fff",
    color: "#334155",
    padding: "9px 14px",
    borderRadius: 12,
    fontWeight: 800,
    cursor: "pointer",
    whiteSpace: "nowrap",
    fontSize: 13,
  },

  successButton: {
    border: "1px solid #bbf7d0",
    background: "#f0fdf4",
    color: "#166534",
    padding: "9px 14px",
    borderRadius: 12,
    fontWeight: 800,
    cursor: "pointer",
    whiteSpace: "nowrap",
    fontSize: 13,
  },

  errorBox: {
    border: "1px solid #fecaca",
    background: "#fef2f2",
    color: "#991b1b",
    padding: "10px 14px",
    borderRadius: 12,
    marginBottom: 14,
    fontSize: 14,
  },

  listCard: {
    border: "1px solid #e2e8f0",
    borderRadius: 18,
    background: "#fff",
    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.04)",
    overflow: "hidden",
  },

  item: {
    padding: 16,
    borderBottom: "1px solid #f1f5f9",
  },

  itemHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 8,
  },

  itemMeta: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
    fontSize: 13,
  },

  idTag: {
    fontFamily: "monospace",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    color: "#475569",
    padding: "2px 7px",
    borderRadius: 8,
    fontSize: 12,
  },

  description: {
    margin: "0 0 12px",
    color: "#334155",
    fontSize: 14,
    lineHeight: 1.5,
  },

  itemActions: { display: "flex", gap: 10, flexWrap: "wrap" },

  muted: { color: "#94a3b8", fontSize: 13 },

  empty: { padding: 32, textAlign: "center", color: "#64748b" },

  stateBox: { padding: 24, color: "#334155" },

  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    marginTop: 16,
  },

  badgeGood: {
    background: "#dcfce7",
    color: "#166534",
    border: "1px solid #bbf7d0",
    padding: "3px 8px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
  },
  badgeWarn: {
    background: "#fef9c3",
    color: "#854d0e",
    border: "1px solid #fde68a",
    padding: "3px 8px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
  },
  badgeInfo: {
    background: "#eff6ff",
    color: "#1d4ed8",
    border: "1px solid #bfdbfe",
    padding: "3px 8px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
  },
  badgeBad: {
    background: "#fee2e2",
    color: "#991b1b",
    border: "1px solid #fecaca",
    padding: "3px 8px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
  },
  badgeNeutral: {
    background: "#f8fafc",
    color: "#64748b",
    border: "1px solid #e2e8f0",
    padding: "3px 8px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
  },
};