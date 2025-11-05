import { useEffect, useMemo, useState } from "react";
import { getLabel } from "../utils/langUtils";
import { Lock, X } from "lucide-react";
import { api } from "../services/api"; // ← usa la tua istanza axios



const FALLBACK_ICON =
  "data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>\
<circle cx='12' cy='12' r='10' fill='%23f59e0b'/>\
<text x='12' y='16' font-size='12' text-anchor='middle' fill='white'>🏅</text>\
</svg>";

/**
 * props:
 * - userId: number (obbligatorio)
 * - refresh?: any (opzionale)
 */
export default function UserBadges({ userId, refresh }) {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const MAX_BADGES = 5;

  const fetchBadges = async () => {
  if (!userId) return;
  try {
    setLoading(true);
    const res = await api.get(`/user/user-badges`);
    setBadges(Array.isArray(res.data) ? res.data : []);
  } catch (err) {
    console.error("❌ Errore nel caricamento badge:", err?.response?.status, err?.message);
    setBadges([]);
  } finally {
    setLoading(false);
  }
};


  // primo fetch + refresh quando si torna al tab
  useEffect(() => {
    fetchBadges();
    const onShow = () => document.visibilityState === "visible" && fetchBadges();
    document.addEventListener("visibilitychange", onShow);
    return () => document.removeEventListener("visibilitychange", onShow);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // refetch su prop refresh + cross-tab (localStorage)
  useEffect(() => {
    fetchBadges();
    const onStorage = (e) => { if (e.key === "refreshBadges") fetchBadges(); };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  // refetch nella STESSA tab quando QuizPage emette l'evento custom
  useEffect(() => {
    const onPing = () => fetchBadges();
    window.addEventListener("refreshBadges", onPing);
    return () => window.removeEventListener("refreshBadges", onPing);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // partition: earned vs locked (se earned manca → tutti earned)
  const { earned, locked } = useMemo(() => {
    const rows = Array.isArray(badges) ? badges.slice() : [];

    const hasExplicitTrueFalse = rows.some(b => b?.earned === true || b?.earned === false);
    if (hasExplicitTrueFalse) {
      const earnedRows = rows.filter(b => b?.earned === true);
      const lockedRows = rows.filter(b => b?.earned === false);
      earnedRows.sort((a, b) => {
        const da = a?.issued_at ? new Date(a.issued_at).getTime() : 0;
        const db = b?.issued_at ? new Date(b.issued_at).getTime() : 0;
        return db - da; // più recenti prima
      });
      return { earned: earnedRows, locked: lockedRows };
    }

    // fallback: endpoint non manda earned → trattali tutti come ottenuti
    rows.sort((a, b) => {
      const da = a?.issued_at ? new Date(a.issued_at).getTime() : 0;
      const db = b?.issued_at ? new Date(b.issued_at).getTime() : 0;
      return db - da;
    });
    return { earned: rows, locked: [] };
  }, [badges]);

  // Modal UX: blocca scroll + ESC + tasto indietro
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);

    const state = { cqModalOpen: true };
    window.history.pushState(state, "");
    const onPop = () => setOpen(false);
    window.addEventListener("popstate", onPop);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("popstate", onPop);
      if (window.history.state && window.history.state.cqModalOpen) {
        window.history.back();
      }
    };
  }, [open]);

  if (loading) {
    return (
      <div className="mt-6">
        <h2 className="text-xl font-bold text-gray-800 mb-3">
          🎖️ {getLabel({ it: "Badge ottenuti", en: "Earned badges", fr: "Badges obtenus", es: "Insignias obtenidas" })}
        </h2>
        <div className="flex gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-20 h-20 rounded-lg bg-gray-100 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const remaining = Math.max(earned.length - MAX_BADGES, 0);
  const canOpenModal = remaining > 0 || locked.length > 0;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold text-gray-800 mb-3">
        🎖️ {getLabel({ it: "Badge ottenuti", en: "Earned badges", fr: "Badges obtenus", es: "Insignias obtenidas" })}
      </h2>

      {/* Se non hai earned ma hai catalogo (locked), mostra info + bottone per aprire il modal */}
      {earned.length === 0 && locked.length > 0 && (
        <div className="text-sm text-gray-600 mb-2">
          {getLabel({
            it: "Nessun badge guadagnato finora. Ecco quali puoi sbloccare:",
            en: "No badges earned yet. Here are the ones you can unlock:",
            fr: "Aucun badge obtenu pour le moment. Voici ceux que vous pouvez débloquer :",
            es: "Aún no has conseguido insignias. Estas son las que puedes desbloquear:"
          })}
        </div>
      )}

      {/* Anteprima earned */}
      <div className="flex flex-wrap gap-3 justify-start">
        {earned.slice(0, MAX_BADGES).map((b) => {
          const key = b.badge_id ?? b.id;
          const img = b.image_url || FALLBACK_ICON;
          return <BadgeItem key={key} badge={b} img={img} locked={false} />;
        })}
      </div>

      {/* “…e altri N” oppure “Mostra tutti” se ci sono solo locked */}
      {(canOpenModal || (earned.length === 0 && locked.length > 0)) && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-xs text-blue-600 hover:text-blue-800 underline mt-2"
        >
          {earned.length > 0 && remaining > 0
            ? getLabel({
                it: `…e altri ${remaining}`,
                en: `…and ${remaining} more`,
                fr: `…et ${remaining} autres`,
                es: `…y ${remaining} más`
              })
            : getLabel({ it: "Mostra tutti", en: "Show all", fr: "Tout afficher", es: "Mostrar todos" })}
        </button>
      )}

      {/* Modal: elenco completo (earned + locked grigi) */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl p-6 max-w-5xl w-[92%] max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 p-2 rounded-full hover:bg-gray-100"
              aria-label={getLabel({ it: "Chiudi", en: "Close", fr: "Fermer", es: "Cerrar" })}
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-semibold mb-4">
              {getLabel({ it: "Tutti i badge", en: "All badges", fr: "Tous les badges", es: "Todas las insignias" })}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {earned.map((b) => (
                <BadgeItem
                  key={`e-${b.badge_id ?? b.id}`}
                  badge={b}
                  img={b.image_url || FALLBACK_ICON}
                  locked={false}
                />
              ))}
              {locked.map((b) => (
                <BadgeItem
                  key={`l-${b.badge_id ?? b.id}`}
                  badge={b}
                  img={b.image_url || FALLBACK_ICON}
                  locked={true}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BadgeItem({ badge, img, locked }) {
  return (
    <div
      className="relative group shadow rounded-lg p-2 text-center w-24 flex flex-col items-center transition duration-300 bg-white hover:shadow-md"
      title={badge.description || ""}
    >
      <div className={`relative h-12 w-12 mb-1 rounded-full overflow-hidden ${locked ? "filter grayscale opacity-60" : ""}`}>
        <img
          src={img}
          alt={badge.title}
          className="h-full w-full object-contain"
          onError={(e) => { e.currentTarget.src = FALLBACK_ICON; }}
          loading="lazy"
        />
        {locked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
        )}
      </div>
      <p className="text-[10px] font-semibold text-gray-800 text-center leading-tight line-clamp-2">
        {badge.title}
      </p>
      {locked && (
        <span className="mt-1 text-[10px] uppercase tracking-wide text-gray-500">
          {getLabel({ it: "Non ottenuto", en: "Locked", fr: "Non acquisé", es: "No obtenido" })}
        </span>
      )}
    </div>
  );
}
