import Link from "next/link";

type Locale = "it" | "en" | "es" | "fr";

export default function NetworkingRoadmapPage({ lang }: { lang: Locale }) {
  const t = CONTENT[lang];

  // Quiz SEMPRE con /{lang} (EN incluso)
  const quiz = (slug: "network-plus" | "ccna") => `/${lang}/quiz/${slug}`;

  // Hub non localizzati (come hai impostato tu)
  const hubNetworking = "/hub/networking";

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      {/* HERO */}
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{t.title}</h1>
        <p className="mt-2 text-lg text-slate-600">{t.subtitle}</p>
        <p className="mt-5 text-slate-700 leading-relaxed">{t.intro}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={quiz("network-plus")}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 transition"
          >
            {t.ctaPrimary}
          </Link>

          <Link
            href={hubNetworking}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-800 hover:bg-slate-50 transition"
          >
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
                <th className="border-b border-slate-200 py-2 pr-4"></th>
                <th className="border-b border-slate-200 py-2 pr-4 font-bold">{t.compareLeftTitle}</th>
                <th className="border-b border-slate-200 py-2 font-bold">{t.compareRightTitle}</th>
              </tr>
            </thead>
            <tbody>
              {t.compareRows.map((row) => (
                <tr key={row.label} className="align-top">
                  <td className="border-b border-slate-100 py-3 pr-4 font-semibold text-slate-700">
                    {row.label}
                  </td>
                  <td className="border-b border-slate-100 py-3 pr-4 text-slate-700">{row.left}</td>
                  <td className="border-b border-slate-100 py-3 text-slate-700">{row.right}</td>
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
          <Link
            href={quiz("network-plus")}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 transition"
          >
            {t.ctaPrimary}
          </Link>
          <Link
            href={hubNetworking}
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
      ctaQuizSlug?: "network-plus" | "ccna";
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
    title: "Networking Certification Roadmap 2026",
    subtitle: "From beginner to job-ready networking skills",
    intro:
      "Want a real networking path (not random certifications)? This roadmap gives you a practical order—from IT basics to CCNA and specialization. The goal: become someone who can troubleshoot networks in the real world.",

    ctaPrimary: "Start with Network+ quiz",
    ctaSecondary: "Browse networking certifications",

    goalLabel: "Goal:",
    practiceCta: "Practice now",

    levels: [
      {
        title: "🟢 Level 0 — No IT background",
        body:
          "If you’re new to IT, start with fundamentals. Networking makes more sense when you understand devices, OS basics, and troubleshooting.",
        recommended: ["CompTIA ITF+ (or equivalent IT basics)", "Basic OS troubleshooting skills"],
        goal: "Build a solid base before diving into networking details.",
      },
      {
        title: "🟡 Level 1 — Core networking fundamentals",
        body:
          "Learn IP addressing, subnetting basics, DNS, DHCP, routing, switching, and Wi-Fi fundamentals. This is your foundation.",
        recommended: ["CompTIA Network+", "Cisco CCST (Networking)"],
        goal: "Be able to troubleshoot connectivity and core services.",
        ctaQuizSlug: "network-plus",
        ctaText: "Practice Network+ quiz",
      },
      {
        title: "🟠 Level 2 — Cisco track (hands-on)",
        body:
          "If you want a stronger practical/enterprise path, move to Cisco and do labs. CCNA gives depth in routing/switching and real scenarios.",
        recommended: ["CCNA"],
        goal: "Improve hands-on skills with labs and configuration tasks.",
        ctaQuizSlug: "ccna",
        ctaText: "Practice CCNA quiz",
      },
      {
        title: "🔴 Level 3 — Specialization",
        body:
          "Now pick a direction: network security, cloud networking, load balancing (F5), Juniper, wireless, or automation.",
        recommended: [
          "Security+ (baseline security)",
          "Cloud networking (AWS/Azure/GCP)",
          "F5 / ADC fundamentals",
          "Juniper (advanced routing paths)",
          "Network automation basics",
        ],
        goal: "Add depth in one direction while keeping fundamentals solid.",
      },
    ],

    salaryTitle: "💰 Networking salary outlook (2026)",
    salaryIntro:
      "Typical global ranges (highly dependent on country, experience, and company). Use this as orientation, not a promise.",
    salaryRanges: [
      { label: "Entry-level", range: "$45k–$65k" },
      { label: "Mid-level", range: "$70k–$100k" },
      { label: "Senior / Specialist", range: "$110k+" },
    ],
    salaryDisclaimer:
      "Disclaimer: ranges vary widely. Certifications help most when combined with labs and consistent practice.",

    compareTitle: "🔍 Network+ vs CCNA — which one should you do first?",
    compareIntro:
      "Both are great. Network+ is broader and easier to start with. CCNA is more hands-on and deeper, especially for Cisco environments.",
    compareLeftTitle: "Network+",
    compareRightTitle: "CCNA",
    compareRows: [
      { label: "Best for", left: "Broad foundations", right: "Hands-on enterprise depth" },
      { label: "Difficulty", left: "Beginner to intermediate", right: "Intermediate (more lab-heavy)" },
      { label: "Recommended order", left: "Start here if unsure", right: "Do after fundamentals" },
    ],
    compareRecommendationTitle: "Recommendation",
    compareRecommendationBody:
      "Start with Network+ if you want the clean foundation. Choose CCNA next if you want a stronger hands-on track.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "Do I need Network+ before CCNA?",
        a: "Not mandatory, but recommended if you’re new. It makes CCNA concepts easier to digest.",
      },
      {
        q: "Is subnetting still important in 2026?",
        a: "Yes. Even in cloud environments, networking basics (IP, routing, DNS) remain critical.",
      },
      {
        q: "How do I get practical experience without a job?",
        a: "Use labs (Packet Tracer, GNS3, home lab) and practice troubleshooting scenarios regularly.",
      },
      {
        q: "Is networking still a good career path?",
        a: "Yes—especially when combined with cloud and security. Strong troubleshooting skills are always needed.",
      },
    ],

    finalCtaTitle: "🚀 Start now (the practical way)",
    finalCtaBody:
      "Read the roadmap once, then act. Consistent practice beats endless planning—start with the Network+ quiz and build from there.",
  },

  it: {
    title: "Roadmap Certificazioni Networking 2026",
    subtitle: "Da principiante a competenze di rete spendibili",
    intro:
      "Vuoi un percorso networking vero (non certificazioni a caso)? Questa roadmap propone un ordine pratico: dalle basi IT fino a CCNA e specializzazioni. Obiettivo: diventare una persona che sa fare troubleshooting di rete sul serio.",

    ctaPrimary: "Inizia col quiz Network+",
    ctaSecondary: "Vedi le certificazioni Networking",

    goalLabel: "Obiettivo:",
    practiceCta: "Allenati ora",

    levels: [
      {
        title: "🟢 Livello 0 — Nessuna base IT",
        body:
          "Se parti da zero, fai prima fondamenta IT. Il networking diventa molto più chiaro quando sai come funzionano dispositivi e sistemi operativi.",
        recommended: ["CompTIA ITF+ (o basi equivalenti)", "Troubleshooting OS di base"],
        goal: "Costruire una base solida prima di entrare nei dettagli di rete.",
      },
      {
        title: "🟡 Livello 1 — Fondamenti networking",
        body:
          "IP, subnetting base, DNS, DHCP, routing, switching e Wi-Fi: questa è la base.",
        recommended: ["CompTIA Network+", "Cisco CCST (Networking)"],
        goal: "Saper diagnosticare connettività e servizi fondamentali.",
        ctaQuizSlug: "network-plus",
        ctaText: "Quiz Network+",
      },
      {
        title: "🟠 Livello 2 — Percorso Cisco (pratico)",
        body:
          "Se vuoi più pratica e valore enterprise, passa a Cisco e fai lab. CCNA ti dà profondità su routing/switching e scenari reali.",
        recommended: ["CCNA"],
        goal: "Aumentare le skill hands-on con lab e configurazioni.",
        ctaQuizSlug: "ccna",
        ctaText: "Quiz CCNA",
      },
      {
        title: "🔴 Livello 3 — Specializzazione",
        body:
          "Scegli una direzione: network security, cloud networking, load balancing (F5), Juniper, wireless o automazione.",
        recommended: [
          "Security+ (base sicurezza)",
          "Cloud networking (AWS/Azure/GCP)",
          "F5 / ADC fundamentals",
          "Juniper (routing avanzato)",
          "Network automation basics",
        ],
        goal: "Diventare forte in un’area senza perdere le fondamenta.",
      },
    ],

    salaryTitle: "💰 Salary outlook Networking (2026)",
    salaryIntro:
      "Range globali indicativi (dipendono molto da paese, esperienza e azienda). Orientamento, non promessa.",
    salaryRanges: [
      { label: "Entry-level", range: "$45k–$65k" },
      { label: "Mid-level", range: "$70k–$100k" },
      { label: "Senior / Specialist", range: "$110k+" },
    ],
    salaryDisclaimer:
      "Nota: i range variano molto. Le certificazioni rendono di più se abbinate a lab e pratica costante.",

    compareTitle: "🔍 Network+ vs CCNA — quale prima?",
    compareIntro:
      "Entrambe ottime. Network+ è più “basi e panoramica”. CCNA è più pratica e profonda, soprattutto in ambienti Cisco.",
    compareLeftTitle: "Network+",
    compareRightTitle: "CCNA",
    compareRows: [
      { label: "Ideale per", left: "Fondamenta ampie", right: "Profondità enterprise hands-on" },
      { label: "Difficoltà", left: "Base → intermedio", right: "Intermedio (molte lab)" },
      { label: "Ordine consigliato", left: "Parti qui se sei incerto", right: "Dopo le fondamenta" },
    ],
    compareRecommendationTitle: "Consiglio pratico",
    compareRecommendationBody:
      "Se vuoi un percorso pulito: Network+ prima. Poi CCNA se vuoi un track più pratico e forte.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "Serve Network+ prima di CCNA?",
        a: "Non obbligatoria, ma consigliata se sei all’inizio: rende CCNA molto più chiara.",
      },
      {
        q: "Il subnetting conta ancora nel 2026?",
        a: "Sì. Anche nel cloud, basi di rete (IP, routing, DNS) sono fondamentali.",
      },
      {
        q: "Come faccio pratica senza lavoro?",
        a: "Lab (Packet Tracer, GNS3, home lab) + scenari di troubleshooting costanti.",
      },
      {
        q: "Il networking è ancora una buona carriera?",
        a: "Sì, soprattutto se lo unisci a cloud e security: il troubleshooting forte serve sempre.",
      },
    ],

    finalCtaTitle: "🚀 Parti adesso (modo pratico)",
    finalCtaBody:
      "Leggi la roadmap una volta, poi agisci. La pratica costante batte l’overthinking: inizia dal quiz Network+.",
  },

  es: {
    title: "Ruta de Certificaciones de Networking 2026",
    subtitle: "De principiante a habilidades de red útiles",
    intro:
      "¿Quieres un camino de redes real (no certificaciones al azar)? Esta ruta propone un orden práctico: desde fundamentos IT hasta CCNA y especializaciones. Objetivo: aprender troubleshooting de red de verdad.",

    ctaPrimary: "Empezar con el quiz Network+",
    ctaSecondary: "Ver certificaciones de Networking",

    goalLabel: "Objetivo:",
    practiceCta: "Practicar ahora",

    levels: [
      {
        title: "🟢 Nivel 0 — Sin base IT",
        body:
          "Si empiezas de cero, construye fundamentos IT. Redes es más fácil cuando entiendes dispositivos y sistemas operativos.",
        recommended: ["CompTIA ITF+ (o equivalentes)", "Troubleshooting básico de SO"],
        goal: "Crear una base sólida antes de entrar en detalles de red.",
      },
      {
        title: "🟡 Nivel 1 — Fundamentos de redes",
        body:
          "IP, subnetting básico, DNS, DHCP, routing, switching y Wi-Fi: esta es la base.",
        recommended: ["CompTIA Network+", "Cisco CCST (Networking)"],
        goal: "Resolver conectividad y servicios esenciales.",
        ctaQuizSlug: "network-plus",
        ctaText: "Practicar Network+",
      },
      {
        title: "🟠 Nivel 2 — Ruta Cisco (práctica)",
        body:
          "Si quieres un camino más práctico y enterprise, pasa a Cisco y haz labs. CCNA te da profundidad real.",
        recommended: ["CCNA"],
        goal: "Ganar habilidad hands-on con labs y configuración.",
        ctaQuizSlug: "ccna",
        ctaText: "Practicar CCNA",
      },
      {
        title: "🔴 Nivel 3 — Especialización",
        body:
          "Elige una dirección: seguridad, cloud networking, balanceo (F5), Juniper, wireless o automatización.",
        recommended: [
          "Security+ (base)",
          "Cloud networking (AWS/Azure/GCP)",
          "F5 / ADC fundamentals",
          "Juniper (routing avanzado)",
          "Network automation basics",
        ],
        goal: "Profundizar en un área sin perder la base.",
      },
    ],

    salaryTitle: "💰 Salary outlook Networking (2026)",
    salaryIntro:
      "Rangos globales orientativos (dependen del país, experiencia y empresa). Guía, no promesa.",
    salaryRanges: [
      { label: "Entry-level", range: "$45k–$65k" },
      { label: "Mid-level", range: "$70k–$100k" },
      { label: "Senior / Specialist", range: "$110k+" },
    ],
    salaryDisclaimer:
      "Aviso: los rangos varían mucho. Certificaciones + labs + práctica constante es lo que más ayuda.",

    compareTitle: "🔍 Network+ vs CCNA — ¿cuál primero?",
    compareIntro:
      "Network+ es más amplio y accesible. CCNA es más profundo y práctico, especialmente en entornos Cisco.",
    compareLeftTitle: "Network+",
    compareRightTitle: "CCNA",
    compareRows: [
      { label: "Mejor para", left: "Fundamentos amplios", right: "Profundidad enterprise hands-on" },
      { label: "Dificultad", left: "Básico → intermedio", right: "Intermedio (más labs)" },
      { label: "Orden recomendado", left: "Primero si no estás seguro", right: "Después de la base" },
    ],
    compareRecommendationTitle: "Recomendación",
    compareRecommendationBody:
      "Empieza con Network+. Luego CCNA si quieres un camino más práctico y fuerte.",

    faqTitle: "FAQ",
    faq: [
      { q: "¿Necesito Network+ antes de CCNA?", a: "No es obligatorio, pero recomendable si estás empezando." },
      { q: "¿Subnetting sigue importando en 2026?", a: "Sí. Incluso en cloud, IP/routing/DNS siguen siendo clave." },
      { q: "¿Cómo practico sin trabajo?", a: "Labs (Packet Tracer, GNS3) + escenarios de troubleshooting." },
      { q: "¿Networking sigue siendo buena carrera?", a: "Sí, sobre todo combinado con cloud y security." },
    ],

    finalCtaTitle: "🚀 Empieza ahora (forma práctica)",
    finalCtaBody:
      "Lee la ruta una vez y actúa. Empieza con el quiz Network+ y avanza paso a paso.",
  },

  fr: {
    title: "Parcours Certifications Réseaux 2026",
    subtitle: "De débutant à des compétences réseau utiles",
    intro:
      "Vous voulez un vrai parcours réseau (pas des certifs au hasard) ? Ce parcours donne un ordre pratique : des fondamentaux IT à CCNA et aux spécialisations. Objectif : apprendre le dépannage réseau pour de vrai.",

    ctaPrimary: "Commencer avec le quiz Network+",
    ctaSecondary: "Voir les certifications Réseaux",

    goalLabel: "Objectif :",
    practiceCta: "S’entraîner",

    levels: [
      {
        title: "🟢 Niveau 0 — Aucune base IT",
        body:
          "Si vous démarrez de zéro, construisez d’abord des fondamentaux IT. Le réseau devient plus clair avec des bases OS et troubleshooting.",
        recommended: ["CompTIA ITF+ (ou équivalent)", "Dépannage OS de base"],
        goal: "Construire une base solide avant les détails réseau.",
      },
      {
        title: "🟡 Niveau 1 — Fondamentaux réseau",
        body:
          "IP, subnetting de base, DNS, DHCP, routage, switching et Wi-Fi : la base se construit ici.",
        recommended: ["CompTIA Network+", "Cisco CCST (Networking)"],
        goal: "Dépanner la connectivité et les services essentiels.",
        ctaQuizSlug: "network-plus",
        ctaText: "S’entraîner Network+",
      },
      {
        title: "🟠 Niveau 2 — Parcours Cisco (pratique)",
        body:
          "Pour plus de pratique et une valeur enterprise, passez sur Cisco et faites des labs. CCNA donne une vraie profondeur.",
        recommended: ["CCNA"],
        goal: "Gagner du hands-on avec des labs et de la config.",
        ctaQuizSlug: "ccna",
        ctaText: "S’entraîner CCNA",
      },
      {
        title: "🔴 Niveau 3 — Spécialisation",
        body:
          "Choisissez : sécurité, cloud networking, load balancing (F5), Juniper, wireless ou automatisation.",
        recommended: [
          "Security+ (base)",
          "Cloud networking (AWS/Azure/GCP)",
          "F5 / ADC fundamentals",
          "Juniper (routage avancé)",
          "Network automation basics",
        ],
        goal: "Approfondir un domaine sans perdre les bases.",
      },
    ],

    salaryTitle: "💰 Salary outlook Réseaux (2026)",
    salaryIntro:
      "Fourchettes mondiales indicatives (dépend du pays, expérience, entreprise).",
    salaryRanges: [
      { label: "Entry-level", range: "$45k–$65k" },
      { label: "Mid-level", range: "$70k–$100k" },
      { label: "Senior / Specialist", range: "$110k+" },
    ],
    salaryDisclaimer:
      "Note : ça varie beaucoup. Les certifs aident surtout avec des labs et une pratique régulière.",

    compareTitle: "🔍 Network+ vs CCNA — laquelle en premier ?",
    compareIntro:
      "Network+ est plus large et accessible. CCNA est plus深/plus pratique, surtout en environnements Cisco.",
    compareLeftTitle: "Network+",
    compareRightTitle: "CCNA",
    compareRows: [
      { label: "Idéal pour", left: "Fondamentaux larges", right: "Profondeur enterprise hands-on" },
      { label: "Difficulté", left: "Débutant → intermédiaire", right: "Intermédiaire (plus de labs)" },
      { label: "Ordre conseillé", left: "D’abord si vous hésitez", right: "Après les bases" },
    ],
    compareRecommendationTitle: "Recommandation",
    compareRecommendationBody:
      "Commencez par Network+. Puis CCNA si vous voulez un parcours plus pratique et solide.",

    faqTitle: "FAQ",
    faq: [
      { q: "Network+ avant CCNA ?", a: "Pas obligatoire, mais recommandé si vous débutez." },
      { q: "Le subnetting est encore important ?", a: "Oui. Même en cloud, IP/routing/DNS restent essentiels." },
      { q: "Comment pratiquer sans job ?", a: "Labs (Packet Tracer, GNS3) + scénarios de dépannage." },
      { q: "Le réseau est encore une bonne carrière ?", a: "Oui, surtout combiné avec cloud et security." },
    ],

    finalCtaTitle: "🚀 Commencez maintenant (concret)",
    finalCtaBody:
      "Lisez le parcours une fois, puis passez à l’action. Commencez avec le quiz Network+.",
  },
};
