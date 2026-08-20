import type { Metadata } from "next";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { toHreflang } from "@/lib/paths";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com").replace(/\/+$/, "");

function displayName(slug: string) {
  if (slug === "ccna" || slug === "cisco-ccna") return "CCNA 200-301";
  if (slug === "isc2-cc") return "ISC2 CC";
  return slug.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug: rawSlug } = await params;
  const locale: Locale = isLocale(lang) ? lang : "en";
  const slug = rawSlug === "cisco-ccna" ? "ccna" : rawSlug;
  const name = displayName(slug);
  const copy = {
    it: { title: `Simulazione esame ${name} | CertifyQuiz`, description: `Affronta una simulazione completa ${name} con timer, punteggio finale e revisione delle risposte.` },
    en: { title: `${name} Mock Test — Timed Practice Exam | CertifyQuiz`, description: `Take a complete ${name} mock test with a timer, final score and answer review.` },
    fr: { title: `Examen blanc ${name} | CertifyQuiz`, description: `Passez un examen blanc complet ${name} avec chronomètre, score final et révision des réponses.` },
    es: { title: `Simulacro de examen ${name} | CertifyQuiz`, description: `Realiza un simulacro completo de ${name} con temporizador, puntuación final y revisión de respuestas.` },
  }[locale];
  const canonical = `${SITE}/${locale}/quiz/${slug}/mock-exam`;
  const languages: Record<string, string> = {};
  for (const candidate of locales) languages[toHreflang(candidate)] = `${SITE}/${candidate}/quiz/${slug}/mock-exam`;
  languages["x-default"] = `${SITE}/en/quiz/${slug}/mock-exam`;

  return { ...copy, robots: { index: true, follow: true }, alternates: { canonical, languages }, openGraph: { ...copy, url: canonical, type: "website", siteName: "CertifyQuiz" } };
}

export default function MockExamLayout({ children }: { children: React.ReactNode }) {
  return children;
}
