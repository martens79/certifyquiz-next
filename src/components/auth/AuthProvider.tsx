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
  const [loading, setLoading] = useState(true);

  // serve solo per sapere che "avevamo un token" ma è diventato invalido
  const [lostSession, setLostSession] = useState(false);

  // ✅ evita più refreshMe simultanei (login/profile/header ecc.)
  const refreshInFlight = useRef<Promise<void> | null>(null);

  const refreshMe = async () => {
    if (refreshInFlight.current) return refreshInFlight.current;

    refreshInFlight.current = (async () => {
      const t = getAccessToken();
      setToken(t);

      if (!t) {
        // utente non loggato: ok, nessun redirect automatico
        setUser(null);
        setLostSession(false);
        return;
      }

      try {
        const me = await authMe(); // GET /api/backend/auth/me
        setUser(me.user);
        setLostSession(false);
      } catch (err: any) {
        const status = err?.status ?? err?.response?.status;

        // ✅ SOLO token invalido/scaduto => logout + redirect
        if (status === 401 || status === 403) {
          clearAuth();
          setToken(null);
          setUser(null);
          setLostSession(true);
        } else {
          // ✅ rete/502/timeout: NON buttare giù la sessione e NON redirectare
          setLostSession(false);
        }
      } finally {
        refreshInFlight.current = null;
      }
    })();

    return refreshInFlight.current;
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await refreshMe();
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Redirect UX: se perdi sessione (401/403), manda a login con returnTo (preserva lingua)
  useEffect(() => {
    if (loading) return;
    if (!lostSession) return;

    // Evita loop se sei già su login (root o lang)
    if (pathname?.includes("/login")) return;

    const returnTo =
      typeof window !== "undefined"
        ? window.location.pathname + window.location.search
        : pathname ?? "/";

    // ✅ Preserva prefisso lingua (IT/FR/ES). EN = root.
    const langPrefix =
      pathname?.startsWith("/it") ? "/it" :
      pathname?.startsWith("/fr") ? "/fr" :
      pathname?.startsWith("/es") ? "/es" :
      ""; // EN root

    router.replace(`${langPrefix}/login?returnTo=${encodeURIComponent(returnTo)}`);
  }, [lostSession, loading, pathname, router]);

  const value = useMemo<AuthState>(() => {
    const isAdmin = user?.role === "admin";
    const isPremiumUser = !!user?.premium || isAdmin; // admin sees everything
    const premiumLocked = isPremiumLocked(isPremiumUser);

    return { token, user, loading, isAdmin, isPremiumUser, premiumLocked, refreshMe };
  }, [token, user, loading]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}