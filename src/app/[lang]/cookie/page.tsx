// src/app/[lang]/cookie/page.tsx
import type { Metadata } from 'next';

type Lang = 'it' | 'en' | 'fr' | 'es';
const ALL: Lang[] = ['it', 'en', 'fr', 'es'];

// Se preferisci, leggi la base URL da env (NEXT_PUBLIC_SITE_URL)
const SITE = 'https://www.certifyquiz.com';

// Mapping dei path per lingua (qui uso /cookie ovunque)
const PATH_BY_LANG: Record<Lang, string> = {
  it: '/it/cookie',
  en: '/en/cookie',
  fr: '/fr/cookie',
  es: '/es/cookie',
};

const T = {
  title: {
    it: 'Cookie Policy',
    en: 'Cookie Policy',
    fr: 'Politique relative aux cookies',
    es: 'Política de Cookies',
  },
  updated: {
    it: 'Ultimo aggiornamento:',
    en: 'Last updated:',
    fr: 'Dernière mise à jour :',
    es: 'Última actualización:',
  },
  intro: {
    it: 'Questa Cookie Policy spiega come CertifyQuiz utilizza i cookie e tecnologie simili sul sito.',
    en: 'This Cookie Policy explains how CertifyQuiz uses cookies and similar technologies on the site.',
    fr: 'La présente politique en matière de cookies explique comment CertifyQuiz utilise les cookies et technologies similaires sur le site.',
    es: 'Esta Política de Cookies explica cómo CertifyQuiz utiliza cookies y tecnologías similares en el sitio.',
  },
  whatAre: {
    it: 'Cosa sono i cookie?',
    en: 'What are cookies?',
    fr: 'Que sont les cookies ?',
    es: '¿Qué son las cookies?',
  },
  whatAreTxt: {
    it: 'I cookie sono piccoli file di testo memorizzati sul dispositivo dell’utente per migliorare la navigazione e raccogliere informazioni sull’uso del sito.',
    en: 'Cookies are small text files stored on the user’s device to improve browsing and collect information about site usage.',
    fr: 'Les cookies sont de petits fichiers texte stockés sur l’appareil de l’utilisateur pour améliorer la navigation et recueillir des informations sur l’utilisation du site.',
    es: 'Las cookies son pequeños archivos de texto almacenados en el dispositivo del usuario para mejorar la navegación y recopilar información sobre el uso del sitio.',
  },
  types: {
    it: 'Tipi di cookie utilizzati',
    en: 'Types of cookies used',
    fr: 'Types de cookies utilisés',
    es: 'Tipos de cookies utilizados',
  },
  typesTxt: {
    it: '• Cookie tecnici: necessari al funzionamento del sito.\n• Cookie analitici: per raccogliere dati statistici anonimi.\n• Cookie di terze parti: per funzionalità aggiuntive (es. social media, video, pubblicità).',
    en: '• Technical cookies: necessary for site functionality.\n• Analytics cookies: to collect anonymous statistical data.\n• Third-party cookies: for additional features (e.g. social media, videos, advertising).',
    fr: '• Cookies techniques : nécessaires au fonctionnement du site.\n• Cookies analytiques : pour collecter des données statistiques anonymes.\n• Cookies tiers : pour des fonctionnalités supplémentaires (par ex. réseaux sociaux, vidéos, publicité).',
    es: '• Cookies técnicos: necesarios para el funcionamiento del sitio.\n• Cookies analíticos: para recopilar datos estadísticos anónimos.\n• Cookies de terceros: para funcionalidades adicionales (p. ej., redes sociales, videos, publicidad).',
  },
  manage: {
    it: 'Gestione dei cookie',
    en: 'Managing cookies',
    fr: 'Gestion des cookies',
    es: 'Gestión de cookies',
  },
  manageTxt: {
    it: 'Puoi gestire le preferenze sui cookie tramite le impostazioni del browser o attraverso il banner di consenso. Disattivando alcuni cookie, il sito potrebbe non funzionare correttamente.',
    en: 'You can manage cookie preferences through browser settings or via the consent banner. Disabling some cookies may cause the site to not function properly.',
    fr: 'Vous pouvez gérer vos préférences en matière de cookies via les paramètres du navigateur ou via la bannière de consentement. La désactivation de certains cookies peut affecter le fonctionnement du site.',
    es: 'Puedes gestionar tus preferencias de cookies mediante la configuración del navegador o a través del banner de consentimiento. Desactivar algunas cookies puede hacer que el sitio no funcione correctamente.',
  },
  changes: {
    it: 'Modifiche alla Cookie Policy',
    en: 'Changes to the Cookie Policy',
    fr: 'Modifications de la politique de cookies',
    es: 'Cambios en la Política de Cookies',
  },
  changesTxt: {
    it: 'CertifyQuiz può modificare la presente Cookie Policy in qualsiasi momento. Le modifiche saranno pubblicate su questa pagina.',
    en: 'CertifyQuiz may change this Cookie Policy at any time. Changes will be posted on this page.',
    fr: 'CertifyQuiz peut modifier la présente politique en matière de cookies à tout moment. Les changements seront publiés sur cette page.',
    es: 'CertifyQuiz puede modificar esta Política de Cookies en cualquier momento. Los cambios se publicarán en esta página.',
  },
  contacts: {
    it: 'Contatti',
    en: 'Contacts',
    fr: 'Contacts',
    es: 'Contactos',
  },
  contactsTxt: {
    it: 'Per domande sulla Cookie Policy: privacy@certifyquiz.com.',
    en: 'For questions about the Cookie Policy: privacy@certifyquiz.com.',
    fr: 'Pour toute question concernant la politique de cookies : privacy@certifyquiz.com.',
    es: 'Para consultas sobre la Política de Cookies: privacy@certifyquiz.com.',
  },
} as const;

