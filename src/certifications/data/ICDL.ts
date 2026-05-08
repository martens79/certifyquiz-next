// src/certifications/data/ICDL.ts
// Pagina certificazione ICDL / ex ECDL
// Slug canonico: "icdl"
// Nota SEO: in italiano usiamo "ECDL (ICDL)" perché molti utenti cercano ancora ECDL.

import type { CertificationData } from "../types";

const ICDL: CertificationData = {
  slug: "icdl",
  imageUrl: "/images/certifications/ecdl.png",
  officialUrl: "https://icdl.org/icdl-modules-programs/",

  title: {
    it: "ECDL (ICDL)",
    en: "ICDL",
    fr: "ICDL",
    es: "ICDL",
  },

  level: {
    it: "Base",
    en: "Basic",
    fr: "Base",
    es: "Básico",
  },

  metaTitle: {
    it: "ECDL / ICDL: quiz, simulazioni e preparazione certificazione informatica",
    en: "ICDL: quizzes, practice tests and digital skills preparation",
    fr: "ICDL : quiz, simulations et préparation aux compétences numériques",
    es: "ICDL: quizzes, simulaciones y preparación en competencias digitales",
  },

  metaDescription: {
    it: "Preparati alla certificazione ECDL / ICDL con quiz e simulazioni su computer, Office, Internet, sicurezza informatica e competenze digitali.",
    en: "Prepare for ICDL with quizzes and practice tests on computer use, office tools, internet, IT security and digital skills.",
    fr: "Préparez la certification ICDL avec des quiz et simulations sur l’ordinateur, la bureautique, Internet et les compétences numériques.",
    es: "Prepárate para ICDL con quizzes y simulaciones sobre ordenador, herramientas ofimáticas, Internet y competencias digitales.",
  },

  description: {
    it: "La certificazione ECDL, oggi conosciuta come ICDL, è uno dei percorsi più noti per certificare competenze informatiche e digitali di base. Include uso del computer, gestione file, Internet, sicurezza informatica, elaborazione testi, fogli di calcolo, basi di dati e presentazioni. È utile per studenti, lavoratori, docenti, personale ATA e candidati ai concorsi che vogliono dimostrare competenze digitali riconosciute a livello internazionale.",
    en: "The ICDL certification validates essential digital and computer skills, including computer use, file management, internet, IT security, word processing, spreadsheets, databases and presentations. It is useful for students, workers and professionals who want to prove internationally recognized digital competence.",
    fr: "La certification ICDL valide des compétences numériques et informatiques essentielles : utilisation de l’ordinateur, gestion des fichiers, Internet, sécurité informatique, traitement de texte, tableurs, bases de données et présentations.",
    es: "La certificación ICDL valida competencias digitales e informáticas esenciales: uso del ordenador, gestión de archivos, Internet, seguridad informática, procesamiento de textos, hojas de cálculo, bases de datos y presentaciones.",
  },

  topics: [
    {
      title: {
        it: "Concetti di base dell’ICT",
        en: "Basic ICT Concepts",
        fr: "Concepts de base de l'ICT",
        es: "Conceptos básicos de las TIC",
      },
      slug: {
        it: "concetti-di-base-dellict",
        en: "basic-ict-concepts",
        fr: "concepts-de-base-de-lict",
        es: "conceptos-basicos-de-las-tic",
      },
    },
    {
      title: {
        it: "Uso del computer e gestione dei file",
        en: "Computer Use and File Management",
        fr: "Utilisation de l’ordinateur et gestion des fichiers",
        es: "Uso de la computadora y gestión de archivos",
      },
      slug: {
        it: "uso-del-computer-e-gestione-dei-file",
        en: "computer-use-and-file-management",
        fr: "utilisation-de-lordinateur-et-gestion-des-fichiers",
        es: "uso-de-la-computadora-y-gestion-de-archivos",
      },
    },
    {
      title: {
        it: "Elaborazione testi",
        en: "Text Processing",
        fr: "Traitement de texte",
        es: "Procesamiento de texto",
      },
      slug: {
        it: "elaborazione-testi",
        en: "text-processing",
        fr: "traitement-de-texte",
        es: "procesamiento-de-texto",
      },
    },
    {
      title: {
        it: "Foglio elettronico",
        en: "Spreadsheet",
        fr: "Feuille de calcul",
        es: "Hoja de cálculo",
      },
      slug: {
        it: "foglio-elettronico",
        en: "spreadsheet",
        fr: "feuille-de-calcul",
        es: "hoja-de-calculo",
      },
    },
    {
      title: {
        it: "Uso delle basi di dati",
        en: "Use of Databases",
        fr: "Utilisation des bases de données",
        es: "Uso de bases de datos",
      },
      slug: {
        it: "uso-delle-basi-di-dati",
        en: "use-of-databases",
        fr: "utilisation-des-bases-de-donnees",
        es: "uso-de-bases-de-datos",
      },
    },
    {
      title: {
        it: "Navigazione e comunicazione",
        en: "Navigation and Communication",
        fr: "Navigation et communication",
        es: "Navegación y comunicación",
      },
      slug: {
        it: "navigazione-e-comunicazione",
        en: "navigation-and-communication",
        fr: "navigation-et-communication",
        es: "navegacion-y-comunicacion",
      },
    },
    {
      title: {
        it: "Strumenti di presentazione",
        en: "Presentation Tools",
        fr: "Outils de présentation",
        es: "Herramientas de presentación",
      },
      slug: {
        it: "strumenti-di-presentazione",
        en: "presentation-tools",
        fr: "outils-de-presentation",
        es: "herramientas-de-presentacion",
      },
    },
  ],

  extraContent: {
    examReference: {
      it: [
        {
          text: "ICDL — Moduli e programmi ufficiali",
          url: "https://icdl.org/icdl-modules-programs/",
        },
        {
          text: "Computer & Online Essentials — Modulo ufficiale",
          url: "https://icdl.org/workforce/computer-and-online-essentials/",
        },
        {
          text: "Documents — Modulo ufficiale",
          url: "https://icdl.org/workforce/documents/",
        },
        {
          text: "Spreadsheets — Modulo ufficiale",
          url: "https://icdl.org/workforce/spreadsheets/",
        },
      ],
      en: [
        {
          text: "ICDL — Official modules and programmes",
          url: "https://icdl.org/icdl-modules-programs/",
        },
        {
          text: "Computer & Online Essentials — Official module",
          url: "https://icdl.org/workforce/computer-and-online-essentials/",
        },
        {
          text: "Documents — Official module",
          url: "https://icdl.org/workforce/documents/",
        },
        {
          text: "Spreadsheets — Official module",
          url: "https://icdl.org/workforce/spreadsheets/",
        },
      ],
      fr: [
        {
          text: "ICDL — Modules et programmes officiels",
          url: "https://icdl.org/icdl-modules-programs/",
        },
        {
          text: "Computer & Online Essentials — Module officiel",
          url: "https://icdl.org/workforce/computer-and-online-essentials/",
        },
        {
          text: "Documents — Module officiel",
          url: "https://icdl.org/workforce/documents/",
        },
        {
          text: "Spreadsheets — Module officiel",
          url: "https://icdl.org/workforce/spreadsheets/",
        },
      ],
      es: [
        {
          text: "ICDL — Módulos y programas oficiales",
          url: "https://icdl.org/icdl-modules-programs/",
        },
        {
          text: "Computer & Online Essentials — Módulo oficial",
          url: "https://icdl.org/workforce/computer-and-online-essentials/",
        },
        {
          text: "Documents — Módulo oficial",
          url: "https://icdl.org/workforce/documents/",
        },
        {
          text: "Spreadsheets — Módulo oficial",
          url: "https://icdl.org/workforce/spreadsheets/",
        },
      ],
    },

    learn: {
      it: [
        "Usare computer, sistema operativo, file e cartelle in modo corretto.",
        "Navigare online, comunicare via email e usare servizi web in sicurezza.",
        "Creare e gestire documenti digitali con strumenti simili a Word.",
        "Lavorare con fogli di calcolo, formule, tabelle e grafici.",
        "Comprendere basi di dati, presentazioni e strumenti di produttività.",
        "Prepararti con quiz e simulazioni per verificare il tuo livello reale.",
      ],
      en: [
        "Use computers, operating systems, files and folders correctly.",
        "Browse online, communicate by email and use web services safely.",
        "Create and manage digital documents with word processing tools.",
        "Work with spreadsheets, formulas, tables and charts.",
        "Understand databases, presentations and productivity tools.",
        "Prepare with quizzes and practice tests to check your real level.",
      ],
      fr: [
        "Utiliser correctement ordinateurs, systèmes d’exploitation, fichiers et dossiers.",
        "Naviguer en ligne, communiquer par email et utiliser les services web en sécurité.",
        "Créer et gérer des documents numériques avec des outils de traitement de texte.",
        "Travailler avec des tableurs, formules, tableaux et graphiques.",
        "Comprendre les bases de données, présentations et outils de productivité.",
        "Se préparer avec des quiz et simulations pour vérifier son niveau réel.",
      ],
      es: [
        "Usar correctamente ordenadores, sistemas operativos, archivos y carpetas.",
        "Navegar online, comunicarse por email y usar servicios web de forma segura.",
        "Crear y gestionar documentos digitales con herramientas de procesamiento de texto.",
        "Trabajar con hojas de cálculo, fórmulas, tablas y gráficos.",
        "Comprender bases de datos, presentaciones y herramientas de productividad.",
        "Prepararte con quizzes y simulaciones para comprobar tu nivel real.",
      ],
    },

    whyChoose: {
      it: [
        "È una delle certificazioni informatiche più conosciute e riconosciute a livello internazionale.",
        "Aiuta a dimostrare competenze digitali utili per studio, lavoro e concorsi.",
        "È molto scelta da studenti, docenti, personale ATA e lavoratori.",
        "I quiz aiutano a verificare competenze pratiche, non solo conoscenze teoriche.",
        "È una buona base prima di affrontare certificazioni IT più avanzate.",
      ],
      en: [
        "It is one of the most recognized digital skills certifications worldwide.",
        "It helps demonstrate practical skills for study, work and professional growth.",
        "It is suitable for students, workers and professionals.",
        "Quizzes help verify practical competence, not just theory.",
        "It is a strong foundation before more advanced IT certifications.",
      ],
      fr: [
        "C’est l’une des certifications de compétences numériques les plus reconnues au monde.",
        "Elle aide à démontrer des compétences pratiques pour les études, le travail et l’évolution professionnelle.",
        "Elle convient aux étudiants, travailleurs et professionnels.",
        "Les quiz permettent de vérifier des compétences pratiques, pas seulement la théorie.",
        "C’est une base solide avant des certifications IT plus avancées.",
      ],
      es: [
        "Es una de las certificaciones de competencias digitales más reconocidas a nivel mundial.",
        "Ayuda a demostrar habilidades prácticas para estudiar, trabajar y crecer profesionalmente.",
        "Es adecuada para estudiantes, trabajadores y profesionales.",
        "Los quizzes ayudan a comprobar competencias prácticas, no solo teoría.",
        "Es una base sólida antes de certificaciones IT más avanzadas.",
      ],
    },

    faq: {
      it: [
        {
          q: "Che differenza c’è tra ECDL e ICDL?",
          a: "ECDL era il nome storico della certificazione in Europa. Oggi il nome internazionale è ICDL, ma in Italia molte persone cercano ancora ECDL.",
        },
        {
          q: "ICDL è utile per docenti, ATA e concorsi?",
          a: "Sì, è spesso scelta per dimostrare competenze digitali. Il valore preciso e l’eventuale punteggio dipendono sempre dal bando e dalla tabella titoli aggiornata.",
        },
        {
          q: "CertifyQuiz rilascia la certificazione ICDL ufficiale?",
          a: "No. CertifyQuiz offre quiz, simulazioni e materiali di preparazione. L’esame ufficiale va sostenuto tramite enti e test center autorizzati.",
        },
        {
          q: "Conviene prepararsi con i quiz?",
          a: "Sì. I quiz aiutano a verificare la preparazione reale, individuare lacune e allenarsi sulle domande prima dell’esame.",
        },
      ],
      en: [
        {
          q: "What is the difference between ECDL and ICDL?",
          a: "ECDL was the historical European name. ICDL is now the international name used for the certification.",
        },
        {
          q: "Is ICDL useful for work and study?",
          a: "Yes. It validates essential digital skills useful for education, work and professional development.",
        },
        {
          q: "Does CertifyQuiz issue the official ICDL certification?",
          a: "No. CertifyQuiz provides quizzes and preparation materials. The official exam must be taken through authorized providers.",
        },
        {
          q: "Are quizzes useful for preparation?",
          a: "Yes. Quizzes help check your real preparation, identify weak areas and train before the exam.",
        },
      ],
      fr: [
        {
          q: "Quelle est la différence entre ECDL et ICDL ?",
          a: "ECDL était le nom historique européen. ICDL est aujourd’hui le nom international de la certification.",
        },
        {
          q: "ICDL est-elle utile pour les études et le travail ?",
          a: "Oui. Elle valide des compétences numériques essentielles utiles pour les études, le travail et l’évolution professionnelle.",
        },
        {
          q: "CertifyQuiz délivre-t-il la certification officielle ICDL ?",
          a: "Non. CertifyQuiz propose des quiz et du matériel de préparation. L’examen officiel doit être passé auprès d’organismes autorisés.",
        },
        {
          q: "Les quiz sont-ils utiles pour se préparer ?",
          a: "Oui. Les quiz aident à vérifier la préparation réelle, repérer les points faibles et s’entraîner avant l’examen.",
        },
      ],
      es: [
        {
          q: "¿Cuál es la diferencia entre ECDL e ICDL?",
          a: "ECDL era el nombre histórico europeo. ICDL es ahora el nombre internacional de la certificación.",
        },
        {
          q: "¿ICDL es útil para estudiar y trabajar?",
          a: "Sí. Valida competencias digitales esenciales útiles para estudios, trabajo y desarrollo profesional.",
        },
        {
          q: "¿CertifyQuiz emite la certificación oficial ICDL?",
          a: "No. CertifyQuiz ofrece quizzes y materiales de preparación. El examen oficial debe realizarse mediante proveedores autorizados.",
        },
        {
          q: "¿Los quizzes son útiles para prepararse?",
          a: "Sí. Los quizzes ayudan a comprobar la preparación real, detectar puntos débiles y entrenar antes del examen.",
        },
      ],
    },
  },

  quizRoute: {
    it: "/it/quiz/icdl",
    en: "/en/quiz/icdl",
    fr: "/fr/quiz/icdl",
    es: "/es/quiz/icdl",
  },

  backRoute: {
    it: "/it/certificazioni",
    en: "/certifications",
    fr: "/fr/certifications",
    es: "/es/certificaciones",
  },
};

export default ICDL;