// src/components/StreakBox.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { getLabel } from "../utils/langUtils";
import { api } from "../services/api";

/**
 * StreakBox
 *  - Mostra slancio attuale e record personale
 *  - Chiama onSummary({ current_streak, best_streak }) quando carica
 *
 * Props:
 *  - userId: string|number (usato solo per attendere che /me sia pronto)
 *  - refresh: qualsiasi valore che cambi per forzare un refetch
 *  - onSummary?: (summary) => void
 */
export default function StreakBox({ userId, refresh, onSummary }) {
  const [streak, setStreak] = useState({ current: 0, record: 0 });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // conserva l’ultima callback senza innescare re-render
  const onSummaryRef = useRef(onSummary);
  useEffect(() => {
    onSummaryRef.current = onSummary;
  }, [onSummary]);

  // Abort per cancellare richieste precedenti
  const abortRef = useRef(null);

  const dayLabel = useMemo(() => (n) => (n === 1 ? "giorno" : "giorni"), []);

  async function fetchStreak() {
    // Usiamo l'id solo per aspettare che l'utente sia caricato,
    // la rotta /user/slancio prende l'id dal JWT.
    if (!userId) return;

    // aborta eventuale richiesta in corso
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setLoading(true);
      setErr(null);

      // passa sempre dall’istanza api (gestisce Bearer + silent refresh)
      const res = await api.get("/user/slancio", { signal: controller.signal });
      const data = res?.data || {};

      // normalizzazione campi possibili (supporto alias dal backend)
      const current =
        Number(
          data.current ??
          data.current_streak ??
          data.streak ??
          0
        ) || 0;

      const record =
        Number(
          data.best_streak ??
          data.longest ??
          data.longest_streak ??
          data.max_streak ??
          data.record ??
          0
        ) || 0;

      if (controller.signal.aborted) return;

      setStreak({ current, record });
      onSummaryRef.current?.({
        current_streak: current,
        best_streak: record,
      });
    } catch (e) {
      // axios cancellation
      if (e?.code === "ERR_CANCELED" || e?.name === "CanceledError") return;
      console.warn("Errore slancio:", e?.response?.status, e?.response?.data || e);
      setErr(e);
      setStreak({ current: 0, record: 0 });
      onSummaryRef.current?.({ current_streak: 0, best_streak: 0 });
    } finally {
      if (!abortRef.current?.signal.aborted) setLoading(false);
    }
  }

  // NIENTE onSummary nelle deps → evita richieste infinite
  useEffect(() => {
    fetchStreak();
    return () => abortRef.current?.abort();
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
            🔥{" "}
            {getLabel({
              it: `Slancio attuale: ${streak.current} ${dayLabel(streak.current)}`,
              en: `Current streak: ${streak.current} ${streak.current === 1 ? "day" : "days"}`,
              fr: `Série actuelle : ${streak.current} ${streak.current === 1 ? "jour" : "jours"}`,
              es: `Racha actual: ${streak.current} ${streak.current === 1 ? "día" : "días"}`,
            })}
          </p>
          <p className="text-yellow-900/90 text-sm">
            🏅{" "}
            {getLabel({
              it: `Record personale: ${streak.record} ${dayLabel(streak.record)}`,
              en: `Personal best: ${streak.record} ${streak.record === 1 ? "day" : "days"}`,
              fr: `Meilleure série : ${streak.record} ${streak.record === 1 ? "jour" : "jours"}`,
              es: `Mejor racha: ${streak.record} ${streak.record === 1 ? "día" : "días"}`,
            })}
          </p>

          {err && (
            <p className="text-xs text-yellow-900/70 mt-1">
              {getLabel({
                it: "Impossibile aggiornare lo slancio ora.",
                en: "Unable to refresh streak right now.",
              })}
            </p>
          )}
        </>
      )}
    </div>
  );
}
