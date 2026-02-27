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
import { authMe, getAccessToken, clearAuth } from "@/lib/apiClient";
import { isPremiumLocked } from "@/lib/flags";

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // loading SOLO per la primissima “bootstrap” session
  const [loading, setLoading] = useState(true);
  const didInit = useRef(false);

  const [lostSession, setLostSession] = useState(false);
  const refreshInFlight = useRef<Promise<void> | null>(null);

  const refreshMe = async () => {
    if (refreshInFlight.current) return refreshInFlight.current;

    refreshInFlight.current = (async () => {
      const t = getAccessToken();

      // ✅ evita re-render se token identico
      setToken((prev) => (prev === t ? prev : t));

      if (!t) {
        setUser(null);
        setLostSession(false);
        return;
      }

      // ✅ se ho un token, non voglio che lostSession resti “true” durante i retry/login
      setLostSession(false);

      try {
        const me = await authMe();
        setUser(me.user);
      } catch (err: any) {
        const status = err?.status ?? err?.response?.status;

        if (status === 401 || status === 403) {
          clearAuth();
          setToken(null);
          setUser(null);
          setLostSession(true);
        } else {
          // rete/502: non distruggere sessione
          // (qui NON tocchiamo user/token)
        }
      } finally {
        refreshInFlight.current = null;
      }
    })();

    return refreshInFlight.current;
  };

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

    router.replace(
      `${langPrefix}/login?returnTo=${encodeURIComponent(returnTo)}`
    );
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