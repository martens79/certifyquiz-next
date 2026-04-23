import Link from "next/link";

type Locale = "it" | "en" | "es" | "fr";

type CloudQuizSlug =
  | "aws-cloud-practitioner"
  | "microsoft-azure-fundamentals"
  | "google-cloud"
  | "comptia-cloud-plus"
  | "aws-solutions-architect";

type CloudCertSlug =
  | "aws-cloud-practitioner"
  | "microsoft-azure-fundamentals"
  | "google-cloud"
  | "comptia-cloud-plus"
  | "aws-solutions-architect"
  | "ibm-cloud-v5";

export default function CloudRoadmapPage({ lang }: { lang: Locale }) {
  const t = CONTENT[lang];

  const quiz = (slug: CloudQuizSlug) => `/${lang}/quiz/${slug}`;

const cert = (slug: CloudCertSlug) => {
  if (lang === "it") return `/it/certificazioni/${slug}`;
  if (lang === "fr") return `/fr/certifications/${slug}`;
  if (lang === "es") return `/es/certificaciones/${slug}`;
  return `/certifications/${slug}`;
};


  // Category page (NO hub): path diverso per lingua
  const categoryCloud =
    lang === "en"
      ? "/categories/cloud"
      : lang === "it"
      ? "/it/categorie/cloud"
      : lang === "es"
      ? "/es/categorias/cloud"
      : "/fr/categories/cloud";

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      {/* HERO */}
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{t.title}</h1>
        <p className="mt-2 text-lg text-slate-600">{t.subtitle}</p>
        <p className="mt-5 text-slate-700 leading-relaxed">{t.intro}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={quiz("aws-cloud-practitioner")}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 transition"
          >
            {t.ctaPrimary}
          </Link>

          <Link
            href={categoryCloud}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-800 hover:bg-slate-50 transition"
          >
            {t.ctaSecondary}
          </Link>
        </div>
      </header>

      {/* ROADMAP */}
      <section className="space-y-6">
        {t.levels.map((lvl) => (
          <div
            key={lvl.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h2 className="text-xl font-bold">{lvl.title}</h2>
            <p className="mt-2 text-slate-700 leading-relaxed">{lvl.body}</p>

            {lvl.recommended?.length ? (
              <ul className="mt-3 list-disc pl-5 text-slate-700">
                {lvl.recommended.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            ) : null}

            {lvl.goal ? (
              <p className="mt-3 text-slate-600">
                <span className="font-semibold">{t.goalLabel}</span> {lvl.goal}
              </p>
            ) : null}

           {lvl.ctaQuizSlug || lvl.ctaCertSlug ? (
  <div className="mt-4 flex flex-col items-start gap-2">
    {lvl.ctaQuizSlug ? (
      <Link
        href={quiz(lvl.ctaQuizSlug)}
        className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800 transition"
      >
        {lvl.ctaPrimaryText ?? t.practiceCta}
      </Link>
    ) : null}

    {lvl.ctaCertSlug ? (
      <Link
        href={cert(lvl.ctaCertSlug)}
        className="text-sm font-medium text-blue-700 underline underline-offset-2 hover:text-blue-800"
      >
        {lvl.ctaSecondaryText ?? t.certCta}
      </Link>
    ) : null}
  </div>
) : null}
          </div>
        ))}
      </section>

      {/* SALARY */}
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

      {/* COMPARISON */}
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

      {/* FAQ */}
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

      {/* FINAL CTA */}
      <section className="mt-10 rounded-2xl border border-blue-200 bg-blue-50 p-5">
        <h2 className="text-xl font-extrabold text-slate-900">{t.finalCtaTitle}</h2>
        <p className="mt-2 text-slate-700">{t.finalCtaBody}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={quiz("aws-cloud-practitioner")}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 transition"
          >
            {t.ctaPrimary}
          </Link>
          <Link
            href={categoryCloud}
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
      ctaQuizSlug?: CloudQuizSlug;
      ctaCertSlug?: CloudCertSlug;
      ctaPrimaryText?: string;
      ctaSecondaryText?: string;
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
  title: "Cloud Certification Roadmap 2026",
  subtitle: "From cloud beginner to job-ready skills",
  intro:
    "Cloud is not just “learn AWS”. You need core concepts first, then an entry certification, then deeper architecture and operations skills. This roadmap gives you a practical order based on the certifications already available on CertifyQuiz.",

  ctaPrimary: "Start with AWS Cloud Practitioner quiz",
  ctaSecondary: "Browse cloud certifications",
  certCta: "Explore certification",

  goalLabel: "Goal:",
  practiceCta: "Practice now",

  levels: [
    {
      title: "🟢 Level 0 — No IT basics",
      body:
        "If you’re new to IT, don’t jump into cloud dashboards yet. First understand networking basics, DNS, identity, and core security concepts.",
      recommended: [
        "IT basics (devices/OS)",
        "Basic networking (IP, DNS, routing)",
        "Basic security concepts",
      ],
      goal: "Understand cloud services without guessing.",
    },
    {
      title: "🟡 Level 1 — First cloud entry point",
      body:
        "Start with a practical entry-level certification that explains cloud models, pricing, shared responsibility, and core services.",
      recommended: ["AWS Cloud Practitioner"],
      goal: "Build your first real cloud foundation.",
      ctaQuizSlug: "aws-cloud-practitioner",
      ctaCertSlug: "aws-cloud-practitioner",
      ctaPrimaryText: "Start AWS Cloud Practitioner quiz",
      ctaSecondaryText: "Explore AWS Cloud Practitioner certification",
    },
    {
      title: "🟠 Level 2 — Second vendor foundation",
      body:
        "Once your first cloud base is clear, expand into another major ecosystem to compare services, identity models, and pricing approaches.",
      recommended: ["Microsoft Azure Fundamentals"],
      goal: "Understand a second major cloud ecosystem.",
      ctaQuizSlug: "microsoft-azure-fundamentals",
      ctaCertSlug: "microsoft-azure-fundamentals",
      ctaPrimaryText: "Start Azure Fundamentals quiz",
      ctaSecondaryText: "Explore Azure Fundamentals certification",
    },
    {
      title: "🔴 Level 3 — Architecture depth",
      body:
        "Now go deeper into architecture patterns, storage decisions, IAM, resilience, networking, and cost-aware design.",
      recommended: ["AWS Solutions Architect"],
      goal: "Move from cloud basics to real architecture thinking.",
      ctaQuizSlug: "aws-solutions-architect",
      ctaCertSlug: "aws-solutions-architect",
      ctaPrimaryText: "Start AWS Solutions Architect quiz",
      ctaSecondaryText: "Explore AWS Solutions Architect certification",
    },
    {
      title: "🟣 Level 4 — Multi-vendor expansion",
      body:
        "After building depth, expand your view with another major vendor and strengthen your broader cloud understanding.",
      recommended: ["Google Cloud"],
      goal: "Build broader cloud awareness across ecosystems.",
      ctaQuizSlug: "google-cloud",
      ctaCertSlug: "google-cloud",
      ctaPrimaryText: "Start Google Cloud quiz",
      ctaSecondaryText: "Explore Google Cloud certification",
    },
    {
      title: "⚫ Level 5 — Operations & troubleshooting",
      body:
        "At this point, move toward operations, troubleshooting, governance, deployment, monitoring, and real-world maintenance.",
      recommended: ["CompTIA Cloud+"],
      goal: "Become more job-ready for cloud operations roles.",
      ctaQuizSlug: "comptia-cloud-plus",
      ctaCertSlug: "comptia-cloud-plus",
      ctaPrimaryText: "Start Cloud+ quiz",
      ctaSecondaryText: "Explore Cloud+ certification",
    },
    {
      title: "⚪ Optional track — IBM Cloud",
      body:
        "IBM Cloud can be useful as an additional ecosystem, but it should stay secondary compared to the main roadmap above.",
      recommended: ["IBM Cloud+ v5"],
      goal: "Explore a niche cloud path if relevant to your goals.",
      ctaCertSlug: "ibm-cloud-v5",
      ctaSecondaryText: "Explore IBM Cloud certification",
    },
  ],

  salaryTitle: "💰 Cloud salary outlook (2026)",
  salaryIntro:
    "Typical global ranges vary a lot depending on country, experience, and company. Use this as orientation, not as a promise.",
  salaryRanges: [
    { label: "Entry-level", range: "$55k–$80k" },
    { label: "Mid-level", range: "$85k–$120k" },
    { label: "Senior / Architect", range: "$130k+" },
  ],
  salaryDisclaimer:
    "Disclaimer: ranges vary widely. Certifications help most when combined with labs, projects, and consistent practice.",

  compareTitle: "🔍 AWS vs Azure vs Google Cloud — which one should you pick?",
  compareIntro:
    "All are valuable. The best choice depends on your market and goals. The key is to go deep in one path before spreading too wide.",
  compareLeftTitle: "One vendor (deep)",
  compareRightTitle: "Many vendors (shallow)",
  compareRows: [
    { label: "Learning speed", left: "Faster progress", right: "Slower progress" },
    { label: "Job readiness", left: "Stronger skills", right: "More confusion" },
    { label: "Best approach", left: "Pick 1 → then expand", right: "Don't start here" },
  ],
  compareRecommendationTitle: "Recommendation",
  compareRecommendationBody:
    "Start with AWS Cloud Practitioner, add Azure Fundamentals, then go deeper with architecture and operations.",

  faqTitle: "FAQ",
  faq: [
    {
      q: "Do I need networking before cloud?",
      a: "You don't need to be a network engineer, but you should understand IP, DNS, and routing basics.",
    },
    {
      q: "Should I learn AWS and Azure together?",
      a: "Not at the very start. Build a solid base first, then expand carefully.",
    },
    {
      q: "Where does Cloud+ fit?",
      a: "Cloud+ fits better after you already understand cloud fundamentals and want stronger operations skills.",
    },
    {
      q: "What matters most for getting hired?",
      a: "Certifications + labs + small practical projects like deployments, IAM setup, monitoring, and cost review.",
    },
  ],

  finalCtaTitle: "🚀 Start now (the practical way)",
  finalCtaBody:
    "Don't overthink it. Start with AWS Cloud Practitioner, then build step by step into deeper cloud skills.",
},

it: {
  title: "Roadmap Certificazioni Cloud 2026",
  subtitle: "Da principiante a competenze cloud spendibili",
  intro:
    "Cloud non significa solo “imparo AWS”. Servono prima i concetti chiave, poi una certificazione entry, poi skill più profonde su architettura e operations. Questa roadmap ti dà un ordine pratico basato sulle certificazioni già presenti su CertifyQuiz.",

  ctaPrimary: "Inizia col quiz AWS Cloud Practitioner",
  ctaSecondary: "Vedi le certificazioni Cloud",
  certCta: "Scopri la certificazione",

  goalLabel: "Obiettivo:",
  practiceCta: "Allenati ora",

  levels: [
    {
      title: "🟢 Livello 0 — Nessuna base IT",
      body:
        "Se parti da zero, non saltare subito nei pannelli cloud. Prima capisci reti base, DNS, identità e concetti essenziali di sicurezza.",
      recommended: [
        "Basi IT (dispositivi/OS)",
        "Reti base (IP, DNS, routing)",
        "Concetti base di sicurezza",
      ],
      goal: "Capire i servizi cloud senza andare a tentativi.",
    },
    {
      title: "🟡 Livello 1 — Primo ingresso nel cloud",
      body:
        "Parti con una certificazione entry pratica che spiega modelli cloud, pricing, shared responsibility e servizi principali.",
      recommended: ["AWS Cloud Practitioner"],
      goal: "Costruire la tua prima vera base cloud.",
      ctaQuizSlug: "aws-cloud-practitioner",
      ctaCertSlug: "aws-cloud-practitioner",
      ctaPrimaryText: "Inizia il quiz AWS Cloud Practitioner",
      ctaSecondaryText: "Scopri la certificazione AWS Cloud Practitioner",
    },
    {
      title: "🟠 Livello 2 — Seconda base vendor",
      body:
        "Quando la prima base cloud è chiara, espanditi su un altro ecosistema importante per confrontare servizi, identità e logiche di pricing.",
      recommended: ["Microsoft Azure Fundamentals"],
      goal: "Capire un secondo grande ecosistema cloud.",
      ctaQuizSlug: "microsoft-azure-fundamentals",
      ctaCertSlug: "microsoft-azure-fundamentals",
      ctaPrimaryText: "Inizia il quiz Azure Fundamentals",
      ctaSecondaryText: "Scopri la certificazione Azure Fundamentals",
    },
    {
      title: "🔴 Livello 3 — Architettura più profonda",
      body:
        "Ora vai più a fondo su pattern architetturali, storage, IAM, resilienza, networking e progettazione attenta ai costi.",
      recommended: ["AWS Solutions Architect"],
      goal: "Passare dalle basi cloud a un vero ragionamento architetturale.",
      ctaQuizSlug: "aws-solutions-architect",
      ctaCertSlug: "aws-solutions-architect",
      ctaPrimaryText: "Inizia il quiz AWS Solutions Architect",
      ctaSecondaryText: "Scopri la certificazione AWS Solutions Architect",
    },
    {
      title: "🟣 Livello 4 — Espansione multi-vendor",
      body:
        "Dopo aver costruito profondità, allarga la visione con un altro vendor importante e rafforza la comprensione generale del cloud.",
      recommended: ["Google Cloud"],
      goal: "Costruire una visione cloud più ampia tra ecosistemi diversi.",
      ctaQuizSlug: "google-cloud",
      ctaCertSlug: "google-cloud",
      ctaPrimaryText: "Inizia il quiz Google Cloud",
      ctaSecondaryText: "Scopri la certificazione Google Cloud",
    },
    {
      title: "⚫ Livello 5 — Operations & troubleshooting",
      body:
        "A questo punto passa su operations, troubleshooting, governance, deploy, monitoring e manutenzione reale.",
      recommended: ["CompTIA Cloud+"],
      goal: "Diventare più job-ready per ruoli cloud operations.",
      ctaQuizSlug: "comptia-cloud-plus",
      ctaCertSlug: "comptia-cloud-plus",
      ctaPrimaryText: "Inizia il quiz Cloud+",
      ctaSecondaryText: "Scopri la certificazione Cloud+",
    },
    {
      title: "⚪ Track opzionale — IBM Cloud",
      body:
        "IBM Cloud può essere utile come ecosistema aggiuntivo, ma deve restare secondario rispetto alla roadmap principale qui sopra.",
      recommended: ["IBM Cloud+ v5"],
      goal: "Esplorare un percorso cloud più di nicchia se utile ai tuoi obiettivi.",
      ctaCertSlug: "ibm-cloud-v5",
      ctaSecondaryText: "Scopri la certificazione IBM Cloud",
    },
  ],

  salaryTitle: "💰 Salary outlook Cloud (2026)",
  salaryIntro:
    "I range globali cambiano molto in base a paese, esperienza e azienda. Usali come orientamento, non come promessa.",
  salaryRanges: [
    { label: "Entry-level", range: "$55k–$80k" },
    { label: "Mid-level", range: "$85k–$120k" },
    { label: "Senior / Architect", range: "$130k+" },
  ],
  salaryDisclaimer:
    "Nota: i range variano molto. Le certificazioni aiutano di più se combinate con lab, progetti e pratica costante.",

  compareTitle: "🔍 AWS vs Azure vs Google Cloud — quale scegliere?",
  compareIntro:
    "Tutti sono validi. La scelta migliore dipende dal mercato e dai tuoi obiettivi. La chiave è andare in profondità su un percorso prima di allargarti troppo.",
  compareLeftTitle: "Un vendor (profondo)",
  compareRightTitle: "Tanti vendor (superficiale)",
  compareRows: [
    { label: "Velocità", left: "Progressi più rapidi", right: "Progressi più lenti" },
    { label: "Job readiness", left: "Skill più forti", right: "Più confusione" },
    { label: "Approccio migliore", left: "1 vendor → poi espandi", right: "Non partire così" },
  ],
  compareRecommendationTitle: "Consiglio pratico",
  compareRecommendationBody:
    "Parti da AWS Cloud Practitioner, aggiungi Azure Fundamentals, poi vai più a fondo con architettura e operations.",

  faqTitle: "FAQ",
  faq: [
    {
      q: "Serve networking prima del cloud?",
      a: "Non devi essere un network engineer, ma dovresti capire IP, DNS e routing di base.",
    },
    {
      q: "Ha senso fare AWS e Azure insieme?",
      a: "Non subito. Prima costruisci una base solida, poi espandi con criterio.",
    },
    {
      q: "Dove si colloca Cloud+?",
      a: "Cloud+ ha più senso dopo che hai già capito bene i fondamenti cloud e vuoi rafforzare la parte operations.",
    },
    {
      q: "Cosa conta di più per essere assunto?",
      a: "Certificazioni + lab + piccoli progetti pratici come deploy, IAM, monitoring e revisione dei costi.",
    },
  ],

  finalCtaTitle: "🚀 Parti adesso (in modo pratico)",
  finalCtaBody:
    "Non pensarci troppo. Parti da AWS Cloud Practitioner, poi costruisci passo dopo passo competenze cloud più profonde.",
},

es: {
  title: "Ruta de Certificaciones Cloud 2026",
  subtitle: "De principiante a habilidades cloud útiles",
  intro:
    "Cloud no es solo “aprender AWS”. Primero necesitas conceptos clave, luego una certificación de entrada y después habilidades más profundas de arquitectura y operaciones. Esta ruta te da un orden práctico basado en las certificaciones ya presentes en CertifyQuiz.",

  ctaPrimary: "Empezar con el quiz AWS Cloud Practitioner",
  ctaSecondary: "Ver certificaciones Cloud",
  certCta: "Ver certificación",

  goalLabel: "Objetivo:",
  practiceCta: "Practicar ahora",

  levels: [
    {
      title: "🟢 Nivel 0 — Sin base IT",
      body:
        "Si empiezas de cero, no entres directamente en paneles cloud. Primero entiende redes básicas, DNS, identidad y conceptos esenciales de seguridad.",
      recommended: [
        "Fundamentos IT",
        "Redes básicas (IP, DNS, routing)",
        "Conceptos básicos de seguridad",
      ],
      goal: "Entender los servicios cloud sin ir a ciegas.",
    },
    {
      title: "🟡 Nivel 1 — Primera entrada al cloud",
      body:
        "Empieza con una certificación de entrada práctica que explique modelos cloud, pricing, responsabilidad compartida y servicios principales.",
      recommended: ["AWS Cloud Practitioner"],
      goal: "Construir tu primera base cloud real.",
      ctaQuizSlug: "aws-cloud-practitioner",
      ctaCertSlug: "aws-cloud-practitioner",
      ctaPrimaryText: "Empezar quiz AWS Cloud Practitioner",
      ctaSecondaryText: "Ver certificación AWS Cloud Practitioner",
    },
    {
      title: "🟠 Nivel 2 — Segunda base de vendor",
      body:
        "Cuando la primera base cloud esté clara, amplía hacia otro gran ecosistema para comparar servicios, identidad y enfoques de pricing.",
      recommended: ["Microsoft Azure Fundamentals"],
      goal: "Entender un segundo gran ecosistema cloud.",
      ctaQuizSlug: "microsoft-azure-fundamentals",
      ctaCertSlug: "microsoft-azure-fundamentals",
      ctaPrimaryText: "Empezar quiz Azure Fundamentals",
      ctaSecondaryText: "Ver certificación Azure Fundamentals",
    },
    {
      title: "🔴 Nivel 3 — Más profundidad en arquitectura",
      body:
        "Ahora profundiza en patrones de arquitectura, storage, IAM, resiliencia, networking y diseño atento a costes.",
      recommended: ["AWS Solutions Architect"],
      goal: "Pasar de bases cloud a una visión real de arquitectura.",
      ctaQuizSlug: "aws-solutions-architect",
      ctaCertSlug: "aws-solutions-architect",
      ctaPrimaryText: "Empezar quiz AWS Solutions Architect",
      ctaSecondaryText: "Ver certificación AWS Solutions Architect",
    },
    {
      title: "🟣 Nivel 4 — Expansión multi-vendor",
      body:
        "Después de construir profundidad, amplía tu visión con otro vendor importante y refuerza tu comprensión global del cloud.",
      recommended: ["Google Cloud"],
      goal: "Construir una visión cloud más amplia entre ecosistemas.",
      ctaQuizSlug: "google-cloud",
      ctaCertSlug: "google-cloud",
      ctaPrimaryText: "Empezar quiz Google Cloud",
      ctaSecondaryText: "Ver certificación Google Cloud",
    },
    {
      title: "⚫ Nivel 5 — Operaciones y troubleshooting",
      body:
        "En este punto pasa a operaciones, troubleshooting, governance, despliegue, monitorización y mantenimiento real.",
      recommended: ["CompTIA Cloud+"],
      goal: "Estar más preparado para roles de cloud operations.",
      ctaQuizSlug: "comptia-cloud-plus",
      ctaCertSlug: "comptia-cloud-plus",
      ctaPrimaryText: "Empezar quiz Cloud+",
      ctaSecondaryText: "Ver certificación Cloud+",
    },
    {
      title: "⚪ Track opcional — IBM Cloud",
      body:
        "IBM Cloud puede ser útil como ecosistema adicional, pero debe quedarse como track secundario frente a la ruta principal.",
      recommended: ["IBM Cloud+ v5"],
      goal: "Explorar un camino cloud más de nicho si encaja con tus objetivos.",
      ctaCertSlug: "ibm-cloud-v5",
      ctaSecondaryText: "Ver certificación IBM Cloud",
    },
  ],

  salaryTitle: "💰 Salary outlook Cloud (2026)",
  salaryIntro:
    "Los rangos globales cambian mucho según país, experiencia y empresa. Úsalos como orientación, no como promesa.",
  salaryRanges: [
    { label: "Entry-level", range: "$55k–$80k" },
    { label: "Mid-level", range: "$85k–$120k" },
    { label: "Senior / Architect", range: "$130k+" },
  ],
  salaryDisclaimer:
    "Aviso: los rangos varían mucho. Las certificaciones ayudan más cuando se combinan con labs, proyectos y práctica constante.",

  compareTitle: "🔍 AWS vs Azure vs Google Cloud — ¿cuál elegir?",
  compareIntro:
    "Todos son valiosos. La mejor elección depende del mercado y de tus objetivos. La clave es profundizar primero en un camino antes de abrir demasiado el foco.",
  compareLeftTitle: "Un vendor (profundo)",
  compareRightTitle: "Muchos vendors (superficial)",
  compareRows: [
    { label: "Velocidad", left: "Progreso más rápido", right: "Progreso más lento" },
    { label: "Preparación laboral", left: "Habilidades más fuertes", right: "Más confusión" },
    { label: "Mejor enfoque", left: "1 vendor → luego expandir", right: "No empezar así" },
  ],
  compareRecommendationTitle: "Recomendación",
  compareRecommendationBody:
    "Empieza con AWS Cloud Practitioner, añade Azure Fundamentals y luego profundiza con arquitectura y operaciones.",

  faqTitle: "FAQ",
  faq: [
    {
      q: "¿Necesito redes antes de cloud?",
      a: "No necesitas ser experto, pero sí entender IP, DNS y routing básicos.",
    },
    {
      q: "¿Tiene sentido hacer AWS y Azure al mismo tiempo?",
      a: "No al principio. Primero construye una base sólida y luego amplía con criterio.",
    },
    {
      q: "¿Dónde encaja Cloud+?",
      a: "Cloud+ encaja mejor después de que ya entiendas bien los fundamentos cloud y quieras reforzar la parte de operaciones.",
    },
    {
      q: "¿Qué importa más para que te contraten?",
      a: "Certificaciones + labs + pequeños proyectos prácticos como despliegues, IAM, monitorización y revisión de costes.",
    },
  ],

  finalCtaTitle: "🚀 Empieza ahora (de forma práctica)",
  finalCtaBody:
    "No lo pienses demasiado. Empieza con AWS Cloud Practitioner y construye paso a paso habilidades cloud más profundas.",
},

fr: {
  title: "Parcours Certifications Cloud 2026",
  subtitle: "De débutant à des compétences cloud utiles",
  intro:
    "Le cloud n’est pas seulement “apprendre AWS”. Il faut d’abord les concepts clés, puis une certification d’entrée, puis des compétences plus profondes en architecture et operations. Ce parcours donne un ordre pratique basé sur les certifications déjà présentes sur CertifyQuiz.",

  ctaPrimary: "Commencer avec le quiz AWS Cloud Practitioner",
  ctaSecondary: "Voir les certifications Cloud",
  certCta: "Voir la certification",

  goalLabel: "Objectif :",
  practiceCta: "S’entraîner",

  levels: [
    {
      title: "🟢 Niveau 0 — Aucune base IT",
      body:
        "Si vous partez de zéro, n’entrez pas tout de suite dans les consoles cloud. Comprenez d’abord le réseau de base, DNS, l’identité et les concepts essentiels de sécurité.",
      recommended: [
        "Fondamentaux IT",
        "Réseau de base (IP, DNS, routage)",
        "Sécurité de base",
      ],
      goal: "Comprendre les services cloud sans avancer au hasard.",
    },
    {
      title: "🟡 Niveau 1 — Première entrée dans le cloud",
      body:
        "Commencez par une certification d’entrée pratique qui explique les modèles cloud, le pricing, la responsabilité partagée et les services principaux.",
      recommended: ["AWS Cloud Practitioner"],
      goal: "Construire votre première vraie base cloud.",
      ctaQuizSlug: "aws-cloud-practitioner",
      ctaCertSlug: "aws-cloud-practitioner",
      ctaPrimaryText: "Commencer le quiz AWS Cloud Practitioner",
      ctaSecondaryText: "Voir la certification AWS Cloud Practitioner",
    },
    {
      title: "🟠 Niveau 2 — Deuxième base vendor",
      body:
        "Quand votre première base cloud est claire, élargissez vers un autre grand écosystème pour comparer services, identité et logique de pricing.",
      recommended: ["Microsoft Azure Fundamentals"],
      goal: "Comprendre un deuxième grand écosystème cloud.",
      ctaQuizSlug: "microsoft-azure-fundamentals",
      ctaCertSlug: "microsoft-azure-fundamentals",
      ctaPrimaryText: "Commencer le quiz Azure Fundamentals",
      ctaSecondaryText: "Voir la certification Azure Fundamentals",
    },
    {
      title: "🔴 Niveau 3 — Plus de profondeur en architecture",
      body:
        "Approfondissez maintenant les patterns d’architecture, le storage, IAM, la résilience, le réseau et la conception attentive aux coûts.",
      recommended: ["AWS Solutions Architect"],
      goal: "Passer des bases cloud à une vraie logique d’architecture.",
      ctaQuizSlug: "aws-solutions-architect",
      ctaCertSlug: "aws-solutions-architect",
      ctaPrimaryText: "Commencer le quiz AWS Solutions Architect",
      ctaSecondaryText: "Voir la certification AWS Solutions Architect",
    },
    {
      title: "🟣 Niveau 4 — Expansion multi-vendor",
      body:
        "Après avoir construit de la profondeur, élargissez votre vision avec un autre vendor important et renforcez votre compréhension globale du cloud.",
      recommended: ["Google Cloud"],
      goal: "Construire une vision cloud plus large entre plusieurs écosystèmes.",
      ctaQuizSlug: "google-cloud",
      ctaCertSlug: "google-cloud",
      ctaPrimaryText: "Commencer le quiz Google Cloud",
      ctaSecondaryText: "Voir la certification Google Cloud",
    },
    {
      title: "⚫ Niveau 5 — Operations et troubleshooting",
      body:
        "À ce stade, passez vers les operations, le troubleshooting, la gouvernance, le déploiement, le monitoring et la maintenance réelle.",
      recommended: ["CompTIA Cloud+"],
      goal: "Être plus prêt pour des rôles cloud operations.",
      ctaQuizSlug: "comptia-cloud-plus",
      ctaCertSlug: "comptia-cloud-plus",
      ctaPrimaryText: "Commencer le quiz Cloud+",
      ctaSecondaryText: "Voir la certification Cloud+",
    },
    {
      title: "⚪ Track optionnel — IBM Cloud",
      body:
        "IBM Cloud peut être utile comme écosystème supplémentaire, mais il doit rester secondaire par rapport au parcours principal.",
      recommended: ["IBM Cloud+ v5"],
      goal: "Explorer une voie cloud plus niche si elle correspond à vos objectifs.",
      ctaCertSlug: "ibm-cloud-v5",
      ctaSecondaryText: "Voir la certification IBM Cloud",
    },
  ],

  salaryTitle: "💰 Salary outlook Cloud (2026)",
  salaryIntro:
    "Les fourchettes mondiales varient beaucoup selon le pays, l’expérience et l’entreprise. Utilisez-les comme repère, pas comme promesse.",
  salaryRanges: [
    { label: "Entry-level", range: "$55k–$80k" },
    { label: "Mid-level", range: "$85k–$120k" },
    { label: "Senior / Architect", range: "$130k+" },
  ],
  salaryDisclaimer:
    "Note : les fourchettes varient beaucoup. Les certifications aident surtout lorsqu’elles sont combinées avec des labs, des projets et une pratique régulière.",

  compareTitle: "🔍 AWS vs Azure vs Google Cloud — lequel choisir ?",
  compareIntro:
    "Tous sont utiles. Le meilleur choix dépend du marché et de vos objectifs. La clé est d’approfondir un parcours avant de trop vous disperser.",
  compareLeftTitle: "Un vendor (profond)",
  compareRightTitle: "Plusieurs vendors (superficiel)",
  compareRows: [
    { label: "Vitesse", left: "Progression plus rapide", right: "Progression plus lente" },
    { label: "Préparation à l’emploi", left: "Compétences plus fortes", right: "Plus de confusion" },
    { label: "Meilleure approche", left: "1 vendor → puis élargir", right: "Ne pas commencer ainsi" },
  ],
  compareRecommendationTitle: "Recommandation",
  compareRecommendationBody:
    "Commencez par AWS Cloud Practitioner, ajoutez Azure Fundamentals, puis approfondissez avec architecture et operations.",

  faqTitle: "FAQ",
  faq: [
    {
      q: "Faut-il le réseau avant le cloud ?",
      a: "Pas besoin d’être expert, mais il faut comprendre IP, DNS et le routage de base.",
    },
    {
      q: "Est-ce utile de faire AWS et Azure en même temps ?",
      a: "Pas au début. Construisez d’abord une base solide, puis élargissez avec méthode.",
    },
    {
      q: "Où se place Cloud+ ?",
      a: "Cloud+ a plus de sens après avoir bien compris les fondamentaux cloud et si vous voulez renforcer la partie operations.",
    },
    {
      q: "Qu’est-ce qui compte le plus pour être recruté ?",
      a: "Certifications + labs + petits projets pratiques comme déploiements, IAM, monitoring et revue des coûts.",
    },
  ],

  finalCtaTitle: "🚀 Commencez maintenant (de façon pratique)",
  finalCtaBody:
    "Ne réfléchissez pas trop. Commencez par AWS Cloud Practitioner puis construisez étape par étape des compétences cloud plus profondes.",
},
};