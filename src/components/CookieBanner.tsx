"use client";
import { useConsent } from "@/components/analytics/ConsentProvider";

export default function CookieBanner() {
  const { status, ready, setConsent } = useConsent();

  if (!ready || status !== "unknown") return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:right-24 rounded-2xl shadow p-4 bg-white border flex items-center justify-between gap-3 z-[10000]">
      <p className="text-sm">
        Usiamo cookie tecnici e opzionali per migliorare l’esperienza.
      </p>
      <div className="flex gap-2">
        <button onClick={() => setConsent(false)} className="px-3 py-2 border rounded-xl">
          Rifiuta
        </button>
        <button onClick={() => setConsent(true)} className="px-3 py-2 border rounded-xl">
          Accetta
        </button>
      </div>
    </div>
  );
}
