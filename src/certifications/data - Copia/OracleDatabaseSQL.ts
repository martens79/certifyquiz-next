// src/certifications/data/oracle-database-sql.ts
// Modulo dati per "Oracle Database SQL" (no React/JSX).

const OracleDatabaseSQL = {
  slug: "oracle-database-sql",
  imageUrl: "/images/certifications/oracle-sql.png",

  // Pagina ufficiale (landing certificazione) + pagina esame
  officialUrl: "https://education.oracle.com/sql-certification",
  officialExamUrl: "https://education.oracle.com/oracle-database-sql/pexam_1Z0-071",

  title: {
    it: "Oracle Database SQL",
    en: "Oracle Database SQL",
    fr: "Oracle Database SQL",
    es: "Oracle Database SQL",
  },

  level: {
    it: "Intermedio",
    en: "Intermediate",
    fr: "Intermédiaire",
    es: "Intermedio",
  },

  description: {
    it: "Certificazione Oracle che attesta le competenze nell’uso del linguaggio SQL per gestire e interrogare database.",
    en: "Oracle certification validating skills in using SQL to manage and query databases.",
    fr: "Certification Oracle validant les compétences en SQL pour gérer et interroger des bases de données.",
    es: "Certificación de Oracle que valida habilidades en el uso de SQL para gestionar y consultar bases de datos.",
  },

  topics: [
    { it: "Comandi SQL di base", en: "Basic SQL commands", fr: "Commandes SQL de base", es: "Comandos SQL básicos" },
    { it: "Gestione di tabelle e indici", en: "Table and index management", fr: "Gestion des tables et des index", es: "Gestión de tablas e índices" },
    { it: "Query complesse e JOIN", en: "Complex queries and JOINs", fr: "Requêtes complexes et JOIN", es: "Consultas complejas y JOINs" },
    { it: "Funzioni e subquery", en: "Functions and subqueries", fr: "Fonctions et sous-requêtes", es: "Funciones y subconsultas" },
    { it: "Sicurezza e autorizzazioni", en: "Security and permissions", fr: "Sécurité et autorisations", es: "Seguridad y permisos" },
  ],

  extraContent: {
    // ✅ SOLO pagine d’esame ufficiali
    examReference: {
      it: [
        { text: "1Z0-071 • Oracle Database SQL (pagina esame ufficiale)", url: "https://education.oracle.com/oracle-database-sql/pexam_1Z0-071" },
      ],
      en: [
        { text: "1Z0-071 • Oracle Database SQL (official exam page)", url: "https://education.oracle.com/oracle-database-sql/pexam_1Z0-071" },
      ],
      fr: [
        { text: "1Z0-071 • Oracle Database SQL (page d’examen officielle)", url: "https://education.oracle.com/oracle-database-sql/pexam_1Z0-071" },
      ],
      es: [
        { text: "1Z0-071 • Oracle Database SQL (página oficial del examen)", url: "https://education.oracle.com/oracle-database-sql/pexam_1Z0-071" },
      ],
    },

    learn: {
      it: [
        "Scrivere query SQL per interrogare e modificare i dati.",
        "Gestire tabelle, viste e indici in un database Oracle.",
        "Utilizzare funzioni e sottoquery per analisi avanzate.",
        "Garantire la sicurezza e l’integrità dei dati.",
      ],
      en: [
        "Write SQL queries to retrieve and manipulate data.",
        "Manage tables, views, and indexes in an Oracle database.",
        "Use functions and subqueries for advanced analysis.",
        "Ensure data security and integrity.",
      ],
      fr: [
        "Écrire des requêtes SQL pour interroger et manipuler les données.",
        "Gérer tables, vues et index dans une base Oracle.",
        "Utiliser fonctions et sous-requêtes pour des analyses avancées.",
        "Assurer la sécurité et l’intégrité des données.",
      ],
      es: [
        "Escribir consultas SQL para recuperar y modificar datos.",
        "Gestionar tablas, vistas e índices en una base de datos Oracle.",
        "Utilizar funciones y subconsultas para análisis avanzados.",
        "Garantizar la seguridad e integridad de los datos.",
      ],
    },

    whyChoose: {
      it: [
        "Riconosciuta globalmente nel settore dei database.",
        "Fondamentale per ruoli di DBA e SQL developer.",
        "Base per certificazioni Oracle più avanzate.",
      ],
      en: [
        "Globally recognized in the database field.",
        "Essential for DBA and SQL developer roles.",
        "Foundation for more advanced Oracle certifications.",
      ],
      fr: [
        "Reconnue mondialement dans le domaine des bases de données.",
        "Essentielle pour les rôles d’administrateur ou développeur SQL.",
        "Base pour des certifications Oracle plus avancées.",
      ],
      es: [
        "Reconocida mundialmente en el área de bases de datos.",
        "Esencial para DBA y desarrolladores SQL.",
        "Base para certificaciones de Oracle más avanzadas.",
      ],
    },

    faq: {
      it: [
        { q: "È adatta ai principianti?", a: "Consigliata una conoscenza base di SQL prima di affrontarla." },
        { q: "Serve una versione specifica di Oracle Database?", a: "Competenze version-neutral; pratica consigliata con Oracle 19c o superiore." },
        { q: "Dettagli d’esame", a: "≈120 min; ~65–85 domande MCQ/MR. Lingua: inglese (altre variabili per regione). Verifica sempre la pagina ufficiale per punteggio e aggiornamenti." },
      ],
      en: [
        { q: "Is it suitable for beginners?", a: "Basic SQL knowledge is recommended beforehand." },
        { q: "Do I need a specific Oracle version?", a: "Version-neutral skills; practice with Oracle 19c or later is suggested." },
        { q: "Exam details", a: "≈120 minutes; ~65–85 MCQ/MR. Language: English (others vary by region). Always check the official page for passing score/updates." },
      ],
      fr: [
        { q: "Convient-elle aux débutants ?", a: "Des bases en SQL sont recommandées au préalable." },
        { q: "Faut-il une version Oracle spécifique ?", a: "Compétences indépendantes de la version ; pratique conseillée avec Oracle 19c ou ultérieur." },
        { q: "Détails de l’examen", a: "≈120 min ; ~65–85 QCM/réponses multiples. Langue : anglais (autres selon région). Vérifiez la page officielle pour score/MAJ." },
      ],
      es: [
        { q: "¿Es adecuada para principiantes?", a: "Se recomienda conocimiento básico de SQL previamente." },
        { q: "¿Necesito una versión específica de Oracle?", a: "Habilidades neutrales a la versión; practica con Oracle 19c o superior." },
        { q: "Detalles del examen", a: "≈120 min; ~65–85 preguntas MCQ/MR. Idioma: inglés (otros según región). Consulta la página oficial para puntaje/actualizaciones." },
      ],
    },
  },

  // Rotte quiz localizzate (coerenti con il router Next/SPA)
  quizRoute: {
    it: "/it/quiz/oracle-sql",
    en: "/quiz/oracle-sql",
    fr: "/fr/quiz/oracle-sql",
    es: "/es/quiz/oracle-sql",
  },

  // Rotta “indietro” (lista certificazioni) localizzata
  backRoute: {
    it: "/it/certificazioni",
    en: "/certifications",
    fr: "/fr/certifications",
    es: "/es/certificaciones",
  },
} as const;

export default OracleDatabaseSQL;
