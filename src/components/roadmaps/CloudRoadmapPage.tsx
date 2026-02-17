import Link from "next/link";

type Locale = "it" | "en" | "es" | "fr";

// Slug quiz (quiz SEMPRE con /{lang} anche per EN)
type CloudQuizSlug =
  | "aws-cloud-practitioner"
  | "microsoft-azure-fundamentals"
  | "google-cloud"
  | "comptia-cloud-plus";

export default function CloudRoadmapPage({ lang }: { lang: Locale }) {
  const t = CONTENT[lang];

  const quiz = (slug: CloudQuizSlug) => `/${lang}/quiz/${slug}`;

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

            {lvl.ctaQuizSlug ? (
              <div className="mt-4">
                <Link
                  href={quiz(lvl.ctaQuizSlug)}
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

    goalLabel: string;
    practiceCta: string;

    levels: Array<{
      title: string;
      body: string;
      recommended?: string[];
      goal?: string;
      ctaQuizSlug?: CloudQuizSlug;
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
    title: "Cloud Certification Roadmap 2026",
    subtitle: "From cloud beginner to job-ready skills",
    intro:
      "Cloud is not just “learn AWS”. You need core concepts (networking, security, cost), then a solid entry certification, and only after that you go deeper into architecture and operations. This roadmap gives you a practical order.",

    ctaPrimary: "Start with AWS Cloud Practitioner quiz",
    ctaSecondary: "Browse cloud certifications",

    goalLabel: "Goal:",
    practiceCta: "Practice now",

    levels: [
      {
        title: "🟢 Level 0 — No IT basics",
        body:
          "If you’re new to IT, don’t jump into cloud services menus. First, understand what a network is, what DNS does, and why security matters.",
        recommended: ["IT basics (devices/OS)", "Basic networking (IP, DNS, routing)", "Basic security concepts"],
        goal: "Be able to understand cloud services without guessing.",
      },
      {
        title: "🟡 Level 1 — Cloud fundamentals (entry)",
        body:
          "Start with one entry-level certification that explains cloud models, shared responsibility, basic services, and pricing.",
        recommended: ["AWS Cloud Practitioner", "Microsoft Azure Fundamentals (AZ-900)"],
        goal: "Understand cloud concepts, pricing, identity basics, and core services.",
        ctaQuizSlug: "aws-cloud-practitioner",
        ctaText: "Practice Cloud Practitioner quiz",
      },
      {
        title: "🟠 Level 2 — Pick a vendor track (go deeper)",
        body:
          "Choose ONE vendor to go deeper (AWS OR Azure OR Google Cloud). Depth beats scattered badges.",
        recommended: [
          "AWS Solutions Architect (next step after Practitioner)",
          "Azure track after AZ-900",
          "Google Cloud fundamentals path",
        ],
        goal: "Build real skills: architecture patterns, storage, networking, IAM, and cost control.",
        ctaQuizSlug: "microsoft-azure-fundamentals",
        ctaText: "Practice Azure Fundamentals quiz",
      },
      {
        title: "🔴 Level 3 — Operations & multi-cloud (advanced)",
        body:
          "After fundamentals, learn ops: deployment, monitoring, troubleshooting, governance, and multi-cloud basics.",
        recommended: ["CompTIA Cloud+ (operations)", "Cloud security basics", "CI/CD & automation fundamentals"],
        goal: "Become job-ready for cloud operations and real-world troubleshooting.",
        ctaQuizSlug: "comptia-cloud-plus",
        ctaText: "Practice Cloud+ quiz",
      },
    ],

    salaryTitle: "💰 Cloud salary outlook (2026)",
    salaryIntro:
      "Typical global ranges (highly dependent on country, experience, and company). Use this as orientation, not a promise.",
    salaryRanges: [
      { label: "Entry-level", range: "$55k–$80k" },
      { label: "Mid-level", range: "$85k–$120k" },
      { label: "Senior / Architect", range: "$130k+" },
    ],
    salaryDisclaimer:
      "Disclaimer: ranges vary widely. Certifications help most when combined with labs, projects, and consistent practice.",

    compareTitle: "🔍 AWS vs Azure vs Google Cloud — which one should you pick?",
    compareIntro:
      "All are valuable. The best choice depends on your market and goals. The key: pick one and go deep first.",
    compareLeftTitle: "One vendor (deep)",
    compareRightTitle: "Many vendors (shallow)",
    compareRows: [
      { label: "Learning speed", left: "Faster progress", right: "Slower progress" },
      { label: "Job readiness", left: "Stronger skills", right: "More confusion" },
      { label: "Best approach", left: "Pick 1 → then expand", right: "Don’t start here" },
    ],
    compareRecommendationTitle: "Recommendation",
    compareRecommendationBody:
      "Start with Cloud Practitioner or AZ-900, then choose one vendor track to go deeper. Add multi-cloud later.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "Do I need networking before cloud?",
        a: "You don’t need to be a network engineer, but you must understand IP/DNS/routing basics. Otherwise cloud stays confusing.",
      },
      {
        q: "Is Cloud Practitioner useful in 2026?",
        a: "Yes, as an entry point. It helps you learn the language of cloud and the pricing/security basics.",
      },
      {
        q: "Should I do AWS and Azure together?",
        a: "Not at the beginning. Start with one vendor track, build depth, then expand later.",
      },
      {
        q: "What matters most for getting hired?",
        a: "Certifications + hands-on labs + small projects (deployments, IAM setup, monitoring, cost review).",
      },
    ],

    finalCtaTitle: "🚀 Start now (the practical way)",
    finalCtaBody:
      "Read the roadmap once, then act. Start with an entry cloud quiz and practice consistently—skills beat planning.",
  },

  it: {
    title: "Roadmap Certificazioni Cloud 2026",
    subtitle: "Da principiante a competenze cloud spendibili",
    intro:
      "Cloud non significa solo “imparo AWS”. Servono concetti chiave (reti, security, costi), poi una certificazione entry, e solo dopo si va su architettura e operations. Questa roadmap ti dà un ordine pratico.",

    ctaPrimary: "Inizia col quiz AWS Cloud Practitioner",
    ctaSecondary: "Vedi le certificazioni Cloud",

    goalLabel: "Obiettivo:",
    practiceCta: "Allenati ora",

    levels: [
      {
        title: "🟢 Livello 0 — Nessuna base IT",
        body:
          "Se parti da zero, non saltare subito nei servizi cloud. Prima capisci reti base, DNS e concetti di sicurezza.",
        recommended: ["Basi IT (dispositivi/OS)", "Reti base (IP, DNS, routing)", "Concetti base di sicurezza"],
        goal: "Capire i servizi cloud senza andare a tentativi.",
      },
      {
        title: "🟡 Livello 1 — Fondamenti Cloud (entry)",
        body:
          "Scegli una certificazione entry che spiega modelli cloud, shared responsibility, servizi base e pricing.",
        recommended: ["AWS Cloud Practitioner", "Microsoft Azure Fundamentals (AZ-900)"],
        goal: "Capire concetti cloud, prezzi, identity base e servizi principali.",
        ctaQuizSlug: "aws-cloud-practitioner",
        ctaText: "Quiz Cloud Practitioner",
      },
      {
        title: "🟠 Livello 2 — Scegli un vendor e vai in profondità",
        body:
          "Scegli UN vendor (AWS o Azure o Google Cloud). La profondità vale più di badge sparsi.",
        recommended: [
          "AWS Solutions Architect (step dopo Practitioner)",
          "Percorso Azure dopo AZ-900",
          "Percorso Google Cloud fundamentals",
        ],
        goal: "Costruire skill reali: architetture, storage, networking, IAM e cost control.",
        ctaQuizSlug: "microsoft-azure-fundamentals",
        ctaText: "Quiz Azure Fundamentals",
      },
      {
        title: "🔴 Livello 3 — Operations & multi-cloud (avanzato)",
        body:
          "Dopo le basi, passa alle operations: deploy, monitoring, troubleshooting, governance e basi multi-cloud.",
        recommended: ["CompTIA Cloud+ (operations)", "Cloud security basics", "CI/CD & automazione base"],
        goal: "Diventare job-ready per ruoli cloud operations e troubleshooting reale.",
        ctaQuizSlug: "comptia-cloud-plus",
        ctaText: "Quiz Cloud+",
      },
    ],

    salaryTitle: "💰 Salary outlook Cloud (2026)",
    salaryIntro:
      "Range globali indicativi (dipendono molto da paese, esperienza e azienda). Orientamento, non promessa.",
    salaryRanges: [
      { label: "Entry-level", range: "$55k–$80k" },
      { label: "Mid-level", range: "$85k–$120k" },
      { label: "Senior / Architect", range: "$130k+" },
    ],
    salaryDisclaimer:
      "Nota: i range variano molto. Le certificazioni rendono di più con lab, progetti e pratica costante.",

    compareTitle: "🔍 AWS vs Azure vs Google Cloud — quale scegliere?",
    compareIntro:
      "Tutti validi. La scelta migliore dipende dal mercato e dagli obiettivi. La cosa fondamentale: scegline uno e vai in profondità prima.",
    compareLeftTitle: "Un vendor (profondo)",
    compareRightTitle: "Tanti vendor (superficiale)",
    compareRows: [
      { label: "Velocità", left: "Progressi più rapidi", right: "Progressi più lenti" },
      { label: "Skill reali", left: "Più solidi", right: "Più confusione" },
      { label: "Approccio", left: "1 vendor → poi espandi", right: "Non iniziare così" },
    ],
    compareRecommendationTitle: "Consiglio pratico",
    compareRecommendationBody:
      "Parti da Cloud Practitioner o AZ-900, poi scegli un vendor track e vai in profondità. Il multi-cloud viene dopo.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "Serve networking prima del cloud?",
        a: "Non devi essere un network engineer, ma IP/DNS/routing base sì: altrimenti il cloud resta confuso.",
      },
      {
        q: "Cloud Practitioner vale nel 2026?",
        a: "Sì, come entry point: ti insegna lingua del cloud, prezzi e basi di security.",
      },
      {
        q: "Faccio AWS e Azure insieme?",
        a: "All’inizio no. Parti con un vendor, fai profondità, poi espandi.",
      },
      {
        q: "Cosa conta di più per farsi assumere?",
        a: "Certificazioni + lab hands-on + piccoli progetti (deploy, IAM, monitoring, cost review).",
      },
    ],

    finalCtaTitle: "🚀 Parti adesso (modo pratico)",
    finalCtaBody:
      "Leggi la roadmap una volta, poi agisci. Inizia con un quiz cloud entry e fai pratica costante.",
  },

  es: {
    title: "Ruta de Certificaciones Cloud 2026",
    subtitle: "De principiante a habilidades cloud útiles",
    intro:
      "Cloud no es solo “aprender AWS”. Necesitas conceptos clave (redes, seguridad, costes), luego una certificación de entrada y después arquitectura/operaciones. Esta ruta te da un orden práctico.",

    ctaPrimary: "Empezar con AWS Cloud Practitioner",
    ctaSecondary: "Ver certificaciones Cloud",

    goalLabel: "Objetivo:",
    practiceCta: "Practicar ahora",

    levels: [
      {
        title: "🟢 Nivel 0 — Sin base IT",
        body:
          "Si empiezas de cero, primero entiende redes básicas, DNS y conceptos de seguridad antes de meterte en servicios cloud.",
        recommended: ["Fundamentos IT", "Redes básicas (IP, DNS, routing)", "Conceptos básicos de seguridad"],
        goal: "Entender cloud sin ir a ciegas.",
      },
      {
        title: "🟡 Nivel 1 — Fundamentos Cloud (entrada)",
        body:
          "Elige una certificación de entrada que explique modelos cloud, responsabilidad compartida, servicios básicos y precios.",
        recommended: ["AWS Cloud Practitioner", "Microsoft Azure Fundamentals (AZ-900)"],
        goal: "Entender conceptos cloud, pricing, identidad básica y servicios principales.",
        ctaQuizSlug: "aws-cloud-practitioner",
        ctaText: "Practicar Cloud Practitioner",
      },
      {
        title: "🟠 Nivel 2 — Elige un vendor y profundiza",
        body:
          "Elige UN vendor (AWS o Azure o Google Cloud). Profundidad > badges dispersos.",
        recommended: [
          "AWS Solutions Architect (después de Practitioner)",
          "Ruta Azure después de AZ-900",
          "Ruta Google Cloud fundamentals",
        ],
        goal: "Construir habilidades reales: arquitectura, storage, networking, IAM y control de costes.",
        ctaQuizSlug: "microsoft-azure-fundamentals",
        ctaText: "Practicar Azure Fundamentals",
      },
      {
        title: "🔴 Nivel 3 — Operaciones y multi-cloud (avanzado)",
        body:
          "Después de la base, aprende ops: despliegues, monitorización, troubleshooting, governance y multi-cloud básico.",
        recommended: ["CompTIA Cloud+ (operaciones)", "Cloud security basics", "CI/CD y automatización básica"],
        goal: "Ser job-ready para cloud ops y troubleshooting real.",
        ctaQuizSlug: "comptia-cloud-plus",
        ctaText: "Practicar Cloud+",
      },
    ],

    salaryTitle: "💰 Salary outlook Cloud (2026)",
    salaryIntro:
      "Rangos globales orientativos (varía por país, experiencia y empresa). Guía, no promesa.",
    salaryRanges: [
      { label: "Entry-level", range: "$55k–$80k" },
      { label: "Mid-level", range: "$85k–$120k" },
      { label: "Senior / Architect", range: "$130k+" },
    ],
    salaryDisclaimer:
      "Aviso: los rangos varían mucho. Certificaciones + labs + proyectos marcan la diferencia.",

    compareTitle: "🔍 AWS vs Azure vs Google Cloud — ¿cuál elegir?",
    compareIntro:
      "Todos valen. La mejor elección depende del mercado y objetivos. Clave: elige uno y profundiza primero.",
    compareLeftTitle: "Un vendor (profundo)",
    compareRightTitle: "Muchos vendors (superficial)",
    compareRows: [
      { label: "Velocidad", left: "Progreso más rápido", right: "Progreso más lento" },
      { label: "Skill reales", left: "Más sólidas", right: "Más confusión" },
      { label: "Estrategia", left: "1 vendor → luego expandir", right: "No empezar así" },
    ],
    compareRecommendationTitle: "Recomendación",
    compareRecommendationBody:
      "Empieza con Cloud Practitioner o AZ-900, luego elige un vendor track y profundiza. Multi-cloud viene después.",

    faqTitle: "FAQ",
    faq: [
      { q: "¿Necesito redes antes de cloud?", a: "No ser experto, pero IP/DNS/routing básico sí." },
      { q: "¿Cloud Practitioner vale en 2026?", a: "Sí, como puerta de entrada a conceptos, costes y security básica." },
      { q: "¿AWS y Azure a la vez?", a: "Al inicio no. Primero uno, luego expandes." },
      { q: "¿Qué ayuda para ser contratado?", a: "Certs + labs + mini proyectos (deploy, IAM, monitoring, costes)." },
    ],

    finalCtaTitle: "🚀 Empieza ahora (forma práctica)",
    finalCtaBody:
      "Lee la ruta una vez y actúa. Empieza con un quiz cloud de entrada y practica de forma constante.",
  },

  fr: {
    title: "Parcours Certifications Cloud 2026",
    subtitle: "De débutant à des compétences cloud utiles",
    intro:
      "Le cloud n’est pas seulement “apprendre AWS”. Il faut des bases (réseau, sécurité, coûts), puis une certif d’entrée, puis architecture/ops. Ce parcours donne un ordre pratique.",

    ctaPrimary: "Commencer avec AWS Cloud Practitioner",
    ctaSecondary: "Voir les certifications Cloud",

    goalLabel: "Objectif :",
    practiceCta: "S’entraîner",

    levels: [
      {
        title: "🟢 Niveau 0 — Aucune base IT",
        body:
          "Si vous débutez, comprenez d’abord le réseau de base, DNS et les concepts de sécurité avant les services cloud.",
        recommended: ["Fondamentaux IT", "Réseau de base (IP, DNS, routage)", "Sécurité de base"],
        goal: "Comprendre le cloud sans naviguer au hasard.",
      },
      {
        title: "🟡 Niveau 1 — Fondamentaux Cloud (entrée)",
        body:
          "Choisissez une certif d’entrée qui explique modèles cloud, responsabilité partagée, services de base et pricing.",
        recommended: ["AWS Cloud Practitioner", "Microsoft Azure Fundamentals (AZ-900)"],
        goal: "Comprendre concepts cloud, prix, identité de base et services principaux.",
        ctaQuizSlug: "aws-cloud-practitioner",
        ctaText: "S’entraîner Cloud Practitioner",
      },
      {
        title: "🟠 Niveau 2 — Choisissez un vendor et approfondissez",
        body:
          "Choisissez UN vendor (AWS ou Azure ou Google Cloud). La profondeur bat les badges dispersés.",
        recommended: [
          "AWS Solutions Architect (après Practitioner)",
          "Parcours Azure après AZ-900",
          "Parcours Google Cloud fundamentals",
        ],
        goal: "Développer de vraies compétences : architecture, storage, réseau, IAM, coûts.",
        ctaQuizSlug: "microsoft-azure-fundamentals",
        ctaText: "S’entraîner Azure Fundamentals",
      },
      {
        title: "🔴 Niveau 3 — Ops & multi-cloud (avancé)",
        body:
          "Après la base, apprenez les ops : déploiement, monitoring, troubleshooting, gouvernance, multi-cloud de base.",
        recommended: ["CompTIA Cloud+ (ops)", "Cloud security basics", "CI/CD & automatisation (bases)"],
        goal: "Être job-ready pour cloud ops et dépannage réel.",
        ctaQuizSlug: "comptia-cloud-plus",
        ctaText: "S’entraîner Cloud+",
      },
    ],

    salaryTitle: "💰 Salary outlook Cloud (2026)",
    salaryIntro:
      "Fourchettes mondiales indicatives (selon pays, expérience, entreprise).",
    salaryRanges: [
      { label: "Entry-level", range: "$55k–$80k" },
      { label: "Mid-level", range: "$85k–$120k" },
      { label: "Senior / Architect", range: "$130k+" },
    ],
    salaryDisclaimer:
      "Note : ça varie beaucoup. Certifs + labs + projets font la différence.",

    compareTitle: "🔍 AWS vs Azure vs Google Cloud — lequel choisir ?",
    compareIntro:
      "Tous sont pertinents. Le meilleur choix dépend du marché et de vos objectifs. Clé : en choisir un et approfondir d’abord.",
    compareLeftTitle: "Un vendor (profond)",
    compareRightTitle: "Plusieurs vendors (superficiel)",
    compareRows: [
      { label: "Vitesse", left: "Progression plus rapide", right: "Progression plus lente" },
      { label: "Compétences", left: "Plus solides", right: "Plus de confusion" },
      { label: "Approche", left: "1 vendor → puis étendre", right: "Ne pas commencer ainsi" },
    ],
    compareRecommendationTitle: "Recommandation",
    compareRecommendationBody:
      "Commencez par Cloud Practitioner ou AZ-900, puis choisissez un vendor track et approfondissez. Multi-cloud ensuite.",

    faqTitle: "FAQ",
    faq: [
      { q: "Faut-il le réseau avant le cloud ?", a: "Pas besoin d’être expert, mais IP/DNS/routage de base oui." },
      { q: "Cloud Practitioner vaut en 2026 ?", a: "Oui, comme entrée : concepts, coûts et sécurité de base." },
      { q: "AWS et Azure en même temps ?", a: "Au début non. D’abord un, puis vous élargissez." },
      { q: "Qu’est-ce qui aide à être recruté ?", a: "Certifs + labs + mini projets (déploiement, IAM, monitoring, coûts)." },
    ],

    finalCtaTitle: "🚀 Commencez maintenant (concret)",
    finalCtaBody:
      "Lisez le parcours une fois, puis passez à l’action. Commencez par un quiz cloud d’entrée et pratiquez régulièrement.",
  },
};
