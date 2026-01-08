// src/certifications/data/pekit.ts
// Modulo dati per "PEKIT" (no React/JSX).

const PEKIT = {
  slug: "pekit",
  imageUrl: "/images/certifications/pekit.png",

  // Pagina ufficiale del progetto PEKIT
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

  description: {
    it: "La certificazione PEKIT è un programma di formazione per sviluppare competenze digitali nel settore informatico.",
    en: "The PEKIT certification is a training program to develop digital skills in the IT sector.",
    fr: "La certification PEKIT est un programme de formation pour développer des compétences numériques dans le domaine informatique.",
    es: "La certificación PEKIT es un programa de formación para desarrollar habilidades digitales en el sector informático.",
  },

  topics: [
    { it: "Concetti base dell'informatica", en: "Basic IT concepts", fr: "Notions de base en informatique", es: "Conceptos básicos de informática" },
    { it: "Gestione operativa del PC", en: "PC operation and management", fr: "Gestion opérationnelle de l'ordinateur", es: "Gestión operativa del PC" },
    { it: "Strumenti digitali per la produttività", en: "Digital productivity tools", fr: "Outils numériques de productivité", es: "Herramientas digitales de productividad" },
    { it: "Cybersecurity e protezione dei dati", en: "Cybersecurity and data protection", fr: "Cybersécurité et protection des données", es: "Ciberseguridad y protección de datos" },
    { it: "Programmazione e sviluppo web", en: "Programming and web development", fr: "Programmation et développement web", es: "Programación y desarrollo web" },
  ],

  extraContent: {
    // 🧠 Cosa si impara
    learn: {
      it: [
        "Comprendere i concetti fondamentali dell'informatica.",
        "Utilizzare strumenti digitali per lavorare in modo efficiente.",
        "Navigare in sicurezza e proteggere i propri dati.",
        "Muovere i primi passi nello sviluppo web.",
      ],
      en: [
        "Understand the fundamental concepts of computing.",
        "Use digital tools for efficient work.",
        "Browse safely and protect your data.",
        "Take the first steps in web development.",
      ],
      fr: [
        "Comprendre les concepts fondamentaux de l'informatique.",
        "Utiliser des outils numériques pour travailler efficacement.",
        "Naviguer en toute sécurité et protéger ses données.",
        "Faire ses premiers pas dans le développement web.",
      ],
      es: [
        "Comprender los conceptos fundamentales de la informática.",
        "Utilizar herramientas digitales para trabajar eficientemente.",
        "Navegar de forma segura y proteger tus datos.",
        "Dar los primeros pasos en el desarrollo web.",
      ],
    },

    // 💡 Perché scegliere PEKIT
    whyChoose: {
      it: [
        "Ideale per chi vuole certificare le proprie competenze digitali di base.",
        "Riconosciuta in ambito scolastico e lavorativo.",
        "Utile per prepararsi a ruoli entry-level nel mondo IT.",
      ],
      en: [
        "Ideal for those who want to certify their basic digital skills.",
        "Recognized in education and employment sectors.",
        "Useful preparation for entry-level roles in IT.",
      ],
      fr: [
        "Idéal pour ceux qui souhaitent certifier leurs compétences numériques de base.",
        "Reconnue dans les secteurs éducatif et professionnel.",
        "Utile pour se préparer à des rôles débutants dans l'informatique.",
      ],
      es: [
        "Ideal para quienes desean certificar sus habilidades digitales básicas.",
        "Reconocida en los sectores educativo y laboral.",
        "Útil para prepararse para puestos iniciales en TI.",
      ],
    },

    // 🧾 Percorsi/esami ufficiali
    examReference: {
      it: [
        { text: "Catalogo ufficiale certificazioni PEKIT", url: "https://www.pekitproject.it" },
        { text: "PEKIT Expert • Percorso base (4 moduli)", url: "https://www.pekitproject.it" },
        { text: "PEKIT Advanced • Moduli specialistici", url: "https://www.pekitproject.it" },
        { text: "PEKIT Security & Privacy • Sicurezza e GDPR", url: "https://www.pekitproject.it" },
      ],
      en: [
        { text: "Official PEKIT Certifications Catalog", url: "https://www.pekitproject.it" },
        { text: "PEKIT Expert • Core path (4 modules)", url: "https://www.pekitproject.it" },
        { text: "PEKIT Advanced • Specialist modules", url: "https://www.pekitproject.it" },
        { text: "PEKIT Security & Privacy • Security and GDPR", url: "https://www.pekitproject.it" },
      ],
      fr: [
        { text: "Catalogue officiel des certifications PEKIT", url: "https://www.pekitproject.it" },
        { text: "PEKIT Expert • Parcours de base (4 modules)", url: "https://www.pekitproject.it" },
        { text: "PEKIT Advanced • Modules spécialisés", url: "https://www.pekitproject.it" },
        { text: "PEKIT Security & Privacy • Sécurité et RGPD", url: "https://www.pekitproject.it" },
      ],
      es: [
        { text: "Catálogo oficial de certificaciones PEKIT", url: "https://www.pekitproject.it" },
        { text: "PEKIT Expert • Ruta base (4 módulos)", url: "https://www.pekitproject.it" },
        { text: "PEKIT Advanced • Módulos especializados", url: "https://www.pekitproject.it" },
        { text: "PEKIT Security & Privacy • Seguridad y GDPR", url: "https://www.pekitproject.it" },
      ],
    },

    // ❓ FAQ
    faq: {
      it: [
        { q: "È adatta anche a studenti o principianti?", a: "Assolutamente sì. È pensata per chi inizia a muovere i primi passi nel digitale." },
        { q: "Serve esperienza nel settore?", a: "No, non è richiesta esperienza pregressa." },
      ],
      en: [
        { q: "Is it suitable for students or beginners?", a: "Absolutely. It's designed for those starting their digital journey." },
        { q: "Is prior experience required?", a: "No, previous experience is not necessary." },
      ],
      fr: [
        { q: "Convient-elle aux étudiants ou débutants ?", a: "Absolument. Elle est conçue pour ceux qui débutent dans le numérique." },
        { q: "Une expérience est-elle requise ?", a: "Non, aucune expérience préalable n'est nécessaire." },
      ],
      es: [
        { q: "¿Es adecuada para estudiantes o principiantes?", a: "Absolutamente. Está pensada para quienes empiezan en el mundo digital." },
        { q: "¿Se necesita experiencia previa?", a: "No, no se requiere experiencia previa." },
      ],
    },
  },

  // Rotte quiz localizzate
  quizRoute: {
    it: "/it/quiz/pekit",
    en: "/en/quiz/pekit",
    fr: "/fr/quiz/pekit",
    es: "/es/quiz/pekit",
  },

  // Rotta “indietro” localizzata (verso lista certificazioni)
  backRoute: {
    it: "/it/certificazioni",
    en: "/certifications",
    fr: "/fr/certifications",
    es: "/es/certificaciones",
  },
} as const;

export default PEKIT;
