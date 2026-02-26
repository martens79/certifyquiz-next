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

export default function AdminFeedbackClient() {
  const { user, isAdmin, token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ApiResp | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [archived, setArchived] = useState<"" | "0" | "1">("0");
  const [resolved, setResolved] = useState<"" | "0" | "1">("");
  const [q, setQ] = useState("");

  const queryString = useMemo(
    () =>
      buildQS({
        page,
        limit,
        archived,
        resolved,
        q,
      }),
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
    await fetch(`/api/backend/admin/feedback/${id}/archive`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ archived: archivedVal }),
    });
    await load();
  }

  async function patchResolve(id: number, resolvedVal: boolean) {
    if (!token) return;
    await fetch(`/api/backend/admin/feedback/${id}/resolve`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ resolved: resolvedVal }),
    });
    await load();
  }

  useEffect(() => {
    if (token) load();
  }, [token, queryString]);

  if (!user) return <div style={{ padding: 20 }}>Devi essere loggato.</div>;
  if (!isAdmin) return <div style={{ padding: 20 }}>Accesso negato (solo admin).</div>;

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20 }}>
        Admin — Feedback
      </h1>

      {/* FILTRI */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <select value={archived} onChange={(e) => setArchived(e.target.value as any)}>
          <option value="">Archived: tutti</option>
          <option value="0">Archived: NO</option>
          <option value="1">Archived: SI</option>
        </select>

        <select value={resolved} onChange={(e) => setResolved(e.target.value as any)}>
          <option value="">Resolved: tutti</option>
          <option value="0">Resolved: NO</option>
          <option value="1">Resolved: SI</option>
        </select>

        <input
          placeholder="Cerca testo..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <button onClick={load} disabled={loading}>
          {loading ? "Carico..." : "Ricarica"}
        </button>
      </div>

      {error && <div style={{ color: "red" }}>{error}</div>}

      <div style={{ border: "1px solid #ddd", borderRadius: 8 }}>
        {(data?.items ?? []).map((it) => (
          <div
            key={it.id}
            style={{
              padding: 15,
              borderBottom: "1px solid #eee",
              opacity: it.archived ? 0.6 : 1,
            }}
          >
            <div style={{ fontWeight: 700 }}>
              #{it.id} — Q:{it.question_id} — User:{it.user_id}
            </div>

            <div style={{ marginTop: 5 }}>{it.description}</div>

            <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
              <button onClick={() => patchResolve(it.id, !it.resolved)}>
                {it.resolved ? "Unresolve" : "Resolve"}
              </button>

              <button onClick={() => patchArchive(it.id, !it.archived)}>
                {it.archived ? "Unarchive" : "Archive"}
              </button>
            </div>
          </div>
        ))}

        {!loading && (data?.items?.length ?? 0) === 0 && (
          <div style={{ padding: 20 }}>Nessun feedback.</div>
        )}
      </div>
    </div>
  );
}