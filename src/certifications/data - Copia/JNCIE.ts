// src/certifications/data/jncie.ts
// ✅ Modello data-only consumabile dal renderer server (no JSX/router).

const JNCIE = {
  slug: "jncie",
  imageUrl: "/images/certifications/jncie-icon.png",
  // Panoramica (uno dei percorsi ufficiali, lo switch ai singoli esami è sotto in extraContent)
  officialUrl:
    "https://www.juniper.net/us/en/training/certification/tracks/service-provider-routing-switching/jncie-sp.html",

  title: {
    it: "JNCIE - Juniper Networks Certified Internet Expert",
    en: "JNCIE - Juniper Networks Certified Internet Expert",
    fr: "JNCIE - Expert Internet Certifié Juniper Networks",
    es: "JNCIE - Experto Certificado en Internet de Juniper Networks",
  },

  level: {
    it: "Avanzato",
    en: "Advanced",
    fr: "Avancé",
    es: "Avanzado",
  },

  description: {
    it: "Certificazione esperta per le reti basate su tecnologia Juniper.",
    en: "Expert-level certification for Juniper-based networks.",
    fr: "Certification de niveau expert pour les réseaux basés sur Juniper.",
    es: "Certificación de nivel experto para redes basadas en Juniper.",
  },

  topics: [
    { it: "Routing avanzato", en: "Advanced Routing", fr: "Routage avancé", es: "Enrutamiento avanzado" },
    { it: "Dispositivi Juniper", en: "Juniper Devices", fr: "Appareils Juniper", es: "Dispositivos Juniper" },
    { it: "Sicurezza di rete", en: "Network Security", fr: "Sécurité réseau", es: "Seguridad de red" },
  ],

  extraContent: {
    // 🔗 SOLO pagine d’esame Juniper (lab)
    examReference: {
      it: [
        {
          text: "JNCIE-SP — Service Provider Routing & Switching (esame pratico)",
          url: "https://www.juniper.net/us/en/training/certification/tracks/service-provider-routing-switching/jncie-sp.html",
        },
        {
          text: "JNCIE-ENT — Enterprise Routing & Switching (esame pratico)",
          url: "https://www.juniper.net/us/en/training/certification/tracks/enterprise-routing-switching/jncie-ent.html",
        },
        {
          text: "JNCIE-SEC — Security (esame pratico)",
          url: "https://www.juniper.net/us/en/training/certification/tracks/security/jncie-sec.html",
        },
        {
          text: "JNCIE-DC — Data Center (esame pratico)",
          url: "https://www.juniper.net/us/en/training/certification/tracks/data-center/jncie-dc.html",
        },
      ],
      en: [
        {
          text: "JNCIE-SP — Service Provider Routing & Switching (lab exam)",
          url: "https://www.juniper.net/us/en/training/certification/tracks/service-provider-routing-switching/jncie-sp.html",
        },
        {
          text: "JNCIE-ENT — Enterprise Routing & Switching (lab exam)",
          url: "https://www.juniper.net/us/en/training/certification/tracks/enterprise-routing-switching/jncie-ent.html",
        },
        {
          text: "JNCIE-SEC — Security (lab exam)",
          url: "https://www.juniper.net/us/en/training/certification/tracks/security/jncie-sec.html",
        },
        {
          text: "JNCIE-DC — Data Center (lab exam)",
          url: "https://www.juniper.net/us/en/training/certification/tracks/data-center/jncie-dc.html",
        },
      ],
      fr: [
        {
          text: "JNCIE-SP — Service Provider Routage & Commutation (examen pratique)",
          url: "https://www.juniper.net/us/en/training/certification/tracks/service-provider-routing-switching/jncie-sp.html",
        },
        {
          text: "JNCIE-ENT — Enterprise Routage & Commutation (examen pratique)",
          url: "https://www.juniper.net/us/en/training/certification/tracks/enterprise-routing-switching/jncie-ent.html",
        },
        {
          text: "JNCIE-SEC — Sécurité (examen pratique)",
          url: "https://www.juniper.net/us/en/training/certification/tracks/security/jncie-sec.html",
        },
        {
          text: "JNCIE-DC — Data Center (examen pratique)",
          url: "https://www.juniper.net/us/en/training/certification/tracks/data-center/jncie-dc.html",
        },
      ],
      es: [
        {
          text: "JNCIE-SP — Proveedor de servicios Routing & Switching (examen práctico)",
          url: "https://www.juniper.net/us/en/training/certification/tracks/service-provider-routing-switching/jncie-sp.html",
        },
        {
          text: "JNCIE-ENT — Enterprise Routing & Switching (examen práctico)",
          url: "https://www.juniper.net/us/en/training/certification/tracks/enterprise-routing-switching/jncie-ent.html",
        },
        {
          text: "JNCIE-SEC — Seguridad (examen práctico)",
          url: "https://www.juniper.net/us/en/training/certification/tracks/security/jncie-sec.html",
        },
        {
          text: "JNCIE-DC — Data Center (examen práctico)",
          url: "https://www.juniper.net/us/en/training/certification/tracks/data-center/jncie-dc.html",
        },
      ],
    },

    learn: {
      it: [
        "Progettazione avanzata di reti con tecnologia Juniper.",
        "Configurazione e ottimizzazione di dispositivi Juniper.",
        "Uso avanzato di protocolli (OSPF, BGP, MPLS).",
        "Sicurezza di rete e gestione delle policy.",
        "Troubleshooting avanzato su reti complesse.",
      ],
      en: [
        "Advanced network design with Juniper technology.",
        "Configuration and optimization of Juniper devices.",
        "Advanced use of routing protocols (OSPF, BGP, MPLS).",
        "Network security and policy management.",
        "Advanced troubleshooting on complex networks.",
      ],
      fr: [
        "Conception réseau avancée avec la technologie Juniper.",
        "Configuration et optimisation des équipements Juniper.",
        "Utilisation avancée des protocoles (OSPF, BGP, MPLS).",
        "Sécurité réseau et gestion des politiques.",
        "Dépannage avancé sur des réseaux complexes.",
      ],
      es: [
        "Diseño de redes avanzado con tecnología Juniper.",
        "Configuración y optimización de dispositivos Juniper.",
        "Uso avanzado de protocolos (OSPF, BGP, MPLS).",
        "Seguridad de red y gestión de políticas.",
        "Resolución avanzada de problemas en redes complejas.",
      ],
    },

    whyChoose: {
      it: [
        "Massimo livello delle certificazioni Juniper Networks.",
        "Riconoscimento internazionale tra i professionisti di rete.",
        "Richiesta per ruoli senior (architect/consultant).",
        "Dimostra competenze pratiche in ambienti complessi.",
      ],
      en: [
        "Highest level of Juniper certifications.",
        "International recognition among network professionals.",
        "Valued for senior roles (architect/consultant).",
        "Demonstrates hands-on skills in complex environments.",
      ],
      fr: [
        "Plus haut niveau des certifications Juniper.",
        "Reconnaissance internationale chez les professionnels réseau.",
        "Très prisée pour les postes seniors (architecte/consultant).",
        "Démontre des compétences pratiques en environnements complexes.",
      ],
      es: [
        "Nivel más alto de certificación Juniper.",
        "Reconocimiento internacional entre profesionales de redes.",
        "Muy valorada en roles senior (arquitecto/consultor).",
        "Demuestra habilidades prácticas en entornos complejos.",
      ],
    },

    faq: {
      it: [
        {
          q: "Quanto è difficile la certificazione JNCIE?",
          a: "È tra le più avanzate nel networking e richiede esperienza reale con apparati Juniper.",
        },
        {
          q: "Serve seguire un corso ufficiale Juniper?",
          a: "Non obbligatorio, ma fortemente consigliato per l’esame pratico (lab).",
        },
      ],
      en: [
        {
          q: "How hard is the JNCIE certification?",
          a: "One of the most advanced networking certs; real Juniper experience is required.",
        },
        {
          q: "Do I need an official Juniper course?",
          a: "Not mandatory, but highly recommended for the hands-on lab exam.",
        },
      ],
      fr: [
        {
          q: "La certification JNCIE est-elle difficile ?",
          a: "Parmi les plus avancées ; une expérience réelle sur Juniper est nécessaire.",
        },
        {
          q: "Faut-il suivre une formation officielle Juniper ?",
          a: "Pas obligatoire, mais fortement recommandé pour l’examen pratique (lab).",
        },
      ],
      es: [
        {
          q: "¿Qué tan difícil es JNCIE?",
          a: "De las más avanzadas; se requiere experiencia real con equipos Juniper.",
        },
        {
          q: "¿Es necesario un curso oficial de Juniper?",
          a: "No es obligatorio, pero muy recomendado para el examen práctico (lab).",
        },
      ],
    },
  },

  // Rotte quiz localizzate
  quizRoute: {
    it: "/it/quiz/jncie",
    en: "/quiz/jncie",
    fr: "/fr/quiz/jncie",
    es: "/es/quiz/jncie",
  },

  // Rotta “indietro”: lista certificazioni per lingua
  backRoute: {
    it: "/it/certificazioni",
    en: "/certifications",
    fr: "/fr/certifications",
    es: "/es/certificaciones",
  },
} as const;

export default JNCIE;
