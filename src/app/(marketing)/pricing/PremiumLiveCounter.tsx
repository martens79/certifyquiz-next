"use client";

import React, { useEffect, useMemo, useState } from "react";

type Stats = { interestedCount: number; targetInterested: number };

const REVEAL_THRESHOLD = 7;
const POLL_MS = 45_000;

async function fetchWaitlistStats(): Promise<Stats | null> {
  try {
    const res = await fetch("/api/backend/premium-waitlist/stats", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;

    const data = await res.json();
    if (!data?.ok) return null;

    return {
      interestedCount: Number(data.interestedCount || 0),
      targetInterested: Number(data.targetInterested || 50),
    };
  } catch {
    return null;
  }
}

export default function PremiumLiveCounter({ lang }: { lang: string }) {
  const [stats, setStats] = useState<Stats>({ interestedCount: 0, targetInterested: 50 });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      const s = await fetchWaitlistStats();
      if (!alive) return;
      if (s) setStats(s);
      setLoaded(true);
    };

    load();

    const id = window.setInterval(load, POLL_MS);

    const onVis = () => {
      if (document.visibilityState === "visible") load();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      alive = false;
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const ui = useMemo(() => {
    const target = stats.targetInterested || 50;

    const labels = {
      it: {
        early: "🔥 Inizio validazione — primi posti disponibili",
        count: (n: number) => `🔥 ${n}/${target} interessati`,
        sub: "Quando arriviamo a 50, apro Premium a 9,99€ per i primi iscritti.",
      },
      en: {
        early: "🔥 Validation started — early spots available",
        count: (n: number) => `🔥 ${n}/${target} interested`,
        sub: "At 50, Premium opens at €9.99 for early supporters.",
      },
      fr: {
        early: "🔥 Validation lancée — places early disponibles",
        count: (n: number) => `🔥 ${n}/${target} intéressés`,
        sub: "À 50, Premium ouvre à 9,99€ pour les premiers inscrits.",
      },
      es: {
        early: "🔥 Validación iniciada — plazas early disponibles",
        count: (n: number) => `🔥 ${n}/${target} interesados`,
        sub: "Al llegar a 50, abro Premium a 9,99€ para los primeros.",
      },
    } as const;

    return (labels as any)[lang] || labels.en;
  }, [lang, stats.targetInterested]);

  const showProgress = loaded && stats.interestedCount >= REVEAL_THRESHOLD;

  const pct = useMemo(() => {
    const target = stats.targetInterested || 50;
    const n = Math.max(0, Math.min(stats.interestedCount || 0, target));
    return target > 0 ? Math.round((n / target) * 100) : 0;
  }, [stats.interestedCount, stats.targetInterested]);

  const badgeText = showProgress ? ui.count(stats.interestedCount) : ui.early;

  return (
    <div className="mt-3 flex flex-col gap-2">
      <span className="inline-flex w-fit items-center rounded-full border px-3 py-1 text-sm font-semibold">
        {badgeText}
      </span>

      {showProgress && (
        <div className="w-full max-w-sm">
          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-black transition-all duration-700"
              style={{ width: `${pct}%` }}
              aria-label="Premium validation progress"
            />
          </div>
          <div className="mt-1 text-xs text-gray-500">{pct}%</div>
        </div>
      )}

      <p className="text-sm opacity-80">{ui.sub}</p>
    </div>
  );
}