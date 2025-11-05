// src/pages/QuizTopicsPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  BookOpen,
  Cpu,
  Cloud,
  Shield,
  Network,
  Smartphone,
  Wrench,
  Puzzle,
} from "lucide-react";
import CategoryBox from "../components/CategoryBox";
import {
  getLabel,
  safeLabel,
  getCurrentLangFromPath,
  t,
} from "../utils/langUtils";
import toast from "react-hot-toast";
import { api } from "../services/api";

// Helper: costruisce un oggetto i18n dai campi del DB (title, title_it, title_en, ecc.)
const i18nFromRow = (row = {}, base = "title") => {
  const direct = row?.[base];
  if (direct && typeof direct === "object") return direct; // già i18n
  return {
    it: row?.[`${base}_it`] ?? row?.[base] ?? "",
    en: row?.[`${base}_en`] ?? "",
    fr: row?.[`${base}_fr`] ?? "",
    es: row?.[`${base}_es`] ?? "",
  };
};

export default function QuizTopicsPage({
  certificationId,
  certificationName,
  color,
}) {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadErr, setLoadErr] = useState(null);

  // allowlist dinamica per i topic disponibili nella lingua corrente
  const [allowSet, setAllowSet] = useState(new Set());

  const { pathname } = useLocation();
  const lang = getCurrentLangFromPath(pathname);
  const isItalian = lang === "it";

  // 👉 Nascondi il banner quando:
//    - cert id 1 (ITF+) → sempre
//    - OPPURE quando TUTTI i topic della cert sono disponibili nella lingua corrente
const ALWAYS_HIDE = new Set([1]); // ITF+
const fullyTranslated = !isItalian && topics.length > 0 && allowSet.size === topics.length;
const hideAvailBanner = ALWAYS_HIDE.has(certificationId) || fullyTranslated;


  // 👇 Nasconde il banner "Available topics" per le certificazioni che hanno TUTTE le traduzioni complete.
  //const hideAvailBanner = [1].includes(certificationId);

  // Mappa icone per alcuni titoli (chiave in EN per stabilità)
  const topicMeta = {
    1: {
      icons: {
        "Operating Systems": <Cpu size={30} />,
        "Mobile Devices": <Smartphone size={30} />,
        Hardware: <Cpu size={30} />,
        Networking: <Network size={30} />,
        Security: <Shield size={30} />,
        "Cloud Basics": <Cloud size={30} />,
        "Troubleshooting and Support": <Wrench size={30} />,
      },
    },
  };

  // Carica lista topic per certificazione
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setLoadErr(null);

    api
      .get(`/topics/${certificationId}`)
      .then((res) => {
        if (!alive) return;
        const rows = Array.isArray(res.data) ? res.data : [];
        setTopics(rows);
      })
      .catch((err) => {
        console.error("❌ Errore caricamento topics:", err);
        if (!alive) return;
        setLoadErr(err);
        toast.error(t("topicsLoadError", lang));
      })
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [certificationId, lang]);

  // Carica availability dinamica per lingua/certificazione
  useEffect(() => {
    let alive = true;

    if (isItalian) {
      setAllowSet(new Set(topics.map((t) => t.id)));
      return;
    }

    if (!topics.length) {
      setAllowSet(new Set());
      return;
    }

    api
      .get(`/lang-availability?cert=${certificationId}&lang=${lang}`)
      .then((r) => {
        if (!alive) return;
        const ids = Array.isArray(r.data?.topicIds) ? r.data.topicIds : [];
        setAllowSet(new Set(ids));
      })
      .catch((err) => {
        console.warn("⚠️ lang-availability error:", err?.message || err);
        if (!alive) return;
        setAllowSet(new Set()); // fallback: niente abilitato in questa lingua
      });

    return () => {
      alive = false;
    };
  }, [certificationId, lang, isItalian, topics]);

  // Per banner informativo
  const hasAnyEnabled = isItalian || allowSet.size > 0;
  const enabledTitles = !isItalian
    ? topics
        .filter((t) => allowSet.has(t.id))
        .map((t) => safeLabel(i18nFromRow(t, "title"), lang))
    : [];

  return (
    <div className="min-h-screen bg-blue-800">
      <div className="mobile-safe-top px-4 pt-20 pb-[120px] max-w-7xl mx-auto">
        {/* Header certificazione */}
        <h1 className="text-3xl font-bold mb-6 text-center text-white">
          {safeLabel(
            certificationName || {
              it: "Certificazione",
              en: "Certification",
              fr: "Certification",
              es: "Certificación",
            },
            lang
          )}
        </h1>

        {/* Banner lingua */}
        {!isItalian && !hasAnyEnabled && (
          <div className="bg-yellow-100 text-yellow-900 px-4 py-3 rounded-md text-center font-semibold mb-6 shadow">
            {t("topicsOnlyItalian", lang)}
          </div>
        )}

        {!isItalian && hasAnyEnabled && !hideAvailBanner && (
          <div className="bg-blue-100 text-blue-900 px-4 py-3 rounded-md text-center font-medium mb-6 shadow">
            {t("topicsAvailable", lang)} <b>{enabledTitles.join(", ")}</b>
          </div>
        )}

        {/* Stato caricamento / errore / lista */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="h-12 w-12 animate-spin text-white">⏳</div>
          </div>
        ) : loadErr ? (
          <p className="text-center text-gray-200">{t("topicsLoadError", lang)}</p>
        ) : topics.length === 0 ? (
          <p className="text-center text-gray-300">{t("topicsNone", lang)}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map((t) => {
              const titleI18n = i18nFromRow(t, "title");
              const descI18n = i18nFromRow(t, "description");

              let title = safeLabel(titleI18n, lang) || "[Titolo mancante]";
              const description = safeLabel(descI18n, lang) || "";

              const titleEn = safeLabel(titleI18n, "en");
              const icon =
                topicMeta[certificationId]?.icons?.[titleEn] || <BookOpen size={30} />;

              const enabled = isItalian || allowSet.has(t.id);
              const route = enabled ? `/${lang}/quiz/topic/${t.id}` : pathname;

              if (!enabled) {
                title += "  🚧";
              }

              return (
                <CategoryBox
                  key={t.id}
                  title={title}
                  description={description}
                  icon={icon}
                  color={color}
                  route={route}
                />
              );
            })}

            {/* Tile: Quiz misti */}
            {(() => {
              const mixedEnabled = isItalian || allowSet.size > 0;
              const mixedTitle = t("mixedQuiz", lang) + (mixedEnabled ? "" : "  🚧");
              const mixedDesc = t("mixedQuizDesc", lang);

              return (
                <CategoryBox
                  title={mixedTitle}
                  description={mixedDesc}
                  icon={<Puzzle size={30} />}
                  color={color}
                  route={
                    mixedEnabled
                      ? `/${lang}/quiz/${certificationId}/mixed`
                      : pathname
                  }
                />
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
