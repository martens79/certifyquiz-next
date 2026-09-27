"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/auth";
import { useAuth } from "@/components/auth/AuthProvider";
import type { CertificationResources } from "@/lib/data";
import { pricingPath, type Locale } from "@/lib/paths";
import {
  analyticsUserStateFrom,
  getAnonymousSessionId,
  getAnonymousVisitorId,
  trackEvent,
  trackEventOnce,
  trackFunnelEvent,
  trackFunnelEventOnce,
} from "@/lib/analytics";
import { resolveCommercialOrigin } from "@/lib/commercial-origin";
import { readPostGateCohort } from "@/lib/post-gate-tracking";
import {
  accessValidityLabel,
  activeUntilLabel,
  oneTimePaymentLabel,
  packageDisplayName,
  packageFeatures,
  packageKind,
  packageTagline,
} from "@/lib/commercial-packages";

type Offer = {
  code: string; productCode: string; name: string; amountMinor: number; effectiveAmountMinor: number | null;
  creditMinor: number; purchaseType: string | null; blockedReason: string | null; currency: string; status: string;
  checkoutAvailable: boolean; accessDurationDays?: number | null;
};
type Payload = {
  offers: Offer[]; owned: { tier: string; expiresAt?: string | null } | null; premium: boolean; darkLaunch: boolean;
  certificationId?: number | null;
};

const TEXT = {
  it: { title: "Scegli come prepararti", free: "Free", freeBody: "Inizia gratis: quiz, assessment e Mock Exam con punteggio.", premium: "Accesso completo a tutto il catalogo CertifyQuiz, per chi prepara più certificazioni.", premiumCta: "Scopri Premium", buy: "Ottieni l'accesso", renew: "Estendi l'accesso", upgrade: "Passa a Complete", owned: "Già attivo", recommended: "Consigliato", inactive: "Dark launch — solo anteprima admin", warning: "Questo contenuto è già incluso nel tuo Premium. Acquista il pass solo se vuoi mantenere l'accesso a questa certificazione indipendentemente dall'abbonamento.", buyAnyway: "Acquista comunque", renewNote: "Il nuovo periodo si somma a quello attuale.", errors: { generic: "Non è stato possibile avviare il pagamento. Riprova tra poco.", unavailable: "Questa offerta non è ancora disponibile.", inProgress: "Hai già un pagamento in corso per questa offerta.", owned: "Hai già accesso a questo pacchetto." } },
  en: { title: "Choose how to prepare", free: "Free", freeBody: "Start free: quizzes, assessment and a scored Mock Exam.", premium: "Full access to the whole CertifyQuiz catalog, for learners preparing several certifications.", premiumCta: "Explore Premium", buy: "Get access", renew: "Extend access", upgrade: "Upgrade to Complete", owned: "Already active", recommended: "Recommended", inactive: "Dark launch — admin preview only", warning: "This content is already included in your Premium. Buy the pass only if you want to keep access to this certification regardless of your subscription.", buyAnyway: "Buy anyway", renewNote: "The new period is added to your current one.", errors: { generic: "We could not start the payment. Please try again shortly.", unavailable: "This offer is not available yet.", inProgress: "You already have a payment in progress for this offer.", owned: "You already have access to this package." } },
  fr: { title: "Choisissez votre préparation", free: "Gratuit", freeBody: "Commencez gratuitement : quiz, évaluation et Mock Exam noté.", premium: "Accès complet à tout le catalogue CertifyQuiz, pour préparer plusieurs certifications.", premiumCta: "Découvrir Premium", buy: "Obtenir l'accès", renew: "Prolonger l'accès", upgrade: "Passer à Complete", owned: "Déjà actif", recommended: "Recommandé", inactive: "Lancement privé — aperçu administrateur", warning: "Ce contenu est déjà inclus dans votre Premium. Achetez le pass uniquement pour conserver cette certification indépendamment de l'abonnement.", buyAnyway: "Acheter quand même", renewNote: "La nouvelle période s'ajoute à la période en cours.", errors: { generic: "Impossible de lancer le paiement. Réessayez dans un instant.", unavailable: "Cette offre n'est pas encore disponible.", inProgress: "Un paiement est déjà en cours pour cette offre.", owned: "Vous avez déjà accès à ce pack." } },
  es: { title: "Elige cómo prepararte", free: "Gratis", freeBody: "Empieza gratis: cuestionarios, evaluación y Mock Exam con puntuación.", premium: "Acceso completo a todo el catálogo de CertifyQuiz, para quien prepara varias certificaciones.", premiumCta: "Ver Premium", buy: "Obtener acceso", renew: "Ampliar acceso", upgrade: "Pasar a Complete", owned: "Ya activo", recommended: "Recomendado", inactive: "Lanzamiento privado — vista admin", warning: "Este contenido ya está incluido en tu Premium. Compra el pase solo si quieres conservar esta certificación independientemente de la suscripción.", buyAnyway: "Comprar igualmente", renewNote: "El nuevo periodo se suma al actual.", errors: { generic: "No se pudo iniciar el pago. Inténtalo de nuevo en breve.", unavailable: "Esta oferta aún no está disponible.", inProgress: "Ya tienes un pago en curso para esta oferta.", owned: "Ya tienes acceso a este paquete." } },
} as const;

