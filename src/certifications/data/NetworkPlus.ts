// src/certifications/data/network-plus.ts
// Modulo dati per "CompTIA Network+" (no React/JSX).

const NetworkPlus = {
  slug: "network-plus",
  imageUrl: "/images/certifications/networkplus.png",

  // Pagina ufficiale dell'esame
  officialUrl: "https://www.comptia.org/certifications/network",

  title: {
    it: "CompTIA Network+",
    en: "CompTIA Network+",
    fr: "CompTIA Network+",
    es: "CompTIA Network+",
  },

  level: {
    it: "Intermedio",
    en: "Intermediate",
    fr: "Intermédiaire",
    es: "Intermedio",
  },

  description: {
    it: "La certificazione CompTIA Network+ attesta competenze fondamentali per la gestione, configurazione e sicurezza delle reti aziendali.",
    en: "CompTIA Network+ validates essential skills for managing, configuring, and securing business networks.",
    fr: "CompTIA Network+ valide les compétences essentielles pour gérer, configurer et sécuriser les réseaux d’entreprise.",
    es: "CompTIA Network+ valida habilidades esenciales para gestionar, configurar y asegurar redes empresariales.",
  },

  topics: [
    { it: "Fondamenti di networking", en: "Networking fundamentals", fr: "Fondamentaux du réseau", es: "Fundamentos de redes" },
    { it: "Modelli OSI e TCP/IP", en: "OSI and TCP/IP models", fr: "Modèles OSI et TCP/IP", es: "Modelos OSI y TCP/IP" },
    { it: "Configurazione dispositivi di rete", en: "Network device configuration", fr: "Configuration des dispositifs réseau", es: "Configuración de dispositivos de red" },
    { it: "Tecnologie wireless e avanzate", en: "Wireless and advanced technologies", fr: "Technologies sans fil et avancées", es: "Tecnologías inalámbricas y avanzadas" },
    { it: "Sicurezza e troubleshooting", en: "Network security and troubleshooting", fr: "Sécurité réseau et dépannage", es: "Seguridad de red y resolución de problemas" },
  ],

  extraContent: {
    // ✅ Esame ufficiale (aggiornato N10-009)
    examReference: {
      it: [
        { text: "N10-009 • CompTIA Network+ (pagina ufficiale)", url: "https://www.comptia.org/certifications/network" },
      ],
      en: [
        { text: "N10-009 • CompTIA Network+ (official page)", url: "https://www.comptia.org/certifications/network" },
      ],
      fr: [
        { text: "N10-009 • CompTIA Network+ (page officielle)", url: "https://www.comptia.org/certifications/network" },
      ],
      es: [
        { text: "N10-009 • CompTIA Network+ (página oficial)", url: "https://www.comptia.org/certifications/network" },
      ],
    },

    learn: {
      it: [
        "Capire i concetti base del networking e dei protocolli.",
        "Configurare switch, router e servizi di rete comuni.",
        "Analizzare il traffico e risolvere problemi di rete.",
        "Applicare misure di sicurezza in reti aziendali.",
      ],
      en: [
        "Understand core networking concepts and protocols.",
        "Configure switches, routers, and common network services.",
        "Analyze traffic and troubleshoot network issues.",
        "Apply security measures in business networks.",
      ],
      fr: [
        "Comprendre les concepts et protocoles réseau de base.",
        "Configurer switches, routeurs et services réseau courants.",
        "Analyser le trafic et dépanner les réseaux.",
        "Appliquer des mesures de sécurité en entreprise.",
      ],
      es: [
        "Comprender conceptos y protocolos básicos de redes.",
        "Configurar switches, routers y servicios de red comunes.",
        "Analizar el tráfico y solucionar incidencias.",
        "Aplicar medidas de seguridad en redes empresariales.",
      ],
    },

    whyChoose: {
      it: [
        "Certificazione riconosciuta globalmente.",
        "Ottima per ruoli di tecnico di rete o supporto IT.",
        "Base solida per Security+ o Cisco CCNA.",
      ],
      en: [
        "Globally recognized certification.",
        "Great for network technician or IT support roles.",
        "Solid foundation for Security+ or Cisco CCNA.",
      ],
      fr: [
        "Certification reconnue mondialement.",
        "Idéale pour technicien réseau ou support IT.",
        "Base solide pour Security+ ou Cisco CCNA.",
      ],
      es: [
        "Certificación reconocida mundialmente.",
        "Ideal para técnico de redes o soporte IT.",
        "Base sólida para Security+ o Cisco CCNA.",
      ],
    },

    faq: {
      it: [
        { q: "È necessaria esperienza per l'esame?", a: "Una base di networking è consigliata, ma non obbligatoria." },
        { q: "La certificazione scade?", a: "Sì, dura 3 anni e si rinnova con CEU o nuove certificazioni." },
        { q: "Dettagli d’esame", a: "Versione V9 (N10-009); 90 minuti; ~90 domande (multiple choice e performance-based); punteggio minimo 720/900." },
      ],
      en: [
        { q: "Is experience required?", a: "Basic networking knowledge is recommended but not mandatory." },
        { q: "Does it expire?", a: "Yes, valid for 3 years; renew via CEUs or newer certs." },
        { q: "Exam details", a: "V9 (N10-009); 90 minutes; ~90 questions (multiple choice & performance-based); passing 720/900." },
      ],
      fr: [
        { q: "Une expérience est-elle requise ?", a: "Des notions de base en réseau sont recommandées mais pas obligatoires." },
        { q: "Expire-t-elle ?", a: "Oui, valide 3 ans; renouvellement via CEU ou nouvelles certifs." },
        { q: "Détails de l’examen", a: "V9 (N10-009); 90 minutes; ~90 questions (QCM & performance-based); réussite à 720/900." },
      ],
      es: [
        { q: "¿Se requiere experiencia?", a: "Se recomiendan nociones básicas de redes, pero no es obligatorio." },
        { q: "¿Caduca?", a: "Sí, válida por 3 años; renovación con CEUs o nuevas certificaciones." },
        { q: "Detalles del examen", a: "V9 (N10-009); 90 minutos; ~90 preguntas (opción múltiple y performance-based); aprobado 720/900." },
      ],
    },
  },

  // Rotte quiz localizzate
  quizRoute: {
    it: "/it/quiz/network-plus",
    en: "/en/quiz/network-plus",
    fr: "/fr/quiz/network-plus",
    es: "/es/quiz/network-plus",
  },

  // Rotta “indietro” (lista certificazioni) localizzata
  backRoute: {
    it: "/it/certificazioni",
    en: "/en/certifications",
    fr: "/fr/certifications",
    es: "/es/certificaciones",
  },
} as const;

export default NetworkPlus;
