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
