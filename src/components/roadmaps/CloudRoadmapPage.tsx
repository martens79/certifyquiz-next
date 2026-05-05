import Link from "next/link";

type Locale = "it" | "en" | "es" | "fr";

type CloudQuizSlug =
  | "aws-cloud-practitioner"
  | "microsoft-azure-fundamentals"
  | "google-cloud"
  | "comptia-cloud-plus"
  | "aws-solutions-architect"
  | "kubernetes";

type CloudCertSlug =
  | "aws-cloud-practitioner"
  | "microsoft-azure-fundamentals"
  | "google-cloud"
  | "comptia-cloud-plus"
  | "aws-solutions-architect"
  | "ibm-cloud-v5"
  | "kubernetes";

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
  subtitle: "From beginner to real cloud job skills",
  intro:
    "Cloud is not just AWS. You need fundamentals, then architecture, then real deployment skills like Kubernetes. This roadmap shows the practical path.",

  ctaPrimary: "Start with AWS quiz",
  ctaSecondary: "Browse cloud certifications",
  certCta: "Explore certification",

  goalLabel: "Goal:",
  practiceCta: "Practice now",

  levels: [
    {
      title: "🟢 Level 0 — No IT basics",
      body:
        "Start with networking, DNS, identity and security before touching cloud.",
      goal: "Understand what happens behind the cloud.",
    },
    {
      title: "🟡 Level 1 — First cloud step",
      body:
        "Learn cloud models, pricing and core services.",
      recommended: ["AWS Cloud Practitioner"],
      ctaQuizSlug: "aws-cloud-practitioner",
      ctaCertSlug: "aws-cloud-practitioner",
    },
    {
      title: "🟠 Level 2 — Second ecosystem",
      body:
        "Expand to Azure to understand real differences.",
      recommended: ["Azure Fundamentals"],
      ctaQuizSlug: "microsoft-azure-fundamentals",
      ctaCertSlug: "microsoft-azure-fundamentals",
    },
    {
      title: "🔴 Level 3 — Architecture",
      body:
        "Design cloud systems: IAM, networking, storage.",
      recommended: ["AWS Solutions Architect"],
      ctaQuizSlug: "aws-solutions-architect",
      ctaCertSlug: "aws-solutions-architect",
    },
    {
      title: "🔵 Level 4 — Kubernetes (CRITICAL)",
      body:
        "Modern cloud = containers + Kubernetes.",
      recommended: ["Kubernetes KCNA"],
      ctaQuizSlug: "kubernetes",
      ctaCertSlug: "kubernetes",
    },
    {
      title: "🟣 Level 5 — Multi-cloud",
      body:
        "Expand your view with Google Cloud.",
      recommended: ["Google Cloud"],
      ctaQuizSlug: "google-cloud",
      ctaCertSlug: "google-cloud",
    },
    {
      title: "⚫ Level 6 — Operations",
      body:
        "Monitoring, troubleshooting and real-world systems.",
      recommended: ["Cloud+"],
      ctaQuizSlug: "comptia-cloud-plus",
      ctaCertSlug: "comptia-cloud-plus",
    },
  ],

  salaryTitle: "💰 Salary outlook",
  salaryIntro: "Cloud salaries grow with real skills.",
  salaryRanges: [
    { label: "Entry", range: "$55k–$80k" },
    { label: "Mid", range: "$85k–$120k" },
    { label: "Senior", range: "$130k+" },
  ],
  salaryDisclaimer: "Depends on country and experience.",

  compareTitle: "AWS vs Azure vs GCP",
  compareIntro: "Go deep in one, then expand.",
  compareLeftTitle: "One vendor",
  compareRightTitle: "Many vendors",
  compareRows: [
    { label: "Speed", left: "Fast", right: "Slow" },
    { label: "Clarity", left: "Clear", right: "Confusing" },
  ],
  compareRecommendationTitle: "Recommendation",
  compareRecommendationBody:
    "Start AWS → Azure → Kubernetes.",

  faqTitle: "FAQ",
  faq: [
    {
      q: "Do I need networking?",
      a: "Yes, basic understanding is essential.",
    },
  ],

  finalCtaTitle: "Start now",
  finalCtaBody: "Follow the roadmap step by step.",
},

