"use client";

import Script from "next/script";
import { useEffect } from "react";
import { useConsent } from "@/components/analytics/ConsentProvider";

export default function GoogleAnalytics() {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
  const { status, ready } = useConsent();

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

  return (
    <>
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            wait_for_update: 500
          });
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { anonymize_ip: true, ads_data_redaction: true });
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
    </>
  );
}
