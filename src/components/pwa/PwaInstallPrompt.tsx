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
      return;
    }

    const alreadyDismissed = localStorage.getItem("pwa_install_dismissed");
    if (alreadyDismissed === "true") return;

    const handler = (event: Event) => {
      event.preventDefault();

      setDeferredPrompt(event as BeforeInstallPromptEvent);

      setTimeout(() => {
        setVisible(true);
        window.gtag?.("event", "pwa_install_prompt_shown");
      }, 5000);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();

    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      window.gtag?.("event", "pwa_installed");
    }

    setVisible(false);
    setDeferredPrompt(null);
  };

  const dismiss = () => {
    localStorage.setItem("pwa_install_dismissed", "true");
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