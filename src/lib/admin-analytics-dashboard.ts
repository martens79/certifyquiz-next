// Tipi, formattazione e logica pura della dashboard /admin (nessun accesso a rete o DOM).
// I numeri arrivano gia' aggregati dal backend: qui non si ricalcolano KPI e non si scaricano eventi grezzi.

export type Reliability = "verified" | "partial" | "unavailable";

export type MetricInfo = {
  id: string;
  label: string;
  group: string;
  source: string;
  definition: string;
  unit: string;
  denominator: string | null;
  coverage?: string;
  limits: string;
  reliability: Reliability;
};

export type Coverage = {
  since: string | null;
  fullWindow: boolean;
  note?: string;
} | null;
export type Delta = { abs: number; pct: number | null } | null;
export type Denominator = {
  value: number;
  label: string;
  share: number | null;
} | null;

export type Kpi = {
  metric: string;
  value: number | Record<string, unknown> | null;
  previous: number | null;
  delta: Delta;
  comparable: boolean;
  status: "verified" | "partial" | "unavailable";
  reason: string | null;
  note?: string | null;
  coverage: Coverage;
  denominator: Denominator;
  parts?: Record<string, unknown> | null;
};

export type FunnelStage = {
  key: string;
  metric: string;
  identities: number | null;
  reason: string | null;
  note?: string | null;
  pctOfPrevious: number | null;
  pctOfFirst: number | null;
  notObservedAdvancing: number | null;
  coverage: Coverage;
};

export type Filters = {
  range: "7d" | "28d" | "90d" | "custom";
  from: string;
  to: string;
  cert: string;
  lang: string;
  auth: "all" | "authenticated" | "anonymous";
  mode: string;
};

export const DEFAULT_FILTERS: Filters = {
  range: "28d",
  from: "",
  to: "",
  cert: "",
  lang: "",
  auth: "all",
  mode: "",
};

const SLUG = /^[a-z0-9][a-z0-9-]{0,99}$/;
const MODE = /^[a-z0-9_-]{1,40}$/;
const DAY = /^\d{4}-\d{2}-\d{2}$/;

/** Query string per il backend: solo valori validati, nessun input libero inoltrato. */
export function buildQuery(
  f: Filters,
  extra: Record<string, string> = {},
): string {
  const p = new URLSearchParams();
  p.set("range", f.range);
  if (f.range === "custom") {
    if (DAY.test(f.from)) p.set("from", f.from);
    if (DAY.test(f.to)) p.set("to", f.to);
  }
  if (f.cert && SLUG.test(f.cert)) p.set("cert", f.cert);
  if (["it", "en", "fr", "es"].includes(f.lang)) p.set("lang", f.lang);
  if (f.auth !== "all") p.set("auth", f.auth);
  if (f.mode && MODE.test(f.mode)) p.set("mode", f.mode);
  for (const [k, v] of Object.entries(extra)) p.set(k, v);
  return p.toString();
}

export function customRangeError(f: Filters): string | null {
  if (f.range !== "custom") return null;
  if (!DAY.test(f.from) || !DAY.test(f.to))
    return "Inserisci data iniziale e finale.";
  if (f.from > f.to) return "La data iniziale è successiva a quella finale.";
  const days =
    Math.round(
      (Date.parse(`${f.to}T00:00:00Z`) - Date.parse(`${f.from}T00:00:00Z`)) /
        86400000,
    ) + 1;
  if (days > 120) return "Intervallo massimo: 120 giorni.";
  return null;
}

const nf = new Intl.NumberFormat("it-IT");
export const formatInt = (v: number | null | undefined) =>
  v == null || !Number.isFinite(v)
    ? "Non disponibile"
    : nf.format(Math.round(v));
export function formatPct(v: number | null | undefined, digits = 1) {
  if (v == null || !Number.isFinite(v)) return "n.d.";
  return `${(v * 100).toLocaleString("it-IT", { minimumFractionDigits: digits, maximumFractionDigits: digits })}%`;
}
export function formatMoney(amountMinor: number, currency: string) {
  try {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency,
    }).format(amountMinor / 100);
  } catch {
    return `${amountMinor / 100} ${currency}`;
  }
}
export function formatDay(day: string) {
  if (!DAY.test(day)) return day;
  const [y, m, d] = day.split("-");
  return `${d}/${m}/${y}`;
}
export function formatDayShort(day: string) {
  return DAY.test(day) ? `${day.slice(8, 10)}/${day.slice(5, 7)}` : day;
}

