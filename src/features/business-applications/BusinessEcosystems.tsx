import Link from "next/link";
import { Building2 } from "lucide-react";
import type { Locale } from "@/lib/paths";
import { BUSINESS_ECOSYSTEMS, sapHubPath } from "./data";

const copy = {
  it: { open: "Esplora certificazioni →", soon: "Prossimamente" },
  en: { open: "Explore certifications →", soon: "Coming soon" },
  fr: { open: "Explorer les certifications →", soon: "Bientôt disponible" },
  es: { open: "Explorar certificaciones →", soon: "Próximamente" },
} as const;

export default function BusinessEcosystems({ lang }: { lang: Locale }) {
  const t = copy[lang];
  return (
    <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Business application ecosystems">
      {BUSINESS_ECOSYSTEMS.map((item) => {
        const content = (
          <>
            <div className="flex items-start justify-between gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-100 text-emerald-800">
                <Building2 size={22} aria-hidden="true" />
              </span>
              {!item.available && <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">{t.soon}</span>}
            </div>
            <h2 className="mt-5 text-lg font-bold text-slate-900">{item.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{item.badge}</p>
            {item.available && <p className="mt-5 text-sm font-semibold text-emerald-700">{t.open}</p>}
          </>
        );

        return item.available ? (
          <Link key={item.key} href={sapHubPath(lang)} className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            {content}
          </Link>
        ) : (
          <article key={item.key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm opacity-80">
            {content}
          </article>
        );
      })}
    </section>
  );
}
