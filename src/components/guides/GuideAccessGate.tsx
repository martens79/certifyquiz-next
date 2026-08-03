"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/paths";
import { pricingPath } from "@/lib/paths";
import { withLang } from "@/lib/i18n";
import { apiFetch } from "@/lib/auth";
import { useAuth } from "@/components/auth/AuthProvider";
import { analyticsUserStateFrom, trackEvent, trackFunnelEvent } from "@/lib/analytics";

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
    it: "Con Premium hai accesso a questa guida, a tutte le altre guide e agli strumenti di preparazione inclusi.",
    en: "Premium includes this guide, every other guide, and the complete preparation toolkit.",
    fr: "Premium inclut ce guide, tous les autres guides et les outils de préparation complets.",
    es: "Premium incluye esta guía, todas las demás guías y las herramientas de preparación completas.",
  },
  premiumCta: {
    it: "Sblocca guida e mappe",
    en: "Unlock guide and maps",
    fr: "Débloquer le guide et les cartes",
    es: "Desbloquear guía y mapas",
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
  premiumTeaserTitle: {
    it: "Con Premium sblocchi anche questa guida",
    en: "With Premium you unlock this guide too",
    fr: "Avec Premium, débloquez aussi ce guide",
    es: "Con Premium desbloqueas también esta guía",
  },
  premiumTeaserNote: {
    it: "Tutte le guide incluse, spiegazioni complete e Tutor AI. Prova gratis 7 giorni, poi 9,99€/mese.",
    en: "All guides included, full explanations and AI Tutor. Try free for 7 days, then €9.99/month.",
    fr: "Tous les guides inclus, explications complètes et Tutor IA. Essayez gratuitement 7 jours, puis 9,99€/mois.",
    es: "Todas las guías incluidas, explicaciones completas y Tutor IA. Prueba gratis 7 días, luego 9,99€/mes.",
  },
  premiumTeaserCta: {
    it: "Inizia 7 giorni gratis",
    en: "Start 7 days free",
    fr: "Commencer 7 jours gratuits",
    es: "Empieza 7 días gratis",
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
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loggedIn = !!user;
  const priceLabel = formatPrice(lang, price);
  const gateDescription = loggedIn
    ? lang === "it"
      ? "Sblocca tutte le guide con Premium oppure acquista solo questa guida."
      : lang === "fr"
      ? "Débloquez tous les guides avec Premium ou achetez uniquement celui-ci."
      : lang === "es"
      ? "Desbloquea todas las guías con Premium o compra solo esta guía."
      : "Unlock every guide with Premium or buy this guide separately."
    : COPY.sub[lang];

  function trackPremiumGateClick() {
    trackEvent("premium_cta_clicked", {
      language: lang,
      user_state: analyticsUserStateFrom(user),
      source_page: "guide_preview",
      content_type: "guide",
      guide_slug: slug,
    });
    trackFunnelEvent({
      event: "premium_clicked_guide_gate",
      cert_slug: slug,
      topic_slug: null,
      lang,
    });
  }

  async function handleBuy() {
    setError(null);
    setLoading(true);

    try {
      trackEvent("single_guide_cta_clicked", {
        language: lang,
        user_state: analyticsUserStateFrom(user),
        source_page: "guide_preview",
        content_type: "guide",
        guide_slug: slug,
        purchase_type: "single_guide",
      });
      trackEvent("checkout_started", {
        language: lang,
        user_state: analyticsUserStateFrom(user),
        source_page: "guide_preview",
        guide_slug: slug,
        purchase_type: "single_guide",
      });
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
  const premiumHref = `${pricingPath(lang)}?source=guide_preview&guide_slug=${encodeURIComponent(slug)}`;

  return (
    <div className="mx-auto max-w-md rounded-2xl bg-white p-6 text-gray-900 shadow-xl sm:p-8">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800">
        🔒 {COPY.badge[lang]}
      </div>

      <h2 className="mb-1 text-xl font-semibold text-gray-900">{COPY.title[lang]}</h2>
      <p className="mb-6 text-sm text-gray-600">{gateDescription}</p>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {!loggedIn ? (
        <>
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="mb-1 text-sm font-semibold text-gray-900">
              {COPY.premiumTeaserTitle[lang]}
            </p>
            <p className="mb-3 text-xs text-gray-600">{COPY.premiumTeaserNote[lang]}</p>
            <a
              href={premiumHref}
              onClick={trackPremiumGateClick}
              className="flex w-full items-center justify-center rounded-xl bg-amber-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-600"
            >
              {COPY.premiumTeaserCta[lang]}
            </a>
          </div>

          <a
            href={loginHref}
            className="flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            {COPY.login[lang]}
          </a>
        </>
      ) : (
        <>
          <Link
            href={pricingPath(lang)}
            onClick={trackPremiumGateClick}
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
