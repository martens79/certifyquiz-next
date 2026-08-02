import Link from "next/link";
import type { Locale } from "@/lib/paths";
import { SAP_CERTIFICATIONS, sapHubPath } from "./data";

type SapCertification = (typeof SAP_CERTIFICATIONS)[number];

const copy = {
  it: { back: "← Torna alle certificazioni SAP", soon: "Prossimamente", title: "Contenuti in preparazione", body: "Questa pagina è stata predisposta per la certificazione selezionata. Topic, quiz, domande e materiali di studio saranno aggiunti in seguito, senza pubblicare informazioni d’esame non verificate." },
  en: { back: "← Back to SAP certifications", soon: "Coming soon", title: "Content in preparation", body: "This page is ready for the selected certification. Topics, quizzes, questions and study resources will be added later, without publishing unverified exam information." },
  fr: { back: "← Retour aux certifications SAP", soon: "Bientôt disponible", title: "Contenu en préparation", body: "Cette page est prête pour la certification sélectionnée. Les sujets, quiz, questions et ressources seront ajoutés ultérieurement, sans publier d’informations d’examen non vérifiées." },
  es: { back: "← Volver a las certificaciones SAP", soon: "Próximamente", title: "Contenido en preparación", body: "Esta página está preparada para la certificación seleccionada. Los temas, cuestionarios, preguntas y recursos se añadirán más adelante, sin publicar información de examen no verificada." },
} as const;

export default function SapCertificationPlaceholder({ lang, cert }: { lang: Locale; cert: SapCertification }) {
  const t = copy[lang];
  return (
    <main className="mx-auto min-h-[65vh] max-w-4xl px-4 py-12">
      <Link href={sapHubPath(lang)} className="text-sm font-semibold text-emerald-700 hover:underline">{t.back}</Link>
      <article className="mt-7 rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-white p-7 shadow-sm sm:p-10">
        <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">{t.soon}</span>
        <p className="mt-6 text-xs font-bold tracking-[0.18em] text-emerald-700">SAP · BUSINESS APPLICATIONS</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">{cert.title}</h1>
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-slate-900">{t.title}</h2>
          <p className="mt-3 leading-7 text-slate-600">{t.body}</p>
        </section>
      </article>
    </main>
  );
}
