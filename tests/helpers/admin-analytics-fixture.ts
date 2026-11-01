// Dati SINTETICI per i test e gli screenshot della dashboard /admin: nessun valore proviene da produzione.
// La forma rispecchia le risposte di /api/admin/analytics/* del backend.

const days = (from: string, n: number) =>
  Array.from({ length: n }, (_, i) =>
    new Date(Date.parse(`${from}T00:00:00Z`) + i * 86400000)
      .toISOString()
      .slice(0, 10),
  );
const D = days("2026-10-02", 28);
const wave = (base: number, amp: number) =>
  D.map((_, i) =>
    Math.max(0, Math.round(base + amp * Math.sin(i / 3) + (i % 5))),
  );

const kpi = (
  metric: string,
  value: unknown,
  extra: Record<string, unknown> = {},
) => ({
  metric,
  value,
  previous: null,
  delta: null,
  comparable: false,
  status: value == null ? "unavailable" : "partial",
  reason: null,
  note: null,
  coverage: null,
  denominator: null,
  ...extra,
});
const cov = (since: string, full: boolean) => ({ since, fullWindow: full });

const stage = (
  key: string,
  identities: number | null,
  pctOfPrevious: number | null,
  pctOfFirst: number | null,
  lost: number | null,
  extra: Record<string, unknown> = {},
) => ({
  key,
  metric: `funnel_${key}`,
  identities,
  reason: null,
  note: null,
  pctOfPrevious,
  pctOfFirst,
  notObservedAdvancing: lost,
  coverage: cov("2026-08-22", true),
  ...extra,
});

export const METRICS = [
  ["observed_identities", "Identità osservate", "overview"],
  ["observed_accounts", "…di cui account", "overview"],
  ["observed_browsers", "…di cui browser non collegati", "overview"],
  ["unattributed_events", "Eventi non attribuibili", "overview"],
  ["active_students", "Studenti attivi verificabili", "overview"],
  ["server_students", "…di cui account con risposta server", "overview"],
  ["new_questions", "Nuove domande affrontate", "overview"],
  ["saved_results", "Risultati quiz salvati", "overview"],
  ["registrations", "Registrazioni (account creati)", "overview"],
  ["paywall_identities", "Identità che incontrano un paywall", "overview"],
  ["click_after_paywall", "Click commerciali dopo un paywall", "overview"],
  ["checkout_created", "Checkout creati", "overview"],
  ["trials_started", "Trial avviati", "overview"],
  ["verified_purchases", "Acquisti verificati", "overview"],
  ["verified_revenue", "Ricavi verificati", "overview"],
  ["study_return_d1", "Ritorno a nuove domande D1", "overview"],
  ["study_return_d7", "Ritorno a nuove domande D7", "overview"],
  ["study_return_d28", "Ritorno a nuove domande D28", "overview"],
  ["funnel_load", "Caricamento quiz", "funnel"],
  ["funnel_interaction", "Interazione reale", "funnel"],
  ["funnel_result", "Risultato", "funnel"],
  ["funnel_paywall", "Paywall", "funnel"],
  ["funnel_click", "Click commerciale", "funnel"],
  ["funnel_checkout", "Checkout creato", "funnel"],
  ["funnel_payment", "Pagamento verificato", "funnel"],
  ["cert_interest", "Identità interessate", "certifications"],
  ["cert_loads", "Caricamenti quiz", "certifications"],
  ["cert_answering_accounts", "Account che rispondono", "certifications"],
  ["cert_new_questions", "Nuove domande", "certifications"],
  ["cert_saved_results", "Risultati salvati", "certifications"],
  ["cert_paywall", "Paywall raggiunti", "certifications"],
  ["cert_clicks", "Click commerciali", "certifications"],
  ["cert_checkouts", "Checkout attribuibili", "certifications"],
  ["cert_purchases", "Acquisti verificati attribuibili", "certifications"],
  ["rev_checkout_created", "Sessioni checkout create", "revenue"],
  ["rev_trials", "Trial", "revenue"],
  ["rev_receipts", "Ricevute pagamento verificate", "revenue"],
  ["rev_orders", "Ordini pacchetto", "revenue"],
  ["rev_guides", "Guide singole", "revenue"],
  ["rev_refunds", "Rimborsi", "revenue"],
  ["rev_renewals", "Rinnovi", "revenue"],
  ["rev_failed_payments", "Pagamenti falliti", "revenue"],
].map(([id, label, group]) => ({
  id,
  label,
  group,
  source: "Fonte sintetica di test",
  definition: `Definizione sintetica di ${label}.`,
  unit: "conteggio",
  denominator: null,
  limits: `Limite sintetico di ${label}.`,
  reliability: ["rev_renewals", "rev_failed_payments"].includes(id as string)
    ? "unavailable"
    : "partial",
}));

