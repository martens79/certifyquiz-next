// src/lib/auth.ts

import { clearAllProgressForUser } from "./quiz-storage";

/** Chiave token principale (stessa usata da apiClient) */
export const AUTH_KEY = "cq:access";
/** Chiave legacy (per compatibilità temporanea) */
const LEGACY_KEY = "cq_token";

/** NEW: chiave utente (cache locale) */
export const USER_KEY = "cq_user";

/** NEW: shape minima utente */
export type MinimalUser = {
  id: number;
  email: string;
  name?: string | null;
  role?: string | null;
  premium?: boolean | null;
  trial?: boolean | null;
  username?: string | null;
};

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/** ------- TOKEN ------- */
export function getToken(): string | null {
  if (!isBrowser()) return null;
  try {
    return (
      sessionStorage.getItem(AUTH_KEY) ??
      localStorage.getItem(AUTH_KEY) ??
      sessionStorage.getItem(LEGACY_KEY) ??
      localStorage.getItem(LEGACY_KEY) ??
      null
    );
  } catch {
    return null;
  }
}
/** True se il token "principale" è in localStorage (quindi remember=true) */
export function isTokenRemembered(): boolean {
  if (!isBrowser()) return false;
  try {
    // Priorità: nuovo key, poi legacy
    return (
      localStorage.getItem(AUTH_KEY) !== null ||
      localStorage.getItem(LEGACY_KEY) !== null
    );
  } catch {
    return false;
  }
}
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
    window.dispatchEvent(new CustomEvent("cq:token", { detail: token }));
  } catch {}
}

export function clearToken() {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(LEGACY_KEY);
    sessionStorage.removeItem(LEGACY_KEY);
    window.dispatchEvent(new CustomEvent("cq:token", { detail: null }));
  } catch {}
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

export function authHeader(): Record<string, string> {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

/** ------- USER (cache locale) ------- */
/** NEW */
export function getUser(): MinimalUser | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(USER_KEY) ?? sessionStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as MinimalUser) : null;
  } catch {
    return null;
  }
}

/** NEW */
export function setUser(u: MinimalUser | null, persist: boolean = true) {
  if (!isBrowser()) return;
  try {
    // pulizia preventiva
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(USER_KEY);
    if (u) {
      const json = JSON.stringify(u);
      if (persist) localStorage.setItem(USER_KEY, json);
      else sessionStorage.setItem(USER_KEY, json);
    }
    window.dispatchEvent(new CustomEvent("cq:user", { detail: u }));
  } catch {}
}

/** Costruisce l’URL del backend passando dal proxy Next (/api/backend/...) */
export function backendUrl(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `/api/backend${clean}`;
}

/**
 * Fetch autenticata:
 * - Content-Type auto (no forzatura su FormData)
 * - credentials: "include"
 * - cache: "no-store" (default)
 */
export async function authFetch(
  input: string,
  init: RequestInit & { auth?: boolean } = {}
) {
  const { auth = true, headers, body, ...rest } = init;

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

/**
 * Ripulisce dal localStorage il progresso quiz dell'utente che sta per
 * uscire (chiave "cq:quiz:...:user:<id>"), prima che clearToken()/setUser()
 * lo rendano irraggiungibile via getUser(). Senza questo, su un device
 * condiviso (aula, ufficio — la norma per questo prodotto) il prossimo
 * utente che accede sullo stesso browser potrebbe vedere/ereditare risposte
 * non sue: il fix di scope per user id nella chiave (vedi QuizEngine.tsx)
 * evita la lettura incrociata, questo evita che restino comunque leggibili.
 */
function clearOutgoingUserProgressCache() {
  const u = getUser();
  if (u?.id != null) clearAllProgressForUser(u.id);
}

/** Logout helper */
export function logout() {
  clearOutgoingUserProgressCache();
  clearToken();
  setUser(null); // NEW: pulisci anche l’utente
}

/** Logout + redirect immediato (client-side) */
export function logoutAndRedirect(url: string = "/it/login") {
  logout();
  if (isBrowser()) window.location.href = url;
}

/**
 * Wrapper compat ovunque nell’app.
 * - Usa backendUrl() + authFetch()
 * - Auto-logout su 401 con redirect alla /[lang]/login
 */
export async function apiFetch(path: string, init: RequestInit = {}) {
  const url = backendUrl(path);
  const hadToken = !!getToken();
  let res = await authFetch(url, init);

  if (res.status === 401) {
    // Prova prima a rinnovare l'access token tramite il refresh cookie HttpOnly.
    // Questo wrapper legacy e' ancora usato da diversi componenti globali
    // (tra cui NotificationBell), quindi non deve distruggere una sessione
    // recuperabile al primo 401.
    try {
      const refreshRes = await authFetch(backendUrl("/auth/refresh"), {
        method: "POST",
        auth: false,
      });

      if (refreshRes.ok) {
        const data = (await refreshRes.json()) as { token?: string };
        if (data.token) {
          setToken(data.token, isTokenRemembered());
          res = await authFetch(url, init);
        }
      } else if (refreshRes.status === 401 || refreshRes.status === 403) {
        clearOutgoingUserProgressCache();
        clearToken();
        setUser(null);
        // Un visitatore guest puo' legittimamente ricevere 401 dagli endpoint
        // opzionali: il redirect serve solo quando una sessione esisteva.
        if (hadToken && isBrowser()) {
          const m = location.pathname.match(/^\/(it|en|fr|es)(?:\/|$)/i);
          const lang = (m?.[1]?.toLowerCase() || "it") as "it" | "en" | "fr" | "es";
          location.href = `/${lang}/login?redirect=${encodeURIComponent(location.pathname)}`;
        }
      }
    } catch {
      // Errori di rete/5xx non devono cancellare una sessione locale valida.
    }
  }

  return res;
}

/** Fetch + parse JSON tipizzato (throw su !ok) */
export async function apiFetchJson<T>(path: string, init: RequestInit = {}) {
  const res = await apiFetch(path, init);
  if (!res.ok) throw new Error(`${init.method ?? "GET"} ${path} -> ${res.status}`);
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

/** NEW: listener per cambi utente */
export function onUserChange(cb: (user: MinimalUser | null) => void): () => void {
  if (!isBrowser()) return () => {};
  const handler = (e: Event) => {
    const ev = e as CustomEvent<MinimalUser | null>;
    cb(ev.detail ?? getUser());
  };
  window.addEventListener("cq:user", handler as EventListener);
  return () => window.removeEventListener("cq:user", handler as EventListener);
}
