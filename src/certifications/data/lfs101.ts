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

  metaTitle: {
    it: "LFS101 Introduzione a Linux: programma, piano di studio, quiz",
    en: "LFS101 Introduction to Linux: syllabus, study plan, practice",
    fr: "LFS101 Introduction à Linux : programme, plan d'étude, quiz",
    es: "LFS101 Introducción a Linux: temario, plan de estudio, práctica",
  },
  metaDescription: {
    it: "Cos'è LFS101, a chi serve, i 18 capitoli del corso Linux Foundation, come studiare, gli errori comuni e le risposte alle domande più frequenti.",
    en: "What LFS101 is, who it suits, the 18 chapters of the Linux Foundation course, how to study, common mistakes and answers to frequent questions.",
    fr: "Ce qu'est LFS101, à qui il s'adresse, les 18 chapitres du cours Linux Foundation, comment étudier, les erreurs fréquentes et les réponses aux questions courantes.",
    es: "Qué es LFS101, a quién le sirve, los 18 capítulos del curso de la Linux Foundation, cómo estudiar, errores comunes y respuestas a las preguntas frecuentes.",
  },

  // Fonti verificate il 2026-09-20: pagina ufficiale del corso (Linux Foundation) e
  // sillabo ufficiale LFS101x. Non esiste un esame proctored né pesi ufficiali per
  // capitolo, quindi NON si usa examBlueprint (il suo box parla di "esame" e di domini).
  extraContent: {
    topicsHeading: {
      it: "I 18 capitoli del corso",
      en: "The 18 course chapters",
      fr: "Les 18 chapitres du cours",
      es: "Los 18 capítulos del curso",
    },
    examReferenceHeading: {
      it: "Fonti ufficiali",
      en: "Official sources",
      fr: "Sources officielles",
      es: "Fuentes oficiales",
    },
    currentCertificationHeading: {
      it: "Che cos'è LFS101 e che cosa non è",
      en: "What LFS101 is, and what it is not",
      fr: "Ce qu'est LFS101 et ce qu'il n'est pas",
      es: "Qué es LFS101 y qué no es",
    },
    currentCertification: {
      it: [
        "LFS101 (Introduction to Linux) è il corso introduttivo gratuito della Linux Foundation, erogato anche su edX come LFS101x. Si studia in autonomia su 18 capitoli; la Linux Foundation indica circa 60 ore di materiale e 90 giorni di accesso, e al completamento rilascia un badge digitale. Non è un esame con supervisione: non esistono un punteggio ufficiale né pesi per capitolo, per questo questa pagina segue il sillabo capitolo per capitolo.",
        "Si rivolge a chi usa già bene il computer ma ha poca o nessuna esperienza con Linux: futuri utenti, sviluppatori e amministratori di sistema. Non serve alcuna conoscenza pregressa di Linux. È un primo passo, non un sostituto di credenziali come LFCS o CompTIA Linux+, che entrano molto più a fondo nell'amministrazione.",
      ],
      en: [
        "LFS101 (Introduction to Linux) is the Linux Foundation's free introductory course, also delivered on edX as LFS101x. You study it at your own pace across 18 chapters; the Linux Foundation quotes about 60 hours of material and 90 days of access, and issues a digital badge on completion. It is not a proctored exam: there is no official score and no per-chapter weighting, which is why this page follows the syllabus chapter by chapter.",
        "It is aimed at people who are comfortable with computers but have little or no Linux experience: future users, developers and system administrators. No prior Linux knowledge is required. It is a first step, not a replacement for credentials such as LFCS or CompTIA Linux+, which go much deeper into administration.",
      ],
      fr: [
        "LFS101 (Introduction to Linux) est le cours d'introduction gratuit de la Linux Foundation, également proposé sur edX sous le nom LFS101x. Il s'étudie à son rythme sur 18 chapitres ; la Linux Foundation annonce environ 60 heures de contenu et 90 jours d'accès, et délivre un badge numérique à la fin. Ce n'est pas un examen surveillé : il n'existe ni note officielle ni pondération par chapitre, c'est pourquoi cette page suit le programme chapitre par chapitre.",
        "Il s'adresse aux personnes à l'aise avec l'informatique mais peu ou pas familières de Linux : futurs utilisateurs, développeurs et administrateurs système. Aucune connaissance préalable de Linux n'est requise. C'est une première étape, pas un substitut à des certifications comme LFCS ou CompTIA Linux+, qui vont beaucoup plus loin en administration.",
      ],
      es: [
        "LFS101 (Introduction to Linux) es el curso introductorio gratuito de la Linux Foundation, que también se ofrece en edX como LFS101x. Se estudia a su ritmo en 18 capítulos; la Linux Foundation indica unas 60 horas de material y 90 días de acceso, y emite una insignia digital al completarlo. No es un examen supervisado: no existe una puntuación oficial ni un peso por capítulo, por eso esta página sigue el temario capítulo a capítulo.",
        "Va dirigido a quienes se manejan bien con el ordenador pero tienen poca o ninguna experiencia con Linux: futuros usuarios, desarrolladores y administradores de sistemas. No se necesita ningún conocimiento previo de Linux. Es un primer paso, no un sustituto de credenciales como LFCS o CompTIA Linux+, que profundizan mucho más en la administración.",
      ],
    },
    learn: {
      it: [
        "Muoverti con sicurezza in un sistema Linux sia dal desktop grafico sia dalla riga di comando",
        "Capire come si avvia Linux, come è organizzato il filesystem e quali sono le principali famiglie di distribuzioni",
        "Gestire file, directory, collegamenti e permessi e cercare file con find e locate",
        "Controllare processi e job e pianificare attività con at e cron",
        "Filtrare e trasformare testo con grep, sed, awk, sort e strumenti collegati",
        "Configurare la rete e trasferire file con ssh, scp, wget e curl",
        "Scrivere e correggere semplici script Bash con variabili, test, cicli e case",
        "Applicare le basi della sicurezza locale: sudo, password, protezione di avvio e hardware",
      ],
      en: [
        "Move around a Linux system with confidence from both the graphical desktop and the command line",
        "Understand how Linux boots, how the filesystem is organised and what the main distribution families are",
        "Manage files, directories, links and permissions, and search for files with find and locate",
        "Control processes and jobs, and schedule work with at and cron",
        "Filter and transform text with grep, sed, awk, sort and related tools",
        "Configure networking and transfer files with ssh, scp, wget and curl",
        "Write and debug simple Bash scripts with variables, tests, loops and case statements",
        "Apply local security basics: sudo, passwords, boot and hardware protection",
      ],
      fr: [
        "Vous déplacer avec assurance dans un système Linux, depuis le bureau graphique comme depuis la ligne de commande",
        "Comprendre comment Linux démarre, comment le système de fichiers est organisé et quelles sont les grandes familles de distributions",
        "Gérer fichiers, répertoires, liens et permissions, et chercher des fichiers avec find et locate",
        "Contrôler processus et tâches, et planifier du travail avec at et cron",
        "Filtrer et transformer du texte avec grep, sed, awk, sort et les outils associés",
        "Configurer le réseau et transférer des fichiers avec ssh, scp, wget et curl",
        "Écrire et déboguer de petits scripts Bash avec variables, tests, boucles et instructions case",
        "Appliquer les bases de la sécurité locale : sudo, mots de passe, protection du démarrage et du matériel",
      ],
      es: [
        "Desenvolverse con seguridad en un sistema Linux, tanto desde el escritorio gráfico como desde la línea de comandos",
        "Entender cómo arranca Linux, cómo se organiza el sistema de archivos y cuáles son las grandes familias de distribuciones",
        "Gestionar archivos, directorios, enlaces y permisos, y buscar archivos con find y locate",
        "Controlar procesos y trabajos y programar tareas con at y cron",
        "Filtrar y transformar texto con grep, sed, awk, sort y herramientas afines",
        "Configurar la red y transferir archivos con ssh, scp, wget y curl",
        "Escribir y depurar scripts Bash sencillos con variables, pruebas, bucles y sentencias case",
        "Aplicar las bases de la seguridad local: sudo, contraseñas, protección del arranque y del hardware",
      ],
    },
    guideSections: {
      it: [
        {
          title: "Come prepararsi",
          items: [
            "Lavora in un terminale vero, non solo con la mente: basta una macchina virtuale o una chiavetta live con Ubuntu, Fedora o openSUSE. I comandi si fissano quando li digiti.",
            "Segui i capitoli in ordine fino al 6 (concetti, avvio, filesystem, desktop); dal capitolo 7 in poi puoi tornare sui comandi in cui sei più debole.",
            "Dopo ogni capitolo rispondi alle domande del quiz corrispondente e rileggi le spiegazioni di quelle sbagliate: dicono perché le altre opzioni non vanno bene.",
            "Tieni un tuo promemoria delle opzioni che usi davvero (ls -l, find -mtime, chmod 644, tar -czf): scriverle a mano è il modo più rapido per ricordarle.",
            "Prima di cercare sul web usa man COMANDO e COMANDO --help: il capitolo 8 esiste proprio per costruire questa abitudine.",
          ],
        },
        {
          title: "Piano di studio in tre blocchi",
          items: [
            "Capitoli 1-6: ambiente Linux, filosofia e distribuzioni, avvio del sistema, filesystem, desktop grafico e applicazioni.",
            "Capitoli 7-12: riga di comando, documentazione, processi, file, editor di testo, account, variabili d'ambiente e permessi.",
            "Capitoli 13-18: strumenti per il testo, rete, scripting Bash, stampa e sicurezza locale.",
            "Prevedi in tutto circa 60 ore, come indica la Linux Foundation: poche ore a settimana bastano, purché costanti.",
          ],
        },
        {
          title: "Errori comuni",
          items: [
            "Dimenticare che Linux distingue maiuscole e minuscole: File.txt e file.txt sono due file diversi.",
            "Confondere percorsi assoluti e relativi: cd /var e cd var portano in posti diversi.",
            "Confondere > (sovrascrive) e >> (aggiunge), o scrivere sudo echo x > /etc/file: la redirezione la esegue la tua shell senza privilegi, serve echo x | sudo tee /etc/file.",
            "Lanciare rm -rf o chmod -R come root senza ricontrollare il percorso.",
            "Dare per scontato che tutte le distribuzioni usino gli stessi strumenti: apt, dnf e zypper cambiano a seconda della famiglia.",
          ],
        },
      ],
      en: [
        {
          title: "How to prepare",
          items: [
            "Work in a real terminal, not just in your head: a virtual machine or a live USB with Ubuntu, Fedora or openSUSE is enough. Commands stick when you type them.",
            "Follow the chapters in order up to chapter 6 (concepts, boot, filesystem, desktop); from chapter 7 onwards you can jump back to the commands you find hardest.",
            "After each chapter, answer its practice questions and reread the explanations of the ones you missed: they say why the other options are wrong.",
            "Keep a personal cheat sheet of the options you really use (ls -l, find -mtime, chmod 644, tar -czf). Writing them down is the fastest memory aid.",
            "Before searching the web, use man COMMAND and COMMAND --help: chapter 8 exists precisely to build that habit.",
          ],
        },
        {
          title: "A three-block study plan",
          items: [
            "Chapters 1-6: the Linux landscape, philosophy and distributions, system startup, the filesystem, the graphical desktop and common applications.",
            "Chapters 7-12: the command line, documentation, processes, files, text editors, accounts, environment variables and permissions.",
            "Chapters 13-18: text tools, networking, Bash scripting, printing and local security.",
            "Budget about 60 hours in total, as the Linux Foundation suggests: a few hours a week are enough if you keep going.",
          ],
        },
        {
          title: "Common mistakes",
          items: [
            "Forgetting that Linux is case-sensitive: File.txt and file.txt are two different files.",
            "Mixing up absolute and relative paths: cd /var and cd var lead to different places.",
            "Confusing > (overwrite) with >> (append), or writing sudo echo x > /etc/file: your own unprivileged shell performs the redirection, so use echo x | sudo tee /etc/file.",
            "Running rm -rf or chmod -R as root without rechecking the path.",
            "Assuming every distribution uses the same tools: apt, dnf and zypper differ by family.",
          ],
        },
      ],
      fr: [
        {
          title: "Comment se préparer",
          items: [
            "Travaillez dans un vrai terminal, pas seulement dans votre tête : une machine virtuelle ou une clé live avec Ubuntu, Fedora ou openSUSE suffit. Les commandes se retiennent en les tapant.",
            "Suivez les chapitres dans l'ordre jusqu'au 6 (concepts, démarrage, système de fichiers, bureau) ; à partir du chapitre 7, vous pouvez revenir sur les commandes qui vous posent le plus de difficultés.",
            "Après chaque chapitre, répondez aux questions d'entraînement correspondantes et relisez les explications de celles que vous avez ratées : elles disent pourquoi les autres options sont fausses.",
            "Tenez votre propre aide-mémoire des options que vous utilisez vraiment (ls -l, find -mtime, chmod 644, tar -czf). Les écrire à la main est le moyen le plus rapide de les retenir.",
            "Avant de chercher sur le web, utilisez man COMMANDE et COMMANDE --help : le chapitre 8 existe précisément pour installer cette habitude.",
          ],
        },
        {
          title: "Un plan d'étude en trois blocs",
          items: [
            "Chapitres 1 à 6 : le paysage Linux, la philosophie et les distributions, le démarrage, le système de fichiers, le bureau graphique et les applications courantes.",
            "Chapitres 7 à 12 : la ligne de commande, la documentation, les processus, les fichiers, les éditeurs de texte, les comptes, les variables d'environnement et les permissions.",
            "Chapitres 13 à 18 : les outils de texte, le réseau, les scripts Bash, l'impression et la sécurité locale.",
            "Prévoyez environ 60 heures au total, comme l'indique la Linux Foundation : quelques heures par semaine suffisent si vous êtes régulier.",
          ],
        },
        {
          title: "Erreurs fréquentes",
          items: [
            "Oublier que Linux distingue majuscules et minuscules : File.txt et file.txt sont deux fichiers différents.",
            "Confondre chemins absolus et relatifs : cd /var et cd var mènent à des endroits différents.",
            "Confondre > (écrase) et >> (ajoute), ou écrire sudo echo x > /etc/fichier : la redirection est faite par votre shell sans privilèges, il faut echo x | sudo tee /etc/fichier.",
            "Lancer rm -rf ou chmod -R en root sans revérifier le chemin.",
            "Supposer que toutes les distributions utilisent les mêmes outils : apt, dnf et zypper diffèrent selon la famille.",
          ],
        },
      ],
      es: [
        {
          title: "Cómo prepararse",
          items: [
            "Trabaje en un terminal de verdad, no solo mentalmente: basta una máquina virtual o un USB live con Ubuntu, Fedora u openSUSE. Los comandos se fijan al escribirlos.",
            "Siga los capítulos en orden hasta el 6 (conceptos, arranque, sistema de archivos, escritorio); a partir del capítulo 7 puede volver a los comandos que más le cuesten.",
            "Después de cada capítulo, responda a las preguntas de práctica correspondientes y relea las explicaciones de las que falló: dicen por qué las demás opciones son incorrectas.",
            "Mantenga su propia chuleta con las opciones que de verdad usa (ls -l, find -mtime, chmod 644, tar -czf). Escribirlas a mano es la forma más rápida de recordarlas.",
            "Antes de buscar en la web, use man COMANDO y COMANDO --help: el capítulo 8 existe precisamente para crear ese hábito.",
          ],
        },
        {
          title: "Un plan de estudio en tres bloques",
          items: [
            "Capítulos 1 a 6: el panorama de Linux, filosofía y distribuciones, arranque del sistema, sistema de archivos, escritorio gráfico y aplicaciones habituales.",
            "Capítulos 7 a 12: la línea de comandos, la documentación, los procesos, los archivos, los editores de texto, las cuentas, las variables de entorno y los permisos.",
            "Capítulos 13 a 18: herramientas de texto, red, scripting en Bash, impresión y seguridad local.",
            "Cuente con unas 60 horas en total, como indica la Linux Foundation: bastan pocas horas a la semana si se mantiene la constancia.",
          ],
        },
        {
          title: "Errores comunes",
          items: [
            "Olvidar que Linux distingue entre mayúsculas y minúsculas: File.txt y file.txt son dos archivos distintos.",
            "Confundir rutas absolutas y relativas: cd /var y cd var llevan a sitios diferentes.",
            "Confundir > (sobrescribe) con >> (añade), o escribir sudo echo x > /etc/archivo: la redirección la hace su propio shell sin privilegios, hay que usar echo x | sudo tee /etc/archivo.",
            "Ejecutar rm -rf o chmod -R como root sin volver a comprobar la ruta.",
            "Dar por hecho que todas las distribuciones usan las mismas herramientas: apt, dnf y zypper cambian según la familia.",
          ],
        },
      ],
    },
    examReference: {
      it: [
        { text: "Pagina ufficiale del corso LFS101 — Linux Foundation", url: "https://training.linuxfoundation.org/training/introduction-to-linux/" },
        { text: "GNU Bash Reference Manual (capitoli 15 e 16)", url: "https://www.gnu.org/software/bash/manual/bash.html" },
      ],
      en: [
        { text: "Official LFS101 course page — Linux Foundation", url: "https://training.linuxfoundation.org/training/introduction-to-linux/" },
        { text: "GNU Bash Reference Manual (chapters 15 and 16)", url: "https://www.gnu.org/software/bash/manual/bash.html" },
      ],
      fr: [
        { text: "Page officielle du cours LFS101 — Linux Foundation", url: "https://training.linuxfoundation.org/training/introduction-to-linux/" },
        { text: "GNU Bash Reference Manual (chapitres 15 et 16)", url: "https://www.gnu.org/software/bash/manual/bash.html" },
      ],
      es: [
        { text: "Página oficial del curso LFS101 — Linux Foundation", url: "https://training.linuxfoundation.org/training/introduction-to-linux/" },
        { text: "GNU Bash Reference Manual (capítulos 15 y 16)", url: "https://www.gnu.org/software/bash/manual/bash.html" },
      ],
    },
    faq: {
      it: [
        { q: "LFS101 è un esame o una certificazione?", a: "È un corso gratuito. Al completamento la Linux Foundation rilascia un badge digitale; la versione su edX (LFS101x) offre anche un percorso a pagamento con certificato verificato ed esame finale. Per una credenziale Linux con supervisione servono altri percorsi, come LFCS o CompTIA Linux+." },
        { q: "Quanto tempo richiede LFS101?", a: "La Linux Foundation indica circa 60 ore di materiale con 90 giorni di accesso; il sillabo edX parla di 40-60 ore. Con poche ore a settimana si completa in alcune settimane." },
        { q: "Serve esperienza precedente con Linux?", a: "No. Serve dimestichezza con il computer e con le applicazioni di uso quotidiano; tutto il resto parte da zero." },
        { q: "Su quale distribuzione conviene esercitarsi?", a: "Su una qualsiasi distribuzione diffusa: il corso è neutrale e copre le famiglie Debian, Red Hat e SUSE. Ubuntu è la partenza più semplice, ricordando che gli strumenti di pacchettizzazione cambiano (apt, dnf, zypper)." },
        { q: "LFS101 basta per superare LFCS o CompTIA Linux+?", a: "No. Costruisce le fondamenta (comandi, file, processi, permessi, rete di base e scripting), ma quegli esami richiedono più amministrazione: storage, servizi, risoluzione dei problemi. Consideralo il primo passo." },
      ],
      en: [
        { q: "Is LFS101 an exam or a certification?", a: "It is a free course. The Linux Foundation issues a digital badge on completion; the edX version (LFS101x) also offers a paid verified-certificate track with a final exam. For a proctored Linux credential you need another path, such as LFCS or CompTIA Linux+." },
        { q: "How long does LFS101 take?", a: "The Linux Foundation quotes about 60 hours of material with 90 days of access; the edX syllabus says 40 to 60 hours. A few hours a week get you through in several weeks." },
        { q: "Do I need previous Linux experience?", a: "No. You need to be comfortable with computers and everyday applications; everything else starts from zero." },
        { q: "Which distribution should I practise on?", a: "Any mainstream one: the course is distribution-neutral and covers the Debian, Red Hat and SUSE families. Ubuntu is the easiest start, as long as you remember that packaging tools differ (apt, dnf, zypper)." },
        { q: "Is LFS101 enough to pass LFCS or CompTIA Linux+?", a: "No. It builds the foundation (commands, files, processes, permissions, basic networking and scripting), but those exams demand more administration: storage, services, troubleshooting. Treat it as the first step." },
      ],
      fr: [
        { q: "LFS101 est-il un examen ou une certification ?", a: "C'est un cours gratuit. La Linux Foundation délivre un badge numérique à la fin ; la version edX (LFS101x) propose aussi un parcours payant avec certificat vérifié et examen final. Pour une certification Linux avec surveillance, il faut un autre parcours, comme LFCS ou CompTIA Linux+." },
        { q: "Combien de temps demande LFS101 ?", a: "La Linux Foundation annonce environ 60 heures de contenu avec 90 jours d'accès ; le programme edX indique 40 à 60 heures. Quelques heures par semaine suffisent pour le terminer en quelques semaines." },
        { q: "Faut-il une expérience préalable de Linux ?", a: "Non. Il faut être à l'aise avec l'ordinateur et les applications courantes ; tout le reste part de zéro." },
        { q: "Sur quelle distribution faut-il s'entraîner ?", a: "Sur n'importe quelle distribution courante : le cours est neutre et couvre les familles Debian, Red Hat et SUSE. Ubuntu est le départ le plus simple, à condition de retenir que les outils de paquetage diffèrent (apt, dnf, zypper)." },
        { q: "LFS101 suffit-il pour réussir LFCS ou CompTIA Linux+ ?", a: "Non. Il pose les bases (commandes, fichiers, processus, permissions, réseau de base et scripts), mais ces examens exigent davantage d'administration : stockage, services, dépannage. Considérez-le comme la première étape." },
      ],
      es: [
        { q: "¿LFS101 es un examen o una certificación?", a: "Es un curso gratuito. La Linux Foundation emite una insignia digital al completarlo; la versión de edX (LFS101x) ofrece además un itinerario de pago con certificado verificado y examen final. Para una credencial Linux supervisada hace falta otro camino, como LFCS o CompTIA Linux+." },
        { q: "¿Cuánto tiempo requiere LFS101?", a: "La Linux Foundation indica unas 60 horas de material con 90 días de acceso; el temario de edX habla de 40 a 60 horas. Con pocas horas a la semana se completa en varias semanas." },
        { q: "¿Hace falta experiencia previa con Linux?", a: "No. Hace falta manejarse con el ordenador y las aplicaciones cotidianas; todo lo demás parte de cero." },
        { q: "¿En qué distribución conviene practicar?", a: "En cualquiera de las habituales: el curso es neutral y cubre las familias Debian, Red Hat y SUSE. Ubuntu es el comienzo más sencillo, recordando que las herramientas de paquetes cambian (apt, dnf, zypper)." },
        { q: "¿LFS101 basta para aprobar LFCS o CompTIA Linux+?", a: "No. Construye los cimientos (comandos, archivos, procesos, permisos, redes básicas y scripts), pero esos exámenes exigen más administración: almacenamiento, servicios, resolución de problemas. Considérelo el primer paso." },
      ],
    },
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