export const OVERVIEW = {
  ok: true,
  range: {
    from: "2026-10-02",
    to: "2026-10-29",
    days: 28,
    tz: "Europe/Rome",
    previous: { from: "2026-09-04", to: "2026-10-01" },
  },
  filters: { cert: null, lang: null, auth: "all", mode: null },
  kpis: [
    kpi("observed_identities", 2400, {
      previous: 2100,
      delta: { abs: 300, pct: 0.142 },
      comparable: true,
      coverage: cov("2026-08-22", true),
      parts: { accounts: 210, browsers: 2190 },
    }),
    kpi("observed_accounts", 210),
    kpi("observed_browsers", 2190),
    kpi("unattributed_events", 2160, {
      denominator: {
        value: 8912,
        label:
          "eventi web del periodo (esclusi eventi tecnici PWA e anteprime)",
        share: 0.242,
      },
    }),
    kpi("active_students", 240, {
      coverage: cov("2026-10-25", false),
      parts: { serverAccounts: 216 },
      previous: null,
    }),
    kpi("server_students", 216),
    kpi("new_questions", 16660, {
      parts: { distinctQuestions: 9100 },
      previous: 15000,
      delta: { abs: 1660, pct: 0.11 },
      comparable: true,
      status: "verified",
    }),
    kpi("saved_results", 257, { parts: { accounts: 142 } }),
    kpi("registrations", 227, {
      status: "verified",
      parts: {
        providers: [
          { provider: "google", n: 173 },
          { provider: "non_valorizzato", n: 54 },
        ],
      },
    }),
    kpi("paywall_identities", 411, { coverage: cov("2026-08-22", true) }),
    kpi("click_after_paywall", 43, {
      coverage: cov("2026-05-15", true),
      denominator: { value: 129, label: "identità con paywall", share: 0.333 },
    }),
    kpi("checkout_created", 15, {
      coverage: cov("2026-07-15", true),
      parts: { identities: 12 },
    }),
    kpi("trials_started", 1, { coverage: cov("2026-10-27", false) }),
    kpi("verified_purchases", { receipts: 1, ordersPaid: 1 }),
    kpi("verified_revenue", {
      receipts: [{ currency: "EUR", amount_minor: 499 }],
      orders: [{ currency: "EUR", amount_minor: 1290 }],
    }),
    kpi("study_return_d1", 0.136, {
      denominator: {
        value: 198,
        label: "account della coorte con D1 concluso",
        share: null,
      },
    }),
    kpi("study_return_d7", 0.019, {
      denominator: {
        value: 156,
        label: "account della coorte con D7 concluso",
        share: null,
      },
    }),
    kpi("study_return_d28", null, {
      reason: "Servono coorti con 28 giorni di calendario conclusi",
    }),
  ],
  series: {
    current: {
      days: D,
      observed: wave(70, 25),
      students: wave(14, 6),
      newQuestions: wave(500, 220),
      results: wave(6, 3),
      registrations: wave(6, 4),
      paywall: wave(12, 5),
      clicks: wave(3, 2),
      checkouts: wave(1, 1),
    },
    previous: {
      days: days("2026-09-04", 28),
      observed: wave(60, 20),
      students: wave(12, 5),
      newQuestions: wave(450, 200),
    },
  },
  funnels: {
    complete: [
      stage("load", 2173, null, null, null),
      stage("interaction", 168, 0.077, 0.077, 2005),
      stage("result", 120, 0.714, 0.055, 48),
      stage("paywall", 58, 0.483, 0.027, 62),
      stage("click", 21, 0.362, 0.0097, 37),
      stage("checkout", 6, 0.286, 0.0028, 15),
      stage("payment", 2, 0.333, 0.0009, 4, {
        coverage: {
          since: null,
          fullWindow: false,
          note: "Stripe Live non riconciliato",
        },
      }),
    ],
    commercial: [
      stage("interaction", 239, null, null, null),
      stage("paywall", 129, 0.54, 0.54, 110),
      stage("click", 43, 0.333, 0.18, 86),
      stage("checkout", 6, 0.14, 0.025, 37),
      stage("payment", 2, 0.333, 0.008, 4, {
        coverage: {
          since: null,
          fullWindow: false,
          note: "Stripe Live non riconciliato",
        },
      }),
    ],
  },
  population: {
    identities: 2400,
    unattributedEvents: 2160,
    unattributedShare: 0.242,
  },
  quality: { truncated: false },
  notes: [
    "Identità, account, browser e sessioni sono popolazioni diverse: non confrontarle con GA4.",
    "Le variazioni rispetto al periodo precedente sono mostrate solo quando l'evento era già tracciato in quel periodo.",
  ],
};

