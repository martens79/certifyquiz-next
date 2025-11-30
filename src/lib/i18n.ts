// === Lingue supportate ===
export const locales = ['it', 'en', 'fr', 'es'] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = 'it';

// === Utility base ===
export function isLocale(x: string): x is Locale {
  // niente any: TS sa che x è string
  return (locales as readonly string[]).includes(x);
}

/** Aggiunge il prefisso lingua a un path relativo ("/" incluso). */
export function withLang(lang: Locale, path: string) {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `/${lang}${clean === '/index' ? '' : clean}`;
}

/** Estrae la lingua dal pathname (es. "/it/certificazioni") */
export function langFromPathname(pathname: string | null | undefined): Locale {
  const seg = (pathname ?? '').split('/').filter(Boolean)[0];
  return seg && isLocale(seg) ? seg : defaultLocale;
}

/**
 * Cambia lingua mantenendo path (senza il prefisso lingua),
 * con normalizzazione degli slash finali.
 */
export function switchLangPath(
  pathname: string,
  nextLang: Locale,
  search = '',
  hash = ''
): string {
  const parts = pathname.split('/').filter(Boolean);
  const first = parts[0];
  const rest = first && isLocale(first) ? parts.slice(1) : parts;
  let newPath = `/${nextLang}/${rest.join('/')}`.replace(/\/+$/, '/').replace(/\/$/, '');
  if (newPath === `/${nextLang}`) newPath = `/${nextLang}/`;
  return `${newPath}${search || ''}${hash || ''}`;
}

// === Tipi utili i18n ===
export type Localized<T = string> = Partial<Record<Locale, T>>;

// === Dizionario (testi UI + SEO) ===
export type BaseDict = {
  certifications: string;
  blog: string;
  pricing: string;
  login: string;
  start: string;
  privacy: string;
  terms: string;
  cookies: string;
  contact: string;
};

export type HeaderA11yExtras = {
  skipToContent?: string;
  mainNavigation?: string;
  openMenu?: string;
  closeMenu?: string;
};

export type FooterExtras = {
  newsletterTitle?: string;
  newsletterBlurb?: string;
  newsletterPlaceholder?: string;
  newsletterCta?: string;
  newsletterOk?: string;
  newsletterErr?: string;
  links?: string;
  rights?: string;
};

export type SeoExtras = {
  seo?: {
    titles?: Record<string, string>;
    descriptions?: Record<string, string>;
  };
};

export type NavGroup = {
  nav: {
    privacy: string;
    terms: string;
    cookies: string;
    contact: string;
  };
};

export type LocaleDict = BaseDict & HeaderA11yExtras & FooterExtras & SeoExtras & NavGroup;

