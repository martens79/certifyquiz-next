// src/components/PWAUpdateBanner.jsx
import React from "react";

/**
 * Banner di aggiornamento PWA.
 * Non contiene più logica di SW: riceve tutto da App.jsx
 */
export default function PWAUpdateBanner({
  visible,
  onUpdate,
  onClose,
  bottomOffset = 24, // distanza dal fondo in px
}) {
  if (!visible) return null;

  return (
    <div
      className="
        fixed left-1/2 -translate-x-1/2
        z-[1000] rounded-xl shadow-lg
        px-4 py-3
        bg-black/90 text-white
        flex items-center gap-3
      "
      style={{ bottom: bottomOffset }}
      role="alert"
      aria-live="polite"
    >
      <span>Nuova versione disponibile.</span>
      <button
        className="underline underline-offset-2"
        onClick={onUpdate}
      >
        Aggiorna
      </button>
      {onClose && (
        <button
          className="ml-2 text-white/70 hover:text-white"
          onClick={onClose}
          aria-label="Chiudi"
          title="Chiudi"
        >
          ✕
        </button>
      )}
    </div>
  );
}
