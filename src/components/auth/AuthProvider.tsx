"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { authMe } from "@/lib/apiClient";
import { isPremiumLocked } from "@/lib/flags";
import {
  getToken,
  getUser as getCachedUser,
  setUser as setCachedUser,
  clearToken,
  onTokenChange,
  onUserChange,
  type MinimalUser,
} from "@/lib/auth";

type User = {
  id: number;
  username: string;
  email: string;
  role: string;
  premium: boolean;
};

type AuthState = {
  token: string | null;
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isPremiumUser: boolean;
  premiumLocked: boolean;
  refreshMe: () => Promise<void>;
};

const AuthCtx = createContext<AuthState | null>(null);

function toUser(u: MinimalUser | User | null): User | null {
  if (!u) return null;
  const anyU = u as any;
  return {
    id: Number(anyU.id),
    username: String(anyU.username ?? anyU.name ?? "").trim() || "User",
    email: String(anyU.email ?? "").trim(),
    role: String(anyU.role ?? "user"),
    premium: Boolean(anyU.premium),
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // ✅ bootstrap immediato da storage (niente flicker)
  const [token, setTokenState] = useState<string | null>(() => getToken());
  const [user, setUserState] = useState<User | null>(() => toUser(getCachedUser()));

  const [loading, setLoading] = useState(true);
  const [lostSession, setLostSession] = useState(false);

  const didInit = useRef(false);
  const refreshInFlight = useRef<Promise<void> | null>(null);

  const refreshMe = async () => {
    if (refreshInFlight.current) return refreshInFlight.current;

    refreshInFlight.current = (async () => {
      try {
        const t = getToken();

        // ✅ aggiorna token state solo se cambia
        setTokenState((prev) => (prev === t ? prev : t));

        if (!t) {
          // logout/guest
          setUserState(null);
          setLostSession(false);
          return;
        }

        // se ho token, non voglio "lostSession" true
        setLostSession(false);

        // se ho già user cache, non devo per forza chiamare /me ogni volta
        // (ma la facciamo comunque in bootstrap e quando token cambia)
        const me = await authMe();
        const normalized = toUser(me.user);

        setUserState(normalized);

        // ✅ aggiorna anche cache locale, così header/slot restano coerenti
        setCachedUser(
          {
            id: normalized!.id,
            email: normalized!.email,
            username: normalized!.username,
            role: normalized!.role,
            premium: normalized!.premium,
          },
          true
        );
      } catch (err: any) {
        const status = err?.status ?? err?.response?.status;

        if (status === 401 || status === 403) {
          // token non valido → logout “hard”
          clearToken();
          setCachedUser(null, true);
          setTokenState(null);
          setUserState(null);
          setLostSession(true);
        } else {
          // rete/502: NON distruggere sessione
          // lascia token/user come stanno
        }
      } finally {
        refreshInFlight.current = null;
      }
    })();

    return refreshInFlight.current;
  };

  // ✅ bootstrap una sola volta
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    (async () => {
      setLoading(true);
      await refreshMe();
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ ascolta cambi token (login/logout) dal tuo lib/auth.ts
  useEffect(() => {
    const off = onTokenChange(async (t) => {
      setTokenState(t);

      if (!t) {
        setUserState(null);
        setLostSession(false);
        return;
      }

      // appena arriva un token nuovo → valida con /me
      await refreshMe();
    });

    return off;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ ascolta cambi user cache (es. login che setta cq_user)
  useEffect(() => {
    const off = onUserChange((u) => {
      setUserState(toUser(u));
    });
    return off;
  }, []);

  // ✅ redirect solo se session persa e non siamo già su /login
  useEffect(() => {
    if (loading) return;
    if (!lostSession) return;
    if (pathname?.includes("/login")) return;

    const returnTo =
      typeof window !== "undefined"
        ? window.location.pathname + window.location.search
        : pathname ?? "/";

    const langPrefix =
      pathname?.startsWith("/it")
        ? "/it"
        : pathname?.startsWith("/fr")
        ? "/fr"
        : pathname?.startsWith("/es")
        ? "/es"
        : "";

    router.replace(`${langPrefix}/login?returnTo=${encodeURIComponent(returnTo)}`);
  }, [lostSession, loading, pathname, router]);

  const value = useMemo<AuthState>(() => {
    const isAdmin = user?.role === "admin";
    const isPremiumUser = !!user?.premium || isAdmin;
    const premiumLocked = isPremiumLocked(isPremiumUser);

    return {
      token,
      user,
      loading,
      isAdmin,
      isPremiumUser,
      premiumLocked,
      refreshMe,
    };
  }, [token, user, loading]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}