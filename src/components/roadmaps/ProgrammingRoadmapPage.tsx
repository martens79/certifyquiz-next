import Link from "next/link";

type Locale = "it" | "en" | "es" | "fr";

type QuizSlug = "python-developer" | "javascript-developer" | "java-se" | "csharp";

/**
 * Quiz path rules (coerenti con quello che mi hai detto):
 * - Quiz SEMPRE con /{lang} (EN incluso)
 * - Quindi: /en/quiz/<slug>
 */
const quiz = (lang: Locale, slug: QuizSlug) => `/${lang}/quiz/${slug}`;

export default function ProgrammingRoadmapPage({ lang }: { lang: Locale }) {
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
            href={quiz(lang, "python-developer")}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 transition"
          >
            {t.ctaPrimary}
          </Link>

          <Link
            href={quiz(lang, "javascript-developer")}
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
            href={quiz(lang, "python-developer")}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 transition"
          >
            {t.ctaPrimary}
          </Link>
          <Link
            href={quiz(lang, "javascript-developer")}
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
    title: "Programming Certification Roadmap 2026",
    subtitle: "From zero to job-ready developer skills",
    intro:
      "Programming isn’t about collecting languages. It’s about logic, clean thinking, and building real projects. This roadmap gives you a practical order using the quizzes available on CertifyQuiz.",

    ctaPrimary: "Start with Python quiz",
    ctaSecondary: "Or practice JavaScript",

    goalLabel: "Goal:",
    practiceCta: "Practice now",

    levels: [
      {
        title: "🟢 Level 0 — Logic & fundamentals",
        body:
          "Before choosing a stack, master variables, conditions, loops, functions, and basic problem-solving. This is what makes you progress fast later.",
        recommended: ["Core programming concepts", "Small daily exercises (15–30 min)"],
        goal: "Think like a programmer and stop being scared of code.",
      },
      {
        title: "🟡 Level 1 — First language (choose one)",
        body:
          "Pick a beginner-friendly language and get consistent. Python is great for fundamentals; JavaScript is great if you want web.",
        recommended: ["Python Developer", "JavaScript Developer"],
        goal: "Write simple scripts and understand how code flows.",
        ctaQuizSlug: "python-developer",
        ctaText: "Practice Python",
      },
      {
        title: "🟠 Level 2 — Build stronger structure",
        body:
          "Once you’re comfortable, move into more structured programming. This is where you become more ‘professional’ in mindset.",
        recommended: ["Java SE", "C#"],
        goal: "Learn OOP clearly, handle errors, and write maintainable code.",
        ctaQuizSlug: "java-se",
        ctaText: "Practice Java SE",
      },
      {
        title: "🔴 Level 3 — Become employable",
        body:
          "Now combine code with real-world skills: APIs, databases, testing, Git, and basic architecture. Certifications matter less than projects here.",
        recommended: ["Build 2–3 small projects", "Add a database + API layer", "Deploy something online"],
        goal: "Have a portfolio that proves you can ship software.",
      },
    ],

    salaryTitle: "💰 Developer salary outlook (2026)",
    salaryIntro:
      "Typical global ranges (depend heavily on country, company, and experience). Use as orientation.",
    salaryRanges: [
      { label: "Junior", range: "$45k–$70k" },
      { label: "Mid-level", range: "$75k–$110k" },
      { label: "Senior", range: "$120k+" },
    ],
    salaryDisclaimer:
      "Certifications help, but projects + consistency are what usually get you hired faster.",

    compareTitle: "🔍 Python vs JavaScript — which one should you start with?",
    compareIntro:
      "Both are valid. Choose based on your goal: general fundamentals vs web path.",
    compareLeftTitle: "Python",
    compareRightTitle: "JavaScript",
    compareRows: [
      { label: "Best for", left: "Clean fundamentals, scripting, automation", right: "Web, frontend, full-stack basics" },
      { label: "Learning curve", left: "Usually smoother", right: "Slightly messier ecosystem" },
      { label: "If you want", left: "Clarity + fast progress", right: "Build web apps sooner" },
    ],
    compareRecommendationTitle: "Recommendation",
    compareRecommendationBody:
      "If you’re unsure, start with Python. If your goal is the web, start with JavaScript. Don’t switch every week: commit for 30 days.",

    faqTitle: "FAQ",
    faq: [
      { q: "Do I need a certification to get a developer job?", a: "Not necessarily. A solid portfolio and consistent practice often matter more." },
      { q: "Which language is the best in 2026?", a: "There’s no single best. Pick one, become good, then add a second when you’re stable." },
      { q: "How much should I practice?", a: "Even 30 minutes a day works if you do it consistently for months." },
      { q: "When should I learn databases?", a: "After you can write basic code comfortably—then add SQL + API basics." },
    ],

    finalCtaTitle: "🚀 Start now (simple plan)",
    finalCtaBody:
      "Pick ONE language, practice daily, and build small projects. Start with the Python quiz and keep momentum.",
  },

  it: {
    title: "Roadmap Certificazioni Programmazione 2026",
    subtitle: "Da zero a competenze da developer spendibili",
    intro:
      "Programmare non significa collezionare linguaggi. Significa logica, metodo e progetti concreti. Questa roadmap ti dà un ordine pratico usando i quiz disponibili su CertifyQuiz.",

    ctaPrimary: "Inizia con il quiz Python",
    ctaSecondary: "Oppure allenati con JavaScript",

    goalLabel: "Obiettivo:",
    practiceCta: "Allenati ora",

    levels: [
      {
        title: "🟢 Livello 0 — Logica e fondamenta",
        body:
          "Prima dello stack, padroneggia variabili, condizioni, cicli, funzioni e problem solving base. Qui si costruisce la velocità vera.",
        recommended: ["Concetti base di programmazione", "Esercizi giornalieri (15–30 min)"],
        goal: "Ragionare da programmatore e togliere la paura del codice.",
      },
      {
        title: "🟡 Livello 1 — Primo linguaggio (scegline uno)",
        body:
          "Scegli un linguaggio ‘entry friendly’ e sii costante. Python è ottimo per le basi; JavaScript è ottimo se vuoi il web.",
        recommended: ["Python Developer", "JavaScript Developer"],
        goal: "Scrivere piccoli script e capire davvero il flusso del codice.",
        ctaQuizSlug: "python-developer",
        ctaText: "Allenati con Python",
      },
      {
        title: "🟠 Livello 2 — Struttura e mentalità professionale",
        body:
          "Quando sei stabile, passa a programmazione più strutturata. Qui diventi più ‘pro’ come metodo.",
        recommended: ["Java SE", "C#"],
        goal: "Capire OOP, gestire errori, scrivere codice manutenibile.",
        ctaQuizSlug: "java-se",
        ctaText: "Quiz Java SE",
      },
      {
        title: "🔴 Livello 3 — Diventa occupabile",
        body:
          "Unisci codice a skill reali: API, database, testing, Git, basi di architettura. Qui contano più i progetti delle certificazioni.",
        recommended: ["2–3 mini progetti", "Aggiungi DB + API", "Pubblica qualcosa online"],
        goal: "Avere un portfolio che dimostra che sai consegnare software.",
      },
    ],

    salaryTitle: "💰 Salary outlook developer (2026)",
    salaryIntro:
      "Range globali indicativi (dipendono da paese, azienda ed esperienza).",
    salaryRanges: [
      { label: "Junior", range: "$45k–$70k" },
      { label: "Mid-level", range: "$75k–$110k" },
      { label: "Senior", range: "$120k+" },
    ],
    salaryDisclaimer:
      "Le certificazioni aiutano, ma spesso sono i progetti + costanza a farti assumere prima.",

    compareTitle: "🔍 Python vs JavaScript — quale scegliere per iniziare?",
    compareIntro:
      "Entrambi vanno bene. Scegli in base al tuo obiettivo: basi pulite vs percorso web.",
    compareLeftTitle: "Python",
    compareRightTitle: "JavaScript",
    compareRows: [
      { label: "Ideale per", left: "Basi chiare, scripting, automazione", right: "Web, frontend, basi full-stack" },
      { label: "Curva", left: "Di solito più semplice", right: "Ecosistema più ‘rumoroso’" },
      { label: "Se vuoi", left: "Chiarezza + progressi rapidi", right: "Fare web app prima" },
    ],
    compareRecommendationTitle: "Consiglio pratico",
    compareRecommendationBody:
      "Se sei indeciso, parti con Python. Se vuoi web, parti con JavaScript. Non cambiare ogni settimana: impegno 30 giorni.",

    faqTitle: "FAQ",
    faq: [
      { q: "Serve una certificazione per lavorare come developer?", a: "Non sempre. Portfolio e pratica costante spesso contano di più." },
      { q: "Qual è il miglior linguaggio nel 2026?", a: "Non esiste un ‘migliore’. Scegline uno, diventa bravo, poi aggiungi il secondo." },
      { q: "Quanto devo allenarmi?", a: "Anche 30 minuti al giorno funzionano se sei costante per mesi." },
      { q: "Quando studiare i database?", a: "Dopo che scrivi codice base con naturalezza: poi aggiungi SQL + API." },
    ],

    finalCtaTitle: "🚀 Parti ora (piano semplice)",
    finalCtaBody:
      "Scegli UN linguaggio, allenati ogni giorno e costruisci mini progetti. Parti dal quiz Python e mantieni il ritmo.",
  },

  es: {
    title: "Ruta de Certificaciones de Programación 2026",
    subtitle: "De cero a habilidades de developer útiles",
    intro:
      "Programar no es coleccionar lenguajes. Es lógica, método y proyectos reales. Esta ruta te da un orden práctico usando los quizzes disponibles en CertifyQuiz.",

    ctaPrimary: "Empieza con el quiz de Python",
    ctaSecondary: "O practica JavaScript",

    goalLabel: "Objetivo:",
    practiceCta: "Practicar ahora",

    levels: [
      {
        title: "🟢 Nivel 0 — Lógica y fundamentos",
        body:
          "Antes del stack, domina variables, condicionales, bucles, funciones y resolución de problemas.",
        recommended: ["Conceptos base", "Ejercicios diarios (15–30 min)"],
        goal: "Pensar como programador y perder el miedo al código.",
      },
      {
        title: "🟡 Nivel 1 — Primer lenguaje (elige uno)",
        body:
          "Elige un lenguaje amigable y sé constante. Python para fundamentos; JavaScript si tu objetivo es web.",
        recommended: ["Python Developer", "JavaScript Developer"],
        goal: "Escribir scripts simples y entender el flujo del código.",
        ctaQuizSlug: "python-developer",
        ctaText: "Practicar Python",
      },
      {
        title: "🟠 Nivel 2 — Más estructura",
        body:
          "Cuando estés estable, avanza hacia programación más estructurada.",
        recommended: ["Java SE", "C#"],
        goal: "Entender OOP, errores y código mantenible.",
        ctaQuizSlug: "java-se",
        ctaText: "Practicar Java SE",
      },
      {
        title: "🔴 Nivel 3 — Camino profesional",
        body:
          "Combina código con APIs, bases de datos, testing y Git. Aquí importan más los proyectos.",
        recommended: ["2–3 proyectos pequeños", "Añadir DB + API", "Publicar algo online"],
        goal: "Tener un portfolio real.",
      },
    ],

    salaryTitle: "💰 Salary outlook developer (2026)",
    salaryIntro:
      "Rangos globales orientativos (dependen del país, empresa y experiencia).",
    salaryRanges: [
      { label: "Junior", range: "$45k–$70k" },
      { label: "Mid-level", range: "$75k–$110k" },
      { label: "Senior", range: "$120k+" },
    ],
    salaryDisclaimer:
      "Las certificaciones ayudan, pero los proyectos y la constancia suelen pesar más.",

    compareTitle: "🔍 Python vs JavaScript — ¿cuál elegir?",
    compareIntro:
      "Ambos son válidos. Elige según tu objetivo.",
    compareLeftTitle: "Python",
    compareRightTitle: "JavaScript",
    compareRows: [
      { label: "Mejor para", left: "Fundamentos claros, scripting", right: "Web, frontend, full-stack" },
      { label: "Curva", left: "Más suave", right: "Ecosistema más complejo" },
      { label: "Si quieres", left: "Claridad", right: "Web apps pronto" },
    ],
    compareRecommendationTitle: "Recomendación",
    compareRecommendationBody:
      "Si dudas, empieza con Python. Si quieres web, empieza con JavaScript. Compromiso 30 días sin cambiar.",

    faqTitle: "FAQ",
    faq: [
      { q: "¿Necesito certificación para trabajar?", a: "No siempre. Portfolio + práctica constante suelen ser clave." },
      { q: "¿Mejor lenguaje en 2026?", a: "No hay uno. Elige uno y domina, luego añade otro." },
      { q: "¿Cuánto practicar?", a: "Incluso 30 minutos al día sirven si eres constante." },
      { q: "¿Cuándo bases de datos?", a: "Cuando ya escribes código base con soltura." },
    ],

    finalCtaTitle: "🚀 Empieza ahora (plan simple)",
    finalCtaBody:
      "Elige UN lenguaje, practica diario y crea proyectos. Empieza con el quiz de Python.",
  },

  fr: {
    title: "Parcours Certifications Programmation 2026",
    subtitle: "De zéro à des compétences de dev utiles",
    intro:
      "Programmer, ce n’est pas collectionner des langages. C’est de la logique, une méthode et des projets concrets. Ce parcours donne un ordre pratique avec les quiz disponibles sur CertifyQuiz.",

    ctaPrimary: "Commencer avec le quiz Python",
    ctaSecondary: "Ou s’entraîner en JavaScript",

    goalLabel: "Objectif :",
    practiceCta: "S’entraîner",

    levels: [
      {
        title: "🟢 Niveau 0 — Logique et fondamentaux",
        body:
          "Avant le stack, maîtrisez variables, conditions, boucles, fonctions et résolution de problèmes.",
        recommended: ["Concepts de base", "Exercices quotidiens (15–30 min)"],
        goal: "Penser comme un développeur et perdre la peur du code.",
      },
      {
        title: "🟡 Niveau 1 — Premier langage (choisissez-en un)",
        body:
          "Choisissez un langage ‘entry friendly’ et soyez constant. Python pour les bases; JavaScript si vous visez le web.",
        recommended: ["Python Developer", "JavaScript Developer"],
        goal: "Écrire des scripts simples et comprendre le flux du code.",
        ctaQuizSlug: "python-developer",
        ctaText: "S’entraîner en Python",
      },
      {
        title: "🟠 Niveau 2 — Plus de structure",
        body:
          "Quand vous êtes à l’aise, passez à une programmation plus structurée.",
        recommended: ["Java SE", "C#"],
        goal: "Comprendre l’OOP, gérer les erreurs, écrire du code maintenable.",
        ctaQuizSlug: "java-se",
        ctaText: "Quiz Java SE",
      },
      {
        title: "🔴 Niveau 3 — Parcours pro",
        body:
          "Ajoutez API, bases de données, tests et Git. Ici, les projets comptent le plus.",
        recommended: ["2–3 petits projets", "DB + API", "Déployer en ligne"],
        goal: "Avoir un portfolio solide.",
      },
    ],

    salaryTitle: "💰 Salary outlook developer (2026)",
    salaryIntro:
      "Fourchettes mondiales indicatives (varient selon pays/entreprise/expérience).",
    salaryRanges: [
      { label: "Junior", range: "$45k–$70k" },
      { label: "Mid-level", range: "$75k–$110k" },
      { label: "Senior", range: "$120k+" },
    ],
    salaryDisclaimer:
      "Les certifs aident, mais projets + constance font souvent la différence.",

    compareTitle: "🔍 Python vs JavaScript — lequel choisir ?",
    compareIntro:
      "Les deux sont valables. Choisissez selon votre objectif.",
    compareLeftTitle: "Python",
    compareRightTitle: "JavaScript",
    compareRows: [
      { label: "Idéal pour", left: "Bases claires, scripting", right: "Web, frontend, full-stack" },
      { label: "Courbe", left: "Plus douce", right: "Écosystème plus bruyant" },
      { label: "Si vous voulez", left: "Clarté", right: "Web apps plus vite" },
    ],
    compareRecommendationTitle: "Recommandation",
    compareRecommendationBody:
      "Si vous hésitez : Python. Si vous visez le web : JavaScript. Tenez 30 jours sans changer.",

    faqTitle: "FAQ",
    faq: [
      { q: "Faut-il une certif pour travailler ?", a: "Pas forcément. Portfolio + pratique régulière comptent beaucoup." },
      { q: "Meilleur langage en 2026 ?", a: "Il n’y en a pas un seul. Choisissez-en un et maîtrisez-le." },
      { q: "Combien pratiquer ?", a: "Même 30 min/jour suffisent si vous êtes constant." },
      { q: "Quand apprendre les bases de données ?", a: "Après être à l’aise avec le code de base." },
    ],

    finalCtaTitle: "🚀 Commencez maintenant (plan simple)",
    finalCtaBody:
      "Choisissez UN langage, pratiquez chaque jour, créez des projets. Commencez avec le quiz Python.",
  },
};
