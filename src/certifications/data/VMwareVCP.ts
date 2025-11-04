// src/certifications/data/vmware-vcp.ts
// Modulo dati per "VMware VCP" (no React/JSX).

const VMwareVCP = {
  slug: "vmware-vcp",
  imageUrl: "/images/certifications/vmware-vcp.png",

  // Pagina ufficiale VMware VCP (overview tracce)
  officialUrl: "https://www.vmware.com/it/certification/vcp.html",

  title: {
    it: "VMware VCP",
    en: "VMware VCP",
    fr: "VMware VCP",
    es: "VMware VCP",
  },

  level: {
    it: "Avanzato",
    en: "Advanced",
    fr: "Avancé",
    es: "Avanzado",
  },

  description: {
    it: "La certificazione VMware VCP convalida competenze essenziali per l’installazione, gestione e manutenzione di infrastrutture virtuali professionali basate su vSphere.",
    en: "The VMware VCP certification validates essential skills for installing, managing, and maintaining professional virtual infrastructures based on vSphere.",
    fr: "La certification VMware VCP valide les compétences essentielles pour installer, gérer et maintenir des infrastructures virtuelles professionnelles basées sur vSphere.",
    es: "La certificación VMware VCP valida habilidades esenciales para instalar, gestionar y mantener infraestructuras virtuales profesionales basadas en vSphere.",
  },

  topics: [
    { it: "Installazione e configurazione di ESXi", en: "ESXi installation and configuration", fr: "Installation et configuration d'ESXi", es: "Instalación y configuración de ESXi" },
    { it: "Gestione delle VM con vSphere", en: "Managing VMs with vSphere", fr: "Gestion des VM avec vSphere", es: "Gestión de máquinas virtuales con vSphere" },
    { it: "Storage, networking e vCenter", en: "Storage, networking, and vCenter", fr: "Stockage, réseau et vCenter", es: "Almacenamiento, redes y vCenter" },
    { it: "Snapshot, backup e HA", en: "Snapshots, backups, and HA", fr: "Snapshots, sauvegardes et HA", es: "Snapshots, copias de seguridad y alta disponibilidad" },
    { it: "Sicurezza e automazione", en: "Security and automation", fr: "Sécurité et automatisation", es: "Seguridad y automatización" },
  ],

  extraContent: {
    learn: {
      it: [
        "Installare e configurare ambienti ESXi e vCenter.",
        "Gestire e monitorare macchine virtuali e risorse hardware.",
        "Implementare soluzioni di backup, snapshot e high availability.",
        "Automatizzare attività con strumenti VMware.",
        "Applicare policy di sicurezza nei datacenter virtuali.",
      ],
      en: [
        "Install and configure ESXi and vCenter environments.",
        "Manage and monitor VMs and hardware resources.",
        "Implement backup, snapshots, and high availability.",
        "Automate tasks using VMware tools.",
        "Apply security policies in virtual datacenters.",
      ],
      fr: [
        "Installer et configurer des environnements ESXi et vCenter.",
        "Gérer et surveiller des VM et des ressources matérielles.",
        "Mettre en œuvre des sauvegardes, snapshots et HA.",
        "Automatiser les tâches avec les outils VMware.",
        "Appliquer des politiques de sécurité dans les datacenters virtuels.",
      ],
      es: [
        "Instalar y configurar entornos ESXi y vCenter.",
        "Gestionar y monitorear VMs y recursos de hardware.",
        "Implementar copias de seguridad, snapshots y alta disponibilidad.",
        "Automatizar tareas con herramientas de VMware.",
        "Aplicar políticas de seguridad en centros de datos virtuales.",
      ],
    },

    whyChoose: {
      it: [
        "Riconosciuta come certificazione chiave per la virtualizzazione enterprise.",
        "Essenziale per ruoli come system engineer o virtualization specialist.",
        "Allineata alle più recenti tecnologie vSphere.",
      ],
      en: [
        "Recognized as a key certification for enterprise virtualization.",
        "Essential for roles like system engineer or virtualization specialist.",
        "Aligned with the latest vSphere technologies.",
      ],
      fr: [
        "Certification clé pour la virtualisation d'entreprise.",
        "Essentielle pour les postes d'ingénieur systèmes ou spécialiste VM.",
        "Alignée avec les dernières technologies vSphere.",
      ],
      es: [
        "Certificación clave en virtualización empresarial.",
        "Esencial para ingenieros de sistemas o especialistas en virtualización.",
        "Alineada con las últimas tecnologías de vSphere.",
      ],
    },

    // Tracce ufficiali VCP (overview)
    examReference: {
      it: [
        { text: "VCP-DCV • Data Center Virtualization (vSphere)", url: "https://www.vmware.com/it/certification/vcp.html" },
        { text: "VCP-NV • Network Virtualization (NSX)", url: "https://www.vmware.com/it/certification/vcp.html" },
        { text: "VCP-CMA • Cloud Management & Automation", url: "https://www.vmware.com/it/certification/vcp.html" },
        { text: "VCP-DTM • Desktop Management (Horizon)", url: "https://www.vmware.com/it/certification/vcp.html" },
        { text: "VCP-SEC • Security", url: "https://www.vmware.com/it/certification/vcp.html" },
      ],
      en: [
        { text: "VCP-DCV • Data Center Virtualization (vSphere)", url: "https://www.vmware.com/it/certification/vcp.html" },
        { text: "VCP-NV • Network Virtualization (NSX)", url: "https://www.vmware.com/it/certification/vcp.html" },
        { text: "VCP-CMA • Cloud Management & Automation", url: "https://www.vmware.com/it/certification/vcp.html" },
        { text: "VCP-DTM • Desktop Management (Horizon)", url: "https://www.vmware.com/it/certification/vcp.html" },
        { text: "VCP-SEC • Security", url: "https://www.vmware.com/it/certification/vcp.html" },
      ],
      fr: [
        { text: "VCP-DCV • Virtualisation de centre de données (vSphere)", url: "https://www.vmware.com/it/certification/vcp.html" },
        { text: "VCP-NV • Virtualisation réseau (NSX)", url: "https://www.vmware.com/it/certification/vcp.html" },
        { text: "VCP-CMA • Gestion & automatisation cloud", url: "https://www.vmware.com/it/certification/vcp.html" },
        { text: "VCP-DTM • Gestion des postes (Horizon)", url: "https://www.vmware.com/it/certification/vcp.html" },
        { text: "VCP-SEC • Sécurité", url: "https://www.vmware.com/it/certification/vcp.html" },
      ],
      es: [
        { text: "VCP-DCV • Virtualización de centros de datos (vSphere)", url: "https://www.vmware.com/it/certification/vcp.html" },
        { text: "VCP-NV • Virtualización de red (NSX)", url: "https://www.vmware.com/it/certification/vcp.html" },
        { text: "VCP-CMA • Gestión y Automatización Cloud", url: "https://www.vmware.com/it/certification/vcp.html" },
        { text: "VCP-DTM • Gestión de escritorios (Horizon)", url: "https://www.vmware.com/it/certification/vcp.html" },
        { text: "VCP-SEC • Seguridad", url: "https://www.vmware.com/it/certification/vcp.html" },
      ],
    },

    faq: {
      it: [
        { q: "Serve esperienza pratica con VMware?", a: "Sì, è consigliato aver lavorato 6–12 mesi su ambienti VMware." },
        { q: "È utile per carriere cloud/virtualizzazione?", a: "Assolutamente sì: è tra le più richieste in ambito enterprise." },
      ],
      en: [
        { q: "Is hands-on VMware experience required?", a: "Yes, 6–12 months of practical experience is recommended." },
        { q: "Is it useful for cloud/virtualization careers?", a: "Absolutely—one of the most in-demand enterprise certs." },
      ],
      fr: [
        { q: "Une expérience pratique est-elle requise ?", a: "Oui, 6 à 12 mois d’expérience sont recommandés." },
        { q: "Utile pour les carrières cloud/virtualisation ?", a: "Absolument — très demandée en entreprise." },
      ],
      es: [
        { q: "¿Se requiere experiencia práctica?", a: "Sí, se recomiendan 6–12 meses de experiencia con VMware." },
        { q: "¿Útil para carreras cloud/virtualización?", a: "Sin duda: muy demandada en el entorno empresarial." },
      ],
    },
  },

  // Rotte quiz localizzate
  quizRoute: {
    it: "/it/quiz/vmware",
    en: "/en/quiz/vmware",
    fr: "/fr/quiz/vmware",
    es: "/es/quiz/vmware",
  },

  // Rotta “indietro” localizzata (categoria/indice certificazioni)
  backRoute: {
    it: "/it/certificazioni",
    en: "/en/certifications",
    fr: "/fr/certifications",
    es: "/es/certificaciones",
  },

  // (opzionale) pagina prodotti/azienda
  companyProductsUrl: "/azienda/vmware",
} as const;

export default VMwareVCP;
