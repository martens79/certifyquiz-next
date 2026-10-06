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
    eyebrow: "10 DOMANDE VERE, NESSUNA EMAIL PER INIZIARE",
    heading: "Ma prima: quanto sei pronto davvero?",
    body: "Scegli una delle certificazioni più richieste e scopri a che punto sei — domande vere dal pool d'esame, risultato immediato.",
  },
  en: {
    eyebrow: "10 REAL QUESTIONS, NO EMAIL TO START",
    heading: "But first: how ready are you, really?",
    body: "Pick one of the certifications people ask about most, and find out where you stand — real questions from the exam pool, instant result.",
  },
  fr: {
    eyebrow: "10 VRAIES QUESTIONS, SANS EMAIL POUR COMMENCER",
    heading: "Mais d'abord : êtes-vous vraiment prêt ?",
    body: "Choisissez l'une des certifications les plus demandées et découvrez où vous en êtes — de vraies questions issues de la banque d'examen, résultat immédiat.",
  },
  es: {
    eyebrow: "10 PREGUNTAS REALES, SIN EMAIL PARA EMPEZAR",
    heading: "Pero antes: ¿qué tan preparado estás de verdad?",
    body: "Elige una de las certificaciones más solicitadas y descubre en qué punto estás — preguntas reales del banco de examen, resultado inmediato.",
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
