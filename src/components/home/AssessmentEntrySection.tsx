"use client";

import Link from "next/link";

import type { Locale } from "@/lib/paths";
import { trackEvent } from "@/lib/analytics";

type Props = { lang: Locale };

const CERTS: { slug: string; label: string }[] = [
  { slug: "ccna", label: "CCNA" },
  { slug: "isc2-cc", label: "ISC2 CC" },
  { slug: "microsoft-ai", label: "Microsoft AI" },
  { slug: "icdl", label: "ICDL" },
  { slug: "comptia-a-plus", label: "CompTIA A+" },
  { slug: "security-plus", label: "Security+" },
];

const COPY: Record<Locale, { eyebrow: string; heading: string; body: string }> = {
  it: {
    eyebrow: "10 DOMANDE DI PRATICA, NESSUNA EMAIL PER INIZIARE",
    heading: "Ma prima: quanto sei pronto davvero?",
    body: "Scegli la certificazione che stai preparando e prova 10 domande in stile esame dalla raccolta di CertifyQuiz. Risultato immediato.",
  },
  en: {
    eyebrow: "10 PRACTICE QUESTIONS, NO EMAIL TO START",
    heading: "But first: how ready are you, really?",
    body: "Choose the certification you are preparing for and try 10 exam-style questions from the CertifyQuiz question bank. Get your result immediately.",
  },
  fr: {
    eyebrow: "10 QUESTIONS D’ENTRAÎNEMENT, SANS EMAIL POUR COMMENCER",
    heading: "Mais d'abord : êtes-vous vraiment prêt ?",
    body: "Choisissez la certification que vous préparez et essayez 10 questions de type examen de la banque CertifyQuiz. Résultat immédiat.",
  },
  es: {
    eyebrow: "10 PREGUNTAS DE PRÁCTICA, SIN EMAIL PARA EMPEZAR",
    heading: "Pero antes: ¿qué tan preparado estás de verdad?",
    body: "Elige la certificación que estás preparando y prueba 10 preguntas tipo examen del banco de CertifyQuiz. Resultado inmediato.",
  },
};

function assessmentHref(lang: Locale, slug: string) {
  const prefix = lang === "en" ? "" : `/${lang}`;
  return `${prefix}/quiz/${slug}/mixed?mode=assessment`;
}

export default function AssessmentEntrySection({ lang }: Props) {
  const t = COPY[lang];

  return (
    <section className="mx-auto mt-5 max-w-6xl px-4 sm:mt-8 md:mt-10">
      <div className="mx-auto max-w-2xl rounded-3xl border border-amber-200 bg-amber-50 p-4 text-center shadow-sm sm:p-6 md:p-8">
        <div className="text-xs font-bold uppercase tracking-wide text-amber-700">
          {t.eyebrow}
        </div>

        <h2 className="mt-2 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl md:text-3xl">
          {t.heading}
        </h2>

        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-700 md:text-base">
          {t.body}
        </p>

        <div className="mt-4 flex gap-2 overflow-x-auto max-sm:-mx-4 max-sm:px-4 max-sm:pb-1 max-sm:[scrollbar-width:none] max-sm:[&::-webkit-scrollbar]:hidden sm:mt-6 sm:flex-wrap sm:justify-center sm:overflow-visible">
          {CERTS.map((cert) => (
            <Link
              key={cert.slug}
              href={assessmentHref(lang, cert.slug)}
              onClick={() =>
                trackEvent("homepage_assessment_cert_selected", {
                  language: lang,
                  cert_slug: cert.slug,
                })
              }
              className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-xl border border-amber-300 bg-white px-4 py-2.5 text-sm font-bold text-amber-900 shadow-sm transition hover:border-amber-400 hover:bg-amber-100"
            >
              {cert.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