const cert = (
  slug: string,
  name: string,
  c: Partial<Record<string, number | null>>,
  evidence = "activity_observed",
) => ({
  slug,
  name,
  evidence,
  cells: {
    cert_interest: 0,
    cert_loads: 0,
    cert_answering_accounts: 0,
    cert_new_questions: 0,
    cert_saved_results: 0,
    cert_paywall: 0,
    cert_clicks: 0,
    cert_checkouts: null,
    cert_purchases: 0,
    ...c,
  },
});
export const CERTS = {
  ok: true,
  columns: [
    "cert_interest",
    "cert_loads",
    "cert_answering_accounts",
    "cert_new_questions",
    "cert_saved_results",
    "cert_paywall",
    "cert_clicks",
    "cert_checkouts",
    "cert_purchases",
  ],
  rows: [
    cert("ccna", "CCNA", {
      cert_interest: 412,
      cert_loads: 358,
      cert_answering_accounts: 40,
      cert_new_questions: 3946,
      cert_saved_results: 58,
      cert_paywall: 57,
      cert_clicks: 11,
      cert_checkouts: 4,
      cert_purchases: 1,
    }),
    cert("isc2-cc", "ISC2 CC", {
      cert_interest: 128,
      cert_loads: 129,
      cert_answering_accounts: 19,
      cert_new_questions: 2216,
      cert_saved_results: 18,
      cert_paywall: 30,
      cert_clicks: 7,
      cert_checkouts: 2,
    }),
    cert("cisco-ccst-cybersecurity", "CCST Cybersecurity", {
      cert_interest: 155,
      cert_loads: 189,
      cert_answering_accounts: 24,
      cert_new_questions: 1857,
      cert_saved_results: 39,
      cert_paywall: 27,
      cert_clicks: 11,
      cert_checkouts: 5,
      cert_purchases: 1,
    }),
    cert(
      "pentest-plus",
      "PenTest+",
      { cert_interest: 53, cert_loads: 52 },
      "activity_observed",
    ),
    cert("sap-analytics-cloud", "SAP Analytics Cloud", {}, "none_observed"),
    cert(
      "microsoft-csharp",
      "Microsoft C#",
      {
        cert_interest: null,
        cert_loads: null,
        cert_paywall: null,
        cert_clicks: null,
      },
      "none_observed",
    ),
  ],
  notes: [
    "'—' = non disponibile (fonte non copre il periodo o il filtro); '0' = zero accertato dalla fonte per il periodo.",
  ],
  unattributedToCertification: 402,
  truncated: false,
};
export const CERT_DETAIL = {
  ok: true,
  slug: "ccna",
  series: {
    days: D,
    observed: wave(20, 8),
    students: wave(5, 2),
    newQuestions: wave(140, 60),
    results: wave(2, 1),
    registrations: wave(0, 0),
    paywall: wave(2, 1),
    clicks: wave(0, 1),
    checkouts: wave(0, 0),
  },
  funnels: {
    complete: OVERVIEW.funnels.complete.map((s) => ({
      ...s,
      identities: s.identities == null ? null : Math.round(s.identities * 0.2),
    })),
    commercial: OVERVIEW.funnels.commercial.map((s) => ({
      ...s,
      identities: s.identities == null ? null : Math.round(s.identities * 0.2),
    })),
  },
  totals: {},
};
export const RETENTION = {
  ok: true,
  lastCompleteDay: "2026-10-28",
  summary: {
    d1: { eligible: 198, returned: 27, rate: 27 / 198 },
    d7: { eligible: 156, returned: 3, rate: 3 / 156 },
    d28: { eligible: 0, returned: 0, rate: null },
  },
  cohorts: D.slice(0, 20).map((d, i) => ({
    day: d,
    size: 6 + (i % 5),
    d1: { eligible: 6, returned: 1 },
    d7: { eligible: i < 12 ? 5 : 0, returned: i < 12 ? 0 : 0 },
    d28: { eligible: 0, returned: 0 },
  })),
  notes: [
    "Misura limitata alle NUOVE domande: proxy di ritorno, non retention completa.",
  ],
};
export const REVENUE = {
  ok: true,
  reconciliation: {
    stripeLive: "not_accessible",
    message:
      "Stripe Live non è accessibile all'applicazione: sono mostrate solo le informazioni verificate dal backend. Copertura incompleta; nessuna somma tra fonti.",
  },
  sections: [
    {
      metric: "rev_checkout_created",
      status: "partial",
      value: [
        { product: "premium_monthly", n: 14 },
        { product: "certification_package", n: 1 },
      ],
      coverage: cov("2026-07-15", true),
    },
    {
      metric: "rev_trials",
      status: "partial",
      value: 1,
      coverage: cov("2026-10-27", false),
    },
    {
      metric: "rev_receipts",
      status: "partial",
      value: {
        byType: [{ type: "single_guide", n: 1 }],
        amounts: [{ currency: "EUR", amount_minor: 499 }],
      },
    },
    {
      metric: "rev_orders",
      status: "verified",
      value: [
        { status: "paid", n: 1 },
        { status: "expired", n: 2 },
      ],
      paidAmounts: [{ currency: "EUR", amount_minor: 1290 }],
    },
    { metric: "rev_guides", status: "partial", value: { n: 1, amount: 4.99 } },
    { metric: "rev_refunds", status: "partial", value: [] },
    {
      metric: "rev_renewals",
      status: "unavailable",
      value: null,
      reason: "Nessuna fonte interna: richiede riconciliazione Stripe Live",
    },
    {
      metric: "rev_failed_payments",
      status: "unavailable",
      value: null,
      reason: "Nessuna fonte interna: richiede Stripe Live",
    },
  ],
  webhooks: [
    { event_type: "checkout.session.completed", n: 9 },
    { event_type: "invoice.paid", n: 1 },
  ],
  notes: [
    "Non si usano ads_conversion_PURCHASE_1 né i purchase_completed storici come prova di incasso.",
  ],
};
export const FILTERS = {
  ok: true,
  presets: ["7d", "28d", "90d", "custom"],
  maxDays: 120,
  tz: "Europe/Rome",
  certs: CERTS.rows.map((c) => ({ slug: c.slug, name: c.name })),
  langs: ["it", "en", "fr", "es"],
  auth: ["all", "authenticated", "anonymous"],
  modes: ["exam", "training"],
  unavailable: [
    { id: "country", reason: "x" },
    { id: "device", reason: "x" },
  ],
};
export const DICTIONARY = { ok: true, metrics: METRICS };
