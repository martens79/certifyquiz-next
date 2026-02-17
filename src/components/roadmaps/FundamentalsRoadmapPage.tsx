import Link from "next/link";

type Locale = "it" | "en" | "es" | "fr";

type QuizSlug =
  | "comptia-itf-plus"
  | "comptia-a-plus"
  | "icdl"
  | "eipass"
  | "pekit";

const quiz = (lang: Locale, slug: QuizSlug) => `/${lang}/quiz/${slug}`;

export default function FundamentalsRoadmapPage({ lang }: { lang: Locale }) {
  const t = CONTENT[lang];

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
            href={quiz(lang, "comptia-itf-plus")}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 transition"
          >
            {t.ctaPrimary}
          </Link>

          <Link
            href={quiz(lang, "icdl")}
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

            {lvl.ctaQuizSlug ? (
              <div className="mt-4">
                <Link
                  href={quiz(lang, lvl.ctaQuizSlug)}
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
            href={quiz(lang, "comptia-itf-plus")}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 transition"
          >
            {t.ctaPrimary}
          </Link>
          <Link
            href={quiz(lang, "icdl")}
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

    goalLabel: string;
    practiceCta: string;

    levels: Array<{
      title: string;
      body: string;
      recommended?: string[];
      goal?: string;
      ctaQuizSlug?: QuizSlug;
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
    title: "IT Fundamentals Roadmap 2026",
    subtitle: "Start from zero and build solid IT foundations",
    intro:
      "If you’re new to IT, your fastest win is a strong foundation. This roadmap helps you build practical skills (devices, OS, files, security basics) before you specialize in networking, cloud, or cybersecurity.",

    ctaPrimary: "Start with CompTIA ITF+",
    ctaSecondary: "Or practice ICDL",

    goalLabel: "Goal:",
    practiceCta: "Practice now",

    levels: [
      {
        title: "🟢 Level 0 — Absolute beginner",
        body:
          "Start with digital basics: files/folders, devices, simple troubleshooting, and everyday IT vocabulary.",
        recommended: ["ICDL / EIPASS (digital literacy)", "PEKIT (practical modules)"],
        goal: "Feel comfortable with basic computer tasks and terminology.",
        ctaQuizSlug: "icdl",
        ctaText: "Practice ICDL",
      },
      {
        title: "🟡 Level 1 — IT foundations (systems + basic networking)",
        body:
          "Learn operating system basics, basic security habits, and simple networking concepts. This is where you become “IT-capable”.",
        recommended: ["CompTIA ITF+", "CompTIA A+ (entry modules)"],
        goal: "Understand OS concepts and basic troubleshooting patterns.",
        ctaQuizSlug: "comptia-itf-plus",
        ctaText: "Practice ITF+",
      },
      {
        title: "🟠 Level 2 — First job-ready skills",
        body:
          "Move from theory to practice: common issues, user support, device setup, updates, backups, and safe habits.",
        recommended: ["CompTIA A+ (next step)", "Real practice with a mini-lab"],
        goal: "Handle common support tasks with confidence.",
        ctaQuizSlug: "comptia-a-plus",
        ctaText: "Practice A+",
      },
      {
        title: "🔴 Level 3 — Choose your direction",
        body:
          "After fundamentals, pick a path: networking, cybersecurity, cloud, databases, or programming. Foundations make everything easier.",
        recommended: ["Networking", "Security", "Cloud", "Databases", "Programming"],
        goal: "Specialize with less confusion and faster progress.",
      },
    ],

    salaryTitle: "💰 Salary outlook (2026)",
    salaryIntro:
      "Entry-level IT roles vary a lot by country (helpdesk, junior support, technician).",
    salaryRanges: [
      { label: "Entry-level", range: "$30k–$50k" },
      { label: "Mid-level", range: "$50k–$75k" },
      { label: "Specialized", range: "$80k+" },
    ],
    salaryDisclaimer:
      "Fundamentals don’t pay “by themselves” — they unlock the paths that do.",

    compareTitle: "🔍 ITF+ vs A+ — what first?",
    compareIntro:
      "ITF+ is lighter and great for true beginners. A+ is more job-oriented and broader.",
    compareLeftTitle: "CompTIA ITF+",
    compareRightTitle: "CompTIA A+",
    compareRows: [
      { label: "Best for", left: "Starting from zero", right: "Getting job-ready faster" },
      { label: "Difficulty", left: "Easier", right: "More content and depth" },
      { label: "Recommendation", left: "If you’re new", right: "After you have basics" },
    ],
    compareRecommendationTitle: "Recommendation",
    compareRecommendationBody:
      "If you’re unsure: do ITF+ first. If you already have basic confidence, go straight to A+ and practice a lot.",

    faqTitle: "FAQ",
    faq: [
      { q: "I’m a total beginner — where do I start?", a: "Start with ICDL/EIPASS + basic practice. Then move to ITF+." },
      { q: "Do I need ITF+ if I’m doing A+?", a: "Not mandatory. ITF+ is useful only if you feel lost on basics." },
      { q: "How can I learn faster?", a: "Small daily practice beats long weekly sessions. Do quizzes + a mini-lab." },
      { q: "What’s the best next step after basics?", a: "Pick one direction (networking/security/cloud) and commit for 4–6 weeks." },
    ],

    finalCtaTitle: "🚀 Start now (simple plan)",
    finalCtaBody:
      "Do fundamentals first, then specialize. Start with ITF+ (or ICDL if you’re brand new) and practice daily.",
  },

  it: {
    title: "Roadmap Fondamenta IT 2026",
    subtitle: "Parti da zero e costruisci basi solide",
    intro:
      "Se sei all’inizio, la mossa migliore è creare fondamenta vere. Questa roadmap ti porta da competenze digitali base a una base IT spendibile (dispositivi, OS, file, sicurezza base) prima di specializzarti.",

    ctaPrimary: "Inizia con CompTIA ITF+",
    ctaSecondary: "Oppure allenati con ICDL",

    goalLabel: "Obiettivo:",
    practiceCta: "Allenati ora",

    levels: [
      {
        title: "🟢 Livello 0 — Principiante assoluto",
        body:
          "Parti da basi digitali: file/cartelle, dispositivi, troubleshooting semplice e vocabolario IT.",
        recommended: ["ICDL / EIPASS (alfabetizzazione digitale)", "PEKIT (moduli pratici)"],
        goal: "Sentirti a tuo agio con le attività base e i concetti fondamentali.",
        ctaQuizSlug: "icdl",
        ctaText: "Quiz ICDL",
      },
      {
        title: "🟡 Livello 1 — Fondamenta IT (sistemi + reti base)",
        body:
          "Sistemi operativi, buone pratiche di sicurezza e concetti base di networking: qui diventi “capace in IT”.",
        recommended: ["CompTIA ITF+", "CompTIA A+ (moduli iniziali)"],
        goal: "Capire OS e pattern di troubleshooting.",
        ctaQuizSlug: "comptia-itf-plus",
        ctaText: "Quiz ITF+",
      },
      {
        title: "🟠 Livello 2 — Prime competenze spendibili",
        body:
          "Passa al pratico: problemi comuni, supporto utenti, setup device, update, backup e abitudini sicure.",
        recommended: ["CompTIA A+ (step successivo)", "Mini-lab personale"],
        goal: "Gestire attività di supporto con sicurezza.",
        ctaQuizSlug: "comptia-a-plus",
        ctaText: "Quiz A+",
      },
      {
        title: "🔴 Livello 3 — Scegli una direzione",
        body:
          "Dopo le fondamenta, scegli un percorso: reti, cybersecurity, cloud, database o programmazione. Con le basi, tutto è più facile.",
        recommended: ["Reti", "Sicurezza", "Cloud", "Database", "Programmazione"],
        goal: "Specializzarti più velocemente e con meno confusione.",
      },
    ],

    salaryTitle: "💰 Salary outlook (2026)",
    salaryIntro:
      "Ruoli entry-level IT variano molto (helpdesk, junior support, tecnico).",
    salaryRanges: [
      { label: "Entry-level", range: "$30k–$50k" },
      { label: "Mid-level", range: "$50k–$75k" },
      { label: "Specializzato", range: "$80k+" },
    ],
    salaryDisclaimer:
      "Le fondamenta non “pagano da sole” — sbloccano i percorsi che pagano.",

    compareTitle: "🔍 ITF+ vs A+ — cosa fare prima?",
    compareIntro:
      "ITF+ è più leggero (ottimo se parti da zero). A+ è più job-oriented e più ampio.",
    compareLeftTitle: "CompTIA ITF+",
    compareRightTitle: "CompTIA A+",
    compareRows: [
      { label: "Ideale per", left: "Partire da zero", right: "Diventare spendibile più in fretta" },
      { label: "Difficoltà", left: "Più facile", right: "Più contenuti e profondità" },
      { label: "Consiglio", left: "Se sei alle prime armi", right: "Dopo le basi" },
    ],
    compareRecommendationTitle: "Consiglio pratico",
    compareRecommendationBody:
      "Se sei indeciso: ITF+ prima. Se hai già confidenza, vai su A+ e fai tanta pratica.",

    faqTitle: "FAQ",
    faq: [
      { q: "Sono a zero: da dove parto?", a: "ICDL/EIPASS + pratica base. Poi ITF+." },
      { q: "Serve ITF+ se faccio A+?", a: "Non obbligatorio: serve solo se ti mancano le basi." },
      { q: "Come imparo più in fretta?", a: "Pratica quotidiana breve > sessioni lunghe rare. Quiz + mini-lab." },
      { q: "Dopo le basi cosa faccio?", a: "Scegli una direzione e resta costante per 4–6 settimane." },
    ],

    finalCtaTitle: "🚀 Parti ora (piano semplice)",
    finalCtaBody:
      "Fai prima le fondamenta e poi specializzati. Inizia con ITF+ (o ICDL se sei a zero) e allenati ogni giorno.",
  },

  es: {
    title: "Ruta de Fundamentos IT 2026",
    subtitle: "Empieza desde cero con una base sólida",
    intro:
      "Si estás empezando, lo más rápido es construir fundamentos reales. Esta ruta te lleva de habilidades digitales a una base IT útil antes de especializarte.",

    ctaPrimary: "Empezar con CompTIA ITF+",
    ctaSecondary: "O practicar ICDL",

    goalLabel: "Objetivo:",
    practiceCta: "Practicar",

    levels: [
      {
        title: "🟢 Nivel 0 — Principiante",
        body: "Habilidades digitales: archivos, dispositivos y troubleshooting simple.",
        recommended: ["ICDL / EIPASS", "PEKIT"],
        goal: "Sentirte cómodo con lo básico.",
        ctaQuizSlug: "icdl",
        ctaText: "Quiz ICDL",
      },
      {
        title: "🟡 Nivel 1 — Fundamentos IT",
        body: "SO, hábitos de seguridad y redes básicas.",
        recommended: ["CompTIA ITF+", "CompTIA A+ (inicio)"],
        goal: "Entender conceptos clave y patrones de fallos.",
        ctaQuizSlug: "comptia-itf-plus",
        ctaText: "Quiz ITF+",
      },
      {
        title: "🟠 Nivel 2 — Habilidades empleables",
        body: "Soporte, configuración, updates, backups y práctica real.",
        recommended: ["CompTIA A+", "Mini-lab"],
        goal: "Resolver problemas comunes con confianza.",
        ctaQuizSlug: "comptia-a-plus",
        ctaText: "Quiz A+",
      },
      {
        title: "🔴 Nivel 3 — Elegir dirección",
        body: "Luego especialízate: redes, seguridad, cloud, bases de datos o programación.",
        recommended: ["Networking", "Security", "Cloud", "Databases", "Programming"],
        goal: "Avanzar más rápido con menos confusión.",
      },
    ],

    salaryTitle: "💰 Salary outlook (2026)",
    salaryIntro: "Rangos orientativos (varían mucho).",
    salaryRanges: [
      { label: "Entry-level", range: "$30k–$50k" },
      { label: "Mid-level", range: "$50k–$75k" },
      { label: "Especializado", range: "$80k+" },
    ],
    salaryDisclaimer: "Los fundamentos abren puertas: luego especializas.",

    compareTitle: "🔍 ITF+ vs A+",
    compareIntro: "ITF+ es más fácil. A+ es más orientado a trabajo.",
    compareLeftTitle: "ITF+",
    compareRightTitle: "A+",
    compareRows: [
      { label: "Mejor para", left: "Empezar desde cero", right: "Ser empleable más rápido" },
      { label: "Dificultad", left: "Más fácil", right: "Más contenido" },
      { label: "Recomendación", left: "Si eres nuevo", right: "Después de bases" },
    ],
    compareRecommendationTitle: "Recomendación",
    compareRecommendationBody: "Si dudas: ITF+ primero. Si ya sabes lo básico: A+.",

    faqTitle: "FAQ",
    faq: [
      { q: "¿Por dónde empiezo?", a: "ICDL/EIPASS y luego ITF+." },
      { q: "¿ITF+ es obligatorio?", a: "No, solo si te faltan bases." },
      { q: "¿Cómo aprender más rápido?", a: "Práctica diaria corta + quiz + mini-lab." },
      { q: "¿Qué sigue?", a: "Elige una dirección y sé constante 4–6 semanas." },
    ],

    finalCtaTitle: "🚀 Empieza ahora",
    finalCtaBody: "Fundamentos primero, especialización después. Practica hoy.",
  },

  fr: {
    title: "Parcours Fondamentaux IT 2026",
    subtitle: "Commencer de zéro avec une base solide",
    intro:
      "Si vous débutez, le plus efficace est de construire de vraies bases. Ce parcours vous amène des compétences numériques aux fondamentaux IT avant de vous spécialiser.",

    ctaPrimary: "Commencer avec CompTIA ITF+",
    ctaSecondary: "Ou s’entraîner avec ICDL",

    goalLabel: "Objectif :",
    practiceCta: "S’entraîner",

    levels: [
      {
        title: "🟢 Niveau 0 — Débutant",
        body: "Compétences numériques : fichiers, appareils, dépannage simple.",
        recommended: ["ICDL / EIPASS", "PEKIT"],
        goal: "Être à l’aise avec les bases.",
        ctaQuizSlug: "icdl",
        ctaText: "Quiz ICDL",
      },
      {
        title: "🟡 Niveau 1 — Fondamentaux IT",
        body: "OS, bonnes pratiques sécurité, notions réseau de base.",
        recommended: ["CompTIA ITF+", "CompTIA A+ (début)"],
        goal: "Comprendre concepts et pannes typiques.",
        ctaQuizSlug: "comptia-itf-plus",
        ctaText: "Quiz ITF+",
      },
      {
        title: "🟠 Niveau 2 — Compétences employables",
        body: "Support, configuration, mises à jour, sauvegardes et pratique.",
        recommended: ["CompTIA A+", "Mini-lab"],
        goal: "Résoudre les problèmes courants avec confiance.",
        ctaQuizSlug: "comptia-a-plus",
        ctaText: "Quiz A+",
      },
      {
        title: "🔴 Niveau 3 — Choisir une direction",
        body: "Ensuite : réseau, sécurité, cloud, bases de données ou programmation.",
        recommended: ["Networking", "Security", "Cloud", "Databases", "Programming"],
        goal: "Avancer plus vite avec moins de confusion.",
      },
    ],

    salaryTitle: "💰 Salary outlook (2026)",
    salaryIntro: "Fourchettes indicatives (selon pays).",
    salaryRanges: [
      { label: "Entry-level", range: "$30k–$50k" },
      { label: "Mid-level", range: "$50k–$75k" },
      { label: "Spécialisé", range: "$80k+" },
    ],
    salaryDisclaimer: "Les bases ouvrent les portes : ensuite, spécialisez-vous.",

    compareTitle: "🔍 ITF+ vs A+",
    compareIntro: "ITF+ est plus simple. A+ est plus orienté job.",
    compareLeftTitle: "ITF+",
    compareRightTitle: "A+",
    compareRows: [
      { label: "Idéal pour", left: "Débuter", right: "Être employable plus vite" },
      { label: "Difficulté", left: "Plus facile", right: "Plus de contenu" },
      { label: "Conseil", left: "Si vous êtes nouveau", right: "Après les bases" },
    ],
    compareRecommendationTitle: "Recommandation",
    compareRecommendationBody: "Si vous hésitez : ITF+ d’abord. Sinon : A+.",

    faqTitle: "FAQ",
    faq: [
      { q: "Par où commencer ?", a: "ICDL/EIPASS puis ITF+." },
      { q: "ITF+ obligatoire ?", a: "Non, seulement si les bases manquent." },
      { q: "Apprendre plus vite ?", a: "Courte pratique quotidienne + quiz + mini-lab." },
      { q: "Et après ?", a: "Choisissez une direction 4–6 semaines." },
    ],

    finalCtaTitle: "🚀 Commencez maintenant",
    finalCtaBody: "Fondamentaux d’abord, spécialisation ensuite. Pratiquez aujourd’hui.",
  },
};
