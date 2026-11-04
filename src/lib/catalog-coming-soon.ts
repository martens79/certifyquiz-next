// Catalogue entries of coming-soon landings (EIPASS Standard, Italian only).
//
// A coming-soon certification flagged `listedInCatalog` is listed from the registry alone, in the languages of its
// launch scope: the registry is its source of truth, so a database row (returned or not by the backend list) can
// never change what the catalogue shows. Home and category pages do not use this helper.

import type { CertificationData } from "@/certifications/types";
import { isCertificationOfferedInLang, isComingSoonCertification } from "@/certifications/publication";
import type { CertListItem } from "@/lib/certs";

export function mergeComingSoonCatalogEntries(
  items: ReadonlyArray<CertListItem>,
  registry: Readonly<Record<string, CertificationData | undefined>>,
  lang: string
): CertListItem[] {
  const bySlug = new Map<string, CertificationData>();
  for (const reg of Object.values(registry)) {
    if (reg && isComingSoonCertification(reg) && reg.listedInCatalog === true && isCertificationOfferedInLang(reg, lang)) {
      bySlug.set(reg.slug, reg);
    }
  }
  const out = items.filter((c) => !bySlug.has(c.slug));
  for (const reg of bySlug.values()) {
    out.push({
      slug: reg.slug,
      title: reg.title,
      imageUrl: reg.imageUrl,
      level: reg.level,
      description: reg.description,
      category: null,
    });
  }
  return out;
}
