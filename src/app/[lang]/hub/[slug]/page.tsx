// src/app/[lang]/hub/[slug]/page.tsx
import { notFound } from "next/navigation";

import type { Locale } from "@/lib/i18n";
import CertificationHubPage, { type HubResolvedCert } from "@/components/CertificationHubPage";
import { CERTS_BY_SLUG } from "@/certifications/registry";

// ✅ import RELATIVI (come hai già fatto per evitare problemi alias su /content)
import { HUBS_BY_SLUG } from "../../../../content/hubs/registry";
import type { HubData, HubSection } from "../../../../content/hubs/vendor-domains/google-cloud";

function isLocale(x: string): x is Locale {
  return x === "it" || x === "en" || x === "fr" || x === "es";
}

// ✅ CERT: EN root /certifications ; altre lingue con segmento localizzato
function certHref(lang: Locale, certSlug: string) {
  if (lang === "en") return `/certifications/${certSlug}`;
  const seg: Record<Exclude<Locale, "en">, string> = {
    it: "certificazioni",
    fr: "certifications",
    es: "certificaciones",
  };
  return `/${lang}/${seg[lang]}/${certSlug}`;
}

// ✅ QUIZ: SEMPRE /{lang}/quiz/... (mai root)
function quizHref(lang: Locale, certSlug: string) {
  return `/${lang}/quiz/${certSlug}`;
}

export default function HubLangPage({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const lang = isLocale(params.lang) ? params.lang : "en";
  const hub: HubData | undefined = HUBS_BY_SLUG[params.slug];
  if (!hub) return notFound();

  // -------------------- Vendor overview (/it/hub/google) --------------------
  if (hub.hubKind === "vendor") {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-10">
        <h1 className="text-3xl font-bold tracking-tight">{hub.title[lang]}</h1>
        <p className="mt-2 text-base text-neutral-600">{hub.description[lang]}</p>

        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {hub.sections.map((s: HubSection, idx: number) => (
            <a
              key={idx}
              href={s.hrefByLang(lang)}
              className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm hover:bg-neutral-50"
            >
              <div className="text-base font-semibold">{s.title[lang]}</div>
              {s.description?.[lang] ? (
                <div className="mt-1 text-sm text-neutral-600">{s.description[lang]}</div>
              ) : null}
              <div className="mt-3 text-sm font-semibold">
                {lang === "it"
                  ? "→ Apri"
                  : lang === "fr"
                  ? "→ Ouvrir"
                  : lang === "es"
                  ? "→ Abrir"
                  : "→ Open"}
              </div>
            </a>
          ))}
        </section>
      </main>
    );
  }

  // -------------------- Hub con certificazioni (/it/hub/google-cloud) --------
  const resolved: HubResolvedCert[] = hub.certs
    .map((item) => {
      const cert = CERTS_BY_SLUG[item.slug];
      if (!cert) return null;

      const name = (cert.title?.[lang] as string) ?? (cert.title?.en as string) ?? item.slug;
      const shortDescription =
        (cert.description?.[lang] as string) ?? (cert.description?.en as string) ?? "";

      return {
        ...item,
        name,
        shortDescription,
        logoUrl: cert.imageUrl,
        certPageHref: certHref(lang, item.slug),
        quizHref: quizHref(lang, item.slug),
      };
    })
    .filter(Boolean) as HubResolvedCert[];

  return (
    <CertificationHubPage
      lang={lang}
      title={hub.title}
      description={hub.description}
      certs={resolved}
    />
  );
}
