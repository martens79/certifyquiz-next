export const locales = ["it", "en", "fr", "es"] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = "it";

export function isLocale(x: string): x is Locale {
  return (locales as readonly string[]).includes(x);
}

// Utility per creare URL localizzate
export function withLang(lang: Locale, path: string) {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `/${lang}${clean === "/index" ? "" : clean}`;
}

// Etichette minime per la nav
export const dict = {
  it: {
    certifications: "Certificazioni",
    blog: "Blog",
    pricing: "Prezzi",
    login: "Accedi",
    start: "Inizia",
    privacy: "Privacy",
    terms: "Termini",
    cookies: "Cookie",
    contact: "Contatti",
  },
  en: {
    certifications: "Certifications",
    blog: "Blog",
    pricing: "Pricing",
    login: "Log in",
    start: "Start",
    privacy: "Privacy",
    terms: "Terms",
    cookies: "Cookies",
    contact: "Contact",
  },
  fr: {
    certifications: "Certifications",
    blog: "Blog",
    pricing: "Tarifs",
    login: "Se connecter",
    start: "Commencer",
    privacy: "Confidentialité",
    terms: "Conditions",
    cookies: "Cookies",
    contact: "Contact",
  },
  es: {
    certifications: "Certificaciones",
    blog: "Blog",
    pricing: "Precios",
    login: "Acceder",
    start: "Empezar",
    privacy: "Privacidad",
    terms: "Términos",
    cookies: "Cookies",
    contact: "Contacto",
  },
} as const;
