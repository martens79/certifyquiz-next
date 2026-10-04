import Link from "next/link";
import type { Metadata } from "next";
import type { Locale } from "@/lib/paths";
import { certPath, categoryPath } from "@/lib/paths";
import { getCertCardDesc } from "@/lib/cert-descriptions";
import { getCertBySlug } from "@/lib/data";
import { SAP_CERTIFICATIONS } from "./data";

const copy = {
  it: { eyebrow: "BUSINESS APPLICATIONS · SAP", title: "Certificazioni SAP", description: "Quiz di pratica per i percorsi SAP S/4HANA disponibili su CertifyQuiz.", back: "← Torna a Business Applications", ready: (n: number) => `${n.toLocaleString("it-IT")} domande`, available: "Disponibile", open: "Apri la certificazione →", planned: "Altri percorsi SAP previsti:" },
  en: { eyebrow: "BUSINESS APPLICATIONS · SAP", title: "SAP Certifications", description: "Practice quizzes for the SAP S/4HANA paths available on CertifyQuiz.", back: "← Back to Business Applications", ready: (n: number) => `${n.toLocaleString("en-US")} questions`, available: "Available", open: "Open certification →", planned: "Other SAP paths planned:" },
  fr: { eyebrow: "BUSINESS APPLICATIONS · SAP", title: "Certifications SAP", description: "Quiz d'entraînement pour les parcours SAP S/4HANA disponibles sur CertifyQuiz.", back: "← Retour à Business Applications", ready: (n: number) => `${n.toLocaleString("fr-FR")} questions`, available: "Disponible", open: "Ouvrir la certification →", planned: "Autres parcours SAP prévus :" },
  es: { eyebrow: "BUSINESS APPLICATIONS · SAP", title: "Certificaciones SAP", description: "Cuestionarios de práctica para las rutas SAP S/4HANA disponibles en CertifyQuiz.", back: "← Volver a Business Applications", ready: (n: number) => `${n.toLocaleString("es-ES")} preguntas`, available: "Disponible", open: "Abrir certificación →", planned: "Otras rutas SAP previstas:" },
} as const;

const isAvailable = (cert: (typeof SAP_CERTIFICATIONS)[number]) => "available" in cert && cert.available;

export default async function SapHubPage({ lang }: { lang: Locale }) {
  const t = copy[lang];
  const available = SAP_CERTIFICATIONS.filter(isAvailable);
  const planned = SAP_CERTIFICATIONS.filter((cert) => !isAvailable(cert));
  // Conteggi dal backend (mai fissi nel codice): se il dato manca resta solo
  // l'etichetta "Disponibile".
  const counts = await Promise.all(
    available.map(async (cert) => {
      const detail = await getCertBySlug(cert.slug, lang).catch(() => null);
      return detail?.questionCountByLang?.[lang] ?? detail?.questionCount ?? null;
    })
  );
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <Link href={categoryPath(lang, "business-applications")} className="text-sm font-semibold text-emerald-700 hover:underline">{t.back}</Link>
      <header className="mt-6 rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-7 sm:p-9">
        <p className="text-xs font-bold tracking-[0.18em] text-emerald-700">{t.eyebrow}</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{t.title}</h1>
        <p className="mt-4 max-w-3xl leading-7 text-slate-600">{t.description}</p>
      </header>
      <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label={t.title}>
        {available.map((cert, index) => {
          const count = counts[index];
          return (
            <Link key={cert.slug} href={certPath(lang, cert.slug)} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md">
              <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                {count && count > 0 ? t.ready(count) : t.available}
              </span>
              <h2 className="mt-4 text-lg font-semibold leading-snug text-slate-900">{cert.title}</h2>
              <p className="mt-2 text-sm leading-snug text-slate-600">{getCertCardDesc(cert.slug, lang)}</p>
              <p className="mt-5 text-sm font-semibold text-emerald-700">{t.open}</p>
            </Link>
          );
        })}
      </section>
      <p className="mt-8 text-sm leading-6 text-slate-500">
        {t.planned} {planned.map((cert) => cert.title).join(" · ")}
      </p>
    </main>
  );
}

export function sapHubMetadata(lang: Locale): Metadata {
  const t = copy[lang];
  return {
    title: `${t.title} | CertifyQuiz`,
    description: t.description,
    robots: { index: true, follow: true },
  };
}
