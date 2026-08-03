export const labSlugs = [
  "spreadsheets",
  "networking",
  "phishing",
] as const;

export type LabSlug = (typeof labSlugs)[number];
