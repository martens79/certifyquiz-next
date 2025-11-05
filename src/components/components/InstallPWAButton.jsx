import { useEffect, useMemo, useState } from "react";

const DISMISSED_KEY = "cq:a2hsDismissedAt";

export default function InstallPWAButton({
  offsetBottom = 100,
  hideAfterDismissHours = 24,
  forceVisible = false,        // 👈 forza la visibilità del bottone per i test
  className = "",
}) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [canInstall, setCanInstall] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const isStandalone = useMemo(() => {
    return (
      window.matchMedia?.("(display-mode: standalone)")?.matches ||
      window.navigator.standalone === true
    );
  }, []);

  const shouldShowByDismiss = () => {
    if (hideAfterDismissHours === 0) return true;
    try {
      const ts = parseInt(localStorage.getItem(DISMISSED_KEY) || "0", 10);
      if (!ts) return true;
      return Date.now() - ts >= hideAfterDismissHours * 3600 * 1000;
    } catch {
      return true;
    }
  };

  useEffect(() => {
    if (isStandalone) return; // già installata → non mostrare

    const onBeforeInstall = (e) => {
      e.preventDefault(); // blocca mini-infobar
      setDeferredPrompt(e);
      setCanInstall(true);
      console.log("[PWA] beforeinstallprompt catturato: prompt disponibile.");
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, [isStandalone]);

  useEffect(() => {
    // se forziamo la visibilità, ignoriamo i throttle del browser
    if (forceVisible && !isStandalone) {
      setCanInstall(shouldShowByDismiss());
    }
  }, [forceVisible, isStandalone]);

  const onClickInstall = async () => {
    // se il browser ha emesso l'evento, mostriamo il prompt nativo
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice; // "accepted" | "dismissed"
        setDeferredPrompt(null);
        if (outcome === "accepted") setCanInstall(false);
        else {
          if (hideAfterDismissHours > 0) {
            try { localStorage.setItem(DISMISSED_KEY, String(Date.now())); } catch {}
          }
          setCanInstall(false);
        }
        return;
      } catch {
        // continua su fallback
      }
    }
    // fallback: niente evento → mostra istruzioni manuali
    setShowHelp(true);
  };

  const onDismiss = () => {
    if (hideAfterDismissHours > 0) {
      try { localStorage.setItem(DISMISSED_KEY, String(Date.now())); } catch {}
    }
    setCanInstall(false);
    setShowHelp(false);
  };

  if (isStandalone) return null;
  if (!canInstall && !forceVisible) return null;

  const bottomStyle = {
    bottom: `calc(${offsetBottom}px + env(safe-area-inset-bottom, 0px) + 16px)`,
    right: `calc(env(safe-area-inset-right, 0px) + 16px)`,
  };

  return (
    <>
      <div
        className={`fixed z-[1100] flex items-center gap-2 bg-blue-600 text-white rounded-xl shadow-lg px-3 py-2 ${className}`}
        style={bottomStyle}
        role="dialog"
        aria-label="Installa l'app"
      >
        <button onClick={onClickInstall} className="font-medium" aria-label="Installa app">
          Installa app
        </button>
        <button
          onClick={onDismiss}
          className="opacity-90 hover:opacity-100 text-white/90"
          aria-label="Chiudi"
          title="Non mostrare per un po'"
        >
          ✕
        </button>
      </div>

      {showHelp && (
        <div
          className="fixed inset-0 z-[1200] bg-black/40 grid place-items-center px-4"
          onClick={() => setShowHelp(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-xl shadow-xl p-4 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-2">Come installare</h2>
            <ul className="text-sm space-y-1 list-disc pl-5">
              <li><b>Android/Chrome:</b> Menu ⋮ → <i>Aggiungi a schermata Home</i></li>
              <li><b>iPhone (Safari):</b> Condividi → <i>Aggiungi a Home</i></li>
              <li><b>Desktop Chrome:</b> icona ⊕ nella barra degli indirizzi → <i>Installa</i></li>
            </ul>
            <div className="mt-3 flex justify-end gap-2">
              <button onClick={() => setShowHelp(false)} className="px-3 py-1 rounded bg-slate-200">
                Ok
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
