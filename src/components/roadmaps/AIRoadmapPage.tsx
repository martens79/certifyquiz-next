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
      title: "🟢 Level 0 — Absolute beginner",
      body:
        "Learn what AI actually is: models, data, training vs inference, bias, overfitting, and basic evaluation. Keep it simple and practical.",
      recommended: ["AI vocabulary", "Data basics", "Evaluation basics"],
      goal: "Understand core concepts without confusion.",
    },
    {
      title: "🟡 Level 1 — Fundamentals baseline (your first milestone)",
      body:
        "Start with a structured fundamentals track. This gives you a clean map of AI concepts before moving into vendor certifications.",
      recommended: ["AI Fundamentals"],
      goal: "Build a solid mental model of AI and real-world use cases.",
      ctaQuizSlug: "ai-fundamentals",
      ctaPrimaryText: "Practice AI Fundamentals",
    },
    {
      title: "🟠 Level 2 — Microsoft AI Fundamentals",
      body:
        "This is your first real certification step. It introduces AI concepts in a practical business and cloud context and works well for beginners.",
      recommended: ["Microsoft AI Fundamentals"],
      goal: "Understand how AI is applied in real cloud environments.",
      ctaQuizSlug: "microsoft-ai-fundamentals",
      ctaCertSlug: "microsoft-ai-fundamentals",
      ctaPrimaryText: "Start Microsoft AI quiz",
      ctaSecondaryText: "Explore Microsoft AI certification",
    },
    {
      title: "🔴 Level 3 — TensorFlow (hands-on practice)",
      body:
        "Once the basics are clear, move into real framework practice. TensorFlow helps you think more like a practitioner and less like a beginner.",
      recommended: ["TensorFlow"],
      goal: "Start working with real AI workflows, patterns, and model logic.",
      ctaQuizSlug: "tensorflow",
      ctaCertSlug: "tensorflow",
      ctaPrimaryText: "Start TensorFlow quiz",
      ctaSecondaryText: "Explore TensorFlow certification",
    },
    {
      title: "⚫ Level 4 — Google AI (coming soon)",
      body:
        "This future step will expand the roadmap into Google AI certifications and practical cloud-based AI tools.",
      recommended: ["Google AI", "Vertex AI"],
      goal: "Expand into modern cloud AI ecosystems.",
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
      title: "🟢 Livello 0 — Principiante totale",
      body:
        "Impara cos’è davvero l’AI: modelli, dati, training vs inference, bias, overfitting e valutazione di base. Tutto in modo semplice e pratico.",
      recommended: ["Vocabolario AI", "Basi dati", "Basi valutazione"],
      goal: "Capire i concetti senza confusione.",
    },
    {
      title: "🟡 Livello 1 — Fundamentals baseline (prima milestone)",
      body:
        "Parti con un percorso fundamentals strutturato. Ti crea una mappa chiara dei concetti AI prima di passare alle certificazioni vendor.",
      recommended: ["AI Fundamentals"],
      goal: "Costruire un modello mentale solido dell’AI e dei suoi casi d’uso reali.",
      ctaQuizSlug: "ai-fundamentals",
      ctaPrimaryText: "Allenati con AI Fundamentals",
    },
    {
      title: "🟠 Livello 2 — Microsoft AI Fundamentals",
      body:
        "Questo è il primo vero passo certificativo. Introduce l’AI in un contesto pratico, business e cloud, ed è perfetto per chi parte da livello base.",
      recommended: ["Microsoft AI Fundamentals"],
      goal: "Capire come l’AI viene applicata in contesti cloud reali.",
      ctaQuizSlug: "microsoft-ai-fundamentals",
      ctaCertSlug: "microsoft-ai-fundamentals",
      ctaPrimaryText: "Inizia il quiz Microsoft AI",
      ctaSecondaryText: "Scopri la certificazione Microsoft AI",
    },
    {
      title: "🔴 Livello 3 — TensorFlow (pratica reale)",
      body:
        "Quando le basi sono chiare, passa alla pratica con un framework reale. TensorFlow ti aiuta a ragionare meno da principiante e più da practitioner.",
      recommended: ["TensorFlow"],
      goal: "Iniziare a lavorare con workflow AI reali, pattern e logica dei modelli.",
      ctaQuizSlug: "tensorflow",
      ctaCertSlug: "tensorflow",
      ctaPrimaryText: "Inizia il quiz TensorFlow",
      ctaSecondaryText: "Scopri la certificazione TensorFlow",
    },
    {
      title: "⚫ Livello 4 — Google AI (in arrivo)",
      body:
        "Questo step futuro allargherà la roadmap alle certificazioni Google AI e agli strumenti pratici di AI su cloud.",
      recommended: ["Google AI", "Vertex AI"],
      goal: "Espandere le competenze verso gli ecosistemi cloud AI moderni.",
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
      title: "🟢 Nivel 0 — Principiante total",
      body:
        "Aprende qué es realmente la IA: modelos, datos, entrenamiento vs inferencia, sesgo, overfitting y evaluación básica. Todo de forma simple y práctica.",
      recommended: ["Vocabulario IA", "Bases de datos", "Evaluación básica"],
      goal: "Entender los conceptos sin confusión.",
    },
    {
      title: "🟡 Nivel 1 — Fundamentals baseline (primer hito)",
      body:
        "Empieza con un camino fundamentals estructurado. Te da una base clara antes de pasar a certificaciones de vendor.",
      recommended: ["AI Fundamentals"],
      goal: "Construir un modelo mental sólido de la IA y de sus casos de uso reales.",
      ctaQuizSlug: "ai-fundamentals",
      ctaPrimaryText: "Practicar AI Fundamentals",
    },
    {
      title: "🟠 Nivel 2 — Microsoft AI Fundamentals",
      body:
        "Este es el primer paso real de certificación. Introduce la IA en un contexto práctico, empresarial y cloud, ideal para principiantes.",
      recommended: ["Microsoft AI Fundamentals"],
      goal: "Entender cómo se aplica la IA en entornos cloud reales.",
      ctaQuizSlug: "microsoft-ai-fundamentals",
      ctaCertSlug: "microsoft-ai-fundamentals",
      ctaPrimaryText: "Empezar quiz Microsoft AI",
      ctaSecondaryText: "Ver certificación Microsoft AI",
    },
    {
      title: "🔴 Nivel 3 — TensorFlow (práctica real)",
      body:
        "Cuando la base esté clara, pasa a la práctica con un framework real. TensorFlow te ayuda a pensar menos como principiante y más como practitioner.",
      recommended: ["TensorFlow"],
      goal: "Empezar a trabajar con flujos AI reales, patrones y lógica de modelos.",
      ctaQuizSlug: "tensorflow",
      ctaCertSlug: "tensorflow",
      ctaPrimaryText: "Empezar quiz TensorFlow",
      ctaSecondaryText: "Ver certificación TensorFlow",
    },
    {
      title: "⚫ Nivel 4 — Google AI (próximamente)",
      body:
        "Este paso futuro ampliará la ruta hacia certificaciones Google AI y herramientas prácticas de IA en cloud.",
      recommended: ["Google AI", "Vertex AI"],
      goal: "Expandir habilidades hacia ecosistemas cloud AI modernos.",
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
      title: "🟢 Niveau 0 — Débutant total",
      body:
        "Apprenez ce qu’est vraiment l’IA : modèles, données, entraînement vs inférence, biais, overfitting et évaluation de base. Le tout de façon simple et pratique.",
      recommended: ["Vocabulaire IA", "Bases des données", "Évaluation de base"],
      goal: "Comprendre les concepts sans confusion.",
    },
    {
      title: "🟡 Niveau 1 — Fundamentals baseline (premier jalon)",
      body:
        "Commencez par un parcours fundamentals structuré. Il vous donne une base claire avant de passer aux certifications vendor.",
      recommended: ["AI Fundamentals"],
      goal: "Construire un modèle mental solide de l’IA et de ses cas d’usage réels.",
      ctaQuizSlug: "ai-fundamentals",
      ctaPrimaryText: "S’entraîner avec AI Fundamentals",
    },
    {
      title: "🟠 Niveau 2 — Microsoft AI Fundamentals",
      body:
        "C’est votre premier vrai pas de certification. Il introduit l’IA dans un contexte pratique, business et cloud, parfait pour débuter.",
      recommended: ["Microsoft AI Fundamentals"],
      goal: "Comprendre comment l’IA s’applique dans des environnements cloud réels.",
      ctaQuizSlug: "microsoft-ai-fundamentals",
      ctaCertSlug: "microsoft-ai-fundamentals",
      ctaPrimaryText: "Commencer le quiz Microsoft AI",
      ctaSecondaryText: "Voir la certification Microsoft AI",
    },
    {
      title: "🔴 Niveau 3 — TensorFlow (pratique réelle)",
      body:
        "Quand la base est claire, passez à la pratique avec un vrai framework. TensorFlow vous aide à penser moins comme débutant et davantage comme practitioner.",
      recommended: ["TensorFlow"],
      goal: "Commencer à travailler avec de vrais workflows IA, des patterns et la logique des modèles.",
      ctaQuizSlug: "tensorflow",
      ctaCertSlug: "tensorflow",
      ctaPrimaryText: "Commencer le quiz TensorFlow",
      ctaSecondaryText: "Voir la certification TensorFlow",
    },
    {
      title: "⚫ Niveau 4 — Google AI (bientôt disponible)",
      body:
        "Cette future étape élargira le parcours vers les certifications Google AI et les outils pratiques d’IA sur le cloud.",
      recommended: ["Google AI", "Vertex AI"],
      goal: "Étendre les compétences vers les écosystèmes cloud AI modernes.",
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