// src/app/[lang]/privacy/page.tsx
import type { Metadata } from 'next';

type Lang = 'it' | 'en' | 'fr' | 'es';
const ALL: Lang[] = ['it', 'en', 'fr', 'es'];

// Se preferisci, leggi da env: process.env.NEXT_PUBLIC_SITE_URL
const SITE = 'https://www.certifyquiz.com';

const PATH_BY_LANG: Record<Lang, string> = {
  it: '/it/privacy',
  en: '/en/privacy',
  fr: '/fr/privacy',
  es: '/es/privacy',
};

const T = {
  title: { it: 'Privacy Policy', en: 'Privacy Policy', fr: 'Politique de confidentialité', es: 'Política de privacidad' },
  updated: { it: 'Ultimo aggiornamento:', en: 'Last updated:', fr: 'Dernière mise à jour :', es: 'Última actualización:' },

  intro: {
    it: 'Questa informativa spiega come CertifyQuiz tratta i dati personali degli utenti ai sensi del Regolamento (UE) 2016/679 (GDPR).',
    en: 'This notice explains how CertifyQuiz processes users’ personal data under EU Regulation 2016/679 (GDPR).',
    fr: 'La présente notice explique comment CertifyQuiz traite les données personnelles des utilisateurs conformément au RGPD (UE) 2016/679.',
    es: 'Este aviso explica cómo CertifyQuiz trata los datos personales de los usuarios conforme al RGPD (UE) 2016/679.',
  },

  controller: { it: 'Titolare del trattamento', en: 'Data Controller', fr: 'Responsable du traitement', es: 'Responsable del tratamiento' },
  controllerTxt: {
    it: 'CertifyQuiz – Email: privacy@certifyquiz.com. (Aggiungi indirizzo postale e P.IVA se disponibili).',
    en: 'CertifyQuiz – Email: privacy@certifyquiz.com. (Add postal address and VAT if available).',
    fr: 'CertifyQuiz – Email : privacy@certifyquiz.com. (Ajoutez l’adresse postale et le numéro de TVA si disponibles).',
    es: 'CertifyQuiz – Email: privacy@certifyquiz.com. (Añade dirección postal y NIF si están disponibles).',
  },

  dataTypes: { it: 'Categorie di dati trattati', en: 'Categories of data processed', fr: 'Catégories de données traitées', es: 'Categorías de datos tratados' },
  dataTypesTxt: {
    it: [
      'Dati di account: email, username, avatar (se caricato), lingua.',
      'Dati di utilizzo: log tecnici, indirizzo IP, user agent, impostazioni di lingua/tema.',
      'Dati dei quiz: risposte, punteggi, progressi, badge ottenuti.',
      'Dati di pagamento (se/quando attivi): gestiti da fornitori terzi; noi riceviamo solo esiti e metadati necessari.',
      'Cookie e tecnologie simili: vedi Cookie Policy.',
    ],
    en: [
      'Account data: email, username, avatar (if uploaded), language.',
      'Usage data: technical logs, IP address, user agent, language/theme settings.',
      'Quiz data: answers, scores, progress, badges earned.',
      'Payment data (if/when active): handled by third-party providers; we receive outcome and necessary metadata only.',
      'Cookies and similar technologies: see Cookie Policy.',
    ],
    fr: [
      'Données de compte : e-mail, nom d’utilisateur, avatar (le cas échéant), langue.',
      'Données d’utilisation : journaux techniques, adresse IP, user agent, paramètres langue/thème.',
      'Données de quiz : réponses, scores, progression, badges obtenus.',
      'Données de paiement (le cas échéant) : gérées par des fournisseurs tiers ; nous recevons uniquement le résultat et les métadonnées nécessaires.',
      'Cookies et technologies similaires : voir la Politique de cookies.',
    ],
    es: [
      'Datos de cuenta: correo, usuario, avatar (si se sube), idioma.',
      'Datos de uso: registros técnicos, IP, user agent, ajustes de idioma/tema.',
      'Datos de los cuestionarios: respuestas, puntuaciones, progreso, insignias.',
      'Datos de pago (si/cuando estén activos): gestionados por proveedores terceros; recibimos solo el resultado y metadatos necesarios.',
      'Cookies y tecnologías similares: ver la Política de Cookies.',
    ],
  },

  purposes: { it: 'Finalità e basi giuridiche', en: 'Purposes and legal bases', fr: 'Finalités et bases juridiques', es: 'Finalidades y bases jurídicas' },
  purposesList: {
    it: [
      'Erogazione del servizio (creazione account, accesso, salvataggio progressi): esecuzione del contratto (art. 6.1.b).',
      'Sicurezza, prevenzione abusi e diagnostica: legittimo interesse (art. 6.1.f).',
      'Comunicazioni operative (es. cambio password): esecuzione del contratto (art. 6.1.b).',
      'Analytics opzionali e marketing (se acconsenti): consenso (art. 6.1.a).',
      'Adempimenti legali (fatturazione, contabilità): obbligo legale (art. 6.1.c).',
    ],
    en: [
      'Service provision (account creation, login, saving progress): contract performance (Art. 6.1.b).',
      'Security, abuse prevention and diagnostics: legitimate interest (Art. 6.1.f).',
      'Operational communications (e.g., password reset): contract performance (Art. 6.1.b).',
      'Optional analytics and marketing (if you consent): consent (Art. 6.1.a).',
      'Legal compliance (billing, accounting): legal obligation (Art. 6.1.c).',
    ],
    fr: [
      'Fourniture du service (création de compte, connexion, sauvegarde de la progression) : exécution du contrat (art. 6.1.b).',
      'Sécurité, prévention des abus et diagnostic : intérêt légitime (art. 6.1.f).',
      'Communications opérationnelles (ex. réinitialisation du mot de passe) : exécution du contrat (art. 6.1.b).',
      'Statistiques optionnelles et marketing (si vous consentez) : consentement (art. 6.1.a).',
      'Obligations légales (facturation, comptabilité) : obligation légale (art. 6.1.c).',
    ],
    es: [
      'Prestación del servicio (crear cuenta, acceso, guardar progreso): ejecución del contrato (art. 6.1.b).',
      'Seguridad, prevención de abusos y diagnóstico: interés legítimo (art. 6.1.f).',
      'Comunicaciones operativas (p. ej., restablecer contraseña): ejecución del contrato (art. 6.1.b).',
      'Analítica opcional y marketing (si consientes): consentimiento (art. 6.1.a).',
      'Cumplimiento legal (facturación, contabilidad): obligación legal (art. 6.1.c).',
    ],
  },

  retention: { it: 'Conservazione', en: 'Retention', fr: 'Conservation', es: 'Conservación' },
  retentionTxt: {
    it: 'Conserviamo i dati per il tempo necessario alle finalità indicate o richiesto dalla legge. I log tecnici sono conservati per periodi limitati. Puoi richiedere cancellazione/anonimizzazione ove possibile.',
    en: 'We retain data for as long as necessary for the stated purposes or as required by law. Technical logs are kept for limited periods. You can request deletion/anonymization where possible.',
    fr: 'Nous conservons les données aussi longtemps que nécessaire aux finalités décrites ou exigé par la loi. Les journaux techniques sont conservés pour des périodes limitées. Vous pouvez demander la suppression/l’anonymisation lorsque c’est possible.',
    es: 'Conservamos los datos durante el tiempo necesario para las finalidades indicadas o lo exigido por la ley. Los registros técnicos se conservan por periodos limitados. Puedes solicitar la supresión/anonimización cuando sea posible.',
  },

  recipients: { it: 'Destinatari e terze parti', en: 'Recipients and third parties', fr: 'Destinataires et tiers', es: 'Destinatarios y terceros' },
  recipientsTxt: {
    it: 'Forniamo dati a fornitori che ci aiutano a erogare il servizio (hosting, email, pagamenti, analisi), vincolati da accordi e istruzioni. I dettagli sui cookie/servizi sono nella Cookie Policy.',
    en: 'We share data with vendors that help us deliver the service (hosting, email, payments, analytics), bound by agreements and instructions. See the Cookie Policy for cookie/service details.',
    fr: 'Nous partageons des données avec des prestataires qui nous aident à fournir le service (hébergement, e-mail, paiements, analyses), liés par des accords et des instructions. Voir la Politique de cookies.',
    es: 'Compartimos datos con proveedores que ayudan a prestar el servicio (hosting, correo, pagos, analítica), sujetos a acuerdos e instrucciones. Consulta la Política de cookies.',
  },

  transfers: { it: 'Trasferimenti extra-UE', en: 'International transfers', fr: 'Transferts hors UE', es: 'Transferencias internacionales' },
  transfersTxt: {
    it: 'Se i dati sono trasferiti fuori dallo SEE, adottiamo garanzie adeguate (es. clausole contrattuali standard, misure supplementari) ove richiesto.',
    en: 'If data is transferred outside the EEA, we adopt appropriate safeguards (e.g., Standard Contractual Clauses, supplementary measures) where required.',
    fr: 'Si des données sont transférées hors EEE, nous mettons en place des garanties appropriées (p. ex. clauses contractuelles types, mesures supplémentaires) lorsque requis.',
    es: 'Si los datos se transfieren fuera del EEE, adoptamos garantías adecuadas (p. ej., Cláusulas Contractuales Tipo, medidas adicionales) cuando sea necesario.',
  },

  rights: { it: 'Diritti degli interessati', en: 'Data subject rights', fr: 'Droits des personnes concernées', es: 'Derechos de los interesados' },
  rightsTxt: {
    it: [
      'Accesso, rettifica, cancellazione (artt. 15–17 GDPR).',
      'Limitazione e opposizione (artt. 18–21).',
      'Portabilità (art. 20).',
      'Revoca del consenso (quando la base è il consenso).',
      'Reclamo al Garante (garanteprivacy.it).',
    ],
    en: [
      'Access, rectification, erasure (Arts. 15–17 GDPR).',
      'Restriction and objection (Arts. 18–21).',
      'Portability (Art. 20).',
      'Withdraw consent (where applicable).',
      'Lodge a complaint with the Supervisory Authority.',
    ],
    fr: [
      'Accès, rectification, effacement (art. 15–17 RGPD).',
      'Limitation et opposition (art. 18–21).',
      'Portabilité (art. 20).',
      'Retrait du consentement (le cas échéant).',
      'Réclamation auprès de l’Autorité de contrôle.',
    ],
    es: [
      'Acceso, rectificación, supresión (arts. 15–17 RGPD).',
      'Limitación y oposición (arts. 18–21).',
      'Portabilidad (art. 20).',
      'Retirar el consentimiento (cuando aplique).',
      'Reclamo ante la Autoridad de Control.',
    ],
  },

  security: { it: 'Sicurezza', en: 'Security', fr: 'Sécurité', es: 'Seguridad' },
  securityTxt: {
    it: 'Adottiamo misure tecniche e organizzative adeguate per proteggere i dati personali (cifratura in transito, accessi limitati, backup).',
    en: 'We implement appropriate technical and organizational measures to protect personal data (encryption in transit, limited access, backups).',
    fr: 'Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger les données personnelles (chiffrement en transit, accès limités, sauvegardes).',
    es: 'Aplicamos medidas técnicas y organizativas adecuadas para proteger los datos personales (cifrado en tránsito, acceso limitado, copias de seguridad).',
  },

  cookiesRef: { it: 'Cookie e preferenze', en: 'Cookies and preferences', fr: 'Cookies et préférences', es: 'Cookies y preferencias' },
  cookiesRefTxt: {
    it: 'Per i dettagli su cookie e gestione del consenso, consulta la nostra Cookie Policy.',
    en: 'For details on cookies and consent management, see our Cookie Policy.',
    fr: 'Pour plus de détails sur les cookies et la gestion du consentement, consultez notre Politique de cookies.',
    es: 'Para más detalles sobre las cookies y la gestión del consentimiento, consulta nuestra Política de Cookies.',
  },

  contacts: { it: 'Contatti', en: 'Contacts', fr: 'Contacts', es: 'Contactos' },
  contactsTxt: {
    it: 'Per richieste privacy o esercizio dei diritti: privacy@certifyquiz.com. (Se disponibile, indica DPO e indirizzo postale).',
    en: 'For privacy requests or to exercise your rights: privacy@certifyquiz.com. (If available, add DPO and postal address).',
    fr: 'Pour toute demande relative à la confidentialité ou l’exercice de vos droits : privacy@certifyquiz.com. (Ajoutez le DPO et l’adresse postale si disponibles).',
    es: 'Para solicitudes de privacidad o ejercicio de derechos: privacy@certifyquiz.com. (Si está disponible, añade DPO y dirección postal).',
  },
} as const;

