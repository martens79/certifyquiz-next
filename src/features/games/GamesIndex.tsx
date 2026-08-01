import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { binaryRushPath, portHunterPath } from "@/lib/paths";
import { portText } from "./port-hunter/content";
import { gameText } from "./content";

export default function GamesIndex({ lang }: { lang: Locale }) {
  const t = gameText[lang];
  const ports = portText[lang];
  return <main id="main" className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
    <header className="max-w-3xl"><p className="font-mono text-sm font-semibold uppercase tracking-[.2em] text-blue-600">CertifyQuiz Labs</p><h1 className="mt-2 text-3xl font-bold sm:text-4xl">{t.indexTitle}</h1><p className="mt-4 text-lg text-gray-600 dark:text-neutral-300">{t.indexIntro}</p></header>
    <section className="mt-10 grid gap-5 md:grid-cols-2" aria-label={t.indexTitle}>
      <article className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 shadow-sm dark:border-blue-900 dark:from-slate-950 dark:to-blue-950">
        <div className="flex items-center justify-between"><span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">✓ {t.available}</span><span className="text-sm font-semibold">{t.free}</span></div>
        <h2 className="mt-5 font-mono text-2xl font-bold">Binary Rush</h2><p className="mt-2 text-gray-600 dark:text-neutral-300">{t.binaryDesc}</p>
        <Link href={binaryRushPath(lang)} className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">{t.play} →</Link>
      </article>
      <article className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-cyan-50 p-6 shadow-sm dark:border-emerald-900 dark:from-slate-950 dark:to-emerald-950"><div className="flex items-center justify-between"><span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">✓ {t.available}</span><span className="text-sm font-semibold">{t.free}</span></div><h2 className="mt-5 font-mono text-2xl font-bold">Port Hunter</h2><p className="mt-2 text-gray-600 dark:text-neutral-300">{ports.desc}</p><Link href={portHunterPath(lang)} className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">{t.play} →</Link></article>
      <div className="grid grid-cols-3 gap-3 md:col-span-2">{["Subnet Sprint","OSI Stack","Hex Blitz"].map(name=><article key={name} className="rounded-xl border border-dashed bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900"><span className="text-xs font-semibold uppercase text-gray-500">{t.soon}</span><h2 className="mt-2 font-mono font-bold">{name}</h2></article>)}</div>
    </section>
  </main>;
}
