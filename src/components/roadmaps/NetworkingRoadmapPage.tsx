import Link from "next/link";

type Locale = "it" | "en" | "es" | "fr";

type NetQuizSlug =
  | "cisco-ccst-networking"
  | "comptia-network-plus"
  | "ccna"
  | "jncie"
  | "f5";

type NetCertSlug =
  | "cisco-ccst-networking"
  | "comptia-network-plus"
  | "ccna"
  | "jncie"
  | "f5";

export default function NetworkingRoadmapPage({ lang }: { lang: Locale }) {
  const t = CONTENT[lang];

  const quiz = (slug: NetQuizSlug) => `/${lang}/quiz/${slug}`;

  const cert = (slug: NetCertSlug) => {
    if (lang === "it") return `/it/certificazioni/${slug}`;
    if (lang === "fr") return `/fr/certifications/${slug}`;
    if (lang === "es") return `/es/certificaciones/${slug}`;
    return `/certifications/${slug}`;
  };

  const categoryNet =
    lang === "en"
      ? "/categories/networking"
      : lang === "it"
      ? "/it/categorie/reti"
      : lang === "es"
      ? "/es/categorias/redes"
      : "/fr/categories/reseaux";

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      {/* HERO */}
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{t.title}</h1>
        <p className="mt-2 text-lg text-slate-600">{t.subtitle}</p>
        <p className="mt-5 text-slate-700 leading-relaxed">{t.intro}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={quiz("comptia-network-plus")} className="btn-primary">
            {t.ctaPrimary}
          </Link>

          <Link href={categoryNet} className="btn-secondary">
            {t.ctaSecondary}
          </Link>
        </div>
      </header>

      {/* ROADMAP */}
      <section className="space-y-6">
        {t.levels.map((lvl) => (
          <div key={lvl.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
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
                {lvl.ctaQuizSlug && (
                  <Link
                    href={quiz(lvl.ctaQuizSlug)}
                    className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800 transition"
                  >
                    {lvl.ctaPrimaryText ?? t.practiceCta}
                  </Link>
                )}

                {lvl.ctaCertSlug && (
                  <Link
                    href={cert(lvl.ctaCertSlug)}
                    className="text-sm font-medium text-blue-700 underline underline-offset-2 hover:text-blue-800"
                  >
                    {lvl.ctaSecondaryText ?? t.certCta}
                  </Link>
                )}
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
            <div key={r.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
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
                <th></th>
                <th className="font-bold">{t.compareLeftTitle}</th>
                <th className="font-bold">{t.compareRightTitle}</th>
              </tr>
            </thead>
            <tbody>
              {t.compareRows.map((row) => (
                <tr key={row.label}>
                  <td className="font-semibold">{row.label}</td>
                  <td>{row.left}</td>
                  <td>{row.right}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="font-semibold">{t.compareRecommendationTitle}</p>
          <p>{t.compareRecommendationBody}</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-10">
        <h2 className="text-2xl font-extrabold">{t.faqTitle}</h2>
        <div className="mt-4 space-y-4">
          {t.faq.map((f) => (
            <div key={f.q} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
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
          <Link href={quiz("comptia-network-plus")} className="btn-primary">
            {t.ctaPrimary}
          </Link>

          <Link href={categoryNet} className="btn-secondary">
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
      ctaQuizSlug?: NetQuizSlug;
      ctaCertSlug?: NetCertSlug;
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
  it: {
    title: "Roadmap Networking 2026",
    subtitle: "Da zero a networking professionale (senza perdere anni)",
    intro:
      "Il networking è la base di tutto: cloud, cybersecurity, sistemi. Se non capisci come funzionano le reti, qualsiasi altra skill IT resta superficiale. Questa roadmap ti guida passo dopo passo: dalle basi fino a diventare davvero operativo, evitando gli errori più comuni che fanno perdere mesi (o anni).",

    ctaPrimary: "Inizia con Network+",
    ctaSecondary: "Vedi tutte le certificazioni Networking",
    certCta: "Scopri certificazione",

    goalLabel: "Obiettivo:",
    practiceCta: "Allenati ora",

    levels: [
      {
        title: "🟢 Livello 0 — Nessuna base IT",
        body:
          "Se parti da zero, il primo errore è saltare subito sulle certificazioni. Il networking senza basi è solo teoria incomprensibile. Prima devi capire cosa succede davvero quando un dispositivo si connette a internet: indirizzi IP, DNS, gateway, e perché a volte 'non funziona'. Questo livello serve a costruire una mentalità tecnica, non a memorizzare concetti.",
        recommended: [
          "Concetti base IT (hardware e sistemi operativi)",
          "Differenza tra rete locale e internet",
          "DNS, IP e gateway spiegati davvero",
        ],
        goal:
          "Capire cosa succede quando una rete smette di funzionare, senza andare a tentativi.",
      },
      {
        title: "🟡 Livello 1 — Fondamenta Networking reali",
        body:
          "Qui costruisci le fondamenta vere del networking. IP addressing, subnetting, DNS, DHCP, routing e switching non sono teoria: sono gli strumenti base per capire e risolvere problemi reali. Questo è il livello più importante di tutta la roadmap: se lo fai bene, tutto il resto diventa molto più semplice. Se lo fai male, ti porterai confusione avanti per anni.",
        recommended: [
          "Cisco CCST Networking",
          "CompTIA Network+",
        ],
        goal:
          "Essere in grado di diagnosticare problemi di rete base senza indovinare.",
        ctaQuizSlug: "comptia-network-plus",
        ctaCertSlug: "comptia-network-plus",
        ctaPrimaryText: "Inizia il quiz Network+",
        ctaSecondaryText: "Scopri Network+",
      },
      {
        title: "🟠 Livello 2 — Networking operativo (CCNA)",
        body:
          "Qui smetti di essere teorico e inizi a lavorare davvero. CCNA è il punto di svolta: configurazioni, VLAN, routing reale, troubleshooting serio. Non basta capire i concetti, devi applicarli. Questo è il livello in cui inizi a diventare 'job-ready'. Chi arriva qui con basi solide fa un salto enorme rispetto alla media.",
        recommended: ["CCNA"],
        goal:
          "Diventare operativo nel networking con configurazioni e troubleshooting reale.",
        ctaQuizSlug: "ccna",
        ctaCertSlug: "ccna",
        ctaPrimaryText: "Inizia il quiz CCNA",
        ctaSecondaryText: "Scopri CCNA",
      },
      {
        title: "🔴 Livello 3 — Specializzazione",
        body:
          "A questo punto hai le basi per scegliere una direzione. Qui si differenziano le carriere: networking enterprise, load balancing, cloud networking, automazione. Non serve fare tutto: serve diventare forte in una direzione. Questo è il livello in cui inizi a diventare davvero competitivo sul mercato.",
        recommended: [
          "F5 (load balancing e ADC)",
          "Juniper JNCIE (routing avanzato)",
          "Cloud networking (AWS/Azure/GCP)",
        ],
        goal:
          "Diventare uno specialista e aumentare il proprio valore sul mercato.",
        ctaQuizSlug: "jncie",
        ctaCertSlug: "jncie",
        ctaPrimaryText: "Vai su JNCIE",
        ctaSecondaryText: "Scopri JNCIE",
      },
    ],

    salaryTitle: "💰 Quanto si guadagna nel networking (2026)",
    salaryIntro:
      "Il networking è una delle skill più richieste nel mondo IT. I range variano molto per paese ed esperienza, ma chi ha skill reali di troubleshooting e configurazione guadagna significativamente sopra la media.",
    salaryRanges: [
      { label: "Entry-level", range: "€30k–€45k" },
      { label: "Mid-level", range: "€50k–€80k" },
      { label: "Senior / Specialist", range: "€90k+" },
    ],
    salaryDisclaimer:
      "Nota: le certificazioni aiutano, ma la differenza reale la fa la pratica.",

    compareTitle: "🔍 Network+ vs CCNA — quale scegliere?",
    compareIntro:
      "Errore classico: iniziare direttamente da CCNA senza basi. Le due certificazioni servono in momenti diversi del percorso.",
    compareLeftTitle: "Network+",
    compareRightTitle: "CCNA",
    compareRows: [
      {
        label: "Obiettivo",
        left: "Fondamenta networking",
        right: "Networking pratico e operativo",
      },
      {
        label: "Difficoltà",
        left: "Base → intermedio",
        right: "Intermedio (molta pratica)",
      },
      {
        label: "Quando farla",
        left: "All’inizio",
        right: "Dopo le basi",
      },
    ],
    compareRecommendationTitle: "Consiglio pratico",
    compareRecommendationBody:
      "Se parti da zero: Network+ prima, CCNA dopo. Saltare questo ordine è uno degli errori più comuni.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "Serve davvero il networking oggi?",
        a: "Sì. Cloud, cybersecurity e sistemi si basano tutti sul networking.",
      },
      {
        q: "Posso saltare Network+?",
        a: "Solo se hai già basi solide. Altrimenti rischi di bloccarti su CCNA.",
      },
      {
        q: "Serve pratica?",
        a: "Senza pratica il networking non esiste. Devi fare troubleshooting.",
      },
      {
        q: "È ancora una buona carriera?",
        a: "Sì, soprattutto se combinata con cloud e sicurezza.",
      },
    ],

    finalCtaTitle: "🚀 Parti adesso (sul serio)",
    finalCtaBody:
      "Non leggere 10 roadmap diverse. Parti e basta. Il primo passo è il quiz Network+: è lì che inizi davvero.",
  },
  en: {
  title: "Networking Roadmap 2026",
  subtitle: "From zero to real networking skills (without wasting years)",
  intro:
    "Networking is the foundation of everything: cloud, cybersecurity, systems. If you don’t understand networks, every other IT skill stays superficial. This roadmap gives you a practical path from zero to real job-ready skills, avoiding the most common mistakes that slow people down.",

  ctaPrimary: "Start with Network+",
  ctaSecondary: "Browse Networking certifications",
  certCta: "Explore certification",

  goalLabel: "Goal:",
  practiceCta: "Practice now",

  levels: [
    {
      title: "🟢 Level 0 — No IT background",
      body:
        "If you’re starting from zero, jumping straight into certifications is a mistake. Networking without fundamentals feels confusing and abstract. First you need to understand what actually happens when a device connects to the internet: IPs, DNS, gateways, and why things break.",
      recommended: [
        "Basic IT concepts (hardware and OS)",
        "How networks actually work",
        "IP, DNS, and gateway basics",
      ],
      goal:
        "Understand what’s really happening when a network fails, without guessing.",
    },
    {
      title: "🟡 Level 1 — Core networking fundamentals",
      body:
        "This is where you build the real foundation: IP addressing, subnetting, DNS, DHCP, routing, and switching. This is the most important stage of the entire roadmap. If you get this right, everything else becomes easier. If you rush it, confusion will follow you for years.",
      recommended: ["Cisco CCST Networking", "CompTIA Network+"],
      goal:
        "Be able to troubleshoot basic network issues confidently.",
      ctaQuizSlug: "comptia-network-plus",
      ctaCertSlug: "comptia-network-plus",
      ctaPrimaryText: "Start Network+ quiz",
      ctaSecondaryText: "Explore Network+",
    },
    {
      title: "🟠 Level 2 — Real networking (CCNA)",
      body:
        "This is where theory becomes practice. CCNA is the turning point: configuration, VLANs, routing, and real troubleshooting. You’re no longer just understanding — you’re doing. This is where you become job-ready.",
      recommended: ["CCNA"],
      goal:
        "Become operational with real network configuration and troubleshooting.",
      ctaQuizSlug: "ccna",
      ctaCertSlug: "ccna",
      ctaPrimaryText: "Start CCNA quiz",
      ctaSecondaryText: "Explore CCNA",
    },
    {
      title: "🔴 Level 3 — Specialization",
      body:
        "At this point, you choose your direction. Enterprise networking, load balancing, cloud networking, automation. You don’t need to learn everything — you need to go deep in one direction.",
      recommended: [
        "F5 (load balancing)",
        "Juniper JNCIE",
        "Cloud networking",
      ],
      goal:
        "Become a specialist and increase your market value.",
      ctaQuizSlug: "jncie",
      ctaCertSlug: "jncie",
      ctaPrimaryText: "Go to JNCIE",
      ctaSecondaryText: "Explore JNCIE",
    },
  ],

  salaryTitle: "💰 Networking salary outlook (2026)",
  salaryIntro:
    "Networking remains one of the most valuable IT skills. Salaries vary widely, but strong troubleshooting skills are consistently rewarded.",
  salaryRanges: [
    { label: "Entry-level", range: "$40k–$65k" },
    { label: "Mid-level", range: "$70k–$100k" },
    { label: "Senior / Specialist", range: "$110k+" },
  ],
  salaryDisclaimer:
    "Certifications help, but real skills matter more.",

  compareTitle: "🔍 Network+ vs CCNA — which one first?",
  compareIntro:
    "Common mistake: jumping directly into CCNA without foundations.",
  compareLeftTitle: "Network+",
  compareRightTitle: "CCNA",
  compareRows: [
    {
      label: "Purpose",
      left: "Foundations",
      right: "Hands-on networking",
    },
    {
      label: "Difficulty",
      left: "Beginner → intermediate",
      right: "Intermediate",
    },
    {
      label: "When to take",
      left: "Start here",
      right: "After fundamentals",
    },
  ],
  compareRecommendationTitle: "Recommendation",
  compareRecommendationBody:
    "Start with Network+, then move to CCNA. This path is the most effective.",

  faqTitle: "FAQ",
  faq: [
    {
      q: "Is networking still relevant?",
      a: "Yes. Everything in IT relies on networking.",
    },
    {
      q: "Can I skip Network+?",
      a: "Only if you already understand networking basics well.",
    },
    {
      q: "Do I need hands-on practice?",
      a: "Absolutely. Networking is learned by doing.",
    },
  ],

  finalCtaTitle: "🚀 Start now",
  finalCtaBody:
    "Don’t overthink it. Start with Network+ and build from there.",
},
es: {
  title: "Ruta Networking 2026",
  subtitle: "De cero a habilidades reales de redes",
  intro:
    "El networking es la base de todo: cloud, ciberseguridad y sistemas. Si no entiendes las redes, todo lo demás se queda superficial.",

  ctaPrimary: "Empieza con Network+",
  ctaSecondary: "Ver certificaciones",
  certCta: "Ver certificación",

  goalLabel: "Objetivo:",
  practiceCta: "Practicar ahora",

  levels: [
    {
      title: "🟢 Nivel 0 — Sin base IT",
      body:
        "Si empiezas desde cero, necesitas entender cómo funciona internet antes de estudiar certificaciones.",
      recommended: ["IP básico", "DNS", "conceptos de red"],
      goal: "Entender lo esencial.",
    },
    {
      title: "🟡 Nivel 1 — Fundamentos",
      body:
        "Aquí construyes la base real del networking.",
      recommended: ["CCST", "Network+"],
      goal: "Resolver problemas básicos.",
      ctaQuizSlug: "comptia-network-plus",
      ctaCertSlug: "comptia-network-plus",
    },
    {
      title: "🟠 Nivel 2 — CCNA",
      body:
        "Empiezas a trabajar de verdad con redes.",
      recommended: ["CCNA"],
      goal: "Ser operativo.",
      ctaQuizSlug: "ccna",
      ctaCertSlug: "ccna",
    },
    {
      title: "🔴 Nivel 3 — Especialización",
      body:
        "Eliges una dirección profesional.",
      recommended: ["F5", "JNCIE"],
      goal: "Convertirte en especialista.",
    },
  ],

  salaryTitle: "💰 Salario networking",
  salaryIntro: "Rangos aproximados.",
  salaryRanges: [
    { label: "Junior", range: "$40k–$60k" },
    { label: "Mid", range: "$65k–$95k" },
    { label: "Senior", range: "$100k+" },
  ],
  salaryDisclaimer: "Depende de experiencia.",

  compareTitle: "Network+ vs CCNA",
  compareIntro: "No empieces por CCNA sin base.",
  compareLeftTitle: "Network+",
  compareRightTitle: "CCNA",
  compareRows: [
    { label: "Base", left: "Sí", right: "No" },
    { label: "Orden", left: "Primero", right: "Después" },
  ],
  compareRecommendationTitle: "Recomendación",
  compareRecommendationBody:
    "Network+ primero, CCNA después.",

  faqTitle: "FAQ",
  faq: [
    { q: "¿Networking sigue siendo útil?", a: "Sí, es fundamental." },
  ],

  finalCtaTitle: "🚀 Empieza ahora",
  finalCtaBody: "Empieza con Network+.",
},
fr: {
  title: "Parcours Networking 2026",
  subtitle: "De débutant à compétences réseau réelles",
  intro:
    "Le networking est la base de tout en IT.",

  ctaPrimary: "Commencer avec Network+",
  ctaSecondary: "Voir certifications",
  certCta: "Voir certification",

  goalLabel: "Objectif:",
  practiceCta: "S’entraîner",

  levels: [
    {
      title: "🟢 Niveau 0",
      body: "Comprendre les bases réseau.",
      goal: "Bases solides.",
    },
    {
      title: "🟡 Niveau 1",
      body: "Construire les fondamentaux.",
      ctaQuizSlug: "comptia-network-plus",
    },
    {
      title: "🟠 Niveau 2",
      body: "Passer à CCNA.",
      ctaQuizSlug: "ccna",
    },
    {
      title: "🔴 Niveau 3",
      body: "Spécialisation.",
    },
  ],

  salaryTitle: "Salaire",
  salaryIntro: "Indicatif.",
  salaryRanges: [
    { label: "Junior", range: "$40k–$60k" },
    { label: "Senior", range: "$100k+" },
  ],
  salaryDisclaimer: "",

  compareTitle: "Comparaison",
  compareIntro: "",
  compareLeftTitle: "Network+",
  compareRightTitle: "CCNA",
  compareRows: [],
  compareRecommendationTitle: "",
  compareRecommendationBody: "",

  faqTitle: "FAQ",
  faq: [],

  finalCtaTitle: "Commencer",
  finalCtaBody: "Commencez maintenant.",
},
};