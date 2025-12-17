// src/certifications/data/security-plus.ts
// Modulo dati per "CompTIA Security+" (no React/JSX).

const SecurityPlus = {
  slug: "security-plus",
  imageUrl: "/images/certifications/securityplus-icon.png",

  // Pagina ufficiale CompTIA
  officialUrl: "https://www.comptia.org/certifications/security",

  title: {
    it: "CompTIA Security+",
    en: "CompTIA Security+",
    fr: "CompTIA Security+",
    es: "CompTIA Security+",
  },

  level: {
    it: "Intermedio",
    en: "Intermediate",
    fr: "Intermédiaire",
    es: "Intermedio",
  },

  description: {
    it: "La certificazione Security+ di CompTIA è riconosciuta a livello globale e attesta competenze fondamentali in sicurezza informatica.",
    en: "The CompTIA Security+ certification is globally recognized and validates fundamental cybersecurity skills.",
    fr: "La certification CompTIA Security+ est reconnue mondialement et valide les compétences fondamentales en cybersécurité.",
    es: "La certificación CompTIA Security+ está reconocida mundialmente y valida habilidades fundamentales en ciberseguridad.",
  },

  topics: [
    { it: "Principi di sicurezza delle reti", en: "Network security principles", fr: "Principes de sécurité réseau", es: "Principios de seguridad de redes" },
    { it: "Gestione di minacce e vulnerabilità", en: "Threat and vulnerability management", fr: "Gestion des menaces et vulnérabilités", es: "Gestión de amenazas y vulnerabilidades" },
    { it: "Criptografia e protezione dei dati", en: "Cryptography and data protection", fr: "Cryptographie et protection des données", es: "Criptografía y protección de datos" },
    { it: "Controlli di accesso e autenticazione", en: "Access control and authentication", fr: "Contrôle d'accès et authentification", es: "Control de acceso y autenticación" },
    { it: "Risposta agli incidenti e risk management", en: "Incident response and risk management", fr: "Réponse aux incidents et gestion des risques", es: "Respuesta a incidentes y gestión de riesgos" },
  ],

  extraContent: {
    learn: {
      it: [
        "Capire i concetti chiave della sicurezza informatica.",
        "Identificare minacce, attacchi e vulnerabilità.",
        "Applicare soluzioni crittografiche e di protezione dei dati.",
        "Gestire accessi e autenticazioni in modo sicuro.",
        "Rispondere efficacemente agli incidenti di sicurezza.",
      ],
      en: [
        "Understand key cybersecurity concepts.",
        "Identify threats, attacks, and vulnerabilities.",
        "Apply cryptographic and data security solutions.",
        "Manage secure access and authentication.",
        "Respond effectively to security incidents.",
      ],
      fr: [
        "Comprendre les concepts clés de la cybersécurité.",
        "Identifier menaces, attaques et vulnérabilités.",
        "Appliquer des solutions de cryptographie et de sécurité des données.",
        "Gérer l'accès et l'authentification de manière sécurisée.",
        "Réagir efficacement aux incidents de sécurité.",
      ],
      es: [
        "Comprender los conceptos clave de ciberseguridad.",
        "Identificar amenazas, ataques y vulnerabilidades.",
        "Aplicar soluciones criptográficas y de seguridad de datos.",
        "Gestionar accesos y autenticación de forma segura.",
        "Responder eficazmente a incidentes de seguridad.",
      ],
    },

    whyChoose: {
      it: [
        "Certificazione riconosciuta in ambito militare, pubblico e aziendale.",
        "Ottimo punto di ingresso per una carriera in cybersecurity.",
        "Base solida per ruoli come analista SOC o tecnico sicurezza.",
      ],
      en: [
        "Recognized across military, public, and enterprise sectors.",
        "Great entry point for a cybersecurity career.",
        "Solid foundation for roles like SOC analyst or security technician.",
      ],
      fr: [
        "Reconnue dans les secteurs militaire, public et entreprise.",
        "Excellent point d’entrée pour une carrière en cybersécurité.",
        "Base solide pour des rôles comme analyste SOC ou technicien sécurité.",
      ],
      es: [
        "Reconocida en sectores militar, público y empresarial.",
        "Excelente punto de partida para una carrera en ciberseguridad.",
        "Base sólida para roles como analista SOC o técnico de seguridad.",
      ],
    },

    // Esame ufficiale corrente
    examReference: {
      it: [
        { text: "SY0-701 • CompTIA Security+ (esame attuale)", url: "https://www.comptia.org/certifications/security" },
      ],
      en: [
        { text: "SY0-701 • CompTIA Security+ (current exam)", url: "https://www.comptia.org/certifications/security" },
      ],
      fr: [
        { text: "SY0-701 • CompTIA Security+ (examen actuel)", url: "https://www.comptia.org/certifications/security" },
      ],
      es: [
        { text: "SY0-701 • CompTIA Security+ (examen actual)", url: "https://www.comptia.org/certifications/security" },
      ],
    },

    faq: {
      it: [
        { q: "Serve esperienza in cybersecurity?", a: "Non è obbligatoria, ma una base tecnica generale è consigliata." },
        { q: "È riconosciuta a livello internazionale?", a: "Sì, è una delle certificazioni più richieste nel mondo IT." },
        { q: "Quanto dura la certificazione?", a: "3 anni. Si rinnova con CEU o nuove certificazioni." },
      ],
      en: [
        { q: "Is cybersecurity experience required?", a: "Not mandatory, but basic technical knowledge is recommended." },
        { q: "Is it internationally recognized?", a: "Yes, it's one of the most in-demand IT certifications." },
        { q: "How long is it valid?", a: "3 years. Renew via CEUs or newer certifications." },
      ],
      fr: [
        { q: "Une expérience en cybersécurité est-elle requise ?", a: "Pas obligatoire, mais une base technique est recommandée." },
        { q: "Est-elle reconnue à l’international ?", a: "Oui, c’est l’une des certifications IT les plus demandées." },
        { q: "Quelle est sa validité ?", a: "3 ans. Renouvelable via CEU ou nouvelles certifications." },
      ],
      es: [
        { q: "¿Se requiere experiencia en ciberseguridad?", a: "No es obligatoria, pero se recomienda base técnica." },
        { q: "¿Está reconocida internacionalmente?", a: "Sí, es de las certificaciones más demandadas en IT." },
        { q: "¿Cuál es su vigencia?", a: "3 años. Se renueva con CEUs o nuevas certificaciones." },
      ],
    },
  },

  // Rotte quiz localizzate
  quizRoute: {
    it: "/it/quiz/security-plus",
    en: "/quiz/security-plus",
    fr: "/fr/quiz/security-plus",
    es: "/es/quiz/security-plus",
  },

  // Rotta “indietro” localizzata (lista certificazioni o categoria)
  backRoute: {
    it: "/it/certificazioni",
    en: "/certifications",
    fr: "/fr/certifications",
    es: "/es/certificaciones",
  },
} as const;

export default SecurityPlus;
