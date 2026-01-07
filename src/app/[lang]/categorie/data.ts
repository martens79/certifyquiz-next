// src/app/[lang]/categorie/data.ts

import type { CategoryKey } from "@/lib/categories";

// 👉 certificazione “principale” per ogni categoria
// serve per il bottone "Mixed quiz — Categoria"
export const PRIMARY_CERT_SLUG_BY_CATEGORY: Record<CategoryKey, string> = {
  base: "comptia-itf-plus",
  security: "security-plus",
  networking: "ccna",
  cloud: "aws-cloud-practitioner",
  databases: "mysql",          // se vuoi cambiare, lo fai qui
  programming: "python",
  virtualization: "vmware-vcp",
  ai: "ai-fundamentals",
};
