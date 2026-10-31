"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useTwa } from "@/hooks/useTwa";
import { localeFromPathname, type TwaLocale } from "@/lib/twa";
import TwaNotice from "./TwaNotice";

/**
 * Cancello per le pagine commerciali renderizzate lato server (landing B2B con listino).
 *
 * Nell'app Android (TWA) il contenuto NON viene montato: al suo posto c'e' l'avviso neutro.
 * Cosi' prezzi, ancore e pulsanti non restano nel DOM sotto l'overlay del TwaGuard, dove
 * sarebbero ancora raggiungibili da tastiera e da screen reader.
 *
 * Lato server e al primo render di idratazione `useTwa()` vale sempre false: l'HTML SSR e'
 * identico per tutti (SEO e crawler non vedono differenze). Sul web normale non cambia nulla.
 */
export default function TwaPurchaseGate({ lang, children }: { lang?: TwaLocale; children: ReactNode }) {
  const isTwa = useTwa();
  const pathname = usePathname();
  if (isTwa) return <TwaNotice lang={lang ?? localeFromPathname(pathname)} variant="section" />;
  return <>{children}</>;
}
