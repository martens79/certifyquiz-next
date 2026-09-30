// src/certifications/data/az-802.ts
// AZ-802: Administering Windows Server (Microsoft Certified: Windows Server
// Administrator Associate). DB: certification id 72, category "Sistemi
// Operativi" id 12, 12 topics (id 469-480), is_active=1 as of
// migrations/2026-09-08-activate-sistemi-operativi-topics.up.sql.
// Editorial baseline: Microsoft AZ-802 Study Guide, verified 2026-07-06.
// Keep the certification fail-closed/noindex until the question, topic and
// review package has passed multilingual QA and production smoke tests.

import type { CertificationData } from "../types";

const AZ802: CertificationData = {
  slug: "az-802",
  publicationStatus: "published",
  imageUrl: "/images/certifications/az-802.svg",
  officialUrl:
    "https://learn.microsoft.com/en-us/credentials/certifications/windows-server-administrator-associate/",
  lifecycleStatus: "active",

  title: {
    it: "AZ-802: Amministrazione di Windows Server",
    en: "AZ-802: Administering Windows Server",
    fr: "AZ-802 : Administration de Windows Server",
    es: "AZ-802: Administración de Windows Server",
  },
  level: { it: "Associate", en: "Associate", fr: "Associé", es: "Asociado" },
  description: {
    it: "Esame unico per Microsoft Certified: Windows Server Administrator Associate. Microsoft ha fissato al 30 settembre 2026 la data di ritiro di AZ-800 e AZ-801; dopo quella data AZ-802 è l'unico percorso d'esame per questa certificazione. Copre AD DS, gestione ibrida, virtualizzazione, rete, storage, sicurezza e troubleshooting.",
    en: "Single exam for Microsoft Certified: Windows Server Administrator Associate. Microsoft set September 30, 2026 as the retirement date for AZ-800 and AZ-801; after that date, AZ-802 is the only exam path to this certification. It covers AD DS, hybrid management, virtualization, networking, storage, security, and troubleshooting.",
    fr: "Examen unique de la certification Microsoft Certified: Windows Server Administrator Associate. Microsoft a fixé au 30 septembre 2026 la date de retrait d'AZ-800 et AZ-801 ; après cette date, AZ-802 est le seul parcours d'examen pour cette certification. Il couvre AD DS, l'administration hybride, la virtualisation, le réseau, le stockage, la sécurité et le dépannage.",
    es: "Examen único de Microsoft Certified: Windows Server Administrator Associate. Microsoft fijó el 30 de septiembre de 2026 como fecha de retirada de AZ-800 y AZ-801; después de esa fecha, AZ-802 es la única ruta de examen para esta certificación. Cubre AD DS, administración híbrida, virtualización, redes, almacenamiento, seguridad y solución de problemas.",
  },

  metaTitle: {
    it: "AZ-802 Windows Server: programma, domini e piano di studio",
    en: "AZ-802 Windows Server: skills, domains, and study plan",
    fr: "AZ-802 Windows Server : programme, domaines et plan d'étude",
    es: "AZ-802 Windows Server: temario, dominios y plan de estudio",
  },
  metaDescription: {
    it: "Guida ad AZ-802 con domini ufficiali, pesi, profilo del candidato, strategia di studio, PowerShell, Azure Arc, errori comuni e FAQ.",
    en: "AZ-802 guide with official domains, weights, candidate profile, study strategy, PowerShell, Azure Arc, common mistakes, and FAQs.",
    fr: "Guide AZ-802 avec domaines officiels, pondérations, profil du candidat, stratégie d'étude, PowerShell, Azure Arc, erreurs et FAQ.",
    es: "Guía AZ-802 con dominios oficiales, pesos, perfil del candidato, estrategia de estudio, PowerShell, Azure Arc, errores y preguntas frecuentes.",
  },

  examBlueprint: {
    examName: "Administering Windows Server",
    examCode: "AZ-802",
    examVersion: "Study guide updated July 6, 2026",
    provider: "Microsoft",
    officialSourceName: "Microsoft AZ-802 Study Guide",
    officialSourceUrl: "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-802",
    officialExamPageUrl: "https://learn.microsoft.com/en-us/credentials/certifications/exams/az-802/",
    lastVerifiedAt: "2026-07-06",
    note: "AZ-802 is the single-exam path. Microsoft set September 30, 2026 as the retirement date for AZ-800 and AZ-801.",
    domains: [
      { name: "Deploy and manage AD DS", percentageMin: 20, percentageMax: 25 },
      { name: "Manage Windows Server instances and workloads in a hybrid environment", percentageMin: 10, percentageMax: 15 },
      { name: "Manage virtual machines", percentageMin: 10, percentageMax: 15 },
      { name: "Implement and manage an on-premises and hybrid networking infrastructure", percentageMin: 10, percentageMax: 15 },
      { name: "Manage storage and file services", percentageMin: 15, percentageMax: 20 },
      { name: "Secure Windows Server infrastructure", percentageMin: 10, percentageMax: 15 },
      { name: "Monitor and troubleshoot Windows Server environments", percentageMin: 15, percentageMax: 20 },
    ],
  },

  topics: [
    {
      title: {
        it: "Domain controller e ruoli FSMO",
        en: "Domain Controllers and FSMO Roles",
        fr: "Contrôleurs de domaine et rôles FSMO",
        es: "Controladores de dominio y roles FSMO",
      },
      slug: {
        it: "domain-controller-fsmo",
        en: "domain-controllers-fsmo",
        fr: "controleurs-domaine-fsmo",
        es: "controladores-dominio-fsmo",
      },
    },
    {
      title: {
        it: "Ambienti multi-sito e multi-forest",
        en: "Multi-site and Multi-forest Environments",
        fr: "Environnements multi-sites et multi-forêts",
        es: "Entornos multisitio y multibosque",
      },
      slug: {
        it: "multi-sito-multi-forest",
        en: "multi-site-multi-forest",
        fr: "multi-sites-multi-forets",
        es: "multisitio-multibosque",
      },
    },
    {
      title: {
        it: "Group Policy e principal AD DS",
        en: "Group Policy and AD DS Principals",
        fr: "Stratégies de groupe et principaux AD DS",
        es: "Directivas de grupo y entidades de seguridad AD DS",
      },
      slug: {
        it: "group-policy",
        en: "group-policy",
        fr: "strategies-de-groupe",
        es: "directivas-de-grupo",
      },
    },
    {
      title: {
        it: "Gestione remota e Azure Arc",
        en: "Remote Management and Azure Arc",
        fr: "Gestion à distance et Azure Arc",
        es: "Administración remota y Azure Arc",
      },
      slug: {
        it: "gestione-remota-azure-arc",
        en: "remote-management-azure-arc",
        fr: "gestion-distance-azure-arc",
        es: "administracion-remota-azure-arc",
      },
    },
    {
      title: {
        it: "Hyper-V e macchine virtuali guest",
        en: "Hyper-V and Guest VMs",
        fr: "Hyper-V et machines virtuelles invitées",
        es: "Hyper-V y máquinas virtuales invitadas",
      },
      slug: {
        it: "hyper-v-vm-guest",
        en: "hyper-v-guest-vms",
        fr: "hyper-v-machines-virtuelles",
        es: "hyper-v-maquinas-virtuales",
      },
    },
    {
      title: {
        it: "VM Windows Server in Azure",
        en: "Windows Server VMs in Azure",
        fr: "Machines virtuelles Windows Server dans Azure",
        es: "VM de Windows Server en Azure",
      },
      slug: {
        it: "vm-windows-server-azure",
        en: "windows-server-vms-azure",
        fr: "machines-virtuelles-windows-server-azure",
        es: "vm-windows-server-azure",
      },
    },
    {
      title: {
        it: "DNS, DHCP e servizi IP ibridi",
        en: "DNS, DHCP, and Hybrid IP Services",
        fr: "DNS, DHCP et services IP hybrides",
        es: "DNS, DHCP y servicios IP híbridos",
      },
      slug: {
        it: "dns-dhcp",
        en: "dns-dhcp",
        fr: "dns-dhcp",
        es: "dns-dhcp",
      },
    },
    {
      title: {
        it: "Azure Files e servizi file",
        en: "Azure Files and File Services",
        fr: "Azure Files et services de fichiers",
        es: "Azure Files y servicios de archivos",
      },
      slug: {
        it: "azure-files-condivisioni",
        en: "azure-files-file-shares",
        fr: "azure-files-partages-fichiers",
        es: "azure-files-recursos-compartidos",
      },
    },
    {
      title: {
        it: "Storage di Windows Server",
        en: "Windows Server Storage",
        fr: "Stockage Windows Server",
        es: "Almacenamiento de Windows Server",
      },
      slug: {
        it: "storage-windows-server",
        en: "windows-server-storage",
        fr: "stockage-windows-server",
        es: "almacenamiento-windows-server",
      },
    },
    {
      title: {
        it: "Protezione di Windows Server e AD DS",
        en: "Securing Windows Server and AD DS",
        fr: "Sécurisation de Windows Server et AD DS",
        es: "Protección de Windows Server y AD DS",
      },
      slug: {
        it: "hardening-windows-server-ad-ds",
        en: "securing-windows-server-ad-ds",
        fr: "securisation-windows-server-ad-ds",
        es: "proteccion-windows-server-ad-ds",
      },
    },
    {
      title: {
        it: "Monitoraggio di Windows Server e workload Azure",
        en: "Monitoring Windows Server and Azure Workloads",
        fr: "Supervision de Windows Server et des charges Azure",
        es: "Supervisión de Windows Server y cargas de Azure",
      },
      slug: {
        it: "monitoraggio",
        en: "monitoring",
        fr: "supervision",
        es: "supervision",
      },
    },
    {
      title: {
        it: "Troubleshooting e ripristino",
        en: "Troubleshooting and Recovery",
        fr: "Dépannage et récupération",
        es: "Solución de problemas y recuperación",
      },
      slug: {
        it: "troubleshooting",
        en: "troubleshooting",
        fr: "depannage",
        es: "solucion-de-problemas",
      },
    },
  ],

  extraContent: {
    currentCertificationHeading: {
      it: "Che cos'è AZ-802",
      en: "What AZ-802 is",
      fr: "Qu'est-ce que l'AZ-802 ?",
      es: "Qué es AZ-802",
    },
    currentCertification: {
      it: ["AZ-802 è il nuovo esame unico per la certificazione Windows Server Administrator Associate. Valuta amministrazione on-premises e ibrida: non è un esame solo Azure né un semplice aggiornamento dei vecchi AZ-800/AZ-801.", "È rivolto ad amministratori che sanno già gestire Windows Server, AD DS, rete, storage, sicurezza e PowerShell. L'esperienza pratica con Azure Arc, Azure Files, macchine virtuali e monitoraggio ibrido è importante."],
      en: ["AZ-802 is the new single exam for the Windows Server Administrator Associate certification. It assesses both on-premises and hybrid administration: it is neither an Azure-only exam nor a simple renaming of AZ-800/AZ-801.", "It is aimed at administrators who already work with Windows Server, AD DS, networking, storage, security, and PowerShell. Hands-on experience with Azure Arc, Azure Files, virtual machines, and hybrid monitoring matters."],
      fr: ["AZ-802 est le nouvel examen unique de la certification Windows Server Administrator Associate. Il évalue l'administration locale et hybride : ce n'est ni un examen uniquement Azure ni un simple changement de nom d'AZ-800/AZ-801.", "Il s'adresse aux administrateurs qui maîtrisent déjà Windows Server, AD DS, le réseau, le stockage, la sécurité et PowerShell. La pratique d'Azure Arc, Azure Files, des machines virtuelles et de la supervision hybride est importante."],
      es: ["AZ-802 es el nuevo examen único de la certificación Windows Server Administrator Associate. Evalúa la administración local e híbrida: no es un examen exclusivo de Azure ni un simple cambio de nombre de AZ-800/AZ-801.", "Está dirigido a administradores que ya trabajan con Windows Server, AD DS, redes, almacenamiento, seguridad y PowerShell. Es importante la práctica con Azure Arc, Azure Files, máquinas virtuales y supervisión híbrida."],
    },
    learn: {
      it: ["Distribuire e gestire AD DS, siti, trust, ruoli FSMO e Group Policy", "Amministrare server ibridi con Azure Arc e strumenti remoti", "Gestire host Hyper-V e VM guest, e VM Windows Server in Azure", "Configurare DNS, inclusi la risoluzione dei nomi ibrida e DNSSEC, e DHCP, inclusa l'alta disponibilità", "Gestire Azure Files, file server, Storage Spaces e replica", "Applicare hardening, Defender, firewall, LAPS e criteri di sicurezza", "Monitorare prestazioni e risolvere problemi di identità, rete, storage e replica"],
      en: ["Deploy and manage AD DS, sites, trusts, FSMO roles, and Group Policy", "Administer hybrid servers with Azure Arc and remote tools", "Manage Hyper-V hosts and guest VMs, and Windows Server VMs in Azure", "Configure DNS, including hybrid name resolution and DNSSEC, and DHCP, including high availability", "Manage Azure Files, file servers, Storage Spaces, and replication", "Apply hardening, Defender, firewall, LAPS, and security policies", "Monitor performance and troubleshoot identity, network, storage, and replication"],
      fr: ["Déployer et gérer AD DS, les sites, les approbations, les rôles FSMO et les stratégies de groupe", "Administrer les serveurs hybrides avec Azure Arc et les outils distants", "Gérer les hôtes Hyper-V et les machines virtuelles invitées, ainsi que les machines virtuelles Windows Server dans Azure", "Configurer DNS, y compris la résolution de noms hybride et DNSSEC, et DHCP, y compris la haute disponibilité", "Gérer Azure Files, les serveurs de fichiers, Storage Spaces et la réplication", "Appliquer le durcissement, Defender, le pare-feu, LAPS et les stratégies de sécurité", "Superviser les performances et dépanner l'identité, le réseau, le stockage et la réplication"],
      es: ["Implementar y administrar AD DS, sitios, confianzas, roles FSMO y directivas de grupo", "Administrar servidores híbridos con Azure Arc y herramientas remotas", "Gestionar hosts Hyper-V y máquinas virtuales invitadas, y máquinas virtuales de Windows Server en Azure", "Configurar DNS, incluida la resolución de nombres híbrida y DNSSEC, y DHCP, incluida la alta disponibilidad", "Gestionar Azure Files, servidores de archivos, Storage Spaces y replicación", "Aplicar protección, Defender, firewall, LAPS y directivas de seguridad", "Supervisar el rendimiento y solucionar problemas de identidad, red, almacenamiento y replicación"],
    },
    guideSections: {
      it: [{ title: "Come prepararsi", items: ["Costruisci un lab con almeno due domain controller, una subnet separata e un host Hyper-V; documenta sempre prerequisiti e rollback.", "Alterna Server Manager e portale Azure con PowerShell: per ogni attività raccogli output, log e una verifica dal workload.", "Studia in proporzione ai pesi, ma non isolare i domini: DNS, identità, rete e sicurezza attraversano quasi ogni scenario."] }, { title: "Errori comuni", items: ["Memorizzare procedure senza distinguere stato configurato e stato effettivo.", "Confondere checkpoint, replica e backup.", "Disabilitare firewall o controlli di sicurezza invece di isolare la dipendenza guasta.", "Provare solo dal server e non dall'utente o workload interessato."] }],
      en: [{ title: "How to prepare", items: ["Build a lab with at least two domain controllers, a separate subnet, and a Hyper-V host; always document prerequisites and rollback.", "Alternate Server Manager and the Azure portal with PowerShell: collect output, logs, and a workload-side validation for each task.", "Study in proportion to the weights, but do not isolate domains: DNS, identity, networking, and security cut across most scenarios."] }, { title: "Common mistakes", items: ["Memorizing procedures without separating configured state from effective state.", "Confusing checkpoints, replication, and backups.", "Disabling firewalls or security controls instead of isolating the failed dependency.", "Testing only from the server rather than from the affected user or workload."] }],
      fr: [{ title: "Comment se préparer", items: ["Construisez un laboratoire avec au moins deux contrôleurs de domaine, un sous-réseau séparé et un hôte Hyper-V ; documentez toujours les prérequis et le retour arrière.", "Alternez le Gestionnaire de serveur et le portail Azure avec PowerShell : collectez les sorties, les journaux et une validation depuis la charge concernée.", "Étudiez selon les pondérations sans isoler les domaines : DNS, identité, réseau et sécurité traversent la plupart des scénarios."] }, { title: "Erreurs fréquentes", items: ["Mémoriser des procédures sans distinguer l'état configuré de l'état effectif.", "Confondre points de contrôle, réplication et sauvegardes.", "Désactiver le pare-feu ou un contrôle de sécurité au lieu d'isoler la dépendance défaillante.", "Tester uniquement depuis le serveur, pas depuis l'utilisateur ou la charge concernée."] }],
      es: [{ title: "Cómo prepararse", items: ["Cree un laboratorio con al menos dos controladores de dominio, una subred separada y un host Hyper-V; documente siempre los requisitos y la reversión.", "Alterne el Administrador del servidor y el portal de Azure con PowerShell: recopile salidas, registros y una validación desde la carga afectada.", "Estudie según los pesos sin aislar los dominios: DNS, identidad, red y seguridad atraviesan la mayoría de escenarios."] }, { title: "Errores comunes", items: ["Memorizar procedimientos sin distinguir el estado configurado del estado efectivo.", "Confundir puntos de control, replicación y copias de seguridad.", "Deshabilitar el firewall o controles de seguridad en vez de aislar la dependencia que falla.", "Probar solo desde el servidor y no desde el usuario o la carga afectada."] }],
    },
    examReference: {
      it: [{ text: "Guida ufficiale allo studio AZ-802", url: "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-802" }, { text: "Documentazione Windows Server", url: "https://learn.microsoft.com/en-us/windows-server/" }],
      en: [{ text: "Official AZ-802 study guide", url: "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-802" }, { text: "Windows Server documentation", url: "https://learn.microsoft.com/en-us/windows-server/" }],
      fr: [{ text: "Guide d'étude officiel AZ-802", url: "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-802" }, { text: "Documentation Windows Server", url: "https://learn.microsoft.com/en-us/windows-server/" }],
      es: [{ text: "Guía de estudio oficial de AZ-802", url: "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-802" }, { text: "Documentación de Windows Server", url: "https://learn.microsoft.com/en-us/windows-server/" }],
    },
    faq: {
      it: [{ q: "AZ-802 sostituisce AZ-800 e AZ-801?", a: "Sì. È il percorso a esame unico; Microsoft ha fissato al 30 settembre 2026 la data di ritiro di AZ-800 e AZ-801." }, { q: "Serve esperienza con Azure?", a: "Sì, soprattutto per Azure Arc, VM Azure, Azure Files, monitoraggio e gestione ibrida; resta essenziale la competenza Windows Server on-premises." }, { q: "Quanto conta PowerShell?", a: "È parte del lavoro quotidiano valutato: devi saper scegliere cmdlet, interpretare output e verificare lo stato effettivo, non solo ricordare sintassi." }],
      en: [{ q: "Does AZ-802 replace AZ-800 and AZ-801?", a: "Yes. It is the single-exam path; Microsoft set September 30, 2026 as the retirement date for AZ-800 and AZ-801." }, { q: "Do I need Azure experience?", a: "Yes, particularly for Azure Arc, Azure VMs, Azure Files, monitoring, and hybrid management; on-premises Windows Server skills remain essential." }, { q: "How important is PowerShell?", a: "It is part of the day-to-day work assessed: you should select cmdlets, interpret output, and validate effective state, not merely recall syntax." }],
      fr: [{ q: "AZ-802 remplace-t-il AZ-800 et AZ-801 ?", a: "Oui. C'est le parcours à examen unique ; Microsoft a fixé au 30 septembre 2026 la date de retrait d'AZ-800 et AZ-801." }, { q: "Faut-il de l'expérience Azure ?", a: "Oui, notamment pour Azure Arc, les machines virtuelles Azure, Azure Files, la supervision et l'administration hybride ; les compétences Windows Server locales restent essentielles." }, { q: "Quelle est l'importance de PowerShell ?", a: "Il fait partie du travail évalué : il faut choisir les applets de commande, interpréter les sorties et valider l'état effectif, pas seulement retenir la syntaxe." }],
      es: [{ q: "¿AZ-802 sustituye a AZ-800 y AZ-801?", a: "Sí. Es la ruta de examen único; Microsoft fijó el 30 de septiembre de 2026 como fecha de retirada de AZ-800 y AZ-801." }, { q: "¿Necesito experiencia con Azure?", a: "Sí, sobre todo con Azure Arc, máquinas virtuales de Azure, Azure Files, supervisión y administración híbrida; las competencias locales de Windows Server siguen siendo esenciales." }, { q: "¿Qué importancia tiene PowerShell?", a: "Forma parte del trabajo evaluado: debe elegir cmdlets, interpretar resultados y validar el estado efectivo, no solo recordar sintaxis." }],
    },
  },

  quizRoute: {
    it: "/it/quiz/az-802",
    en: "/en/quiz/az-802",
    fr: "/fr/quiz/az-802",
    es: "/es/quiz/az-802",
  },

  backRoute: {
    it: "/it/certificazioni",
    en: "/certifications",
    fr: "/fr/certifications",
    es: "/es/certificaciones",
  },
};

export default AZ802;
