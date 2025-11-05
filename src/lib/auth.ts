// src/lib/auth.ts

/** Chiave token (remember me opzionale via localStorage/sessionStorage) */
export const AUTH_KEY = "cq_token";

/** Utils runtime */
function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/** Legge il token: prima sessionStorage (non persistente), poi localStorage */
export function getToken(): string | null {
  if (!isBrowser()) return null;
  try {
    return sessionStorage.getItem(AUTH_KEY) ?? localStorage.getItem(AUTH_KEY) ?? null;
  } catch {
    return null;
  }
}

/** Salva il token. Se persist=false usa sessionStorage (remember OFF) */
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
    // Notifica cambio token
    window.dispatchEvent(new CustomEvent("cq:token", { detail: token }));
  } catch {
    /* ignore */
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
    /* ignore */
  }
}

/** Logged-in se esiste un token valido */
export function isLoggedIn(): boolean {
  return !!getToken();
}

/** Header Authorization pronto se il token esiste */
export function authHeader(): Record<string, string> {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

/** Costruisce l’URL del backend passando dal proxy Next (/api/backend/...) */
export function backendUrl(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `/api/backend${clean}`;
}

/**
 * Fetch autenticata con:
 * - Content-Type gestito automaticamente (no forzatura su FormData)
 * - credentials: "include" (cookie/same-site)
 * - cache: "no-store" di default (evita staleness in aree protette)
 */
export async function authFetch(
  input: string,
  init: RequestInit & { auth?: boolean } = {}
) {
  const { auth = true, headers, body, ...rest } = init;

  // Non impostare Content-Type se body è FormData
  const baseHeaders: Record<string, string> =
    body instanceof FormData
      ? { ...(headers as Record<string, string> | undefined) }
      : {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(headers as Record<string, string> | undefined),
        };

  const mergedHeaders = auth ? { ...baseHeaders, ...authHeader() } : baseHeaders;

  return fetch(input, {
    ...rest,
    headers: mergedHeaders,
    credentials: "include",
    cache: init.cache ?? "no-store",
    body,
  });
}

/** Logout helper (solo token) */
export function logout() {
  clearToken();
}

/** Logout + redirect immediato (client-side) */
export function logoutAndRedirect(url: string = "/it/login") {
  logout();
  if (isBrowser()) window.location.href = url;
}

/**
 * Wrapper compatibile usato ovunque nell’app.
 * - Usa backendUrl() + authFetch()
 * - Auto-logout su 401 con redirect alla /[lang]/login
 */
export async function apiFetch(path: string, init: RequestInit = {}) {
  const res = await authFetch(backendUrl(path), init);

  if (res.status === 401) {
    // token scaduto/non valido → clear e redirect alla login della lingua corrente
    clearToken();
    if (isBrowser()) {
      const m = location.pathname.match(/^\/(it|en|fr|es)(?:\/|$)/i);
      const lang = (m?.[1]?.toLowerCase() || "it") as "it" | "en" | "fr" | "es";
      location.href = `/${lang}/login`;
    }
  }

  return res;
}

/** Comodo: fetch + parse JSON tipizzato (throw su !ok) */
export async function apiFetchJson<T>(path: string, init: RequestInit = {}) {
  const res = await apiFetch(path, init);
  if (!res.ok) {
    throw new Error(`${init.method ?? "GET"} ${path} -> ${res.status}`);
  }
  return (await res.json()) as T;
}

/** Listener opzionale per reagire ai cambi token */
export function onTokenChange(cb: (token: string | null) => void): () => void {
  if (!isBrowser()) return () => {};
  const handler = (e: Event) => {
    const ev = e as CustomEvent<string | null>;
    cb(ev.detail ?? getToken());
  };
  window.addEventListener("cq:token", handler as EventListener);
  return () => window.removeEventListener("cq:token", handler as EventListener);
}
