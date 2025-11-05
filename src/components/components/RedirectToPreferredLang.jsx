// src/components/RedirectToPreferredLang.jsx
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const SUPPORTED = ["it", "en", "fr", "es"];

function preferredLang() {
  try {
    // 1) preferisci la lingua scelta dall'utente (salvata da BottomNavbar.changeLang)
    const saved = typeof window !== "undefined" ? localStorage.getItem("preferred_lang") : null;
    if (saved && SUPPORTED.includes(saved)) return saved;

    // 2) fallback: lingua del browser
    const n = (navigator.language || navigator.userLanguage || "en").slice(0, 2).toLowerCase();
    return SUPPORTED.includes(n) ? n : "en";
  } catch {
    return "en";
  }
}

export default function RedirectToPreferredLang() {
  const navigate = useNavigate();
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // Se già c’è /:lang all’inizio
    const m = pathname.match(/^\/([a-z]{2})(?:\/|$)/i);
    if (m) {
      const lang = m[1].toLowerCase();
      if (SUPPORTED.includes(lang)) {
        // lingua valida → non fare nulla
        return;
      }
      // lingua NON valida → riscrivi con la preferita
      const pl = preferredLang();
      const rest = pathname.replace(/^\/[a-z]{2}/i, "");
      navigate(`/${pl}${rest}${search || ""}${hash || ""}`, { replace: true });
      return;
    }

    // Nessuna lingua → aggiungi quella preferita
    const pl = preferredLang();
    const target = pathname === "/" ? `/${pl}/` : `/${pl}${pathname}`;
    navigate(`${target}${search || ""}${hash || ""}`, { replace: true });
  }, [pathname, search, hash, navigate]);

  return null;
}
