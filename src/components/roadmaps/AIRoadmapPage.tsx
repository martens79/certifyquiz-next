import Link from "next/link";

type Locale = "it" | "en" | "es" | "fr";

/* ----------------------------- PATH HELPERS ----------------------------- */

/** Quiz rule: ALWAYS /{lang}/quiz/... (EN included) */
const quiz = (lang: Locale, slug: string) => `/${lang}/quiz/${slug}`;

/** Certifications are EN-root in your architecture */
const cert = (slug: string) => `/certifications/${slug}`;

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

            {/* Level CTA: either quiz or certification page */}
            {lvl.ctaQuizSlug ? (
              <div className="mt-4">
                <Link
                  href={quiz(lang, lvl.ctaQuizSlug)}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800 transition"
                >
                  {lvl.ctaText ?? t.practiceCta}
                </Link>
              </div>
            ) : lvl.ctaCertSlug ? (
              <div className="mt-4">
                <Link
                  href={cert(lvl.ctaCertSlug)}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800 transition"
                >
                  {lvl.ctaText ?? t.practiceCta}
                </Link>
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

    goalLabel: string;
    practiceCta: string;

    levels: Array<{
      title: string;
      body: string;
      recommended?: string[];
      goal?: string;
      ctaQuizSlug?: string;
      ctaCertSlug?: string;
      ctaText?: string;
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
      "AI looks overwhelming because people start with tools and skip fundamentals. This roadmap keeps it practical: learn concepts, master a clean fundamentals baseline, then pick a framework track when you're ready.",

    ctaPrimary: "Start AI Fundamentals quiz",
    ctaSecondary: "Browse AI category",

    goalLabel: "Goal:",
    practiceCta: "Open now",

    levels: [
      {
        title: "🟢 Level 0 — Absolute beginner",
        body:
          "Learn what AI actually is: models, data, training vs inference, bias/overfitting, and basic evaluation. Keep it practical.",
        recommended: ["AI vocabulary", "Data basics", "Evaluation basics"],
        goal: "Understand core concepts without confusion.",
      },
      {
        title: "🟡 Level 1 — Fundamentals baseline (your first milestone)",
        body:
          "Start with a structured fundamentals track. This gives you a clean map of concepts before frameworks.",
        recommended: ["AI Fundamentals"],
        goal: "Build a solid mental model of AI/ML and real-world use cases.",
        ctaQuizSlug: "ai-fundamentals",
        ctaText: "Practice AI Fundamentals",
      },
      {
        title: "🟠 Level 2 — Framework track (hands-on)",
        body:
          "Once fundamentals are solid, move into a framework track. For now, TensorFlow is your active certification path.",
        recommended: ["TensorFlow (certification track)"],
        goal: "Start thinking like a practitioner: patterns, metrics, typical pitfalls.",
        ctaCertSlug: "tensorflow",
        ctaText: "Open TensorFlow certification",
      },
      {
        title: "🔴 Level 3 — Specialization (later)",
        body:
          "Specialize only after fundamentals + one framework: NLP, Computer Vision, or MLOps depending on your goals.",
        recommended: ["NLP", "Computer Vision", "MLOps"],
        goal: "Build depth and portfolio-worthy practice over time.",
      },
    ],

    salaryTitle: "💰 AI salary outlook (2026)",
    salaryIntro:
      "Typical global ranges (highly dependent on country, company and seniority). Use this as orientation, not a promise.",
    salaryRanges: [
      { label: "Entry-level", range: "$55k–$85k" },
      { label: "Mid-level", range: "$90k–$130k" },
      { label: "Senior / Specialist", range: "$140k+" },
    ],
    salaryDisclaimer:
      "Disclaimer: ranges vary widely. Certifications help most when combined with real projects and consistent practice.",

    compareTitle: "🔍 Fundamentals vs Framework — what first?",
    compareIntro:
      "Many people jump straight into frameworks and get lost. A fundamentals baseline makes everything easier and faster afterwards.",
    compareLeftTitle: "Fundamentals first",
    compareRightTitle: "Framework first",
    compareRows: [
      { label: "Speed", left: "Faster long-term", right: "Fast start, slow progress later" },
      { label: "Clarity", left: "Clear mental model", right: "Confusing concepts" },
      { label: "Outcome", left: "Stable skills", right: "Tool-dependent knowledge" },
    ],
    compareRecommendationTitle: "Recommendation",
    compareRecommendationBody:
      "Start with AI Fundamentals. Then move to TensorFlow when the basics feel natural.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "Do I need math to start AI?",
        a: "Not much at first. Start with concepts and practice. Add math gradually when you hit limits.",
      },
      {
        q: "What should I do first on CertifyQuiz?",
        a: "Start with the AI Fundamentals quiz, then explore the TensorFlow certification page when you're ready.",
      },
      {
        q: "Can certifications alone get me a job?",
        a: "They help, but projects matter. Use certifications to structure learning, then build small portfolio projects.",
      },
    ],

    finalCtaTitle: "🚀 Start now (no overthinking)",
    finalCtaBody:
      "Open the AI Fundamentals quiz and practice consistently. When the basics are solid, move to TensorFlow for the hands-on track.",
  },

  it: {
    title: "Roadmap Certificazioni AI 2026",
    subtitle: "Parti semplice, costruisci competenze AI reali",
    intro:
      "L’AI sembra complicata perché molti partono dai tool e saltano le basi. Questa roadmap resta pratica: concetti → fundamentals → percorso framework quando sei pronto.",

    ctaPrimary: "Inizia col quiz AI Fundamentals",
    ctaSecondary: "Vai alla categoria AI",

    goalLabel: "Obiettivo:",
    practiceCta: "Apri ora",

    levels: [
      {
        title: "🟢 Livello 0 — Principiante totale",
        body:
          "Impara cos’è davvero l’AI: modelli, dati, training vs inference, bias/overfitting e metriche base. Tutto in modo pratico.",
        recommended: ["Vocabolario AI", "Basi dati", "Basi valutazione"],
        goal: "Capire i concetti senza confusione.",
      },
      {
        title: "🟡 Livello 1 — Fundamentals baseline (prima milestone)",
        body:
          "Parti con un percorso fundamentals strutturato: ti crea una mappa chiara prima dei framework.",
        recommended: ["AI Fundamentals"],
        goal: "Costruire un modello mentale solido e casi d’uso reali.",
        ctaQuizSlug: "ai-fundamentals",
        ctaText: "Allenati con AI Fundamentals",
      },
      {
        title: "🟠 Livello 2 — Percorso framework (pratico)",
        body:
          "Quando le basi sono solide, passa al percorso framework. Per ora TensorFlow è la certificazione attiva.",
        recommended: ["TensorFlow (track certificazione)"],
        goal: "Ragionare da practitioner: pattern, metriche, errori tipici.",
        ctaCertSlug: "tensorflow",
        ctaText: "Apri certificazione TensorFlow",
      },
      {
        title: "🔴 Livello 3 — Specializzazione (più avanti)",
        body:
          "Specializzati solo dopo fundamentals + un framework: NLP, Computer Vision o MLOps in base ai tuoi obiettivi.",
        recommended: ["NLP", "Computer Vision", "MLOps"],
        goal: "Costruire profondità e risultati da portfolio nel tempo.",
      },
    ],

    salaryTitle: "💰 Salary outlook AI (2026)",
    salaryIntro:
      "Range globali indicativi (dipendono molto da paese, azienda e seniority). Orientamento, non promessa.",
    salaryRanges: [
      { label: "Entry-level", range: "$55k–$85k" },
      { label: "Mid-level", range: "$90k–$130k" },
      { label: "Senior / Specialist", range: "$140k+" },
    ],
    salaryDisclaimer:
      "Nota: i range variano molto. Le certificazioni contano di più con progetti reali e pratica costante.",

    compareTitle: "🔍 Fundamentals vs Framework — cosa fare prima?",
    compareIntro:
      "Molti saltano subito sui framework e si perdono. Una base fundamentals rende tutto più semplice e veloce dopo.",
    compareLeftTitle: "Fundamentals prima",
    compareRightTitle: "Framework prima",
    compareRows: [
      { label: "Velocità", left: "Più veloce nel lungo periodo", right: "Parti veloce, poi rallenti" },
      { label: "Chiarezza", left: "Modello mentale chiaro", right: "Concetti confusi" },
      { label: "Risultato", left: "Skill stabili", right: "Conoscenza legata al tool" },
    ],
    compareRecommendationTitle: "Consiglio pratico",
    compareRecommendationBody:
      "Fai prima AI Fundamentals. Poi passa a TensorFlow quando le basi ti vengono naturali.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "Serve matematica per iniziare?",
        a: "Poca all’inizio. Parti da concetti e pratica, poi aggiungi matematica quando serve.",
      },
      {
        q: "Da dove partire su CertifyQuiz?",
        a: "Inizia dal quiz AI Fundamentals, poi esplora la pagina certificazione TensorFlow quando sei pronto.",
      },
      {
        q: "Bastano le certificazioni per lavorare?",
        a: "Aiutano, ma contano i progetti. Usa le cert come struttura e crea piccoli progetti pratici.",
      },
    ],

    finalCtaTitle: "🚀 Parti adesso (senza overthinking)",
    finalCtaBody:
      "Apri il quiz AI Fundamentals e fai pratica con costanza. Quando le basi sono solide, passa a TensorFlow per il percorso pratico.",
  },

  es: {
    title: "Ruta de Certificaciones IA 2026",
    subtitle: "Empieza simple, construye habilidades reales",
    intro:
      "La IA parece difícil porque muchos empiezan con herramientas y saltan los fundamentos. Esta ruta es práctica: conceptos → fundamentals → framework cuando estés listo.",

    ctaPrimary: "Empezar con el quiz AI Fundamentals",
    ctaSecondary: "Ver la categoría IA",

    goalLabel: "Objetivo:",
    practiceCta: "Abrir ahora",

    levels: [
      {
        title: "🟢 Nivel 0 — Principiante total",
        body:
          "Aprende qué es realmente la IA: modelos, datos, entrenamiento vs inferencia, sesgo/overfitting y métricas básicas.",
        recommended: ["Vocabulario IA", "Bases de datos", "Evaluación básica"],
        goal: "Entender los conceptos sin confusión.",
      },
      {
        title: "🟡 Nivel 1 — Fundamentals (primer hito)",
        body:
          "Empieza con un track fundamentals estructurado. Te da un mapa claro antes de frameworks.",
        recommended: ["AI Fundamentals"],
        goal: "Construir un modelo mental sólido y casos reales.",
        ctaQuizSlug: "ai-fundamentals",
        ctaText: "Practicar AI Fundamentals",
      },
      {
        title: "🟠 Nivel 2 — Framework (práctico)",
        body:
          "Cuando la base esté sólida, pasa al framework. Por ahora TensorFlow es la certificación activa.",
        recommended: ["TensorFlow (track de certificación)"],
        goal: "Pensar como practitioner: patrones, métricas, errores típicos.",
        ctaCertSlug: "tensorflow",
        ctaText: "Abrir certificación TensorFlow",
      },
      {
        title: "🔴 Nivel 3 — Especialización (más adelante)",
        body:
          "Especialízate solo después de fundamentals + un framework: NLP, visión por computador o MLOps.",
        recommended: ["NLP", "Computer Vision", "MLOps"],
        goal: "Ganar profundidad y resultados tipo portfolio.",
      },
    ],

    salaryTitle: "💰 Salary outlook IA (2026)",
    salaryIntro:
      "Rangos globales orientativos (depende del país, empresa y seniority). Guía, no promesa.",
    salaryRanges: [
      { label: "Entry-level", range: "$55k–$85k" },
      { label: "Mid-level", range: "$90k–$130k" },
      { label: "Senior / Specialist", range: "$140k+" },
    ],
    salaryDisclaimer:
      "Aviso: varía mucho. Las certificaciones ayudan más con proyectos reales y práctica constante.",

    compareTitle: "🔍 Fundamentals vs Framework — ¿qué primero?",
    compareIntro:
      "Mucha gente salta directo a frameworks y se pierde. Una base fundamentals hace todo más claro y rápido después.",
    compareLeftTitle: "Fundamentals primero",
    compareRightTitle: "Framework primero",
    compareRows: [
      { label: "Velocidad", left: "Más rápido a largo plazo", right: "Empiezas rápido y luego te estancas" },
      { label: "Claridad", left: "Modelo mental claro", right: "Conceptos confusos" },
      { label: "Resultado", left: "Habilidades estables", right: "Conocimiento dependiente de la herramienta" },
    ],
    compareRecommendationTitle: "Recomendación",
    compareRecommendationBody:
      "Empieza con AI Fundamentals. Luego pasa a TensorFlow cuando la base sea natural.",

    faqTitle: "FAQ",
    faq: [
      { q: "¿Necesito matemáticas?", a: "Poca al principio. Conceptos + práctica, y matemáticas gradualmente." },
      { q: "¿Por dónde empezar en CertifyQuiz?", a: "Empieza con el quiz AI Fundamentals y luego mira TensorFlow." },
      { q: "¿Certificaciones = trabajo?", a: "Ayudan, pero los proyectos cuentan. Cert + práctica real." },
    ],

    finalCtaTitle: "🚀 Empieza ahora (sin sobrepensar)",
    finalCtaBody:
      "Abre el quiz AI Fundamentals y practica con constancia. Después pasa a TensorFlow para el track práctico.",
  },

  fr: {
    title: "Parcours Certifications IA 2026",
    subtitle: "Commencez simple, progressez concrètement",
    intro:
      "L’IA paraît difficile parce que beaucoup commencent par des outils et sautent les bases. Ce parcours est pratique : concepts → fundamentals → framework quand vous êtes prêt.",

    ctaPrimary: "Commencer avec le quiz AI Fundamentals",
    ctaSecondary: "Voir la catégorie IA",

    goalLabel: "Objectif :",
    practiceCta: "Ouvrir maintenant",

    levels: [
      {
        title: "🟢 Niveau 0 — Débutant total",
        body:
          "Apprenez ce qu’est vraiment l’IA : modèles, données, entraînement vs inférence, biais/overfitting, métriques de base.",
        recommended: ["Vocabulaire IA", "Bases des données", "Évaluation de base"],
        goal: "Comprendre les concepts sans confusion.",
      },
      {
        title: "🟡 Niveau 1 — Fundamentals (premier jalon)",
        body:
          "Commencez par un track fundamentals structuré. Il donne une carte claire avant les frameworks.",
        recommended: ["AI Fundamentals"],
        goal: "Construire un modèle mental solide et des cas d’usage réels.",
        ctaQuizSlug: "ai-fundamentals",
        ctaText: "S’entraîner avec AI Fundamentals",
      },
      {
        title: "🟠 Niveau 2 — Framework (pratique)",
        body:
          "Une fois les bases solides, passez au framework. Pour l’instant, TensorFlow est la certification active.",
        recommended: ["TensorFlow (track certification)"],
        goal: "Penser comme practitioner : patterns, métriques, pièges classiques.",
        ctaCertSlug: "tensorflow",
        ctaText: "Ouvrir la certification TensorFlow",
      },
      {
        title: "🔴 Niveau 3 — Spécialisation (plus tard)",
        body:
          "Spécialisez-vous après fundamentals + un framework : NLP, vision par ordinateur ou MLOps.",
        recommended: ["NLP", "Computer Vision", "MLOps"],
        goal: "Gagner en profondeur et produire du “portfolio”.",
      },
    ],

    salaryTitle: "💰 Salary outlook IA (2026)",
    salaryIntro:
      "Fourchettes mondiales indicatives (selon pays, entreprise, seniorité). Repères, pas promesses.",
    salaryRanges: [
      { label: "Entry-level", range: "$55k–$85k" },
      { label: "Mid-level", range: "$90k–$130k" },
      { label: "Senior / Specialist", range: "$140k+" },
    ],
    salaryDisclaimer:
      "Note : ça varie beaucoup. Les certifications valent surtout avec projets réels et pratique régulière.",

    compareTitle: "🔍 Fundamentals vs Framework — quoi d’abord ?",
    compareIntro:
      "Beaucoup passent directement aux frameworks et se perdent. Une base fundamentals rend tout plus clair et plus rapide ensuite.",
    compareLeftTitle: "Fundamentals d’abord",
    compareRightTitle: "Framework d’abord",
    compareRows: [
      { label: "Vitesse", left: "Plus rapide à long terme", right: "Début rapide, progrès lent ensuite" },
      { label: "Clarté", left: "Modèle mental clair", right: "Concepts confus" },
      { label: "Résultat", left: "Compétences stables", right: "Connaissance dépendante de l’outil" },
    ],
    compareRecommendationTitle: "Recommandation",
    compareRecommendationBody:
      "Commencez par AI Fundamentals. Puis passez à TensorFlow quand la base devient naturelle.",

    faqTitle: "FAQ",
    faq: [
      { q: "Faut-il des maths ?", a: "Peu au début. Concepts + pratique, puis maths progressivement." },
      { q: "Par où commencer sur CertifyQuiz ?", a: "Commencez avec le quiz AI Fundamentals, puis regardez TensorFlow." },
      { q: "Certifications = job ?", a: "Ça aide, mais les projets comptent. Cert + pratique réelle." },
    ],

    finalCtaTitle: "🚀 Commencez maintenant (sans overthinking)",
    finalCtaBody:
      "Ouvrez le quiz AI Fundamentals et pratiquez régulièrement. Ensuite, passez à TensorFlow pour le track pratique.",
  },
};
