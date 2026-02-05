// src/content/hubs/vendors/registry.ts
import type { Locale } from "@/lib/i18n";

/**
 * VendorCard
 * - slug: deve corrispondere a un hubSlug reale (presente in HUBS_BY_SLUG)
 * - title/description/badge: multilingua per UI
 */
export type VendorCard = {
  slug: string;
  title: Record<Locale, string>;
  description?: Record<Locale, string>;
  badge?: Record<Locale, string>; // ✅ aggiunto per mostrare etichetta in UI
};

/**
 * Lista vendor mostrati in:
 * - /hub/vendors
 * - /{lang}/hub/vendors
 */
export const VENDORS: VendorCard[] = [
  {
    slug: "google",
    title: {
      it: "Google",
      en: "Google",
      fr: "Google",
      es: "Google",
    },
    description: {
      it: "Percorsi e certificazioni Google (Cloud e non solo).",
      en: "Google learning paths and certifications (Cloud and more).",
      fr: "Parcours et certifications Google (Cloud et plus).",
      es: "Rutas y certificaciones de Google (Cloud y más).",
    },
    badge: {
      it: "Cloud · Data · AI",
      en: "Cloud · Data · AI",
      fr: "Cloud · Data · IA",
      es: "Cloud · Datos · IA",
    },
  },

  // Quando aggiungi altri vendor, assicurati che esista l'hub con lo stesso slug:
  // { slug: "aws", title: {...}, description: {...}, badge: {...} }
];
