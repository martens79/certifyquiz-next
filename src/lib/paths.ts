// src/lib/paths.ts
export type Locale = 'it' | 'en' | 'fr' | 'es';

export const certPath = (lang: Locale, slug: string): string => {
  switch (lang) {
    case 'it': return `/it/certificazioni/${slug}`;
    case 'en': return `/en/certifications/${slug}`;
    case 'fr': return `/fr/certifications/${slug}`;
    case 'es': return `/es/certificaciones/${slug}`;
    default:   return `/it/certificazioni/${slug}`; // fallback safe
  }
};
