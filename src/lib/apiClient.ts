// tutte le chiamate client-side passano dal proxy /api/backend
export async function apiGet(path: string, init?: RequestInit) {
  const r = await fetch(`/api/backend${path}`, {
    credentials: "include",
    ...init,
  });
  const txt = await r.text();
  if (!r.ok) throw new Error(txt);
  try { return JSON.parse(txt); } catch { return txt; }
}
