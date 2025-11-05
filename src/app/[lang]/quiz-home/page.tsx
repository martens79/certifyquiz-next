// src/app/[lang]/quiz-home/page.tsx
import type { Metadata } from 'next';
import QuizHome from '@/components/QuizHome';
import StructuredData from '@/components/StructuredData';

type Locale = 'it' | 'en' | 'fr' | 'es';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.certifyquiz.com';
const ogLocale: Record<Locale, string> = { it: 'it_IT', en: 'en_US', fr: 'fr_FR', es: 'es_ES' };

const getLabel = (d: Partial<Record<Locale, string>>, lang: Locale) =>
  d[lang] ?? d.it ?? d.en ?? d.fr ?? d.es ?? '';

/* ── SEO: generateMetadata ─────────────────────────────────────────────────── */
export async function generateMetadata(
  { params }: { params: { lang: Locale } }
): Promise<Metadata> {
  const lang = (['it', 'en', 'fr', 'es'].includes(params.lang) ? params.lang : 'it') as Locale;

  const title = getLabel(
    {
      it: 'Quiz online per certificazioni IT — CertifyQuiz',
      en: 'Online IT Certification Quizzes — CertifyQuiz',
      fr: 'Quiz en ligne pour certifications IT — CertifyQuiz',
      es: 'Cuestionarios online para certificaciones IT — CertifyQuiz',
    },
    lang
  );

  const description = getLabel(
    {
      it: 'Accedi a tutte le categorie di quiz IT: sicurezza, reti, cloud, database, programmazione e altro. Scegli la certificazione e inizia subito.',
      en: 'Access all IT quiz categories: security, networking, cloud, databases, programming and more. Choose your certification and start now.',
      fr: 'Accédez à toutes les catégories de quiz IT : sécurité, réseaux, cloud, bases de données, programmation, etc.',
      es: 'Accede a todas las categorías de cuestionarios IT: seguridad, redes, nube, bases de datos, programación y más.',
    },
    lang
  );

  const canonical = `${SITE}/${lang}/quiz-home`;

  return {
    metadataBase: new URL(SITE),
    title,
    description,
    alternates: {
      canonical,
      languages: {
        it: `${SITE}/it/quiz-home`,
        en: `${SITE}/en/quiz-home`,
        fr: `${SITE}/fr/quiz-home`,
        es: `${SITE}/es/quiz-home`,
        'x-default': `${SITE}/en/quiz-home`,
      },
    },
    openGraph: {
      url: canonical,
      type: 'website',
      title,
      description,
      siteName: 'CertifyQuiz',
      locale: ogLocale[lang],
      images: [{ url: `${SITE}/og/quiz-home-${lang}.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE}/og/quiz-home-${lang}.png`],
      site: '@CertifyQuiz',
    },
    robots: { index: true, follow: true },
  };
}

/* ── Pagina server: JSON-LD + UI ──────────────────────────────────────────── */
export default function Page({ params }: { params: { lang: Locale } }) {
  const lang = (['it', 'en', 'fr', 'es'].includes(params.lang) ? params.lang : 'it') as Locale;

  // Label localizzate per le categorie
  const catLabel: Record<
    string,
    Record<Locale, string>
  > = {
    base: { it: 'Base', en: 'Fundamentals', fr: 'Base', es: 'Básico' },
    sicurezza: { it: 'Sicurezza', en: 'Security', fr: 'Sécurité', es: 'Seguridad' },
    reti: { it: 'Reti', en: 'Networking', fr: 'Réseaux', es: 'Redes' },
    cloud: { it: 'Cloud', en: 'Cloud', fr: 'Cloud', es: 'Nube' },
    database: { it: 'Database', en: 'Database', fr: 'Base de données', es: 'Base de datos' },
    programmazione: { it: 'Programmazione', en: 'Programming', fr: 'Programmation', es: 'Programación' },
    'virtualizzazione': { it: 'Virtualizzazione', en: 'Virtualization', fr: 'Virtualisation', es: 'Virtualización' },
    'intelligenza-artificiale': {
      it: 'Intelligenza Artificiale',
      en: 'Artificial Intelligence',
      fr: 'Intelligence Artificielle',
      es: 'Inteligencia Artificial',
    },
  };

  // Slug/ancore (se hai pagine hub vere, sostituisci con le URL delle hub)
  const categoriesOrder = [
    'base',
    'sicurezza',
    'reti',
    'cloud',
    'database',
    'programmazione',
    'virtualizzazione',
    'intelligenza-artificiale',
  ] as const;

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/${lang}` },
      { '@type': 'ListItem', position: 2, name: 'Quiz', item: `${SITE}/${lang}/quiz-home` },
    ],
  };

  const categoriesItemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Quiz categories',
    itemListOrder: 'http://schema.org/ItemListOrderAscending',
    numberOfItems: categoriesOrder.length,
    itemListElement: categoriesOrder.map((key, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: catLabel[key][lang] || catLabel[key].it,
      url: `${SITE}/${lang}/quiz-home#${key}`, // meglio puntare a pagine hub se esistono
    })),
  };

  return (
    <>
      <StructuredData id="ld-breadcrumb-quizhome" data={breadcrumbLd} />
      <StructuredData id="ld-itemlist-quiz-categories" data={categoriesItemListLd} />
      <QuizHome lang={lang} />
    </>
  );
}
