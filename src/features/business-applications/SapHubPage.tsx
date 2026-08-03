import Link from "next/link";
import type { Metadata } from "next";
import type { Locale } from "@/lib/paths";
import { certPath, categoryPath } from "@/lib/paths";
import { SAP_CERTIFICATIONS } from "./data";

const copy = {
  it: { eyebrow: "BUSINESS APPLICATIONS · SAP", title: "Certificazioni SAP", description: "Esplora i percorsi SAP disponibili su CertifyQuiz. Le certificazioni sono in preparazione e saranno pubblicate progressivamente.", back: "← Torna a Business Applications", soon: "Prossimamente", ready: "30 domande", open: "Apri la certificazione →" },
  en: { eyebrow: "BUSINESS APPLICATIONS · SAP", title: "SAP Certifications", description: "Explore the SAP paths available on CertifyQuiz. Certification content is in preparation and will be released progressively.", back: "← Back to Business Applications", soon: "Coming soon", ready: "30 questions", open: "Open certification →" },
  fr: { eyebrow: "BUSINESS APPLICATIONS · SAP", title: "Certifications SAP", description: "Explorez les parcours SAP disponibles sur CertifyQuiz. Les contenus seront publiés progressivement.", back: "← Retour à Business Applications", soon: "Bientôt disponible", ready: "30 questions", open: "Ouvrir la certification →" },
  es: { eyebrow: "BUSINESS APPLICATIONS · SAP", title: "Certificaciones SAP", description: "Explora las rutas SAP disponibles en CertifyQuiz. Los contenidos se publicarán progresivamente.", back: "← Volver a Business Applications", soon: "Próximamente", ready: "30 preguntas", open: "Abrir certificación →" },
} as const;

export default function SapHubPage({ lang }: { lang: Locale }) {
  const t = copy[lang];
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <Link href={categoryPath(lang, "business-applications")} className="text-sm font-semibold text-emerald-700 hover:underline">{t.back}</Link>
      <header className="mt-6 rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-7 sm:p-9">
        <p className="text-xs font-bold tracking-[0.18em] text-emerald-700">{t.eyebrow}</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{t.title}</h1>
        <p className="mt-4 max-w-3xl leading-7 text-slate-600">{t.description}</p>
      </header>
      <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label={t.title}>
        {SAP_CERTIFICATIONS.map((cert) => (
          <Link key={cert.slug} href={certPath(lang, cert.slug)} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md">
            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${"available" in cert && cert.available ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
              {"available" in cert && cert.available ? t.ready : t.soon}
            </span>
            <h2 className="mt-4 text-lg font-semibold leading-snug text-slate-900">{cert.title}</h2>
            <p className="mt-5 text-sm font-semibold text-emerald-700">{t.open}</p>
          </Link>
        ))}
      </section>
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
