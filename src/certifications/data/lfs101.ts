// src/certifications/data/lfs101.ts
// LFS101: Introduction to Linux (Linux Foundation). DB: certification id 73,
// category "Sistemi Operativi" id 12, 18 topics (id 481-498), is_active=1 as
// of migrations/2026-09-08-activate-sistemi-operativi-topics.up.sql — the
// cert page, topic nav, and topic pages are indexable for SEO even though
// there are no quiz questions yet. The quiz-start flow falls back to
// ComingSoonBox when the question pool is empty (see mixed/page.tsx and
// QuizTopicClient.tsx). Topics follow the official Linux Foundation LFS101
// syllabus (18 chapters, final exam excluded).

import type { CertificationData } from "../types";

const LFS101: CertificationData = {
  slug: "lfs101",
  publicationStatus: "published",
  imageUrl: "/images/certifications/lfs101.svg",
  officialUrl: "https://training.linuxfoundation.org/training/introduction-to-linux/",
  lifecycleStatus: "active",

  title: {
    it: "LFS101: Introduzione a Linux",
    en: "LFS101: Introduction to Linux",
    fr: "LFS101 : Introduction à Linux",
    es: "LFS101: Introducción a Linux",
  },
  level: { it: "Base", en: "Beginner", fr: "Débutant", es: "Principiante" },
  description: {
    it: "Corso introduttivo gratuito della Linux Foundation su concetti, comandi e amministrazione di base dei sistemi Linux. Copre installazione, interfaccia grafica e riga di comando, gestione di processi e file, editor di testo, reti, scripting Bash e principi di sicurezza locale — la base per chi vuole poi affrontare certificazioni Linux più avanzate come LFCS o CompTIA Linux+.",
    en: "Free introductory Linux Foundation course covering core concepts, commands, and basic administration of Linux systems. Covers installation, the graphical interface and command line, process and file management, text editors, networking, Bash scripting, and local security principles — the foundation for tackling more advanced Linux certifications like LFCS or CompTIA Linux+.",
    fr: "Cours d'introduction gratuit de la Linux Foundation sur les concepts de base, les commandes et l'administration élémentaire des systèmes Linux. Couvre l'installation, l'interface graphique et la ligne de commande, la gestion des processus et des fichiers, les éditeurs de texte, le réseau, le scripting Bash et les principes de sécurité locale — la base pour aborder ensuite des certifications Linux plus avancées comme LFCS ou CompTIA Linux+.",
    es: "Curso introductorio gratuito de la Linux Foundation sobre conceptos básicos, comandos y administración elemental de sistemas Linux. Cubre instalación, interfaz gráfica y línea de comandos, gestión de procesos y archivos, editores de texto, redes, scripting Bash y principios de seguridad local — la base para abordar después certificaciones Linux más avanzadas como LFCS o CompTIA Linux+.",
  },

  topics: [
    {
      title: {
        it: "La Linux Foundation e il percorso del corso",
        en: "The Linux Foundation and Course Path",
        fr: "La Linux Foundation et le parcours du cours",
        es: "La Linux Foundation y el itinerario del curso",
      },
      slug: {
        it: "linux-foundation-percorso-corso",
        en: "linux-foundation-course-path",
        fr: "linux-foundation-parcours-cours",
        es: "linux-foundation-itinerario-curso",
      },
    },
    {
      title: {
        it: "Filosofia e concetti di Linux",
        en: "Linux Philosophy and Concepts",
        fr: "Philosophie et concepts de Linux",
        es: "Filosofía y conceptos de Linux",
      },
      slug: {
        it: "filosofia-concetti-linux",
        en: "linux-philosophy-concepts",
        fr: "philosophie-concepts-linux",
        es: "filosofia-conceptos-linux",
      },
    },
    {
      title: {
        it: "Basi di Linux e avvio del sistema",
        en: "Linux Basics and System Startup",
        fr: "Bases de Linux et démarrage du système",
        es: "Fundamentos de Linux e inicio del sistema",
      },
      slug: {
        it: "basi-linux-avvio-sistema",
        en: "linux-basics-system-startup",
        fr: "bases-linux-demarrage-systeme",
        es: "fundamentos-linux-inicio-sistema",
      },
    },
    {
      title: {
        it: "Interfaccia grafica",
        en: "Graphical Interface",
        fr: "Interface graphique",
        es: "Interfaz gráfica",
      },
      slug: {
        it: "interfaccia-grafica",
        en: "graphical-interface",
        fr: "interface-graphique",
        es: "interfaz-grafica",
      },
    },
    {
      title: {
        it: "Configurazione del sistema dall'interfaccia grafica",
        en: "System Configuration from the Graphical Interface",
        fr: "Configuration du système depuis l'interface graphique",
        es: "Configuración del sistema desde la interfaz gráfica",
      },
      slug: {
        it: "configurazione-sistema-interfaccia-grafica",
        en: "system-configuration-graphical-interface",
        fr: "configuration-systeme-interface-graphique",
        es: "configuracion-sistema-interfaz-grafica",
      },
    },
    {
      title: {
        it: "Applicazioni comuni",
        en: "Common Applications",
        fr: "Applications courantes",
        es: "Aplicaciones comunes",
      },
      slug: {
        it: "applicazioni-comuni",
        en: "common-applications",
        fr: "applications-courantes",
        es: "aplicaciones-comunes",
      },
    },
    {
      title: {
        it: "Operazioni da riga di comando",
        en: "Command Line Operations",
        fr: "Opérations en ligne de commande",
        es: "Operaciones en línea de comandos",
      },
      slug: {
        it: "operazioni-riga-comando",
        en: "command-line-operations",
        fr: "operations-ligne-commande",
        es: "operaciones-linea-comandos",
      },
    },
    {
      title: {
        it: "Trovare la documentazione Linux",
        en: "Finding Linux Documentation",
        fr: "Trouver la documentation Linux",
        es: "Encontrar la documentación de Linux",
      },
      slug: {
        it: "documentazione-linux",
        en: "finding-linux-documentation",
        fr: "trouver-documentation-linux",
        es: "encontrar-documentacion-linux",
      },
    },
    {
      title: {
        it: "Processi",
        en: "Processes",
        fr: "Processus",
        es: "Procesos",
      },
      slug: {
        it: "processi",
        en: "processes",
        fr: "processus",
        es: "procesos",
      },
    },
    {
      title: {
        it: "Operazioni sui file",
        en: "File Operations",
        fr: "Opérations sur les fichiers",
        es: "Operaciones con archivos",
      },
      slug: {
        it: "operazioni-file",
        en: "file-operations",
        fr: "operations-fichiers",
        es: "operaciones-archivos",
      },
    },
    {
      title: {
        it: "Editor di testo",
        en: "Text Editors",
        fr: "Éditeurs de texte",
        es: "Editores de texto",
      },
      slug: {
        it: "editor-testo",
        en: "text-editors",
        fr: "editeurs-texte",
        es: "editores-texto",
      },
    },
    {
      title: {
        it: "Ambiente utente",
        en: "User Environment",
        fr: "Environnement utilisateur",
        es: "Entorno de usuario",
      },
      slug: {
        it: "ambiente-utente",
        en: "user-environment",
        fr: "environnement-utilisateur",
        es: "entorno-usuario",
      },
    },
    {
      title: {
        it: "Manipolazione del testo",
        en: "Manipulating Text",
        fr: "Manipulation de texte",
        es: "Manipulación de texto",
      },
      slug: {
        it: "manipolazione-testo",
        en: "manipulating-text",
        fr: "manipulation-texte",
        es: "manipulacion-texto",
      },
    },
    {
      title: {
        it: "Operazioni di rete",
        en: "Network Operations",
        fr: "Opérations réseau",
        es: "Operaciones de red",
      },
      slug: {
        it: "operazioni-rete",
        en: "network-operations",
        fr: "operations-reseau",
        es: "operaciones-red",
      },
    },
    {
      title: {
        it: "Scripting Bash I",
        en: "Bash Shell Scripting I",
        fr: "Scripting Bash I",
        es: "Scripting Bash I",
      },
      slug: {
        it: "bash-scripting-1",
        en: "bash-shell-scripting-1",
        fr: "bash-scripting-1",
        es: "bash-scripting-1",
      },
    },
    {
      title: {
        it: "Scripting Bash II",
        en: "Bash Shell Scripting II",
        fr: "Scripting Bash II",
        es: "Scripting Bash II",
      },
      slug: {
        it: "bash-scripting-2",
        en: "bash-shell-scripting-2",
        fr: "bash-scripting-2",
        es: "bash-scripting-2",
      },
    },
    {
      title: {
        it: "Stampa",
        en: "Printing",
        fr: "Impression",
        es: "Impresión",
      },
      slug: {
        it: "stampa",
        en: "printing",
        fr: "impression",
        es: "impresion",
      },
    },
    {
      title: {
        it: "Principi di sicurezza locale",
        en: "Local Security Principles",
        fr: "Principes de sécurité locale",
        es: "Principios de seguridad local",
      },
      slug: {
        it: "principi-sicurezza-locale",
        en: "local-security-principles",
        fr: "principes-securite-locale",
        es: "principios-seguridad-local",
      },
    },
  ],

  quizRoute: {
    it: "/it/quiz/lfs101",
    en: "/en/quiz/lfs101",
    fr: "/fr/quiz/lfs101",
    es: "/es/quiz/lfs101",
  },

  backRoute: {
    it: "/it/certificazioni",
    en: "/certifications",
    fr: "/fr/certifications",
    es: "/es/certificaciones",
  },
};

export default LFS101;
