"use client";

import Script from "next/script";
import { useConsent } from "@/components/analytics/ConsentProvider";

export default function GoogleAnalytics() {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
  const { status, ready } = useConsent();

  // 🔴 se non vedi questo log, la env NON arriva al client
  if (!GA_ID) {
    console.warn("[GA] NEXT_PUBLIC_GA_ID is missing");
    return null;
  }

  if (!ready || status !== "granted") return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
