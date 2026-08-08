import type { Locale } from "@/lib/paths";

/** Contract reserved for the future interactive-lab engine. */
export type InteractiveLab = {
  title: string;
  slug: string;
  lang: Locale;
  certificationSlug?: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  published: boolean;
  premium: boolean;
  instructions: string[];
  environment: string;
  initialState: unknown;
  allowedActions: string[];
  expectedResult: unknown;
  validation: unknown;
  hints: string[];
  finalExplanation: string;
  score?: number;
  elapsedSeconds?: number;
};

export type GuidedLabOption = { id: string; label: string };
export type GuidedLabStep = {
  id: string;
  title: string;
  instruction: string;
  type: "single" | "multi" | "text";
  options?: GuidedLabOption[];
  placeholder?: string;
};
export type GuidedLabContent = {
  scenario: string;
  objective: string;
  prerequisites: string[];
  steps: GuidedLabStep[];
};
export type GuidedLabPayload = {
  id: number;
  slug: string;
  title: string;
  description: string;
  difficulty: "base" | "intermediate" | "final";
  estimatedMinutes: number;
  rendererKey: "guided-steps-v1";
  contentVersion: number;
  certificationSlug: string;
  content: GuidedLabContent;
};
