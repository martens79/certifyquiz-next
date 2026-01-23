// src/components/certifications/CertificationPracticeBox.tsx
// SEO + conversion block shown under the main CTA.
// Goal: make Google understand "this page offers practice questions" + improve UX.

import Link from "next/link";

type Lang = "it" | "en" | "fr" | "es";

type Topic = { it?: string; en?: string; fr?: string; es?: string } | string;

function pickTopicLabel(t: Topic, lang: Lang): string {
  if (!t) return "";
  if (typeof t === "string") return t;
  return t[lang] ?? t.it ?? t.en ?? t.fr ?? t.es ?? "";
}

const COPY = {
  it: {
    h2: (t: string) => `Domande di pratica per ${t}`,
    p: (t: string) =>
      `Allenati con domande in stile esame su ${t}. I quiz coprono i principali argomenti e ti aiutano a fissare concetti e procedure con esempi pratici.`,
    coverage: "Copertura argomenti",
    start: "Inizia pratica",
    micro: "Domande in stile esame • Allenamento rapido",
  },
  en: {
    h2: (t: string) => `Practice questions for ${t}`,
    p: (t: string) =>
      `Train with exam-style ${t} practice questions. Our quizzes cover the main topics to help you build real, job-ready skills and exam confidence.`,
    coverage: "Topic coverage",
    start: "Start practice",
    micro: "Exam-style questions • Quick practice",
  },
  fr: {
    h2: (t: string) => `Questions d’entraînement pour ${t}`,
    p: (t: string) =>
      `Entraînez-vous avec des questions de type examen pour ${t}. Les quiz couvrent les thèmes clés afin de renforcer vos compétences et votre préparation.`,
    coverage: "Couverture des thèmes",
    start: "Commencer",
    micro: "Questions type examen • Entraînement rapide",
  },
  es: {
    h2: (t: string) => `Preguntas de práctica para ${t}`,
    p: (t: string) =>
      `Entrena con preguntas tipo examen de ${t}. Nuestros cuestionarios cubren los temas principales para mejorar tus habilidades y tu preparación.`,
    coverage: "Cobertura de temas",
    start: "Empezar práctica",
    micro: "Preguntas tipo examen • Práctica rápida",
  },
} as const;

export default function CertificationPracticeBox({
  lang,
  certificationTitle,
  quizHref,
  topics = [],
}: {
  lang: Lang;
  certificationTitle: string;
  quizHref: string;
  topics?: ReadonlyArray<Topic>; // ✅ invece di Topic[]
}) {

  const c = COPY[lang] ?? COPY.en;

  const topicLabels = topics
    .map((t) => pickTopicLabel(t, lang))
    .filter(Boolean)
    .slice(0, 6);

  return (
    <section
      aria-label="Practice questions"
      className="mt-4 mb-6 rounded-2xl border border-black/10 bg-white p-5 shadow-sm"
    >
      {/* SEO: H2 with "practice questions" keyword */}
      <h2 className="text-lg font-semibold tracking-tight text-blue-900">
        {c.h2(certificationTitle)}
      </h2>

      <p className="mt-2 text-sm text-gray-700">{c.p(certificationTitle)}</p>

      {topicLabels.length > 0 && (
        <div className="mt-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            {c.coverage}
          </div>

          <ul className="mt-2 grid gap-2 sm:grid-cols-2">
            {topicLabels.map((t, idx) => (
              <li key={`${idx}-${t}`} className="rounded-xl bg-blue-50 px-3 py-2 text-sm text-gray-800">
                {t}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Link
          href={quizHref}
          className="inline-flex items-center justify-center rounded-xl bg-blue-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          {c.start}
        </Link>

        <span className="text-xs text-gray-500">{c.micro}</span>
      </div>
    </section>
  );
}
