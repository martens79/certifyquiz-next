import Link from "next/link";

type Locale = "it" | "en" | "es" | "fr";

/* ----------------------------- PATH HELPERS ----------------------------- */

/** Quiz rule: ALWAYS /{lang}/quiz/... (EN included) */
const quiz = (lang: Locale, slug: string) => `/${lang}/quiz/${slug}`;

/** Certification pages are localized */
const cert = (lang: Locale, slug: string) => {
  if (lang === "it") return `/it/certificazioni/${slug}`;
  if (lang === "fr") return `/fr/certifications/${slug}`;
  if (lang === "es") return `/es/certificaciones/${slug}`;
  return `/certifications/${slug}`; // EN root
};

function categoryPathAI(lang: Locale) {
  // Category slugs based on your CAT_KEY_TO_SLUG mapping
  const slugByLang: Record<Locale, string> = {
    it: "intelligenza-artificiale",
    en: "artificial-intelligence",
    fr: "intelligence-artificielle",
    es: "inteligencia-artificial",
  };

  const seg =
    lang === "it" ? "categorie" : lang === "es" ? "categorias" : "categories";

  // SEO rule: EN root has NO /en prefix for pages like categories
  const prefix = lang === "en" ? "" : `/${lang}`;
  return `${prefix}/${seg}/${slugByLang[lang]}`;
}

/* ----------------------------------------------------------------------- */

