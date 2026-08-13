"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, ArrowRight, Bot, Boxes, Check, CheckCircle2, ChevronRight,
  Clock3, Cloud, Code2, Database, FileText, Gauge, LockKeyhole, Network, Play,
  Search, Server, ShieldCheck, Sparkles, Table2, Terminal, Trophy,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Locale } from "@/lib/paths";
import { apiFetch, getToken } from "@/lib/auth";
import type { LabsCatalogEntry, LabsCatalogCertificationFilter } from "@/lib/server/labs";

type Difficulty = "beginner" | "intermediate" | "advanced";
type LocalizedOrPlain = Record<Locale, string> | string;
const resolveText = (value: LocalizedOrPlain, lang: Locale): string => (typeof value === "string" ? value : value[lang]);

type Lab = {
  slug: string;
  title: LocalizedOrPlain;
  description: LocalizedOrPlain;
  difficulty: Difficulty;
  duration: number;
  completed?: boolean;
  /** Presenti solo per i lab DB-backed (Step 4): mai inventati per i 14 legacy. */
  locked?: boolean;
  accessReason?: string;
  isDbBacked?: boolean;
  certificationSlug?: string;
};
type Category = {
  id: string;
  name: string;
  description: Record<Locale, string>;
  icon: LucideIcon;
  color: string;
  iconColor: string;
  labs: Lab[];
  comingSoon?: boolean;
  isNew?: boolean;
};

const localized = (it: string, en: string, fr: string, es: string): Record<Locale, string> => ({ it, en, fr, es });

// PUNTO DI MANUTENZIONE NOTO: questa e' una SECONDA tassonomia hardcoded nel
// frontend, indipendente da `categories` sopra e da `lab_certifications` nel DB.
// `categories` raggruppa i lab per skill (Excel, Word, Networking, ...);
// `DB_CERTIFICATION_CATEGORY` decide sotto quale di quelle skill mostrare i lab
// di UNA certificazione quando si fondono nella vista "All Labs" -- una mappatura
// editoriale che nessuna query puo' dedurre da sola (una certificazione non ha un
// concetto di "categoria skill"). Non e' una decisione di assegnare certificazioni
// ai lab legacy (esplicitamente non fatto in questo step): va SOLO in questa
// direzione, certificazione -> categoria, mai categoria -> certificazione.
// Ogni volta che si aggiungono lab DB per una nuova certificazione, questa mappa
// va aggiornata a mano, altrimenti i suoi lab finiscono nella categoria di
// fallback generica invece che in una skill sensata. Vedi anche
// docs/labs-architecture-audit.md.
const DB_CERTIFICATION_CATEGORY: Record<string, string> = {
  "cisco-ccst-networking": "networking",
};
const FALLBACK_CATEGORY_ID = "certification-labs";

const DB_DIFFICULTY_MAP: Record<"base" | "intermediate" | "final", Difficulty> = {
  base: "beginner",
  intermediate: "intermediate",
  final: "advanced",
};

// Risposta ridotta della stessa GET /labs?certification=all usata server-side
// (vedi src/lib/server/labs.ts): qui interessano SOLO i campi di accesso, mai
// title/description/ecc. -- quelli restano la versione risolta server-side, mai
// sovrascritti da questo fetch.
type LabAccessApiItem = { id: number; locked: boolean; accessReason: string };

