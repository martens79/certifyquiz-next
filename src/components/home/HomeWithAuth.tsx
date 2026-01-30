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

    fetch("/api/backend/public/home-stats", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (
          data &&
          typeof data.questions === "number" &&
          typeof data.topics === "number" &&
          typeof data.certifications === "number"
        ) {
          setStats(data);
        }
      })
      .catch(() => {});
  }, []);

  return <Home lang={lang} isLoggedIn={isLoggedIn} stats={stats ?? undefined} />;
}
