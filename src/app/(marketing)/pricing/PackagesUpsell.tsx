"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/auth";
import { certPath, type Locale } from "@/lib/paths";

type Cert = { slug: string; name: string; fromPriceMinor: number; currency: string };

const TEXT = {
  it: {
    title: "Preferisci pagare una volta sola?",
    body: "Per alcune certificazioni puoi accedere a tutti i contenuti di quella certificazione con un pagamento unico.",
    from: "da",
  },
  en: {
    title: "Prefer to pay once?",
    body: "For some certifications you can access all the content of that certification with a single one-time payment.",
    from: "from",
  },
  fr: {
    title: "Vous préférez payer une seule fois ?",
    body: "Pour certaines certifications, vous pouvez accéder à tout le contenu de cette certification avec un paiement unique.",
    from: "à partir de",
  },
  es: {
    title: "¿Prefieres pagar una sola vez?",
    body: "Para algunas certificaciones puedes acceder a todo el contenido de esa certificación con un pago único.",
    from: "desde",
  },
} as const;

const NUMBER_LOCALE: Record<Locale, string> = {
  it: "it-IT",
  en: "en-IE",
  fr: "fr-FR",
  es: "es-ES",
};

export default function PackagesUpsell({ lang }: { lang: Locale }) {
  const t = TEXT[lang];
  const [certs, setCerts] = useState<Cert[] | null>(null);

  useEffect(() => {
    let alive = true;
    apiFetch(`/packages/certifications?lang=${lang}`, { cache: "default" })
      .then((r) => (r.ok ? r.json() : null))
      .then((v) => {
        if (alive) setCerts(v?.certifications || []);
      })
      .catch(() => {
        if (alive) setCerts([]);
      });
    return () => {
      alive = false;
    };
  }, [lang]);

  if (!certs || certs.length === 0) return null;

  const money = (minor: number, currency: string) =>
    new Intl.NumberFormat(NUMBER_LOCALE[lang], {
      style: "currency",
      currency,
    }).format(minor / 100);

  return (
    <section className="mt-6 rounded-2xl border border-indigo-200 bg-indigo-50/60 p-6">
      <div className="text-lg font-semibold text-indigo-950">{t.title}</div>
      <p className="mt-1 text-sm text-indigo-900/80">{t.body}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {certs.map((c) => (
          <a
            key={c.slug}
            href={`${certPath(lang, c.slug)}#package-title`}
            className="inline-flex items-center gap-2 rounded-full border border-indigo-300 bg-white px-4 py-2 text-sm font-medium text-indigo-950 transition hover:border-indigo-500 hover:bg-indigo-100"
          >
            {c.name}
            <span className="text-indigo-500">
              · {t.from} {money(c.fromPriceMinor, c.currency)}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