const categories: Category[] = [
  { id: "excel", name: "Excel", icon: Table2, color: "from-emerald-50 to-teal-50", iconColor: "bg-emerald-100 text-emerald-700", description: localized("Formule, grafici e tabelle pivot", "Formulas, charts and pivot tables", "Formules, graphiques et tableaux croisés", "Fórmulas, gráficos y tablas dinámicas"), labs: [
    { slug: "spreadsheets", title: localized("Completa il report vendite", "Complete the sales report", "Compléter le rapport des ventes", "Completa el informe de ventas"), description: localized("Calcola totale e media e applica il formato corretto.", "Calculate total and average and apply the correct format.", "Calculez le total et la moyenne et appliquez le bon format.", "Calcula el total y el promedio y aplica el formato correcto."), difficulty: "beginner", duration: 5 },
  ]},
  { id: "word", name: "Microsoft Word", icon: FileText, color: "from-blue-50 to-indigo-50", iconColor: "bg-blue-100 text-blue-700", description: localized("Stili, impaginazione e documenti professionali", "Styles, layouts and professional documents", "Styles, mise en page et documents professionnels", "Estilos, diseño y documentos profesionales"), labs: [
    { slug: "word-document", title: localized("Crea un documento professionale", "Create a professional document", "Créer un document professionnel", "Crea un documento profesional"), description: localized("Usa stili, interruzioni e un indice automatico.", "Use styles, page breaks and an automatic table of contents.", "Utilisez les styles, les sauts de page et un sommaire automatique.", "Usa estilos, saltos de página y un índice automático."), difficulty: "beginner", duration: 6 },
  ], isNew: true },
  { id: "networking", name: "Networking", icon: Network, color: "from-sky-50 to-blue-50", iconColor: "bg-sky-100 text-sky-700", description: localized("Ping, subnetting, routing e VLAN", "Ping, subnetting, routing and VLANs", "Ping, sous-réseaux, routage et VLAN", "Ping, subnetting, routing y VLAN"), labs: [
    { slug: "networking", title: localized("Diagnostica una connessione", "Diagnose a connection", "Diagnostiquer une connexion", "Diagnostica una conexión"), description: localized("Isola e correggi un problema DNS dal terminale.", "Isolate and fix a DNS problem from the terminal.", "Isolez et corrigez un problème DNS depuis le terminal.", "Aísla y corrige un problema DNS desde la terminal."), difficulty: "intermediate", duration: 6 },
    { slug: "subnetting", title: localized("Progetta una subnet", "Design a subnet", "Concevoir un sous-réseau", "Diseña una subred"), description: localized("Scegli prefisso, gateway e verifica la connettività.", "Choose prefix and gateway, then verify connectivity.", "Choisissez le préfixe et la passerelle, puis vérifiez.", "Elige prefijo y gateway, y verifica la conectividad."), difficulty: "intermediate", duration: 7 },
  ]},
  { id: "cybersecurity", name: "Cybersecurity", icon: ShieldCheck, color: "from-rose-50 to-orange-50", iconColor: "bg-rose-100 text-rose-700", description: localized("Phishing, malware e incident response", "Phishing, malware and incident response", "Phishing, malware et réponse aux incidents", "Phishing, malware y respuesta a incidentes"), labs: [
    { slug: "phishing", title: localized("Analizza un'email sospetta", "Analyze a suspicious email", "Analyser un e-mail suspect", "Analiza un correo sospechoso"), description: localized("Trova gli indicatori di phishing e scegli la risposta sicura.", "Find phishing indicators and choose the safe response.", "Trouvez les indices de phishing et choisissez la réponse sûre.", "Encuentra señales de phishing y elige la respuesta segura."), difficulty: "beginner", duration: 5 },
    { slug: "password-security", title: localized("Metti in sicurezza un account", "Secure an account", "Sécuriser un compte", "Protege una cuenta"), description: localized("Crea credenziali robuste e configura MFA resistente al phishing.", "Create strong credentials and phishing-resistant MFA.", "Créez des identifiants robustes et un MFA anti-phishing.", "Crea credenciales robustas y MFA resistente al phishing."), difficulty: "beginner", duration: 5 },
  ]},
  { id: "cloud", name: "Cloud", icon: Cloud, color: "from-blue-50 to-indigo-50", iconColor: "bg-blue-100 text-blue-700", description: localized("AWS, Azure e Google Cloud", "AWS, Azure and Google Cloud", "AWS, Azure et Google Cloud", "AWS, Azure y Google Cloud"), labs: [
    { slug: "cloud-storage-security", title: localized("Proteggi un archivio cloud", "Secure cloud storage", "Sécuriser un stockage cloud", "Protege un almacenamiento cloud"), description: localized("Blocca l'accesso pubblico, limita i permessi e abilita la cifratura.", "Block public access, limit permissions and enable encryption.", "Bloquez l'accès public, limitez les permissions et activez le chiffrement.", "Bloquea el acceso público, limita permisos y activa el cifrado."), difficulty: "intermediate", duration: 6 },
  ]},
  { id: "linux", name: "Linux", icon: Terminal, color: "from-amber-50 to-yellow-50", iconColor: "bg-amber-100 text-amber-800", description: localized("Shell, permessi e processi", "Shell, permissions and processes", "Shell, permissions et processus", "Shell, permisos y procesos"), labs: [
    { slug: "linux-permissions", title: localized("Ripara i permessi Linux", "Fix Linux permissions", "Réparer les permissions Linux", "Repara permisos Linux"), description: localized("Interpreta rwx e applica il minimo privilegio.", "Interpret rwx and apply least privilege.", "Interprétez rwx et appliquez le moindre privilège.", "Interpreta rwx y aplica mínimo privilegio."), difficulty: "intermediate", duration: 6 },
  ]},
  { id: "docker", name: "Docker", icon: Boxes, color: "from-cyan-50 to-sky-50", iconColor: "bg-cyan-100 text-cyan-700", description: localized("Container, immagini e networking", "Containers, images and networking", "Conteneurs, images et réseau", "Contenedores, imágenes y redes"), labs: [
    { slug: "docker-lifecycle", title: localized("Avvia un container web", "Launch a web container", "Lancer un conteneur web", "Inicia un contenedor web"), description: localized("Scarica, avvia e ispeziona un servizio Nginx.", "Pull, run and inspect an Nginx service.", "Téléchargez, lancez et inspectez un service Nginx.", "Descarga, inicia e inspecciona un servicio Nginx."), difficulty: "beginner", duration: 6 },
  ]},
  { id: "sql", name: "SQL", icon: Database, color: "from-violet-50 to-purple-50", iconColor: "bg-violet-100 text-violet-700", description: localized("Query, join e database", "Queries, joins and databases", "Requêtes, jointures et bases de données", "Consultas, joins y bases de datos"), labs: [
    { slug: "sql-select", title: localized("Interroga il database vendite", "Query the sales database", "Interroger la base des ventes", "Consulta la base de ventas"), description: localized("Costruisci una SELECT filtrata e ordinata.", "Build a filtered and sorted SELECT query.", "Construisez une requête SELECT filtrée et triée.", "Construye una consulta SELECT filtrada y ordenada."), difficulty: "beginner", duration: 5 },
  ]},
  { id: "powershell", name: "PowerShell", icon: Code2, color: "from-indigo-50 to-blue-50", iconColor: "bg-indigo-100 text-indigo-700", description: localized("Cmdlet, pipeline e automazione", "Cmdlets, pipelines and automation", "Cmdlets, pipelines et automatisation", "Cmdlets, pipelines y automatización"), labs: [
    { slug: "powershell-pipeline", title: localized("Costruisci una pipeline", "Build a pipeline", "Construire un pipeline", "Construye una pipeline"), description: localized("Filtra processi ed esporta i risultati in CSV.", "Filter processes and export results to CSV.", "Filtrez les processus et exportez en CSV.", "Filtra procesos y exporta los resultados a CSV."), difficulty: "intermediate", duration: 7 },
  ]},
  { id: "ai", name: "AI", icon: Bot, color: "from-fuchsia-50 to-violet-50", iconColor: "bg-fuchsia-100 text-fuchsia-700", description: localized("Prompt, modelli e AI responsabile", "Prompts, models and responsible AI", "Prompts, modèles et IA responsable", "Prompts, modelos y IA responsable"), labs: [
    { slug: "ai-prompt-safety", title: localized("Progetta un prompt AI sicuro", "Design a safe AI prompt", "Concevoir un prompt IA sûr", "Diseña un prompt de IA seguro"), description: localized("Proteggi dati personali, verifica le risposte e riduci le allucinazioni.", "Protect personal data, verify answers and reduce hallucinations.", "Protégez les données personnelles, vérifiez les réponses et réduisez les hallucinations.", "Protege los datos personales, verifica respuestas y reduce alucinaciones."), difficulty: "beginner", duration: 6 },
  ], isNew: true },
  { id: "python", name: "Python", icon: Code2, color: "from-yellow-50 to-blue-50", iconColor: "bg-yellow-100 text-yellow-800", description: localized("Sintassi, dati e scripting", "Syntax, data and scripting", "Syntaxe, données et scripts", "Sintaxis, datos y scripting"), labs: [
    { slug: "python-data-cleanup", title: localized("Pulisci dati con Python", "Clean data with Python", "Nettoyer des données avec Python", "Limpia datos con Python"), description: localized("Correggi valori mancanti e prepara un riepilogo affidabile.", "Fix missing values and prepare a reliable summary.", "Corrigez les valeurs manquantes et préparez un résumé fiable.", "Corrige valores ausentes y prepara un resumen fiable."), difficulty: "beginner", duration: 7 },
  ]},
  { id: "windows-server", name: "Windows Server", icon: Server, color: "from-slate-50 to-blue-50", iconColor: "bg-slate-200 text-slate-700", description: localized("Active Directory, DNS e ruoli", "Active Directory, DNS and roles", "Active Directory, DNS et rôles", "Active Directory, DNS y roles"), labs: [
    { slug: "windows-server-users", title: localized("Gestisci utenti di dominio", "Manage domain users", "Gérer les utilisateurs du domaine", "Gestiona usuarios del dominio"), description: localized("Crea un utente, assegna il gruppo corretto e applica il minimo privilegio.", "Create a user, assign the correct group and apply least privilege.", "Créez un utilisateur, assignez le bon groupe et appliquez le moindre privilège.", "Crea un usuario, asigna el grupo correcto y aplica mínimo privilegio."), difficulty: "intermediate", duration: 7 },
  ]},
];

