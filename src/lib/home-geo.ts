import type { Locale } from './paths';
export const COUNTRY_KEY = 'cq_home_country_v1';
export const COUNTRIES = ['general', 'IT', 'US', 'ES', 'MX'] as const;
export type Country = typeof COUNTRIES[number];
export function normalizeCountry(value: unknown): Country {
  return COUNTRIES.includes(value as Country) ? value as Country : 'general';
}
// Editorial hypotheses, not market rankings. EIPASS awaits verified release.
export const GEO_CERTS: Record<Country, readonly string[]> = {
  general: ['ccna', 'aws-ai-practitioner'],
  IT: ['ccna', 'cisco-ccst-cybersecurity'],
  US: ['ccna', 'security-plus'],
  ES: ['aws-ai-practitioner', 'ccna'],
  MX: ['cisco-ccst-cybersecurity', 'ccna'],
};
export const GEO_COPY: Record<Locale, { title: string; change: string; general: string; note: string }> = {
  it: { title: 'Percorsi da esplorare', change: 'Cambia paese', general: 'Generale', note: 'Suggerimenti editoriali; scegli il paese che ti interessa.' },
  en: { title: 'Paths to explore', change: 'Change country', general: 'General', note: 'Editorial suggestions; choose the country that interests you.' },
  fr: { title: 'Parcours à explorer', change: 'Changer de pays', general: 'Général', note: 'Suggestions éditoriales ; choisissez le pays qui vous intéresse.' },
  es: { title: 'Rutas para explorar', change: 'Cambiar país', general: 'General', note: 'Sugerencias editoriales; elige el país que te interesa.' },
};