export default function AIRoadmapPage({ lang }: { lang: Locale }) {
  const t = CONTENT[lang];
  const categoryAI = categoryPathAI(lang);

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      {/* HERO */}
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          {t.title}
        </h1>
        <p className="mt-2 text-lg text-slate-600">{t.subtitle}</p>
        <p className="mt-5 text-slate-700 leading-relaxed">{t.intro}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={quiz(lang, "ai-foundations")}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 transition"
          >
            {t.ctaPrimary}
          </Link>

          <Link
            href={categoryAI}
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

            {/* Level CTA: primary quiz + secondary certification link */}
            {lvl.ctaQuizSlug || lvl.ctaCertSlug ? (
              <div className="mt-4 flex flex-col items-start gap-2">
                {lvl.ctaQuizSlug ? (
                  <Link
                    href={quiz(lang, lvl.ctaQuizSlug)}
                    className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800 transition"
                  >
                    {lvl.ctaPrimaryText ?? t.practiceCta}
                  </Link>
                ) : null}

                {lvl.ctaCertSlug ? (
                  <Link
                    href={cert(lang, lvl.ctaCertSlug)}
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
        <h2 className="text-xl font-extrabold text-slate-900">
          {t.finalCtaTitle}
        </h2>
        <p className="mt-2 text-slate-700">{t.finalCtaBody}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={quiz(lang, "ai-fundamentals")}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 transition"
          >
            {t.ctaPrimary}
          </Link>
          <Link
            href={categoryAI}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-800 hover:bg-slate-50 transition"
          >
            {t.ctaSecondary}
          </Link>
        </div>
      </section>
    </main>
  );
}

/* ----------------------------- CONTENT ----------------------------- */

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
      ctaQuizSlug?: string;
      ctaCertSlug?: string;
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
  title: "AI Certification Roadmap 2026",
  subtitle: "Start simple, build real AI skills",
  intro:
    "AI looks overwhelming because people often begin with tools and skip the fundamentals. This roadmap keeps it practical: build a clear foundation, move into your first real certification, then progress toward hands-on frameworks and future cloud AI paths.",

  ctaPrimary: "Start AI Fundamentals quiz",
  ctaSecondary: "Browse AI category",
  certCta: "Explore certification",

  goalLabel: "Goal:",
  practiceCta: "Open now",

 levels: [
  {
    title: "🟢 Level 1 — AI Foundations",
    body: "Start with a solid internal foundation of AI concepts before touching vendor certifications.",
    recommended: ["AI Foundations"],
    goal: "Build a clear understanding of AI basics and terminology.",
    ctaQuizSlug: "ai-foundations",
    ctaPrimaryText: "Start AI Foundations",
  },
  {
    title: "🟡 Level 2 — Microsoft AI Fundamentals",
    body: "Your first real certification step. Covers practical AI concepts in business and cloud environments.",
    recommended: ["Microsoft AI Fundamentals"],
    goal: "Understand how AI is applied in real-world cloud scenarios.",
    ctaQuizSlug: "microsoft-ai",
    ctaCertSlug: "microsoft-ai",
  },
  {
    title: "🟠 Level 3 — AWS AI Practitioner",
    body: "Expand your knowledge into AWS AI services and real use cases.",
    recommended: ["AWS AI Practitioner"],
    goal: "Learn how AI services are used in AWS environments.",
    ctaQuizSlug: "aws-ai-practitioner",
    ctaCertSlug: "aws-ai-practitioner",
  },
  {
    title: "🔴 Level 4 — Google Cloud Digital Leader",
    body: "Understand AI in enterprise and business decision contexts.",
    recommended: ["Google Cloud Digital Leader"],
    goal: "Gain a high-level understanding of AI in cloud ecosystems.",
    ctaQuizSlug: "google-cloud-digital-leader",
    ctaCertSlug: "google-cloud-digital-leader",
  },
  {
    title: "⚫ Level 5 — TensorFlow (hands-on)",
    body: "Move into real AI practice using frameworks and workflows.",
    recommended: ["TensorFlow"],
    goal: "Start building real AI logic and models.",
    ctaQuizSlug: "tensorflow",
    ctaCertSlug: "tensorflow",
  },
],

  salaryTitle: "💰 AI salary outlook (2026)",
  salaryIntro:
    "Typical global ranges vary a lot depending on country, company, and seniority. Use them as orientation, not as a promise.",
  salaryRanges: [
    { label: "Entry-level", range: "$55k–$85k" },
    { label: "Mid-level", range: "$90k–$130k" },
    { label: "Senior / Specialist", range: "$140k+" },
  ],
  salaryDisclaimer:
    "Disclaimer: ranges vary widely. Certifications help most when combined with real projects and consistent practice.",

  compareTitle: "🔍 Fundamentals vs Framework — what should you do first?",
  compareIntro:
    "Many people jump straight into frameworks and get lost. A fundamentals baseline makes everything clearer and faster afterwards.",
  compareLeftTitle: "Fundamentals first",
  compareRightTitle: "Framework first",
  compareRows: [
    {
      label: "Speed",
      left: "Faster long-term",
      right: "Fast start, slower later",
    },
    {
      label: "Clarity",
      left: "Clear mental model",
      right: "Confusing concepts",
    },
    {
      label: "Outcome",
      left: "Stable skills",
      right: "Tool-dependent knowledge",
    },
  ],
  compareRecommendationTitle: "Recommendation",
  compareRecommendationBody:
    "Start with AI Fundamentals, then move to Microsoft AI Fundamentals, and only after that go deeper with TensorFlow.",

  faqTitle: "FAQ",
  faq: [
    {
      q: "Do I need math to start AI?",
      a: "Not much at first. Start with concepts and practice. Add more math gradually when you need it.",
    },
    {
      q: "What should I do first on CertifyQuiz?",
      a: "Start with the AI Fundamentals quiz, then continue with Microsoft AI Fundamentals before moving to TensorFlow.",
    },
    {
      q: "Can certifications alone get me a job?",
      a: "They help, but projects matter too. Use certifications to structure your learning, then build small practical projects.",
    },
  ],

  finalCtaTitle: "🚀 Start now (no overthinking)",
  finalCtaBody:
    "Open the AI Fundamentals quiz and build your base first. Then move into Microsoft AI Fundamentals and TensorFlow step by step.",
},

it: {
  title: "Roadmap Certificazioni AI 2026",
  subtitle: "Parti semplice, costruisci competenze AI reali",
  intro:
    "L’AI sembra complicata perché molti iniziano dai tool e saltano le basi. Questa roadmap resta pratica: costruisci prima una base chiara, poi passa alla prima certificazione reale, quindi alla pratica con framework e infine ai futuri percorsi cloud AI.",

  ctaPrimary: "Inizia col quiz AI Fundamentals",
  ctaSecondary: "Vai alla categoria AI",
  certCta: "Scopri la certificazione",

  goalLabel: "Obiettivo:",
  practiceCta: "Apri ora",

  levels: [
  {
    title: "🟢 Livello 1 — AI Foundations",
    body: "Parti con una base solida sui concetti fondamentali dell’AI prima delle certificazioni vendor.",
    recommended: ["AI Foundations"],
    goal: "Capire chiaramente basi e terminologia dell’intelligenza artificiale.",
    ctaQuizSlug: "ai-foundations",
    ctaPrimaryText: "Inizia AI Foundations",
  },
  {
    title: "🟡 Livello 2 — Microsoft AI Fundamentals",
    body: "Il primo vero passo certificativo. Introduce l’AI in contesti cloud e business.",
    recommended: ["Microsoft AI Fundamentals"],
    goal: "Capire come l’AI viene applicata in scenari reali.",
    ctaQuizSlug: "microsoft-ai",
    ctaCertSlug: "microsoft-ai",
  },
  {
    title: "🟠 Livello 3 — AWS AI Practitioner",
    body: "Espandi le competenze verso i servizi AI di AWS e casi reali.",
    recommended: ["AWS AI Practitioner"],
    goal: "Comprendere l’uso dell’AI nei servizi AWS.",
    ctaQuizSlug: "aws-ai-practitioner",
    ctaCertSlug: "aws-ai-practitioner",
  },
  {
    title: "🔴 Livello 4 — Google Cloud Digital Leader",
    body: "Capisci l’AI dal punto di vista business e decisionale.",
    recommended: ["Google Cloud Digital Leader"],
    goal: "Avere una visione completa dell’AI nel cloud.",
    ctaQuizSlug: "google-cloud-digital-leader",
    ctaCertSlug: "google-cloud-digital-leader",
  },
  {
    title: "⚫ Livello 5 — TensorFlow (pratica reale)",
    body: "Passa alla pratica con framework e workflow reali.",
    recommended: ["TensorFlow"],
    goal: "Costruire logiche e modelli AI concreti.",
    ctaQuizSlug: "tensorflow",
    ctaCertSlug: "tensorflow",
  },
],

  salaryTitle: "💰 Salary outlook AI (2026)",
  salaryIntro:
    "I range globali cambiano molto in base a paese, azienda e seniority. Usali come orientamento, non come promessa.",
  salaryRanges: [
    { label: "Entry-level", range: "$55k–$85k" },
    { label: "Mid-level", range: "$90k–$130k" },
    { label: "Senior / Specialist", range: "$140k+" },
  ],
  salaryDisclaimer:
    "Nota: i range variano molto. Le certificazioni contano di più quando sono accompagnate da progetti reali e pratica costante.",

  compareTitle: "🔍 Fundamentals vs Framework — cosa fare prima?",
  compareIntro:
    "Molti saltano subito sui framework e si perdono. Una base fundamentals rende tutto più chiaro e veloce dopo.",
  compareLeftTitle: "Fundamentals prima",
  compareRightTitle: "Framework prima",
  compareRows: [
    {
      label: "Velocità",
      left: "Più veloce nel lungo periodo",
      right: "Partenza veloce, poi rallenti",
    },
    {
      label: "Chiarezza",
      left: "Modello mentale chiaro",
      right: "Concetti confusi",
    },
    {
      label: "Risultato",
      left: "Skill stabili",
      right: "Conoscenza dipendente dal tool",
    },
  ],
  compareRecommendationTitle: "Consiglio pratico",
  compareRecommendationBody:
    "Parti da AI Fundamentals, poi passa a Microsoft AI Fundamentals e solo dopo approfondisci con TensorFlow.",

  faqTitle: "FAQ",
  faq: [
    {
      q: "Serve matematica per iniziare?",
      a: "Poca all’inizio. Parti da concetti e pratica, poi aggiungi più matematica gradualmente quando serve.",
    },
    {
      q: "Da dove partire su CertifyQuiz?",
      a: "Inizia dal quiz AI Fundamentals, poi continua con Microsoft AI Fundamentals prima di passare a TensorFlow.",
    },
    {
      q: "Bastano le certificazioni per lavorare?",
      a: "Aiutano, ma contano anche i progetti. Usa le certificazioni per strutturare lo studio e poi crea piccoli progetti pratici.",
    },
  ],

  finalCtaTitle: "🚀 Parti adesso (senza overthinking)",
  finalCtaBody:
    "Apri il quiz AI Fundamentals e costruisci prima la base. Poi passa a Microsoft AI Fundamentals e TensorFlow un passo alla volta.",
},

es: {
  title: "Ruta de Certificaciones IA 2026",
  subtitle: "Empieza simple, construye habilidades reales",
  intro:
    "La IA parece complicada porque muchos empiezan por las herramientas y saltan los fundamentos. Esta ruta sigue un enfoque práctico: primero una base clara, luego la primera certificación real, después la práctica con frameworks y más adelante los caminos cloud AI.",

  ctaPrimary: "Empezar con el quiz AI Fundamentals",
  ctaSecondary: "Ver la categoría IA",
  certCta: "Ver certificación",

  goalLabel: "Objetivo:",
  practiceCta: "Abrir ahora",

  levels: [
  {
    title: "🟢 Nivel 1 — AI Foundations",
    body: "Empieza con una base sólida de conceptos de IA antes de pasar a certificaciones.",
    recommended: ["AI Foundations"],
    goal: "Entender claramente los fundamentos y la terminología.",
    ctaQuizSlug: "ai-foundations",
    ctaPrimaryText: "Empezar AI Foundations",
  },
  {
    title: "🟡 Nivel 2 — Microsoft AI Fundamentals",
    body: "Primer paso real de certificación en IA aplicada al cloud.",
    recommended: ["Microsoft AI Fundamentals"],
    goal: "Entender cómo se aplica la IA en escenarios reales.",
    ctaQuizSlug: "microsoft-ai",
    ctaCertSlug: "microsoft-ai",
  },
  {
    title: "🟠 Nivel 3 — AWS AI Practitioner",
    body: "Amplía tu conocimiento hacia servicios AI en AWS.",
    recommended: ["AWS AI Practitioner"],
    goal: "Comprender el uso de IA en AWS.",
    ctaQuizSlug: "aws-ai-practitioner",
    ctaCertSlug: "aws-ai-practitioner",
  },
  {
    title: "🔴 Nivel 4 — Google Cloud Digital Leader",
    body: "Visión empresarial y estratégica de la IA.",
    recommended: ["Google Cloud Digital Leader"],
    goal: "Comprender la IA en ecosistemas cloud.",
    ctaQuizSlug: "google-cloud-digital-leader",
    ctaCertSlug: "google-cloud-digital-leader",
  },
  {
    title: "⚫ Nivel 5 — TensorFlow (práctica)",
    body: "Empieza con frameworks reales y workflows.",
    recommended: ["TensorFlow"],
    goal: "Construir modelos AI reales.",
    ctaQuizSlug: "tensorflow",
    ctaCertSlug: "tensorflow",
  },
],

  salaryTitle: "💰 Salary outlook IA (2026)",
  salaryIntro:
    "Los rangos globales varían mucho según país, empresa y seniority. Úsalos como orientación, no como promesa.",
  salaryRanges: [
    { label: "Entry-level", range: "$55k–$85k" },
    { label: "Mid-level", range: "$90k–$130k" },
    { label: "Senior / Specialist", range: "$140k+" },
  ],
  salaryDisclaimer:
    "Aviso: los rangos varían bastante. Las certificaciones ayudan más cuando se combinan con proyectos reales y práctica constante.",

  compareTitle: "🔍 Fundamentals vs Framework — ¿qué hacer primero?",
  compareIntro:
    "Mucha gente salta directamente a frameworks y se pierde. Una base fundamentals hace que todo sea más claro y rápido después.",
  compareLeftTitle: "Fundamentals primero",
  compareRightTitle: "Framework primero",
  compareRows: [
    {
      label: "Velocidad",
      left: "Más rápido a largo plazo",
      right: "Empiezas rápido y luego te frenas",
    },
    {
      label: "Claridad",
      left: "Modelo mental claro",
      right: "Conceptos confusos",
    },
    {
      label: "Resultado",
      left: "Habilidades estables",
      right: "Conocimiento dependiente de la herramienta",
    },
  ],
  compareRecommendationTitle: "Recomendación",
  compareRecommendationBody:
    "Empieza con AI Fundamentals, luego pasa a Microsoft AI Fundamentals y después profundiza con TensorFlow.",

  faqTitle: "FAQ",
  faq: [
    {
      q: "¿Necesito matemáticas para empezar?",
      a: "Pocas al principio. Empieza con conceptos y práctica, y añade más matemáticas poco a poco cuando haga falta.",
    },
    {
      q: "¿Por dónde empezar en CertifyQuiz?",
      a: "Empieza con el quiz AI Fundamentals, luego sigue con Microsoft AI Fundamentals antes de pasar a TensorFlow.",
    },
    {
      q: "¿Las certificaciones bastan para conseguir trabajo?",
      a: "Ayudan, pero también cuentan los proyectos. Usa las certificaciones para estructurar tu estudio y luego crea pequeños proyectos prácticos.",
    },
  ],

  finalCtaTitle: "🚀 Empieza ahora (sin sobrepensar)",
  finalCtaBody:
    "Abre el quiz AI Fundamentals y construye primero la base. Luego pasa a Microsoft AI Fundamentals y TensorFlow paso a paso.",
},

fr: {
  title: "Parcours Certifications IA 2026",
  subtitle: "Commencez simple, progressez concrètement",
  intro:
    "L’IA paraît compliquée parce que beaucoup commencent par les outils et sautent les bases. Ce parcours reste pratique : d’abord une base claire, puis une première vraie certification, ensuite la pratique avec les frameworks et plus tard les parcours cloud AI.",

  ctaPrimary: "Commencer avec le quiz AI Fundamentals",
  ctaSecondary: "Voir la catégorie IA",
  certCta: "Voir la certification",

  goalLabel: "Objectif :",
  practiceCta: "Ouvrir maintenant",

  levels: [
  {
    title: "🟢 Niveau 1 — AI Foundations",
    body: "Commencez avec une base solide des concepts IA avant les certifications.",
    recommended: ["AI Foundations"],
    goal: "Comprendre les bases et la terminologie.",
    ctaQuizSlug: "ai-foundations",
    ctaPrimaryText: "Commencer AI Foundations",
  },
  {
    title: "🟡 Niveau 2 — Microsoft AI Fundamentals",
    body: "Premier vrai pas dans les certifications IA.",
    recommended: ["Microsoft AI Fundamentals"],
    goal: "Comprendre l’application de l’IA en environnement cloud.",
    ctaQuizSlug: "microsoft-ai",
    ctaCertSlug: "microsoft-ai",
  },
  {
    title: "🟠 Niveau 3 — AWS AI Practitioner",
    body: "Approfondissez avec les services AI d’AWS.",
    recommended: ["AWS AI Practitioner"],
    goal: "Comprendre l’IA dans AWS.",
    ctaQuizSlug: "aws-ai-practitioner",
    ctaCertSlug: "aws-ai-practitioner",
  },
  {
    title: "🔴 Niveau 4 — Google Cloud Digital Leader",
    body: "Vision business et stratégique de l’IA.",
    recommended: ["Google Cloud Digital Leader"],
    goal: "Comprendre l’IA dans le cloud.",
    ctaQuizSlug: "google-cloud-digital-leader",
    ctaCertSlug: "google-cloud-digital-leader",
  },
  {
    title: "⚫ Niveau 5 — TensorFlow (pratique)",
    body: "Passez à la pratique avec des frameworks réels.",
    recommended: ["TensorFlow"],
    goal: "Construire des modèles IA concrets.",
    ctaQuizSlug: "tensorflow",
    ctaCertSlug: "tensorflow",
  },
],

  salaryTitle: "💰 Salary outlook IA (2026)",
  salaryIntro:
    "Les fourchettes mondiales varient fortement selon le pays, l’entreprise et l’ancienneté. Utilisez-les comme repère, pas comme promesse.",
  salaryRanges: [
    { label: "Entry-level", range: "$55k–$85k" },
    { label: "Mid-level", range: "$90k–$130k" },
    { label: "Senior / Specialist", range: "$140k+" },
  ],
  salaryDisclaimer:
    "Note : les fourchettes varient beaucoup. Les certifications aident surtout lorsqu’elles sont combinées à des projets réels et à une pratique régulière.",

  compareTitle: "🔍 Fundamentals vs Framework — que faire d’abord ?",
  compareIntro:
    "Beaucoup de personnes passent directement aux frameworks et se perdent. Une base fundamentals rend tout plus clair et plus rapide ensuite.",
  compareLeftTitle: "Fundamentals d’abord",
  compareRightTitle: "Framework d’abord",
  compareRows: [
    {
      label: "Vitesse",
      left: "Plus rapide à long terme",
      right: "Départ rapide, puis ralentissement",
    },
    {
      label: "Clarté",
      left: "Modèle mental clair",
      right: "Concepts confus",
    },
    {
      label: "Résultat",
      left: "Compétences stables",
      right: "Connaissance dépendante de l’outil",
    },
  ],
  compareRecommendationTitle: "Recommandation",
  compareRecommendationBody:
    "Commencez par AI Fundamentals, puis passez à Microsoft AI Fundamentals, et seulement après approfondissez avec TensorFlow.",

  faqTitle: "FAQ",
  faq: [
    {
      q: "Faut-il des maths pour commencer ?",
      a: "Peu au début. Commencez avec les concepts et la pratique, puis ajoutez plus de maths progressivement quand c’est nécessaire.",
    },
    {
      q: "Par où commencer sur CertifyQuiz ?",
      a: "Commencez avec le quiz AI Fundamentals, puis continuez avec Microsoft AI Fundamentals avant de passer à TensorFlow.",
    },
    {
      q: "Les certifications suffisent-elles pour trouver un travail ?",
      a: "Elles aident, mais les projets comptent aussi. Utilisez les certifications pour structurer votre apprentissage puis créez de petits projets pratiques.",
    },
  ],

  finalCtaTitle: "🚀 Commencez maintenant (sans overthinking)",
  finalCtaBody:
    "Ouvrez le quiz AI Fundamentals et construisez d’abord la base. Ensuite, passez à Microsoft AI Fundamentals puis à TensorFlow étape par étape.",
},
};