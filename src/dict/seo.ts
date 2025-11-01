// src/dict/seo.ts
export const seo = {
  it: {
    home: {
      title: "CertifyQuiz – Quiz per certificazioni informatiche",
      description: "Allenati online con quiz ufficiali per certificazioni IT come CompTIA, Cisco, AWS, Azure e molte altre. Spiegazioni dettagliate e badge reali.",
    },
    privacy: {
      title: "Informativa sulla privacy | CertifyQuiz",
      description: "Scopri come proteggiamo i tuoi dati personali in conformità con il GDPR e le normative europee.",
    },
    termini: {
      title: "Termini e condizioni d’uso | CertifyQuiz",
      description: "Leggi i termini di servizio che regolano l’utilizzo di CertifyQuiz.com e dei contenuti formativi offerti.",
    },
    cookie: {
      title: "Cookie policy | CertifyQuiz",
      description: "Informazioni sui cookie utilizzati da CertifyQuiz e su come gestirli o disattivarli.",
    },
    contatti: {
      title: "Contattaci | CertifyQuiz",
      description: "Hai domande o suggerimenti? Scrivici tramite il modulo di contatto o via email a support@certifyquiz.com.",
    },
  },
  en: {
    home: {
      title: "CertifyQuiz – IT Certification Practice Tests",
      description: "Train online with official-style quizzes for CompTIA, Cisco, AWS, Azure and more. Detailed explanations and real verifiable badges.",
    },
    privacy: {
      title: "Privacy Policy | CertifyQuiz",
      description: "Learn how we protect your personal data in compliance with GDPR and international privacy standards.",
    },
    terms: {
      title: "Terms of Use | CertifyQuiz",
      description: "Read the terms of service that govern the use of CertifyQuiz.com and its training content.",
    },
    cookies: {
      title: "Cookie Policy | CertifyQuiz",
      description: "Details on the cookies used by CertifyQuiz and how to manage or disable them.",
    },
    contact: {
      title: "Contact Us | CertifyQuiz",
      description: "Have questions or suggestions? Get in touch through our contact form or via email at support@certifyquiz.com.",
    },
  },
  fr: {
    home: {
      title: "CertifyQuiz – Quiz pour certifications informatiques",
      description: "Entraînez-vous en ligne avec des quiz pour les certifications IT comme CompTIA, Cisco, AWS, Azure et plus encore. Explications détaillées et badges vérifiables.",
    },
    confidentialite: {
      title: "Politique de confidentialité | CertifyQuiz",
      description: "Découvrez comment nous protégeons vos données personnelles conformément au RGPD et aux normes européennes.",
    },
    conditions: {
      title: "Conditions d’utilisation | CertifyQuiz",
      description: "Lisez les conditions générales régissant l’utilisation de CertifyQuiz.com et de son contenu éducatif.",
    },
    cookies: {
      title: "Politique des cookies | CertifyQuiz",
      description: "Informations sur les cookies utilisés par CertifyQuiz et comment les gérer.",
    },
    contact: {
      title: "Contactez-nous | CertifyQuiz",
      description: "Des questions ou suggestions ? Contactez-nous via le formulaire ou par e-mail à support@certifyquiz.com.",
    },
  },
  es: {
    home: {
      title: "CertifyQuiz – Exámenes para certificaciones informáticas",
      description: "Entrena en línea con cuestionarios para certificaciones IT como CompTIA, Cisco, AWS, Azure y más. Explicaciones detalladas y medallas verificables.",
    },
    privacidad: {
      title: "Política de privacidad | CertifyQuiz",
      description: "Descubre cómo protegemos tus datos personales según el RGPD y las normativas europeas.",
    },
    terminos: {
      title: "Términos y condiciones | CertifyQuiz",
      description: "Lee los términos de servicio que regulan el uso de CertifyQuiz.com y sus contenidos formativos.",
    },
    cookies: {
      title: "Política de cookies | CertifyQuiz",
      description: "Información sobre las cookies utilizadas por CertifyQuiz y cómo gestionarlas o desactivarlas.",
    },
    contacto: {
      title: "Contáctanos | CertifyQuiz",
      description: "¿Tienes preguntas o sugerencias? Escríbenos a través del formulario de contacto o al correo support@certifyquiz.com.",
    },
  },
} as const;

export type SEOLocale = keyof typeof seo;
