import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getLabel } from "@/lib/i18n";
import { VENDORS } from "../../content/hubs/vendors/registry";

const hubPath = (lang: Locale, slug: string) =>
  lang === "en" ? `/hub/${slug}` : `/${lang}/hub/${slug}`;

export default function VendorsIndexView({ lang }: { lang: Locale }) {
  const title = getLabel(
    {
      it: "Vendor & Certification Hubs",
      en: "Vendor & Certification Hubs",
      fr: "Hubs Éditeurs & Certifications",
      es: "Hubs de Proveedores y Certificaciones",
    },
    lang
  );

  const subtitle = getLabel(
    {
      it: "Scegli un vendor e accedi ai percorsi, alle certificazioni e ai quiz organizzati per dominio.",
      en: "Choose a vendor and explore certification paths, domains and exam practice quizzes.",
      fr: "Choisissez un éditeur et explorez les parcours, domaines et quiz d’entraînement.",
      es: "Elige un proveedor y explora rutas, dominios y quizzes de práctica.",
    },
    lang
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      {/* Hero header centrato */}
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          {title}
        </h1>
        <p className="mt-4 text-lg text-neutral-600 leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Grid */}
      <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {VENDORS.map((v) => (
          <Link
            key={v.slug}
            href={hubPath(lang, v.slug)}
            className="group rounded-2xl border border-neutral-200 bg-white p-7 shadow-sm transition duration-200 hover:shadow-xl hover:-translate-y-1"
          >
            {/* Top section */}
            <div className="flex items-start justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                {v.title[lang]}
              </h2>

              {v.badge?.[lang] && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {v.badge[lang]}
                </span>
              )}
            </div>

            {/* Description SEO friendly */}
            {v.description?.[lang] && (
              <p className="mt-5 text-sm text-neutral-600 leading-relaxed">
                {v.description[lang]}
              </p>
            )}

            {/* Divider subtle */}
            <div className="mt-6 h-px bg-neutral-100" />

            {/* CTA */}
            <div className="mt-5 text-sm font-semibold text-blue-600 transition group-hover:text-blue-700">
              {getLabel(
                {
                  it: "Esplora hub →",
                  en: "Explore hub →",
                  fr: "Explorer le hub →",
                  es: "Explorar hub →",
                },
                lang
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}