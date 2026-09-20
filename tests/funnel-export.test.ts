import assert from "node:assert/strict";
import test from "node:test";
import { fetchFunnelExportCsv, type FetchLike } from "../src/lib/funnel-export.ts";

const COLUMNS = ["event_id", "event", "user_key"];

function pagedBackend(pages: string[][], { failOn }: { failOn?: number } = {}) {
  const calls: URL[] = [];
  const fetchFn: FetchLike = async (url, init) => {
    assert.equal(init.headers.Authorization, "Bearer tok");
    const parsed = new URL(url, "http://localhost");
    calls.push(parsed);
    const page = Number(parsed.searchParams.get("page"));
    if (failOn === page) return { ok: false, status: 503, json: async () => ({}) };
    const rows = pages[page - 1] ?? [];
    return {
      ok: true,
      status: 200,
      json: async () => ({
        ok: true,
        columns: COLUMNS,
        csv: rows.join("\n"),
        row_count: rows.length,
        // uno snapshot che "cresce" a ogni richiesta: il client deve usare solo il primo
        pagination: { page, pages: pages.length, total: pages.flat().length, snapshot_max_id: 100 + page },
      }),
    };
  };
  return { fetchFn, calls };
}

test("compone l'header una sola volta e concatena le pagine nell'ordine ricevuto", async () => {
  const { fetchFn } = pagedBackend([["e1,paywall_viewed,u_a", "e2,study_started,u_b"], ["e3,checkout_created,u_a"]]);
  const { csv, rows } = await fetchFunnelExportCsv({ fetchFn, token: "tok", filters: {} });
  assert.equal(csv, "event_id,event,user_key\ne1,paywall_viewed,u_a\ne2,study_started,u_b\ne3,checkout_created,u_a");
  assert.equal(rows, 3);
});

test("congela lo snapshot: dalla seconda pagina rimanda il max_id ricevuto dalla prima", async () => {
  const { fetchFn, calls } = pagedBackend([["a"], ["b"], ["c"]]);
  await fetchFunnelExportCsv({ fetchFn, token: "tok", filters: {} });
  assert.equal(calls.length, 3);
  assert.equal(calls[0].searchParams.has("max_id"), false);
  assert.deepEqual(
    calls.slice(1).map((c) => c.searchParams.get("max_id")),
    ["101", "101"]
  );
});

test("passa filtri, identita' e dimensione pagina; il default e' pseudonimo", async () => {
  const { fetchFn, calls } = pagedBackend([["a"]]);
  await fetchFunnelExportCsv({
    fetchFn,
    token: "tok",
    filters: { q: "ccna", event: "purchase_completed", lang: "it", cert: "ccna", date: "7d" },
  });
  const p = calls[0].searchParams;
  assert.equal(p.get("identity"), "pseudonymous");
  assert.equal(p.get("limit"), "500");
  assert.deepEqual(
    [p.get("q"), p.get("event"), p.get("lang"), p.get("cert"), p.get("date")],
    ["ccna", "purchase_completed", "it", "ccna", "7d"]
  );

  const full = pagedBackend([["a"]]);
  await fetchFunnelExportCsv({ fetchFn: full.fetchFn, token: "tok", filters: {}, identity: "full" });
  assert.equal(full.calls[0].searchParams.get("identity"), "full");
});

test("un errore HTTP interrompe l'export invece di produrre un file parziale", async () => {
  const { fetchFn } = pagedBackend([["a"], ["b"], ["c"]], { failOn: 2 });
  await assert.rejects(fetchFunnelExportCsv({ fetchFn, token: "tok", filters: {} }), /HTTP 503/);
});

test("una risposta non valida viene rifiutata", async () => {
  const fetchFn: FetchLike = async () => ({ ok: true, status: 200, json: async () => ({ ok: false }) });
  await assert.rejects(fetchFunnelExportCsv({ fetchFn, token: "tok", filters: {} }), /non valida/);
});

test("export vuoto: solo header, zero righe", async () => {
  const { fetchFn } = pagedBackend([[]]);
  const { csv, rows } = await fetchFunnelExportCsv({ fetchFn, token: "tok", filters: {} });
  assert.equal(csv, "event_id,event,user_key");
  assert.equal(rows, 0);
});
