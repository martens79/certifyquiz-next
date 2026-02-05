/**
 * VendorsIndexView
 * ---------------------------------------------------------------------------
 * View riusabile per la pagina indice vendor:
 * - /hub/vendors (EN root)
 * - /{lang}/hub/vendors (IT/FR/ES)
 *
 * Questa view NON decide le URL: usa la regola hubPath(lang, slug).
 * La lista dei vendor viene da:
 *   src/content/hubs/vendors/registry.ts  (VENDORS)
 */

import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getLabel } from "@/lib/i18n";

// ✅ Lista vendor (brand index)
import { VENDORS } from "../../content/hubs/vendors/registry";


/**
 * Helper URL hub (REGOLA DEFINITIVA)
 * - EN root: /hub/{slug}
 * - IT/FR/ES: /{lang}/hub/{slug}
 */
const hubPath = (lang: Locale, slug: string) =>
  lang === "en" ? `/hub/${slug}` : `/${lang}/hub/${slug}`;

/**
 * Export DEFAULT (importabile come `import VendorsIndexView from ...`)
 * - questo evita l’errore: "has no default export"
 */
export default function VendorsIndexView({ lang }: { lang: Locale }) {
  const title = getLabel(
    {
      it: "Brand",
      en: "Vendors",
      fr: "Éditeurs",
      es: "Proveedores",
    },
    lang
  );

  const subtitle = getLabel(
    {
      it: "Scegli un vendor e vai al suo hub dedicato.",
      en: "Pick a vendor and jump into its dedicated hub.",
      fr: "Choisissez un éditeur et accédez à son hub dédié.",
      es: "Elige un proveedor y entra en su hub dedicado.",
    },
    lang
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p className="mt-2 text-sm text-neutral-600">{subtitle}</p>

      {/* Grid vendor cards */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {VENDORS.map((v) => (
          <Link
            key={v.slug}
            href={hubPath(lang, v.slug)}
            className="group rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-semibold">{v.title[lang]}</div>

                {v.description?.[lang] ? (
                  <p className="mt-1 text-sm text-neutral-600">
                    {v.description[lang]}
                  </p>
                ) : null}
              </div>

              {/* Badge opzionale */}
              {v.badge?.[lang] ? (
                <span className="shrink-0 rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-700">
                  {v.badge[lang]}
                </span>
              ) : null}
            </div>

            <div className="mt-4 text-sm font-semibold text-blue-600 group-hover:underline">
              {getLabel(
                {
                  it: "Apri hub →",
                  en: "Open hub →",
                  fr: "Ouvrir le hub →",
                  es: "Abrir hub →",
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
