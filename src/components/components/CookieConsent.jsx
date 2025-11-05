// src/components/CookieConsent.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getCurrentLang } from "../utils/langUtils";   // <—

export default function CookieConsent() {
  const { isLoggedIn } = useAuth();
  const [show, setShow] = useState(false);
  const lang = getCurrentLang();                       // <—

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setShow(true);
  }, []);

  if (!show) return null;

  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 z-[100] max-w-xl w-[92%] bg-white shadow-xl rounded-xl p-4 transition-all"
      style={{ bottom: isLoggedIn ? "100px" : "20px" }}
    >
      <p className="text-sm">
        Usiamo cookie per migliorare l’esperienza. Leggi la{" "}
        <Link to={`/${lang}/privacy-policy`} className="underline">Privacy Policy</Link>

      </p>

      <div className="mt-3 flex gap-2 justify-end">
        <button
          onClick={() => { localStorage.setItem("cookie-consent", "accepted"); setShow(false); }}
          className="px-3 py-1 rounded bg-black text-white"
        >
          Accetta
        </button>
        <button onClick={() => setShow(false)} className="px-3 py-1 rounded border">
          Rifiuta
        </button>
      </div>
    </div>
  );
}
