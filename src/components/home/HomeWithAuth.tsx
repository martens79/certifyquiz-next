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

    // ✅ PROVA 1 (più probabile): proxy next -> backend
    fetch("/api/backend/public/home-stats")
      .then(async (r) => {
        if (!r.ok) throw new Error(`home-stats ${r.status}`);
        return r.json();
      })
      .then((data) => setStats(data))
      .catch(() => {
        // ✅ fallback: se il proxy richiede /api esplicito
        fetch("/api/backend/api/public/home-stats")
          .then((r) => (r.ok ? r.json() : null))
          .then((data) => {
            if (data) setStats(data);
          })
          .catch(() => {});
      });
  }, []);

  return <Home lang={lang} isLoggedIn={isLoggedIn} stats={stats ?? undefined} />;
}
