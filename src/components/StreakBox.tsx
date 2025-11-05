'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

type StreakSummary = {
  current_streak: number;
  best_streak: number;
};

type Props = {
  userId?: string | number;
  refresh?: unknown;
  onSummary?: (s: StreakSummary) => void;
};

const SUPPORTED = ['it', 'en', 'fr', 'es'] as const;
type Lang = (typeof SUPPORTED)[number];

function langFromPathname(pathname?: string): Lang {
  if (!pathname) return 'it';
  const m = pathname.match(/^\/(it|en|fr|es)(?:\/|$)/i);
  return (m?.[1]?.toLowerCase() as Lang) || 'it';
}

function labelFor<T extends Record<string, string>>(lang: Lang, obj: T) {
  return obj[lang] ?? obj.it ?? Object.values(obj)[0];
}

export default function StreakBox({ userId, refresh, onSummary }: Props) {
  const pathname = usePathname();
  const lang = langFromPathname(pathname);

  const [streak, setStreak] = useState({ current: 0, record: 0 });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<unknown>(null);

  const onSummaryRef = useRef(onSummary);
  useEffect(() => {
    onSummaryRef.current = onSummary;
  }, [onSummary]);

  const abortRef = useRef<AbortController | null>(null);
  const dayLabel = useMemo(
    () => (n: number) =>
      lang === 'en'
        ? n === 1
          ? 'day'
          : 'days'
        : lang === 'fr'
        ? n === 1
          ? 'jour'
          : 'jours'
        : lang === 'es'
        ? n === 1
          ? 'día'
          : 'días'
        : n === 1
        ? 'giorno'
        : 'giorni',
    [lang]
  );

  async function fetchStreak() {
    if (!userId) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setLoading(true);
      setErr(null);

      // passa sempre dal proxy Next → backend
      const res = await fetch('/api/backend/user/slancio', {
        method: 'GET',
        signal: controller.signal,
        headers: {
          // Se usi token in localStorage:
          ...(typeof window !== 'undefined' && localStorage.getItem('cq_token')
            ? { Authorization: `Bearer ${localStorage.getItem('cq_token')}` }
            : {}),
        },
        cache: 'no-store',
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const current =
        Number(data?.current ?? data?.current_streak ?? data?.streak ?? 0) || 0;
      const record =
        Number(
          data?.best_streak ??
            data?.longest ??
            data?.longest_streak ??
            data?.max_streak ??
            data?.record ??
            0
        ) || 0;

      if (controller.signal.aborted) return;

      setStreak({ current, record });
      onSummaryRef.current?.({ current_streak: current, best_streak: record });
    } catch (e: any) {
      if (e?.name === 'AbortError') return;
      setErr(e);
      setStreak({ current: 0, record: 0 });
      onSummaryRef.current?.({ current_streak: 0, best_streak: 0 });
    } finally {
      if (!abortRef.current?.signal.aborted) setLoading(false);
    }
  }

  useEffect(() => {
    fetchStreak();
    return () => abortRef.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, refresh]);

  return (
    <div className="rounded-xl bg-yellow-50 ring-1 ring-yellow-200 p-3">
      {loading ? (
        <div className="animate-pulse space-y-1">
          <div className="h-4 w-48 bg-yellow-200/60 rounded" />
          <div className="h-3 w-40 bg-yellow-200/50 rounded" />
        </div>
      ) : (
        <>
          <p className="text-yellow-900 font-semibold">
            🔥{' '}
            {labelFor(lang, {
              it: `Slancio attuale: ${streak.current} ${dayLabel(streak.current)}`,
              en: `Current streak: ${streak.current} ${dayLabel(streak.current)}`,
              fr: `Série actuelle : ${streak.current} ${dayLabel(streak.current)}`,
              es: `Racha actual: ${streak.current} ${dayLabel(streak.current)}`,
            })}
          </p>
          <p className="text-yellow-900/90 text-sm">
            🏅{' '}
            {labelFor(lang, {
              it: `Record personale: ${streak.record} ${dayLabel(streak.record)}`,
              en: `Personal best: ${streak.record} ${dayLabel(streak.record)}`,
              fr: `Meilleure série : ${streak.record} ${dayLabel(streak.record)}`,
              es: `Mejor racha: ${streak.record} ${dayLabel(streak.record)}`,
            })}
          </p>

          {err && (
            <p className="text-xs text-yellow-900/70 mt-1">
              {labelFor(lang, {
                it: 'Impossibile aggiornare lo slancio ora.',
                en: 'Unable to refresh streak right now.',
                fr: "Impossible d'actualiser la série pour le moment.",
                es: 'No se puede actualizar la racha ahora.',
              })}
            </p>
          )}
        </>
      )}
    </div>
  );
}
