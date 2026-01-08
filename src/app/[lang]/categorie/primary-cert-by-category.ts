import type { CategoryKey } from "@/lib/paths";

export const PRIMARY_CERT_SLUG_BY_CATEGORY: Record<CategoryKey, string> = {
  default: "aws-cloud-practitioner",
  base: "comptia-itf-plus",
  sicurezza: "security-plus",
  reti: "ccna",
  cloud: "aws-cloud-practitioner",
  database: "microsoft-sql-server",      // metti quello che vuoi
  programmazione: "python",
  virtualizzazione: "vmware-vcp",
  ai: "pytorch",                        // o quello che hai
};
