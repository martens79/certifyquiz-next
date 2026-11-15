// src/certifications/data/pekit.ts
// ✅ Pagina certificazione PEKIT aggiornata in ottica SEO.
// ✅ Claim allineati alle fonti ufficiali (verificate il 2026-10-26):
//    - Schema di certificazione PEKIT Expert rev. 3.0 (novembre 2024) e Syllabus rev. 4.0
//    - Allegato CSACI al certificato di accreditamento Accredia 02266 Persons (rev. 000, 09/04/2025)
//    - O.M. 27/2026 e FAQ MIM sulle certificazioni informatiche GPS
//    Nessun punteggio GPS/ATA viene attribuito da CertifyQuiz: vale il bando.
// ⚠️ I 4 topic dei quiz NON corrispondono alle 4 fasi ufficiali (vedi FAQ "Cosa copre"): non
//    presentarli come copertura integrale del programma.
// ✅ Data-only: nessun JSX/router.

const PEKIT = {
  slug: "pekit",
  imageUrl: "/images/certifications/pekit.png",
  officialUrl: "https://www.pekitproject.it",

  title: {
    it: "PEKIT",
    en: "PEKIT",
    fr: "PEKIT",
    es: "PEKIT",
  },

  level: {
    it: "Base",
    en: "Basic",
    fr: "Base",
    es: "Básico",
  },

  metaTitle: {
    it: "PEKIT: quiz, simulazioni e preparazione per competenze digitali",
    en: "PEKIT: quizzes, practice tests and digital skills preparation",
    fr: "PEKIT : quiz, simulations et préparation aux compétences numériques",
    es: "PEKIT: quizzes, simulaciones y preparación en competencias digitales",
  },

  metaDescription: {
    it: "Preparati a PEKIT Expert con quiz e simulazioni su computer, file, Office, Internet e sicurezza di base. Preparazione indipendente, non ufficiale.",
    en: "Prepare for PEKIT with quizzes and practice tests on digital skills. Useful for basic ICT training, school and professional development.",
    fr: "Préparez la certification PEKIT avec des quiz et simulations sur les compétences numériques de base.",
    es: "Prepárate para PEKIT con quizzes y simulaciones sobre competencias digitales básicas.",
  },

  description: {
    it: "PEKIT Expert, rilasciata da Fondazione Sviluppo Europa, certifica le competenze digitali secondo il DigComp 2.2 con 4 esami da 36 domande e un livello di padronanza da 1 a 8 per ciascuna delle 5 aree. È accreditata Accredia dal 9 aprile 2025. CertifyQuiz offre una preparazione indipendente sugli argomenti di base (computer, file, Office, Internet e sicurezza) ma non copre ancora tutto il programma ufficiale: audio e video, e-learning e reti avanzate sono poco o per nulla coperti. Per graduatorie e concorsi controlla sempre che il titolo sia richiesto dal bando e che il certificato riporti il marchio Accredia.",
    en: "The PEKIT certification is focused on digital skills: computer use, online tools, security, productivity, communication and digital work. It is useful for learners and professionals who want to strengthen their ICT profile.",
    fr: "La certification PEKIT est axée sur les compétences numériques : utilisation de l’ordinateur, outils en ligne, sécurité, productivité, communication et travail numérique.",
    es: "La certificación PEKIT se centra en competencias digitales: uso del ordenador, herramientas online, seguridad, productividad, comunicación y trabajo digital.",
  },

  topics: [
    {
      title: {
        it: "Cominciare le operazioni",
        en: "Starting Operations",
        fr: "Commencer les opérations",
        es: "Comenzar las operaciones",
      },
      slug: {
        it: "cominciare-le-operazioni",
        en: "starting-operations",
        fr: "commencer-les-operations",
        es: "comenzar-las-operaciones",
      },
    },
    {
      title: {
        it: "Esplorare e risolvere",
        en: "Explore and Resolve",
        fr: "Explorer et résoudre",
        es: "Explorar y resolver",
      },
      slug: {
        it: "esplorare-e-risolvere",
        en: "explore-and-resolve",
        fr: "explorer-et-resoudre",
        es: "explorar-y-resolver",
      },
    },
    {
      title: {
        it: "Imparare e lavorare",
        en: "Learn and Work",
        fr: "Apprendre et travailler",
        es: "Aprender y trabajar",
      },
      slug: {
        it: "imparare-e-lavorare",
        en: "learn-and-work",
        fr: "apprendre-et-travailler",
        es: "aprender-y-trabajar",
      },
    },
    {
      title: {
        it: "Vivere in connessione",
        en: "Living Connected",
        fr: "Vivre connecté",
        es: "Vivir conectado",
      },
      slug: {
        it: "vivere-in-connessione",
        en: "living-connected",
        fr: "vivre-connecte",
        es: "vivir-conectado",
      },
    },
  ],

  extraContent: {
    learn: {
      it: [
        "Usare computer, file, cartelle, programmi e strumenti digitali con maggiore sicurezza.",
        "Comprendere le basi dell’informatica e dell’ambiente digitale moderno.",
        "Navigare online, comunicare, cercare informazioni e usare servizi web in modo consapevole.",
        "Proteggere dati personali, account, password e dispositivi dai rischi più comuni.",
        "Utilizzare strumenti utili per studio, lavoro, produttività e collaborazione digitale.",
        "Allenarti con quiz e simulazioni per capire quali argomenti conosci davvero e quali devi ripassare.",
      ],
      en: [
        "Use computers, files, folders, software and digital tools with more confidence.",
        "Understand the basics of computing and the modern digital environment.",
        "Browse online, communicate, search for information and use web services responsibly.",
        "Protect personal data, accounts, passwords and devices from common risks.",
        "Use tools for study, work, productivity and digital collaboration.",
        "Train with quizzes and practice tests to identify what you really know and what you need to review.",
      ],
      fr: [
        "Utiliser ordinateurs, fichiers, dossiers, logiciels et outils numériques avec plus de confiance.",
        "Comprendre les bases de l’informatique et de l’environnement numérique moderne.",
        "Naviguer en ligne, communiquer, rechercher des informations et utiliser les services web de manière responsable.",
        "Protéger les données personnelles, comptes, mots de passe et appareils contre les risques courants.",
        "Utiliser des outils pour les études, le travail, la productivité et la collaboration numérique.",
        "S’entraîner avec des quiz et simulations pour identifier les sujets à réviser.",
      ],
      es: [
        "Usar ordenadores, archivos, carpetas, programas y herramientas digitales con mayor seguridad.",
        "Comprender las bases de la informática y del entorno digital moderno.",
        "Navegar online, comunicarse, buscar información y usar servicios web de forma responsable.",
        "Proteger datos personales, cuentas, contraseñas y dispositivos frente a riesgos comunes.",
        "Usar herramientas para estudio, trabajo, productividad y colaboración digital.",
        "Entrenar con quizzes y simulaciones para detectar qué sabes realmente y qué debes repasar.",
      ],
    },

    whyChoose: {
      it: [
        "È allineata al DigComp 2.2 ed è accreditata Accredia dal 9 aprile 2025.",
        "Prevede 4 esami da 36 domande: ogni esame si supera con almeno il 70% del punteggio massimo.",
        "Il percorso parte dalle basi dell’uso del computer e arriva a reti, testi e fogli di calcolo avanzati.",
        "I quiz permettono di allenarsi in modo più concreto rispetto al semplice studio teorico.",
        "Lo schema ufficiale si rivolge a utenti generici, studenti, docenti e professionisti.",
      ],
      en: [
        "It helps demonstrate practical digital and ICT skills.",
        "It is suitable for beginners who want to build a solid digital foundation.",
        "It can strengthen a CV with basic technology competence.",
        "Quizzes make preparation more concrete than theory alone.",
        "It is useful for students, workers and professionals who want to update their digital skills.",
      ],
      fr: [
        "Elle permet de démontrer des compétences numériques pratiques.",
        "Elle convient aux débutants qui souhaitent construire une base numérique solide.",
        "Elle peut renforcer un CV avec des compétences technologiques de base.",
        "Les quiz rendent la préparation plus concrète que la théorie seule.",
        "Elle est utile aux étudiants, travailleurs et professionnels souhaitant mettre à jour leurs compétences numériques.",
      ],
      es: [
        "Ayuda a demostrar competencias digitales prácticas.",
        "Es adecuada para principiantes que quieren construir una base digital sólida.",
        "Puede reforzar el currículum con competencias tecnológicas básicas.",
        "Los quizzes hacen que la preparación sea más concreta que solo estudiar teoría.",
        "Es útil para estudiantes, trabajadores y profesionales que quieren actualizar sus competencias digitales.",
      ],
    },

    examReference: {
      it: [
        {
          text: "PEKIT Expert — pagina ufficiale",
          url: "https://www.pekitproject.it/studenti/certificazione-pekit-expert/",
        },
        {
          text: "Schema di certificazione e syllabus PEKIT Expert (rev. 3.0, novembre 2024)",
          url: "https://www.pekitproject.it/wordpress/wp-content/uploads/2025/06/Schema-cert.-Pekit-Expert-rev_3-Novembre-2024.pdf",
        },
        {
          text: "Verifica certificazioni PEKIT",
          url: "https://www.pekitproject.it/verifica-certificazioni/",
        },
      ],
      en: [
        {
          text: "PEKIT Expert — official page",
          url: "https://www.pekitproject.it/studenti/certificazione-pekit-expert/",
        },
        {
          text: "PEKIT Expert certification scheme and syllabus (rev. 3.0, November 2024, Italian)",
          url: "https://www.pekitproject.it/wordpress/wp-content/uploads/2025/06/Schema-cert.-Pekit-Expert-rev_3-Novembre-2024.pdf",
        },
        {
          text: "PEKIT certificate verification",
          url: "https://www.pekitproject.it/verifica-certificazioni/",
        },
      ],
      fr: [
        {
          text: "PEKIT Expert — page officielle",
          url: "https://www.pekitproject.it/studenti/certificazione-pekit-expert/",
        },
        {
          text: "Schéma de certification et syllabus PEKIT Expert (rév. 3.0, novembre 2024, en italien)",
          url: "https://www.pekitproject.it/wordpress/wp-content/uploads/2025/06/Schema-cert.-Pekit-Expert-rev_3-Novembre-2024.pdf",
        },
        {
          text: "Vérification des certificats PEKIT",
          url: "https://www.pekitproject.it/verifica-certificazioni/",
        },
      ],
      es: [
        {
          text: "PEKIT Expert — página oficial",
          url: "https://www.pekitproject.it/studenti/certificazione-pekit-expert/",
        },
        {
          text: "Esquema de certificación y syllabus PEKIT Expert (rev. 3.0, noviembre de 2024, en italiano)",
          url: "https://www.pekitproject.it/wordpress/wp-content/uploads/2025/06/Schema-cert.-Pekit-Expert-rev_3-Novembre-2024.pdf",
        },
        {
          text: "Verificación de certificados PEKIT",
          url: "https://www.pekitproject.it/verifica-certificazioni/",
        },
      ],
    },

    faq: {
      it: [
        {
          q: "PEKIT vale per docenti, ATA e concorsi?",
          a: "Dipende dal bando e dal tuo certificato. PEKIT indica la certificazione Expert, accreditata Accredia dal 9 aprile 2025, come CIAD per il personale ATA (esclusi i collaboratori scolastici). Per le GPS 2026/28 il Ministero valuta solo certificazioni di enti accreditati Accredia e conformi a DigComp 2.2 o DigCompEdu, una per framework: verifica con l’ente emittente e nella banca dati Accredia prima di sostenere l’esame. CertifyQuiz non assegna punteggi e non garantisce la validità di un titolo.",
        },
        {
          q: "CertifyQuiz rilascia la certificazione PEKIT ufficiale?",
          a: "No. CertifyQuiz offre quiz ed esercitazioni di preparazione indipendente. La certificazione ufficiale va sostenuta tramite un centro PEKIT o una sessione online autorizzata.",
        },
        {
          q: "PEKIT è adatta anche a principianti?",
          a: "Il percorso parte dalle basi (computer, sistema operativo, testi e fogli di calcolo), ma l’esame comprende anche reti e uso avanzato di Word ed Excel. I quiz di CertifyQuiz sono adatti a ripassare soprattutto gli argomenti di base.",
        },
        {
          q: "Perché prepararsi con i quiz?",
          a: "Perché i quiz ti costringono a verificare davvero quello che sai. Leggere la teoria è utile, ma allenarsi sulle domande aiuta a scoprire errori, lacune e argomenti da ripassare.",
        },
        {
          q: "Cosa copre questo percorso rispetto al programma ufficiale?",
          a: "I quiz di CertifyQuiz riguardano soprattutto computer e sistema operativo, gestione dei file, strumenti Office di base e Internet. Il programma ufficiale ha 4 fasi (Cominciare le operazioni, Vivere in connessione, Esperienza multimediale, Diventare esperti): audio e video, e-learning e reti avanzate sono poco o per nulla coperti. Consulta schema e syllabus ufficiali per l’elenco completo degli argomenti.",
        },
        {
          q: "Come si supera l’esame PEKIT Expert?",
          a: "La certificazione richiede 4 esami da 36 domande ciascuno; ogni esame si supera con almeno il 70% del punteggio massimo. Il certificato ha durata di 4 anni (fonte: schema di certificazione PEKIT Expert rev. 3.0, novembre 2024).",
        },
      ],
      en: [
        {
          q: "Is PEKIT useful for digital skills preparation?",
          a: "Yes. PEKIT is useful for validating basic digital skills for study, work and professional development.",
        },
        {
          q: "Does CertifyQuiz issue the official PEKIT certification?",
          a: "No. CertifyQuiz provides quizzes and preparation materials. The official certification must be taken through authorized providers.",
        },
        {
          q: "Is PEKIT suitable for beginners?",
          a: "Yes. It is suitable for beginners who want to build basic digital skills.",
        },
        {
          q: "Why prepare with quizzes?",
          a: "Because quizzes help verify what you really know and reveal weak areas before the exam.",
        },
      ],
      fr: [
        {
          q: "PEKIT est-elle utile pour les compétences numériques ?",
          a: "Oui. PEKIT est utile pour valider des compétences numériques de base pour les études, le travail ou le développement professionnel.",
        },
        {
          q: "CertifyQuiz délivre-t-il la certification officielle PEKIT ?",
          a: "Non. CertifyQuiz propose des quiz et du matériel de préparation. La certification officielle doit être passée auprès d’organismes autorisés.",
        },
        {
          q: "PEKIT convient-elle aux débutants ?",
          a: "Oui. Elle convient aux débutants qui souhaitent construire des compétences numériques de base.",
        },
        {
          q: "Pourquoi se préparer avec des quiz ?",
          a: "Parce que les quiz permettent de vérifier ce que vous savez vraiment et de repérer les points faibles avant l’examen.",
        },
      ],
      es: [
        {
          q: "¿PEKIT es útil para competencias digitales?",
          a: "Sí. PEKIT es útil para validar competencias digitales básicas para estudiar, trabajar o mejorar el perfil profesional.",
        },
        {
          q: "¿CertifyQuiz emite la certificación oficial PEKIT?",
          a: "No. CertifyQuiz ofrece quizzes y materiales de preparación. La certificación oficial debe realizarse mediante proveedores autorizados.",
        },
        {
          q: "¿PEKIT es adecuada para principiantes?",
          a: "Sí. Es adecuada para principiantes que quieren construir competencias digitales básicas.",
        },
        {
          q: "¿Por qué prepararse con quizzes?",
          a: "Porque los quizzes ayudan a comprobar lo que sabes realmente y detectar puntos débiles antes del examen.",
        },
      ],
    },
  },

  quizRoute: {
    it: "/it/quiz/pekit",
    en: "/en/quiz/pekit",
    fr: "/fr/quiz/pekit",
    es: "/es/quiz/pekit",
  },

  backRoute: {
    it: "/it/certificazioni",
    en: "/certifications",
    fr: "/fr/certifications",
    es: "/es/certificaciones",
  },
} as const;

export default PEKIT;