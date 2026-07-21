"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/paths";
import { pricingPath } from "@/lib/paths";
import { withLang } from "@/lib/i18n";
import { apiFetch, isLoggedIn } from "@/lib/auth";

type Props = {
  lang: Locale;
  slug: string;
  price: number;
};

const COPY = {
  badge: {
    it: "Anteprima gratuita",
    en: "Free preview",
    fr: "Aperçu gratuit",
    es: "Vista previa gratuita",
  },
  title: {
    it: "Sblocca la guida completa",
    en: "Unlock the full guide",
    fr: "Débloquez le guide complet",
    es: "Desbloquea la guía completa",
  },
  sub: {
    it: "Con Premium hai accesso a questa e a tutte le altre guide, oppure acquista solo questa.",
    en: "With Premium you get this guide and every other one, or buy just this one.",
    fr: "Avec Premium, accédez à ce guide et à tous les autres, ou achetez uniquement celui-ci.",
    es: "Con Premium tienes acceso a esta guía y a todas las demás, o compra solo esta.",
  },
  premiumCta: {
    it: "Sblocca con Premium",
    en: "Unlock with Premium",
    fr: "Débloquer avec Premium",
    es: "Desbloquear con Premium",
  },
  login: {
    it: "Accedi per continuare",
    en: "Log in to continue",
    fr: "Connectez-vous pour continuer",
    es: "Inicia sesión para continuar",
  },
  error: {
    it: "Qualcosa è andato storto. Riprova.",
    en: "Something went wrong. Please try again.",
    fr: "Une erreur s'est produite. Réessayez.",
    es: "Algo salió mal. Inténtalo de nuevo.",
  },
} as const;

const BUY_CTA = {
  it: (price: string) => `Acquista questa guida (${price})`,
  en: (price: string) => `Buy this guide (${price})`,
  fr: (price: string) => `Acheter ce guide (${price})`,
  es: (price: string) => `Comprar esta guía (${price})`,
} as const;

function formatPrice(lang: Locale, price: number) {
  const locale =
    lang === "it" ? "it-IT" : lang === "fr" ? "fr-FR" : lang === "es" ? "es-ES" : "en-US";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
  }).format(price);
}

export default function GuideAccessGate({ lang, slug, price }: Props) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loggedIn = isLoggedIn();
  const priceLabel = formatPrice(lang, price);

  async function handleBuy() {
    setError(null);
    setLoading(true);

    try {
      const res = await apiFetch(`/guides/${encodeURIComponent(slug)}/checkout`, {
        method: "POST",
        body: JSON.stringify({ lang }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.url) {
        throw new Error("checkout_failed");
      }

      window.location.href = data.url;
    } catch {
      setError(COPY.error[lang]);
      setLoading(false);
    }
  }

  const redirect = encodeURIComponent(pathname ?? `/guide/${slug}`);
  const loginHref = withLang(lang, `/login?redirect=${redirect}`);

  return (
    <div className="mx-auto max-w-md rounded-2xl bg-white p-6 text-gray-900 shadow-xl sm:p-8">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800">
        🔒 {COPY.badge[lang]}
      </div>

      <h2 className="mb-1 text-xl font-semibold text-gray-900">{COPY.title[lang]}</h2>
      <p className="mb-6 text-sm text-gray-600">{COPY.sub[lang]}</p>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {!loggedIn ? (
        <a
          href={loginHref}
          className="flex w-full items-center justify-center rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          {COPY.login[lang]}
        </a>
      ) : (
        <>
          <Link
            href={pricingPath(lang)}
            className="mb-3 flex w-full items-center justify-center rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            {COPY.premiumCta[lang]}
          </Link>

          <button
            type="button"
            onClick={handleBuy}
            disabled={loading}
            className="flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
          >
            {BUY_CTA[lang](priceLabel)}
          </button>
        </>
      )}
    </div>
  );
}
