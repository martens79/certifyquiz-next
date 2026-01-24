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

    // ✅ SEO booster: risponde esattamente alle query “current … certification” e “2021/2023”
    currentCertification: {
      it: [
        "Molti utenti cercano “Microsoft SQL Server certification 2021/2023”: oggi il percorso ufficiale Microsoft è orientato alle certificazioni role-based su Azure Data.",
        "Se il tuo obiettivo è lavorare con SQL Server e database Microsoft, le due tappe più utili sono DP-900 (fondamenti dati) e DP-300 (amministrazione di Azure SQL).",
        "Questa pagina ti aiuta a studiare SQL e SQL Server in pratica (query, modellazione, performance, backup), competenze valide anche nei percorsi moderni Microsoft.",
      ],
      en: [
        "Many users search for “Microsoft SQL Server certification 2021/2023”: today Microsoft’s official path focuses on role-based Azure Data certifications.",
        "If your goal is to work with SQL Server and Microsoft databases, the two most relevant steps are DP-900 (data fundamentals) and DP-300 (administering Azure SQL).",
        "This page helps you practice core SQL/SQL Server skills (queries, modeling, performance, backup) that remain valuable across modern Microsoft tracks.",
      ],
      fr: [
        "Beaucoup recherchent “Microsoft SQL Server certification 2021/2023” : aujourd’hui, le parcours officiel Microsoft est surtout orienté vers les certifications Azure Data (role-based).",
        "Si ton objectif est de travailler avec SQL Server et l’écosystème Microsoft, les étapes les plus pertinentes sont DP-900 (fondamentaux data) et DP-300 (administration d’Azure SQL).",
        "Cette page t’aide à pratiquer les compétences SQL/SQL Server clés (requêtes, modélisation, performances, sauvegarde), utiles aussi dans les parcours Microsoft actuels.",
      ],
      es: [
        "Muchos buscan “Microsoft SQL Server certification 2021/2023”: hoy el camino oficial de Microsoft se centra en certificaciones role-based de Azure Data.",
        "Si tu objetivo es trabajar con SQL Server y bases de datos Microsoft, los pasos más relevantes son DP-900 (fundamentos de datos) y DP-300 (administración de Azure SQL).",
        "Esta página te ayuda a practicar habilidades clave de SQL/SQL Server (consultas, modelado, rendimiento, copias de seguridad) que siguen siendo valiosas en rutas modernas de Microsoft.",
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
        { q: "Qual è la certificazione Microsoft SQL “attuale”?", a: "Oggi Microsoft punta su certificazioni role-based nell’area Azure Data. Per iniziare: DP-900. Per amministrare soluzioni Azure SQL: DP-300." },
        { q: "SQL Server certification 2021/2023 esiste ancora?", a: "Molte certificazioni “SQL Server” storiche sono state sostituite o reindirizzate verso percorsi Azure Data. Le competenze SQL/SQL Server restano però fondamentali e riutilizzabili." },
        { q: "SQL Server è gratuito?", a: "Microsoft offre una versione gratuita chiamata SQL Server Express con funzionalità limitate." },
        { q: "Serve conoscere SQL per questa certificazione?", a: "Sì, è essenziale conoscere SQL per affrontare gli argomenti dell'esame." },
        { q: "Serve esperienza pratica con SQL Server?", a: "È consigliata, ma si può iniziare anche da zero con i giusti materiali." },
      ],
      en: [
        { q: "What is the current Microsoft SQL certification?", a: "Today Microsoft focuses on role-based Azure Data certifications. To start: DP-900. To administer Azure SQL solutions: DP-300." },
        { q: "Does the SQL Server certification 2021/2023 still exist?", a: "Many legacy “SQL Server” certifications were replaced or redirected toward Azure Data tracks. However, core SQL/SQL Server skills remain essential and transferable." },
        { q: "Is SQL Server free?", a: "Microsoft provides a free version called SQL Server Express with limited features." },
        { q: "Do I need to know SQL for this certification?", a: "Yes, SQL knowledge is essential for exam topics." },
        { q: "Do I need hands-on experience with SQL Server?", a: "It’s recommended, but you can start from scratch with proper materials." },
      ],
      fr: [
        { q: "Quelle est la certification Microsoft SQL “actuelle” ?", a: "Aujourd’hui Microsoft privilégie les certifications Azure Data (role-based). Pour débuter : DP-900. Pour administrer Azure SQL : DP-300." },
        { q: "La certification SQL Server 2021/2023 existe-t-elle encore ?", a: "De nombreuses anciennes certifications “SQL Server” ont été remplacées ou redirigées vers des parcours Azure Data. Les compétences SQL/SQL Server restent toutefois essentielles et transférables." },
        { q: "SQL Server est-il gratuit ?", a: "Microsoft propose une version gratuite appelée SQL Server Express avec des fonctionnalités limitées." },
        { q: "Faut-il connaître SQL pour cette certification ?", a: "Oui, la connaissance du SQL est essentielle pour l'examen." },
        { q: "Faut-il avoir de l'expérience avec SQL Server ?", a: "C’est recommandé, mais on peut débuter avec de bons supports." },
      ],
      es: [
        { q: "¿Cuál es la certificación Microsoft SQL “actual”?", a: "Hoy Microsoft se centra en certificaciones role-based de Azure Data. Para empezar: DP-900. Para administrar Azure SQL: DP-300." },
        { q: "¿Sigue existiendo la certificación SQL Server 2021/2023?", a: "Muchas certificaciones antiguas de “SQL Server” fueron reemplazadas o redirigidas a rutas de Azure Data. Aun así, las habilidades de SQL/SQL Server siguen siendo esenciales y transferibles." },
        { q: "¿SQL Server es gratuito?", a: "Microsoft ofrece una versión gratuita llamada SQL Server Express con funciones limitadas." },
        { q: "¿Necesito saber SQL para esta certificación?", a: "Sí, es esencial conocer SQL para el examen." },
        { q: "¿Necesito experiencia práctica con SQL Server?", a: "Se recomienda, aunque puedes empezar desde cero con buen material." },
      ],
    },
  },

  // Rotte quiz localizzate
    quizRoute: {
    it: "/it/quiz/microsoft-sql-server",
    en: "/en/quiz/microsoft-sql-server",
    fr: "/fr/quiz/microsoft-sql-server",
    es: "/es/quiz/microsoft-sql-server",
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
