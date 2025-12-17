// src/certifications/data/ecdl.ts
// ✅ Versione data-only (nessun JSX/router). Allineata al tuo modello semplice.
// ℹ️ Nota naming: in IT resta “ECDL”; nelle altre lingue usiamo “ICDL”.
// 🖼️ Attenzione al path dell’immagine: mettila in /public/images/certifications/ecdl.png
//     e qui lascia /images/certifications/ecdl.png (Next servirà dal public/).

const ECDL_ICDL = {
  slug: "ecdl",
  imageUrl: "/images/certifications/ecdl.png",
  officialUrl: "https://icdl.org/icdl-modules-programs/",

  title: {
    it: "ECDL",
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

  description: {
    it: "La certificazione ECDL attesta le competenze informatiche di base riconosciute a livello internazionale.",
    en: "The ICDL certification proves internationally recognized basic computer skills.",
    fr: "La certification ICDL atteste des compétences informatiques de base reconnues au niveau international.",
    es: "La certificación ICDL acredita competencias informáticas básicas reconocidas internacionalmente.",
  },

  topics: [
    { it: "Concetti di base dell'ICT", en: "Fundamentals of ICT", fr: "Notions de base sur les TIC", es: "Conceptos básicos de las TIC" },
    { it: "Uso del computer e gestione dei file", en: "Computer use and file management", fr: "Utilisation de l'ordinateur et gestion des fichiers", es: "Uso del ordenador y gestión de archivos" },
    { it: "Elaborazione testi", en: "Word processing", fr: "Traitement de texte", es: "Procesador de textos" },
    { it: "Foglio elettronico", en: "Spreadsheets", fr: "Tableurs", es: "Hojas de cálculo" },
    { it: "Uso delle basi di dati", en: "Database usage", fr: "Utilisation des bases de données", es: "Uso de bases de datos" },
  ],

  extraContent: {
    // 🔗 Moduli ufficiali ICDL
    examReference: {
      it: [
        { text: "Computer & Online Essentials (modulo ufficiale)", url: "https://icdl.org/workforce/computer-and-online-essentials/" },
        { text: "Documents / Word Processing (modulo ufficiale)", url: "https://icdl.org/workforce/documents/" },
        { text: "Spreadsheets (modulo ufficiale)", url: "https://icdl.org/workforce/spreadsheets/" },
        { text: "Using Databases (modulo ufficiale)", url: "https://icdl.org/professional/using-databases/" },
      ],
      en: [
        { text: "Computer & Online Essentials (official module)", url: "https://icdl.org/workforce/computer-and-online-essentials/" },
        { text: "Documents / Word Processing (official module)", url: "https://icdl.org/workforce/documents/" },
        { text: "Spreadsheets (official module)", url: "https://icdl.org/workforce/spreadsheets/" },
        { text: "Using Databases (official module)", url: "https://icdl.org/professional/using-databases/" },
      ],
      fr: [
        { text: "Computer & Online Essentials (module officiel)", url: "https://icdl.org/workforce/computer-and-online-essentials/" },
        { text: "Documents / Traitement de texte (module officiel)", url: "https://icdl.org/workforce/documents/" },
        { text: "Tableurs (module officiel)", url: "https://icdl.org/workforce/spreadsheets/" },
        { text: "Using Databases (module officiel)", url: "https://icdl.org/professional/using-databases/" },
      ],
      es: [
        { text: "Computer & Online Essentials (módulo oficial)", url: "https://icdl.org/workforce/computer-and-online-essentials/" },
        { text: "Documents / Procesador de textos (módulo oficial)", url: "https://icdl.org/workforce/documents/" },
        { text: "Spreadsheets (módulo oficial)", url: "https://icdl.org/workforce/spreadsheets/" },
        { text: "Using Databases (módulo oficial)", url: "https://icdl.org/professional/using-databases/" },
      ],
    },

    learn: {
      it: [
        "Acquisire competenze fondamentali nell’uso del computer e delle applicazioni office.",
        "Gestire file e dati in modo efficiente.",
        "Utilizzare correttamente le reti e internet in ambito lavorativo.",
        "Applicare concetti base di sicurezza informatica.",
        "Usare strumenti digitali per la produttività personale e professionale.",
      ],
      en: [
        "Gain fundamental skills in computer use and office applications.",
        "Efficiently manage files and data.",
        "Properly use networks and the internet for work.",
        "Apply basic IT security concepts.",
        "Use digital tools for personal and professional productivity.",
      ],
      fr: [
        "Acquérir des compétences fondamentales en utilisation d’ordinateur et applications bureautiques.",
        "Gérer efficacement les fichiers et les données.",
        "Utiliser correctement les réseaux et Internet au travail.",
        "Appliquer les concepts de base de la sécurité informatique.",
        "Utiliser des outils numériques pour la productivité personnelle et professionnelle.",
      ],
      es: [
        "Adquirir habilidades fundamentales en el uso de computadoras y aplicaciones de oficina.",
        "Gestionar archivos y datos de manera eficiente.",
        "Usar correctamente redes e Internet para el trabajo.",
        "Aplicar conceptos básicos de seguridad informática.",
        "Utilizar herramientas digitales para la productividad personal y profesional.",
      ],
    },

    whyChoose: {
      it: [
        "Certificazione riconosciuta a livello internazionale.",
        "Ideale per migliorare le competenze digitali base richieste dal mercato del lavoro.",
        "Adatta a studenti, lavoratori e chiunque voglia certificare le proprie competenze informatiche.",
        "Facile da preparare grazie a risorse accessibili e test pratici.",
        "Punto di partenza per certificazioni IT più avanzate.",
      ],
      en: [
        "Internationally recognized certification.",
        "Ideal for improving basic digital skills required by the job market.",
        "Suitable for students, workers, and anyone wanting to certify their IT skills.",
        "Easy to prepare with accessible resources and practical tests.",
        "A starting point for more advanced IT certifications.",
      ],
      fr: [
        "Certification reconnue au niveau international.",
        "Idéale pour améliorer les compétences numériques de base demandées sur le marché du travail.",
        "Adaptée aux étudiants, travailleurs et toute personne souhaitant certifier ses compétences informatiques.",
        "Facile à préparer grâce à des ressources accessibles et des tests pratiques.",
        "Point de départ pour des certifications IT plus avancées.",
      ],
      es: [
        "Certificación reconocida internacionalmente.",
        "Ideal para mejorar habilidades digitales básicas requeridas en el mercado laboral.",
        "Adecuada para estudiantes, trabajadores y cualquiera que desee certificar sus habilidades informáticas.",
        "Fácil de preparar con recursos accesibles y pruebas prácticas.",
        "Punto de partida para certificaciones de TI más avanzadas.",
      ],
    },

    faq: {
      it: [
        { q: "Chi può sostenere la certificazione ECDL?", a: "Chiunque voglia certificare le proprie competenze informatiche di base, senza limiti di età o professione." },
        { q: "Quanto dura la certificazione?", a: "La certificazione non ha scadenza, ma è consigliabile aggiornare le competenze periodicamente." },
        { q: "Quali argomenti sono inclusi nell’esame?", a: "Uso del computer, gestione file, elaborazione testi, fogli di calcolo e basi di dati." },
      ],
      en: [
        { q: "Who can take the ECDL/ICDL certification?", a: "Anyone wanting to certify basic computer skills, regardless of age or profession." },
        { q: "How long is the certification valid?", a: "The certification does not expire, but it's recommended to update skills periodically." },
        { q: "What topics are included in the exam?", a: "Computer use, file management, word processing, spreadsheets, and databases." },
      ],
      fr: [
        { q: "Qui peut passer la certification ICDL ?", a: "Toute personne souhaitant certifier ses compétences informatiques de base, sans limite d’âge ni de profession." },
        { q: "Quelle est la durée de validité de la certification ?", a: "La certification n’expire pas, mais il est conseillé de mettre à jour régulièrement ses compétences." },
        { q: "Quels sujets sont inclus dans l’examen ?", a: "Utilisation de l’ordinateur, gestion des fichiers, traitement de texte, tableurs et bases de données." },
      ],
      es: [
        { q: "¿Quién puede obtener la certificación ICDL?", a: "Cualquier persona que desee certificar habilidades informáticas básicas, sin límite de edad o profesión." },
        { q: "¿Cuánto dura la certificación?", a: "La certificación no caduca, pero se recomienda actualizar las habilidades periódicamente." },
        { q: "¿Qué temas incluye el examen?", a: "Uso del ordenador, gestión de archivos, procesamiento de textos, hojas de cálculo y bases de datos." },
      ],
    },
  },

  // Rotte quiz localizzate
  quizRoute: {
    it: "/it/quiz/ecdl",
    en: "/quiz/ecdl",
    fr: "/fr/quiz/ecdl",
    es: "/es/quiz/ecdl",
  },

  // Rotta “indietro”: lista certificazioni per lingua (coerente con gli altri data/*.ts)
  backRoute: {
    it: "/it/certificazioni",
    en: "/certifications",
    fr: "/fr/certifications",
    es: "/es/certificaciones",
  },
} as const;

export default ECDL_ICDL;
