import Link from "next/link";

type Locale = "it" | "en" | "es" | "fr";

type RoadmapQuizSlug = string;
type RoadmapCertSlug = string;

export default function CloudRoadmapPage({ lang }: { lang: Locale }) {
  const t = CONTENT[lang];

  const quiz = (slug: RoadmapQuizSlug) => `/${lang}/quiz/${slug}`;

  const cert = (slug: RoadmapCertSlug) => {
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
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          {t.title}
        </h1>

        <p className="mt-2 text-lg text-slate-600">
          {t.subtitle}
        </p>

        <p className="mt-5 text-slate-700 leading-relaxed">
          {t.intro}
        </p>

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
            <h2 className="text-xl font-bold">
              {lvl.title}
            </h2>

            <p className="mt-2 text-slate-700 leading-relaxed">
              {lvl.body}
            </p>

            {lvl.recommended?.length ? (
              <ul className="mt-3 list-disc pl-5 text-slate-700">
                {lvl.recommended.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            ) : null}

            {lvl.goal ? (
              <p className="mt-3 text-slate-600">
                <span className="font-semibold">
                  {t.goalLabel}
                </span>{" "}
                {lvl.goal}
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

  ctaQuizSlug?: string;
  ctaCertSlug?: string;

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
    title: "Cloud Certification Roadmap 2026",
    subtitle: "From cloud fundamentals to real job-ready skills",
    intro:
      "Cloud is not just learning AWS services by memory. A strong cloud path starts with IT basics, moves through one major provider, adds architecture, then reaches containers, Kubernetes, multi-cloud awareness and operations. This roadmap gives you a practical order to study without jumping randomly between certifications.",

    ctaPrimary: "Start with AWS Cloud Practitioner",
    ctaSecondary: "Browse cloud certifications",
    certCta: "Explore certification",

    goalLabel: "Goal:",
    practiceCta: "Practice now",

    levels: [
      {
        title: "🟢 Level 0 — IT foundations before cloud",
        body:
          "Before opening cloud consoles, build the minimum technical base: operating systems, networking, DNS, identity and basic security. Without these foundations, cloud services look like isolated buttons instead of connected systems.",
        recommended: [
          "Basic operating systems knowledge",
          "Networking fundamentals: IP, DNS, routing",
          "Basic cybersecurity concepts",
          "Identity and access basics",
        ],
        goal: "Understand what cloud services are actually built on.",
      },
      {
        title: "🟡 Level 1 — First cloud foundation",
        body:
          "Start with an entry-level cloud certification. AWS Cloud Practitioner is a good first step because it explains cloud models, shared responsibility, pricing, basic services, global infrastructure and common use cases.",
        recommended: ["AWS Cloud Practitioner"],
        goal: "Build your first real cloud foundation without going too deep too early.",
        ctaQuizSlug: "aws-cloud-practitioner",
        ctaCertSlug: "aws-cloud-practitioner",
        ctaPrimaryText: "Start AWS Cloud Practitioner quiz",
        ctaSecondaryText: "Explore AWS Cloud Practitioner certification",
      },
      {
        title: "🟠 Level 2 — Second cloud ecosystem",
        body:
          "After your first cloud foundation, add a second provider. Azure Fundamentals helps you compare cloud concepts across vendors: identity, compute, storage, governance, pricing and management tools.",
        recommended: ["Microsoft Azure Fundamentals"],
        goal: "Stop thinking in one-vendor terms and understand cloud patterns more broadly.",
        ctaQuizSlug: "microsoft-azure-fundamentals",
        ctaCertSlug: "microsoft-azure-fundamentals",
        ctaPrimaryText: "Start Azure Fundamentals quiz",
        ctaSecondaryText: "Explore Azure Fundamentals certification",
      },
      {
        title: "🔴 Level 3 — Cloud architecture depth",
        body:
          "Now move from basic concepts to design decisions. Architecture means choosing the right storage, networking, IAM, compute, resilience, monitoring and cost model for a real workload.",
        recommended: ["AWS Solutions Architect"],
        goal: "Start thinking like a cloud engineer, not just a cloud user.",
        ctaQuizSlug: "aws-solutions-architect",
        ctaCertSlug: "aws-solutions-architect",
        ctaPrimaryText: "Start AWS Solutions Architect quiz",
        ctaSecondaryText: "Explore AWS Solutions Architect certification",
      },
      {
        title: "🔵 Level 4 — Containers and Kubernetes",
        body:
          "Modern cloud applications are often deployed with containers. Kubernetes is the missing bridge between cloud theory and real-world delivery: Pods, Deployments, Services, scaling, configuration, networking and troubleshooting.",
        recommended: ["Kubernetes KCNA", "Docker basics", "Cloud-native concepts"],
        goal: "Understand how modern applications are deployed, scaled and managed in production.",
        ctaQuizSlug: "kubernetes",
        ctaCertSlug: "kubernetes",
        ctaPrimaryText: "Start Kubernetes quiz",
        ctaSecondaryText: "Explore Kubernetes KCNA certification",
      },
      {
        title: "🟣 Level 5 — Multi-cloud awareness",
        body:
          "Once you understand one provider deeply and Kubernetes as a deployment layer, expand your view with Google Cloud. This strengthens your ability to compare services, architectures and vendor-specific approaches.",
        recommended: ["Google Cloud"],
        goal: "Build broader cloud awareness without becoming superficial.",
        ctaQuizSlug: "google-cloud",
        ctaCertSlug: "google-cloud",
        ctaPrimaryText: "Start Google Cloud quiz",
        ctaSecondaryText: "Explore Google Cloud certification",
      },
      {
        title: "⚫ Level 6 — Operations and troubleshooting",
        body:
          "Cloud jobs are not only about designing diagrams. You must operate systems: monitoring, deployment issues, cost control, governance, backups, security checks and incident troubleshooting.",
        recommended: ["CompTIA Cloud+"],
        goal: "Become more ready for real cloud operations roles.",
        ctaQuizSlug: "comptia-cloud-plus",
        ctaCertSlug: "comptia-cloud-plus",
        ctaPrimaryText: "Start Cloud+ quiz",
        ctaSecondaryText: "Explore CompTIA Cloud+ certification",
      },
      {
        title: "⚪ Optional track — IBM Cloud",
        body:
          "IBM Cloud can be useful in specific enterprise contexts, but it should stay secondary compared to the main path: AWS, Azure, architecture, Kubernetes, Google Cloud and operations.",
        recommended: ["IBM Cloud v5"],
        goal: "Explore a niche cloud ecosystem if it matches your market or company context.",
        ctaCertSlug: "ibm-cloud-v5",
        ctaSecondaryText: "Explore IBM Cloud certification",
      },
    ],

    salaryTitle: "💰 Cloud salary outlook",
    salaryIntro:
      "Cloud roles can pay well, but salary depends on country, experience, real projects and the ability to solve problems, not only on certificates.",
    salaryRanges: [
      { label: "Entry-level", range: "$55k–$80k" },
      { label: "Mid-level", range: "$85k–$120k" },
      { label: "Senior / Architect", range: "$130k+" },
    ],
    salaryDisclaimer:
      "These are broad global ranges. Certifications are more valuable when combined with labs, projects and troubleshooting practice.",

    compareTitle: "🔍 AWS vs Azure vs Google Cloud: which path first?",
    compareIntro:
      "All major providers are valuable. The mistake is trying to learn all of them at the same time before understanding cloud fundamentals.",
    compareLeftTitle: "Deep path",
    compareRightTitle: "Shallow multi-cloud",
    compareRows: [
      {
        label: "Learning",
        left: "Clear progression and stronger fundamentals",
        right: "More confusion and fragmented knowledge",
      },
      {
        label: "Job readiness",
        left: "Better for interviews and practical tasks",
        right: "Harder to prove real ability",
      },
      {
        label: "Best use",
        left: "Start here: one provider, then expand",
        right: "Useful only after foundations are solid",
      },
    ],
    compareRecommendationTitle: "Recommended order",
    compareRecommendationBody:
      "Start with AWS Cloud Practitioner, add Azure Fundamentals, deepen with AWS Solutions Architect, then add Kubernetes and cloud operations.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "Should I learn Kubernetes before cloud?",
        a: "Usually no. Learn basic cloud concepts first, then Kubernetes. Kubernetes makes much more sense when you already understand networking, compute and deployment basics.",
      },
      {
        q: "Is AWS enough to get started?",
        a: "Yes, AWS is a strong first step. But later you should add Azure, Kubernetes and operations skills to become more complete.",
      },
      {
        q: "Where does Cloud+ fit?",
        a: "Cloud+ fits well after fundamentals and architecture because it focuses more on operations, troubleshooting, security and real-world management.",
      },
      {
        q: "What matters most for cloud jobs?",
        a: "Certifications help, but labs, projects, troubleshooting and the ability to explain decisions are what make you credible.",
      },
    ],

    finalCtaTitle: "🚀 Start the practical cloud path",
    finalCtaBody:
      "Do not jump randomly between certifications. Start with the foundation, then build architecture, Kubernetes and operations skills step by step.",
  },

  it: {
    title: "Roadmap Certificazioni Cloud 2026",
    subtitle: "Dalle basi cloud a competenze davvero spendibili",
    intro:
      "Il cloud non significa imparare a memoria i servizi AWS. Un percorso serio parte dalle basi IT, passa da un primo vendor, poi entra nell’architettura, nei container, in Kubernetes, nel multi-cloud e nelle operations. Questa roadmap ti dà un ordine pratico per studiare senza saltare da una certificazione all’altra a caso.",

    ctaPrimary: "Inizia con AWS Cloud Practitioner",
    ctaSecondary: "Vedi le certificazioni Cloud",
    certCta: "Scopri certificazione",

    goalLabel: "Obiettivo:",
    practiceCta: "Allenati ora",

    levels: [
      {
        title: "🟢 Livello 0 — Basi IT prima del cloud",
        body:
          "Prima di entrare nei pannelli cloud, costruisci le fondamenta: sistemi operativi, reti, DNS, identità e sicurezza di base. Senza queste basi, i servizi cloud sembrano pulsanti scollegati invece che parti di un sistema.",
        recommended: [
          "Basi di sistemi operativi",
          "Reti: IP, DNS, routing",
          "Concetti base di cybersecurity",
          "Identità e accessi",
        ],
        goal: "Capire su cosa si appoggiano davvero i servizi cloud.",
      },
      {
        title: "🟡 Livello 1 — Prima base cloud",
        body:
          "Parti con una certificazione entry-level. AWS Cloud Practitioner è un buon primo passo perché spiega modelli cloud, responsabilità condivisa, pricing, servizi principali, infrastruttura globale e casi d’uso comuni.",
        recommended: ["AWS Cloud Practitioner"],
        goal: "Costruire una prima base cloud reale senza andare troppo in profondità troppo presto.",
        ctaQuizSlug: "aws-cloud-practitioner",
        ctaCertSlug: "aws-cloud-practitioner",
        ctaPrimaryText: "Inizia il quiz AWS Cloud Practitioner",
        ctaSecondaryText: "Scopri AWS Cloud Practitioner",
      },
      {
        title: "🟠 Livello 2 — Secondo ecosistema cloud",
        body:
          "Dopo la prima base, aggiungi un secondo provider. Azure Fundamentals ti aiuta a confrontare concetti cloud tra vendor diversi: identità, compute, storage, governance, pricing e strumenti di gestione.",
        recommended: ["Microsoft Azure Fundamentals"],
        goal: "Smettere di ragionare solo in ottica AWS e capire i pattern cloud più generali.",
        ctaQuizSlug: "microsoft-azure-fundamentals",
        ctaCertSlug: "microsoft-azure-fundamentals",
        ctaPrimaryText: "Inizia il quiz Azure Fundamentals",
        ctaSecondaryText: "Scopri Azure Fundamentals",
      },
      {
        title: "🔴 Livello 3 — Architettura cloud",
        body:
          "Ora passi dai concetti base alle decisioni progettuali: storage, networking, IAM, compute, resilienza, monitoraggio e controllo dei costi per workload reali.",
        recommended: ["AWS Solutions Architect"],
        goal: "Iniziare a ragionare da cloud engineer, non solo da utente del cloud.",
        ctaQuizSlug: "aws-solutions-architect",
        ctaCertSlug: "aws-solutions-architect",
        ctaPrimaryText: "Inizia il quiz AWS Solutions Architect",
        ctaSecondaryText: "Scopri AWS Solutions Architect",
      },
      {
        title: "🔵 Livello 4 — Container e Kubernetes",
        body:
          "Le applicazioni cloud moderne vengono spesso distribuite con container. Kubernetes è il ponte tra teoria cloud e delivery reale: Pod, Deployment, Service, scaling, configurazione, networking e troubleshooting.",
        recommended: ["Kubernetes KCNA", "Basi Docker", "Concetti cloud-native"],
        goal: "Capire come le applicazioni moderne vengono distribuite, scalate e gestite in produzione.",
        ctaQuizSlug: "kubernetes",
        ctaCertSlug: "kubernetes",
        ctaPrimaryText: "Inizia il quiz Kubernetes",
        ctaSecondaryText: "Scopri Kubernetes KCNA",
      },
      {
        title: "🟣 Livello 5 — Visione multi-cloud",
        body:
          "Quando conosci bene un provider e hai capito Kubernetes come layer di deployment, amplia la visione con Google Cloud. Questo ti aiuta a confrontare servizi, architetture e approcci diversi.",
        recommended: ["Google Cloud"],
        goal: "Costruire una visione cloud più ampia senza diventare superficiale.",
        ctaQuizSlug: "google-cloud",
        ctaCertSlug: "google-cloud",
        ctaPrimaryText: "Inizia il quiz Google Cloud",
        ctaSecondaryText: "Scopri Google Cloud",
      },
      {
        title: "⚫ Livello 6 — Operations e troubleshooting",
        body:
          "Il lavoro cloud non è solo disegnare architetture. Devi saper gestire sistemi: monitoring, problemi di deploy, costi, governance, backup, controlli di sicurezza e incident troubleshooting.",
        recommended: ["CompTIA Cloud+"],
        goal: "Diventare più pronto per ruoli reali in cloud operations.",
        ctaQuizSlug: "comptia-cloud-plus",
        ctaCertSlug: "comptia-cloud-plus",
        ctaPrimaryText: "Inizia il quiz Cloud+",
        ctaSecondaryText: "Scopri CompTIA Cloud+",
      },
      {
        title: "⚪ Track opzionale — IBM Cloud",
        body:
          "IBM Cloud può essere utile in contesti enterprise specifici, ma deve restare secondario rispetto al percorso principale: AWS, Azure, architettura, Kubernetes, Google Cloud e operations.",
        recommended: ["IBM Cloud v5"],
        goal: "Esplorare un ecosistema cloud di nicchia se utile al tuo mercato o alla tua azienda.",
        ctaCertSlug: "ibm-cloud-v5",
        ctaSecondaryText: "Scopri IBM Cloud",
      },
    ],

    salaryTitle: "💰 Prospettive stipendio nel cloud",
    salaryIntro:
      "I ruoli cloud possono pagare bene, ma lo stipendio dipende da paese, esperienza, progetti reali e capacità di risolvere problemi, non solo dalle certificazioni.",
    salaryRanges: [
      { label: "Entry-level", range: "$55k–$80k" },
      { label: "Mid-level", range: "$85k–$120k" },
      { label: "Senior / Architect", range: "$130k+" },
    ],
    salaryDisclaimer:
      "Sono range globali indicativi. Le certificazioni valgono di più se accompagnate da lab, progetti e pratica di troubleshooting.",

    compareTitle: "🔍 AWS vs Azure vs Google Cloud: da dove partire?",
    compareIntro:
      "Tutti i grandi provider sono validi. L’errore è provare a impararli tutti insieme prima di avere fondamenta solide.",
    compareLeftTitle: "Percorso profondo",
    compareRightTitle: "Multi-cloud superficiale",
    compareRows: [
      {
        label: "Apprendimento",
        left: "Progressione chiara e fondamenta più forti",
        right: "Più confusione e conoscenze frammentate",
      },
      {
        label: "Job readiness",
        left: "Meglio per colloqui e attività pratiche",
        right: "Più difficile dimostrare competenza reale",
      },
      {
        label: "Uso migliore",
        left: "Parti da qui: un provider, poi espandi",
        right: "Utile solo dopo basi solide",
      },
    ],
    compareRecommendationTitle: "Ordine consigliato",
    compareRecommendationBody:
      "Parti da AWS Cloud Practitioner, aggiungi Azure Fundamentals, approfondisci con AWS Solutions Architect, poi inserisci Kubernetes e cloud operations.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "Devo studiare Kubernetes prima del cloud?",
        a: "Di solito no. Prima servono i concetti cloud di base. Kubernetes diventa molto più chiaro quando conosci già networking, compute e deployment.",
      },
      {
        q: "AWS basta per iniziare?",
        a: "Sì, AWS è un ottimo primo passo. Però poi conviene aggiungere Azure, Kubernetes e operations per diventare più completo.",
      },
      {
        q: "Dove si colloca Cloud+?",
        a: "Cloud+ ha senso dopo fondamenta e architettura, perché lavora di più su operations, troubleshooting, sicurezza e gestione reale.",
      },
      {
        q: "Cosa conta davvero per lavorare nel cloud?",
        a: "Le certificazioni aiutano, ma lab, progetti, troubleshooting e capacità di spiegare le scelte tecniche sono ciò che ti rende credibile.",
      },
    ],

    finalCtaTitle: "🚀 Inizia il percorso cloud pratico",
    finalCtaBody:
      "Non saltare a caso tra certificazioni. Parti dalle basi, poi costruisci architettura, Kubernetes e operations passo dopo passo.",
  },

  es: {
    title: "Ruta de Certificaciones Cloud 2026",
    subtitle: "De fundamentos cloud a habilidades realmente útiles",
    intro:
      "Cloud no significa memorizar servicios de AWS. Una ruta sólida empieza con bases IT, sigue con un primer proveedor, entra en arquitectura, contenedores, Kubernetes, visión multi-cloud y operaciones. Esta ruta te da un orden práctico para estudiar sin saltar de una certificación a otra sin criterio.",

    ctaPrimary: "Empezar con AWS Cloud Practitioner",
    ctaSecondary: "Ver certificaciones Cloud",
    certCta: "Ver certificación",

    goalLabel: "Objetivo:",
    practiceCta: "Practicar ahora",

    levels: [
      {
        title: "🟢 Nivel 0 — Bases IT antes del cloud",
        body:
          "Antes de entrar en consolas cloud, construye las bases: sistemas operativos, redes, DNS, identidad y seguridad básica. Sin estas bases, los servicios cloud parecen botones aislados en lugar de partes de un sistema.",
        recommended: [
          "Bases de sistemas operativos",
          "Redes: IP, DNS, routing",
          "Conceptos básicos de ciberseguridad",
          "Identidad y control de acceso",
        ],
        goal: "Entender sobre qué se apoyan realmente los servicios cloud.",
      },
      {
        title: "🟡 Nivel 1 — Primera base cloud",
        body:
          "Empieza con una certificación de entrada. AWS Cloud Practitioner es un buen primer paso porque explica modelos cloud, responsabilidad compartida, pricing, servicios principales, infraestructura global y casos de uso comunes.",
        recommended: ["AWS Cloud Practitioner"],
        goal: "Construir una primera base cloud real sin profundizar demasiado pronto.",
        ctaQuizSlug: "aws-cloud-practitioner",
        ctaCertSlug: "aws-cloud-practitioner",
        ctaPrimaryText: "Empezar quiz AWS Cloud Practitioner",
        ctaSecondaryText: "Ver AWS Cloud Practitioner",
      },
      {
        title: "🟠 Nivel 2 — Segundo ecosistema cloud",
        body:
          "Después de la primera base, añade un segundo proveedor. Azure Fundamentals te ayuda a comparar conceptos cloud entre distintos vendors: identidad, compute, storage, governance, pricing y herramientas de gestión.",
        recommended: ["Microsoft Azure Fundamentals"],
        goal: "Dejar de pensar solo en AWS y entender patrones cloud más generales.",
        ctaQuizSlug: "microsoft-azure-fundamentals",
        ctaCertSlug: "microsoft-azure-fundamentals",
        ctaPrimaryText: "Empezar quiz Azure Fundamentals",
        ctaSecondaryText: "Ver Azure Fundamentals",
      },
      {
        title: "🔴 Nivel 3 — Arquitectura cloud",
        body:
          "Ahora pasas de conceptos básicos a decisiones de diseño: storage, networking, IAM, compute, resiliencia, monitorización y control de costes para workloads reales.",
        recommended: ["AWS Solutions Architect"],
        goal: "Empezar a pensar como cloud engineer, no solo como usuario cloud.",
        ctaQuizSlug: "aws-solutions-architect",
        ctaCertSlug: "aws-solutions-architect",
        ctaPrimaryText: "Empezar quiz AWS Solutions Architect",
        ctaSecondaryText: "Ver AWS Solutions Architect",
      },
      {
        title: "🔵 Nivel 4 — Contenedores y Kubernetes",
        body:
          "Las aplicaciones cloud modernas suelen desplegarse con contenedores. Kubernetes es el puente entre teoría cloud y delivery real: Pods, Deployments, Services, scaling, configuración, redes y troubleshooting.",
        recommended: ["Kubernetes KCNA", "Bases de Docker", "Conceptos cloud-native"],
        goal: "Entender cómo se despliegan, escalan y gestionan aplicaciones modernas en producción.",
        ctaQuizSlug: "kubernetes",
        ctaCertSlug: "kubernetes",
        ctaPrimaryText: "Empezar quiz Kubernetes",
        ctaSecondaryText: "Ver Kubernetes KCNA",
      },
      {
        title: "🟣 Nivel 5 — Visión multi-cloud",
        body:
          "Cuando ya conoces bien un proveedor y entiendes Kubernetes como capa de despliegue, amplía la visión con Google Cloud. Esto te ayuda a comparar servicios, arquitecturas y enfoques distintos.",
        recommended: ["Google Cloud"],
        goal: "Construir una visión cloud más amplia sin volverte superficial.",
        ctaQuizSlug: "google-cloud",
        ctaCertSlug: "google-cloud",
        ctaPrimaryText: "Empezar quiz Google Cloud",
        ctaSecondaryText: "Ver Google Cloud",
      },
      {
        title: "⚫ Nivel 6 — Operaciones y troubleshooting",
        body:
          "El trabajo cloud no es solo diseñar arquitecturas. También debes operar sistemas: monitorización, problemas de despliegue, costes, governance, backups, controles de seguridad e incident troubleshooting.",
        recommended: ["CompTIA Cloud+"],
        goal: "Estar más preparado para roles reales de cloud operations.",
        ctaQuizSlug: "comptia-cloud-plus",
        ctaCertSlug: "comptia-cloud-plus",
        ctaPrimaryText: "Empezar quiz Cloud+",
        ctaSecondaryText: "Ver CompTIA Cloud+",
      },
      {
        title: "⚪ Track opcional — IBM Cloud",
        body:
          "IBM Cloud puede ser útil en contextos enterprise específicos, pero debe quedar como secundario frente a la ruta principal: AWS, Azure, arquitectura, Kubernetes, Google Cloud y operations.",
        recommended: ["IBM Cloud v5"],
        goal: "Explorar un ecosistema cloud de nicho si encaja con tu mercado o empresa.",
        ctaCertSlug: "ibm-cloud-v5",
        ctaSecondaryText: "Ver IBM Cloud",
      },
    ],

    salaryTitle: "💰 Perspectiva salarial en cloud",
    salaryIntro:
      "Los roles cloud pueden estar bien pagados, pero el salario depende del país, experiencia, proyectos reales y capacidad para resolver problemas, no solo de las certificaciones.",
    salaryRanges: [
      { label: "Entry-level", range: "$55k–$80k" },
      { label: "Mid-level", range: "$85k–$120k" },
      { label: "Senior / Architect", range: "$130k+" },
    ],
    salaryDisclaimer:
      "Son rangos globales orientativos. Las certificaciones valen más cuando se combinan con labs, proyectos y práctica de troubleshooting.",

    compareTitle: "🔍 AWS vs Azure vs Google Cloud: ¿por dónde empezar?",
    compareIntro:
      "Todos los grandes proveedores son válidos. El error es intentar aprenderlos todos a la vez antes de tener fundamentos sólidos.",
    compareLeftTitle: "Ruta profunda",
    compareRightTitle: "Multi-cloud superficial",
    compareRows: [
      {
        label: "Aprendizaje",
        left: "Progresión clara y fundamentos más fuertes",
        right: "Más confusión y conocimiento fragmentado",
      },
      {
        label: "Preparación laboral",
        left: "Mejor para entrevistas y tareas prácticas",
        right: "Más difícil demostrar habilidad real",
      },
      {
        label: "Mejor uso",
        left: "Empieza aquí: un proveedor, luego amplía",
        right: "Útil solo después de bases sólidas",
      },
    ],
    compareRecommendationTitle: "Orden recomendado",
    compareRecommendationBody:
      "Empieza con AWS Cloud Practitioner, añade Azure Fundamentals, profundiza con AWS Solutions Architect y luego incorpora Kubernetes y cloud operations.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "¿Debo estudiar Kubernetes antes de cloud?",
        a: "Normalmente no. Primero necesitas conceptos cloud básicos. Kubernetes se entiende mucho mejor cuando ya conoces networking, compute y despliegue.",
      },
      {
        q: "¿AWS es suficiente para empezar?",
        a: "Sí, AWS es un excelente primer paso. Pero después conviene añadir Azure, Kubernetes y operations para ser más completo.",
      },
      {
        q: "¿Dónde encaja Cloud+?",
        a: "Cloud+ encaja después de fundamentos y arquitectura, porque se centra más en operaciones, troubleshooting, seguridad y gestión real.",
      },
      {
        q: "¿Qué importa de verdad para trabajar en cloud?",
        a: "Las certificaciones ayudan, pero labs, proyectos, troubleshooting y la capacidad de explicar decisiones técnicas son lo que te hace creíble.",
      },
    ],

    finalCtaTitle: "🚀 Empieza la ruta cloud práctica",
    finalCtaBody:
      "No saltes entre certificaciones al azar. Empieza por las bases y construye arquitectura, Kubernetes y operations paso a paso.",
  },

  fr: {
    title: "Parcours Certifications Cloud 2026",
    subtitle: "Des bases cloud aux compétences réellement utiles",
    intro:
      "Le cloud ne consiste pas à mémoriser des services AWS. Un parcours solide commence par les bases IT, passe par un premier fournisseur, puis par l’architecture, les conteneurs, Kubernetes, la vision multi-cloud et les opérations. Ce parcours donne un ordre pratique pour étudier sans passer d’une certification à l’autre au hasard.",

    ctaPrimary: "Commencer avec AWS Cloud Practitioner",
    ctaSecondary: "Voir les certifications Cloud",
    certCta: "Voir la certification",

    goalLabel: "Objectif :",
    practiceCta: "S’entraîner maintenant",

    levels: [
      {
        title: "🟢 Niveau 0 — Bases IT avant le cloud",
        body:
          "Avant d’ouvrir des consoles cloud, construisez les bases : systèmes d’exploitation, réseau, DNS, identité et sécurité de base. Sans ces fondations, les services cloud ressemblent à des boutons isolés plutôt qu’à des parties d’un système.",
        recommended: [
          "Bases des systèmes d’exploitation",
          "Réseau : IP, DNS, routage",
          "Concepts de base en cybersécurité",
          "Identité et contrôle d’accès",
        ],
        goal: "Comprendre sur quoi reposent réellement les services cloud.",
      },
      {
        title: "🟡 Niveau 1 — Première base cloud",
        body:
          "Commencez par une certification d’entrée. AWS Cloud Practitioner est un bon premier pas car elle explique les modèles cloud, la responsabilité partagée, le pricing, les services principaux, l’infrastructure globale et les cas d’usage courants.",
        recommended: ["AWS Cloud Practitioner"],
        goal: "Construire une première base cloud réelle sans aller trop loin trop tôt.",
        ctaQuizSlug: "aws-cloud-practitioner",
        ctaCertSlug: "aws-cloud-practitioner",
        ctaPrimaryText: "Commencer le quiz AWS Cloud Practitioner",
        ctaSecondaryText: "Voir AWS Cloud Practitioner",
      },
      {
        title: "🟠 Niveau 2 — Deuxième écosystème cloud",
        body:
          "Après la première base, ajoutez un deuxième fournisseur. Azure Fundamentals vous aide à comparer les concepts cloud entre vendors : identité, compute, storage, gouvernance, pricing et outils de gestion.",
        recommended: ["Microsoft Azure Fundamentals"],
        goal: "Arrêter de penser uniquement AWS et comprendre les patterns cloud plus généraux.",
        ctaQuizSlug: "microsoft-azure-fundamentals",
        ctaCertSlug: "microsoft-azure-fundamentals",
        ctaPrimaryText: "Commencer le quiz Azure Fundamentals",
        ctaSecondaryText: "Voir Azure Fundamentals",
      },
      {
        title: "🔴 Niveau 3 — Architecture cloud",
        body:
          "Vous passez maintenant des concepts de base aux décisions de conception : storage, réseau, IAM, compute, résilience, monitoring et contrôle des coûts pour des workloads réels.",
        recommended: ["AWS Solutions Architect"],
        goal: "Commencer à raisonner comme un cloud engineer, pas seulement comme un utilisateur cloud.",
        ctaQuizSlug: "aws-solutions-architect",
        ctaCertSlug: "aws-solutions-architect",
        ctaPrimaryText: "Commencer le quiz AWS Solutions Architect",
        ctaSecondaryText: "Voir AWS Solutions Architect",
      },
      {
        title: "🔵 Niveau 4 — Conteneurs et Kubernetes",
        body:
          "Les applications cloud modernes sont souvent déployées avec des conteneurs. Kubernetes est le pont entre la théorie cloud et la livraison réelle : Pods, Deployments, Services, scaling, configuration, réseau et troubleshooting.",
        recommended: ["Kubernetes KCNA", "Bases Docker", "Concepts cloud-native"],
        goal: "Comprendre comment les applications modernes sont déployées, mises à l’échelle et gérées en production.",
        ctaQuizSlug: "kubernetes",
        ctaCertSlug: "kubernetes",
        ctaPrimaryText: "Commencer le quiz Kubernetes",
        ctaSecondaryText: "Voir Kubernetes KCNA",
      },
      {
        title: "🟣 Niveau 5 — Vision multi-cloud",
        body:
          "Quand vous connaissez bien un fournisseur et que vous comprenez Kubernetes comme couche de déploiement, élargissez votre vision avec Google Cloud. Cela aide à comparer services, architectures et approches différentes.",
        recommended: ["Google Cloud"],
        goal: "Construire une vision cloud plus large sans devenir superficiel.",
        ctaQuizSlug: "google-cloud",
        ctaCertSlug: "google-cloud",
        ctaPrimaryText: "Commencer le quiz Google Cloud",
        ctaSecondaryText: "Voir Google Cloud",
      },
      {
        title: "⚫ Niveau 6 — Operations et troubleshooting",
        body:
          "Le travail cloud ne consiste pas seulement à dessiner des architectures. Il faut aussi exploiter les systèmes : monitoring, problèmes de déploiement, coûts, gouvernance, backups, contrôles de sécurité et incident troubleshooting.",
        recommended: ["CompTIA Cloud+"],
        goal: "Être mieux préparé pour des rôles réels en cloud operations.",
        ctaQuizSlug: "comptia-cloud-plus",
        ctaCertSlug: "comptia-cloud-plus",
        ctaPrimaryText: "Commencer le quiz Cloud+",
        ctaSecondaryText: "Voir CompTIA Cloud+",
      },
      {
        title: "⚪ Track optionnel — IBM Cloud",
        body:
          "IBM Cloud peut être utile dans certains contextes enterprise, mais il doit rester secondaire par rapport au parcours principal : AWS, Azure, architecture, Kubernetes, Google Cloud et operations.",
        recommended: ["IBM Cloud v5"],
        goal: "Explorer un écosystème cloud de niche s’il correspond à votre marché ou à votre entreprise.",
        ctaCertSlug: "ibm-cloud-v5",
        ctaSecondaryText: "Voir IBM Cloud",
      },
    ],

    salaryTitle: "💰 Perspectives salariales dans le cloud",
    salaryIntro:
      "Les rôles cloud peuvent être bien rémunérés, mais le salaire dépend du pays, de l’expérience, des projets réels et de la capacité à résoudre des problèmes, pas seulement des certifications.",
    salaryRanges: [
      { label: "Entry-level", range: "$55k–$80k" },
      { label: "Mid-level", range: "$85k–$120k" },
      { label: "Senior / Architect", range: "$130k+" },
    ],
    salaryDisclaimer:
      "Ce sont des fourchettes globales indicatives. Les certifications ont plus de valeur lorsqu’elles sont combinées avec des labs, des projets et de la pratique en troubleshooting.",

    compareTitle: "🔍 AWS vs Azure vs Google Cloud : par où commencer ?",
    compareIntro:
      "Tous les grands fournisseurs sont utiles. L’erreur est d’essayer de tout apprendre en même temps avant d’avoir des bases solides.",
    compareLeftTitle: "Parcours profond",
    compareRightTitle: "Multi-cloud superficiel",
    compareRows: [
      {
        label: "Apprentissage",
        left: "Progression claire et bases plus solides",
        right: "Plus de confusion et connaissances fragmentées",
      },
      {
        label: "Préparation à l’emploi",
        left: "Meilleur pour les entretiens et les tâches pratiques",
        right: "Plus difficile de prouver une compétence réelle",
      },
      {
        label: "Meilleur usage",
        left: "Commencez ici : un fournisseur, puis élargissez",
        right: "Utile seulement après des bases solides",
      },
    ],
    compareRecommendationTitle: "Ordre recommandé",
    compareRecommendationBody:
      "Commencez avec AWS Cloud Practitioner, ajoutez Azure Fundamentals, approfondissez avec AWS Solutions Architect, puis ajoutez Kubernetes et cloud operations.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "Faut-il étudier Kubernetes avant le cloud ?",
        a: "En général non. Il faut d’abord les concepts cloud de base. Kubernetes devient beaucoup plus clair quand vous comprenez déjà le réseau, le compute et le déploiement.",
      },
      {
        q: "AWS suffit-il pour commencer ?",
        a: "Oui, AWS est un excellent premier pas. Mais ensuite il faut ajouter Azure, Kubernetes et les operations pour devenir plus complet.",
      },
      {
        q: "Où se place Cloud+ ?",
        a: "Cloud+ se place après les fondamentaux et l’architecture, car il se concentre davantage sur les opérations, le troubleshooting, la sécurité et la gestion réelle.",
      },
      {
        q: "Qu’est-ce qui compte vraiment pour travailler dans le cloud ?",
        a: "Les certifications aident, mais les labs, les projets, le troubleshooting et la capacité à expliquer les décisions techniques rendent votre profil crédible.",
      },
    ],

    finalCtaTitle: "🚀 Commencez le parcours cloud pratique",
    finalCtaBody:
      "Ne sautez pas d’une certification à l’autre au hasard. Commencez par les bases, puis construisez architecture, Kubernetes et operations étape par étape.",
  },
};