// === Dizionario localizzato ===
export const dict: Record<Locale, LocaleDict> = {
  it: {
    certifications: 'Certificazioni',
    blog: 'Blog',
    pricing: 'Premium',
    login: 'Accedi',
    start: 'Inizia',
    privacy: 'Privacy',
    terms: 'Termini',
    cookies: 'Cookie',
    contact: 'Contatti',
    skipToContent: 'Salta al contenuto',
    mainNavigation: 'Navigazione principale',
    openMenu: 'Apri menu',
    closeMenu: 'Chiudi menu',
    newsletterTitle: 'Newsletter',
    newsletterBlurb: 'Iscriviti per aggiornamenti su nuove certificazioni e funzionalità.',
    newsletterPlaceholder: 'you@example.com',
    newsletterCta: 'Iscriviti',
    newsletterOk: 'Iscrizione completata!',
    newsletterErr: 'Si è verificato un errore. Riprova.',
    links: 'Link utili',
    rights: 'Tutti i diritti riservati.',
    seo: {
      titles: {
        '/': 'CertifyQuiz — Quiz per certificazioni IT',
        '/certificazioni': 'Tutte le certificazioni IT',
        '/blog': 'Articoli e guide sul mondo IT',
      },
      descriptions: {
        '/':
          'Allenati alle certificazioni IT con quiz reali e spiegazioni passo-passo per CompTIA, Cisco, AWS, Azure e molte altre.',
        '/certificazioni':
          'Scopri tutte le certificazioni con quiz e spiegazioni dettagliate.',
        '/blog':
          'Leggi articoli e consigli per prepararti al meglio alle certificazioni IT più richieste.',
      },
    },
    nav: { privacy: 'Privacy', terms: 'Termini', cookies: 'Cookie', contact: 'Contatti' },
  },
  en: {
    certifications: 'Certifications',
    blog: 'Blog',
    pricing: 'Premium',
    login: 'Log in',
    start: 'Start',
    privacy: 'Privacy',
    terms: 'Terms',
    cookies: 'Cookies',
    contact: 'Contact',
    skipToContent: 'Skip to content',
    mainNavigation: 'Main navigation',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    newsletterTitle: 'Newsletter',
    newsletterBlurb: 'Subscribe for updates on new certifications and features.',
    newsletterPlaceholder: 'you@example.com',
    newsletterCta: 'Subscribe',
    newsletterOk: 'Subscribed!',
    newsletterErr: 'Something went wrong. Please try again.',
    links: 'Useful links',
    rights: 'All rights reserved.',
    seo: {
      titles: {
        '/': 'CertifyQuiz — IT Certification Practice Exams',
        '/certificazioni': 'All IT Certifications',
        '/blog': 'Articles and Guides for IT Certifications',
      },
      descriptions: {
        '/':
          'Prepare for IT certifications with realistic quizzes and detailed explanations for CompTIA, Cisco, AWS, Azure and more.',
        '/certificazioni': 'Explore all certifications with quizzes and explanations.',
        '/blog': 'Read articles and tips to pass the most requested IT certifications.',
      },
    },
    nav: { privacy: 'Privacy', terms: 'Terms', cookies: 'Cookies', contact: 'Contact' },
  },
  fr: {
    certifications: 'Certifications',
    blog: 'Blog',
    pricing: 'Premium',
    login: 'Se connecter',
    start: 'Commencer',
    privacy: 'Confidentialité',
    terms: 'Conditions',
    cookies: 'Cookies',
    contact: 'Contact',
    skipToContent: 'Aller au contenu',
    mainNavigation: 'Navigation principale',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
    newsletterTitle: 'Newsletter',
    newsletterBlurb:
      'Abonnez-vous pour recevoir des mises à jour sur les certifications et fonctionnalités.',
    newsletterPlaceholder: 'vous@example.com',
    newsletterCta: 'S’abonner',
    newsletterOk: 'Abonnement réussi !',
    newsletterErr: 'Une erreur est survenue. Réessayez.',
    links: 'Liens utiles',
    rights: 'Tous droits réservés.',
    seo: {
      titles: {
        '/': 'CertifyQuiz — Tests pour certifications IT',
        '/certificazioni': 'Toutes les certifications IT',
        '/blog': 'Articles et guides sur les certifications IT',
      },
      descriptions: {
        '/':
          'Préparez vos certifications IT avec des quiz réalistes et des explications détaillées pour CompTIA, Cisco, AWS, Azure et plus.',
        '/certificazioni': 'Découvrez toutes les certifications avec quiz et explications.',
        '/blog': 'Lisez des articles et des conseils pour réussir vos certifications IT.',
      },
    },
    nav: { privacy: 'Confidentialité', terms: 'Conditions', cookies: 'Cookies', contact: 'Contact' },
  },
  es: {
    certifications: 'Certificaciones',
    blog: 'Blog',
    pricing: 'Premium',
    login: 'Acceder',
    start: 'Empezar',
    privacy: 'Privacidad',
    terms: 'Términos',
    cookies: 'Cookies',
    contact: 'Contacto',
    skipToContent: 'Saltar al contenido',
    mainNavigation: 'Navegación principal',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    newsletterTitle: 'Boletín',
    newsletterBlurb:
      'Suscríbete para recibir novedades sobre certificaciones y funciones.',
    newsletterPlaceholder: 'tú@example.com',
    newsletterCta: 'Suscribirse',
    newsletterOk: '¡Suscripción completada!',
    newsletterErr: 'Ha ocurrido un error. Inténtalo de nuevo.',
    links: 'Enlaces útiles',
    rights: 'Todos los derechos reservados.',
    seo: {
      titles: {
        '/': 'CertifyQuiz — Tests de certificaciones IT',
        '/certificazioni': 'Todas las certificaciones IT',
        '/blog': 'Artículos y guías sobre certificaciones IT',
      },
      descriptions: {
        '/':
          'Entrena con quizzes realistas y explicaciones detalladas para CompTIA, Cisco, AWS, Azure y más.',
        '/certificazioni': 'Explora todas las certificaciones con quizzes y explicaciones.',
        '/blog':
          'Lee artículos y consejos para aprobar las certificaciones IT más demandadas.',
      },
    },
    nav: { privacy: 'Privacidad', terms: 'Términos', cookies: 'Cookies', contact: 'Contacto' },
  },
};

// === Slug legal localizzati (link consistenti) ===
export const LEGAL_PAGES = {
  privacy: { it: 'privacy', en: 'privacy', fr: 'confidentialite', es: 'privacidad' },
  terms: { it: 'termini', en: 'terms', fr: 'conditions', es: 'terminos' },
  cookies: { it: 'cookie', en: 'cookies', fr: 'cookies', es: 'cookies' },
  contact: { it: 'contatti', en: 'contact', fr: 'contact', es: 'contacto' },
} as const;

export type LegalKey = keyof typeof LEGAL_PAGES;

export function legalPath(lang: Locale, key: LegalKey) {
  return `/${lang}/${LEGAL_PAGES[key][lang]}`;
}

// === Helper dizionario ===
export function getDict(lang: Locale) {
  return dict[lang];
}

// === Mappe path “di sistema” (coerenti col progetto) ===
export const LIST_BY_LANG: Record<Locale, string> = {
  it: '/it/certificazioni',
  en: '/en/certifications',
  fr: '/fr/certifications',
  es: '/es/certificaciones',
};

export function routeCertList(lang: Locale) {
  return LIST_BY_LANG[lang];
}

export function routeCertDetail(lang: Locale, slug: string) {
  return `/${lang}/certificazioni/${slug}`; // in EN/FR/ES le route sono mappate via App Router
}

export function routeBlog(lang: Locale) {
  return `/${lang}/blog`;
}

export function routeContact(lang: Locale) {
  return legalPath(lang, 'contact');
}

// === SEO helpers ===
export function getSeoTitle(lang: Locale, pathnameKey: '/' | '/certificazioni' | '/blog'): string | undefined {
  return dict[lang].seo?.titles?.[pathnameKey];
}

export function getSeoDescription(
  lang: Locale,
  pathnameKey: '/' | '/certificazioni' | '/blog'
): string | undefined {
  return dict[lang].seo?.descriptions?.[pathnameKey];
}

// === Helper multilingua di base ===
export function getLabel<T extends string>(
  obj: Partial<Record<Locale, T>>,
  lang: Locale
): T | '' {
  return (obj[lang] ?? obj.it ?? obj.en ?? '') as T | '';
}