export function deltaLabel(
  delta: Delta,
  comparable: boolean,
): { text: string; tone: "up" | "down" | "flat" | "none" } {
  if (!comparable || !delta)
    return { text: "Confronto non disponibile", tone: "none" };
  if (delta.abs === 0)
    return { text: "invariato vs periodo precedente", tone: "flat" };
  const sign = delta.abs > 0 ? "+" : "−";
  const pct =
    delta.pct == null
      ? ""
      : ` (${sign}${Math.abs(delta.pct * 100).toLocaleString("it-IT", { maximumFractionDigits: 0 })}%)`;
  return {
    text: `${sign}${nf.format(Math.abs(delta.abs))}${pct} vs precedente`,
    tone: delta.abs > 0 ? "up" : "down",
  };
}

export const STATUS_LABEL: Record<Reliability, string> = {
  verified: "Verificato",
  partial: "Parziale",
  unavailable: "Non disponibile",
};

export function coverageLabel(c: Coverage): string | null {
  if (!c) return null;
  if (c.note) return c.note;
  if (c.since == null) return "Copertura storica non determinabile";
  return c.fullWindow
    ? `Tracciato da ${formatDay(c.since)}: copre l'intero periodo`
    : `Tracciato solo dal ${formatDay(c.since)}: periodo coperto in parte`;
}

/** Valore primario di un KPI come testo (mai uno zero inventato). */
export function kpiText(k: Kpi): string {
  if (k.value == null) return "Non disponibile";
  if (typeof k.value === "number")
    return k.metric.startsWith("study_return")
      ? formatPct(k.value, 0)
      : formatInt(k.value);
  return "";
}

/** Transizione con il maggiore calo osservato (solo stage con valore): serve a rispondere "dove smettono di avanzare". */
export function largestDrop(
  stages: FunnelStage[],
): { from: FunnelStage; to: FunnelStage; lost: number; pct: number } | null {
  let best: {
    from: FunnelStage;
    to: FunnelStage;
    lost: number;
    pct: number;
  } | null = null;
  for (let i = 1; i < stages.length; i++) {
    const a = stages[i - 1],
      b = stages[i];
    if (a.identities == null || b.identities == null || a.identities === 0)
      continue;
    const lost = a.identities - b.identities;
    const pct = lost / a.identities;
    if (
      lost > 0 &&
      (!best || pct > best.pct || (pct === best.pct && lost > best.lost))
    )
      best = { from: a, to: b, lost, pct };
  }
  return best;
}

export type CertRow = {
  slug: string;
  name: string;
  cells: Record<string, number | null>;
  evidence: "activity_observed" | "none_observed";
};
export function sortCertRows(
  rows: CertRow[],
  key: string,
  dir: "asc" | "desc",
): CertRow[] {
  const sign = dir === "asc" ? 1 : -1;
  return [...rows].sort((a, b) => {
    const av = key === "name" ? a.name : (a.cells[key] ?? null),
      bv = key === "name" ? b.name : (b.cells[key] ?? null);
    if (av == null && bv == null) return a.name.localeCompare(b.name, "it");
    if (av == null) return 1; // non disponibili sempre in fondo, in entrambe le direzioni
    if (bv == null) return -1;
    if (typeof av === "string" || typeof bv === "string")
      return sign * String(av).localeCompare(String(bv), "it");
    return av === bv ? a.name.localeCompare(b.name, "it") : sign * (av - bv);
  });
}

export function isMoneyList(
  v: unknown,
): v is { currency: string; amount_minor: number }[] {
  return (
    Array.isArray(v) &&
    v.every(
      (x) =>
        x &&
        typeof x.currency === "string" &&
        typeof x.amount_minor === "number",
    )
  );
}

/** Proiezione esplicita: nessun campo inatteso della risposta viene mai mostrato. */
export function readOk<T>(value: unknown): T {
  const v = value as { ok?: boolean } | null;
  if (!v || v.ok !== true) throw new Error("Invalid analytics response");
  return value as T;
}

export const SECTION_ERRORS: Record<number, string> = {
  401: "Sessione scaduta: accedi di nuovo.",
  403: "Accesso riservato agli admin.",
  404: "Endpoint non disponibile: il backend con le API analytics non è ancora rilasciato.",
  400: "Filtri non validi.",
};
export const errorMessageFor = (status: number) =>
  SECTION_ERRORS[status] ?? "Impossibile caricare questa sezione. Riprova.";
