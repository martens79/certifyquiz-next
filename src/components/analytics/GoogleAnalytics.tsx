"use client";

import Script from "next/script";

export default function GoogleAnalytics() {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

  // 🔴 se non vedi questo log, la env NON arriva al client
  if (!GA_ID) {
    console.warn("[GA] NEXT_PUBLIC_GA_ID is missing");
    return null;
  }

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