it: {
  title: "Roadmap Certificazioni Cloud 2026",
  subtitle: "Da zero a competenze cloud reali",
  intro:
    "Il cloud non è solo AWS. Servono basi, architettura e Kubernetes per diventare davvero job-ready.",

  ctaPrimary: "Inizia con AWS",
  ctaSecondary: "Vedi certificazioni",
  certCta: "Scopri certificazione",

  goalLabel: "Obiettivo:",
  practiceCta: "Allenati",

  levels: [
    {
      title: "🟢 Livello 0 — Base IT",
      body:
        "Impara reti, DNS e sicurezza prima del cloud.",
    },
    {
      title: "🟡 Livello 1 — Primo step",
      body:
        "Fondamenti cloud.",
      recommended: ["AWS Cloud Practitioner"],
      ctaQuizSlug: "aws-cloud-practitioner",
      ctaCertSlug: "aws-cloud-practitioner",
    },
    {
      title: "🟠 Livello 2 — Secondo vendor",
      body:
        "Azure per confronto.",
      recommended: ["Azure Fundamentals"],
      ctaQuizSlug: "microsoft-azure-fundamentals",
      ctaCertSlug: "microsoft-azure-fundamentals",
    },
    {
      title: "🔴 Livello 3 — Architettura",
      body:
        "IAM, networking, storage.",
      recommended: ["AWS Solutions Architect"],
      ctaQuizSlug: "aws-solutions-architect",
      ctaCertSlug: "aws-solutions-architect",
    },
    {
      title: "🔵 Livello 4 — Kubernetes",
      body:
        "Container e deploy reali.",
      recommended: ["Kubernetes KCNA"],
      ctaQuizSlug: "kubernetes",
      ctaCertSlug: "kubernetes",
    },
    {
      title: "🟣 Livello 5 — Multi-cloud",
      body:
        "Google Cloud.",
      recommended: ["Google Cloud"],
      ctaQuizSlug: "google-cloud",
      ctaCertSlug: "google-cloud",
    },
    {
      title: "⚫ Livello 6 — Operations",
      body:
        "Monitoring e troubleshooting.",
      recommended: ["Cloud+"],
      ctaQuizSlug: "comptia-cloud-plus",
      ctaCertSlug: "comptia-cloud-plus",
    },
  ],

  salaryTitle: "💰 Stipendi Cloud",
  salaryIntro: "Crescono con esperienza.",
  salaryRanges: [
    { label: "Junior", range: "$55k–$80k" },
    { label: "Mid", range: "$85k–$120k" },
    { label: "Senior", range: "$130k+" },
  ],
  salaryDisclaimer: "Dipende dal paese.",

  compareTitle: "AWS vs Azure vs GCP",
  compareIntro: "Meglio uno alla volta.",
  compareLeftTitle: "Uno",
  compareRightTitle: "Molti",
  compareRows: [
    { label: "Velocità", left: "Alta", right: "Bassa" },
  ],
  compareRecommendationTitle: "Consiglio",
  compareRecommendationBody:
    "AWS → Azure → Kubernetes.",

  faqTitle: "FAQ",
  faq: [
    {
      q: "Serve networking?",
      a: "Sì, base fondamentale.",
    },
  ],

  finalCtaTitle: "Inizia ora",
  finalCtaBody: "Segui la roadmap.",
},

es: {
  title: "Ruta Cloud 2026",
  subtitle: "De principiante a nivel profesional",
  intro:
    "El cloud requiere bases, arquitectura y Kubernetes.",

  ctaPrimary: "Empezar con AWS",
  ctaSecondary: "Ver certificaciones",
  certCta: "Ver certificación",

  goalLabel: "Objetivo:",
  practiceCta: "Practicar",

  levels: [
    {
      title: "🟢 Nivel 0 — Base IT",
      body: "Redes y seguridad.",
    },
    {
      title: "🟡 Nivel 1 — Inicio",
      body: "Fundamentos cloud.",
      ctaQuizSlug: "aws-cloud-practitioner",
    },
    {
      title: "🟠 Nivel 2 — Azure",
      body: "Segundo proveedor.",
      ctaQuizSlug: "microsoft-azure-fundamentals",
    },
    {
      title: "🔴 Nivel 3 — Arquitectura",
      body: "Diseño cloud.",
      ctaQuizSlug: "aws-solutions-architect",
    },
    {
      title: "🔵 Nivel 4 — Kubernetes",
      body: "Contenedores.",
      ctaQuizSlug: "kubernetes",
    },
    {
      title: "⚫ Nivel 5 — Operaciones",
      body: "Monitorización.",
      ctaQuizSlug: "comptia-cloud-plus",
    },
  ],

  salaryTitle: "Salarios",
  salaryIntro: "Depende experiencia.",
  salaryRanges: [],
  salaryDisclaimer: "",

  compareTitle: "Comparación",
  compareIntro: "",
  compareLeftTitle: "",
  compareRightTitle: "",
  compareRows: [],
  compareRecommendationTitle: "",
  compareRecommendationBody: "",

  faqTitle: "FAQ",
  faq: [],

  finalCtaTitle: "Empieza",
  finalCtaBody: "",
},

fr: {
  title: "Parcours Cloud 2026",
  subtitle: "De débutant à pro",
  intro:
    "Le cloud moderne inclut Kubernetes.",

  ctaPrimary: "Commencer AWS",
  ctaSecondary: "Voir certifications",
  certCta: "Voir certification",

  goalLabel: "Objectif:",
  practiceCta: "Pratiquer",

  levels: [
    {
      title: "🟢 Niveau 0",
      body: "Bases IT.",
    },
    {
      title: "🟡 Niveau 1",
      body: "Cloud basics.",
      ctaQuizSlug: "aws-cloud-practitioner",
    },
    {
      title: "🟠 Niveau 2",
      body: "Azure.",
      ctaQuizSlug: "microsoft-azure-fundamentals",
    },
    {
      title: "🔴 Niveau 3",
      body: "Architecture.",
      ctaQuizSlug: "aws-solutions-architect",
    },
    {
      title: "🔵 Niveau 4",
      body: "Kubernetes.",
      ctaQuizSlug: "kubernetes",
    },
    {
      title: "⚫ Niveau 5",
      body: "Ops.",
      ctaQuizSlug: "comptia-cloud-plus",
    },
  ],

  salaryTitle: "",
  salaryIntro: "",
  salaryRanges: [],
  salaryDisclaimer: "",

  compareTitle: "",
  compareIntro: "",
  compareLeftTitle: "",
  compareRightTitle: "",
  compareRows: [],
  compareRecommendationTitle: "",
  compareRecommendationBody: "",

  faqTitle: "",
  faq: [],

  finalCtaTitle: "",
  finalCtaBody: "",
},
};