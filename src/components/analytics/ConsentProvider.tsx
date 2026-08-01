"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const STORAGE_KEY = "cq_cookie_consent";
const LEGACY_JSON_KEY = "cq:cookie-consent";
const LEGACY_TEXT_KEY = "cookie-consent";

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

function readStoredConsent(): ConsentStatus {
  const current = localStorage.getItem(STORAGE_KEY);
  if (current) {
    const parsed = JSON.parse(current) as { accepted?: boolean };
    if (typeof parsed.accepted === "boolean") {
      return parsed.accepted ? "granted" : "denied";
    }
  }

  const legacyJson = localStorage.getItem(LEGACY_JSON_KEY);
  if (legacyJson) {
    const parsed = JSON.parse(legacyJson) as { status?: string };
    if (parsed.status === "accepted") return "granted";
    if (parsed.status === "rejected") return "denied";
  }

  const legacyText = localStorage.getItem(LEGACY_TEXT_KEY);
  if (legacyText === "accepted") return "granted";
  if (legacyText === "rejected") return "denied";

  return "unknown";
}

function updateGoogleConsent(status: Exclude<ConsentStatus, "unknown">) {
  const gtag = (window as typeof window & {
    gtag?: (...args: unknown[]) => void;
  }).gtag;

  gtag?.("consent", "update", {
    analytics_storage: status,
    ad_storage: status,
    ad_user_data: status,
    ad_personalization: status,
  });
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<ConsentStatus>("unknown");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setStatus(readStoredConsent());
    } catch {
      setStatus("denied");
    } finally {
      setReady(true);
    }
  }, []);

  function setConsent(accepted: boolean) {
    const nextStatus = accepted ? "granted" : "denied";
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ accepted, ts: Date.now() }));
      localStorage.setItem(
        LEGACY_JSON_KEY,
        JSON.stringify({ status: accepted ? "accepted" : "rejected", ts: Date.now() })
      );
      localStorage.setItem(LEGACY_TEXT_KEY, accepted ? "accepted" : "rejected");
    } catch {}
    updateGoogleConsent(nextStatus);
    setStatus(nextStatus);
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
