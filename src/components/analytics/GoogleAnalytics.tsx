"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useConsent } from "@/components/analytics/ConsentProvider";
import { flushPendingAnalyticsEvents } from "@/lib/analytics";
import { isSensitiveAnalyticsPath, sanitizeAnalyticsUrl } from "@/lib/analytics-privacy";
import { googleConsentState } from "@/lib/consent-mode";
import { readStoredAnalyticsConsent } from "@/lib/checkout-analytics";

export default function GoogleAnalytics() {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
  const { status, ready } = useConsent();
  const pathname = usePathname();
  const configured = useRef(false);

  const configureWhenConsented = () => {
    const gtag = (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag;
    // A cached/onReady callback may run after consent has been revoked.
    const current = readStoredAnalyticsConsent();
    gtag?.("consent", "update", googleConsentState(current));
    if (!gtag || current !== "granted" || !GA_ID || isSensitiveAnalyticsPath(pathname)) return;
    if (!configured.current) {
      gtag("js", new Date());
      gtag("config", GA_ID, {
        anonymize_ip: true, ads_data_redaction: true,
        allow_google_signals: false, allow_ad_personalization_signals: false,
        page_location: sanitizeAnalyticsUrl(window.location.href),
      });
      configured.current = true;
    }
    flushPendingAnalyticsEvents();
  };

  useEffect(() => {
    if (!ready || status === "unknown") return;

    const gtag = (window as typeof window & {
      gtag?: (...args: unknown[]) => void;
    }).gtag;

    gtag?.("consent", "update", googleConsentState(status));
  }, [ready, status]);

  // 🔴 se non vedi questo log, la env NON arriva al client
  if (!GA_ID) {
    console.warn("[GA] NEXT_PUBLIC_GA_ID is missing");
    return null;
  }

  // Revocation still updates an already loaded tag in the effect above.
  // Unmounting Script alone does not unload Google's runtime or block its traffic.
  if (!ready || status !== "granted") return null;

  // Pagine con segreti nell'URL: GA4 non parte.
  if (isSensitiveAnalyticsPath(pathname)) return null;

  return (
    <>
      <Script id="ga4-init" strategy="afterInteractive" onReady={configureWhenConsented}>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('consent', 'default', ${JSON.stringify({ ...googleConsentState("denied"), wait_for_update: 500 })});
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
        onReady={configureWhenConsented}
      />
    </>
  );
}
