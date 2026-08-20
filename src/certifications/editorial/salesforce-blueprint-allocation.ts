import type { SalesforceBlueprintDomain } from "./salesforce-editorial-types";

export const SALESFORCE_BLUEPRINT_TARGET: Readonly<Record<SalesforceBlueprintDomain, number>> = {
  configuration: 30,
  "objects-app-builder": 30,
  "sales-marketing": 20,
  "service-support": 20,
  "productivity-collaboration": 20,
  "data-analytics": 34,
  automation: 30,
  agentforce: 16,
};

export const SALESFORCE_OBJECTIVE_PRIMARY_DOMAIN = {
  "CS-01": "configuration", "CS-02": "configuration", "CS-03": "configuration",
  "CS-04": "configuration", "CS-05": "configuration", "CS-06": "configuration",
  "OM-01": "objects-app-builder", "OM-02": "objects-app-builder", "OM-03": "objects-app-builder",
  "SM-01": "sales-marketing", "SM-02": "sales-marketing", "SM-03": "sales-marketing",
  "SS-01": "service-support", "SS-02": "service-support",
  "PC-01": "productivity-collaboration", "PC-02": "productivity-collaboration",
  "PC-03": "productivity-collaboration", "PC-04": "productivity-collaboration",
  "DA-01": "data-analytics", "DA-02": "data-analytics", "DA-03": "data-analytics",
  "DA-04": "data-analytics", "DA-05": "data-analytics",
  "AU-01": "automation", "AU-02": "automation", "AU-03": "automation",
  "AF-01": "agentforce", "AF-02": "agentforce",
} as const satisfies Readonly<Record<string, SalesforceBlueprintDomain>>;

type PlannedTopic = Readonly<{
  topicSlug: string;
  quizCount: number;
  domains: Readonly<Partial<Record<SalesforceBlueprintDomain, number>>>;
}>;

/** Contract for D3/D4; it plans allocation only and contains no quiz content. */
export const SALESFORCE_REMAINING_BLUEPRINT_PLAN: ReadonlyArray<PlannedTopic> = [
  { topicSlug: "productivity-collaboration", quizCount: 14, domains: { "productivity-collaboration": 14 } },
  { topicSlug: "data-quality-governance", quizCount: 15, domains: { "data-analytics": 15 } },
  { topicSlug: "reports-dashboards", quizCount: 12, domains: { "data-analytics": 12 } },
  { topicSlug: "validation-flow-automation", quizCount: 28, domains: { automation: 28 } },
  { topicSlug: "agentforce-fundamentals", quizCount: 15, domains: { agentforce: 15 } },
];
