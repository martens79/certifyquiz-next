// src/app/[lang]/terms/page.tsx
import type { Metadata } from 'next';

type Lang = 'it' | 'en' | 'fr' | 'es';
const ALL: Lang[] = ['it', 'en', 'fr', 'es'];
const SITE = 'https://www.certifyquiz.com';

const PATH_BY_LANG: Record<Lang, string> = {
  it: '/it/terms',
  en: '/en/terms',
  fr: '/fr/terms',
  es: '/es/terms',
};

const T = {
  title: {
    it: 'Termini e Condizioni d’Uso',
    en: 'Terms and Conditions of Use',
    fr: 'Conditions générales d’utilisation',
    es: 'Términos y Condiciones de Uso',
  },
  updated: {
    it: 'Ultimo aggiornamento:',
    en: 'Last updated:',
    fr: 'Dernière mise à jour :',
    es: 'Última actualización:',
  },
  intro: {
    it: 'Questi Termini e Condizioni regolano l’uso di CertifyQuiz e dei servizi offerti. Accedendo o utilizzando il sito, accetti integralmente questi termini.',
    en: 'These Terms and Conditions govern the use of CertifyQuiz and its services. By accessing or using the site, you fully accept these terms.',
    fr: 'Ces Conditions générales régissent l’utilisation de CertifyQuiz et de ses services. En accédant ou en utilisant le site, vous acceptez pleinement ces conditions.',
    es: 'Estos Términos y Condiciones regulan el uso de CertifyQuiz y sus servicios. Al acceder o usar el sitio, aceptas íntegramente estos términos.',
  },
  service: { it: 'Servizi offerti', en: 'Services provided', fr: 'Services fournis', es: 'Servicios ofrecidos' },
  serviceTxt: {
    it: 'CertifyQuiz offre quiz e contenuti formativi multilingua per la preparazione a certificazioni. Alcuni contenuti sono gratuiti, altri richiedono un abbonamento o un acquisto singolo.',
    en: 'CertifyQuiz provides multilingual quizzes and learning content for certification preparation. Some content is free, others require a subscription or one-time purchase.',
    fr: 'CertifyQuiz propose des quiz et du contenu pédagogique multilingue pour la préparation aux certifications. Certains contenus sont gratuits, d’autres nécessitent un abonnement ou un achat unique.',
    es: 'CertifyQuiz ofrece cuestionarios y contenido educativo multilingüe para la preparación de certificaciones. Parte del contenido es gratuito, otro requiere suscripción o compra única.',
  },
  registration: { it: 'Registrazione e account', en: 'Registration and account', fr: 'Inscription et compte', es: 'Registro y cuenta' },
  registrationTxt: {
    it: 'Per utilizzare alcune funzionalità è necessario creare un account, fornendo dati veritieri e mantenendoli aggiornati. L’utente è responsabile della sicurezza delle credenziali.',
    en: 'Some features require creating an account, providing truthful information and keeping it updated. Users are responsible for the security of their credentials.',
    fr: 'Certaines fonctionnalités nécessitent la création d’un compte, avec des informations véridiques et à jour. L’utilisateur est responsable de la sécurité de ses identifiants.',
    es: 'Algunas funciones requieren crear una cuenta, proporcionando datos veraces y manteniéndolos actualizados. El usuario es responsable de la seguridad de sus credenciales.',
  },
  payments: { it: 'Pagamenti e rinnovi', en: 'Payments and renewals', fr: 'Paiements et renouvellements', es: 'Pagos y renovaciones' },
  paymentsTxt: {
    it: 'Gli acquisti sono gestiti da fornitori di pagamento terzi. I rinnovi automatici possono essere disattivati in qualsiasi momento nelle impostazioni dell’account.',
    en: 'Purchases are handled by third-party payment providers. Automatic renewals can be disabled at any time in account settings.',
    fr: 'Les achats sont traités par des prestataires de paiement tiers. Les renouvellements automatiques peuvent être désactivés à tout moment dans les paramètres du compte.',
    es: 'Las compras son gestionadas por proveedores de pago externos. Las renovaciones automáticas pueden desactivarse en cualquier momento en la configuración de la cuenta.',
  },
  content: { it: 'Proprietà intellettuale', en: 'Intellectual property', fr: 'Propriété intellectuelle', es: 'Propiedad intelectual' },
  contentTxt: {
    it: 'Tutti i contenuti, marchi e loghi di CertifyQuiz sono protetti da copyright e altre leggi. È vietata la riproduzione non autorizzata.',
    en: 'All content, trademarks, and logos of CertifyQuiz are protected by copyright and other laws. Unauthorized reproduction is prohibited.',
    fr: 'Tous les contenus, marques et logos de CertifyQuiz sont protégés par le droit d’auteur et d’autres lois. La reproduction non autorisée est interdite.',
    es: 'Todo el contenido, marcas y logotipos de CertifyQuiz están protegidos por derechos de autor y otras leyes. La reproducción no autorizada está prohibida.',
  },
  liability: { it: 'Limitazione di responsabilità', en: 'Limitation of liability', fr: 'Limitation de responsabilité', es: 'Limitación de responsabilidad' },
  liabilityTxt: {
    it: 'CertifyQuiz non garantisce l’assenza di errori nei contenuti e non è responsabile di danni derivanti dall’uso del sito.',
    en: 'CertifyQuiz does not guarantee the absence of errors in content and is not liable for damages resulting from site use.',
    fr: 'CertifyQuiz ne garantit pas l’absence d’erreurs dans le contenu et n’est pas responsable des dommages résultant de l’utilisation du site.',
    es: 'CertifyQuiz no garantiza la ausencia de errores en el contenido y no es responsable de los daños derivados del uso del sitio.',
  },
  changes: { it: 'Modifiche ai termini', en: 'Changes to the terms', fr: 'Modifications des conditions', es: 'Cambios en los términos' },
  changesTxt: {
    it: 'Ci riserviamo il diritto di modificare i presenti termini in qualsiasi momento. Le modifiche saranno comunicate sul sito e diventeranno effettive alla pubblicazione.',
    en: 'We reserve the right to modify these terms at any time. Changes will be announced on the site and become effective upon posting.',
    fr: 'Nous nous réservons le droit de modifier ces conditions à tout moment. Les changements seront annoncés sur le site et prendront effet dès leur publication.',
    es: 'Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios se anunciarán en el sitio y serán efectivos desde su publicación.',
  },
  contacts: { it: 'Contatti', en: 'Contacts', fr: 'Contacts', es: 'Contactos' },
  contactsTxt: {
    it: 'Per domande sui Termini e Condizioni: privacy@certifyquiz.com.',
    en: 'For questions about the Terms and Conditions: privacy@certifyquiz.com.',
    fr: 'Pour toute question sur les Conditions générales : privacy@certifyquiz.com.',
    es: 'Para consultas sobre los Términos y Condiciones: privacy@certifyquiz.com.',
  },
} as const;

