// src/certifications/data/ccna.ts
// Data-only per CertificationPage (server). Nessun JSX/Router.

const CCNA = {
  slug: "ccna",
  imageUrl: "/images/certifications/ccna.png", // metti il logo in /public/images/certifications/ccna.png
  officialUrl:
    "https://www.cisco.com/site/us/en/learn/training-certifications/exams/ccna.html",

  title: {
    it: "CCNA - Cisco Certified Network Associate",
    en: "CCNA - Cisco Certified Network Associate",
    fr: "CCNA - Cisco Certified Network Associate",
    es: "CCNA - Cisco Certified Network Associate",
  },
  level: {
    it: "Intermedio",
    en: "Intermediate",
    fr: "Intermédiaire",
    es: "Intermedio",
  },
  description: {
    it: "La certificazione Cisco CCNA attesta le competenze fondamentali per configurare, gestire e proteggere reti aziendali.",
    en: "The Cisco CCNA certification validates essential skills to configure, manage, and secure business networks.",
    fr: "La certification Cisco CCNA valide les compétences essentielles pour configurer, gérer et sécuriser des réseaux d’entreprise.",
    es: "La certificación Cisco CCNA valida habilidades esenciales para configurar, gestionar y proteger redes empresariales.",
  },

  topics: [
    {
      it: "Fondamenti di networking",
      en: "Networking Fundamentals",
      fr: "Principes fondamentaux du réseau",
      es: "Fundamentos de redes",
    },
    {
      it: "Routing e switching",
      en: "Routing and Switching",
      fr: "Routage et commutation",
      es: "Enrutamiento y conmutación",
    },
    {
      it: "Sicurezza di base delle reti",
      en: "Basic Network Security",
      fr: "Sécurité réseau de base",
      es: "Seguridad básica de red",
    },
    {
      it: "Configurazione dei dispositivi di rete",
      en: "Network Device Configuration",
      fr: "Configuration des équipements réseau",
      es: "Configuración de dispositivos de red",
    },
    {
      it: "Protocolli di rete avanzati",
      en: "Advanced Network Protocols",
      fr: "Protocoles réseau avancés",
      es: "Protocolos de red avanzados",
    },
  ],

  extraContent: {
    learn: {
      it: [
        "Comprendere il funzionamento delle reti informatiche.",
        "Configurare router e switch Cisco.",
        "Gestire indirizzamento IP e subnetting.",
        "Applicare concetti di sicurezza di rete.",
        "Lavorare con protocolli come TCP/IP, OSPF, STP.",
      ],
      en: [
        "Understand how computer networks function.",
        "Configure Cisco routers and switches.",
        "Manage IP addressing and subnetting.",
        "Apply basic network security concepts.",
        "Work with protocols like TCP/IP, OSPF, STP.",
      ],
      fr: [
        "Comprendre le fonctionnement des réseaux informatiques.",
        "Configurer les routeurs et commutateurs Cisco.",
        "Gérer l’adressage IP et le subnetting.",
        "Appliquer les concepts de base en sécurité réseau.",
        "Travailler avec les protocoles TCP/IP, OSPF, STP.",
      ],
      es: [
        "Comprender cómo funcionan las redes informáticas.",
        "Configurar routers y switches Cisco.",
        "Gestionar direccionamiento IP y subnetting.",
        "Aplicar conceptos básicos de seguridad de red.",
        "Trabajar con protocolos como TCP/IP, OSPF, STP.",
      ],
    },
    examReference: {
      it: [
        {
          text: "Cisco 200-301 CCNA – Pagina ufficiale dell’esame",
          url: "https://www.cisco.com/site/us/en/learn/training-certifications/exams/ccna.html",
        },
      ],
      en: [
        {
          text: "Cisco 200-301 CCNA – Official exam page",
          url: "https://www.cisco.com/site/us/en/learn/training-certifications/exams/ccna.html",
        },
      ],
      fr: [
        {
          text: "Cisco 200-301 CCNA – Page officielle de l’examen",
          url: "https://www.cisco.com/site/us/en/learn/training-certifications/exams/ccna.html",
        },
      ],
      es: [
        {
          text: "Cisco 200-301 CCNA – Página oficial del examen",
          url: "https://www.cisco.com/site/us/en/learn/training-certifications/exams/ccna.html",
        },
      ],
    },
    whyChoose: {
      it: [
        "È una delle certificazioni di rete più riconosciute al mondo.",
        "Ideale per entrare nel mondo delle infrastrutture IT.",
        "Richiesta da aziende di ogni dimensione.",
        "Base solida per certificazioni avanzate Cisco.",
        "Valida per concorsi pubblici e selezioni private.",
      ],
      en: [
        "One of the most recognized networking certifications worldwide.",
        "Great entry point into the IT infrastructure world.",
        "Required by companies of all sizes.",
        "Solid base for advanced Cisco certifications.",
        "Valid for public and private job applications.",
      ],
      fr: [
        "L’une des certifications réseau les plus reconnues.",
        "Idéale pour débuter dans les infrastructures IT.",
        "Demandée par des entreprises de toutes tailles.",
        "Base solide pour les certifications Cisco avancées.",
        "Valable pour concours publics et recrutements privés.",
      ],
      es: [
        "Una de las certificaciones de redes más reconocidas.",
        "Ideal para comenzar en infraestructuras IT.",
        "Requerida por empresas de todos los tamaños.",
        "Base sólida para certificaciones Cisco avanzadas.",
        "Válida para oposiciones y selecciones privadas.",
      ],
    },
    faq: {
      it: [
        {
          q: "Devo conoscere già Cisco?",
          a: "No, ma una conoscenza base delle reti è utile per affrontare l’esame.",
        },
        {
          q: "Quanto dura l’esame CCNA?",
          a: "Circa 120 minuti, con domande a scelta multipla e simulazioni pratiche.",
        },
        { q: "Dove si svolge l’esame?", a: "In remoto oppure presso un centro Pearson VUE." },
      ],
      en: [
        { q: "Do I need prior Cisco experience?", a: "No, but basic networking knowledge helps." },
        { q: "How long is the CCNA exam?", a: "About 120 minutes, multiple-choice and simulations." },
        { q: "Where is the exam held?", a: "Online or at a Pearson VUE center." },
      ],
      fr: [
        {
          q: "Dois-je connaître Cisco au préalable ?",
          a: "Non, mais des connaissances de base en réseau sont recommandées.",
        },
        {
          q: "Quelle est la durée de l’examen CCNA ?",
          a: "Environ 120 minutes, QCM et simulations.",
        },
        { q: "Où se déroule l’examen ?", a: "En ligne ou dans un centre Pearson VUE." },
      ],
      es: [
        { q: "¿Necesito conocer Cisco previamente?", a: "No, pero ayuda conocer lo básico de redes." },
        {
          q: "¿Cuánto dura el examen CCNA?",
          a: "Aproximadamente 120 minutos, tipo test y simulaciones.",
        },
        { q: "¿Dónde se realiza el examen?", a: "En línea o en un centro Pearson VUE." },
      ],
    },
  },

  quizRoute: {
    it: "/it/quiz/cisco-ccna",
    en: "/quiz/cisco-ccna",
    fr: "/fr/quiz/cisco-ccna",
    es: "/es/quiz/cisco-ccna",
  },
  backRoute: {
    it: "/it/certificazioni",
    en: "/certifications",
    fr: "/fr/certifications",
    es: "/es/certifications",
  },
} as const;

export default CCNA;