function getLabel<T extends Record<string, string>>(obj: T, lang: Lang) {
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
      it: 'Informativa privacy di CertifyQuiz: categorie di dati, finalità, basi giuridiche, conservazione, diritti e contatti.',
      en: 'CertifyQuiz Privacy Policy: data categories, purposes, legal bases, retention, rights and contacts.',
      fr: 'Politique de confidentialité CertifyQuiz : catégories de données, finalités, bases juridiques, conservation, droits et contacts.',
      es: 'Política de privacidad de CertifyQuiz: categorías de datos, finalidades, bases jurídicas, conservación, derechos y contactos.',
    }[lang],
    metadataBase: new URL(SITE),
    alternates: {
      canonical: PATH_BY_LANG[lang],
      languages,
    },
  };
}

export default function PrivacyPage({ params }: { params: { lang: Lang } }) {
  const lang = (ALL.includes(params.lang) ? params.lang : 'it') as Lang;
  const today = new Date().toISOString().slice(0, 10);

  const L = T; // alias corto

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 text-slate-800">
      <h1 className="text-2xl font-bold">{getLabel(L.title, lang)}</h1>
      <p className="mt-1 text-xs text-slate-500">
        {getLabel(L.updated, lang)} {today}
      </p>

      <p className="mt-4">{getLabel(L.intro, lang)}</p>

      <Section title={getLabel(L.controller, lang)}>{getLabel(L.controllerTxt, lang)}</Section>

      <Section title={getLabel(L.dataTypes, lang)}>
        <ul className="list-disc ml-5 space-y-1">
          {T.dataTypesTxt[lang].map((line, i) => <li key={i}>{line}</li>)}
        </ul>
      </Section>

      <Section title={getLabel(L.purposes, lang)}>
        <ul className="list-disc ml-5 space-y-1">
          {T.purposesList[lang].map((line, i) => <li key={i}>{line}</li>)}
        </ul>
      </Section>

      <Section title={getLabel(L.retention, lang)}>{getLabel(L.retentionTxt, lang)}</Section>
      <Section title={getLabel(L.recipients, lang)}>{getLabel(L.recipientsTxt, lang)}</Section>
      <Section title={getLabel(L.transfers, lang)}>{getLabel(L.transfersTxt, lang)}</Section>

      <Section title={getLabel(L.rights, lang)}>
        <ul className="list-disc ml-5 space-y-1">
          {T.rightsTxt[lang].map((line, i) => <li key={i}>{line}</li>)}
        </ul>
      </Section>

      <Section title={getLabel(L.security, lang)}>{getLabel(L.securityTxt, lang)}</Section>

      <Section title={getLabel(L.cookiesRef, lang)}>
        {getLabel(L.cookiesRefTxt, lang)}{' '}
        <a className="underline" href={`/${lang}/cookie`}>Cookie Policy</a>.
      </Section>

      <Section title={getLabel(L.contacts, lang)}>{getLabel(L.contactsTxt, lang)}</Section>
    </main>
  );
}

function Section({ title, children }: { title?: string; children?: React.ReactNode }) {
  return (
    <section className="mt-6">
      {title && <h2 className="text-lg font-semibold">{title}</h2>}
      <div className="mt-2 text-sm leading-6 whitespace-pre-wrap">{children}</div>
    </section>
  );
}
