import { Boxes, Cloud, Code2, Database, FileText, Network, Palette, Presentation, ShieldCheck, Table2 } from "lucide-react";
import type { Locale } from "@/lib/paths";

const copy = {
  it: { subtitle: "Esercitati su attività reali in ambienti di certificazione simulati", body: "I futuri laboratori offriranno esercitazioni guidate e basate su attività, in ambienti simulati più vicini alle competenze pratiche richieste dalle certificazioni e dal lavoro reale.", soon: "Prossimamente" },
  en: { subtitle: "Practice real tasks in simulated certification environments", body: "Future labs will provide guided, task-based practice in simulated environments designed around practical skills used in certifications and real work.", soon: "Coming soon" },
  fr: { subtitle: "Entraînez-vous à des tâches concrètes dans des environnements de certification simulés", body: "Les futurs laboratoires proposeront des exercices guidés et axés sur les tâches, dans des environnements simulés proches des compétences pratiques utilisées en certification et au travail.", soon: "Bientôt disponible" },
  es: { subtitle: "Practica tareas reales en entornos de certificación simulados", body: "Los futuros laboratorios ofrecerán prácticas guiadas y basadas en tareas, en entornos simulados orientados a las competencias prácticas de las certificaciones y del trabajo real.", soon: "Próximamente" },
} as const;

const cards = [
  ["Spreadsheets", Table2], ["Word Processing", FileText], ["Presentations", Presentation],
  ["Adobe Creative Tools", Palette], ["SAP Business Applications", Boxes], ["Networking", Network],
  ["Cloud", Cloud], ["Cybersecurity", ShieldCheck], ["Databases", Database], ["Programming", Code2],
] as const;

export default function InteractiveLabsLanding({ lang }: { lang: Locale }) {
  const t = copy[lang];
  return <main className="min-h-[70vh] bg-gradient-to-b from-indigo-50 via-white to-white px-4 py-16">
    <div className="mx-auto max-w-6xl">
      <header className="mx-auto max-w-3xl text-center">
        <span className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700">{t.soon}</span>
        <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">Interactive Labs</h1>
        <p className="mt-4 text-xl font-medium text-indigo-700">{t.subtitle}</p>
        <p className="mt-5 text-base leading-7 text-slate-600">{t.body}</p>
      </header>
      <section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Future lab categories">
        {cards.map(([title, Icon]) => <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-50 text-indigo-700"><Icon aria-hidden="true" size={22} /></span>
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">{t.soon}</span>
          </div>
          <h2 className="mt-5 text-lg font-semibold text-slate-900">{title}</h2>
        </article>)}
      </section>
    </div>
  </main>;
}
