// src/lib/twa.ts
//
// Rilevamento dell'app Android (Trusted Web Activity, package com.certifyquiz.app).
//
// Nell'app Android CertifyQuiz si comporta come app "consumption-only" per le norme
// Google Play sui pagamenti: nessun prezzo, nessun checkout e nessun link verso
// pagine di acquisto. Il sito web e Stripe restano invariati: tutto il
// comportamento qui sotto e' attivo SOLO quando la pagina e' aperta dalla TWA.
//
// Segnale: all'avvio da TWA Chrome imposta document.referrer a
// "android-app://<package>". Lo ricordiamo in sessionStorage (per scheda, mai in
// localStorage ne' in un cookie: sarebbero condivisi con Chrome sullo stesso
// telefono e nasconderebbero gli acquisti anche nel browser normale).
//
// Lo script inline in app/layout.tsx replica questa logica prima del primo paint
// (usa le costanti esportate qui sotto tramite TWA_BOOTSTRAP_SCRIPT).

export const TWA_PACKAGE_ID = "com.certifyquiz.app";
export const TWA_STORAGE_KEY = "cq_twa";
export const TWA_REFERRER_PREFIX = `android-app://${TWA_PACKAGE_ID}`;
/** Attributo impostato su <html> quando l'app gira dentro la TWA. */
export const TWA_HTML_ATTRIBUTE = "data-twa";
/** Attributo che nasconde (via CSS) un elemento acquistabile in modalita' TWA. */
export const TWA_HIDE_ATTRIBUTE = "data-twa-hide";

export type TwaLocale = "it" | "en" | "fr" | "es";

const LOCALES = new Set<string>(["it", "en", "fr", "es"]);

// Primo segmento (dopo l'eventuale prefisso lingua) delle pagine di acquisto o di
// ritorno da un acquisto: pricing nelle 4 lingue, landing B2B con listino, pagine
// di esito Stripe.
const PURCHASE_SEGMENTS = new Set<string>([
  "pricing",
  "prezzi",
  "prix",
  "precios",
  "business",
  "aziende",
  "entreprises",
  "empresas",
  "premium",
  "packages",
]);

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function safeSessionStorage(): StorageLike | null {
  try {
    return typeof sessionStorage === "undefined" ? null : sessionStorage;
  } catch {
    return null;
  }
}

/**
 * True se questa scheda e' stata aperta dalla TWA Android.
 * - ?cq_twa=1 / ?cq_twa=0 forzano il flag (solo per prove su desktop: nasconde
 *   soltanto interfaccia di acquisto, non sblocca nulla).
 */
export function detectTwa(
  opts: { referrer?: string; search?: string; storage?: StorageLike | null } = {}
): boolean {
  const referrer = opts.referrer ?? (typeof document !== "undefined" ? document.referrer : "");
  const search = opts.search ?? (typeof location !== "undefined" ? location.search : "");
  const storage = opts.storage === undefined ? safeSessionStorage() : opts.storage;

  try {
    const forced = new URLSearchParams(search).get(TWA_STORAGE_KEY);
    if (forced === "1") storage?.setItem(TWA_STORAGE_KEY, "1");
    else if (forced === "0") storage?.removeItem(TWA_STORAGE_KEY);
  } catch {
    // storage bloccato: si decide solo col referrer.
  }

  try {
    if (storage?.getItem(TWA_STORAGE_KEY) === "1") return true;
  } catch {
    // ignore
  }

  if (referrer === TWA_REFERRER_PREFIX || referrer.startsWith(`${TWA_REFERRER_PREFIX}/`)) {
    try {
      storage?.setItem(TWA_STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    return true;
  }
  return false;
}

export function localeFromPathname(pathname: string | null | undefined): TwaLocale {
  const first = (pathname ?? "").split("/").filter(Boolean)[0];
  return first && LOCALES.has(first) ? (first as TwaLocale) : "en";
}

/** True se il path e' una pagina di acquisto / listino / ritorno da pagamento. */
export function isPurchasePath(pathname: string): boolean {
  const parts = pathname.split("/").filter(Boolean);
  if (!parts.length) return false;
  const seg = LOCALES.has(parts[0]) ? parts[1] : parts[0];
  return !!seg && PURCHASE_SEGMENTS.has(seg.toLowerCase());
}

/**
 * True se `href` punta a una pagina di acquisto di CertifyQuiz. Link relativi e
 * assoluti verso il nostro dominio; mailto:, tel:, # e domini terzi non contano.
 */
export function isPurchaseHref(href: string | null | undefined, baseOrigin: string): boolean {
  if (!href) return false;
  const trimmed = href.trim();
  if (!trimmed || trimmed.startsWith("#")) return false;
  try {
    const base = new URL(baseOrigin);
    const url = new URL(trimmed, base);
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;
    const sameSite =
      url.origin === base.origin ||
      url.hostname === "certifyquiz.com" ||
      url.hostname.endsWith(".certifyquiz.com");
    return sameSite && isPurchasePath(url.pathname);
  } catch {
    return false;
  }
}

/**
 * Script inline eseguito nel <head> prima del primo paint: imposta data-twa su
 * <html> cosi' i CSS `html[data-twa] [data-twa-hide]` nascondono subito
 * l'interfaccia di acquisto, senza lampeggi dopo l'idratazione.
 * Deve restare equivalente a detectTwa().
 */
export const TWA_BOOTSTRAP_SCRIPT = `(function(){try{var k=${JSON.stringify(
  TWA_STORAGE_KEY
)},p=${JSON.stringify(
  TWA_REFERRER_PREFIX
)},r=document.referrer,s=window.sessionStorage,m=/[?&]${TWA_STORAGE_KEY}=(0|1)(?:&|$)/.exec(location.search);if(m){if(m[1]==="1")s.setItem(k,"1");else s.removeItem(k)}if(s.getItem(k)!=="1"&&(r===p||r.indexOf(p+"/")===0))s.setItem(k,"1");if(s.getItem(k)==="1")document.documentElement.setAttribute(${JSON.stringify(
  TWA_HTML_ATTRIBUTE
)},"1")}catch(e){}})();`;
