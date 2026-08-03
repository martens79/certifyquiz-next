import type { Locale } from "@/lib/paths";

export type RecommendedResourceType = "book" | "course" | "equipment";
export type AffiliatePlatform = "Amazon" | "Udemy" | "Coursera" | (string & {});

export type LocalizedResourceText = Record<Locale, string>;

export type RecommendedResource = {
  id: string;
  title: LocalizedResourceText;
  description: LocalizedResourceText;
  certificationSlug: string;
  type: RecommendedResourceType;
  language: Locale | "multilingual";
  imageUrl?: string;
  affiliateUrl: string;
  platform: AffiliatePlatform;
  displayOrder: number;
  active: boolean;
};

export const recommendedCertificationOrder = [
  { slug: "ccna", label: "CCNA" },
  { slug: "comptia-security-plus", label: "CompTIA Security+" },
  { slug: "comptia-a-plus", label: "CompTIA A+" },
  { slug: "aws", label: "AWS" },
  { slug: "azure", label: "Azure" },
  { slug: "cissp", label: "CISSP" },
  { slug: "ceh", label: "CEH" },
  { slug: "itil", label: "ITIL" },
  { slug: "icdl", label: "ICDL" },
  { slug: "pmp", label: "PMP" },
] as const;

/**
 * Catalogo modificabile senza intervenire nei componenti grafici.
 * Lasciato intenzionalmente vuoto: aggiungere qui soltanto prodotti e URL
 * affiliati reali e verificati. Gli elementi disattivati (`active: false`)
 * non vengono mostrati nella pagina.
 */
export const recommendedResources: RecommendedResource[] = [];
