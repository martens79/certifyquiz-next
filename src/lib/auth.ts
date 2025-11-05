// src/lib/auth.ts

/**
 * Gestione auth lato client (Next.js) con supporto "Remember me":
 * - persist = true  → salva in localStorage (resta dopo il riavvio del browser)
 * - persist = false → salva in sessionStorage (si cancella alla chiusura della tab/finestra)
 */

export const AUTH_KEY = "cq_token";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/** Legge il token: prima sessionStorage (sessione non persistente), poi localStorage */
export function getToken(): string | null {
  if (!isBrowser()) return null;
  try {
    return (
      sessionStorage.getItem(AUTH_KEY) ??
      localStorage.getItem(AUTH_KEY) ??
      null
    );
  } catch {
    return null;
  }
}

/** Salva il token. Se persist=false usa sessionStorage (remember off). */
export function setToken(token: string, persist: boolean = true) {
  if (!isBrowser()) return;
  try {
    if (persist) {
      localStorage.setItem(AUTH_KEY, token);
      sessionStorage.removeItem(AUTH_KEY);
    } else {
      sessionStorage.setItem(AUTH_KEY, token);
      localStorage.removeItem(AUTH_KEY);
    }
    // Notifica opzionale ad altri componenti interessati
    window.dispatchEvent(new CustomEvent("cq:token", { detail: token }));
  } catch {
    // ignore
  }
}

/** Rimuove il token da entrambi gli storage */
export function clearToken() {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(AUTH_KEY);
    window.dispatchEvent(new CustomEvent("cq:token", { detail: null }));
  } catch {
    // ignore
  }
}

/** È loggato se esiste un token */
export function isLoggedIn(): boolean {
  return !!getToken();
}

/** Header Authorization pronto se il token esiste */
export function authHeader(): Record<string, string> {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

/** Costruisce l’URL del backend passando dal proxy Next */
export function backendUrl(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `/api/backend${clean}`;
}

/**
 * fetch con Authorization opzionale (default: true).
 * Uso: await authFetch(backendUrl("/user/me"))
 */
export async function authFetch(
  input: string,
  init: RequestInit & { auth?: boolean } = {}
) {
  const { auth = true, headers, ...rest } = init;
  const base: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string> | undefined),
  };
  const merged = auth ? { ...base, ...authHeader() } : base;
  return fetch(input, { ...rest, headers: merged });
}

/** Logout helper */
export function logout() {
  clearToken();
}

/** Logout + redirect immediato (client-side) */
export function logoutAndRedirect(url: string = "/it") {
  logout();
  if (isBrowser()) window.location.href = url;
}

/** Utility: ascolta cambi token (opzionale). Ritorna l’unsubscribe. */
export function onTokenChange(cb: (token: string | null) => void): () => void {
  if (!isBrowser()) return () => {};
  const handler = (e: Event) => {
    const ev = e as CustomEvent<string | null>;
    cb(ev.detail ?? getToken());
  };
  window.addEventListener("cq:token", handler as EventListener);
  return () => window.removeEventListener("cq:token", handler as EventListener);
}
