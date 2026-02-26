"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authMe, getAccessToken, clearAuth } from "@/lib/apiClient";
import { isPremiumLocked } from "@/lib/flags";

type User = { id: number; username: string; email: string; role: string; premium: boolean };

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
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshMe = async () => {
    const t = getAccessToken();
    setToken(t);

    if (!t) {
      setUser(null);
      return;
    }

    try {
      const me = await authMe(); // GET /api/backend/auth/me (con refresh automatico)
      setUser(me.user);
    } catch {
      clearAuth();          // ✅ evita token zombie
      setToken(null);
      setUser(null);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await refreshMe();
      setLoading(false);
    })();
  }, []);

  const value = useMemo<AuthState>(() => {
    const isAdmin = user?.role === "admin";
    const isPremiumUser = !!user?.premium || isAdmin;   // ✅ admin sees everything
    const premiumLocked = isPremiumLocked(isPremiumUser); // ✅ governato dai flag

    return { token, user, loading, isAdmin, isPremiumUser, premiumLocked, refreshMe };
  }, [token, user, loading]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}