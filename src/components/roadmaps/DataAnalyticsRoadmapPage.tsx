import Link from "next/link";
import RoadmapStepCard from "@/components/roadmaps/RoadmapStepCard";

type Locale = "it" | "en" | "es" | "fr";

type RoadmapQuizSlug = string;
type RoadmapCertSlug = string;

export default function DataAnalyticsRoadmapPage({
  lang,
}: {
  lang: Locale;
}) {
  const t = CONTENT[lang];

  const quiz = (slug: RoadmapQuizSlug) => `/${lang}/quiz/${slug}`;

  const cert = (slug: RoadmapCertSlug) => {
    if (lang === "it") return `/it/certificazioni/${slug}`;
    if (lang === "fr") return `/fr/certifications/${slug}`;
    if (lang === "es") return `/es/certificaciones/${slug}`;
    return `/certifications/${slug}`;
  };

  const categoryData =
    lang === "en"
      ? "/categories/data-analytics"
      : lang === "it"
      ? "/it/categorie/analisi-dei-dati"
      : lang === "es"
      ? "/es/categorias/analisis-de-datos"
      : "/fr/categories/analyse-des-donnees";

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          {t.title}
        </h1>
        <p className="mt-2 text-lg text-slate-600">{t.subtitle}</p>
        <p className="mt-5 text-slate-700 leading-relaxed">{t.intro}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={quiz("data-analytics-foundations")}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 transition"
          >
            {t.ctaPrimary}
          </Link>

          <Link
            href={categoryData}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-800 hover:bg-slate-50 transition"
          >
            {t.ctaSecondary}
          </Link>
        </div>
      </header>

      <section className="relative mt-10">
        <div className="absolute bottom-0 left-5 top-0 hidden w-px bg-slate-200 md:block" />

        <div className="space-y-6 md:pl-10">
          {t.levels.map((lvl, index) => (
            <RoadmapStepCard
              key={lvl.title}
              level={lvl}
              index={index}
              lang={lang}
              quizHref={(l, slug) => quiz(slug)}
              certHref={(l, slug) => cert(slug)}
              goalLabel={t.goalLabel}
              practiceCta={t.practiceCta}
              certCta={t.certCta}
            />
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-extrabold">{t.salaryTitle}</h2>
        <p className="mt-2 text-slate-700 leading-relaxed">{t.salaryIntro}</p>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {t.salaryRanges.map((r) => (
            <div
              key={r.label}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <p className="font-bold">{r.label}</p>
              <p className="mt-1 text-slate-700">{r.range}</p>
            </div>
          ))}
        </div>

        <p className="mt-3 text-sm text-slate-500">{t.salaryDisclaimer}</p>
      </section>

      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-extrabold">{t.compareTitle}</h2>
        <p className="mt-2 text-slate-700 leading-relaxed">{t.compareIntro}</p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left">
                <th className="border-b border-slate-200 py-2 pr-4"></th>
                <th className="border-b border-slate-200 py-2 pr-4 font-bold">
                  {t.compareLeftTitle}
                </th>
                <th className="border-b border-slate-200 py-2 font-bold">
                  {t.compareRightTitle}
                </th>
              </tr>
            </thead>
            <tbody>
              {t.compareRows.map((row) => (
                <tr key={row.label} className="align-top">
                  <td className="border-b border-slate-100 py-3 pr-4 font-semibold text-slate-700">
                    {row.label}
                  </td>
                  <td className="border-b border-slate-100 py-3 pr-4 text-slate-700">
                    {row.left}
                  </td>
                  <td className="border-b border-slate-100 py-3 text-slate-700">
                    {row.right}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-800">
          <p className="font-semibold">{t.compareRecommendationTitle}</p>
          <p className="mt-1">{t.compareRecommendationBody}</p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-extrabold">{t.faqTitle}</h2>
        <div className="mt-4 space-y-4">
          {t.faq.map((f) => (
            <div
              key={f.q}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="font-bold text-slate-900">{f.q}</p>
              <p className="mt-2 text-slate-700 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-blue-200 bg-blue-50 p-5">
        <h2 className="text-xl font-extrabold text-slate-900">
          {t.finalCtaTitle}
        </h2>
        <p className="mt-2 text-slate-700">{t.finalCtaBody}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={quiz("data-analytics-foundations")}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 transition"
          >
            {t.ctaPrimary}
          </Link>
          <Link
            href={categoryData}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-800 hover:bg-slate-50 transition"
          >
            {t.ctaSecondary}
          </Link>
        </div>
      </section>
    </main>
  );
}

const CONTENT: Record<
  Locale,
  {
    title: string;
    subtitle: string;
    intro: string;

    ctaPrimary: string;
    ctaSecondary: string;
    certCta: string;

    goalLabel: string;
    practiceCta: string;

    levels: Array<{
      title: string;
      body: string;
      recommended?: string[];
      goal?: string;
      ctaQuizSlug?: RoadmapQuizSlug;
      ctaCertSlug?: RoadmapCertSlug;
      ctaPrimaryText?: string;
      ctaSecondaryText?: string;
      reality?: string;
      mistakes?: string[];
      outcomes?: string[];
    }>;

    salaryTitle: string;
    salaryIntro: string;
    salaryRanges: Array<{ label: string; range: string }>;
    salaryDisclaimer: string;

    compareTitle: string;
    compareIntro: string;
    compareLeftTitle: string;
    compareRightTitle: string;
    compareRows: Array<{ label: string; left: string; right: string }>;
    compareRecommendationTitle: string;
    compareRecommendationBody: string;

    faqTitle: string;
    faq: Array<{ q: string; a: string }>;

    finalCtaTitle: string;
    finalCtaBody: string;
  }
> = {
  en: {
    title: "Data & Analytics Certification Roadmap 2026",
    subtitle: "From data fundamentals to practical analyst skills",
    intro:
      "Data & Analytics is not only about charts. First you need data fundamentals, then SQL, then reporting and business intelligence, then cloud data concepts. This roadmap gives you a realistic path based on the data certifications and quizzes available on CertifyQuiz.",

    ctaPrimary: "Start with Data Analytics Foundations",
    ctaSecondary: "Browse Data & Analytics certifications",
    certCta: "Explore certification",

    goalLabel: "Goal:",
    practiceCta: "Practice now",

    levels: [
      {
        title: "🟢 Level 0 — Data basics",
        body:
          "If you are completely new, start with the language of data: tables, rows, columns, records, fields, metrics, data quality, and the difference between raw data and useful information.",
        recommended: [
          "Data types and tables",
          "Basic metrics and KPIs",
          "Data quality concepts",
          "Reading simple reports",
        ],
        goal: "Understand what data represents before trying to analyze it.",
        reality:
          "Most beginners jump straight into dashboards. In reality, if you do not understand the data behind the chart, the dashboard is only decoration.",
        mistakes: [
          "Starting with advanced visualization tools too early",
          "Ignoring data quality",
          "Confusing data, metrics, and decisions",
          "Copying dashboards without understanding them",
        ],
        outcomes: [
          "Read basic datasets with more confidence",
          "Understand the purpose of metrics and KPIs",
          "Prepare for SQL and BI learning",
        ],
        ctaQuizSlug: "data-analytics-foundations",
        ctaCertSlug: "data-analytics-foundations",
        ctaPrimaryText: "Start Foundations quiz",
        ctaSecondaryText: "Explore Data Analytics Foundations",
      },
      {
        title: "🟡 Level 1 — SQL and databases",
        body:
          "SQL is the core skill for most data roles. Learn how to filter, join, aggregate, group, and extract useful information from relational databases.",
        recommended: ["Microsoft SQL Server", "SQL Foundations"],
        goal: "Learn to retrieve and reason about data stored in databases.",
        reality:
          "You can use many BI tools without SQL, but you will hit a wall quickly. SQL gives you independence and deeper understanding.",
        mistakes: [
          "Avoiding joins because they feel difficult",
          "Learning syntax without understanding relationships",
          "Not practicing with realistic datasets",
          "Ignoring NULL values and data cleaning problems",
        ],
        outcomes: [
          "Write basic and intermediate SQL queries",
          "Understand relational data structures",
          "Prepare for reporting and analytics tasks",
        ],
        ctaQuizSlug: "microsoft-sql-server",
        ctaCertSlug: "microsoft-sql-server",
        ctaPrimaryText: "Start SQL quiz",
        ctaSecondaryText: "Explore SQL Server certification",
      },
      {
        title: "🟠 Level 2 — Business Intelligence",
        body:
          "At this level you learn how to transform data into reports, dashboards, KPIs, and insights that non-technical stakeholders can understand.",
        recommended: ["Microsoft PL-300 Power BI Data Analyst"],
        goal: "Build useful dashboards and communicate insights clearly.",
        reality:
          "A dashboard is valuable only if it answers real business questions. Pretty visuals are not enough.",
        mistakes: [
          "Adding too many charts",
          "Using KPIs without business context",
          "Ignoring the audience of the report",
          "Building visuals before defining the question",
        ],
        outcomes: [
          "Understand BI workflows",
          "Create clearer reports and dashboards",
          "Prepare for Power BI and analyst roles",
        ],
        ctaQuizSlug: "pl-300-power-bi-data-analyst",
        ctaCertSlug: "pl-300-power-bi-data-analyst",
        ctaPrimaryText: "Start PL-300 quiz",
        ctaSecondaryText: "Explore PL-300 certification",
      },
      {
        title: "🔵 Level 3 — Cloud data fundamentals",
        body:
          "Modern data platforms often run in the cloud. Learn storage, relational and non-relational data services, analytics services, governance, privacy, and security.",
        recommended: ["Microsoft DP-900 Azure Data Fundamentals"],
        goal: "Understand how data platforms work in cloud environments.",
        reality:
          "Cloud data is not just storage. You need to understand services, governance, security, cost, and how data moves through platforms.",
        mistakes: [
          "Memorizing service names without understanding use cases",
          "Ignoring governance and privacy",
          "Confusing transactional and analytical workloads",
          "Skipping cloud fundamentals",
        ],
        outcomes: [
          "Understand cloud data service categories",
          "Prepare for DP-900",
          "Build a bridge toward cloud analytics roles",
        ],
        ctaQuizSlug: "dp-900-azure-data-fundamentals",
        ctaCertSlug: "dp-900-azure-data-fundamentals",
        ctaPrimaryText: "Start DP-900 quiz",
        ctaSecondaryText: "Explore DP-900 certification",
      },
    ],

    salaryTitle: "💰 Data & Analytics salary outlook (2026)",
    salaryIntro:
      "Typical ranges vary widely by country, company, industry, and experience. Use them as orientation, not as a promise.",
    salaryRanges: [
      { label: "Entry-level", range: "$45k–$70k" },
      { label: "Mid-level", range: "$75k–$110k" },
      { label: "Senior / Specialist", range: "$120k+" },
    ],
    salaryDisclaimer:
      "Disclaimer: certifications help more when combined with SQL practice, portfolio projects, dashboards, and real datasets.",

    compareTitle: "🔍 SQL vs Power BI vs Cloud Data — what should you learn first?",
    compareIntro:
      "These skills are connected, but they are not the same. The mistake is jumping to dashboards before understanding data.",
    compareLeftTitle: "Progressive path",
    compareRightTitle: "Jump too fast",
    compareRows: [
      { label: "Clarity", left: "Understand data first", right: "Confusing tools with skills" },
      { label: "Skills", left: "SQL + BI + cloud foundation", right: "Weak technical base" },
      { label: "Outcome", left: "Better analyst growth", right: "Harder to solve real problems" },
    ],
    compareRecommendationTitle: "Recommendation",
    compareRecommendationBody:
      "Start with Data Analytics Foundations, then SQL, then Power BI, then cloud data fundamentals such as DP-900.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "Do I need SQL for data analytics?",
        a: "Yes. Even if you use BI tools, SQL helps you understand, extract, validate, and prepare data properly.",
      },
      {
        q: "Should I learn Power BI before SQL?",
        a: "You can start exploring Power BI early, but SQL should not be skipped. It is one of the strongest foundations for data roles.",
      },
      {
        q: "Is DP-900 useful for beginners?",
        a: "Yes, especially if you want to understand how data services work in Microsoft Azure and cloud environments.",
      },
    ],

    finalCtaTitle: "🚀 Start your data path now",
    finalCtaBody:
      "Start with the foundations, then build SQL, BI, and cloud data skills step by step.",
  },

  it: {
    title: "Roadmap Certificazioni Data & Analytics 2026",
    subtitle: "Dalle basi dei dati a competenze pratiche da analyst",
    intro:
      "Data & Analytics non significa solo grafici. Prima servono fondamenti sui dati, poi SQL, poi reporting e business intelligence, infine concetti cloud data. Questa roadmap ti dà un percorso realistico basato sui quiz e sulle certificazioni disponibili su CertifyQuiz.",

    ctaPrimary: "Inizia con Data Analytics Foundations",
    ctaSecondary: "Esplora certificazioni Data & Analytics",
    certCta: "Scopri la certificazione",

    goalLabel: "Obiettivo:",
    practiceCta: "Allenati ora",

    levels: [
      {
        title: "🟢 Livello 0 — Basi dei dati",
        body:
          "Se parti da zero, comincia dal linguaggio dei dati: tabelle, righe, colonne, record, campi, metriche, qualità del dato e differenza tra dato grezzo e informazione utile.",
        recommended: [
          "Tipi di dato e tabelle",
          "Metriche e KPI di base",
          "Qualità del dato",
          "Lettura di report semplici",
        ],
        goal: "Capire cosa rappresentano i dati prima di analizzarli.",
        reality:
          "Molti principianti saltano subito alle dashboard. In realtà, se non capisci i dati dietro al grafico, la dashboard è solo decorazione.",
        mistakes: [
          "Iniziare troppo presto con strumenti avanzati di visualizzazione",
          "Ignorare la qualità del dato",
          "Confondere dato, metrica e decisione",
          "Copiare dashboard senza capirle",
        ],
        outcomes: [
          "Leggere dataset semplici con più sicurezza",
          "Capire il ruolo di metriche e KPI",
          "Prepararti meglio a SQL e BI",
        ],
        ctaQuizSlug: "data-analytics-foundations",
        ctaCertSlug: "data-analytics-foundations",
        ctaPrimaryText: "Inizia quiz Foundations",
        ctaSecondaryText: "Scopri Data Analytics Foundations",
      },
      {
        title: "🟡 Livello 1 — SQL e database",
        body:
          "SQL è una competenza centrale per quasi tutti i ruoli data. Impara a filtrare, unire, aggregare, raggruppare ed estrarre informazioni utili dai database relazionali.",
        recommended: ["Microsoft SQL Server", "SQL Foundations"],
        goal: "Imparare a recuperare e ragionare sui dati nei database.",
        reality:
          "Puoi usare molti strumenti BI senza SQL, ma prima o poi ti blocchi. SQL ti dà autonomia e comprensione più profonda.",
        mistakes: [
          "Evitare le JOIN perché sembrano difficili",
          "Studiare sintassi senza capire le relazioni",
          "Non esercitarsi su dataset realistici",
          "Ignorare NULL e problemi di pulizia dati",
        ],
        outcomes: [
          "Scrivere query SQL base e intermedie",
          "Capire strutture dati relazionali",
          "Prepararti a reporting e analytics",
        ],
        ctaQuizSlug: "microsoft-sql-server",
        ctaCertSlug: "microsoft-sql-server",
        ctaPrimaryText: "Inizia quiz SQL",
        ctaSecondaryText: "Scopri SQL Server",
      },
      {
        title: "🟠 Livello 2 — Business Intelligence",
        body:
          "Qui impari a trasformare dati in report, dashboard, KPI e insight comprensibili anche a stakeholder non tecnici.",
        recommended: ["Microsoft PL-300 Power BI Data Analyst"],
        goal: "Creare dashboard utili e comunicare insight in modo chiaro.",
        reality:
          "Una dashboard vale solo se risponde a domande reali di business. I grafici belli non bastano.",
        mistakes: [
          "Inserire troppi grafici",
          "Usare KPI senza contesto business",
          "Ignorare il pubblico del report",
          "Creare visual prima di definire la domanda",
        ],
        outcomes: [
          "Capire i workflow BI",
          "Creare report e dashboard più chiari",
          "Prepararti a Power BI e ruoli analyst",
        ],
        ctaQuizSlug: "pl-300-power-bi-data-analyst",
        ctaCertSlug: "pl-300-power-bi-data-analyst",
        ctaPrimaryText: "Inizia quiz PL-300",
        ctaSecondaryText: "Scopri PL-300",
      },
      {
        title: "🔵 Livello 3 — Cloud data fundamentals",
        body:
          "Le piattaforme dati moderne spesso girano in cloud. Impara storage, servizi dati relazionali e non relazionali, analytics, governance, privacy e sicurezza.",
        recommended: ["Microsoft DP-900 Azure Data Fundamentals"],
        goal: "Capire come funzionano le piattaforme dati in cloud.",
        reality:
          "Il cloud data non è solo storage. Devi capire servizi, governance, sicurezza, costi e movimento dei dati tra piattaforme.",
        mistakes: [
          "Memorizzare nomi di servizi senza capirne l’uso",
          "Ignorare governance e privacy",
          "Confondere workload transazionali e analitici",
          "Saltare i fondamenti cloud",
        ],
        outcomes: [
          "Capire le categorie di servizi cloud data",
          "Prepararti a DP-900",
          "Creare un ponte verso ruoli cloud analytics",
        ],
        ctaQuizSlug: "dp-900-azure-data-fundamentals",
        ctaCertSlug: "dp-900-azure-data-fundamentals",
        ctaPrimaryText: "Inizia quiz DP-900",
        ctaSecondaryText: "Scopri DP-900",
      },
    ],

    salaryTitle: "💰 Stipendi Data & Analytics (2026)",
    salaryIntro:
      "Le fasce variano molto in base a paese, azienda, settore ed esperienza. Usale come orientamento, non come promessa.",
    salaryRanges: [
      { label: "Entry-level", range: "$45k–$70k" },
      { label: "Mid-level", range: "$75k–$110k" },
      { label: "Senior / Specialist", range: "$120k+" },
    ],
    salaryDisclaimer:
      "Disclaimer: le certificazioni aiutano di più se combinate con pratica SQL, progetti portfolio, dashboard e dataset reali.",

    compareTitle: "🔍 SQL vs Power BI vs Cloud Data — da cosa partire?",
    compareIntro:
      "Queste competenze sono collegate, ma non sono la stessa cosa. L’errore è saltare alle dashboard prima di capire i dati.",
    compareLeftTitle: "Percorso progressivo",
    compareRightTitle: "Saltare troppo avanti",
    compareRows: [
      { label: "Chiarezza", left: "Capisci prima i dati", right: "Confondi strumenti e competenze" },
      { label: "Competenze", left: "SQL + BI + base cloud", right: "Base tecnica debole" },
      { label: "Risultato", left: "Crescita analyst più solida", right: "Più difficile risolvere problemi reali" },
    ],
    compareRecommendationTitle: "Consiglio",
    compareRecommendationBody:
      "Inizia da Data Analytics Foundations, poi SQL, poi Power BI, poi fondamenti cloud data come DP-900.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "Serve SQL per Data Analytics?",
        a: "Sì. Anche se usi strumenti BI, SQL ti aiuta a capire, estrarre, validare e preparare i dati correttamente.",
      },
      {
        q: "Meglio Power BI prima di SQL?",
        a: "Puoi esplorare Power BI presto, ma SQL non va saltato. È una delle basi più forti per i ruoli data.",
      },
      {
        q: "DP-900 è utile per principianti?",
        a: "Sì, soprattutto se vuoi capire come funzionano i servizi dati in Microsoft Azure e nel cloud.",
      },
    ],

    finalCtaTitle: "🚀 Inizia ora il tuo percorso data",
    finalCtaBody:
      "Parti dalle basi, poi costruisci competenze SQL, BI e cloud data passo dopo passo.",
  },

  es: {
    title: "Roadmap Certificaciones Data & Analytics 2026",
    subtitle: "De fundamentos de datos a habilidades prácticas de analyst",
    intro:
      "Data & Analytics no significa solo gráficos. Primero necesitas fundamentos de datos, luego SQL, después reporting y business intelligence, y finalmente conceptos de cloud data. Esta roadmap te da una ruta realista basada en los quizzes y certificaciones disponibles en CertifyQuiz.",

    ctaPrimary: "Empieza con Data Analytics Foundations",
    ctaSecondary: "Explorar certificaciones Data & Analytics",
    certCta: "Descubrir certificación",

    goalLabel: "Objetivo:",
    practiceCta: "Practicar ahora",

    levels: [
      {
        title: "🟢 Nivel 0 — Bases de datos",
        body:
          "Si empiezas desde cero, comienza con el lenguaje de los datos: tablas, filas, columnas, registros, campos, métricas, calidad del dato y diferencia entre dato bruto e información útil.",
        recommended: [
          "Tipos de datos y tablas",
          "Métricas y KPI básicos",
          "Calidad del dato",
          "Lectura de informes simples",
        ],
        goal: "Entender qué representan los datos antes de analizarlos.",
        reality:
          "Muchos principiantes saltan directamente a dashboards. En realidad, si no entiendes los datos detrás del gráfico, el dashboard es solo decoración.",
        mistakes: [
          "Empezar demasiado pronto con herramientas avanzadas de visualización",
          "Ignorar la calidad del dato",
          "Confundir dato, métrica y decisión",
          "Copiar dashboards sin entenderlos",
        ],
        outcomes: [
          "Leer datasets simples con más confianza",
          "Entender el papel de métricas y KPI",
          "Prepararte mejor para SQL y BI",
        ],
        ctaQuizSlug: "data-analytics-foundations",
        ctaCertSlug: "data-analytics-foundations",
        ctaPrimaryText: "Empezar quiz Foundations",
        ctaSecondaryText: "Descubrir Data Analytics Foundations",
      },
    ],

    salaryTitle: "💰 Salarios Data & Analytics (2026)",
    salaryIntro:
      "Los rangos varían mucho según país, empresa, sector y experiencia. Úsalos como orientación, no como promesa.",
    salaryRanges: [
      { label: "Entry-level", range: "$45k–$70k" },
      { label: "Mid-level", range: "$75k–$110k" },
      { label: "Senior / Specialist", range: "$120k+" },
    ],
    salaryDisclaimer:
      "Disclaimer: las certificaciones ayudan más si se combinan con práctica SQL, proyectos portfolio, dashboards y datasets reales.",

    compareTitle: "🔍 SQL vs Power BI vs Cloud Data — ¿por dónde empezar?",
    compareIntro:
      "Estas habilidades están conectadas, pero no son lo mismo. El error es saltar a dashboards antes de entender los datos.",
    compareLeftTitle: "Ruta progresiva",
    compareRightTitle: "Saltar demasiado rápido",
    compareRows: [
      { label: "Claridad", left: "Entiendes primero los datos", right: "Confundes herramientas con habilidades" },
      { label: "Habilidades", left: "SQL + BI + base cloud", right: "Base técnica débil" },
      { label: "Resultado", left: "Crecimiento analyst más sólido", right: "Más difícil resolver problemas reales" },
    ],
    compareRecommendationTitle: "Recomendación",
    compareRecommendationBody:
      "Empieza con Data Analytics Foundations, luego SQL, después Power BI y luego fundamentos cloud data como DP-900.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "¿Necesito SQL para Data Analytics?",
        a: "Sí. Aunque uses herramientas BI, SQL te ayuda a entender, extraer, validar y preparar datos correctamente.",
      },
    ],

    finalCtaTitle: "🚀 Empieza ahora tu ruta data",
    finalCtaBody:
      "Empieza por las bases y construye habilidades SQL, BI y cloud data paso a paso.",
  },

  fr: {
    title: "Roadmap Certifications Data & Analytics 2026",
    subtitle: "Des bases des données aux compétences pratiques d’analyst",
    intro:
      "Data & Analytics ne signifie pas seulement graphiques. Il faut d’abord des fondamentaux data, puis SQL, ensuite reporting et business intelligence, puis des concepts cloud data. Cette roadmap propose un parcours réaliste basé sur les quiz et certifications disponibles sur CertifyQuiz.",

    ctaPrimary: "Commencer avec Data Analytics Foundations",
    ctaSecondary: "Explorer les certifications Data & Analytics",
    certCta: "Découvrir la certification",

    goalLabel: "Objectif :",
    practiceCta: "S'entraîner maintenant",

    levels: [
      {
        title: "🟢 Niveau 0 — Bases des données",
        body:
          "Si vous partez de zéro, commencez par le langage des données : tables, lignes, colonnes, enregistrements, champs, métriques, qualité des données et différence entre donnée brute et information utile.",
        recommended: [
          "Types de données et tables",
          "Métriques et KPI de base",
          "Qualité des données",
          "Lecture de rapports simples",
        ],
        goal: "Comprendre ce que représentent les données avant de les analyser.",
        reality:
          "Beaucoup de débutants sautent directement aux tableaux de bord. En réalité, si vous ne comprenez pas les données derrière le graphique, le dashboard n’est qu’une décoration.",
        mistakes: [
          "Commencer trop tôt avec des outils avancés de visualisation",
          "Ignorer la qualité des données",
          "Confondre donnée, métrique et décision",
          "Copier des dashboards sans les comprendre",
        ],
        outcomes: [
          "Lire des datasets simples avec plus de confiance",
          "Comprendre le rôle des métriques et KPI",
          "Mieux se préparer à SQL et BI",
        ],
        ctaQuizSlug: "data-analytics-foundations",
        ctaCertSlug: "data-analytics-foundations",
        ctaPrimaryText: "Commencer le quiz Foundations",
        ctaSecondaryText: "Découvrir Data Analytics Foundations",
      },
    ],

    salaryTitle: "💰 Salaires Data & Analytics (2026)",
    salaryIntro:
      "Les fourchettes varient beaucoup selon le pays, l’entreprise, le secteur et l’expérience. Utilisez-les comme orientation, pas comme promesse.",
    salaryRanges: [
      { label: "Débutant", range: "$45k–$70k" },
      { label: "Intermédiaire", range: "$75k–$110k" },
      { label: "Senior / Spécialiste", range: "$120k+" },
    ],
    salaryDisclaimer:
      "Disclaimer : les certifications sont plus utiles lorsqu’elles sont combinées à la pratique SQL, des projets portfolio, des dashboards et des datasets réels.",

    compareTitle: "🔍 SQL vs Power BI vs Cloud Data — par quoi commencer ?",
    compareIntro:
      "Ces compétences sont liées, mais ce n’est pas la même chose. L’erreur est de passer aux dashboards avant de comprendre les données.",
    compareLeftTitle: "Parcours progressif",
    compareRightTitle: "Aller trop vite",
    compareRows: [
      { label: "Clarté", left: "Vous comprenez d’abord les données", right: "Vous confondez outils et compétences" },
      { label: "Compétences", left: "SQL + BI + base cloud", right: "Base technique faible" },
      { label: "Résultat", left: "Progression analyst plus solide", right: "Plus difficile de résoudre de vrais problèmes" },
    ],
    compareRecommendationTitle: "Recommandation",
    compareRecommendationBody:
      "Commencez avec Data Analytics Foundations, puis SQL, puis Power BI, puis les fondamentaux cloud data comme DP-900.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "Faut-il SQL pour Data Analytics ?",
        a: "Oui. Même avec des outils BI, SQL aide à comprendre, extraire, valider et préparer correctement les données.",
      },
    ],

    finalCtaTitle: "🚀 Commencez maintenant votre parcours data",
    finalCtaBody:
      "Commencez par les bases, puis construisez progressivement vos compétences SQL, BI et cloud data.",
  },
};