"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

type Organization = {
  id: number;
  name: string;
  contact_email: string | null;
  plan: string | null;
  seats: number | null;
  stripe_customer_id: string | null;
  status: string | null;
  notes: string | null;
  created_at: string;
  member_count?: number;
};

type Member = {
  id: number;
  username: string;
  email: string;
  premium: 0 | 1;
  premium_status: string | null;
  is_org_admin: 0 | 1;
};

type NewOrgForm = {
  name: string;
  contact_email: string;
  plan: string;
  seats: string;
  notes: string;
};

const EMPTY_NEW_ORG: NewOrgForm = {
  name: "",
  contact_email: "",
  plan: "team_starter",
  seats: "",
  notes: "",
};

const PLAN_LABELS: Record<string, string> = {
  team_starter: "Team Starter",
  team_pro: "Team Pro",
  enterprise: "Enterprise",
};

function StatusBadge({ status }: { status: string | null }) {
  const s = status || "active";
  const style =
    s === "active"
      ? S.badgeGood
      : s === "trial"
      ? S.badgeInfo
      : s === "cancelled" || s === "canceled"
      ? S.badgeBad
      : S.badgeNeutral;

  const label =
    s === "active" ? "Attiva" : s === "trial" ? "Prova" : s === "cancelled" || s === "canceled" ? "Cessata" : s;

  return <span style={style}>{label}</span>;
}

