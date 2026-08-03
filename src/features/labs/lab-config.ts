export const labSlugs = [
  "spreadsheets",
  "networking",
  "phishing",
  "subnetting",
  "password-security",
  "linux-permissions",
  "sql-select",
  "docker-lifecycle",
  "powershell-pipeline",
  "word-document",
] as const;

export type LabSlug = (typeof labSlugs)[number];
