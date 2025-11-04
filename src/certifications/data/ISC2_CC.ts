// src/certifications/data/isc2-cc.ts
// ✅ Versione data-only (nessun JSX/router).
// 🖼️ Assicurati che l’immagine esista in /public/images/certifications/isc2-icon.png

const ISC2CC = {
  slug: "isc2-cc",
  imageUrl: "/images/certifications/isc2-icon.png",
  officialUrl: "https://www.isc2.org/certifications/certified-in-cybersecurity",

  title: {
    it: "ISC2 Certified in Cybersecurity (CC)",
    en: "ISC2 Certified in Cybersecurity (CC)",
    fr: "ISC2 Certified in Cybersecurity (CC)",
    es: "ISC2 Certified in Cybersecurity (CC)",
  },

  level: {
    it: "Principiante",
    en: "Beginner",
    fr: "Débutant",
    es: "Principiante",
  },

  description: {
    it: "Certificazione base di sicurezza informatica rivolta a chi vuole iniziare una carriera nella cybersecurity.",
    en: "Entry-level cybersecurity certification for those starting a career in the field.",
    fr: "Certification de cybersécurité de niveau débutant pour ceux qui commencent dans le domaine.",
    es: "Certificación de ciberseguridad de nivel inicial para quienes comienzan en el campo.",
  },

  topics: [
    { it: "Concetti di sicurezza", en: "Security Concepts", fr: "Concepts de sécurité", es: "Conceptos de seguridad" },
    { it: "Gestione dei rischi", en: "Risk Management", fr: "Gestion des risques", es: "Gestión de riesgos" },
    { it: "Protezione dei dati", en: "Data Protection", fr: "Protection des données", es: "Protección de datos" },
    { it: "Strumenti di difesa", en: "Defense Tools", fr: "Outils de défense", es: "Herramientas de defensa" },
  ],

  extraContent: {
    // 🔗 Solo pagine ufficiali d’esame
    examReference: {
      it: [
        { text: "ISC2 Certified in Cybersecurity (CC) — Pagina ufficiale d’esame", url: "https://www.isc2.org/certifications/certified-in-cybersecurity" },
      ],
      en: [
        { text: "ISC2 Certified in Cybersecurity (CC) — Official exam page", url: "https://www.isc2.org/certifications/certified-in-cybersecurity" },
      ],
      fr: [
        { text: "ISC2 Certified in Cybersecurity (CC) — Page officielle de l’examen", url: "https://www.isc2.org/certifications/certified-in-cybersecurity" },
      ],
      es: [
        { text: "ISC2 Certified in Cybersecurity (CC) — Página oficial del examen", url: "https://www.isc2.org/certifications/certified-in-cybersecurity" },
      ],
    },

    learn: {
      it: [
        "Competenze fondamentali in cybersecurity per chi inizia nel settore.",
        "Concetti di sicurezza, gestione dei rischi e protezione dei dati.",
        "Tecniche difensive e strumenti di sicurezza informatica.",
      ],
      en: [
        "Fundamental cybersecurity skills for beginners.",
        "Security concepts, risk management, and data protection.",
        "Defensive techniques and security tools.",
      ],
      fr: [
        "Compétences fondamentales en cybersécurité pour les débutants.",
        "Concepts de sécurité, gestion des risques et protection des données.",
        "Techniques de défense et outils de sécurité.",
      ],
      es: [
        "Habilidades fundamentales de ciberseguridad para principiantes.",
        "Conceptos de seguridad, gestión de riesgos y protección de datos.",
        "Técnicas defensivas y herramientas de seguridad.",
      ],
    },

    whyChoose: {
      it: [
        "Certificazione ufficiale ISC2 per iniziare nel settore della cybersecurity.",
        "Perfetta per studenti, neolaureati o chi vuole cambiare carriera.",
        "Riconosciuta a livello internazionale nel mondo della sicurezza.",
      ],
      en: [
        "Official ISC2 certification for starting in cybersecurity.",
        "Perfect for students, recent graduates, or career changers.",
        "Internationally recognized in the security field.",
      ],
      fr: [
        "Certification officielle ISC2 pour débuter en cybersécurité.",
        "Parfaite pour les étudiants, jeunes diplômés ou en reconversion.",
        "Reconnaissance internationale dans le domaine de la sécurité.",
      ],
      es: [
        "Certificación oficial de ISC2 para comenzar en ciberseguridad.",
        "Ideal para estudiantes, recién graduados o quienes cambian de carrera.",
        "Reconocida internacionalmente en el campo de la seguridad.",
      ],
    },

    faq: {
      it: [
        { q: "La certificazione CC è adatta ai principianti?", a: "Sì, è pensata proprio per chi inizia nel campo della sicurezza informatica." },
        { q: "Serve esperienza pregressa per iscriversi?", a: "No, non è richiesta esperienza. È accessibile a tutti." },
      ],
      en: [
        { q: "Is the CC certification suitable for beginners?", a: "Yes, it's designed for those starting in cybersecurity." },
        { q: "Do I need prior experience to enroll?", a: "No, prior experience is not required. It's open to everyone." },
      ],
      fr: [
        { q: "La certification CC convient-elle aux débutants ?", a: "Oui, elle est conçue pour ceux qui débutent en cybersécurité." },
        { q: "Faut-il une expérience préalable ?", a: "Non, aucune expérience n’est requise. Elle est ouverte à tous." },
      ],
      es: [
        { q: "¿La certificación CC es adecuada para principiantes?", a: "Sí, está diseñada para quienes inician en ciberseguridad." },
        { q: "¿Necesito experiencia previa?", a: "No, no se requiere experiencia. Está abierta a todos." },
      ],
    },
  },

  // Rotte quiz localizzate
  quizRoute: {
    it: "/it/quiz/isc2-cc",
    en: "/en/quiz/isc2-cc",
    fr: "/fr/quiz/isc2-cc",
    es: "/es/quiz/isc2-cc",
  },

  // Rotta “indietro”: lista certificazioni per lingua
  backRoute: {
    it: "/it/certificazioni",
    en: "/en/certifications",
    fr: "/fr/certifications",
    es: "/es/certificaciones",
  },
} as const;

export default ISC2CC;