function PremiumBadge({ premium }: { premium: 0 | 1 }) {
  return premium ? (
    <span style={S.badgeGood}>Premium ✓</span>
  ) : (
    <span style={S.badgeNeutral}>Free</span>
  );
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function AdminOrganizationsClient() {
  const { token } = useAuth();

  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [showNewForm, setShowNewForm] = useState(false);
  const [newOrg, setNewOrg] = useState<NewOrgForm>(EMPTY_NEW_ORG);
  const [creating, setCreating] = useState(false);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detailOrg, setDetailOrg] = useState<Organization | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);

  const [editForm, setEditForm] = useState<Partial<Organization>>({});
  const [savingEdit, setSavingEdit] = useState(false);

  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberIsAdmin, setNewMemberIsAdmin] = useState(false);
  const [newMemberPremium, setNewMemberPremium] = useState(true);
  const [addingMember, setAddingMember] = useState(false);
  const [memberError, setMemberError] = useState<string | null>(null);

  const filteredOrgs = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return orgs;
    return orgs.filter(
      (o) =>
        o.name.toLowerCase().includes(query) ||
        (o.contact_email || "").toLowerCase().includes(query) ||
        (o.plan || "").toLowerCase().includes(query)
    );
  }, [orgs, q]);

  async function loadOrgs() {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/backend/admin/organizations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setOrgs(json.organizations ?? []);
    } catch (e: any) {
      setError(e?.message || "Errore caricamento aziende");
    } finally {
      setLoading(false);
    }
  }

  async function loadDetail(id: number) {
    if (!token) return;
    setDetailLoading(true);
    setMemberError(null);
    try {
      const res = await fetch(`/api/backend/admin/organizations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setDetailOrg(json.organization);
      setEditForm(json.organization);
      setMembers(json.members ?? []);
    } catch (e: any) {
      setError(e?.message || "Errore caricamento dettaglio");
    } finally {
      setDetailLoading(false);
    }
  }

  useEffect(() => {
    if (token) loadOrgs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (selectedId != null) loadDetail(selectedId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  async function createOrganization() {
    if (!token || creating) return;
    if (!newOrg.name.trim()) {
      setError("Il nome dell'azienda è obbligatorio.");
      return;
    }
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/backend/admin/organizations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newOrg.name.trim(),
          contact_email: newOrg.contact_email.trim() || null,
          plan: newOrg.plan || null,
          seats: newOrg.seats ? Number(newOrg.seats) : null,
          notes: newOrg.notes.trim() || null,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setShowNewForm(false);
      setNewOrg(EMPTY_NEW_ORG);
      await loadOrgs();
      if (json.id) setSelectedId(json.id);
    } catch (e: any) {
      setError(e?.message || "Errore creazione azienda");
    } finally {
      setCreating(false);
    }
  }

  async function saveEdit() {
    if (!token || !detailOrg || savingEdit) return;
    setSavingEdit(true);
    try {
      const res = await fetch(`/api/backend/admin/organizations/${detailOrg.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editForm.name,
          contact_email: editForm.contact_email,
          plan: editForm.plan,
          seats: editForm.seats,
          status: editForm.status,
          notes: editForm.notes,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await loadOrgs();
      await loadDetail(detailOrg.id);
    } catch (e: any) {
      setError(e?.message || "Errore salvataggio");
    } finally {
      setSavingEdit(false);
    }
  }

  async function addMember() {
    if (!token || !detailOrg || addingMember) return;
    const email = newMemberEmail.trim().toLowerCase();
    if (!email) {
      setMemberError("Inserisci l'email dell'utente.");
      return;
    }
    setAddingMember(true);
    setMemberError(null);
    try {
      const res = await fetch(`/api/backend/admin/organizations/${detailOrg.id}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email,
          is_org_admin: newMemberIsAdmin,
          grant_premium: newMemberPremium,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        if (json.error === "USER_NOT_FOUND") {
          throw new Error("Nessun utente registrato con questa email. Deve prima creare un account sul sito.");
        }
        throw new Error(json.error || `HTTP ${res.status}`);
      }
      setNewMemberEmail("");
      setNewMemberIsAdmin(false);
      setNewMemberPremium(true);
      await loadDetail(detailOrg.id);
      await loadOrgs();
    } catch (e: any) {
      setMemberError(e?.message || "Errore aggiunta membro");
    } finally {
      setAddingMember(false);
    }
  }

  async function removeMember(userId: number) {
    if (!token || !detailOrg) return;
    const revoke = window.confirm(
      "Rimuovere questa persona dall'azienda e disattivare il suo Premium?\n\nPremi Annulla per rimuoverla mantenendo Premium attivo (es. se ha un proprio abbonamento separato)."
    );
    // window.confirm: OK = true (revoke premium), Annulla = false (keep premium)
    try {
      const res = await fetch(
        `/api/backend/admin/organizations/${detailOrg.id}/members/${userId}?revokePremium=${revoke ? "true" : "false"}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await loadDetail(detailOrg.id);
      await loadOrgs();
    } catch (e: any) {
      setError(e?.message || "Errore rimozione membro");
    }
  }

  return (
    <div style={S.wrap}>
      <div style={S.headerRow}>
        <div>
          <h2 style={S.title}>Aziende</h2>
          <p style={S.subtitle}>Clienti del piano Team — accessi, seat e stato abbonamento.</p>
        </div>
        <div style={S.headerActions}>
          <input
            placeholder="Cerca azienda, email, piano..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={S.input}
          />
          <button onClick={loadOrgs} disabled={loading} style={S.secondaryButton}>
            {loading ? "Carico..." : "Ricarica"}
          </button>
          <button onClick={() => setShowNewForm((v) => !v)} style={S.primaryButton}>
            {showNewForm ? "Annulla" : "+ Nuova azienda"}
          </button>
        </div>
      </div>

      {error && <div style={S.errorBox}>{error}</div>}

      {showNewForm && (
        <div style={S.formCard}>
          <div style={S.formGrid}>
            <label style={S.label}>
              Nome azienda *
              <input
                style={S.input}
                value={newOrg.name}
                onChange={(e) => setNewOrg((f) => ({ ...f, name: e.target.value }))}
                placeholder="Es. Acme Srl"
              />
            </label>
            <label style={S.label}>
              Email referente
              <input
                style={S.input}
                value={newOrg.contact_email}
                onChange={(e) => setNewOrg((f) => ({ ...f, contact_email: e.target.value }))}
                placeholder="referente@azienda.it"
              />
            </label>
            <label style={S.label}>
              Piano
              <select
                style={S.input}
                value={newOrg.plan}
                onChange={(e) => setNewOrg((f) => ({ ...f, plan: e.target.value }))}
              >
                <option value="team_starter">Team Starter</option>
                <option value="team_pro">Team Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </label>
            <label style={S.label}>
              Seat acquistati
              <input
                style={S.input}
                type="number"
                min={1}
                value={newOrg.seats}
                onChange={(e) => setNewOrg((f) => ({ ...f, seats: e.target.value }))}
                placeholder="10"
              />
            </label>
            <label style={{ ...S.label, gridColumn: "1 / -1" }}>
              Note
              <textarea
                style={{ ...S.input, minHeight: 60 }}
                value={newOrg.notes}
                onChange={(e) => setNewOrg((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Appunti liberi: come ti ha contattato, accordi particolari..."
              />
            </label>
          </div>
          <div style={S.formActions}>
            <button onClick={createOrganization} disabled={creating} style={S.primaryButton}>
              {creating ? "Creo..." : "Crea azienda"}
            </button>
          </div>
        </div>
      )}

      <div style={S.tableCard}>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>Azienda</th>
              <th style={S.th}>Piano</th>
              <th style={S.th}>Membri</th>
              <th style={S.th}>Stato</th>
              <th style={S.th}>Creata</th>
              <th style={S.th} />
            </tr>
          </thead>
          <tbody>
            {filteredOrgs.map((o) => (
              <tr
                key={o.id}
                style={{
                  ...S.row,
                  background: selectedId === o.id ? "#f8fafc" : "transparent",
                }}
              >
                <td style={S.tdStrong}>
                  {o.name}
                  {o.contact_email && <div style={S.subCell}>{o.contact_email}</div>}
                </td>
                <td style={S.td}>{o.plan ? PLAN_LABELS[o.plan] || o.plan : "-"}</td>
                <td style={S.td}>
                  {o.member_count ?? 0}
                  {o.seats ? ` / ${o.seats}` : ""}
                </td>
                <td style={S.td}>
                  <StatusBadge status={o.status} />
                </td>
                <td style={S.td}>{formatDate(o.created_at)}</td>
                <td style={S.td}>
                  <button onClick={() => setSelectedId(o.id)} style={S.linkButton}>
                    Gestisci →
                  </button>
                </td>
              </tr>
            ))}

            {!loading && filteredOrgs.length === 0 && (
              <tr>
                <td style={S.empty} colSpan={6}>
                  Nessuna azienda ancora. Creane una con "+ Nuova azienda".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedId != null && (
        <div style={S.detailCard}>
          <div style={S.detailHeader}>
            <h3 style={S.detailTitle}>
              {detailOrg ? detailOrg.name : "Carico..."}
            </h3>
            <button onClick={() => setSelectedId(null)} style={S.secondaryButton}>
              Chiudi
            </button>
          </div>

          {detailLoading && <div style={S.muted}>Carico dettaglio...</div>}

          {!detailLoading && detailOrg && (
            <>
              <div style={S.formGrid}>
                <label style={S.label}>
                  Nome azienda
                  <input
                    style={S.input}
                    value={editForm.name ?? ""}
                    onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                  />
                </label>
                <label style={S.label}>
                  Email referente
                  <input
                    style={S.input}
                    value={editForm.contact_email ?? ""}
                    onChange={(e) => setEditForm((f) => ({ ...f, contact_email: e.target.value }))}
                  />
                </label>
                <label style={S.label}>
                  Piano
                  <select
                    style={S.input}
                    value={editForm.plan ?? ""}
                    onChange={(e) => setEditForm((f) => ({ ...f, plan: e.target.value }))}
                  >
                    <option value="team_starter">Team Starter</option>
                    <option value="team_pro">Team Pro</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </label>
                <label style={S.label}>
                  Seat acquistati
                  <input
                    style={S.input}
                    type="number"
                    min={1}
                    value={editForm.seats ?? ""}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, seats: e.target.value ? Number(e.target.value) : null }))
                    }
                  />
                </label>
                <label style={S.label}>
                  Stato
                  <select
                    style={S.input}
                    value={editForm.status ?? "active"}
                    onChange={(e) => setEditForm((f) => ({ ...f, status: e.target.value }))}
                  >
                    <option value="active">Attiva</option>
                    <option value="trial">Prova</option>
                    <option value="cancelled">Cessata</option>
                  </select>
                </label>
                {detailOrg.stripe_customer_id && (
                  <div style={S.label}>
                    Stripe customer
                    <div style={S.staticValue}>{detailOrg.stripe_customer_id}</div>
                  </div>
                )}
                <label style={{ ...S.label, gridColumn: "1 / -1" }}>
                  Note
                  <textarea
                    style={{ ...S.input, minHeight: 60 }}
                    value={editForm.notes ?? ""}
                    onChange={(e) => setEditForm((f) => ({ ...f, notes: e.target.value }))}
                  />
                </label>
              </div>
              <div style={S.formActions}>
                <button onClick={saveEdit} disabled={savingEdit} style={S.primaryButton}>
                  {savingEdit ? "Salvo..." : "Salva modifiche"}
                </button>
              </div>

              <div style={S.membersSection}>
                <h4 style={S.membersTitle}>
                  Membri ({members.length}
                  {detailOrg.seats ? ` / ${detailOrg.seats} seat` : ""})
                </h4>

                <div style={S.tableCard}>
                  <table style={S.table}>
                    <thead>
                      <tr>
                        <th style={S.th}>Utente</th>
                        <th style={S.th}>Email</th>
                        <th style={S.th}>Ruolo</th>
                        <th style={S.th}>Premium</th>
                        <th style={S.th} />
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((m) => (
                        <tr key={m.id} style={S.row}>
                          <td style={S.tdStrong}>{m.username}</td>
                          <td style={S.td}>{m.email}</td>
                          <td style={S.td}>
                            {m.is_org_admin ? (
                              <span style={S.badgeInfo}>Referente</span>
                            ) : (
                              <span style={S.muted}>Membro</span>
                            )}
                          </td>
                          <td style={S.td}>
                            <PremiumBadge premium={m.premium} />
                          </td>
                          <td style={S.td}>
                            <button onClick={() => removeMember(m.id)} style={S.dangerLink}>
                              Rimuovi
                            </button>
                          </td>
                        </tr>
                      ))}
                      {members.length === 0 && (
                        <tr>
                          <td style={S.empty} colSpan={5}>
                            Nessun membro ancora.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div style={S.addMemberRow}>
                  <input
                    style={S.input}
                    placeholder="Email utente già registrato sul sito"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                  />
                  <label style={S.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={newMemberIsAdmin}
                      onChange={(e) => setNewMemberIsAdmin(e.target.checked)}
                    />
                    È il referente
                  </label>
                  <label style={S.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={newMemberPremium}
                      onChange={(e) => setNewMemberPremium(e.target.checked)}
                    />
                    Attiva Premium
                  </label>
                  <button onClick={addMember} disabled={addingMember} style={S.primaryButton}>
                    {addingMember ? "Aggiungo..." : "Aggiungi membro"}
                  </button>
                </div>
                {memberError && <div style={S.errorBox}>{memberError}</div>}
                <p style={S.hint}>
                  La persona deve essersi già registrata normalmente sul sito con questa email — qui la colleghi
                  all'azienda e (facoltativo) le attivi Premium.
                </p>
              </div>
            </>
          )}
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
    width: "100%",
  },

  primaryButton: {
    border: "1px solid #0f172a",
    background: "#0f172a",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: 12,
    fontWeight: 800,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  secondaryButton: {
    border: "1px solid #e2e8f0",
    background: "#fff",
    color: "#334155",
    padding: "10px 14px",
    borderRadius: 12,
    fontWeight: 800,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  linkButton: {
    border: "none",
    background: "transparent",
    color: "#2563eb",
    fontWeight: 700,
    cursor: "pointer",
    padding: 0,
  },

  dangerLink: {
    border: "none",
    background: "transparent",
    color: "#dc2626",
    fontWeight: 700,
    cursor: "pointer",
    padding: 0,
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

  formCard: {
    border: "1px solid #e2e8f0",
    borderRadius: 18,
    background: "#fff",
    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.04)",
    padding: 18,
    marginBottom: 18,
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 14,
  },

  label: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    fontSize: 13,
    fontWeight: 700,
    color: "#334155",
  },

  staticValue: {
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    padding: "10px 12px",
    background: "#f8fafc",
    color: "#64748b",
    fontSize: 13,
    fontFamily: "monospace",
  },

  formActions: { display: "flex", justifyContent: "flex-end", marginTop: 14 },

  tableCard: {
    border: "1px solid #e2e8f0",
    borderRadius: 18,
    background: "#fff",
    overflow: "hidden",
    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.04)",
  },

  table: { width: "100%", borderCollapse: "collapse", fontSize: 14 },

  th: {
    textAlign: "left",
    padding: "12px 14px",
    background: "#f8fafc",
    color: "#475569",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    borderBottom: "1px solid #e2e8f0",
    whiteSpace: "nowrap",
  },

  row: { borderBottom: "1px solid #f1f5f9" },

  td: { padding: "12px 14px", color: "#334155" },
  tdStrong: { padding: "12px 14px", color: "#0f172a", fontWeight: 700 },
  subCell: { color: "#94a3b8", fontSize: 12, fontWeight: 400, marginTop: 2 },

  empty: { padding: 22, color: "#64748b", textAlign: "center" },
  muted: { color: "#94a3b8", fontSize: 13 },
  hint: { color: "#94a3b8", fontSize: 12, marginTop: 10 },

  badgeGood: {
    background: "#dcfce7",
    color: "#166534",
    border: "1px solid #bbf7d0",
    padding: "4px 9px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
  },
  badgeInfo: {
    background: "#eff6ff",
    color: "#1d4ed8",
    border: "1px solid #bfdbfe",
    padding: "4px 9px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
  },
  badgeBad: {
    background: "#fee2e2",
    color: "#991b1b",
    border: "1px solid #fecaca",
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

  detailCard: {
    border: "1px solid #e2e8f0",
    borderRadius: 18,
    background: "#fff",
    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.06)",
    padding: 20,
    marginTop: 18,
  },

  detailHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  detailTitle: { fontSize: 18, fontWeight: 900, margin: 0, color: "#0f172a" },

  membersSection: { marginTop: 22 },
  membersTitle: { fontSize: 15, fontWeight: 800, margin: "0 0 10px", color: "#0f172a" },

  addMemberRow: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 14,
  },

  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 13,
    color: "#334155",
    whiteSpace: "nowrap",
  },
};
