"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Lock, X } from "lucide-react";
import { apiGet } from "@/services/api";
import { getLabel, safeLabel } from "@/utils/langUtils";

type Lang = "it" | "en" | "fr" | "es";

type BadgeRow = {
  id?: number;
  badge_id?: number;
  title: string;
  description?: string;
  image_url?: string;
  earned?: boolean;
  obtained_at?: string; // server principale
  issued_at?: string;   // fallback da altri endpoint
};

type Props = {
  userId?: number;
  refresh?: unknown;
  lang: Lang;
};

const FALLBACK_ICON =
  "data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>\
<circle cx='12' cy='12' r='10' fill='%23f59e0b'/>\
<text x='12' y='16' font-size='12' text-anchor='middle' fill='white'>🏅</text>\
</svg>";

type Payload = BadgeRow[] | { items?: BadgeRow[] };

function hasItems(x: unknown): x is { items: BadgeRow[] } {
  return typeof x === "object" && x !== null && Array.isArray((x as { items?: unknown }).items);
}

export default function UserBadges({ userId, refresh, lang }: Props) {
  const [badges, setBadges] = useState<BadgeRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const MAX_BADGES = 5;

  const fetchBadges = useCallback(async () => {
    const url = userId ? `/user/user-badges/${userId}` : `/user/user-badges`;
    try {
      setLoading(true);
      const payload = await apiGet<Payload>(url, { params: { lang } });
      const rows: BadgeRow[] = Array.isArray(payload)
        ? payload
        : hasItems(payload)
        ? payload.items!
        : [];
      setBadges(rows);
    } catch {
      setBadges([]);
    } finally {
      setLoading(false);
    }
  }, [userId, lang]);

  // 1) fetch iniziale / cambio lang o userId + visibilità tab
  useEffect(() => {
    fetchBadges();
    const onShow = () => {
      if (document.visibilityState === "visible") fetchBadges();
    };
    document.addEventListener("visibilitychange", onShow);
    return () => document.removeEventListener("visibilitychange", onShow);
  }, [fetchBadges]);

  // 2) refresh esterno via prop `refresh` + localStorage ping
  useEffect(() => {
    fetchBadges();
    const onStorage = (e: StorageEvent) => {
      if (e.key === "refreshBadges") fetchBadges();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refresh, fetchBadges]);

  // 3) refresh via custom event globale
  useEffect(() => {
    const onPing: EventListener = () => fetchBadges();
    window.addEventListener("refreshBadges", onPing as unknown as EventListener);
    return () => window.removeEventListener("refreshBadges", onPing as unknown as EventListener);
  }, [fetchBadges]);

  // Split earned/locked con ordinamento per data (desc)
  const { earned, locked } = useMemo(() => {
    const rows = Array.isArray(badges) ? [...badges] : [];

    const hasFlag = rows.some((b) => b?.earned === true || b?.earned === false);
    if (hasFlag) {
      const earnedRows = rows
        .filter((b) => b?.earned === true)
        .sort((a, b) => {
          const da = new Date(a.obtained_at || a.issued_at || 0).getTime();
          const db = new Date(b.obtained_at || b.issued_at || 0).getTime();
          return db - da;
        });
      const lockedRows = rows.filter((b) => b?.earned === false);
      return { earned: earnedRows, locked: lockedRows };
    }

    rows.sort((a, b) => {
      const da = new Date(a.obtained_at || a.issued_at || 0).getTime();
      const db = new Date(b.obtained_at || b.issued_at || 0).getTime();
      return db - da;
    });
    return { earned: rows, locked: [] };
  }, [badges]);

  // Modal a schermo intero (lock scroll, ESC, back history)
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);

    const state = { cqModalOpen: true };
    window.history.pushState(state, "");
    const onPop = () => setOpen(false);
    window.addEventListener("popstate", onPop);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("popstate", onPop);

      const st = window.history.state as unknown;
      if (st && typeof st === "object" && (st as { cqModalOpen?: boolean }).cqModalOpen) {
        window.history.back();
      }
    };
  }, [open]);

  if (loading) {
    return (
      <div className="mt-6">
        <h2 className="text-xl font-bold text-gray-800 mb-3">
          🎖️{" "}
          {getLabel({
            it: "Badge ottenuti",
            en: "Earned badges",
            fr: "Badges obtenus",
            es: "Insignias obtenidas",
          })}
        </h2>
        <div className="flex gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-20 h-20 rounded-lg bg-gray-100 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const remaining = Math.max(earned.length - MAX_BADGES, 0);
  const canOpenModal = remaining > 0 || locked.length > 0;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold text-gray-800 mb-3">
        🎖️{" "}
        {getLabel({
          it: "Badge ottenuti",
          en: "Earned badges",
          fr: "Badges obtenus",
          es: "Insignias obtenidas",
        })}
      </h2>

      {earned.length === 0 && locked.length > 0 && (
        <div className="text-sm text-gray-600 mb-2">
          {getLabel({
            it: "Nessun badge guadagnato finora. Ecco quali puoi sbloccare:",
            en: "No badges earned yet. Here are the ones you can unlock:",
            fr: "Aucun badge obtenu pour le moment. Voici ceux que vous pouvez débloquer :",
            es: "Aún no has conseguido insignias. Estas son las que puedes desbloquear:",
          })}
        </div>
      )}

      <div className="flex flex-wrap gap-3 justify-start">
        {earned.slice(0, MAX_BADGES).map((b) => {
          const key =
            (b.badge_id != null ? `b-${b.badge_id}` : null) ??
            (b.id != null ? `i-${b.id}` : `t-${b.title}-${b.obtained_at ?? b.issued_at ?? ""}`);
          const img = b.image_url || FALLBACK_ICON;
          return <BadgeItem key={key} badge={b} img={img} locked={false} />;
        })}
      </div>

      {(canOpenModal || (earned.length === 0 && locked.length > 0)) && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-xs text-blue-600 hover:text-blue-800 underline mt-2"
        >
          {earned.length > 0 && remaining > 0
            ? getLabel({
                it: `…e altri ${remaining}`,
                en: `…and ${remaining} more`,
                fr: `…et ${remaining} autres`,
                es: `…y ${remaining} más`,
              })
            : getLabel({
                it: "Mostra tutti",
                en: "Show all",
                fr: "Tout afficher",
                es: "Mostrar todos",
              })}
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl p-6 max-w-5xl w-[92%] max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 p-2 rounded-full hover:bg-gray-100"
              aria-label={safeLabel({ it: "Chiudi", en: "Close", fr: "Fermer", es: "Cerrar" })}
              title={safeLabel({ it: "Chiudi", en: "Close", fr: "Fermer", es: "Cerrar" })}
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-semibold mb-4">
              {getLabel({
                it: "Tutti i badge",
                en: "All badges",
                fr: "Tous les badges",
                es: "Todas las insignias",
              })}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {earned.map((b) => (
                <BadgeItem
                  key={`e-${b.badge_id ?? b.id ?? b.title}`}
                  badge={b}
                  img={b.image_url || FALLBACK_ICON}
                  locked={false}
                />
              ))}
              {locked.map((b) => (
                <BadgeItem
                  key={`l-${b.badge_id ?? b.id ?? b.title}`}
                  badge={b}
                  img={b.image_url || FALLBACK_ICON}
                  locked
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BadgeItem({
  badge,
  img,
  locked,
}: {
  badge: BadgeRow;
  img: string;
  locked: boolean;
}) {
  return (
    <div
      className="relative group shadow rounded-lg p-2 text-center w-24 flex flex-col items-center transition duration-300 bg-white hover:shadow-md"
      title={badge.description || ""}
    >
      <div
        className={`relative h-12 w-12 mb-1 rounded-full overflow-hidden ${
          locked ? "grayscale opacity-60" : ""
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img}
          alt={badge.title}
          className="h-full w-full object-contain"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_ICON;
          }}
          loading="lazy"
        />
        {locked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
        )}
      </div>
      <p className="text-[10px] font-semibold text-gray-800 text-center leading-tight line-clamp-2">
        {badge.title}
      </p>
      {locked && (
        <span className="mt-1 text-[10px] uppercase tracking-wide text-gray-500">
          {getLabel({
            it: "Non ottenuto",
            en: "Locked",
            fr: "Non acquisé",
            es: "No obtenido",
          })}
        </span>
      )}
    </div>
  );
}
