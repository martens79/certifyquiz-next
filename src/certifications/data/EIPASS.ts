// src/certifications/data/eipass.ts
// ✅ Versione data-only (nessun JSX/router). Coerente con gli altri file.
// 🖼️ Assicurati che l’immagine sia in: /public/images/certifications/eipass.png
//     (il path qui sotto è quello “public-served” da Next).

const EIPASS = {
  slug: "eipass",
  imageUrl: "/images/certifications/eipass.png",
  officialUrl: "https://it.eipass.com/certificazioni-informatiche/basic/",

  title: {
    it: "EIPASS",
    en: "EIPASS",
    fr: "EIPASS",
    es: "EIPASS",
  },

  level: {
    it: "Base",
    en: "Beginner",
    fr: "Débutant",
    es: "Principiante",
  },

  description: {
    it: "La certificazione EIPASS attesta le competenze digitali secondo standard europei.",
    en: "The EIPASS certification validates digital skills according to European standards.",
    fr: "La certification EIPASS valide les compétences numériques selon les normes européennes.",
    es: "La certificación EIPASS valida habilidades digitales según estándares europeos.",
  },

  topics: [
  {
    title: {
      it: "Fondamenti del computer",
      en: "Computer Essentials",
      fr: "Notions de base sur l’ordinateur",
      es: "Fundamentos del ordenador",
    },
    slug: {
      it: "fondamenti-del-computer",
      en: "computer-essentials",
      fr: "notions-de-base-sur-lordinateur",
      es: "fundamentos-del-ordenador",
    },
  },
  {
    title: {
      it: "Sicurezza informatica",
      en: "IT Security",
      fr: "Sécurité informatique",
      es: "Seguridad informática",
    },
    slug: {
      it: "sicurezza-informatica",
      en: "it-security",
      fr: "securite-informatique",
      es: "seguridad-informatica",
    },
  },
  {
    title: {
      it: "Collaborazione online",
      en: "Online Collaboration",
      fr: "Collaboration en ligne",
      es: "Colaboración en línea",
    },
    slug: {
      it: "collaborazione-online",
      en: "online-collaboration",
      fr: "collaboration-en-ligne",
      es: "colaboracion-en-linea",
    },
  },
  {
    title: {
      it: "Navigazione e comunicazione",
      en: "Online Essentials",
      fr: "Navigation et communication",
      es: "Navegación y comunicación",
    },
    slug: {
      it: "navigazione-e-comunicazione",
      en: "online-essentials",
      fr: "navigation-et-communication",
      es: "navegacion-y-comunicacion",
    },
  },
  {
    title: {
      it: "Strumenti di presentazione",
      en: "Presentation",
      fr: "Présentation",
      es: "Presentación",
    },
    slug: {
      it: "strumenti-di-presentazione",
      en: "presentation",
      fr: "presentation",
      es: "presentacion",
    },
  },
  {
    title: {
      it: "Fogli di calcolo",
      en: "Spreadsheets",
      fr: "Tableurs",
      es: "Hojas de cálculo",
    },
    slug: {
      it: "fogli-di-calcolo",
      en: "spreadsheets",
      fr: "tableurs",
      es: "hojas-de-calculo",
    },
  },
  {
    title: {
      it: "Elaborazione testi",
      en: "Word Processing",
      fr: "Traitement de texte",
      es: "Procesamiento de textos",
    },
    slug: {
      it: "elaborazione-testi",
      en: "word-processing",
      fr: "traitement-de-texte",
      es: "procesamiento-de-textos",
    },
  },
],

  extraContent: {
    // 🔗 Pagine ufficiali (moduli/overview)
    examReference: {
      it: [
        { text: "EIPASS Basic — Pagina ufficiale (Moduli d’esame)", url: "https://it.eipass.com/certificazioni-informatiche/basic/" },
      ],
      en: [
        { text: "EIPASS Basic — Official certification page (Exam modules)", url: "https://it.eipass.com/certificazioni-informatiche/basic/" },
      ],
      fr: [
        { text: "EIPASS Basic — Page officielle de la certification (Modules d’examen)", url: "https://it.eipass.com/certificazioni-informatiche/basic/" },
      ],
      es: [
        { text: "EIPASS Basic — Página oficial de la certificación (Módulos del examen)", url: "https://it.eipass.com/certificazioni-informatiche/basic/" },
      ],
    },

    learn: {
      it: [
        "Fondamenti ICT essenziali per l’uso quotidiano del computer.",
        "Utilizzo efficace degli strumenti di produttività digitale.",
        "Gestione della sicurezza e della privacy online.",
        "Navigazione e uso consapevole di web e social media.",
        "Organizzazione e gestione dei dati in modo efficiente.",
      ],
      en: [
        "Essential ICT fundamentals for everyday computer use.",
        "Effective use of digital productivity tools.",
        "Management of online security and privacy.",
        "Conscious navigation and use of web and social media.",
        "Efficient organization and management of data.",
      ],
      fr: [
        "Notions essentielles des TIC pour l'utilisation quotidienne de l’ordinateur.",
        "Utilisation efficace des outils de productivité numérique.",
        "Gestion de la sécurité et de la vie privée en ligne.",
        "Navigation et utilisation conscientes du web et des réseaux sociaux.",
        "Organisation et gestion efficaces des données.",
      ],
      es: [
        "Fundamentos esenciales de TIC para el uso diario del ordenador.",
        "Uso efectivo de herramientas digitales de productividad.",
        "Gestión de la seguridad y privacidad en línea.",
        "Navegación y uso consciente de la web y redes sociales.",
        "Organización y gestión eficiente de datos.",
      ],
    },

    whyChoose: {
      it: [
        "Certificazione riconosciuta a livello europeo.",
        "Ideale per chi vuole migliorare le competenze digitali di base.",
        "Riconosciuta da enti pubblici e aziende.",
        "Ottima base per avanzare in altre certificazioni ICT.",
        "Facile accesso a risorse e formazione ufficiale.",
      ],
      en: [
        "Certification recognized across Europe.",
        "Ideal for those seeking to improve basic digital skills.",
        "Recognized by public entities and companies.",
        "Great foundation for advancing to other ICT certifications.",
        "Easy access to official resources and training.",
      ],
      fr: [
        "Certification reconnue à travers l’Europe.",
        "Idéale pour ceux qui souhaitent améliorer leurs compétences numériques de base.",
        "Reconnu par les organismes publics et les entreprises.",
        "Excellente base pour progresser vers d’autres certifications TIC.",
        "Accès facile aux ressources et formations officielles.",
      ],
      es: [
        "Certificación reconocida en toda Europa.",
        "Ideal para quienes desean mejorar habilidades digitales básicas.",
        "Reconocida por entidades públicas y empresas.",
        "Buena base para avanzar a otras certificaciones TIC.",
        "Acceso sencillo a recursos y formación oficial.",
      ],
    },

    faq: {
      it: [
        { q: "Chi può sostenere la certificazione EIPASS?", a: "Chiunque desideri certificare le proprie competenze digitali di base." },
        { q: "Come si svolge l’esame?", a: "L’esame si svolge online tramite piattaforme autorizzate." },
      ],
      en: [
        { q: "Who can take the EIPASS certification?", a: "Anyone wishing to certify their basic digital skills." },
        { q: "How is the exam conducted?", a: "The exam is conducted online via authorized platforms." },
      ],
      fr: [
        { q: "Qui peut passer la certification EIPASS ?", a: "Toute personne souhaitant certifier ses compétences numériques de base." },
        { q: "Comment se déroule l’examen ?", a: "L’examen se déroule en ligne via des plateformes autorisées." },
      ],
      es: [
        { q: "¿Quién puede obtener la certificación EIPASS?", a: "Cualquier persona que desee certificar sus habilidades digitales básicas." },
        { q: "¿Cómo se realiza el examen?", a: "El examen se realiza en línea a través de plataformas autorizadas." },
      ],
    },
  },

  // Rotte quiz localizzate (notare slug quiz = eipass-basic)
  quizRoute: {
    it: "/it/quiz/eipass",
en: "/en/quiz/eipass",
fr: "/fr/quiz/eipass",
es: "/es/quiz/eipass",

  },

  // Rotta “indietro”: lista certificazioni per lingua
  backRoute: {
    it: "/it/certificazioni",
    en: "/certifications",
    fr: "/fr/certifications",
    es: "/es/certificaciones",
  },
} as const;

export default EIPASS;
