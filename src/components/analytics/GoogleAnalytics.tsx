"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useConsent } from "@/components/analytics/ConsentProvider";
import { flushPendingAnalyticsEvents } from "@/lib/analytics";
import { isSensitiveAnalyticsPath, SENSITIVE_QUERY_KEYS } from "@/lib/analytics-privacy";

export default function GoogleAnalytics() {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
  const { status, ready } = useConsent();
  const pathname = usePathname();

  useEffect(() => {
    if (!ready || status === "unknown") return;

    const gtag = (window as typeof window & {
      gtag?: (...args: unknown[]) => void;
    }).gtag;

    gtag?.("consent", "update", {
      analytics_storage: status,
      ad_storage: status,
      ad_user_data: status,
      ad_personalization: status,
    });
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
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('consent', 'default', {
            analytics_storage: 'granted',
            ad_storage: 'granted',
            ad_user_data: 'granted',
            ad_personalization: 'granted',
            wait_for_update: 500
          });
          gtag('js', new Date());
          // page_location senza parametri sensibili (token, codici OAuth, email...): vedi lib/analytics-privacy.ts
          var u = new URL(window.location.href);
          ${JSON.stringify(SENSITIVE_QUERY_KEYS)}.forEach(function (k) { u.searchParams.delete(k); });
          gtag('config', '${GA_ID}', { anonymize_ip: true, ads_data_redaction: true, page_location: u.toString() });
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
        onReady={flushPendingAnalyticsEvents}
      />
    </>
  );
}
