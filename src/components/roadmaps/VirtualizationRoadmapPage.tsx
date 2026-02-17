import Link from "next/link";

type Locale = "it" | "en" | "es" | "fr";

type QuizSlug = "vmware-vcp" | "microsoft-virtualization";

const quiz = (lang: Locale, slug: QuizSlug) => `/${lang}/quiz/${slug}`;

export default function VirtualizationRoadmapPage({ lang }: { lang: Locale }) {
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
            href={quiz(lang, "vmware-vcp")}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 transition"
          >
            {t.ctaPrimary}
          </Link>

          <Link
            href={quiz(lang, "microsoft-virtualization")}
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
            href={quiz(lang, "vmware-vcp")}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 transition"
          >
            {t.ctaPrimary}
          </Link>
          <Link
            href={quiz(lang, "microsoft-virtualization")}
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
    title: "Virtualization Certification Roadmap 2026",
    subtitle: "From basic VM concepts to job-ready admin skills",
    intro:
      "Virtualization is the backbone of modern infrastructure. This roadmap helps you build real operational skills: VM basics, networking/storage around VMs, troubleshooting, and then a platform path (VMware or Microsoft).",

    ctaPrimary: "Start with VMware VCP quiz",
    ctaSecondary: "Or practice Microsoft Virtualization",

    goalLabel: "Goal:",
    practiceCta: "Practice now",

    levels: [
      {
        title: "🟢 Level 0 — VM fundamentals",
        body:
          "Start with core concepts: what a hypervisor is, how VMs differ from containers, snapshots vs backups, virtual networks, and basic storage concepts.",
        recommended: ["Virtualization basics", "Networking & storage around VMs"],
        goal: "Understand how VMs run and what breaks in real environments.",
      },
      {
        title: "🟡 Level 1 — Admin mindset (operations first)",
        body:
          "Learn what matters on the job: VM provisioning, templates, resource sizing (CPU/RAM), performance checks, backup/restore, and common troubleshooting patterns.",
        recommended: ["Monitoring & capacity", "Backup/restore routines", "Common VM issues"],
        goal: "Be able to keep a VM environment stable and recoverable.",
      },
      {
        title: "🟠 Level 2 — Choose a platform",
        body:
          "Pick a path based on your target environment. VMware is common in enterprise. Microsoft virtualization is frequent where Windows ecosystems dominate.",
        recommended: ["VMware VCP", "Microsoft Virtualization"],
        goal: "Gain platform-specific skills and terminology employers expect.",
        ctaQuizSlug: "vmware-vcp",
        ctaText: "Practice VMware VCP",
      },
      {
        title: "🔴 Level 3 — Advanced: automation & hybrid",
        body:
          "Once you’re stable, add automation and hybrid patterns: scripting, infrastructure-as-code basics, and how virtualization fits with cloud and DR strategies.",
        recommended: ["Automation basics", "Hybrid/DR mindset"],
        goal: "Operate environments efficiently and scale without chaos.",
      },
    ],

    salaryTitle: "💰 Virtualization salary outlook (2026)",
    salaryIntro:
      "Ranges vary a lot by country and role (sysadmin, infra engineer, platform engineer).",
    salaryRanges: [
      { label: "Junior", range: "$45k–$70k" },
      { label: "Mid-level", range: "$75k–$105k" },
      { label: "Senior / Infra", range: "$115k+" },
    ],
    salaryDisclaimer:
      "Virtualization pays best when combined with troubleshooting + automation + real operations experience.",

    compareTitle: "🔍 VMware vs Microsoft virtualization — which to pick?",
    compareIntro:
      "Both are valid. Your best choice depends on where you want to work and what stack companies around you use.",
    compareLeftTitle: "VMware (VCP)",
    compareRightTitle: "Microsoft Virtualization",
    compareRows: [
      { label: "Typical environment", left: "Enterprise datacenters", right: "Windows-centric infra" },
      { label: "Strength", left: "Mature ecosystem & tooling", right: "Strong integration with Windows" },
      { label: "Pick if…", left: "You target enterprise infra roles", right: "You work with Microsoft stacks" },
    ],
    compareRecommendationTitle: "Recommendation",
    compareRecommendationBody:
      "If you’re unsure: start with VMware basics (widely transferable). If your target jobs are Windows-heavy, Microsoft virtualization becomes a fast win.",

    faqTitle: "FAQ",
    faq: [
      { q: "Do I need virtualization for cloud jobs?", a: "It helps a lot. Many cloud concepts are easier if you understand VM networking/storage and failure modes." },
      { q: "VMs vs containers: which first?", a: "VMs first for infrastructure fundamentals. Containers later for app deployment patterns." },
      { q: "Is VCP still worth it?", a: "Yes—especially for enterprise roles, as long as you combine it with hands-on practice." },
      { q: "How do I get practical fast?", a: "Build a mini-lab: create VMs, simulate failures, practice backup/restore, and document what you learned." },
    ],

    finalCtaTitle: "🚀 Start now (the practical way)",
    finalCtaBody:
      "Learn VM fundamentals, practice operations, then choose a platform. Consistent practice beats reading forever—start with a quiz now.",
  },

  it: {
    title: "Roadmap Certificazioni Virtualizzazione 2026",
    subtitle: "Dai concetti base alle competenze operative",
    intro:
      "La virtualizzazione è la spina dorsale dell’infrastruttura moderna. Questa roadmap punta al concreto: concetti VM, rete/storage attorno alle VM, troubleshooting, poi scelta piattaforma (VMware o Microsoft).",

    ctaPrimary: "Inizia con il quiz VMware VCP",
    ctaSecondary: "Oppure allenati su Virtualizzazione Microsoft",

    goalLabel: "Obiettivo:",
    practiceCta: "Allenati ora",

    levels: [
      {
        title: "🟢 Livello 0 — Fondamenti VM",
        body:
          "Hypervisor, differenza tra VM e container, snapshot vs backup, reti virtuali, concetti base di storage.",
        recommended: ["Basi virtualizzazione", "Rete & storage per VM"],
        goal: "Capire come girano le VM e cosa si rompe nella pratica.",
      },
      {
        title: "🟡 Livello 1 — Mentalità da admin (operazioni)",
        body:
          "Provisioning, template, sizing CPU/RAM, controlli performance, backup/restore e troubleshooting tipico.",
        recommended: ["Monitoring & capacity", "Backup/restore", "Problemi tipici VM"],
        goal: "Gestire un ambiente stabile e ripristinabile.",
      },
      {
        title: "🟠 Livello 2 — Scegli una piattaforma",
        body:
          "VMware è molto comune in enterprise. La virtualizzazione Microsoft è frequente in contesti Windows.",
        recommended: ["VMware VCP", "Microsoft Virtualization"],
        goal: "Imparare strumenti e terminologia che le aziende si aspettano.",
        ctaQuizSlug: "vmware-vcp",
        ctaText: "Quiz VMware VCP",
      },
      {
        title: "🔴 Livello 3 — Avanzato: automazione & hybrid",
        body:
          "Poi aggiungi automazione e approccio hybrid: scripting, IaC base, e come la virtualizzazione si integra con cloud e DR.",
        recommended: ["Automation basics", "Hybrid/DR mindset"],
        goal: "Operare in modo efficiente e scalabile.",
      },
    ],

    salaryTitle: "💰 Salary outlook Virtualizzazione (2026)",
    salaryIntro:
      "Range indicativi (dipendono molto da paese e ruolo: sysadmin, infra engineer, platform engineer).",
    salaryRanges: [
      { label: "Junior", range: "$45k–$70k" },
      { label: "Mid-level", range: "$75k–$105k" },
      { label: "Senior / Infra", range: "$115k+" },
    ],
    salaryDisclaimer:
      "Paga di più quando unisci troubleshooting + automazione + pratica operativa.",

    compareTitle: "🔍 VMware vs Microsoft — cosa scegliere?",
    compareIntro:
      "Dipende dal target: enterprise datacenter vs stack Windows predominante.",
    compareLeftTitle: "VMware (VCP)",
    compareRightTitle: "Microsoft Virtualization",
    compareRows: [
      { label: "Ambiente tipico", left: "Datacenter enterprise", right: "Infrastrutture Windows-centric" },
      { label: "Punto forte", left: "Ecosistema maturo", right: "Integrazione con Windows" },
      { label: "Sceglilo se…", left: "Miri a ruoli enterprise", right: "Lavori in stack Microsoft" },
    ],
    compareRecommendationTitle: "Consiglio pratico",
    compareRecommendationBody:
      "Se sei indeciso: parti da VMware (più trasferibile). Se punti a contesti Windows, Microsoft è un win rapido.",

    faqTitle: "FAQ",
    faq: [
      { q: "Serve la virtualizzazione per il cloud?", a: "Aiuta tantissimo: capisci meglio rete/storage e failure mode." },
      { q: "VM o container: cosa prima?", a: "VM prima per fondamenta infrastrutturali. Container dopo." },
      { q: "VCP vale ancora?", a: "Sì, soprattutto in enterprise, se lo abbini a pratica vera." },
      { q: "Come faccio pratica veloce?", a: "Mini-lab: crea VM, simula guasti, fai backup/restore, e documenta." },
    ],

    finalCtaTitle: "🚀 Parti ora (modo pratico)",
    finalCtaBody:
      "Impara i fondamentali, fai operazioni e troubleshooting, poi scegli piattaforma. Inizia con un quiz e vai a colpi di pratica.",
  },

  es: {
    title: "Ruta de Certificaciones de Virtualización 2026",
    subtitle: "De conceptos VM a habilidades operativas",
    intro:
      "La virtualización es clave en infraestructura moderna. Esta ruta es práctica: bases VM, operaciones, y luego plataforma (VMware o Microsoft).",

    ctaPrimary: "Empezar con VMware VCP",
    ctaSecondary: "Practicar virtualización Microsoft",

    goalLabel: "Objetivo:",
    practiceCta: "Practicar",

    levels: [
      {
        title: "🟢 Nivel 0 — Fundamentos VM",
        body:
          "Hypervisor, VM vs contenedores, snapshot vs backup, redes virtuales, storage básico.",
        recommended: ["Bases de virtualización"],
        goal: "Entender cómo funcionan las VM en la práctica.",
      },
      {
        title: "🟡 Nivel 1 — Operaciones",
        body:
          "Provisioning, plantillas, sizing, performance, backup/restore y troubleshooting.",
        recommended: ["Monitoring", "Backup/restore", "Troubleshooting"],
        goal: "Mantener un entorno estable.",
      },
      {
        title: "🟠 Nivel 2 — Elegir plataforma",
        body:
          "VMware es común en enterprise. Microsoft en entornos Windows.",
        recommended: ["VMware VCP", "Microsoft Virtualization"],
        goal: "Aprender herramientas que piden las empresas.",
        ctaQuizSlug: "vmware-vcp",
        ctaText: "Quiz VMware VCP",
      },
      {
        title: "🔴 Nivel 3 — Automatización e híbrido",
        body:
          "Añade automatización y mentalidad híbrida/DR.",
        recommended: ["Automatización básica", "Hybrid/DR"],
        goal: "Escalar sin caos.",
      },
    ],

    salaryTitle: "💰 Salary outlook (2026)",
    salaryIntro: "Rangos orientativos globales.",
    salaryRanges: [
      { label: "Junior", range: "$45k–$70k" },
      { label: "Mid-level", range: "$75k–$105k" },
      { label: "Senior", range: "$115k+" },
    ],
    salaryDisclaimer: "Más valor con troubleshooting + automatización.",

    compareTitle: "🔍 VMware vs Microsoft — ¿cuál elegir?",
    compareIntro: "Depende del stack objetivo.",
    compareLeftTitle: "VMware (VCP)",
    compareRightTitle: "Microsoft",
    compareRows: [
      { label: "Entorno", left: "Enterprise", right: "Windows-centric" },
      { label: "Fuerte", left: "Ecosistema maduro", right: "Integración Windows" },
      { label: "Elige si…", left: "Vas a enterprise", right: "Trabajas con Microsoft" },
    ],
    compareRecommendationTitle: "Recomendación",
    compareRecommendationBody: "Si dudas: VMware primero; si tu mundo es Windows, Microsoft rápido.",

    faqTitle: "FAQ",
    faq: [
      { q: "¿Ayuda para cloud?", a: "Sí: redes/storage y fallos se entienden mejor." },
      { q: "¿VM o contenedores?", a: "VM primero, contenedores después." },
      { q: "¿VCP vale?", a: "Sí, con práctica real." },
      { q: "¿Práctica rápida?", a: "Mini-lab con VM + fallos + backup/restore." },
    ],

    finalCtaTitle: "🚀 Empieza ahora",
    finalCtaBody: "Bases + operaciones + plataforma. Practica ya con un quiz.",
  },

  fr: {
    title: "Parcours Certifications Virtualisation 2026",
    subtitle: "Des concepts VM aux compétences opérationnelles",
    intro:
      "La virtualisation est essentielle. Ce parcours est concret : bases VM, opérations, puis plateforme (VMware ou Microsoft).",

    ctaPrimary: "Commencer avec VMware VCP",
    ctaSecondary: "S’entraîner sur Microsoft Virtualization",

    goalLabel: "Objectif :",
    practiceCta: "S’entraîner",

    levels: [
      {
        title: "🟢 Niveau 0 — Fondamentaux VM",
        body:
          "Hyperviseur, VM vs conteneurs, snapshot vs backup, réseaux virtuels, storage de base.",
        recommended: ["Bases de virtualisation"],
        goal: "Comprendre le fonctionnement réel des VM.",
      },
      {
        title: "🟡 Niveau 1 — Opérations",
        body:
          "Provisioning, templates, sizing, performance, backup/restore, dépannage.",
        recommended: ["Monitoring", "Backup/restore", "Troubleshooting"],
        goal: "Garder un environnement stable.",
      },
      {
        title: "🟠 Niveau 2 — Choisir une plateforme",
        body:
          "VMware est courant en enterprise. Microsoft dans les environnements Windows.",
        recommended: ["VMware VCP", "Microsoft Virtualization"],
        goal: "Apprendre les outils attendus en entreprise.",
        ctaQuizSlug: "vmware-vcp",
        ctaText: "Quiz VMware VCP",
      },
      {
        title: "🔴 Niveau 3 — Automatisation & hybride",
        body:
          "Ajoutez automatisation et logique hybrid/DR.",
        recommended: ["Automation basics", "Hybrid/DR"],
        goal: "Scaler sans chaos.",
      },
    ],

    salaryTitle: "💰 Salary outlook (2026)",
    salaryIntro: "Fourchettes indicatives mondiales.",
    salaryRanges: [
      { label: "Junior", range: "$45k–$70k" },
      { label: "Mid-level", range: "$75k–$105k" },
      { label: "Senior", range: "$115k+" },
    ],
    salaryDisclaimer: "Plus de valeur avec dépannage + automatisation.",

    compareTitle: "🔍 VMware vs Microsoft — quoi choisir ?",
    compareIntro: "Selon votre stack cible.",
    compareLeftTitle: "VMware (VCP)",
    compareRightTitle: "Microsoft",
    compareRows: [
      { label: "Environnement", left: "Enterprise", right: "Windows-centric" },
      { label: "Force", left: "Écosystème mature", right: "Intégration Windows" },
      { label: "Choisir si…", left: "Vous visez l’enterprise", right: "Vous êtes sur Microsoft" },
    ],
    compareRecommendationTitle: "Recommandation",
    compareRecommendationBody: "Si vous hésitez : VMware d’abord ; si Windows partout : Microsoft rapide.",

    faqTitle: "FAQ",
    faq: [
      { q: "Utile pour le cloud ?", a: "Oui : réseau/storage et pannes se comprennent mieux." },
      { q: "VM ou conteneurs ?", a: "VM d’abord, conteneurs ensuite." },
      { q: "VCP vaut le coup ?", a: "Oui, avec pratique réelle." },
      { q: "Pratique rapide ?", a: "Mini-lab : VM + pannes + backup/restore." },
    ],

    finalCtaTitle: "🚀 Commencez maintenant",
    finalCtaBody: "Bases + opérations + plateforme. Lancez un quiz et pratiquez.",
  },
};
