"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { errorMessageFor, readOk } from "@/lib/admin-analytics-dashboard";

export type AsyncState<T> =
  | { status: "loading"; data: null; error: null }
  | { status: "ready"; data: T; error: null }
  | { status: "error"; data: null; error: string };

/**
 * Carica una sezione della dashboard dal backend (aggregati gia' calcolati lato server).
 * Ogni sezione ha il proprio stato: l'errore di una non rompe le altre. Le richieste
 * superate da un cambio di filtri vengono annullate.
 */
export function useAnalytics<T>(
  path: string,
  query: string,
  token: string,
  enabled = true,
) {
  const [state, setState] = useState<AsyncState<T>>({
    status: "loading",
    data: null,
    error: null,
  });
  const [nonce, setNonce] = useState(0);
  const reload = useCallback(() => setNonce((n) => n + 1), []);
  const seq = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    const mine = ++seq.current;
    setState({ status: "loading", data: null, error: null });
    void (async () => {
      try {
        const response = await fetch(
          `/api/backend/admin/analytics/${path}${query ? `?${query}` : ""}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
            cache: "no-store",
          },
        );
        if (!response.ok)
          throw Object.assign(new Error("HTTP"), { status: response.status });
        const json = readOk<T>(await response.json());
        if (mine === seq.current)
          setState({ status: "ready", data: json, error: null });
      } catch (e) {
        if (
          (e as { name?: string }).name === "AbortError" ||
          mine !== seq.current
        )
          return;
        const status = (e as { status?: number }).status ?? 0;
        setState({
          status: "error",
          data: null,
          error: errorMessageFor(status),
        });
      }
    })();
    return () => controller.abort();
  }, [path, query, token, enabled, nonce]);

  return { state, reload };
}