const copy = {
  it: { subtitle: "Impara facendo con simulazioni pratiche da 3 a 10 minuti.", available: "Disponibili ora", categories: "Categorie", completed: "Completati", choose: "Scegli la tua prossima sfida", chooseBody: "Allenati in ambienti simulati, guadagna badge e trasforma la teoria in competenze reali.", labs: "Lab", open: "Apri", soon: "In arrivo", new: "Nuovi", badges: "Badge disponibili", back: "Tutte le categorie", search: "Cerca un laboratorio...", noResults: "Nessun laboratorio corrisponde ai filtri.", start: "Avvia", all: "Tutti", beginner: "Principiante", intermediate: "Intermedio", advanced: "Avanzato", done: "Completati", todo: "Da completare", progress: "Il tuo progresso", level: "Livello", empty: "I primi laboratori sono in preparazione. Torna presto per iniziare questa skill.", minute: "min", allLabsPill: "Tutti i laboratori", certificationFilterLabel: "Filtra per certificazione", premiumBadge: "Premium", viewPreview: "Vedi anteprima" },
  en: { subtitle: "Learn by doing with practical 3 to 10 minute simulations.", available: "Available now", categories: "Categories", completed: "Completed", choose: "Choose your next challenge", chooseBody: "Practice in simulated environments, earn badges and turn theory into real skills.", labs: "Labs", open: "Open", soon: "Coming soon", new: "New", badges: "Badges available", back: "All categories", search: "Search labs...", noResults: "No labs match these filters.", start: "Start", all: "All", beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced", done: "Completed", todo: "To complete", progress: "Your progress", level: "Level", empty: "The first labs are being prepared. Come back soon to start this skill.", minute: "min", allLabsPill: "All Labs", certificationFilterLabel: "Filter by certification", premiumBadge: "Premium", viewPreview: "View preview" },
  fr: { subtitle: "Apprenez par la pratique avec des simulations de 3 à 10 minutes.", available: "Disponibles", categories: "Catégories", completed: "Terminés", choose: "Choisissez votre prochain défi", chooseBody: "Entraînez-vous dans des environnements simulés, gagnez des badges et transformez la théorie en compétences.", labs: "Labs", open: "Ouvrir", soon: "Bientôt", new: "Nouveaux", badges: "Badges disponibles", back: "Toutes les catégories", search: "Rechercher un lab...", noResults: "Aucun lab ne correspond aux filtres.", start: "Démarrer", all: "Tous", beginner: "Débutant", intermediate: "Intermédiaire", advanced: "Avancé", done: "Terminés", todo: "À terminer", progress: "Votre progression", level: "Niveau", empty: "Les premiers labs sont en préparation. Revenez bientôt.", minute: "min", allLabsPill: "Tous les labs", certificationFilterLabel: "Filtrer par certification", premiumBadge: "Premium", viewPreview: "Voir l'aperçu" },
  es: { subtitle: "Aprende haciendo con simulaciones prácticas de 3 a 10 minutos.", available: "Disponibles", categories: "Categorías", completed: "Completados", choose: "Elige tu próximo reto", chooseBody: "Practica en entornos simulados, gana insignias y convierte la teoría en habilidades reales.", labs: "Labs", open: "Abrir", soon: "Próximamente", new: "Nuevos", badges: "Insignias disponibles", back: "Todas las categorías", search: "Buscar un lab...", noResults: "Ningún lab coincide con los filtros.", start: "Iniciar", all: "Todos", beginner: "Principiante", intermediate: "Intermedio", advanced: "Avanzado", done: "Completados", todo: "Por completar", progress: "Tu progreso", level: "Nivel", empty: "Los primeros labs están en preparación. Vuelve pronto.", minute: "min", allLabsPill: "Todos los labs", certificationFilterLabel: "Filtrar por certificación", premiumBadge: "Premium", viewPreview: "Ver vista previa" },
} as const;

type Filter = "all" | Difficulty | "completed" | "incomplete";

export default function InteractiveLabsLanding({
  lang, dbLabs: dbLabsProp, dbCertifications,
}: {
  lang: Locale;
  /** Metadata risolti server-side (src/lib/server/labs.ts): sempre presenti dal
   *  primo render, mai da attendere. Nessun campo di accesso qui apposta. */
  dbLabs: LabsCatalogEntry[];
  dbCertifications: LabsCatalogCertificationFilter[];
}) {
  const t = copy[lang];
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [certFilter, setCertFilter] = useState<string>("all");
  // Overlay di sola AUTORIZZAZIONE: id -> {locked, accessReason}. Popolato da un
  // fetch client-side separato (sotto), mai dal render server. Finche' e' vuota
  // (primo render, fetch in corso, o fetch fallita) ogni lab DB-backed appare
  // SENZA lucchetto/badge Premium -- mai il lucchetto lampeggiante che poi
  // sparisce per chi ha gia' pagato.
  const [accessById, setAccessById] = useState<Map<number, { locked: boolean; accessReason: string }>>(new Map());
  const base = lang === "en" ? "/interactive-labs" : `/${lang}/interactive-labs`;

  // Step 4 (rivisto): SOLO lo stato di accesso e' client-side. Se questa chiamata
  // fallisce, i lab restano visibili e cliccabili senza badge (fail-soft): la
  // protezione reale e' server-side sul dettaglio (GuidedCertificationLab.tsx),
  // quindi degradare qui il lucchetto non apre un buco di sicurezza.
  //
  // Utente anonimo: nessuna chiamata. getToken() (src/lib/auth.ts) legge in modo
  // sincrono da session/localStorage, e' lo stesso segnale che usa apiFetch per
  // decidere se allegare l'Authorization header -- senza token l'esito lato
  // backend e' SEMPRE "locked" (FREE_PREVIEW_TYPES include 'lab', vedi
  // accessResolver.js), quindi e' un risultato noto, non stimato: impostarlo
  // direttamente risparmia una chiamata al rate limiter condiviso per un esito
  // gia' certo, ed elimina anche il breve stato "non ancora locked" che un
  // anonimo vedrebbe altrimenti prima che il fetch risolva.
  useEffect(() => {
    if (!getToken()) {
      setAccessById(new Map(dbLabsProp.map((item) => [item.id, { locked: true, accessReason: "free_preview" }])));
      return;
    }
    let active = true;
    (async () => {
      try {
        const res = await apiFetch(`/labs?certification=all&lang=${lang}`);
        if (!active || !res.ok) return;
        const json = await res.json();
        const items: LabAccessApiItem[] = Array.isArray(json.items) ? json.items : [];
        setAccessById(new Map(items.map((item) => [item.id, { locked: item.locked, accessReason: item.accessReason }])));
      } catch {
        // silenzioso: fail-soft, vedi commento sopra
      }
    })();
    return () => { active = false; };
  }, [lang, dbLabsProp]);

  // Merge metadata (prop, SSR) + overlay di accesso (stato, client-side).
  const dbLabs = useMemo<Lab[]>(() => dbLabsProp.map((item) => {
    const access = accessById.get(item.id);
    return {
      slug: item.slug,
      title: item.title,
      description: item.description,
      difficulty: DB_DIFFICULTY_MAP[item.difficulty] ?? "intermediate",
      duration: item.estimatedMinutes,
      locked: access?.locked,
      accessReason: access?.accessReason,
      isDbBacked: true,
      certificationSlug: item.certificationSlug ?? "",
    };
  }), [dbLabsProp, accessById]);

  // Deduplica per slug: i 6 slug ccst-networking-* NON esistono piu' come entry
  // statiche in `categories` (rimossi apposta) -- il DB e' l'unica fonte per loro,
  // sia per metadata (sempre, da SSR) sia per locked/accessReason (dopo l'overlay),
  // sia in "All Labs" sia sotto un filtro certificazione.
  const mergedCategories = useMemo<Category[]>(() => {
    if (dbLabs.length === 0) return categories;
    const byCategory = new Map<string, Lab[]>();
    for (const lab of dbLabs) {
      const categoryId = DB_CERTIFICATION_CATEGORY[lab.certificationSlug ?? ""] ?? FALLBACK_CATEGORY_ID;
      if (!byCategory.has(categoryId)) byCategory.set(categoryId, []);
      byCategory.get(categoryId)!.push(lab);
    }
    const result = categories.map((category) => {
      const extra = byCategory.get(category.id);
      return extra ? { ...category, labs: [...category.labs, ...extra] } : category;
    });
    const fallbackLabs = byCategory.get(FALLBACK_CATEGORY_ID);
    if (fallbackLabs && !result.some((c) => c.id === FALLBACK_CATEGORY_ID)) {
      // name usa localized(...)[lang] come description, invece di una stringa fissa
      // in inglese: sono entrambi testo mostrato all'utente, devono seguire la
      // stessa regola anche se oggi questo ramo e' irraggiungibile (nessuna
      // certificazione fuori da DB_CERTIFICATION_CATEGORY produce ancora lab).
      result.push({
        id: FALLBACK_CATEGORY_ID,
        name: localized("Laboratori per certificazione", "Certification labs", "Labs de certification", "Labs de certificación")[lang],
        icon: ShieldCheck,
        color: "from-slate-50 to-blue-50", iconColor: "bg-slate-200 text-slate-700",
        description: localized("Laboratori collegati a una certificazione", "Certification-linked labs", "Labs liés à une certification", "Labs vinculados a una certificación"),
        labs: fallbackLabs,
      });
    }
    return result;
  }, [dbLabs, lang]);

  const selected = selectedId ? mergedCategories.find((c) => c.id === selectedId) ?? null : null;
  const totalLabs = mergedCategories.reduce((sum, category) => sum + category.labs.length, 0);
  const totalCompleted = mergedCategories.flatMap(category => category.labs).filter(lab => lab.completed).length;
  const stats: Array<[number, string, LucideIcon]> = [
    [totalLabs, t.available, Gauge],
    [mergedCategories.length, t.categories, Boxes],
    [totalCompleted, t.completed, CheckCircle2],
  ];

  // dbCertifications arriva gia' risolto (slug, label per lingua, count) da
  // src/lib/server/labs.ts: nessuna risoluzione client-side qui.
  const certFilterLabs = useMemo(
    () => dbLabs.filter((lab) => lab.certificationSlug === certFilter),
    [dbLabs, certFilter]
  );
  const certFilterLabel = certFilter === "all" ? "" : (dbCertifications.find((c) => c.slug === certFilter)?.label ?? certFilter);

  const filteredLabs = useMemo(() => {
    if (!selected) return [];
    const normalized = query.trim().toLocaleLowerCase(lang);
    return selected.labs.filter(lab => {
      const title = resolveText(lab.title, lang);
      const description = resolveText(lab.description, lang);
      const matchesQuery = !normalized || `${title} ${description}`.toLocaleLowerCase(lang).includes(normalized);
      const matchesFilter = filter === "all" || filter === lab.difficulty || (filter === "completed" && lab.completed) || (filter === "incomplete" && !lab.completed);
      return matchesQuery && matchesFilter;
    });
  }, [filter, lang, query, selected]);

  const selectCategory = (categoryId: string) => {
    setSelectedId(categoryId);
    setFilter("all");
    setQuery("");
    window.requestAnimationFrame(() => document.getElementById("labs-content")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const selectCertFilter = (slug: string) => {
    setCertFilter(slug);
    setSelectedId(null);
  };

  return (
    <main id="main" className="min-h-[75vh] bg-slate-50/70 text-slate-950">
      <section className="relative overflow-hidden border-b border-indigo-100 bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-800 px-4 py-12 text-white sm:py-16">
        <div aria-hidden className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-fuchsia-400/15 blur-3xl" />
        <div aria-hidden className="absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-sky-400/15 blur-3xl" />
        <div className="relative mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-indigo-100"><Sparkles size={14} /> CertifyQuiz Labs</span>
            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">Interactive Labs</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-indigo-100 sm:text-xl">{t.subtitle}</p>
          </div>
          <dl className="mt-9 grid max-w-2xl grid-cols-3 gap-2 sm:gap-4">
            {stats.map(([value, label, StatIcon]) => {
              return <div key={label} className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur sm:p-4"><dt className="flex items-center gap-2 text-xs text-indigo-200 sm:text-sm"><StatIcon size={16} className="hidden sm:block" />{label}</dt><dd className="mt-1 text-2xl font-black sm:text-3xl">{value}</dd></div>;
            })}
          </dl>
        </div>
      </section>

      <div id="labs-content" className="scroll-mt-4 px-4 py-10 sm:py-12">
        <div className="mx-auto max-w-6xl">
          {/* La barra ha senso solo con una scelta reale: con 0 o 1 certificazione
              con contenuto, "All Labs" e il filtro mostrerebbero la stessa identica
              lista, quindi la barra resta nascosta (vincolo dello Step 4, non
              rinegoziato). La logica di fetch/merge/filtro sotto e' invariata: cambia
              solo questa condizione di rendering. */}
          {dbCertifications.length >= 2 && (
            <div className="mb-7 flex flex-wrap gap-2" role="group" aria-label={t.certificationFilterLabel}>
              <button onClick={() => selectCertFilter("all")} className={`min-h-10 shrink-0 rounded-xl px-3.5 text-sm font-bold transition ${certFilter === "all" ? "bg-indigo-600 text-white shadow-sm" : "border border-slate-200 bg-white text-slate-600 hover:border-indigo-300"}`}>{t.allLabsPill}</button>
              {dbCertifications.map(c => (
                <button key={c.slug} onClick={() => selectCertFilter(c.slug)} className={`min-h-10 shrink-0 rounded-xl px-3.5 text-sm font-bold transition ${certFilter === c.slug ? "bg-indigo-600 text-white shadow-sm" : "border border-slate-200 bg-white text-slate-600 hover:border-indigo-300"}`}>{c.label} · {c.count}</button>
              ))}
            </div>
          )}

          {certFilter !== "all" ? (
            <CertificationLabsView label={certFilterLabel} lang={lang} base={base} labs={certFilterLabs} />
          ) : !selected ? (
            <>
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div><p className="text-sm font-bold uppercase tracking-widest text-indigo-700">{t.categories}</p><h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">{t.choose}</h2><p className="mt-2 max-w-2xl text-slate-600">{t.chooseBody}</p></div>
                <span className="shrink-0 text-sm font-semibold text-slate-500">{mergedCategories.length} {t.categories.toLocaleLowerCase(lang)}</span>
              </div>
              <section className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-label={t.categories}>
                {mergedCategories.map(category => <CategoryCard key={category.id} category={category} lang={lang} onOpen={() => selectCategory(category.id)} />)}
              </section>
            </>
          ) : <CategoryView category={selected} lang={lang} base={base} filter={filter} query={query} labs={filteredLabs} onBack={() => setSelectedId(null)} onFilter={setFilter} onQuery={setQuery} />}
        </div>
      </div>
    </main>
  );
}

function CategoryCard({ category, lang, onOpen }: { category: Category; lang: Locale; onOpen: () => void }) {
  const t = copy[lang];
  const Icon = category.icon;
  const completed = category.labs.filter(lab => lab.completed).length;
  const progress = category.labs.length ? Math.round(completed / category.labs.length * 100) : 0;
  return (
    <button onClick={onOpen} className={`group flex min-h-56 flex-col rounded-2xl border border-slate-200 bg-gradient-to-br ${category.color} p-5 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}>
      <div className="flex w-full items-start justify-between gap-3"><span className={`grid h-11 w-11 place-items-center rounded-xl ${category.iconColor}`}><Icon size={22} aria-hidden /></span>{category.isNew ? <span className="rounded-full bg-fuchsia-100 px-2.5 py-1 text-[11px] font-bold text-fuchsia-700">🔥 {t.new}</span> : category.comingSoon ? <span className="rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-bold text-slate-500">{t.soon}</span> : <span className="rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-bold text-indigo-700">⭐ {category.labs.length} {t.labs}</span>}</div>
      <h3 className="mt-4 text-lg font-extrabold">{category.name}</h3>
      <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-600">{category.description[lang]}</p>
      <div className="mt-auto w-full pt-4">
        {!category.comingSoon && <><div className="mb-1.5 flex justify-between text-[11px] font-semibold text-slate-500"><span>✅ {completed} / {category.labs.length}</span><span>🏆 {t.badges}</span></div><div className="h-1.5 overflow-hidden rounded-full bg-white"><div className="h-full rounded-full bg-indigo-600" style={{ width: `${progress}%` }} /></div></>}
        <span className="mt-3 flex items-center justify-between text-sm font-bold text-indigo-700">{category.comingSoon ? t.soon : t.open}<ChevronRight size={17} className="transition-transform group-hover:translate-x-1" /></span>
      </div>
    </button>
  );
}

function CategoryView({ category, lang, base, filter, query, labs, onBack, onFilter, onQuery }: { category: Category; lang: Locale; base: string; filter: Filter; query: string; labs: Lab[]; onBack: () => void; onFilter: (filter: Filter) => void; onQuery: (query: string) => void }) {
  const t = copy[lang];
  const Icon = category.icon;
  const completed = category.labs.filter(lab => lab.completed).length;
  const progress = category.labs.length ? Math.round(completed / category.labs.length * 100) : 0;
  const filters: { id: Filter; label: string }[] = [{ id: "all", label: t.all }, { id: "beginner", label: t.beginner }, { id: "intermediate", label: t.intermediate }, { id: "advanced", label: t.advanced }, { id: "completed", label: t.done }, { id: "incomplete", label: t.todo }];
  const badgeLevel = progress === 100 ? "Master" : progress >= 75 ? "Gold" : progress >= 50 ? "Silver" : "Bronze";
  return <section>
    <button onClick={onBack} className="inline-flex min-h-11 items-center gap-2 rounded-xl px-2 text-sm font-bold text-indigo-700 hover:bg-indigo-50"><ArrowLeft size={18} />{t.back}</button>
    <div className={`mt-3 overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br ${category.color} p-5 shadow-sm sm:p-7`}>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4"><span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${category.iconColor}`}><Icon size={28} /></span><div><p className="text-xs font-bold uppercase tracking-widest text-indigo-700">Interactive Labs</p><h2 className="mt-1 text-3xl font-black">{category.name}</h2><p className="mt-1 text-slate-600">{category.description[lang]}</p></div></div>
        <div className="w-full rounded-2xl border border-white bg-white/75 p-4 sm:max-w-xs"><div className="flex items-center justify-between"><span className="text-sm font-bold text-slate-600">{t.progress}</span><strong>{completed} / {category.labs.length}</strong></div><div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-500 transition-all" style={{ width: `${progress}%` }} /></div><div className="mt-3 flex items-center justify-between text-xs"><span className="font-bold text-indigo-700"><Trophy size={14} className="mr-1 inline" />{badgeLevel}</span><span className="text-slate-500">Bronze · Silver · Gold · Master</span></div></div>
      </div>
    </div>

    {category.comingSoon ? <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><LockKeyhole className="mx-auto text-indigo-500" size={32} /><h3 className="mt-3 text-lg font-bold">{t.soon}</h3><p className="mx-auto mt-2 max-w-lg text-slate-600">{t.empty}</p></div> : <>
      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filters">{filters.map(item => <button key={item.id} onClick={() => onFilter(item.id)} className={`min-h-10 shrink-0 rounded-xl px-3.5 text-sm font-bold transition ${filter === item.id ? "bg-indigo-600 text-white shadow-sm" : "border border-slate-200 bg-white text-slate-600 hover:border-indigo-300"}`}>{item.label}</button>)}</div>
        <label className="relative block lg:w-72"><Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><span className="sr-only">{t.search}</span><input value={query} onChange={event => onQuery(event.target.value)} placeholder={t.search} className="min-h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" /></label>
      </div>
      <div className="mt-4 space-y-3">{labs.length ? labs.map(lab => <LabRow key={lab.slug} lab={lab} lang={lang} base={base} />) : <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">{t.noResults}</p>}</div>
    </>}
  </section>;
}

/** Vista piatta per un filtro certificazione specifico: SOLO lab DB-backed, mai i
 *  legacy. I lab arrivano gia' risolti da SSR (prop): nessuno stato di caricamento
 *  qui, solo l'eventuale lista vuota. */
function CertificationLabsView({ label, lang, base, labs }: { label: string; lang: Locale; base: string; labs: Lab[] }) {
  const t = copy[lang];
  return <section>
    <div className="mb-5"><p className="text-sm font-bold uppercase tracking-widest text-indigo-700">{t.certificationFilterLabel}</p><h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">{label}</h2></div>
    {labs.length === 0
      ? <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">{t.noResults}</p>
      : <div className="space-y-3">{labs.map(lab => <LabRow key={lab.slug} lab={lab} lang={lang} base={base} />)}</div>}
  </section>;
}

function LabRow({ lab, lang, base }: { lab: Lab; lang: Locale; base: string }) {
  const t = copy[lang];
  const difficulty = { beginner: t.beginner, intermediate: t.intermediate, advanced: t.advanced }[lab.difficulty];
  const difficultyColor = { beginner: "bg-emerald-100 text-emerald-700", intermediate: "bg-amber-100 text-amber-800", advanced: "bg-rose-100 text-rose-700" }[lab.difficulty];
  const title = resolveText(lab.title, lang);
  const description = resolveText(lab.description, lang);
  return <article className="group flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-200 hover:shadow-md sm:flex-row sm:items-center">
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-700">{lab.locked ? <LockKeyhole size={19} /> : <Terminal size={19} />}</span>
    <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-extrabold text-slate-950">{title}</h3>{lab.completed && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700"><Check size={12} />{t.completed}</span>}{lab.locked && <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800"><LockKeyhole size={12} />{t.premiumBadge}</span>}</div><p className="mt-1 truncate text-sm text-slate-600">{description}</p></div>
    <div className="flex items-center gap-2 sm:shrink-0"><span className={`rounded-lg px-2.5 py-1.5 text-xs font-bold ${difficultyColor}`}>{difficulty}</span><span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-600"><Clock3 size={13} />{lab.duration} {t.minute}</span></div>
    {/* min-w: la CTA passa da t.start a t.viewPreview quando l'overlay di accesso
        risolve (vedi useEffect sopra) -- senza una larghezza minima il bottone
        si allarga/restringe visibilmente in quel momento. Dimensionata sulla
        stringa piu' lunga tra le 4 lingue ("Ver vista previa"). */}
    <Link href={`${base}/${lab.slug}`} className="inline-flex min-h-10 min-w-[10rem] items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-bold text-white transition hover:bg-indigo-700 sm:shrink-0">{lab.locked ? <LockKeyhole size={15} /> : <Play size={15} fill="currentColor" />}{lab.locked ? t.viewPreview : t.start}<ArrowRight size={15} /></Link>
  </article>;
}
