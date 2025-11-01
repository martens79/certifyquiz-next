"use client";
import { useEffect, useState } from "react";

const KEY = "cq_cookie_consent"; // {accepted:boolean, ts:number}

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      setShow(!saved);
    } catch {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  function setConsent(accepted: boolean) {
    try {
      localStorage.setItem(KEY, JSON.stringify({ accepted, ts: Date.now() }));
    } catch {}
    setShow(false);
  }

  return (
    <div className="fixed bottom-4 inset-x-4 rounded-2xl shadow p-4 bg-white border flex items-center justify-between gap-3 z-50">
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
