"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { apiFetch } from "@/lib/auth";
import { trackEvent, trackFunnelEvent } from "@/lib/analytics";
import { packageKind } from "@/lib/commercial-packages";
import { certPath, type Locale } from "@/lib/paths";
import { detectTwa } from "@/lib/twa";
import { useTwa } from "@/hooks/useTwa";

const LABEL = {
  it: "Scegli Complete per questa certificazione",
  en: "Choose Complete for this certification",
  fr: "Choisir Complete pour cette certification",
  es: "Elegir Complete para esta certificación",
};

// Availability comes from the same public offer API used by the landing.
// This is navigation only: prices, ownership and checkout remain server-owned.
export default function MockCompleteLink({ lang, certificationSlug }: {
  lang: Locale; certificationSlug: string;
}) {
  const { loading, user } = useAuth();
  const twa = useTwa();
  const [offerCode, setOfferCode] = useState<string | null>(null);
  useEffect(() => {
    setOfferCode(null);
    if (loading || twa || detectTwa()) return;
    let alive = true;
    apiFetch(`/packages/offers/${encodeURIComponent(certificationSlug)}`)
      .then(async r => r.ok ? r.json() : null)
      .then(data => {
        if (!alive) return;
        const offer = !data?.darkLaunch && Array.isArray(data?.offers) ? data.offers.find(
          (o: { code: string; productCode: string; checkoutAvailable: boolean; blockedReason?: string }) =>
            packageKind(o.productCode) === "complete" && o.checkoutAvailable && !o.blockedReason &&
            typeof o.code === "string" && /^[a-z0-9][a-z0-9_-]{0,99}$/i.test(o.code),
        ) : null;
        setOfferCode(offer?.code ?? null);
      }).catch(() => {});
    return () => { alive = false; };
  }, [certificationSlug, loading, twa, user?.id]);
  if (!offerCode || twa) return null;
  const params = new URLSearchParams({ source: "mock_review", cta: "mock_review", certification_slug: certificationSlug, package_offer: offerCode });
  return <a href={`${certPath(lang, certificationSlug)}?${params}#package-offer-${offerCode}`}
    className="mt-4 mr-3 inline-flex min-h-11 items-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white"
    onClick={() => {
      trackFunnelEvent({ event: "mock_review_cta_clicked", cert_slug: certificationSlug, lang,
        paywall_type: "mock_review", metadata: { source_page: "mock_exam_result", destination: "complete_offer" } });
      trackEvent("mock_review_cta_clicked", { language: lang, certification_slug: certificationSlug,
        source_page: "mock_exam_result", destination: "complete_offer" });
    }}>{LABEL[lang]}</a>;
}
