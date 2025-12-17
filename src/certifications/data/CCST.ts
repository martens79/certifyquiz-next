// src/certifications/data/ccst.ts
// Data-only per CertificationPage (server). Nessun JSX/Router.

const CCST = {
  slug: "ccst",
  imageUrl: "/images/certifications/ccst.png", // metti il logo in /public/images/certifications/ccst.png
  officialUrl:
    "https://www.cisco.com/site/us/en/learn/training-certifications/certifications/support-technician/index.html",

  title: {
    it: "Cisco Certified Support Technician (CCST)",
    en: "Cisco Certified Support Technician (CCST)",
    fr: "Technicien de support certifié Cisco (CCST)",
    es: "Técnico de soporte certificado por Cisco (CCST)",
  },
  level: {
    it: "Base",
    en: "Beginner",
    fr: "Débutant",
    es: "Básico",
  },
  description: {
    it: "La certificazione CCST di Cisco attesta competenze fondamentali nel supporto tecnico delle reti, con troubleshooting, sicurezza e gestione delle reti aziendali.",
    en: "Cisco CCST validates core skills in technical network support, covering troubleshooting, security, and enterprise network management.",
    fr: "La certification Cisco CCST valide des compétences clés en support réseau, incluant dépannage, sécurité et gestion des réseaux d’entreprise.",
    es: "La certificación Cisco CCST valida habilidades clave en soporte de redes, incluyendo troubleshooting, seguridad y gestión de redes empresariales.",
  },

  topics: [
    {
      it: "Fondamenti di networking e protocolli",
      en: "Networking fundamentals and protocols",
      fr: "Principes de base du réseau et protocoles",
      es: "Fundamentos de redes y protocolos",
    },
    {
      it: "Configurazione di dispositivi di rete",
      en: "Configuration of network devices",
      fr: "Configuration des dispositifs réseau",
      es: "Configuración de dispositivos de red",
    },
    {
      it: "Risoluzione dei problemi di connettività",
      en: "Connectivity troubleshooting",
      fr: "Dépannage de la connectivité",
      es: "Resolución de problemas de conectividad",
    },
    {
      it: "Sicurezza delle reti e protezione dei dati",
      en: "Network security and data protection",
      fr: "Sécurité réseau et protection des données",
      es: "Seguridad de redes y protección de datos",
    },
    {
      it: "Monitoraggio e gestione delle reti",
      en: "Network monitoring and management",
      fr: "Surveillance et gestion des réseaux",
      es: "Supervisión y gestión de redes",
    },
  ],

  extraContent: {
    learn: {
      it: [
        "Comprendere il funzionamento di base delle reti.",
        "Configurare dispositivi di rete come router e switch.",
        "Rilevare e risolvere problemi comuni di connettività.",
        "Applicare misure di sicurezza essenziali.",
        "Monitorare e gestire reti aziendali.",
      ],
      en: [
        "Understand basic network operations.",
        "Configure network devices such as routers and switches.",
        "Troubleshoot common connectivity issues.",
        "Apply essential security measures.",
        "Monitor and manage enterprise networks.",
      ],
      fr: [
        "Comprendre le fonctionnement de base des réseaux.",
        "Configurer des équipements réseau comme des routeurs et commutateurs.",
        "Détecter et résoudre les problèmes de connectivité.",
        "Appliquer des mesures de sécurité essentielles.",
        "Surveiller et gérer les réseaux d’entreprise.",
      ],
      es: [
        "Comprender cómo funcionan las redes básicas.",
        "Configurar dispositivos de red como routers y switches.",
        "Detectar y solucionar problemas de conectividad comunes.",
        "Aplicar medidas esenciales de seguridad.",
        "Supervisar y gestionar redes empresariales.",
      ],
    },
    examReference: {
      it: [
        {
          text: "100-140 • CCST IT Support — Pagina ufficiale d’esame",
          url: "https://www.cisco.com/site/us/en/learn/training-certifications/exams/ccst-it-support.html",
        },
        {
          text: "100-150 • CCST Networking — Pagina ufficiale d’esame",
          url: "https://www.cisco.com/site/us/en/learn/training-certifications/exams/ccst-networking.html",
        },
        {
          text: "100-160 • CCST Cybersecurity — Pagina ufficiale d’esame",
          url: "https://www.cisco.com/site/us/en/learn/training-certifications/exams/ccst-cybersecurity.html",
        },
      ],
      en: [
        {
          text: "100-140 • CCST IT Support — Official exam page",
          url: "https://www.cisco.com/site/us/en/learn/training-certifications/exams/ccst-it-support.html",
        },
        {
          text: "100-150 • CCST Networking — Official exam page",
          url: "https://www.cisco.com/site/us/en/learn/training-certifications/exams/ccst-networking.html",
        },
        {
          text: "100-160 • CCST Cybersecurity — Official exam page",
          url: "https://www.cisco.com/site/us/en/learn/training-certifications/exams/ccst-cybersecurity.html",
        },
      ],
      fr: [
        {
          text: "100-140 • CCST IT Support — Page officielle de l’examen",
          url: "https://www.cisco.com/site/us/en/learn/training-certifications/exams/ccst-it-support.html",
        },
        {
          text: "100-150 • CCST Networking — Page officielle de l’examen",
          url: "https://www.cisco.com/site/us/en/learn/training-certifications/exams/ccst-networking.html",
        },
        {
          text: "100-160 • CCST Cybersecurity — Page officielle de l’examen",
          url: "https://www.cisco.com/site/us/en/learn/training-certifications/exams/ccst-cybersecurity.html",
        },
      ],
      es: [
        {
          text: "100-140 • CCST IT Support — Página oficial del examen",
          url: "https://www.cisco.com/site/us/en/learn/training-certifications/exams/ccst-it-support.html",
        },
        {
          text: "100-150 • CCST Networking — Página oficial del examen",
          url: "https://www.cisco.com/site/us/en/learn/training-certifications/exams/ccst-networking.html",
        },
        {
          text: "100-160 • CCST Cybersecurity — Página oficial del examen",
          url: "https://www.cisco.com/site/us/en/learn/training-certifications/exams/ccst-cybersecurity.html",
        },
      ],
    },
    whyChoose: {
      it: [
        "Perfetta per chi inizia nel mondo IT e delle reti.",
        "Base solida per ruoli di supporto e help desk.",
        "Porta d'ingresso verso certificazioni Cisco avanzate.",
        "Richiesta in contesti scolastici e aziendali.",
        "Esame accessibile anche agli autodidatti.",
      ],
      en: [
        "Perfect for those starting in IT and networking.",
        "Solid foundation for support and help desk roles.",
        "Gateway to advanced Cisco certifications.",
        "In demand in academic and business settings.",
        "Accessible exam even for self-learners.",
      ],
      fr: [
        "Parfaite pour débuter en IT et réseaux.",
        "Base solide pour les rôles de support et help desk.",
        "Porte d’entrée vers les certifications Cisco avancées.",
        "Demandée dans les milieux scolaires et professionnels.",
        "Examen accessible même aux autodidactes.",
      ],
      es: [
        "Ideal para empezar en TI y redes.",
        "Base sólida para roles de soporte y help desk.",
        "Puerta de entrada a certificaciones Cisco avanzadas.",
        "Muy demandada en entornos académicos y empresariales.",
        "Examen accesible también para autodidactas.",
      ],
    },
    faq: {
      it: [
        { q: "Serve esperienza precedente?", a: "No, è pensata per chi parte da zero o ha solo conoscenze base." },
        { q: "L’esame è difficile?", a: "È accessibile, ma richiede studio: copre concetti pratici e teorici." },
        { q: "Quanto dura e dove si fa?", a: "Circa 90 minuti. Online o in un centro Pearson VUE." },
      ],
      en: [
        { q: "Is previous experience required?", a: "No, it's designed for beginners or those with basic knowledge." },
        { q: "Is the exam difficult?", a: "It's accessible, but requires study: both practical and theoretical topics." },
        { q: "How long and where?", a: "About 90 minutes. Online or at a Pearson VUE center." },
      ],
      fr: [
        { q: "Expérience préalable nécessaire ?", a: "Non, conçue pour débutants ou bases essentielles." },
        { q: "L’examen est-il difficile ?", a: "Accessible mais demande de l’étude : théorie et pratique." },
        { q: "Durée et lieu ?", a: "Environ 90 minutes. En ligne ou centre Pearson VUE." },
      ],
      es: [
        { q: "¿Experiencia previa?", a: "No, está pensada para principiantes o conocimientos básicos." },
        { q: "¿Es difícil?", a: "Es accesible, pero requiere estudio: teoría y práctica." },
        { q: "¿Duración y dónde?", a: "Aproximadamente 90 minutos. Online o centro Pearson VUE." },
      ],
    },
  },

  quizRoute: {
    it: "/it/quiz/cisco-ccst",
    en: "/quiz/cisco-ccst",
    fr: "/fr/quiz/cisco-ccst",
    es: "/es/quiz/cisco-ccst",
  },
  backRoute: {
    it: "/it/certificazioni",
    en: "/certifications",
    fr: "/fr/certifications",
    es: "/es/certifications",
  },
} as const;

export default CCST;
