export type AdminFunnelEvent = {
  id: number;
  email: string | null;
  event: string;
  cert_slug: string | null;
  topic_slug: string | null;
  lang: string | null;
  score: number | null;
  created_at: string;
};

export type BusinessStep =
  | "assessment_started"
  | "assessment_completed"
  | "email_captured"
  | "study_started"
  | "paywall_reached"
  | "checkout_started"
  | "purchase_completed";

export const BUSINESS_STEPS: { key: BusinessStep; label: string }[] = [
  { key: "assessment_started", label: "Assessment avviati" },
  { key: "assessment_completed", label: "Assessment completati" },
  { key: "email_captured", label: "Lead acquisiti" },
  { key: "study_started", label: "Studio avviato" },
  { key: "paywall_reached", label: "Paywall raggiunto" },
  { key: "checkout_started", label: "Checkout avviati" },
  { key: "purchase_completed", label: "Acquisti" },
];

const CANONICAL_BY_STEP: Record<BusinessStep, Set<string>> = {
  assessment_started: new Set(["assessment_started"]),
  assessment_completed: new Set(["assessment_completed"]),
  email_captured: new Set(["email_captured"]),
  study_started: new Set(["study_started"]),
  paywall_reached: new Set(["paywall_viewed"]),
  checkout_started: new Set(["checkout_started", "checkout_created"]),
  purchase_completed: new Set(["purchase_completed"]),
};

const LEGACY_BY_STEP: Record<BusinessStep, Set<string>> = {
  assessment_started: new Set(["diagnostic_quiz_started"]),
  assessment_completed: new Set(["result_viewed", "quiz_result_viewed"]),
  email_captured: new Set(),
  study_started: new Set(),
  paywall_reached: new Set(["wrong_explanation_gate_shown", "gate_hit", "free_limit_reached"]),
  checkout_started: new Set(),
  purchase_completed: new Set(["premium_converted", "guide_purchase_completed"]),
};

const EVENT_CATEGORY: Record<string, "CORE KPI" | "FUNNEL" | "PRODUCT" | "COMMERCE" | "DEBUG/TECHNICAL" | "LEGACY"> = {
  assessment_started: "CORE KPI",
  assessment_completed: "CORE KPI",
  email_captured: "CORE KPI",
  study_started: "CORE KPI",
  paywall_viewed: "FUNNEL",
  free_limit_reached: "FUNNEL",
  checkout_started: "COMMERCE",
  checkout_created: "COMMERCE",
  purchase_completed: "COMMERCE",
  result_viewed: "LEGACY",
  quiz_result_viewed: "LEGACY",
  diagnostic_quiz_started: "LEGACY",
  wrong_explanation_gate_shown: "LEGACY",
  gate_hit: "LEGACY",
  premium_converted: "LEGACY",
  guide_purchase_completed: "LEGACY",
  premium_clicked: "PRODUCT",
  premium_cta_clicked: "PRODUCT",
  quiz_completed: "PRODUCT",
  pwa_install_prompt_shown: "DEBUG/TECHNICAL",
  pwa_install_clicked: "DEBUG/TECHNICAL",
  pwa_install_accepted: "DEBUG/TECHNICAL",
  pwa_installed: "PRODUCT",
  pwa_open: "PRODUCT",
};

export function eventCategory(event: string) {
  return EVENT_CATEGORY[event] ?? "DEBUG/TECHNICAL";
}

function sameContext(a: AdminFunnelEvent, b: AdminFunnelEvent) {
  return (
    (a.email || "") === (b.email || "") &&
    (a.cert_slug || "") === (b.cert_slug || "") &&
    (a.topic_slug || "") === (b.topic_slug || "") &&
    (a.score ?? null) === (b.score ?? null)
  );
}

function isPairedWithCanonical(
  legacy: AdminFunnelEvent,
  canonical: AdminFunnelEvent[],
) {
  const legacyTime = new Date(legacy.created_at).getTime();
  if (!Number.isFinite(legacyTime)) return false;

  return canonical.some((candidate) => {
    const candidateTime = new Date(candidate.created_at).getTime();
    return (
      Number.isFinite(candidateTime) &&
      Math.abs(candidateTime - legacyTime) <= 10_000 &&
      sameContext(legacy, candidate)
    );
  });
}

export function normalizedBusinessEvents(events: AdminFunnelEvent[]) {
  return BUSINESS_STEPS.flatMap(({ key }) => {
    const canonical = events.filter((event) => CANONICAL_BY_STEP[key].has(event.event));
    const unpairedLegacy = events.filter(
      (event) =>
        LEGACY_BY_STEP[key].has(event.event) &&
        !isPairedWithCanonical(event, canonical),
    );

    return [...canonical, ...unpairedLegacy].map((event) => ({ ...event, step: key }));
  });
}

export function businessStepCounts(events: AdminFunnelEvent[]) {
  const normalized = normalizedBusinessEvents(events);
  return Object.fromEntries(
    BUSINESS_STEPS.map(({ key }) => [
      key,
      normalized.filter((event) => event.step === key).length,
    ]),
  ) as Record<BusinessStep, number>;
}
