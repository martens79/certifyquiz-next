// src/components/RequireAuth.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function currentLang(pathname) {
  const m = pathname.match(/^\/(it|en|fr|es)(?:\/|$)/i);
  return m ? m[1].toLowerCase() : "it";
}

const RequireAuth = ({ children }) => {
  const { ready, isLoggedIn } = useAuth();
  const location = useLocation();
  const lang = currentLang(location.pathname);

  // ⏳ NON redirigere finché l'Auth non è inizializzata
  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        ⏳ Caricamento…
      </div>
    );
  }

  // 🔒 Solo quando ready è true decidi se mandare a login
  if (!isLoggedIn) {
    return (
      <Navigate
        to={`/${lang}/login`}
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return children;
};

export default RequireAuth;
