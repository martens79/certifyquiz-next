import Link from "next/link";

type Locale = "it" | "en" | "es" | "fr";

type CyberQuizSlug =
  | "isc2-cc"
  | "security-plus"
  | "ceh"
  | "cissp"
  | "cisco-ccst-cybersecurity";

type CyberCertSlug =
  | "isc2-cc"
  | "security-plus"
  | "ceh"
  | "cissp"
  | "cisco-ccst-cybersecurity";

export default function CybersecurityRoadmapPage({ lang }: { lang: Locale }) {
  const t = CONTENT[lang];

  const quiz = (slug: CyberQuizSlug) => `/${lang}/quiz/${slug}`;

  const cert = (slug: CyberCertSlug) => {
    if (lang === "it") return `/it/certificazioni/${slug}`;
    if (lang === "fr") return `/fr/certifications/${slug}`;
    if (lang === "es") return `/es/certificaciones/${slug}`;
    return `/certifications/${slug}`;
  };

  const categoryCyber =
    lang === "en"
      ? "/categories/security"
      : lang === "it"
      ? "/it/categorie/sicurezza"
      : lang === "es"
      ? "/es/categorias/seguridad"
      : "/fr/categories/securite";

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          {t.title}
        </h1>
        <p className="mt-2 text-lg text-slate-600">{t.subtitle}</p>
        <p className="mt-5 text-slate-700 leading-relaxed">{t.intro}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={quiz("isc2-cc")}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 transition"
          >
            {t.ctaPrimary}
          </Link>

          <Link
            href={categoryCyber}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-800 hover:bg-slate-50 transition"
          >
            {t.ctaSecondary}
          </Link>
        </div>
      </header>

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

      <section className="mt-10 rounded-2xl border border-blue-200 bg-blue-50 p-5">
        <h2 className="text-xl font-extrabold text-slate-900">
          {t.finalCtaTitle}
        </h2>
        <p className="mt-2 text-slate-700">{t.finalCtaBody}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={quiz("isc2-cc")}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 transition"
          >
            {t.ctaPrimary}
          </Link>
          <Link
            href={categoryCyber}
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
      ctaQuizSlug?: CyberQuizSlug;
      ctaCertSlug?: CyberCertSlug;
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
    title: "Cybersecurity Certification Roadmap 2026",
    subtitle: "From beginner to real cybersecurity skills",
    intro:
      "Cybersecurity is not just hacking. First you need fundamentals, then an entry certification, then stronger practical and defensive skills. This roadmap gives you a practical order based on the cybersecurity certifications already available on CertifyQuiz.",

    ctaPrimary: "Start with ISC2 CC quiz",
    ctaSecondary: "Browse cybersecurity certifications",
    certCta: "Explore certification",

    goalLabel: "Goal:",
    practiceCta: "Practice now",

    levels: [
  {
    title: "🟢 Level 0 — No IT / security basics",
    body:
      "If you're new, don’t start with hacking tools. First understand networks, systems, and why security exists.",
    recommended: [
      "Basic networking (IP, DNS, routing)",
      "Operating systems basics",
      "Basic security concepts",
    ],
    goal: "Understand systems before securing or attacking them.",
  },
  {
    title: "🟡 Level 1 — Cybersecurity fundamentals (choose your path)",
    body:
      "Start with a beginner certification. You can choose a more theoretical path or a more practical one.",
    recommended: [
      "ISC2 Certified in Cybersecurity (theoretical foundation)",
      "Cisco CCST Cybersecurity (practical foundation)",
    ],
    goal: "Build your first cybersecurity foundation.",
    ctaQuizSlug: "isc2-cc",
    ctaCertSlug: "isc2-cc",
    ctaPrimaryText: "Start ISC2 CC quiz",
    ctaSecondaryText: "Explore ISC2 CC certification",
  },
  {
    title: "🟠 Level 2 — Core security skills",
    body:
      "Move to a complete certification covering threats, vulnerabilities, and security operations.",
    recommended: ["CompTIA Security+"],
    goal: "Understand real-world security.",
    ctaQuizSlug: "security-plus",
    ctaCertSlug: "security-plus",
    ctaPrimaryText: "Start Security+ quiz",
    ctaSecondaryText: "Explore Security+ certification",
  },
  {
    title: "🔴 Level 3 — Offensive security",
    body:
      "Learn attack techniques, vulnerabilities, and penetration testing mindset.",
    recommended: ["CEH"],
    goal: "Understand how attackers think.",
    ctaQuizSlug: "ceh",
    ctaCertSlug: "ceh",
    ctaPrimaryText: "Start CEH quiz",
    ctaSecondaryText: "Explore CEH certification",
  },
  {
    title: "⚫ Level 4 — Senior / architecture",
    body:
      "Move into governance, risk management, and enterprise security design.",
    recommended: ["CISSP"],
    goal: "Think like a security architect.",
    ctaQuizSlug: "cissp",
    ctaCertSlug: "cissp",
    ctaPrimaryText: "Start CISSP quiz",
    ctaSecondaryText: "Explore CISSP certification",
  },
],

    salaryTitle: "💰 Cybersecurity salary outlook (2026)",
    salaryIntro:
      "Typical global ranges vary a lot depending on country, company, and experience. Use them as orientation, not as a promise.",
    salaryRanges: [
      { label: "Entry-level", range: "$50k–$75k" },
      { label: "Mid-level", range: "$80k–$120k" },
      { label: "Senior / Specialist", range: "$130k+" },
    ],
    salaryDisclaimer:
      "Disclaimer: ranges vary widely. Certifications help more when combined with labs, practical exercises, and consistent study.",

    compareTitle: "🔍 Security+ vs CEH vs CISSP — what should you do first?",
    compareIntro:
      "These certifications are useful at different stages. The mistake is choosing a higher-level cert too early.",
    compareLeftTitle: "Progressive path",
    compareRightTitle: "Jump too fast",
    compareRows: [
      { label: "Clarity", left: "Clear growth path", right: "More confusion" },
      { label: "Skills", left: "Stronger foundations", right: "Weak gaps remain" },
      { label: "Outcome", left: "Better long-term growth", right: "Harder progression" },
    ],
    compareRecommendationTitle: "Recommendation",
    compareRecommendationBody:
      "Start with ISC2 CC, then Security+, then expand with CEH or CCST Cybersecurity. Leave CISSP for later.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "Do I need to know networking before cybersecurity?",
        a: "Yes, at least the basics. Without networking, many cyber concepts stay abstract and confusing.",
      },
      {
        q: "Is Security+ better than ISC2 CC?",
        a: "Security+ is broader and stronger, but ISC2 CC is often a better first step for complete beginners.",
      },
      {
        q: "Should I do CEH before Security+?",
        a: "Usually no. Build your defensive and core security foundation first, then move into more offensive content.",
      },
      {
        q: "When should I aim for CISSP?",
        a: "Later, after you already have strong fundamentals and more maturity in security topics.",
      },
    ],

    finalCtaTitle: "🚀 Start now (the practical way)",
    finalCtaBody:
      "Don't overthink it. Start with ISC2 CC, then build step by step into stronger cybersecurity skills.",
  },

  it: {
    title: "Roadmap Certificazioni Cybersecurity 2026",
    subtitle: "Da principiante a competenze cyber reali",
    intro:
      "Cybersecurity non significa solo hacking. Prima servono fondamentali solidi, poi una certificazione entry, poi skill più pratiche e difensive. Questa roadmap ti dà un ordine pratico basato sulle certificazioni cyber già presenti su CertifyQuiz.",

    ctaPrimary: "Inizia col quiz ISC2 CC",
    ctaSecondary: "Vedi le certificazioni Cybersecurity",
    certCta: "Scopri la certificazione",

    goalLabel: "Obiettivo:",
    practiceCta: "Allenati ora",

    levels: [
  {
    title: "🟢 Livello 0 — Nessuna base IT / sicurezza",
    body:
      "Se parti da zero, non iniziare dagli strumenti hacking. Prima capisci reti, sistemi e perché esiste la sicurezza.",
    recommended: [
      "Reti base (IP, DNS, routing)",
      "Basi sistemi operativi",
      "Concetti base di sicurezza",
    ],
    goal: "Capire i sistemi prima di proteggerli.",
  },
  {
    title: "🟡 Livello 1 — Fondamenta cybersecurity (scegli il percorso)",
    body:
      "Parti con una certificazione base. Puoi scegliere tra approccio teorico o pratico.",
    recommended: [
      "ISC2 Certified in Cybersecurity (base teorica)",
      "Cisco CCST Cybersecurity (base pratica)",
    ],
    goal: "Costruire la prima base di cybersecurity.",
    ctaQuizSlug: "isc2-cc",
    ctaCertSlug: "isc2-cc",
    ctaPrimaryText: "Inizia quiz ISC2 CC",
    ctaSecondaryText: "Scopri certificazione ISC2 CC",
  },
  {
    title: "🟠 Livello 2 — Competenze core",
    body:
      "Passa a una certificazione completa su minacce, vulnerabilità e operazioni di sicurezza.",
    recommended: ["CompTIA Security+"],
    goal: "Capire la sicurezza nel mondo reale.",
    ctaQuizSlug: "security-plus",
    ctaCertSlug: "security-plus",
    ctaPrimaryText: "Inizia quiz Security+",
    ctaSecondaryText: "Scopri certificazione Security+",
  },
  {
    title: "🔴 Livello 3 — Offensive security",
    body:
      "Impara tecniche di attacco, vulnerabilità e mindset da penetration tester.",
    recommended: ["CEH"],
    goal: "Capire come ragiona un attaccante.",
    ctaQuizSlug: "ceh",
    ctaCertSlug: "ceh",
    ctaPrimaryText: "Inizia quiz CEH",
    ctaSecondaryText: "Scopri certificazione CEH",
  },
  {
    title: "⚫ Livello 4 — Livello senior",
    body:
      "Arriva a governance, risk management e progettazione della sicurezza.",
    recommended: ["CISSP"],
    goal: "Ragionare da architetto della sicurezza.",
    ctaQuizSlug: "cissp",
    ctaCertSlug: "cissp",
    ctaPrimaryText: "Inizia quiz CISSP",
    ctaSecondaryText: "Scopri certificazione CISSP",
  },
],

    salaryTitle: "💰 Salary outlook Cybersecurity (2026)",
    salaryIntro:
      "I range globali cambiano molto in base a paese, azienda ed esperienza. Usali come orientamento, non come promessa.",
    salaryRanges: [
      { label: "Entry-level", range: "$50k–$75k" },
      { label: "Mid-level", range: "$80k–$120k" },
      { label: "Senior / Specialist", range: "$130k+" },
    ],
    salaryDisclaimer:
      "Nota: i range variano molto. Le certificazioni aiutano di più se combinate con lab, esercizi pratici e studio costante.",

    compareTitle: "🔍 Security+ vs CEH vs CISSP — cosa fare prima?",
    compareIntro:
      "Queste certificazioni sono utili in fasi diverse. L’errore è scegliere troppo presto una cert di livello troppo alto.",
    compareLeftTitle: "Percorso progressivo",
    compareRightTitle: "Salto troppo veloce",
    compareRows: [
      { label: "Chiarezza", left: "Crescita più chiara", right: "Più confusione" },
      { label: "Skill", left: "Basi più forti", right: "Restano lacune" },
      { label: "Risultato", left: "Miglior crescita nel lungo periodo", right: "Progressione più dura" },
    ],
    compareRecommendationTitle: "Consiglio pratico",
    compareRecommendationBody:
      "Parti da ISC2 CC, poi Security+, poi espandi con CEH o CCST Cybersecurity. Lascia CISSP più avanti.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "Serve networking prima della cybersecurity?",
        a: "Sì, almeno le basi. Senza networking molti concetti cyber restano astratti e confusi.",
      },
      {
        q: "Security+ è meglio di ISC2 CC?",
        a: "Security+ è più ampia e forte, ma ISC2 CC è spesso un primo step migliore per chi parte completamente da zero.",
      },
      {
        q: "Conviene fare CEH prima di Security+?",
        a: "Di solito no. Prima costruisci la base difensiva e generale, poi passi a contenuti più offensivi.",
      },
      {
        q: "Quando ha senso puntare a CISSP?",
        a: "Più avanti, quando hai già fondamentali forti e maggiore maturità sui temi di sicurezza.",
      },
    ],

    finalCtaTitle: "🚀 Parti adesso (in modo pratico)",
    finalCtaBody:
      "Non pensarci troppo. Parti da ISC2 CC, poi costruisci passo dopo passo skill cybersecurity più forti.",
  },

  es: {
    title: "Ruta de Certificaciones Cybersecurity 2026",
    subtitle: "De principiante a habilidades cyber reales",
    intro:
      "Cybersecurity no es solo hacking. Primero necesitas fundamentos sólidos, luego una certificación de entrada y después habilidades más prácticas y defensivas. Esta ruta te da un orden práctico basado en las certificaciones cyber ya presentes en CertifyQuiz.",

    ctaPrimary: "Empezar con el quiz ISC2 CC",
    ctaSecondary: "Ver certificaciones Cybersecurity",
    certCta: "Ver certificación",

    goalLabel: "Objetivo:",
    practiceCta: "Practicar ahora",

    levels: [
  {
    title: "🟢 Nivel 0 — Sin base IT / seguridad",
    body:
      "Si empiezas desde cero, no uses herramientas hacking aún. Primero entiende redes y sistemas.",
    recommended: [
      "Redes básicas (IP, DNS, routing)",
      "Fundamentos sistemas",
      "Conceptos de seguridad",
    ],
    goal: "Entender sistemas antes de protegerlos.",
  },
  {
    title: "🟡 Nivel 1 — Fundamentos de ciberseguridad",
    body:
      "Empieza con una certificación básica. Puedes elegir entre enfoque teórico o práctico.",
    recommended: [
      "ISC2 CC (teórico)",
      "Cisco CCST Cybersecurity (práctico)",
    ],
    goal: "Construir una base sólida.",
    ctaQuizSlug: "isc2-cc",
    ctaCertSlug: "isc2-cc",
    ctaPrimaryText: "Empezar quiz ISC2 CC",
    ctaSecondaryText: "Ver certificación ISC2 CC",
  },
  {
    title: "🟠 Nivel 2 — Habilidades clave",
    body:
      "Avanza a una certificación completa sobre amenazas y operaciones.",
    recommended: ["Security+"],
    goal: "Entender la seguridad real.",
    ctaQuizSlug: "security-plus",
    ctaCertSlug: "security-plus",
    ctaPrimaryText: "Empezar quiz Security+",
    ctaSecondaryText: "Ver certificación Security+",
  },
  {
    title: "🔴 Nivel 3 — Seguridad ofensiva",
    body:
      "Aprende técnicas de ataque y mentalidad hacker.",
    recommended: ["CEH"],
    goal: "Pensar como atacante.",
    ctaQuizSlug: "ceh",
    ctaCertSlug: "ceh",
    ctaPrimaryText: "Empezar quiz CEH",
    ctaSecondaryText: "Ver certificación CEH",
  },
  {
    title: "⚫ Nivel 4 — Nivel senior",
    body:
      "Arquitectura, gestión de riesgos y seguridad empresarial.",
    recommended: ["CISSP"],
    goal: "Pensar como arquitecto.",
    ctaQuizSlug: "cissp",
    ctaCertSlug: "cissp",
    ctaPrimaryText: "Empezar quiz CISSP",
    ctaSecondaryText: "Ver certificación CISSP",
  },
],

    salaryTitle: "💰 Salary outlook Cybersecurity (2026)",
    salaryIntro:
      "Los rangos globales cambian mucho según país, empresa y experiencia. Úsalos como orientación, no como promesa.",
    salaryRanges: [
      { label: "Entry-level", range: "$50k–$75k" },
      { label: "Mid-level", range: "$80k–$120k" },
      { label: "Senior / Specialist", range: "$130k+" },
    ],
    salaryDisclaimer:
      "Aviso: los rangos varían mucho. Las certificaciones ayudan más cuando se combinan con labs, ejercicios prácticos y estudio constante.",

    compareTitle: "🔍 Security+ vs CEH vs CISSP — ¿qué hacer primero?",
    compareIntro:
      "Estas certificaciones son útiles en etapas distintas. El error es elegir demasiado pronto una cert de nivel demasiado alto.",
    compareLeftTitle: "Camino progresivo",
    compareRightTitle: "Salto demasiado rápido",
    compareRows: [
      { label: "Claridad", left: "Crecimiento más claro", right: "Más confusión" },
      { label: "Habilidades", left: "Bases más fuertes", right: "Quedan vacíos" },
      { label: "Resultado", left: "Mejor crecimiento a largo plazo", right: "Progresión más difícil" },
    ],
    compareRecommendationTitle: "Recomendación",
    compareRecommendationBody:
      "Empieza con ISC2 CC, luego Security+, después amplía con CEH o CCST Cybersecurity. Deja CISSP para más adelante.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "¿Necesito networking antes de cybersecurity?",
        a: "Sí, al menos lo básico. Sin networking muchos conceptos cyber se quedan abstractos y confusos.",
      },
      {
        q: "¿Security+ es mejor que ISC2 CC?",
        a: "Security+ es más amplia y fuerte, pero ISC2 CC suele ser un mejor primer paso para quien empieza totalmente de cero.",
      },
      {
        q: "¿Conviene hacer CEH antes que Security+?",
        a: "Normalmente no. Primero construye la base defensiva y general, luego pasa a contenido más ofensivo.",
      },
      {
        q: "¿Cuándo tiene sentido apuntar a CISSP?",
        a: "Más adelante, cuando ya tengas fundamentos fuertes y más madurez en temas de seguridad.",
      },
    ],

    finalCtaTitle: "🚀 Empieza ahora (de forma práctica)",
    finalCtaBody:
      "No lo pienses demasiado. Empieza con ISC2 CC y construye paso a paso habilidades cybersecurity más fuertes.",
  },

  fr: {
    title: "Parcours Certifications Cybersecurity 2026",
    subtitle: "De débutant à de vraies compétences cyber",
    intro:
      "La cybersécurité ne se résume pas au hacking. Il faut d’abord des bases solides, puis une certification d’entrée, puis des compétences plus pratiques et défensives. Ce parcours donne un ordre pratique basé sur les certifications cyber déjà présentes sur CertifyQuiz.",

    ctaPrimary: "Commencer avec le quiz ISC2 CC",
    ctaSecondary: "Voir les certifications Cybersecurity",
    certCta: "Voir la certification",

    goalLabel: "Objectif :",
    practiceCta: "S’entraîner",

    levels: [
  {
    title: "🟢 Niveau 0 — Aucune base IT / sécurité",
    body:
      "Si vous débutez, ne commencez pas par le hacking. Comprenez d’abord les systèmes et réseaux.",
    recommended: [
      "Réseaux de base",
      "Systèmes",
      "Concepts sécurité",
    ],
    goal: "Comprendre avant de sécuriser.",
  },
  {
    title: "🟡 Niveau 1 — Fondamentaux cybersécurité",
    body:
      "Commencez avec une certification de base (théorique ou pratique).",
    recommended: [
      "ISC2 CC (théorique)",
      "Cisco CCST Cybersecurity (pratique)",
    ],
    goal: "Construire une base solide.",
    ctaQuizSlug: "isc2-cc",
    ctaCertSlug: "isc2-cc",
    ctaPrimaryText: "Commencer quiz ISC2 CC",
    ctaSecondaryText: "Voir certification ISC2 CC",
  },
  {
    title: "🟠 Niveau 2 — Compétences clés",
    body:
      "Passez à une certification complète sur menaces et opérations.",
    recommended: ["Security+"],
    goal: "Comprendre la sécurité réelle.",
    ctaQuizSlug: "security-plus",
    ctaCertSlug: "security-plus",
    ctaPrimaryText: "Commencer quiz Security+",
    ctaSecondaryText: "Voir certification Security+",
  },
  {
    title: "🔴 Niveau 3 — Sécurité offensive",
    body:
      "Techniques d’attaque et mindset hacker.",
    recommended: ["CEH"],
    goal: "Penser comme attaquant.",
    ctaQuizSlug: "ceh",
    ctaCertSlug: "ceh",
    ctaPrimaryText: "Commencer quiz CEH",
    ctaSecondaryText: "Voir certification CEH",
  },
  {
    title: "⚫ Niveau 4 — Niveau senior",
    body:
      "Architecture, gestion des risques et sécurité entreprise.",
    recommended: ["CISSP"],
    goal: "Penser comme architecte sécurité.",
    ctaQuizSlug: "cissp",
    ctaCertSlug: "cissp",
    ctaPrimaryText: "Commencer quiz CISSP",
    ctaSecondaryText: "Voir certification CISSP",
  },
],
    salaryTitle: "💰 Salary outlook Cybersecurity (2026)",
    salaryIntro:
      "Les fourchettes mondiales changent beaucoup selon le pays, l’entreprise et l’expérience. Utilisez-les comme repère, pas comme promesse.",
    salaryRanges: [
      { label: "Entry-level", range: "$50k–$75k" },
      { label: "Mid-level", range: "$80k–$120k" },
      { label: "Senior / Specialist", range: "$130k+" },
    ],
    salaryDisclaimer:
      "Note : les fourchettes varient beaucoup. Les certifications aident davantage lorsqu’elles sont combinées avec des labs, des exercices pratiques et une étude régulière.",

    compareTitle: "🔍 Security+ vs CEH vs CISSP — quoi faire d’abord ?",
    compareIntro:
      "Ces certifications sont utiles à des étapes différentes. L’erreur est de choisir trop tôt une certification d’un niveau trop élevé.",
    compareLeftTitle: "Parcours progressif",
    compareRightTitle: "Saut trop rapide",
    compareRows: [
      { label: "Clarté", left: "Croissance plus claire", right: "Plus de confusion" },
      { label: "Compétences", left: "Bases plus fortes", right: "Des lacunes restent" },
      { label: "Résultat", left: "Meilleure croissance à long terme", right: "Progression plus difficile" },
    ],
    compareRecommendationTitle: "Recommandation",
    compareRecommendationBody:
      "Commencez par ISC2 CC, puis Security+, puis élargissez avec CEH ou CCST Cybersecurity. Gardez CISSP pour plus tard.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "Faut-il le réseau avant la cybersécurité ?",
        a: "Oui, au moins les bases. Sans réseau, beaucoup de concepts cyber restent abstraits et confus.",
      },
      {
        q: "Security+ est-elle meilleure que ISC2 CC ?",
        a: "Security+ est plus large et plus forte, mais ISC2 CC est souvent un meilleur premier pas pour un vrai débutant.",
      },
      {
        q: "Faut-il faire CEH avant Security+ ?",
        a: "En général non. Construisez d’abord la base défensive et générale, puis passez à du contenu plus offensif.",
      },
      {
        q: "Quand faut-il viser CISSP ?",
        a: "Plus tard, quand vous avez déjà des bases solides et plus de maturité sur les sujets sécurité.",
      },
    ],

    finalCtaTitle: "🚀 Commencez maintenant (de façon pratique)",
    finalCtaBody:
      "Ne réfléchissez pas trop. Commencez par ISC2 CC puis construisez étape par étape des compétences cybersecurity plus fortes.",
  },
};