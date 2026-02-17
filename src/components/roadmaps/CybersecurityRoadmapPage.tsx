import Link from "next/link";

type Locale = "it" | "en" | "es" | "fr";

export default function CybersecurityRoadmapPage({ lang }: { lang: Locale }) {
  const t = CONTENT[lang];

  const quiz = (slug: "security-plus" | "network-plus") => `/${lang}/quiz/${slug}`;
  const hubSecurity = "/hub/security"; // hub non localizzato (come mi hai impostato)

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
            href={quiz("security-plus")}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 transition"
          >
            {t.ctaPrimary}
          </Link>

          <Link
            href={hubSecurity}
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
        <h2 className="text-xl font-extrabold text-slate-900">
          {t.finalCtaTitle}
        </h2>
        <p className="mt-2 text-slate-700">{t.finalCtaBody}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={quiz("security-plus")}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 transition"
          >
            {t.ctaPrimary}
          </Link>
          <Link
            href={hubSecurity}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-800 hover:bg-slate-50 transition"
          >
            {t.ctaSecondary}
          </Link>
        </div>
      </section>
    </main>
  );
}

/* ----------------------------- CONTENT (NO lang HERE) ----------------------------- */

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
      ctaQuizSlug?: "security-plus" | "network-plus";
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
    title: "Cybersecurity Certification Roadmap 2026",
    subtitle: "From beginner to senior professional",
    intro:
      "Want to work in cybersecurity but unsure where to start? This roadmap gives you a practical order of certifications—from zero IT background to senior roles like CISSP. The goal is simple: build strong layers of knowledge, not random badges.",

    ctaPrimary: "Start with Security+ quiz",
    ctaSecondary: "Browse security certifications",

    goalLabel: "Goal:",
    practiceCta: "Practice now",

    levels: [
      {
        title: "🟢 Level 0 — No IT background",
        body:
          "If you’re not confident with basic networking and operating systems, don’t start with Security+. Build fundamentals first.",
        recommended: ["CompTIA ITF+", "Google IT Support (or similar IT basics)"],
        goal: "Understand how IT infrastructure and devices work in the real world.",
      },
      {
        title: "🟡 Level 1 — Technical foundations (networking first)",
        body:
          "Security without networking knowledge stays theoretical. Learn IP, DNS, routing, and core infrastructure concepts.",
        recommended: ["CompTIA Network+", "Cisco CCST (Networking)"],
        goal: "Be able to reason about traffic, services, and common network failures.",
        ctaQuizSlug: "network-plus",
        ctaText: "Practice Network+ quiz",
      },
      {
        title: "🟠 Level 2 — Core cybersecurity",
        body:
          "Now you’re ready for real security domains: identity, access, cryptography, risk, threat modeling, incident response.",
        recommended: ["CompTIA Security+"],
        goal: "Get the global baseline that HR and hiring managers recognize.",
        ctaQuizSlug: "security-plus",
        ctaText: "Practice Security+ quiz",
      },
      {
        title: "🔴 Level 3 — Specialization",
        body:
          "Pick a direction: offensive (pentest), defensive (blue team), cloud security, or governance. Specialize after you have fundamentals.",
        recommended: ["CEH (offensive leaning)", "CySA+ (defensive leaning)", "Cloud security (AWS/Azure/GCP)"],
        goal: "Build depth in one area and create portfolio-worthy practice.",
      },
      {
        title: "🟣 Level 4 — Senior & architecture",
        body:
          "Senior certifications can be powerful—but only if you have real experience. Don’t rush them too early.",
        recommended: ["CISSP", "CISM", "Security Architect paths"],
        goal: "Move toward enterprise security leadership and architecture.",
      },
    ],

    salaryTitle: "💰 Cybersecurity salary outlook (2026)",
    salaryIntro:
      "Typical global ranges (very dependent on country, experience, and company). Use this as orientation, not a promise.",
    salaryRanges: [
      { label: "Entry-level", range: "$55k–$75k" },
      { label: "Mid-level", range: "$80k–$110k" },
      { label: "Senior / Architect", range: "$120k+" },
    ],
    salaryDisclaimer:
      "Disclaimer: ranges vary widely by location, role, and experience. Certifications help most when combined with hands-on practice.",

    compareTitle: "🔍 Security+ vs CEH — which one first?",
    compareIntro:
      "These two are often confused. Security+ is the baseline. CEH is more offensive-leaning. Most people should start with Security+.",
    compareLeftTitle: "Security+",
    compareRightTitle: "CEH",
    compareRows: [
      { label: "Focus", left: "Foundational security domains", right: "Ethical hacking / offensive concepts" },
      { label: "Hiring", left: "HR-friendly baseline", right: "More niche and technical" },
      { label: "Best time", left: "First cybersecurity cert", right: "After Security+ (and networking basics)" },
    ],
    compareRecommendationTitle: "Recommendation",
    compareRecommendationBody:
      "Start with Security+. Choose CEH next if you want offensive security. If you prefer defensive roles, consider CySA+ after Security+.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "Which cybersecurity certification should I get first?",
        a: "If you know networking basics, start with Security+. If not, do Network+ (or CCST) first.",
      },
      {
        q: "Do I need Network+ before Security+?",
        a: "Not mandatory, but strongly recommended. It makes security concepts easier and more practical.",
      },
      {
        q: "Is CISSP worth it in 2026?",
        a: "Yes—if you have real experience. Without experience, it won’t unlock senior opportunities by itself.",
      },
      {
        q: "Can I get a cybersecurity job without experience?",
        a: "Possible, but harder. Combine certifications with labs, projects, and consistent practice to stand out.",
      },
    ],

    finalCtaTitle: "🚀 Start now (the practical way)",
    finalCtaBody:
      "Read the roadmap once, then take action. Consistent practice beats endless planning—start with the Security+ quiz and build from there.",
  },

  /* NOTE: IT/ES/FR — you already have them; you can paste them here after EN compiles.
     For speed: copy your existing it/es/fr blocks and just remove all *Href* fields,
     keeping only text + ctaQuizSlug where needed.
  */
  it: {
    title: "Percorso Certificazioni Cybersecurity 2026",
    subtitle: "Da principiante a livello senior",
    intro:
      "Vuoi lavorare nella cybersecurity ma non sai da dove iniziare? Questa roadmap propone un ordine pratico delle certificazioni—da zero basi IT fino ai livelli senior (es. CISSP). Obiettivo: costruire competenze a strati, non collezionare badge a caso.",

    ctaPrimary: "Inizia con il quiz Security+",
    ctaSecondary: "Vedi le certificazioni di sicurezza",

    goalLabel: "Obiettivo:",
    practiceCta: "Allenati ora",

    levels: [
      {
        title: "🟢 Livello 0 — Nessuna base IT",
        body:
          "Se non hai confidenza con reti e sistemi operativi, non partire da Security+. Prima crea fondamenta.",
        recommended: ["CompTIA ITF+", "Google IT Support (o basi equivalenti)"],
        goal: "Capire come funziona davvero un’infrastruttura IT.",
      },
      {
        title: "🟡 Livello 1 — Fondamenta tecniche (prima le reti)",
        body:
          "La sicurezza senza networking resta teoria. Impara IP, DNS, routing e concetti fondamentali di infrastruttura.",
        recommended: ["CompTIA Network+", "Cisco CCST (Networking)"],
        goal: "Ragionare su traffico, servizi e problemi tipici di rete.",
        ctaQuizSlug: "network-plus",
        ctaText: "Allenati col quiz Network+",
      },
      {
        title: "🟠 Livello 2 — Cybersecurity core",
        body:
          "Ora sei pronto per i domini reali: identity, access, crittografia, risk, threat model, incident response.",
        recommended: ["CompTIA Security+"],
        goal: "Ottenere la base più riconosciuta da HR e hiring manager.",
        ctaQuizSlug: "security-plus",
        ctaText: "Allenati col quiz Security+",
      },
      {
        title: "🔴 Livello 3 — Specializzazione",
        body:
          "Scegli una direzione: offensive (pentest), defensive (blue team), cloud security o governance. Specializzati dopo le basi.",
        recommended: ["CEH (più offensive)", "CySA+ (più defensive)", "Cloud security (AWS/Azure/GCP)"],
        goal: "Costruire profondità e pratica concreta (labs/progetti).",
      },
      {
        title: "🟣 Livello 4 — Senior & architettura",
        body:
          "Le certificazioni senior sono potenti—ma solo se hai esperienza reale. Non avere fretta.",
        recommended: ["CISSP", "CISM", "Percorsi Security Architect"],
        goal: "Puntare a ruoli enterprise e responsabilità maggiori.",
      },
    ],

    salaryTitle: "💰 Salary outlook Cybersecurity (2026)",
    salaryIntro:
      "Range globali indicativi (dipendono molto da paese, esperienza e azienda). Usali come orientamento, non come promessa.",
    salaryRanges: [
      { label: "Entry-level", range: "$55k–$75k" },
      { label: "Mid-level", range: "$80k–$110k" },
      { label: "Senior / Architect", range: "$120k+" },
    ],
    salaryDisclaimer:
      "Nota: i range variano molto. Le certificazioni contano di più quando sono abbinate a pratica reale e costante.",

    compareTitle: "🔍 Security+ vs CEH — quale prima?",
    compareIntro:
      "Sono due certificazioni spesso confuse: Security+ è la base; CEH è più orientata all’offensive. In genere si parte da Security+.",
    compareLeftTitle: "Security+",
    compareRightTitle: "CEH",
    compareRows: [
      { label: "Focus", left: "Fondamenti di sicurezza", right: "Concetti di ethical hacking" },
      { label: "Hiring", left: "Baseline HR-friendly", right: "Più di nicchia e tecnica" },
      { label: "Quando farla", left: "Prima certificazione security", right: "Dopo Security+ (e basi networking)" },
    ],
    compareRecommendationTitle: "Consiglio pratico",
    compareRecommendationBody:
      "Parti con Security+. Scegli CEH dopo se vuoi offensive. Se preferisci ruoli difensivi, valuta CySA+ dopo Security+.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "Quale certificazione cybersecurity prendere per prima?",
        a: "Se hai basi di networking, parti con Security+. Se no, fai prima Network+ (o CCST).",
      },
      {
        q: "Serve davvero Network+ prima di Security+?",
        a: "Non è obbligatoria, ma è fortemente consigliata: rende tutto più pratico e comprensibile.",
      },
      {
        q: "CISSP vale ancora nel 2026?",
        a: "Sì, ma solo con esperienza. Senza esperienza non sblocca ruoli senior da solo.",
      },
      {
        q: "Posso trovare lavoro senza esperienza?",
        a: "È possibile ma più difficile. Certificazioni + labs/progetti + pratica costante fanno la differenza.",
      },
    ],

    finalCtaTitle: "🚀 Parti adesso (modo pratico)",
    finalCtaBody:
      "Leggi la roadmap una volta, poi fai azione. La pratica costante batte l’overthinking: inizia dal quiz Security+ e costruisci il percorso.",
  },

  es: {
    title: "Ruta de Certificaciones en Ciberseguridad 2026",
    subtitle: "De principiante a nivel senior",
    intro:
      "Esta ruta propone un orden práctico de certificaciones—desde cero base IT hasta niveles senior (por ejemplo, CISSP). Objetivo: construir fundamentos por capas, no coleccionar títulos al azar.",

    ctaPrimary: "Empieza con el quiz Security+",
    ctaSecondary: "Ver certificaciones de seguridad",

    goalLabel: "Objetivo:",
    practiceCta: "Practicar ahora",

    levels: [
      {
        title: "🟢 Nivel 0 — Sin base IT",
        body:
          "Si no dominas redes y sistemas operativos, no empieces con Security+. Construye los fundamentos primero.",
        recommended: ["CompTIA ITF+", "Google IT Support (o equivalentes)"],
        goal: "Entender cómo funciona la infraestructura IT en la práctica.",
      },
      {
        title: "🟡 Nivel 1 — Fundamentos técnicos (redes primero)",
        body:
          "La seguridad sin redes se queda en teoría. Aprende IP, DNS, routing y conceptos clave de infraestructura.",
        recommended: ["CompTIA Network+", "Cisco CCST (Networking)"],
        goal: "Razonar sobre tráfico, servicios y fallos comunes de red.",
        ctaQuizSlug: "network-plus",
        ctaText: "Practicar quiz Network+",
      },
      {
        title: "🟠 Nivel 2 — Núcleo de ciberseguridad",
        body:
          "Identidad, acceso, criptografía, gestión de riesgos, modelos de amenaza e incident response.",
        recommended: ["CompTIA Security+"],
        goal: "Conseguir la base global más reconocida por RR.HH.",
        ctaQuizSlug: "security-plus",
        ctaText: "Practicar quiz Security+",
      },
      {
        title: "🔴 Nivel 3 — Especialización",
        body:
          "Elige: ofensiva (pentest), defensiva (blue team), cloud security o gobernanza. Especialízate después de la base.",
        recommended: ["CEH", "CySA+", "Cloud security (AWS/Azure/GCP)"],
        goal: "Ganar profundidad y práctica real (labs/proyectos).",
      },
      {
        title: "🟣 Nivel 4 — Senior y arquitectura",
        body:
          "Las certificaciones senior son potentes, pero requieren experiencia real. No tengas prisa.",
        recommended: ["CISSP", "CISM"],
        goal: "Apuntar a roles enterprise y liderazgo técnico.",
      },
    ],

    salaryTitle: "💰 Salary outlook en ciberseguridad (2026)",
    salaryIntro:
      "Rangos globales orientativos (dependen del país, experiencia y empresa). Úsalos como guía, no como promesa.",
    salaryRanges: [
      { label: "Entry-level", range: "$55k–$75k" },
      { label: "Mid-level", range: "$80k–$110k" },
      { label: "Senior / Architect", range: "$120k+" },
    ],
    salaryDisclaimer:
      "Aviso: los rangos varían mucho. Las certificaciones funcionan mejor con práctica real y constante.",

    compareTitle: "🔍 Security+ vs CEH — ¿cuál primero?",
    compareIntro:
      "Security+ es la base. CEH es más ofensiva. Normalmente se empieza por Security+.",
    compareLeftTitle: "Security+",
    compareRightTitle: "CEH",
    compareRows: [
      { label: "Enfoque", left: "Fundamentos de seguridad", right: "Ethical hacking / ofensiva" },
      { label: "Hiring", left: "Base reconocida por RR.HH.", right: "Más nicho y técnica" },
      { label: "Momento ideal", left: "Primera cert de security", right: "Después de Security+ (y redes)" },
    ],
    compareRecommendationTitle: "Recomendación",
    compareRecommendationBody:
      "Empieza con Security+. Elige CEH después si quieres ofensiva. Para defensiva, considera CySA+ tras Security+.",

    faqTitle: "FAQ",
    faq: [
      { q: "¿Qué certificación hago primero?", a: "Network+ (si te falta base) y luego Security+." },
      { q: "¿Necesito Network+ antes de Security+?", a: "No es obligatorio, pero muy recomendable." },
      { q: "¿CISSP vale la pena en 2026?", a: "Sí, pero con experiencia real." },
      { q: "¿Trabajo sin experiencia?", a: "Posible, pero ayuda combinar cert + labs + práctica." },
    ],

    finalCtaTitle: "🚀 Empieza ahora (forma práctica)",
    finalCtaBody:
      "Lee la ruta una vez y actúa. Empieza con el quiz Security+ y avanza paso a paso.",
  },

  fr: {
    title: "Parcours Certifications Cybersécurité 2026",
    subtitle: "De débutant à niveau senior",
    intro:
      "Ce parcours propose un ordre pratique des certifications—de zéro base IT jusqu’aux niveaux senior (ex. CISSP). Objectif : construire des fondations, pas collectionner des titres au hasard.",

    ctaPrimary: "Commencer avec le quiz Security+",
    ctaSecondary: "Voir les certifications sécurité",

    goalLabel: "Objectif :",
    practiceCta: "S’entraîner",

    levels: [
      {
        title: "🟢 Niveau 0 — Aucune base IT",
        body:
          "Si vous n’êtes pas à l’aise avec les réseaux et les systèmes, ne démarrez pas par Security+. Commencez par les fondamentaux.",
        recommended: ["CompTIA ITF+", "Google IT Support (ou équivalent)"],
        goal: "Comprendre le fonctionnement réel d’une infrastructure IT.",
      },
      {
        title: "🟡 Niveau 1 — Fondations techniques (réseau d’abord)",
        body:
          "Apprenez IP, DNS, routage et concepts clés d’infrastructure.",
        recommended: ["CompTIA Network+", "Cisco CCST (Networking)"],
        goal: "Raisonner sur le trafic, les services et les pannes réseau courantes.",
        ctaQuizSlug: "network-plus",
        ctaText: "S’entraîner avec Network+",
      },
      {
        title: "🟠 Niveau 2 — Cœur cybersécurité",
        body:
          "Identité, accès, cryptographie, risques, modèles de menace, incident response.",
        recommended: ["CompTIA Security+"],
        goal: "Obtenir la base la plus reconnue par le recrutement.",
        ctaQuizSlug: "security-plus",
        ctaText: "S’entraîner avec Security+",
      },
      {
        title: "🔴 Niveau 3 — Spécialisation",
        body:
          "Choisissez : offensive (pentest), défensive (blue team), cloud security ou gouvernance.",
        recommended: ["CEH", "CySA+", "Cloud security (AWS/Azure/GCP)"],
        goal: "Gagner de la profondeur et de la pratique (labs/projets).",
      },
      {
        title: "🟣 Niveau 4 — Senior & architecture",
        body:
          "Les certifications senior sont puissantes, mais exigent une vraie expérience. Ne les précipitez pas.",
        recommended: ["CISSP", "CISM"],
        goal: "Viser l’enterprise et l’architecture sécurité.",
      },
    ],

    salaryTitle: "💰 Salary outlook cybersécurité (2026)",
    salaryIntro:
      "Fourchettes mondiales indicatives (dépend du pays, de l’expérience et de l’entreprise).",
    salaryRanges: [
      { label: "Entry-level", range: "$55k–$75k" },
      { label: "Mid-level", range: "$80k–$110k" },
      { label: "Senior / Architect", range: "$120k+" },
    ],
    salaryDisclaimer:
      "Note : les fourchettes varient beaucoup. Les certifications valent surtout avec une pratique régulière.",

    compareTitle: "🔍 Security+ vs CEH — laquelle en premier ?",
    compareIntro:
      "Security+ est la base. CEH est plus orientée offensive. En général, commencez par Security+.",
    compareLeftTitle: "Security+",
    compareRightTitle: "CEH",
    compareRows: [
      { label: "Focus", left: "Fondamentaux sécurité", right: "Ethical hacking / offensif" },
      { label: "Recrutement", left: "Baseline reconnue", right: "Plus niche et technique" },
      { label: "Moment idéal", left: "Première cert sécurité", right: "Après Security+ (et réseau)" },
    ],
    compareRecommendationTitle: "Recommandation",
    compareRecommendationBody:
      "Commencez par Security+. Choisissez CEH ensuite si vous visez l’offensif. Pour le défensif : CySA+ après Security+.",

    faqTitle: "FAQ",
    faq: [
      { q: "Quelle certification en premier ?", a: "Network+ (si besoin) puis Security+." },
      { q: "Network+ avant Security+ ?", a: "Pas obligatoire, mais fortement recommandé." },
      { q: "CISSP en 2026 ?", a: "Oui, mais avec expérience réelle." },
      { q: "Job sans expérience ?", a: "Possible, mais cert + labs + pratique aident beaucoup." },
    ],

    finalCtaTitle: "🚀 Commencez maintenant (concret)",
    finalCtaBody:
      "Lisez le parcours une fois, puis passez à l’action. Démarrez avec le quiz Security+.",
  },
};
