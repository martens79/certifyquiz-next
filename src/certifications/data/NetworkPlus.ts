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
  {
    title: {
      it: "Concetti di rete",
      en: "Network Concepts",
      fr: "Concepts des réseaux",
      es: "Conceptos de redes",
    },
    slug: {
      it: "concetti-di-rete",
      en: "network-concepts",
      fr: "concepts-des-reseaux",
      es: "conceptos-de-redes",
    },
  },
  {
    title: {
      it: "Dispositivi e topologie di rete",
      en: "Network Devices and Topologies",
      fr: "Périphériques et topologies réseau",
      es: "Dispositivos y topologías de red",
    },
    slug: {
      it: "dispositivi-e-topologie-di-rete",
      en: "network-devices-and-topologies",
      fr: "peripheriques-et-topologies-reseau",
      es: "dispositivos-y-topologias-de-red",
    },
  },
  {
    title: {
      it: "Tecnologie e connessioni",
      en: "Technologies and Connections",
      fr: "Technologies et connexions",
      es: "Tecnologías y conexiones",
    },
    slug: {
      it: "tecnologie-e-connessioni",
      en: "technologies-and-connections",
      fr: "technologies-et-connexions",
      es: "tecnologias-y-conexiones",
    },
  },
  {
    title: {
      it: "Strumenti e diagnostica",
      en: "Network Tools and Diagnostics",
      fr: "Outils et diagnostic réseau",
      es: "Herramientas y diagnóstico de red",
    },
    slug: {
      it: "strumenti-e-diagnostica",
      en: "network-tools-and-diagnostics",
      fr: "outils-et-diagnostic-reseau",
      es: "herramientas-y-diagnostico-de-red",
    },
  },
  {
    title: {
      it: "Sicurezza delle reti",
      en: "Network Security",
      fr: "Sécurité des réseaux",
      es: "Seguridad de redes",
    },
    slug: {
      it: "sicurezza-delle-reti",
      en: "network-security",
      fr: "securite-des-reseaux",
      es: "seguridad-de-redes",
    },
  },
  {
    title: {
      it: "Gestione e monitoraggio",
      en: "Network Management and Monitoring",
      fr: "Gestion et supervision du réseau",
      es: "Gestión y monitoreo de redes",
    },
    slug: {
      it: "gestione-e-monitoraggio",
      en: "network-management-and-monitoring",
      fr: "gestion-et-supervision-du-reseau",
      es: "gestion-y-monitoreo-de-redes",
    },
  },
  {
    title: {
      it: "Risoluzione dei problemi di rete",
      en: "Network Troubleshooting",
      fr: "Dépannage réseau",
      es: "Solución de problemas de red",
    },
    slug: {
      it: "risoluzione-dei-problemi-di-rete",
      en: "network-troubleshooting",
      fr: "depannage-reseau",
      es: "solucion-de-problemas-de-red",
    },
  },
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
    en: "/certifications",
    fr: "/fr/certifications",
    es: "/es/certificaciones",
  },
} as const;

export default NetworkPlus;
