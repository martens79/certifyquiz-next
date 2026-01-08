// src/certifications/data/sql-server.ts
// Modulo dati puro per la pagina "Microsoft SQL Server" (no React/JSX).

const MicrosoftSQLServer = {
  slug: "microsoft-sql-server",
  imageUrl: "/images/certifications/sqlserver.png",

  // 🔗 Pagina “ufficiale” di prodotto (documentazione SQL Server)
  officialUrl: "https://learn.microsoft.com/sql/",

  title: {
    it: "Microsoft SQL Server",
    en: "Microsoft SQL Server",
    fr: "Microsoft SQL Server",
    es: "Microsoft SQL Server",
  },

  level: {
    it: "Intermedio",
    en: "Intermediate",
    fr: "Intermédiaire",
    es: "Intermedio",
  },

  description: {
    it: "Certificazione dedicata alla gestione e sviluppo di database con Microsoft SQL Server, una delle piattaforme più richieste nel mondo del lavoro.",
    en: "Certification focused on managing and developing databases with Microsoft SQL Server, one of the most in-demand platforms.",
    fr: "Certification dédiée à la gestion et au développement de bases de données avec Microsoft SQL Server, l'une des plateformes les plus demandées.",
    es: "Certificación centrada en la gestión y desarrollo de bases de datos con Microsoft SQL Server, una de las plataformas más solicitadas.",
  },

  topics: [
    { it: "Fondamenti di SQL", en: "SQL Fundamentals", fr: "Notions de base en SQL", es: "Fundamentos de SQL" },
    { it: "Modellazione e progettazione dei database", en: "Database Modeling and Design", fr: "Modélisation et conception de bases de données", es: "Modelado y diseño de bases de datos" },
    { it: "Stored procedure e funzioni", en: "Stored Procedures and Functions", fr: "Procédures stockées et fonctions", es: "Procedimientos almacenados y funciones" },
    { it: "Gestione delle performance", en: "Performance Management", fr: "Gestion des performances", es: "Gestión del rendimiento" },
    { it: "Backup, ripristino e sicurezza", en: "Backup, Restore, and Security", fr: "Sauvegarde, restauration et sécurité", es: "Copia de seguridad, restauración y seguridad" },
  ],

  extraContent: {
    // ✅ SOLO pagine d’esame ufficiali (role-based su Azure Data)
    examReference: {
      it: [
        { text: "DP-900: Microsoft Azure Data Fundamentals", url: "https://learn.microsoft.com/en-us/credentials/certifications/exams/dp-900/" },
        { text: "DP-300: Administering Microsoft Azure SQL Solutions", url: "https://learn.microsoft.com/en-us/credentials/certifications/exams/dp-300/" },
      ],
      en: [
        { text: "DP-900: Microsoft Azure Data Fundamentals", url: "https://learn.microsoft.com/en-us/credentials/certifications/exams/dp-900/" },
        { text: "DP-300: Administering Microsoft Azure SQL Solutions", url: "https://learn.microsoft.com/en-us/credentials/certifications/exams/dp-300/" },
      ],
      fr: [
        { text: "DP-900 : Notions fondamentales des données Microsoft Azure", url: "https://learn.microsoft.com/en-us/credentials/certifications/exams/dp-900/" },
        { text: "DP-300 : Administration des solutions Microsoft Azure SQL", url: "https://learn.microsoft.com/en-us/credentials/certifications/exams/dp-300/" },
      ],
      es: [
        { text: "DP-900: Fundamentos de datos de Microsoft Azure", url: "https://learn.microsoft.com/en-us/credentials/certifications/exams/dp-900/" },
        { text: "DP-300: Administración de soluciones Microsoft Azure SQL", url: "https://learn.microsoft.com/en-us/credentials/certifications/exams/dp-300/" },
      ],
    },

    learn: {
      it: [
        "Gestire database Microsoft SQL Server a livello professionale.",
        "Scrivere query SQL avanzate per estrazione e manipolazione dati.",
        "Progettare tabelle, indici, viste e stored procedure.",
        "Gestire sicurezza, backup e ripristino dei dati.",
        "Monitorare le performance e ottimizzare le query.",
      ],
      en: [
        "Manage Microsoft SQL Server databases professionally.",
        "Write advanced SQL queries for data retrieval and manipulation.",
        "Design tables, indexes, views, and stored procedures.",
        "Handle data security, backup, and restore.",
        "Monitor performance and optimize queries.",
      ],
      fr: [
        "Gérer des bases de données Microsoft SQL Server de manière professionnelle.",
        "Écrire des requêtes SQL avancées pour l'extraction et la manipulation des données.",
        "Concevoir des tables, index, vues et procédures stockées.",
        "Gérer la sécurité, la sauvegarde et la restauration des données.",
        "Surveiller les performances et optimiser les requêtes.",
      ],
      es: [
        "Gestionar bases de datos de Microsoft SQL Server profesionalmente.",
        "Escribir consultas SQL avanzadas para extracción y manipulación de datos.",
        "Diseñar tablas, índices, vistas y procedimientos almacenados.",
        "Gestionar seguridad, respaldo y recuperación de datos.",
        "Monitorear el rendimiento y optimizar las consultas.",
      ],
    },

    whyChoose: {
      it: [
        "SQL Server è una delle piattaforme database più usate al mondo.",
        "Rilevante in ambienti enterprise, finance e amministrazione pubblica.",
        "Richiesta da aziende che usano tecnologie Microsoft.",
        "Solida certificazione per data analyst e DBA.",
        "Ottima base per specializzazioni cloud come Azure SQL.",
      ],
      en: [
        "SQL Server is one of the most widely used database platforms globally.",
        "Relevant in enterprise, finance, and public sector environments.",
        "In demand by companies using Microsoft technologies.",
        "Solid certification for data analysts and DBAs.",
        "Great foundation for cloud specializations like Azure SQL.",
      ],
      fr: [
        "SQL Server est l'une des plateformes de base de données les plus utilisées au monde.",
        "Pertinent dans les environnements d'entreprise, de finance et du secteur public.",
        "Très recherché par les entreprises utilisant les technologies Microsoft.",
        "Certification solide pour les analystes de données et DBA.",
        "Bonne base pour les spécialisations cloud comme Azure SQL.",
      ],
      es: [
        "SQL Server es una de las plataformas de bases de datos más utilizadas en el mundo.",
        "Relevante en entornos empresariales, financieros y públicos.",
        "Demandado por empresas que usan tecnologías Microsoft.",
        "Certificación sólida para analistas de datos y administradores de bases de datos.",
        "Excelente base para especializaciones en la nube como Azure SQL.",
      ],
    },

    faq: {
      it: [
        { q: "SQL Server è gratuito?", a: "Microsoft offre una versione gratuita chiamata SQL Server Express con funzionalità limitate." },
        { q: "Serve conoscere SQL per questa certificazione?", a: "Sì, è essenziale conoscere SQL per affrontare gli argomenti dell'esame." },
        { q: "Serve esperienza pratica con SQL Server?", a: "È consigliata, ma si può iniziare anche da zero con i giusti materiali." },
      ],
      en: [
        { q: "Is SQL Server free?", a: "Microsoft provides a free version called SQL Server Express with limited features." },
        { q: "Do I need to know SQL for this certification?", a: "Yes, SQL knowledge is essential for exam topics." },
        { q: "Do I need hands-on experience with SQL Server?", a: "It’s recommended, but you can start from scratch with proper materials." },
      ],
      fr: [
        { q: "SQL Server est-il gratuit ?", a: "Microsoft propose une version gratuite appelée SQL Server Express avec des fonctionnalités limitées." },
        { q: "Faut-il connaître SQL pour cette certification ?", a: "Oui, la connaissance du SQL est essentielle pour l'examen." },
        { q: "Faut-il avoir de l'expérience avec SQL Server ?", a: "C’est recommandé, mais on peut débuter avec de bons supports." },
      ],
      es: [
        { q: "¿SQL Server es gratuito?", a: "Microsoft ofrece una versión gratuita llamada SQL Server Express con funciones limitadas." },
        { q: "¿Necesito saber SQL para esta certificación?", a: "Sí, es esencial conocer SQL para el examen." },
        { q: "¿Necesito experiencia práctica con SQL Server?", a: "Se recomienda, aunque puedes empezar desde cero con buen material." },
      ],
    },
  },

  // Rotte quiz localizzate
  quizRoute: {
    it: "/it/quiz/sql-server",
    en: "/en/quiz/sql-server",
    fr: "/fr/quiz/sql-server",
    es: "/es/quiz/sql-server",
  },

  // Rotta “indietro” alla categoria Database localizzata
  backRoute: {
    it: "/it/certificazioni",
    en: "/certifications",
    fr: "/fr/certifications",
    es: "/es/certificaciones",
  },
} as const;

export default MicrosoftSQLServer;
