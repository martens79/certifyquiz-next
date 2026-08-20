export type SalesforceEditorialDifficulty = "easy" | "medium" | "hard";

export const SALESFORCE_BLUEPRINT_DOMAINS = [
  "configuration",
  "objects-app-builder",
  "sales-marketing",
  "service-support",
  "productivity-collaboration",
  "data-analytics",
  "automation",
  "agentforce",
] as const;

export type SalesforceBlueprintDomain =
  (typeof SALESFORCE_BLUEPRINT_DOMAINS)[number];

export type SalesforceEditorialQuestionType =
  | "conceptual"
  | "configuration-choice"
  | "best-practice"
  | "administrative-decision"
  | "troubleshooting"
  | "short-scenario";

export type SalesforceEditorialQuestion<
  TTopicSlug extends string,
  TObjectiveId extends string,
> = Readonly<{
  id: string;
  topicSlug: TTopicSlug;
  objectiveId: TObjectiveId;
  blueprintDomain: SalesforceBlueprintDomain;
  blueprintDomainRationale?: string;
  concept: string;
  difficulty: SalesforceEditorialDifficulty;
  type: SalesforceEditorialQuestionType;
  prompt: string;
  answers: ReadonlyArray<Readonly<{ id: "A" | "B" | "C" | "D"; text: string }>>;
  correctAnswerId: "A" | "B" | "C" | "D";
  explanation: string;
  reviewSection: string;
  supportStatus: "SUPPORTED";
}>;
