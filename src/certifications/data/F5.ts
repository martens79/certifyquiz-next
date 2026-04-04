// src/certifications/data/f5.ts
// ✅ Versione data-only (nessun JSX/router). Coerente con gli altri file.
// 🖼️ Metti l'immagine in /public/images/certifications/f5-icon.png

const F5Certification = {
  slug: "f5",
  imageUrl: "/images/certifications/f5-icon.png",
  officialUrl: "https://www.f5.com/learn/certification",

  title: {
    it: "F5 Certified Technology Specialist (F5-CTS)",
    en: "F5 Certified Technology Specialist (F5-CTS)",
    fr: "Spécialiste certifié F5 (F5-CTS)",
    es: "Especialista certificado F5 (F5-CTS)",
  },

  level: {
    it: "Avanzato",
    en: "Advanced",
    fr: "Avancé",
    es: "Avanzado",
  },

  description: {
    it: "Competenze avanzate su bilanciamento del carico, sicurezza e ottimizzazione con F5 BIG-IP.",
    en: "Advanced skills in load balancing, security, and optimization with F5 BIG-IP.",
    fr: "Compétences avancées en équilibrage de charge, sécurité et optimisation avec F5 BIG-IP.",
    es: "Habilidades avanzadas en balanceo de carga, seguridad y optimización con F5 BIG-IP.",
  },

  topics: [
  {
    title: {
      it: "Fondamenti di F5 e BIG-IP",
      en: "F5 and BIG-IP Fundamentals",
      fr: "Fondamentaux de F5 et BIG-IP",
      es: "Fundamentos de F5 y BIG-IP",
    },
    slug: {
      it: "fondamenti-di-f5-e-big-ip",
      en: "f5-and-big-ip-fundamentals",
      fr: "fondamentaux-de-f5-et-big-ip",
      es: "fundamentos-de-f5-y-big-ip",
    },
  },
  {
    title: {
      it: "Installazione e configurazione di BIG-IP",
      en: "Installation and Configuration of BIG-IP",
      fr: "Installation et configuration de BIG-IP",
      es: "Instalación y configuración de BIG-IP",
    },
    slug: {
      it: "installazione-e-configurazione-di-big-ip",
      en: "installation-and-configuration-of-big-ip",
      fr: "installation-et-configuration-de-big-ip",
      es: "instalacion-y-configuracion-de-big-ip",
    },
  },
  {
    title: {
      it: "Gestione del traffico con Virtual Server",
      en: "Traffic Management with Virtual Server",
      fr: "Gestion du trafic avec Virtual Server",
      es: "Gestión del tráfico con Servidor Virtual",
    },
    slug: {
      it: "gestione-del-traffico-con-virtual-server",
      en: "traffic-management-with-virtual-server",
      fr: "gestion-du-trafic-avec-virtual-server",
      es: "gestion-del-trafico-con-servidor-virtual",
    },
  },
  {
    title: {
      it: "Monitoraggio dello stato dei server",
      en: "Server Status Monitoring",
      fr: "Surveillance de l'état du serveur",
      es: "Monitoreo del estado del servidor",
    },
    slug: {
      it: "monitoraggio-dello-stato-dei-server",
      en: "server-status-monitoring",
      fr: "surveillance-de-letat-du-serveur",
      es: "monitoreo-del-estado-del-servidor",
    },
  },
  {
    title: {
      it: "Gestione del traffico Layer 4 e Layer 7",
      en: "Layer 4 and Layer 7 Traffic Management",
      fr: "Gestion du trafic Layer 4 et Layer 7",
      es: "Gestión del tráfico de Capa 4 y Capa 7",
    },
    slug: {
      it: "gestione-del-traffico-layer-4-e-layer-7",
      en: "layer-4-and-layer-7-traffic-management",
      fr: "gestion-du-trafic-layer-4-et-layer-7",
      es: "gestion-del-trafico-de-capa-4-y-capa-7",
    },
  },
  {
    title: {
      it: "Creazione di iRules personalizzate",
      en: "Creation of Custom iRules",
      fr: "Création de iRules personnalisées",
      es: "Creación de iRules personalizadas",
    },
    slug: {
      it: "creazione-di-irules-personalizzate",
      en: "creation-of-custom-irules",
      fr: "creation-de-irules-personnalisees",
      es: "creacion-de-irules-personalizadas",
    },
  },
  {
    title: {
      it: "Sicurezza e SSL Offloading",
      en: "Security and SSL Offloading",
      fr: "Sécurité et déchargement SSL",
      es: "Seguridad y Descarga SSL",
    },
    slug: {
      it: "sicurezza-e-ssl-offloading",
      en: "security-and-ssl-offloading",
      fr: "securite-et-dechargement-ssl",
      es: "seguridad-y-descarga-ssl",
    },
  },
  {
    title: {
      it: "DNS e GSLB (Global Server Load Balancing)",
      en: "DNS and GSLB (Global Server Load Balancing)",
      fr: "DNS et GSLB (Global Server Load Balancing)",
      es: "DNS y GSLB (Balanceo de Carga de Servidores Globales)",
    },
    slug: {
      it: "dns-e-gslb-global-server-load-balancing",
      en: "dns-and-gslb-global-server-load-balancing",
      fr: "dns-et-gslb-global-server-load-balancing",
      es: "dns-y-gslb-balanceo-de-carga-de-servidores-globales",
    },
  },
  {
    title: {
      it: "Gestione utenti, ruoli e accessi",
      en: "User, Role and Access Management",
      fr: "Gestion des utilisateurs, des rôles et des accès",
      es: "Gestión de usuarios, roles y accesos",
    },
    slug: {
      it: "gestione-utenti-ruoli-e-accessi",
      en: "user-role-and-access-management",
      fr: "gestion-des-utilisateurs-des-roles-et-des-acces",
      es: "gestion-de-usuarios-roles-y-accesos",
    },
  },
  {
    title: {
      it: "Backup, aggiornamenti e troubleshooting",
      en: "Backup, Updates and Troubleshooting",
      fr: "Sauvegarde, mises à jour et dépannage",
      es: "Respaldo, actualizaciones y solución de problemas",
    },
    slug: {
      it: "backup-aggiornamenti-e-troubleshooting",
      en: "backup-updates-and-troubleshooting",
      fr: "sauvegarde-mises-a-jour-et-depannage",
      es: "respaldo-actualizaciones-y-solucion-de-problemas",
    },
  },
],

  extraContent: {
    // 🔗 SOLO pagine ufficiali degli ESAMI (niente guide/study non ufficiali)
    examReference: {
      it: [
        { text: "301a – BIG-IP LTM Specialist: Architect, Setup, and Deploy", url: "https://education.f5.com/certification/big-ip-ltm-specialist-architect-setup-and-deploy-301a" },
        { text: "301b – BIG-IP LTM Specialist: Maintain and Troubleshoot", url: "https://education.f5.com/certification/big-ip-ltm-specialist-maintain-and-troubleshoot-301b" },
        { text: "302 – BIG-IP DNS Specialist", url: "https://support.education.f5.com/hc/en-us/articles/4404003418523-BIG-IP-DNS-Specialist-302" },
        { text: "303 – BIG-IP ASM Specialist (Advanced WAF)", url: "https://support.education.f5.com/hc/en-us/articles/4404020083499-BIG-IP-ASM-Specialist-303" },
        { text: "304 – BIG-IP APM Specialist", url: "https://support.education.f5.com/hc/en-us/articles/4404024393115-BIG-IP-APM-Specialist-304" },
        { text: "401 – Security Solutions Expert (opzionale)", url: "https://education.f5.com/certification/security-solutions-expert-401" },
      ],
      en: [
        { text: "301a – BIG-IP LTM Specialist: Architect, Setup, and Deploy", url: "https://education.f5.com/certification/big-ip-ltm-specialist-architect-setup-and-deploy-301a" },
        { text: "301b – BIG-IP LTM Specialist: Maintain and Troubleshoot", url: "https://education.f5.com/certification/big-ip-ltm-specialist-maintain-and-troubleshoot-301b" },
        { text: "302 – BIG-IP DNS Specialist", url: "https://support.education.f5.com/hc/en-us/articles/4404003418523-BIG-IP-DNS-Specialist-302" },
        { text: "303 – BIG-IP ASM Specialist (Advanced WAF)", url: "https://support.education.f5.com/hc/en-us/articles/4404020083499-BIG-IP-ASM-Specialist-303" },
        { text: "304 – BIG-IP APM Specialist", url: "https://support.education.f5.com/hc/en-us/articles/4404024393115-BIG-IP-APM-Specialist-304" },
        { text: "401 – Security Solutions Expert (optional)", url: "https://education.f5.com/certification/security-solutions-expert-401" },
      ],
      fr: [
        { text: "301a – BIG-IP LTM : Architecture, mise en place et déploiement", url: "https://education.f5.com/certification/big-ip-ltm-specialist-architect-setup-and-deploy-301a" },
        { text: "301b – BIG-IP LTM : Maintenance et dépannage", url: "https://education.f5.com/certification/big-ip-ltm-specialist-maintain-and-troubleshoot-301b" },
        { text: "302 – Spécialiste BIG-IP DNS", url: "https://support.education.f5.com/hc/en-us/articles/4404003418523-BIG-IP-DNS-Specialist-302" },
        { text: "303 – Spécialiste BIG-IP ASM (WAF avancé)", url: "https://support.education.f5.com/hc/en-us/articles/4404020083499-BIG-IP-ASM-Specialist-303" },
        { text: "304 – Spécialiste BIG-IP APM", url: "https://support.education.f5.com/hc/en-us/articles/4404024393115-BIG-IP-APM-Specialist-304" },
        { text: "401 – Security Solutions Expert (optionnel)", url: "https://education.f5.com/certification/security-solutions-expert-401" },
      ],
      es: [
        { text: "301a – BIG-IP LTM: Arquitectura, configuración y despliegue", url: "https://education.f5.com/certification/big-ip-ltm-specialist-architect-setup-and-deploy-301a" },
        { text: "301b – BIG-IP LTM: Mantenimiento y troubleshooting", url: "https://education.f5.com/certification/big-ip-ltm-specialist-maintain-and-troubleshoot-301b" },
        { text: "302 – Especialista BIG-IP DNS", url: "https://support.education.f5.com/hc/en-us/articles/4404003418523-BIG-IP-DNS-Specialist-302" },
        { text: "303 – Especialista BIG-IP ASM (WAF avanzado)", url: "https://support.education.f5.com/hc/en-us/articles/4404020083499-BIG-IP-ASM-Specialist-303" },
        { text: "304 – Especialista BIG-IP APM", url: "https://support.education.f5.com/hc/en-us/articles/4404024393115-BIG-IP-APM-Specialist-304" },
        { text: "401 – Security Solutions Expert (opcional)", url: "https://education.f5.com/certification/security-solutions-expert-401" },
      ],
    },

    learn: {
      it: [
        "La certificazione F5-CTS ti consente di dimostrare competenze pratiche su BIG-IP, sicurezza applicativa e bilanciamento avanzato in ambienti ad alta disponibilità.",
      ],
      en: [
        "F5-CTS validates practical expertise on BIG-IP, application security, and advanced load balancing in high-availability environments.",
      ],
      fr: [
        "F5-CTS valide des compétences pratiques sur BIG-IP, la sécurité applicative et l’équilibrage avancé en environnements à haute disponibilité.",
      ],
      es: [
        "F5-CTS valida experiencia práctica en BIG-IP, seguridad de aplicaciones y balanceo avanzado en entornos de alta disponibilidad.",
      ],
    },

    whyChoose: {
      it: [
        "Certificazione molto richiesta in networking e security presso aziende enterprise che usano F5.",
      ],
      en: [
        "Highly valued in networking/security roles at enterprises using F5.",
      ],
      fr: [
        "Très recherchée pour les rôles réseau/sécurité dans les entreprises utilisant F5.",
      ],
      es: [
        "Muy valorada en roles de redes/seguridad en empresas que usan F5.",
      ],
    },

    faq: {
      it: [
        { q: "Chi può sostenere la certificazione F5-CTS?", a: "Professionisti del networking e della sicurezza con esperienza su BIG-IP." },
        { q: "Come si svolge l’esame?", a: "Gli esami sono erogati ufficialmente da F5 tramite Pearson VUE." },
      ],
      en: [
        { q: "Who can take F5-CTS?", a: "Networking/security professionals with BIG-IP experience." },
        { q: "How are exams delivered?", a: "Officially via F5 and Pearson VUE." },
      ],
      fr: [
        { q: "Qui peut passer F5-CTS ?", a: "Professionnels réseau/sécurité avec expérience BIG-IP." },
        { q: "Comment passer les examens ?", a: "Officiellement via F5 et Pearson VUE." },
      ],
      es: [
        { q: "¿Quién puede obtener F5-CTS?", a: "Profesionales de redes/seguridad con experiencia en BIG-IP." },
        { q: "¿Cómo se realiza el examen?", a: "Oficialmente a través de F5 y Pearson VUE." },
      ],
    },
  },

  // Rotte quiz localizzate
  quizRoute: {
    it: "/it/quiz/f5",
    en: "/en/quiz/f5",
    fr: "/fr/quiz/f5",
    es: "/es/quiz/f5",
  },

  // Rotta “indietro”: lista certificazioni per lingua
  backRoute: {
    it: "/it/certificazioni",
    en: "/certifications",
    fr: "/fr/certifications",
    es: "/es/certificaciones",
  },
} as const;

export default F5Certification;
