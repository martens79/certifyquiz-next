// src/certifications/data/az-802.ts
// AZ-802: Administering Windows Server (Microsoft Certified: Windows Server
// Administrator Associate). Registry contract only — publicationStatus:"planned"
// keeps the page 404'd (CertificationDetailView) and out of the category
// listing (categorie/[cat]/page.tsx) until there is real quiz content.
// DB: certification id 72, category "Sistemi Operativi" id 12, 12 topics
// (id 469-480) inserted with is_active=0. See migrations/2026-09-07-add-os-category-az802.up.sql.
//
// TODO before flipping publicationStatus to "published":
// - verify officialUrl against the live Microsoft Learn credential page
// - verify exam duration / question count / availability per language
//   (Microsoft localizes ~8 weeks after English GA)

import type { CertificationData } from "../types";

const AZ802: CertificationData = {
  slug: "az-802",
  publicationStatus: "planned",
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
    it: "Esame unico per la certificazione Microsoft Certified: Windows Server Administrator Associate. Sostituisce AZ-800 e AZ-801, ritirati il 30 settembre 2026. Copre AD DS, gestione ibrida con Azure Arc, Hyper-V, networking, storage, sicurezza e troubleshooting.",
    en: "Single exam for the Microsoft Certified: Windows Server Administrator Associate certification. It replaces AZ-800 and AZ-801, retired on September 30, 2026. Covers AD DS, hybrid management with Azure Arc, Hyper-V, networking, storage, security and troubleshooting.",
    fr: "Examen unique pour la certification Microsoft Certified : Windows Server Administrator Associate. Il remplace AZ-800 et AZ-801, retirés le 30 septembre 2026. Couvre AD DS, la gestion hybride avec Azure Arc, Hyper-V, le réseau, le stockage, la sécurité et le dépannage.",
    es: "Examen único para la certificación Microsoft Certified: Windows Server Administrator Associate. Sustituye a AZ-800 y AZ-801, retirados el 30 de septiembre de 2026. Cubre AD DS, gestión híbrida con Azure Arc, Hyper-V, redes, almacenamiento, seguridad y resolución de problemas.",
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
        it: "Group Policy",
        en: "Group Policy",
        fr: "Stratégies de groupe",
        es: "Directivas de grupo",
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
        it: "DNS e DHCP",
        en: "DNS and DHCP",
        fr: "DNS et DHCP",
        es: "DNS y DHCP",
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
        it: "Azure Files e file share",
        en: "Azure Files and File Shares",
        fr: "Azure Files et partages de fichiers",
        es: "Azure Files y recursos compartidos",
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
        it: "Hardening di Windows Server e AD DS",
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
        it: "Monitoraggio",
        en: "Monitoring",
        fr: "Supervision",
        es: "Supervisión",
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
        it: "Troubleshooting",
        en: "Troubleshooting",
        fr: "Dépannage",
        es: "Solución de problemas",
      },
      slug: {
        it: "troubleshooting",
        en: "troubleshooting",
        fr: "depannage",
        es: "solucion-de-problemas",
      },
    },
  ],

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