function getLabel(obj: Record<string, string>, lang: Lang) {
  return obj[lang] ?? obj.it ?? Object.values(obj)[0];
}

export async function generateMetadata(
  { params }: { params: { lang: Lang } }
): Promise<Metadata> {
  const lang = (ALL.includes(params.lang) ? params.lang : 'it') as Lang;
  const languages: Record<string, string> = Object.fromEntries(
    ALL.map(l => [l, PATH_BY_LANG[l]])
  );

  return {
    title: `${getLabel(T.title, lang)} | CertifyQuiz`,
    description: {
      it: 'Termini e Condizioni d’Uso di CertifyQuiz: regole su servizi, account, pagamenti, responsabilità e contatti.',
      en: 'CertifyQuiz Terms and Conditions: rules on services, accounts, payments, liability and contacts.',
      fr: 'Conditions générales d’utilisation de CertifyQuiz : règles sur les services, comptes, paiements, responsabilité et contacts.',
      es: 'Términos y Condiciones de Uso de CertifyQuiz: reglas sobre servicios, cuentas, pagos, responsabilidad y contactos.',
    }[lang],
    metadataBase: new URL(SITE),
    alternates: {
      canonical: PATH_BY_LANG[lang],
      languages,
    },
  };
}

export default function TermsPage({ params }: { params: { lang: Lang } }) {
  const lang = (ALL.includes(params.lang) ? params.lang : 'it') as Lang;
  const today = new Date().toISOString().slice(0, 10);

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 text-slate-800">
      <h1 className="text-2xl font-bold">{getLabel(T.title, lang)}</h1>
      <p className="mt-1 text-xs text-slate-500">
        {getLabel(T.updated, lang)} {today}
      </p>

      <Section title={getLabel(T.intro, lang)} />
      <Section title={getLabel(T.service, lang)}>{getLabel(T.serviceTxt, lang)}</Section>
      <Section title={getLabel(T.registration, lang)}>{getLabel(T.registrationTxt, lang)}</Section>
      <Section title={getLabel(T.payments, lang)}>{getLabel(T.paymentsTxt, lang)}</Section>
      <Section title={getLabel(T.content, lang)}>{getLabel(T.contentTxt, lang)}</Section>
      <Section title={getLabel(T.liability, lang)}>{getLabel(T.liabilityTxt, lang)}</Section>
      <Section title={getLabel(T.changes, lang)}>{getLabel(T.changesTxt, lang)}</Section>
      <Section title={getLabel(T.contacts, lang)}>{getLabel(T.contactsTxt, lang)}</Section>

      <section className="mt-8 border-t pt-6">
        <h2 className="text-lg font-semibold">
          {getLabel(
            { it: 'Collegamenti utili', en: 'Useful links', fr: 'Liens utiles', es: 'Enlaces útiles' },
            lang
          )}
        </h2>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
          <a className="underline" href={`/${lang}/privacy`}>Privacy Policy</a>
          <span>·</span>
          <a className="underline" href={`/${lang}/cookie`}>Cookie Policy</a>
          <span>·</span>
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new Event('open-cookie-preferences'));
              }
            }}
            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-white font-semibold hover:bg-blue-700"
          >
            {getLabel(
              {
                it: 'Gestisci preferenze cookie',
                en: 'Manage cookie preferences',
                fr: 'Gérer les préférences cookies',
                es: 'Gestionar preferencias de cookies',
              },
              lang
            )}
          </button>
        </div>
      </section>
    </main>
  );
}

function Section({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children && <div className="mt-2 text-sm leading-6">{children}</div>}
    </section>
  );
}
