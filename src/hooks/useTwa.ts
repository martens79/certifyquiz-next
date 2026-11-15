"use client";

import { useSyncExternalStore } from "react";
import { detectTwa } from "@/lib/twa";

const subscribe = () => () => {};

/**
 * True quando la pagina e' aperta dall'app Android (TWA). Lato server e al primo
 * render di idratazione vale sempre false, cosi' l'HTML SSR resta identico per
 * tutti (SEO e crawler non vedono differenze); dopo l'idratazione si aggiorna.
 */
export function useTwa(): boolean {
  return useSyncExternalStore(subscribe, () => detectTwa(), () => false);
}
