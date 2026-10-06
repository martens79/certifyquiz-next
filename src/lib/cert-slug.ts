// src/lib/cert-slug.ts
// Normalizzazione degli slug certificazione (condivisa da lista /certifications e home).

/**
 * Normalizza slug dal backend (o vecchi URL) verso slug canonici del tuo registry.
 * Se qui normalizzi bene, spariscono:
 * - 404 da slug legacy
 * - "slug non mappato" nei quiz (quando usi lo stesso slug)
 */
export const normalizeSlug = (raw: unknown): string => {
  const s = String(raw ?? "").trim();

  // canonical ICDL
  if (s === "ecdl") return "icdl";

  // CompTIA aliases
  if (s === "comptia-security-plus") return "security-plus";
  if (s === "comptia-network-plus") return "network-plus";

  // Legacy slugs (visti in giro)
if (s === "mysql-certification") return "mysql";
if (s === "google-tensorflow") return "tensorflow";

// Microsoft AI aliases: canonical = microsoft-ai
if (s === "microsoft-ai-fundamentals") return "microsoft-ai";
if (s === "ai-fundamentals") return "microsoft-ai";

if (s === "azure-fundamentals") return "microsoft-azure-fundamentals";

  // VMware legacy
  if (s === "vmware-certified-professional") return "vmware-vcp";

  // Dev languages legacy
  if (s === "python") return "python-developer";
  if (s === "javascript") return "javascript-developer";



// CCST aliases: canonical = cisco-ccst-cybersecurity
if (s === "cisco-ccst-security") return "cisco-ccst-cybersecurity";
if (s === "ccst-cybersecurity") return "cisco-ccst-cybersecurity";

if (s === "microsoft-csharp") return "csharp";

  return s;
};
