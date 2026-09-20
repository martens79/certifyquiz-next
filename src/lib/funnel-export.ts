// src/lib/funnel-export.ts
//
// Download dell'export pseudonimo del funnel (GET /admin/funnel-events/export).
// Il backend restituisce pagine di righe CSV gia' serializzate (quoting e
// neutralizzazione formule fatti server-side) piu' `snapshot_max_id`: il primo
// valore ricevuto viene rimandato in tutte le richieste successive, cosi'
// inserimenti concorrenti non spostano l'OFFSET e non duplicano/saltano righe.

export type FunnelExportIdentity = "pseudonymous" | "full";

type ExportPage = {
  ok: boolean;
  columns: string[];
  csv: string;
  row_count: number;
  pagination: {
    page: number;
    pages: number;
    total: number;
    snapshot_max_id: number;
  };
};

export type FunnelExportFilters = {
  q?: string;
  event?: string;
  lang?: string;
  cert?: string;
  date?: string;
};

export type FetchLike = (url: string, init: { headers: Record<string, string> }) => Promise<{
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
}>;

const PAGE_SIZE = 500;
// Freno di sicurezza: nessun export legittimo supera questo numero di pagine.
const MAX_PAGES = 400;

export async function fetchFunnelExportCsv({
  fetchFn,
  token,
  filters,
  identity = "pseudonymous",
  baseUrl = "/api/backend/admin/funnel-events/export",
}: {
  fetchFn: FetchLike;
  token: string;
  filters: FunnelExportFilters;
  identity?: FunnelExportIdentity;
  baseUrl?: string;
}): Promise<{ csv: string; rows: number }> {
  let page = 1;
  let pages = 1;
  let snapshotMaxId: number | null = null;
  let columns: string[] | null = null;
  const chunks: string[] = [];
  let rows = 0;

  do {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(PAGE_SIZE),
      identity,
      q: filters.q ?? "",
      event: filters.event ?? "all",
      lang: filters.lang ?? "all",
      cert: filters.cert ?? "all",
      date: filters.date ?? "all",
    });
    if (snapshotMaxId !== null) params.set("max_id", String(snapshotMaxId));

    const response = await fetchFn(`${baseUrl}?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error(`Export funnel HTTP ${response.status}`);

    const data = (await response.json()) as ExportPage;
    if (!data?.ok || !Array.isArray(data.columns)) throw new Error("Export funnel: risposta non valida");

    columns ??= data.columns;
    snapshotMaxId ??= data.pagination.snapshot_max_id;
    if (data.csv) chunks.push(data.csv);
    rows += data.row_count;
    pages = Math.min(data.pagination.pages, MAX_PAGES);
    page += 1;
  } while (page <= pages);

  return { csv: [(columns ?? []).join(","), ...chunks].join("\n"), rows };
}
