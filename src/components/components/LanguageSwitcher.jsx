// src/components/LanguageSwitcher.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();

  const parts = pathname.split("/");
  const currentLang = parts[1]; // es. "it", "en", ecc.

  // 👇 Controlla se siamo sulla home vera: /it, /en, ecc.
  const isRootPath = parts.length <= 2 || parts[2] === "";

  const languages = [
    { code: "it", label: "🇮🇹 Italiano" },
    { code: "en", label: "🇬🇧 English" },
    { code: "fr", label: "🇫🇷 Français" },
    { code: "es", label: "🇪🇸 Español" },
  ];

  const switchLang = (code) => {
    const restOfPath = isRootPath
      ? "" // vai alla home della nuova lingua
      : "/" + parts.slice(2).join("/"); // mantieni il percorso

    const newPath = `/${code}${restOfPath}`;
    navigate(newPath + search, { replace: true });
  };

  return (
    <div className="flex gap-2 items-center">
      <Globe size={16} />
      {languages.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => switchLang(code)}
          className={code === currentLang ? "font-bold underline" : "hover:underline"}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
