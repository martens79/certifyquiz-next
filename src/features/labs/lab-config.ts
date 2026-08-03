export const labSlugs = [
  "spreadsheets",
  "networking",
  "phishing",
  "subnetting",
  "password-security",
  "linux-permissions",
  "sql-select",
  "docker-lifecycle",
  "cloud-storage-security",
  "ai-prompt-safety",
  "python-data-cleanup",
  "windows-server-users",
  "powershell-pipeline",
  "word-document",
] as const;

export type LabSlug = (typeof labSlugs)[number];
