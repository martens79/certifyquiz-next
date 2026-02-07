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
  badge?: Record<Locale, string>; // etichetta breve mostrata in UI
};

/**
 * Lista vendor mostrati in:
 * - /hub/vendors
 * - /{lang}/hub/vendors
 */
export const VENDORS: VendorCard[] = [
  // -------------------------
  // Google
  // -------------------------
  {
    slug: "google",
    title: { it: "Google", en: "Google", fr: "Google", es: "Google" },
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

  // -------------------------
  // Microsoft
  // -------------------------
  {
    slug: "microsoft",
    title: { it: "Microsoft", en: "Microsoft", fr: "Microsoft", es: "Microsoft" },
    description: {
      it: "Azure, Security, Data e Developer: percorsi Microsoft in crescita.",
      en: "Azure, Security, Data and Developer: growing Microsoft paths.",
      fr: "Azure, Sécurité, Data et Développement : parcours Microsoft en croissance.",
      es: "Azure, Seguridad, Datos y Desarrollo: rutas Microsoft en crecimiento.",
    },
    badge: {
      it: "Azure · Security · Data",
      en: "Azure · Security · Data",
      fr: "Azure · Sécurité · Data",
      es: "Azure · Seguridad · Datos",
    },
  },

  // -------------------------
  // AWS
  // -------------------------
  {
    slug: "aws",
    title: { it: "AWS", en: "AWS", fr: "AWS", es: "AWS" },
    description: {
      it: "Percorsi AWS: foundational, architecting, DevOps e specialità (in crescita).",
      en: "AWS paths: foundational, architecting, DevOps and specialties (growing).",
      fr: "Parcours AWS : débutant, architecture, DevOps et spécialités (en croissance).",
      es: "Rutas AWS: foundational, arquitectura, DevOps y especialidades (en crecimiento).",
    },
    badge: {
      it: "Cloud · Architecture · DevOps",
      en: "Cloud · Architecture · DevOps",
      fr: "Cloud · Architecture · DevOps",
      es: "Cloud · Arquitectura · DevOps",
    },
  },

  // -------------------------
  // Cisco
  // -------------------------
  {
    slug: "cisco",
    title: { it: "Cisco", en: "Cisco", fr: "Cisco", es: "Cisco" },
    description: {
      it: "Networking e security: CCST, CCNA e percorsi Cisco (in crescita).",
      en: "Networking and security: CCST, CCNA and Cisco paths (growing).",
      fr: "Réseau et sécurité : CCST, CCNA et parcours Cisco (en croissance).",
      es: "Redes y seguridad: CCST, CCNA y rutas Cisco (en crecimiento).",
    },
    badge: {
      it: "Networking · Security · CCNA",
      en: "Networking · Security · CCNA",
      fr: "Réseau · Sécurité · CCNA",
      es: "Redes · Seguridad · CCNA",
    },
  },

  // -------------------------
  // IBM
  // -------------------------
  {
    slug: "ibm",
    title: { it: "IBM", en: "IBM", fr: "IBM", es: "IBM" },
    description: {
      it: "IBM Cloud e percorsi Data/AI: contenuti in arrivo.",
      en: "IBM Cloud and Data/AI paths: content coming soon.",
      fr: "IBM Cloud et parcours Data/IA : contenu bientôt disponible.",
      es: "IBM Cloud y rutas de Datos/IA: contenido próximamente.",
    },
    badge: {
      it: "Cloud · Data · AI",
      en: "Cloud · Data · AI",
      fr: "Cloud · Data · IA",
      es: "Cloud · Datos · IA",
    },
  },

  // -------------------------
  // Oracle
  // -------------------------
  {
    slug: "oracle",
    title: { it: "Oracle", en: "Oracle", fr: "Oracle", es: "Oracle" },
    description: {
      it: "Database, SQL e Oracle Cloud: percorsi e quiz (in crescita).",
      en: "Databases, SQL and Oracle Cloud: paths and quizzes (growing).",
      fr: "Bases de données, SQL et Oracle Cloud : parcours et quiz (en croissance).",
      es: "Bases de datos, SQL y Oracle Cloud: rutas y quizzes (en crecimiento).",
    },
    badge: {
      it: "SQL · Database · Cloud",
      en: "SQL · Database · Cloud",
      fr: "SQL · Base de données · Cloud",
      es: "SQL · Base de datos · Cloud",
    },
  },
];
