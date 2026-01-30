// src/components/home/HomeWithAuth.tsx
"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { getToken } from "@/lib/auth";
import Home, { type HomeStats } from "./Home";

type Props = { lang: Locale };

export default function HomeWithAuth({ lang }: Props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [stats, setStats] = useState<HomeStats | null>(null);

  useEffect(() => {
    setIsLoggedIn(!!getToken());

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
  }, []);

  return <Home lang={lang} isLoggedIn={isLoggedIn} stats={stats ?? undefined} />;
}
