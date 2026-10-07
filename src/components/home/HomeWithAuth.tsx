// src/components/home/HomeWithAuth.tsx
"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { getToken } from "@/lib/auth";
import Home, { type HomeStats } from "./Home";
import type { FinderCert } from "@/lib/home-finder";

type Props = {
  lang: Locale;
  showIndustrialAutomation?: boolean;
  /** Metriche lette lato server. Se null/assenti si ricade sul fetch client. */
  initialStats?: HomeStats | null;
  finderCerts?: FinderCert[] | null;
};

export default function HomeWithAuth({
  lang,
  showIndustrialAutomation = false,
  initialStats = null,
  finderCerts = null,
}: Props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [stats, setStats] = useState<HomeStats | null>(initialStats);

  useEffect(() => {
    setIsLoggedIn(!!getToken());

    // Metriche gia' presenti dal server: niente richiesta aggiuntiva.
    if (initialStats) return;

    (async () => {
      try {
        // ✅ endpoint reale: /api/public/home-stats
        const r = await fetch("/api/backend/public/home-stats", { cache: "no-store" });
        if (!r.ok) return;
        const data = (await r.json()) as HomeStats;
        setStats(data);
      } catch {
        // silent fail
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo al mount
  }, []);

  return (
    <Home
      lang={lang}
      isLoggedIn={isLoggedIn}
      stats={stats ?? undefined}
      showIndustrialAutomation={showIndustrialAutomation}
      finderCerts={finderCerts}
    />
  );
}
