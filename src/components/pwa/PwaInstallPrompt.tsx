"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// Flag a livello modulo: persiste per tutta la sessione (navigazione SPA inclusa)
let promptHandledThisSession = false;

const PROMPT_SHOWN_KEY = "pwa_prompt_last_shown";
const PROMPT_DISMISSED_KEY = "pwa_install_dismissed";
const DAYS_COOLDOWN_SHOWN = 14;     // rivisto dopo 14 giorni se ignorato
const DAYS_COOLDOWN_DISMISSED = 30; // rivisto dopo 30 giorni se dismissato

function getLangFromPath() {
  if (typeof window === "undefined") return "en";

  const first = window.location.pathname.split("/").filter(Boolean)[0];

  if (first === "it" || first === "fr" || first === "es") {
    return first;
  }

  return "en";
}

async function trackPwaEvent(event: string) {
  try {
    const lang = getLangFromPath();

    await fetch("/api/backend/admin/funnel-event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event,
        lang,
      }),
    });
  } catch {
    // tracking non deve mai bloccare la UX
  }
}

function shouldShowPrompt(): boolean {
  // Controlla cooldown post-dismiss
  const dismissedAt = localStorage.getItem(PROMPT_DISMISSED_KEY);
  if (dismissedAt) {
    const daysSince = (Date.now() - parseInt(dismissedAt)) / (1000 * 60 * 60 * 24);
    if (daysSince < DAYS_COOLDOWN_DISMISSED) return false;
    // cooldown scaduto: pulisci il flag
    localStorage.removeItem(PROMPT_DISMISSED_KEY);
  }

  // Controlla cooldown post-show (utente ha visto il banner ma non ha interagito)
  const lastShown = localStorage.getItem(PROMPT_SHOWN_KEY);
  if (lastShown) {
    const daysSince = (Date.now() - parseInt(lastShown)) / (1000 * 60 * 60 * 24);
    if (daysSince < DAYS_COOLDOWN_SHOWN) return false;
  }

  return true;
}

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      window.gtag?.("event", "pwa_open");
      trackPwaEvent("pwa_open");
      return;
    }

    // Già gestito in questa sessione (navigazione SPA tra pagine)
    if (promptHandledThisSession) return;

    if (!shouldShowPrompt()) return;

    const handler = (event: Event) => {
      event.preventDefault();

      // Blocca qualsiasi re-trigger per il resto della sessione
      promptHandledThisSession = true;

      setDeferredPrompt(event as BeforeInstallPromptEvent);

      setTimeout(() => {
        setVisible(true);
        // Salva il timestamp del primo show
        localStorage.setItem(PROMPT_SHOWN_KEY, Date.now().toString());
        window.gtag?.("event", "pwa_install_prompt_shown");
        trackPwaEvent("pwa_install_prompt_shown");
      }, 5000);
    };

    const installedHandler = () => {
      window.gtag?.("event", "pwa_installed");
      trackPwaEvent("pwa_installed");
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", installedHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;

    window.gtag?.("event", "pwa_install_clicked");
    trackPwaEvent("pwa_install_clicked");

    await deferredPrompt.prompt();

    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      window.gtag?.("event", "pwa_install_accepted");
      trackPwaEvent("pwa_install_accepted");
      // Pulizia: non serve più mostrarlo
      localStorage.removeItem(PROMPT_SHOWN_KEY);
      localStorage.removeItem(PROMPT_DISMISSED_KEY);
    } else {
      window.gtag?.("event", "pwa_install_dismissed");
      // Trattato come dismiss esplicito
      localStorage.setItem(PROMPT_DISMISSED_KEY, Date.now().toString());
      localStorage.removeItem(PROMPT_SHOWN_KEY);
    }

    setVisible(false);
    setDeferredPrompt(null);
  };

  const dismiss = () => {
    window.gtag?.("event", "pwa_install_banner_dismissed");
    // Salva timestamp dismiss: riprova dopo DAYS_COOLDOWN_DISMISSED
    localStorage.setItem(PROMPT_DISMISSED_KEY, Date.now().toString());
    localStorage.removeItem(PROMPT_SHOWN_KEY);
    setVisible(false);
  };

  if (!visible || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
      <div className="flex items-start gap-3">
        <img
          src="/icons/icon-192.png"
          alt="CertifyQuiz"
          className="h-10 w-10 rounded-xl"
        />

        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-900">
            Installa CertifyQuiz
          </p>

          <p className="mt-1 text-xs text-slate-600">
            Apri quiz, ripassi e simulazioni più velocemente dal tuo telefono.
          </p>

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={installApp}
              className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white"
            >
              Installa
            </button>

            <button
              type="button"
              onClick={dismiss}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700"
            >
              Non ora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}