function errorMessage(code: string, t: (typeof TEXT)[Locale]) {
  if (code === "OFFER_NOT_AVAILABLE" || code === "OFFER_NOT_CONFIGURED" || code === "PACKAGE_BILLING_DISABLED") return t.errors.unavailable;
  if (code === "CHECKOUT_ALREADY_IN_PROGRESS") return t.errors.inProgress;
  if (code === "already_owned" || code === "downgrade_not_allowed") return t.errors.owned;
  return t.errors.generic;
}

export default function CertificationPackageOffers({ lang, certificationSlug, resources }: { lang: Locale; certificationSlug: string; resources: CertificationResources | null }) {
  const t = TEXT[lang];
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [data, setData] = useState<Payload | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    apiFetch(`/packages/offers/${encodeURIComponent(certificationSlug)}${isAdmin ? "?include_inactive=1" : ""}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((v) => { if (alive) setData(v); })
      .catch(() => {});
    return () => { alive = false; };
  }, [certificationSlug, isAdmin]);

  const offers = useMemo(() => data?.offers || [], [data]);
  const certificationId = data?.certificationId ?? resources?.certificationId ?? null;
  const certificationName = resources?.certificationName || null;

  // package_viewed: evento esistente package_offer_viewed, ora anche nel funnel V2
  // (visitor/session/pathname) oltre che in GA4. Una volta per sessione e cert.
  useEffect(() => {
    if (!offers.length) return;
    const metadata = {
      certification_id: certificationId,
      offer_codes: offers.map((o) => o.code).join(","),
      product_types: offers.map((o) => o.productCode).join(","),
      source_page: "certification_page",
    };
    trackFunnelEventOnce(`package_offer_viewed:${certificationSlug}`, {
      event: "package_offer_viewed", cert_slug: certificationSlug, lang, metadata,
    });
    trackEventOnce(`package_offer_viewed:${certificationSlug}`, "package_offer_viewed", {
      language: lang, user_state: analyticsUserStateFrom(user), certification_slug: certificationSlug,
      certification_id: certificationId, source_page: "certification_page",
    });
  }, [offers, certificationSlug, certificationId, lang, user]);

  if (!offers.length) return null;

  const money = (o: Offer) =>
    new Intl.NumberFormat(lang === "en" ? "en-IE" : `${lang}-${lang.toUpperCase()}`, { style: "currency", currency: o.currency })
      .format((o.effectiveAmountMinor ?? o.amountMinor) / 100);

  const checkout = async (o: Offer) => {
    setError(null);
    const purchaseType = o.purchaseType || "purchase";
    const gateInstanceId = user?.id != null ? readPostGateCohort(user.id)?.gateInstanceId ?? null : null;
    const origin = resolveCommercialOrigin(window.location.search);
    const commercialMeta = {
      certification_id: certificationId,
      offer_code: o.code,
      product_type: o.productCode,
      purchase_type: "certification_package",
      package_purchase_type: purchaseType,
      access_duration_days: o.accessDurationDays ?? null,
      source_page: "certification_page",
    };
    // package_cta_clicked: evento esistente package_selected (anche per guest,
    // prima del redirect al login, per misurare l'intenzione).
    trackFunnelEvent({
      event: "package_selected", cert_slug: certificationSlug, lang, paywall_type: origin.paywallType,
      gate_instance_id: gateInstanceId, metadata: commercialMeta,
    });
    trackEvent("package_selected", {
      language: lang, user_state: analyticsUserStateFrom(user), certification_slug: certificationSlug,
      product_type: o.productCode, purchase_type: purchaseType, source_page: "certification_page",
    });
    if (!user) {
      router.push(`${lang === "en" ? "" : `/${lang}`}/login?redirect=${encodeURIComponent(pathname || "/")}`);
      return;
    }
    if (!o.checkoutAvailable) { setError(t.inactive); return; }
    setBusy(o.code);
    try {
      trackFunnelEvent({
        event: "checkout_started", cert_slug: certificationSlug, lang, paywall_type: origin.paywallType,
        gate_instance_id: gateInstanceId, metadata: commercialMeta,
      });
      trackEvent("checkout_started", {
        language: lang, user_state: analyticsUserStateFrom(user), plan_type: o.productCode,
        purchase_type: "certification_package", source_page: "certification_page", gate_instance_id: gateInstanceId,
      });
      // Ledger commerce esistente (commerce_events).
      void apiFetch("/packages/events", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: "package_selected", offerCode: o.code, source: "certification_page" }),
      }).catch(() => {});
      const r = await apiFetch("/packages/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offerCode: o.code, lang, source: "certification_page", idempotencyKey: crypto.randomUUID(),
          // Solo attribuzione funnel: il backend ricava offerta/prezzo/certificazione dal server.
          session_id: getAnonymousSessionId() ?? null,
          visitor_id: getAnonymousVisitorId() ?? null,
          gate_instance_id: gateInstanceId,
          paywall_type: origin.paywallType,
        }),
      });
      const body = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(body.error || "CHECKOUT_FAILED");
      if (body.url) window.location.href = body.url;
    } catch (e) {
      setError(errorMessage(e instanceof Error ? e.message : "CHECKOUT_FAILED", t));
      setBusy(null);
    }
  };

  const counts = {
    questionCount: resources?.quiz.questionCount,
    labCount: resources?.labs?.count,
    scenarioCount: resources?.scenarios?.count,
    guidePages: resources?.guide?.pageCount,
    mapPages: resources?.maps?.pageCount,
  };
  const ownsTier = (o: Offer) => data?.owned?.tier === o.productCode;

  return <section id="packages" className="mb-6 scroll-mt-24 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6" aria-labelledby="package-title">
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
      <h2 id="package-title" className="text-xl font-black text-slate-950">{t.title}</h2>
      {data?.darkLaunch && isAdmin ? <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">{t.inactive}</span> : null}
    </div>
    {data?.premium ? <p className="mb-4 rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-950">{t.warning}</p> : null}
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <article className="rounded-xl border bg-white p-4">
        <h3 className="font-black">{t.free}</h3>
        <p className="mt-2 text-sm text-slate-600">{t.freeBody}</p>
      </article>
      {offers.map((o) => {
        const complete = packageKind(o.productCode) === "complete";
        const owned = ownsTier(o);
        const activeUntil = owned ? activeUntilLabel(data?.owned?.expiresAt, lang) : null;
        const renewal = o.purchaseType === "renewal";
        const blocked = !!o.blockedReason;
        const label = blocked ? t.owned
          : busy === o.code ? "…"
          : renewal ? t.renew
          : data?.premium ? t.buyAnyway
          : complete && data?.owned?.tier === "dolphin-study" ? t.upgrade
          : t.buy;
        return <article key={o.code} className={`relative rounded-xl border p-4 ${complete ? "border-indigo-400 bg-indigo-50 shadow-sm" : "bg-white"}`}>
          {complete ? <span className="absolute -top-2.5 right-3 rounded-full bg-indigo-600 px-2 py-0.5 text-[11px] font-bold uppercase text-white">{t.recommended}</span> : null}
          <h3 className="font-black text-slate-950">{packageDisplayName(o.productCode, certificationName, lang)}</h3>
          <p className="text-sm text-slate-600">{packageTagline(o.productCode, lang)}</p>
          <p className="mt-3 text-2xl font-black">{money(o)}</p>
          <p className="text-xs font-bold uppercase text-slate-500">{oneTimePaymentLabel(lang)}</p>
          <p className="mt-1 text-sm font-semibold text-indigo-900">{accessValidityLabel(o.accessDurationDays, lang)}</p>
          <ul className="mt-3 space-y-1 text-sm">{packageFeatures(o.productCode, counts, lang).map((f) => <li key={f}>✓ {f}</li>)}</ul>
          {activeUntil ? <p className="mt-3 rounded-lg bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-800">{activeUntil}</p> : null}
          {renewal ? <p className="mt-1 text-xs text-slate-500">{t.renewNote}</p> : null}
          <button type="button" disabled={blocked || busy === o.code} onClick={() => checkout(o)} className="mt-4 min-h-11 w-full rounded-lg bg-slate-950 px-3 font-bold text-white disabled:opacity-50">{label}</button>
        </article>;
      })}
      <article className="rounded-xl border border-blue-300 bg-blue-950 p-4 text-white">
        <h3 className="font-black">Premium</h3>
        <p className="mt-2 text-sm text-blue-100">{t.premium}</p>
        <a href={`${pricingPath(lang)}?source=package_offers&certification_slug=${encodeURIComponent(certificationSlug)}`} className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-white px-4 font-bold text-blue-950">{t.premiumCta}</a>
      </article>
    </div>
    {error ? <p role="alert" className="mt-3 text-sm font-semibold text-red-700">{error}</p> : null}
  </section>;
}
