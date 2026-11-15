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
export const TWA_SOURCE_KEY = "cq_twa_native";
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
 * - ?cq_twa=1 / ?cq_twa=0 forzano il flag solo nelle sessioni desktop; il
 *   referrer Android blocca la modalita' per tutta la sessione. Il flag nasconde
 *   soltanto interfaccia di acquisto, non sblocca nulla.
 */
export function detectTwa(
  opts: { referrer?: string; search?: string; storage?: StorageLike | null } = {}
): boolean {
  const referrer = opts.referrer ?? (typeof document !== "undefined" ? document.referrer : "");
  const search = opts.search ?? (typeof location !== "undefined" ? location.search : "");
  const storage = opts.storage === undefined ? safeSessionStorage() : opts.storage;
  const nativeReferrer = referrer === TWA_REFERRER_PREFIX || referrer.startsWith(`${TWA_REFERRER_PREFIX}/`);
  let native = nativeReferrer;
  try {
    native ||= storage?.getItem(TWA_SOURCE_KEY) === "1";
    if (native) {
      storage?.setItem(TWA_SOURCE_KEY, "1");
      storage?.setItem(TWA_STORAGE_KEY, "1");
    }
  } catch {}
  // A desktop override can never clear a session launched by our Android app.
  if (native) return true;

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
export const TWA_BOOTSTRAP_SCRIPT = `(function(){
var k=${JSON.stringify(TWA_STORAGE_KEY)},n=${JSON.stringify(TWA_SOURCE_KEY)},p=${JSON.stringify(TWA_REFERRER_PREFIX)},r=document.referrer;
var native=r===p||r.indexOf(p+"/")===0,active=native,s;
try{s=window.sessionStorage;native=native||s.getItem(n)==="1";
if(native){s.setItem(n,"1");s.setItem(k,"1")}else{
var forced=new URLSearchParams(location.search).get(k);
if(forced==="1")s.setItem(k,"1");else if(forced==="0")s.removeItem(k)}
active=native||s.getItem(k)==="1"}catch(e){active=native}
if(!active)return;
document.documentElement.setAttribute(${JSON.stringify(TWA_HTML_ATTRIBUTE)},"1");
// Mark SSR links as the parser inserts them, before React hydration or paint.
var segments=${JSON.stringify([...PURCHASE_SEGMENTS])},locales=${JSON.stringify([...LOCALES])};
function mark(a){try{var href=(a.getAttribute("href")||"").trim();if(!href||href.charAt(0)==="#"){a.removeAttribute(${JSON.stringify(TWA_HIDE_ATTRIBUTE)});return}var u=new URL(href,location.href),b=new URL(location.href);
var parts=u.pathname.split("/").filter(Boolean),seg=locales.indexOf(parts[0])>=0?parts[1]:parts[0];
var hidden=(u.protocol==="http:"||u.protocol==="https:")&&(u.origin===b.origin||u.hostname==="certifyquiz.com"||u.hostname.endsWith(".certifyquiz.com"))&&!!seg&&segments.indexOf(seg.toLowerCase())>=0;
if(hidden)a.setAttribute(${JSON.stringify(TWA_HIDE_ATTRIBUTE)},"1");else a.removeAttribute(${JSON.stringify(TWA_HIDE_ATTRIBUTE)})}catch(e){}}
function scan(root){if(root.nodeType!==1)return;if(root.tagName==="A"&&root.hasAttribute("href"))mark(root);root.querySelectorAll("a[href]").forEach(mark)}
if(typeof MutationObserver!=="undefined"){
scan(document.documentElement);
var observer=new MutationObserver(function(ms){ms.forEach(function(m){if(m.type==="attributes")mark(m.target);else m.addedNodes.forEach(scan)})});
observer.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:["href"]});
document.addEventListener("cq:twa-guard-ready",function(){observer.disconnect()},{once:true})}
})();`;
