import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFAULT_FILTERS,
  buildQuery,
  coverageLabel,
  customRangeError,
  deltaLabel,
  errorMessageFor,
  formatInt,
  formatPct,
  kpiText,
  largestDrop,
  readOk,
  sortCertRows,
  type CertRow,
  type FunnelStage,
  type Kpi,
} from "../src/lib/admin-analytics-dashboard.ts";

const stage = (key: string, identities: number | null): FunnelStage => ({
  key,
  metric: `funnel_${key}`,
  identities,
  reason: null,
  pctOfPrevious: null,
  pctOfFirst: null,
  notObservedAdvancing: null,
  coverage: null,
});

test("buildQuery forwards only validated values", () => {
  assert.equal(buildQuery(DEFAULT_FILTERS), "range=28d");
  const q = new URLSearchParams(
    buildQuery({
      range: "custom",
      from: "2026-10-01",
      to: "2026-10-28",
      cert: "ccna",
      lang: "it",
      auth: "anonymous",
      mode: "training",
    }),
  );
  assert.deepEqual(
    [...q.keys()],
    ["range", "from", "to", "cert", "lang", "auth", "mode"],
  );
  const hostile = new URLSearchParams(
    buildQuery({
      range: "28d",
      from: "2026-10-01",
      to: "x",
      cert: "ccna; DROP TABLE users",
      lang: "zz",
      auth: "all",
      mode: "a b",
    }),
  );
  assert.deepEqual(
    [...hostile.keys()],
    ["range"],
    "invalid cert/lang/mode and preset-range dates are dropped",
  );
  const customBad = new URLSearchParams(
    buildQuery({
      ...DEFAULT_FILTERS,
      range: "custom",
      from: "01/10/2026",
      to: "2026-10-28",
    }),
  );
  assert.equal(customBad.has("from"), false);
});

test("custom range validation mirrors the backend limits", () => {
  const f = { ...DEFAULT_FILTERS, range: "custom" as const };
  assert.match(customRangeError({ ...f, from: "", to: "" })!, /Inserisci/);
  assert.match(
    customRangeError({ ...f, from: "2026-10-10", to: "2026-10-01" })!,
    /successiva/,
  );
  assert.match(
    customRangeError({ ...f, from: "2026-01-01", to: "2026-10-01" })!,
    /120/,
  );
  assert.equal(
    customRangeError({ ...f, from: "2026-10-01", to: "2026-10-28" }),
    null,
  );
  assert.equal(customRangeError({ ...DEFAULT_FILTERS }), null);
});

test("unavailable values are never rendered as zero", () => {
  const k = (value: Kpi["value"], metric = "new_questions"): Kpi => ({
    metric,
    value,
    previous: null,
    delta: null,
    comparable: false,
    status: value == null ? "unavailable" : "verified",
    reason: null,
    coverage: null,
    denominator: null,
  });
  assert.equal(kpiText(k(null)), "Non disponibile");
  assert.equal(kpiText(k(0)), "0");
  assert.equal(kpiText(k(12345)), formatInt(12345));
  assert.equal(kpiText(k(0.5, "study_return_d1")), "50%");
  assert.equal(formatInt(null), "Non disponibile");
  assert.equal(formatPct(null), "n.d.");
});

test("deltas are shown only when the comparison is valid", () => {
  assert.equal(deltaLabel({ abs: 5, pct: 0.25 }, false).tone, "none");
  assert.match(
    deltaLabel({ abs: 5, pct: 0.25 }, false).text,
    /non disponibile/i,
  );
  assert.equal(deltaLabel(null, true).tone, "none");
  assert.equal(deltaLabel({ abs: 5, pct: 0.25 }, true).tone, "up");
  assert.equal(deltaLabel({ abs: -3, pct: null }, true).tone, "down");
  assert.equal(deltaLabel({ abs: 0, pct: 0 }, true).tone, "flat");
});

test("coverage wording distinguishes full and partial tracking", () => {
  assert.match(
    coverageLabel({ since: "2026-10-25", fullWindow: false })!,
    /solo dal/,
  );
  assert.match(
    coverageLabel({ since: "2026-08-22", fullWindow: true })!,
    /copre l'intero periodo/,
  );
  assert.match(
    coverageLabel({ since: null, fullWindow: false })!,
    /non determinabile/,
  );
  assert.equal(coverageLabel(null), null);
});

test("largestDrop picks the transition with the highest relative loss and skips unavailable stages", () => {
  const d = largestDrop([
    stage("interaction", 100),
    stage("paywall", 60),
    stage("click", 12),
    stage("checkout", 6),
    stage("payment", null),
  ]);
  assert.equal(d?.from.key, "paywall");
  assert.equal(d?.to.key, "click");
  assert.equal(d?.lost, 48);
  assert.equal(largestDrop([stage("a", 0), stage("b", 0)]), null);
  assert.equal(largestDrop([stage("a", 5)]), null);
  assert.equal(largestDrop([stage("a", null), stage("b", 3)]), null);
});

test("certification sort keeps not-available values last in both directions", () => {
  const row = (name: string, v: number | null): CertRow => ({
    slug: name.toLowerCase(),
    name,
    cells: { cert_clicks: v },
    evidence: "activity_observed",
  });
  const rows = [row("B", 5), row("A", null), row("C", 9), row("D", 0)];
  assert.deepEqual(
    sortCertRows(rows, "cert_clicks", "desc").map((r) => r.name),
    ["C", "B", "D", "A"],
  );
  assert.deepEqual(
    sortCertRows(rows, "cert_clicks", "asc").map((r) => r.name),
    ["D", "B", "C", "A"],
  );
  assert.deepEqual(
    sortCertRows(rows, "name", "asc").map((r) => r.name),
    ["A", "B", "C", "D"],
  );
  assert.equal(rows[0].name, "B", "input is not mutated");
});

test("responses are validated and errors map to safe messages", () => {
  assert.throws(() => readOk({ ok: false }));
  assert.throws(() => readOk(null));
  assert.deepEqual(readOk({ ok: true, a: 1 }), { ok: true, a: 1 });
  assert.match(errorMessageFor(404), /backend/);
  assert.match(errorMessageFor(403), /admin/);
  assert.equal(
    errorMessageFor(500),
    "Impossibile caricare questa sezione. Riprova.",
  );
  assert.doesNotMatch(errorMessageFor(500), /SENSITIVE|sql/i);
});