function getLabel<T extends Record<string, string>>(obj: T, lang: Lang) {
  return obj[lang] ?? obj.it ?? Object.values(obj)[0];
}

export async function generateMetadata(
  { params }: { params: { lang: Lang } }
): Promise<Metadata> {
  const lang = (ALL.includes(params.lang) ? params.lang : 'it') as Lang;

  // alternates/hreflang
  const languages: Record<string, string> = Object.fromEntries(
    ALL.map(l => [l, PATH_BY_LANG[l]])
  );

  return {
    title: `${getLabel(T.title, lang)} | CertifyQuiz`,
    description: {
      it: 'Cookie Policy di CertifyQuiz: uso dei cookie tecnici, analitici e di terze parti, gestione preferenze e contatti.',
      en: 'CertifyQuiz Cookie Policy: use of technical, analytics and third-party cookies, preference management and contacts.',
      fr: 'Politique relative aux cookies de CertifyQuiz : cookies techniques, analytiques et tiers, gestion des préférences et contacts.',
      es: 'Política de Cookies de CertifyQuiz: cookies técnicos, analíticos y de terceros, gestión de preferencias y contactos.',
    }[lang],
    metadataBase: new URL(SITE),
    alternates: {
      canonical: PATH_BY_LANG[lang],
      languages,
    },
  };
}

export default function CookiePage({ params }: { params: { lang: Lang } }) {
  const lang = (ALL.includes(params.lang) ? params.lang : 'it') as Lang;
  const today = new Date().toISOString().slice(0, 10);

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 text-slate-800">
      <h1 className="text-2xl font-bold">{getLabel(T.title, lang)}</h1>
      <p className="mt-1 text-xs text-slate-500">
        {getLabel(T.updated, lang)} {today}
      </p>

      <Section>{getLabel(T.intro, lang)}</Section>
      <Section title={getLabel(T.whatAre, lang)}>{getLabel(T.whatAreTxt, lang)}</Section>
      <Section title={getLabel(T.types, lang)}>
        {getLabel(T.typesTxt, lang).split('\n').map((line, i) => (
          <p key={i} className="mb-1">{line}</p>
        ))}
      </Section>
      <Section title={getLabel(T.manage, lang)}>{getLabel(T.manageTxt, lang)}</Section>
      <Section title={getLabel(T.changes, lang)}>{getLabel(T.changesTxt, lang)}</Section>
      <Section title={getLabel(T.contacts, lang)}>{getLabel(T.contactsTxt, lang)}</Section>
    </main>
  );
}

function Section({ title, children }: { title?: string; children?: React.ReactNode }) {
  return (
    <section className="mt-6">
      {title && <h2 className="text-lg font-semibold">{title}</h2>}
      {children && <div className="mt-2 text-sm leading-6 whitespace-pre-wrap">{children}</div>}
    </section>
  );
}
