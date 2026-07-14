"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const STORAGE_KEY = "cq_cookie_consent"; // stessa chiave già usata da CookieBanner

type ConsentStatus = "unknown" | "granted" | "denied";

type ConsentContextValue = {
  status: ConsentStatus;
  ready: boolean;
  setConsent: (accepted: boolean) => void;
};

const ConsentContext = createContext<ConsentContextValue>({
  status: "unknown",
  ready: false,
  setConsent: () => {},
});

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<ConsentStatus>("unknown");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setStatus(parsed.accepted ? "granted" : "denied");
      }
    } catch {
      setStatus("denied");
    } finally {
      setReady(true);
    }
  }, []);

  function setConsent(accepted: boolean) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ accepted, ts: Date.now() }));
    } catch {}
    setStatus(accepted ? "granted" : "denied");
  }

  return (
    <ConsentContext.Provider value={{ status, ready, setConsent }}>
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  return useContext(ConsentContext);
}
