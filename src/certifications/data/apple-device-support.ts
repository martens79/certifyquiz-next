// First independent teaching release, checked against Apple's current course
// on 2026-10-04. Production identity: certification 74, topics 499–507.
// No exam code is asserted. Indexing requires verified inventory in each locale.

import type { CertificationData } from "../types";

const AppleDeviceSupport: CertificationData = {
  slug: "apple-device-support",
  publicationStatus: "published",
  imageUrl: "/images/certifications/apple-device-support.svg",
  officialUrl: "https://it-training.apple.com/support/tutorials/course/",
  lifecycleStatus: "active",

  title: {
    it: "Apple Device Support (ACSP)",
    en: "Apple Device Support (ACSP)",
    fr: "Apple Device Support (ACSP)",
    es: "Apple Device Support (ACSP)",
  },
  level: { it: "Help desk livello 1 e 2", en: "Level 1 and 2 help desk", fr: "Help desk niveaux 1 et 2", es: "Help desk niveles 1 y 2" },
  description: {
    it: "Primo pacchetto didattico indipendente per Apple Device Support: 45 domande originali, cinque per ciascuno dei nove topic, con spiegazioni e ripassi in EN/IT/FR/ES. Esercitati nell'assistenza a iPhone, iPad e Mac; integra il corso Apple e la pratica su dispositivi. Copertura parziale, senza garanzia di superamento.",
    en: "First independent teaching package for Apple Device Support: 45 original questions, five in each of nine topics, with explanations and study reviews in EN/IT/FR/ES. Practise supporting iPhone, iPad and Mac alongside Apple's course and hands-on work. Partial coverage, with no pass guarantee.",
    fr: "Premier package pédagogique indépendant pour Apple Device Support : 45 questions originales, cinq par sujet sur neuf sujets, avec explications et révisions en EN/IT/FR/ES. Entraînez-vous au support d'iPhone, d'iPad et de Mac avec le cours Apple et la pratique. Couverture partielle, sans garantie de réussite.",
    es: "Primer paquete didáctico independiente para Apple Device Support: 45 preguntas originales, cinco por cada uno de nueve temas, con explicaciones y repasos en EN/IT/FR/ES. Practica soporte de iPhone, iPad y Mac junto al curso Apple y trabajo práctico. Cobertura parcial, sin garantía de aprobar.",
  },
  examBlueprint: {
    examName: "Apple Device Support Exam",
    provider: "Apple",
    officialSourceName: "Apple Professional Training — Preparing for the Exam",
    officialSourceUrl: "https://it-training.apple.com/support/tutorials/course/sup020/",
    officialExamPageUrl: "https://it-training.apple.com/support/tutorials/course/sup030/",
    lastVerifiedAt: "2026-10-04",
    domains: [],
  },

  topics: [
    {
      title: {
        it: "Come iniziare e prepararsi all'esame",
        en: "Getting Started",
        fr: "Bien démarrer",
        es: "Primeros pasos",
      },
      slug: {
        it: "come-iniziare-prepararsi-esame",
        en: "getting-started",
        fr: "bien-demarrer",
        es: "primeros-pasos",
      },
    },
    {
      title: {
        it: "Fondamenti delle piattaforme Apple",
        en: "Apple Platform Fundamentals",
        fr: "Fondamentaux des plateformes Apple",
        es: "Fundamentos de las plataformas Apple",
      },
      slug: {
        it: "fondamenti-piattaforme-apple",
        en: "apple-platform-fundamentals",
        fr: "fondamentaux-plateformes-apple",
        es: "fundamentos-plataformas-apple",
      },
    },
    {
      title: {
        it: "Gestione dei dispositivi, Managed Apple Account e iCloud",
        en: "Device Management, Managed Apple Accounts, and iCloud",
        fr: "Gestion des appareils, comptes Apple gérés et iCloud",
        es: "Gestión de dispositivos, Cuentas de Apple gestionadas e iCloud",
      },
      slug: {
        it: "gestione-dispositivi-managed-apple-account-icloud",
        en: "device-management-managed-apple-accounts-icloud",
        fr: "gestion-appareils-comptes-apple-geres-icloud",
        es: "gestion-dispositivos-cuentas-apple-gestionadas-icloud",
      },
    },
    {
      title: {
        it: "Configurazione, backup e ripristino di iPhone o iPad",
        en: "Setup, Backup, and Recovery for iPhone or iPad",
        fr: "Configuration, sauvegarde et récupération d'iPhone ou iPad",
        es: "Configuración, copia de seguridad y recuperación de iPhone o iPad",
      },
      slug: {
        it: "configurazione-backup-ripristino-iphone-ipad",
        en: "setup-backup-recovery-iphone-ipad",
        fr: "configuration-sauvegarde-recuperation-iphone-ipad",
        es: "configuracion-copia-seguridad-recuperacion-iphone-ipad",
      },
    },
    {
      title: {
        it: "Configurazione, backup e ripristino del Mac",
        en: "Setup, Backup, and Recovery for Mac",
        fr: "Configuration, sauvegarde et récupération du Mac",
        es: "Configuración, copia de seguridad y recuperación de Mac",
      },
      slug: {
        it: "configurazione-backup-ripristino-mac",
        en: "setup-backup-recovery-mac",
        fr: "configuration-sauvegarde-recuperation-mac",
        es: "configuracion-copia-seguridad-recuperacion-mac",
      },
    },
    {
      title: {
        it: "Aggiornamenti software, spazio di archiviazione e Continuity",
        en: "Software Updates, Device Storage, and Continuity",
        fr: "Mises à jour logicielles, stockage et Continuity",
        es: "Actualizaciones de software, almacenamiento y Continuity",
      },
      slug: {
        it: "aggiornamenti-software-spazio-archiviazione-continuity",
        en: "software-updates-device-storage-continuity",
        fr: "mises-a-jour-logicielles-stockage-continuity",
        es: "actualizaciones-software-almacenamiento-continuity",
      },
    },
    {
      title: {
        it: "Configurazioni e connessioni di rete",
        en: "Network Configurations and Connections",
        fr: "Configurations et connexions réseau",
        es: "Configuraciones y conexiones de red",
      },
      slug: {
        it: "configurazioni-connessioni-rete",
        en: "network-configurations-connections",
        fr: "configurations-connexions-reseau",
        es: "configuraciones-conexiones-red",
      },
    },
    {
      title: {
        it: "Privacy e sicurezza",
        en: "Privacy and Security",
        fr: "Confidentialité et sécurité",
        es: "Privacidad y seguridad",
      },
      slug: {
        it: "privacy-sicurezza",
        en: "privacy-security",
        fr: "confidentialite-securite",
        es: "privacidad-seguridad",
      },
    },
    {
      title: {
        it: "Strumenti diagnostici",
        en: "Diagnostic Tools",
        fr: "Outils de diagnostic",
        es: "Herramientas de diagnóstico",
      },
      slug: {
        it: "strumenti-diagnostici",
        en: "diagnostic-tools",
        fr: "outils-diagnostic",
        es: "herramientas-diagnostico",
      },
    },
  ],

  extraContent: {
    guideSections: {
      en: [
        { title: "Who this is for and prerequisites", paragraphs: ["For help desk technicians supporting Apple devices in an organisation. Start with basic iPhone, iPad and Mac use and IT knowledge. Practise on authorised devices; verify backups before recovery exercises."] },
        { title: "What this first release contains", paragraphs: ["Nine topics follow the current Apple course: foundations; management and identities; iPhone/iPad and Mac recovery; updates, storage and Continuity; networks; privacy and security; diagnostics. Each topic has five original single-answer questions with four options, explanations and a study review in all four languages. The 45 questions are translated, not 180 different questions. Review access follows CertifyQuiz's existing free and premium rules."] },
        { title: "How to study", paragraphs: ["Read a topic review, perform the practical workflow and answer its quiz. Use mixed training to connect topics, then revisit errors and official resources. This small package samples objectives; it does not cover the entire exam. Mock exam mode is unavailable for this release. No questions are repeated to fill a simulation."] },
        { title: "Current official exam and independence", paragraphs: ["Apple's current preparation article bases the exam on iOS 26, iPadOS 26 and macOS Tahoe. Passing the Apple Device Support Exam earns the Apple Certified Support Professional badge. Check Apple's current objectives and registration information before booking. CertifyQuiz is independent, is not affiliated with or endorsed by Apple, and provides neither exam dumps nor a pass guarantee."] },
      ],
      it: [
        { title: "Destinatari e prerequisiti", paragraphs: ["Per tecnici help desk che assistono dispositivi Apple in un'organizzazione. Parti dall'uso di base di iPhone, iPad e Mac e da conoscenze IT. Esercitati su dispositivi autorizzati e verifica i backup prima degli esercizi di recupero."] },
        { title: "Contenuto del primo rilascio", paragraphs: ["Nove topic seguono il corso Apple attuale: fondamenti; gestione e identità; recupero iPhone/iPad e Mac; aggiornamenti, spazio e Continuity; reti; privacy e sicurezza; diagnostica. Ogni topic ha cinque domande originali a risposta singola con quattro opzioni, spiegazioni e un ripasso nelle quattro lingue. Le 45 domande sono tradotte, non sono 180 domande diverse. L'accesso ai ripassi segue le regole gratuite e premium esistenti di CertifyQuiz."] },
        { title: "Modalità di studio", paragraphs: ["Leggi il ripasso, esegui la procedura pratica e affronta il quiz del topic. Usa l'allenamento misto per collegare gli argomenti, poi rivedi errori e fonti ufficiali. Il pacchetto campiona obiettivi e non copre l'intero esame. La simulazione d'esame non è disponibile per questo rilascio. Nessuna domanda viene ripetuta per riempirla."] },
        { title: "Esame ufficiale attuale e indipendenza", paragraphs: ["L'articolo Apple attuale basa l'esame su iOS 26, iPadOS 26 e macOS Tahoe. Superare Apple Device Support Exam assegna il badge Apple Certified Support Professional. Verifica obiettivi e registrazione ufficiali prima di prenotare. CertifyQuiz è indipendente, non è affiliato né approvato da Apple e non offre dump o garanzie di superamento."] },
      ],
      fr: [
        { title: "Public et prérequis", paragraphs: ["Pour les techniciens help desk qui assistent des appareils Apple en organisation. Commencez avec l'usage de base d'iPhone, d'iPad et de Mac et des connaissances IT. Pratiquez sur des appareils autorisés et vérifiez les sauvegardes avant récupération."] },
        { title: "Contenu du premier lancement", paragraphs: ["Neuf sujets suivent le cours Apple actuel : fondamentaux ; gestion et identités ; récupération iPhone/iPad et Mac ; mises à jour, stockage et Continuity ; réseaux ; confidentialité et sécurité ; diagnostic. Chaque sujet propose cinq questions originales à réponse unique, quatre options, explications et une révision dans les quatre langues. Les 45 questions sont traduites, pas 180 questions différentes. Les révisions suivent les règles gratuites et premium existantes de CertifyQuiz."] },
        { title: "Méthode d'étude", paragraphs: ["Lisez la révision, réalisez la procédure puis répondez au quiz du sujet. Reliez les sujets avec l'entraînement mixte et revoyez erreurs et sources officielles. Le package échantillonne les objectifs sans couvrir tout l'examen. L'examen blanc est indisponible pour ce lancement. Aucune question n'est répétée pour remplir une simulation."] },
        { title: "Examen officiel actuel et indépendance", paragraphs: ["L'article Apple actuel base l'examen sur iOS 26, iPadOS 26 et macOS Tahoe. Réussir Apple Device Support Exam attribue le badge Apple Certified Support Professional. Vérifiez objectifs et inscription officiels avant réservation. CertifyQuiz est indépendant, sans affiliation ni approbation d'Apple, et ne propose ni dumps ni garantie de réussite."] },
      ],
      es: [
        { title: "Destinatarios y requisitos previos", paragraphs: ["Para técnicos help desk que asisten dispositivos Apple en organizaciones. Parte del uso básico de iPhone, iPad y Mac y conocimientos IT. Practica en dispositivos autorizados y verifica copias antes de ejercicios de recuperación."] },
        { title: "Contenido del primer lanzamiento", paragraphs: ["Nueve temas siguen el curso Apple actual: fundamentos; gestión e identidades; recuperación iPhone/iPad y Mac; actualizaciones, espacio y Continuity; redes; privacidad y seguridad; diagnóstico. Cada tema tiene cinco preguntas originales de respuesta única, cuatro opciones, explicaciones y un repaso en los cuatro idiomas. Las 45 preguntas están traducidas, no son 180 preguntas distintas. Los repasos siguen las reglas gratuitas y premium existentes de CertifyQuiz."] },
        { title: "Cómo estudiar", paragraphs: ["Lee el repaso, realiza el procedimiento y responde al quiz del tema. Relaciona temas con entrenamiento mixto y revisa errores y fuentes oficiales. El paquete muestra objetivos sin cubrir todo el examen. La simulación de examen no está disponible para este lanzamiento. Ninguna pregunta se repite para completar una simulación."] },
        { title: "Examen oficial actual e independencia", paragraphs: ["El artículo Apple actual basa el examen en iOS 26, iPadOS 26 y macOS Tahoe. Aprobar Apple Device Support Exam otorga la insignia Apple Certified Support Professional. Comprueba objetivos e inscripción oficiales antes de reservar. CertifyQuiz es independiente, sin afiliación ni respaldo de Apple, y no ofrece dumps ni garantía de aprobar."] },
      ],
    },
    examReference: Object.fromEntries(["en", "it", "fr", "es"].map(lang => [lang, [
      { text: "Apple Device Support", url: "https://it-training.apple.com/support/tutorials/course/" },
      { text: "Apple: Preparing for the Exam", url: "https://it-training.apple.com/support/tutorials/course/sup020/" },
      { text: "Apple: Taking the Exam", url: "https://it-training.apple.com/support/tutorials/course/sup030/" },
    ]])) as Record<"en" | "it" | "fr" | "es", { text: string; url: string }[]>,
  },
  quizRoute: {
    it: "/it/quiz/apple-device-support",
    en: "/en/quiz/apple-device-support",
    fr: "/fr/quiz/apple-device-support",
    es: "/es/quiz/apple-device-support",
  },

  backRoute: {
    it: "/it/certificazioni",
    en: "/certifications",
    fr: "/fr/certifications",
    es: "/es/certificaciones",
  },
};

export default AppleDeviceSupport;
