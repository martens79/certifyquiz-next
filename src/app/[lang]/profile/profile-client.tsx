// src/app/[lang]/profile/profile-client.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// ✅ tuoi servizi/contesti reali (restano invariati)
import { api } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

// ✅ util i18n (TS)
import { getLabel, safeLabel } from "@/utils/langUtils";

// ✅ componenti esistenti
import LogoutButton from "@/components/LogoutButton";
import StreakBox from "@/components/StreakBox";
import UserBadges from "@/components/profile/UserBadges";
import { getFallbackAvatar } from "@/utils/avatar";

// ✅ chart (stesso pacchetto, lato client)
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Lang = "it" | "en" | "fr" | "es";

export default function ProfileClient({ lang }: { lang: Lang }) {
  const { user, token, setUser, ready, isLoggedIn } = useAuth();
  const profileRef = useRef<HTMLDivElement | null>(null);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        ⏳ {getLabel({ it: "Caricamento profilo...", en: "Loading profile..." })}
      </div>
    );
  }
  if (!isLoggedIn || !user) return null;

  // --- State ---
  const [examHistory, setExamHistory] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [selectedCertId, setSelectedCertId] = useState<string>("");
  const [certStats, setCertStats] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [categoryProgress, setCategoryProgress] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(true);
  const [showAll, setShowAll] = useState<boolean>(false);
  const maxToShow = 4;
  const [filterType, setFilterType] = useState<"all" | "topic" | "misto">("all");
  const [refreshStreak, setRefreshStreak] = useState<boolean>(false);
  const [badges, setBadges] = useState<any[]>([]);
  const [refreshBadgesFlag, setRefreshBadgesFlag] = useState<boolean>(false);
  const [showAllBadges, setShowAllBadges] = useState<boolean>(false);
  const [streakSummary, setStreakSummary] = useState<{ current: number | null; record: number | null }>({
    current: null, record: null
  });
  const [stats, setStats] = useState<any>(null);

  const fallbackCurrentStreak = Number(
    (user as any)?.current_streak ??
    (user as any)?.streak ??
    (user as any)?.currentStreak ?? 0
  );

  const bestStreak = useMemo(() => {
    const u: any = user || {};
    const vals = [
      u.best_streak, u.bestStreak,
      u.max_streak, u.maxStreak,
      u.record_streak, u.recordStreak,
      u.highest_streak, u.highestStreak,
      u.longest_streak, u.longestStreak,
      u.personal_best, u.personalBest,
      u.streak_record, u.streakRecord,
      u.record, u.best
    ].map((v: any) => (v == null ? null : Number(v)))
     .filter((n: any) => Number.isFinite(n) && n >= 0);
    if (vals.length) return Math.max(...vals);

    try {
      const lu = JSON.parse(localStorage.getItem("user") || "{}");
      const ls = [
        lu.best_streak, lu.bestStreak, lu.max_streak, lu.maxStreak,
        lu.record_streak, lu.recordStreak, lu.highest_streak, lu.highestStreak,
        lu.longest_streak, lu.longestStreak, lu.personal_best, lu.personalBest,
        lu.streak_record, lu.streakRecord, lu.record, lu.best
      ].map((v: any) => (v == null ? null : Number(v)))
       .filter((n: any) => Number.isFinite(n) && n >= 0);
      if (ls.length) return Math.max(...ls);
    } catch {}
    return 0;
  }, [user, refreshStreak]);

  // =========================
  // LISTENER refresh badges/streak
  // =========================
  useEffect(() => {
    const bumpBadges = () => setRefreshBadgesFlag(v => !v);
    const bumpStreak = () => setRefreshStreak(v => !v);

    const onStorage = (e: StorageEvent) => {
      if (e.key === "refreshBadges" && e.newValue) {
        bumpBadges();
        localStorage.removeItem("refreshBadges");
      }
      if (e.key === "refreshStreak" && e.newValue) {
        try {
          const updatedUser = JSON.parse(localStorage.getItem("user") || "null");
          if (updatedUser) setUser(updatedUser);
        } catch {}
        bumpStreak();
        localStorage.removeItem("refreshStreak");
      }
    };

    if (localStorage.getItem("refreshBadges")) {
      bumpBadges();
      localStorage.removeItem("refreshBadges");
    }
    if (localStorage.getItem("refreshStreak")) {
      try {
        const updatedUser = JSON.parse(localStorage.getItem("user") || "null");
        if (updatedUser) setUser(updatedUser);
      } catch {}
      bumpStreak();
      localStorage.removeItem("refreshStreak");
    }

    window.addEventListener("storage", onStorage as any);
    window.addEventListener("badges:refresh", bumpBadges as any);

    return () => {
      window.removeEventListener("storage", onStorage as any);
      window.removeEventListener("badges:refresh", bumpBadges as any);
    };
  }, [setUser]);

  // =========================
  // FETCH: Badges
  // =========================
  useEffect(() => {
    if (!ready || !isLoggedIn || !user?.id) return;
    (async () => {
      try {
        const { data } = await api.get(`/user/user-badges`);
        setBadges(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Errore nel recupero dei badge:", err);
      }
    })();
  }, [ready, isLoggedIn, (user as any)?.id, refreshBadgesFlag]);

  // =========================
  // FETCH: Quiz results + Certifications
  // =========================
  useEffect(() => {
    if (!ready || !isLoggedIn || !token) return;

    api
      .get("/quiz-results")
      .then(({ data }) => {
        if (!Array.isArray(data)) return;
        const withComputed = data.map((r: any) => {
          const total = r.total_questions ?? 0;
          const correct = r.correct_answers ?? 0;
          const PASS_THRESHOLD = 80;
          const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
          const passed = percentage >= PASS_THRESHOLD;
          return { ...r, percentage, passed };
        });
        setExamHistory(withComputed);
      })
      .catch((err) => {
        console.error("❌ /quiz-results:", err);
        setError(getLabel({ it: "❌ Errore storico quiz", en: "❌ Error fetching quiz history" }) as string);
      });

    api
      .get("/get-certifications")
      .then(({ data }) => {
        if (Array.isArray(data)) setCertifications(data);
      })
      .catch((err) => {
        console.error("❌ /get-certifications:", err);
        setError(getLabel({ it: "❌ Errore certificazioni", en: "❌ Error fetching certifications" }) as string);
      });
  }, [ready, isLoggedIn, token]);

  // =========================
  // FETCH: Cert stats
  // =========================
  useEffect(() => {
    if (!ready || !isLoggedIn || !token || !user?.id || !selectedCertId) return;
    api
      .get(`/user-certification-stats/${(user as any).id}/${selectedCertId}`)
      .then(({ data }) => setCertStats(data))
      .catch((err) => {
        console.error("/user-certification-stats", err);
        setError(getLabel({ it: "Errore statistiche certificazione", en: "Error loading certification statistics" }) as string);
      });
  }, [ready, isLoggedIn, token, (user as any)?.id, selectedCertId]);

  // =========================
  // FETCH: Category progress
  // =========================
  useEffect(() => {
    if (!ready || !isLoggedIn || !token || !user?.id) return;
    api
      .get(`/user/user-categories-progress`)
      .then(({ data }) => {
        if (Array.isArray(data)) setCategoryProgress(data);
      })
      .catch((err) => {
        console.error("❌ /user-categories-progress:", err);
        setError(getLabel({ it: "Errore caricamento progressi", en: "Error loading progress data" }) as string);
      });
  }, [ready, isLoggedIn, token, (user as any)?.id]);

  // =========================
  // FETCH: Exam history (dettagliato)
  // =========================
  useEffect(() => {
    if (!ready || !isLoggedIn || !user?.id) return;
    const fetchHistory = async () => {
      try {
        setLoadingHistory(true);
        const { data } = await api.get(`/user/user-history`);
        if (data?.items && data?.stats) {
          setExamHistory(Array.isArray(data.items) ? data.items : []);
          setStats(data.stats);
        } else {
          setExamHistory(Array.isArray(data) ? data : []);
          setStats(null);
        }
      } catch (error) {
        console.error("❌ Errore nel caricamento dello storico quiz:", error);
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchHistory();
  }, [ready, isLoggedIn, (user as any)?.id]);

  // =========================
  // DERIVATE e UI helpers
  // =========================
  const filteredHistory = (examHistory || []).filter((e: any) => {
    const sameCert = !selectedCertId || String(e.certification_id) === String(selectedCertId);
    const isMixedQuiz = typeof e.quiz_id === "number" && e.quiz_id < 0;
    const isTopicQuiz = e.quiz_id === null || e.quiz_id === undefined || e.quiz_id === 0;
    switch (filterType) {
      case "misto":
        return sameCert && isMixedQuiz;
      case "topic":
        return sameCert && isTopicQuiz;
      default:
        return sameCert;
    }
  });

  const clamp = (v: number) => Math.max(0, Math.min(100, v));

  const validPercents = filteredHistory
    .map((ex: any) => {
      if (ex.percentage != null) {
        const p = Number(ex.percentage);
        return Number.isFinite(p) ? clamp(p) : null;
      }
      const s = Number(ex.score);
      if (!Number.isFinite(s)) return null;
      return s <= 1 ? clamp(s * 100) : clamp(s);
    })
    .filter((p: any) => p != null) as number[];

  const overallAverage = validPercents.length
    ? (validPercents.reduce((sum, p) => sum + p, 0) / validPercents.length).toFixed(1)
    : null;

  const filteredCategoryProgress = (categoryProgress || []).filter(
    (row: any) => Number(row?.total_topics) > 0 && Number(row?.quizTaken) > 0
  );

  const quizDataForChart = filteredHistory
    .filter(
      (e: any) =>
        typeof e.correct_answers === "number" &&
        typeof e.total_questions === "number" &&
        e.total_questions > 0 &&
        (typeof e.date === "string" || typeof e.date_taken === "string")
    )
    .map((e: any) => {
      const dateSrc = e.date || e.date_taken || e.created_at;
      return {
        date: new Date(dateSrc).toLocaleDateString("it-IT", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        }),
        score: Math.round((e.correct_answers / e.total_questions) * 100),
        cert: e.certification_name || "",
      };
    })
    .slice(-5)
    .reverse();

  const streakMotivation = () => {
    const s = (user as any)?.current_streak || (user as any)?.streak || 0;
    if (s >= 10) return "🔥 Sei una macchina da quiz! Non fermarti ora!";
    if (s >= 7) return "🎯 Una settimana di fuoco! Continua così!";
    if (s >= 5) return "💪 Slancio solido! Mantieni il ritmo!";
    if (s >= 3) return "📈 Stai creando una bella abitudine!";
    if (s === 2) return "✨ Due giorni consecutivi! Si comincia bene!";
    if (s === 1) return "🚀 Ottimo inizio! Torna domani per il bonus!";
    return null;
    };

  const motivationalMessage = () => {
    const avg = parseFloat(String(overallAverage ?? "0"));
    if (avg >= 90) return getLabel({ it: "🌟 Eccezionale! Sei pronto all'esame!", en: "🌟 Outstanding! You're ready for the exam!" });
    if (avg >= 75) return getLabel({ it: "🚀 Ottimo lavoro, continua così!", en: "🚀 Great job, keep it up!" });
    if (avg >= 50) return getLabel({ it: "💡 Buon inizio! Hai margine di miglioramento.", en: "💡 Good start! There's room for improvement." });
    if (avg > 0) return getLabel({ it: "📘 Studia ancora un po' e riprova!", en: "📘 Study a bit more and try again!" });
    return null;
  };

  const handleExportPDF = async () => {
    const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
      import("html2canvas"),
      import("jspdf"),
    ]);
    if (!profileRef.current) return;
    const canvas = await html2canvas(profileRef.current);
    const pdf = new jsPDF("p", "mm", "a4");
    const imgData = canvas.toDataURL("image/png");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("profilo_certifyquiz.pdf");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-indigo-50/30 text-[#0a1f44] p-6">
      <div ref={profileRef} className="mx-auto max-w-6xl space-y-6">

        {/* HEADER */}
        <div className="rounded-2xl bg-white shadow ring-1 ring-black/5 p-5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
            {/* Avatar + info */}
            <div className="md:col-span-8 flex items-start gap-5 min-w-0">
              <AvatarEditable
                src={(user as any)?.avatarUrl}
                initials={getInitials((user as any)?.username || (user as any)?.name || "")}
                userId={(user as any)?.id}
              />
              <div className="min-w-0">
                <h1 className="text-2xl font-extrabold tracking-tight truncate">
                  {getLabel({ it: "Profilo", en: "Profile" })}: {(user as any).username}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-slate-700 ring-1 ring-slate-200">
                    📧 {(user as any).email}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-slate-700 ring-1 ring-slate-200">
                    🎓 {(user as any).role}
                  </span>
                  {(user as any)?.premium && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-1 text-yellow-800 ring-1 ring-yellow-200">
                      ⭐ Premium
                    </span>
                  )}
                  <LogoutButton />
                </div>
              </div>
            </div>

            {/* Azioni */}
            <div className="md:col-span-4 flex md:justify-end gap-2">
              <Link
                href={`/${lang}/leaderboard`}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500/90 hover:bg-amber-500 px-3.5 py-2 text-white text-sm font-semibold shadow"
              >
                🏆 {getLabel({ it: "Classifica", en: "Leaderboard" })}
              </Link>
              <button
                onClick={handleExportPDF}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 px-3.5 py-2 text-white text-sm font-semibold shadow"
              >
                ⬇️ {getLabel({ it: "Esporta PDF", en: "Export PDF" })}
              </button>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="🔥 Slancio" value={`${(streakSummary.current ?? fallbackCurrentStreak)} giorni`} />
          <StatCard label="🎯 Record" value={`${(streakSummary.record ?? bestStreak)} giorni`} />
          <StatCard label="📊 Media" value={overallAverage ? `${overallAverage}%` : "—"} />
          <StatCard label="🏅 Badge" value={getEarnedBadgesCount(badges)} />
        </div>

        {/* Streak + Badge */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-white shadow ring-1 ring-black/5 p-4">
            <div className="font-semibold mb-1">
              {getLabel({ it: "Slancio giornaliero", en: "Daily streak" })}
            </div>
            <StreakBox
              userId={(user as any).id}
              refresh={refreshStreak}
              onSummary={(s: any) => {
                setStreakSummary({
                  current: Number(s?.current_streak ?? s?.current ?? s?.streak ?? 0),
                  record: Number(s?.best_streak ?? s?.record ?? s?.max_streak ?? s?.highest_streak ?? 0),
                });
              }}
            />
            {streakMotivation() && (
              <p className="mt-2 inline-block rounded-lg bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-800 ring-1 ring-amber-200">
                {streakMotivation()}
              </p>
            )}
          </div>

          <div className="rounded-2xl bg-white shadow ring-1 ring-black/5 p-4">
            {(() => {
              const earned = getEarnedBadgesList(badges);
              const total = Array.isArray(badges) ? badges.length : 0;
              return (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">
                      {getLabel({ it: "Badge ottenuti", en: "Badges" })}{" "}
                      <span className="ml-2 text-sm font-normal text-slate-500">
                        ({earned.length}/{total})
                      </span>
                    </h3>
                    {earned.length > 6 && (
                      <button
                        onClick={() => setShowAllBadges(v => !v)}
                        className="text-sm text-indigo-600 hover:text-indigo-700 underline"
                        aria-label={safeLabel({ it: "Mostra/Nascondi badge", en: "Toggle badges" })}
                      >
                        {showAllBadges
                          ? getLabel({ it: "Mostra meno", en: "Show less" })
                          : getLabel({ it: "Mostra tutti", en: "Show all" })}
                      </button>
                    )}
                  </div>
                  {earned.length === 0 ? (
                    <p className="text-sm text-slate-600">
                      {getLabel({
                        it: "Ancora nessun badge — fai un quiz per sbloccarne uno!",
                        en: "No badges yet — do a quiz to earn one!",
                      })}
                    </p>
                  ) : (
                    <SimpleBadgesGrid badges={earned} max={showAllBadges ? null : 6} />
                  )}
                </>
              );
            })()}
          </div>
        </div>

        {/* Grid principale */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sinistra */}
          <div className="lg:col-span-2 space-y-6">
            <HistoryGrid
              filteredHistory={filteredHistory}
              maxToShow={maxToShow}
              showAll={showAll}
              setShowAll={setShowAll}
            />
          </div>

          {/* Destra */}
          <div className="space-y-6">
            {/* Grafico */}
            {quizDataForChart?.length > 0 && (
              <div className="rounded-2xl bg-white shadow ring-1 ring-black/5 p-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  📈 {getLabel({ it: "Andamento punteggi", en: "Score trend" })}
                </p>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={quizDataForChart}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 100]} tickFormatter={(t) => `${t}%`} />
                      <Tooltip formatter={(value: any, _name: any, props: any) => [`${value}%`, props?.payload?.cert]} />
                      <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} dot />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                {motivationalMessage() && (
                  <p className="text-indigo-700 font-semibold mt-2">
                    {motivationalMessage()}
                  </p>
                )}
              </div>
            )}

            {/* Progresso categorie */}
            <CategoryTable rows={filteredCategoryProgress} />
            {/* Filtri + Stats */}
            <FiltersAndStats
              certifications={certifications}
              selectedCertId={selectedCertId}
              setSelectedCertId={setSelectedCertId}
              filterType={filterType}
              setFilterType={setFilterType}
              certStats={certStats}
              lang={lang}
            />
          </div>
        </div>

        {error && <p className="text-red-600 text-center">{error}</p>}

        {/* Link legali (mobile) */}
        <MobileLegalLinks />
      </div>
    </div>
  );
}

/* =========================
   MINI-COMPONENTI & HELPERS
   ========================= */
function AvatarEditable({ src, initials, userId }: { src?: string; initials: string; userId?: number }) {
  const u = JSON.parse(localStorage.getItem("user") || "{}");
  const avatarSrc = src || getFallbackAvatar(u);

  return (
    <div className="relative">
      <img
        src={avatarSrc}
        alt="avatar"
        className="size-20 sm:size-24 rounded-2xl object-cover shadow ring-1 ring-black/5"
        onError={(e) => { (e.currentTarget as HTMLImageElement).src = getFallbackAvatar(u); }}
      />
    </div>
  );
}

function getInitials(name = "") {
  const p = name.trim().split(/\s+/);
  const a = p[0]?.[0] || "";
  const b = p[1]?.[0] || "";
  return (a + b || a || "?").toUpperCase();
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-4">
      <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold">{label}</div>
      <div className="text-xl font-extrabold mt-0.5">{value}</div>
    </div>
  );
}

function HistoryGrid({
  filteredHistory,
  maxToShow,
  showAll,
  setShowAll,
}: {
  filteredHistory: any[];
  maxToShow: number;
  showAll: boolean;
  setShowAll: (v: boolean) => void;
}) {
  return (
    <div className="rounded-2xl bg-white shadow ring-1 ring-black/5 p-4">
      <h2 className="text-lg font-semibold mb-3">📝 {getLabel({ it:"Storico simulazioni", en:"Exam history" })}</h2>

      {filteredHistory.length === 0 ? (
        <p className="italic text-gray-600">
          {getLabel({ it:"Nessuna simulazione trovata", en:"No simulations found" })}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredHistory
              .slice(0, showAll ? filteredHistory.length : maxToShow)
              .map((ex: any, i: number) => {
                const correct = ex.correct_answers ?? 0;
                const total = ex.total_questions ?? 0;
                const scorePercent = (() => {
                  if (ex.percentage != null) return Math.max(0, Math.min(100, Math.round(ex.percentage)));
                  if (total > 0) return Math.max(0, Math.min(100, Math.round((correct / total) * 100)));
                  return 0;
                })();
                const rawDate = ex.date_taken || ex.date || ex.created_at;
                const formattedDate = rawDate
                  ? new Date(rawDate).toLocaleString("it-IT", {
                      day:"2-digit", month:"2-digit", year:"numeric", hour:"2-digit", minute:"2-digit"
                    })
                  : (getLabel({ it:"Data non disponibile", en:"No date" }) as string);

                const color =
                  scorePercent >= 80 ? "bg-green-50 ring-green-200"
                  : scorePercent >= 60 ? "bg-yellow-50 ring-yellow-200"
                  : "bg-red-50 ring-red-200";

                return (
                  <div key={i} className={`rounded-xl p-3 ring-1 shadow-sm ${color}`}>
                    <div className="font-semibold text-sm mb-1 truncate">
                      {typeof ex.quiz_id === "number" && ex.quiz_id < 0
                        ? `🧩 ${getLabel({ it:"Quiz Misto", en:"Mixed Quiz" })} - ${ex.certification_name}`
                        : ex.certification_name}
                    </div>
                    <div className="text-xs opacity-70">{formattedDate}</div>
                    <div className="mt-1 text-sm">({correct} / {total})</div>
                    <div className="text-lg font-extrabold">{scorePercent}%</div>
                  </div>
                );
              })}
          </div>

          {filteredHistory.length > maxToShow && (
            <div className="mt-2 text-center">
              <button
                className="text-sm text-indigo-600 underline hover:text-indigo-700"
                onClick={() => setShowAll(!showAll)}
                aria-label={safeLabel({ it: "Mostra/Nascondi storico", en: "Toggle history" })}
              >
                {showAll ? getLabel({ it:"Nascondi", en:"Show less" }) : getLabel({ it:"Mostra di più", en:"Show more" })}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function CategoryTable({ rows }: { rows: any[] }) {
  if (!rows.length) return null;
  return (
    <div className="rounded-2xl bg-white shadow ring-1 ring-black/5 p-4">
      <h3 className="font-bold text-lg mb-2">📚 {getLabel({ it:"Progresso per categoria", en:"Progress by category" })}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-blue-50 text-blue-900">
            <tr>
              <th className="text-left px-3 py-2">{getLabel({ it:"Categoria", en:"Category" })}</th>
              <th className="text-center px-3 py-2">Quiz</th>
              <th className="text-center px-3 py-2">Topic</th>
              <th className="text-center px-3 py-2">{getLabel({ it:"Domande", en:"Questions" })}</th>
              <th className="text-center px-3 py-2">%</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((row: any, idx: number) => {
              const percent = row.total_topics > 0 ? Math.round((row.quizTaken / row.total_topics) * 100) : 0;
              return (
                <tr key={idx} className="odd:bg-white even:bg-slate-50">
                  <td className="px-3 py-2">{row.category}</td>
                  <td className="text-center px-3 py-2">{row.quizTotaliEseguiti}</td>
                  <td className="text-center px-3 py-2">{row.quizTaken}</td>
                  <td className="text-center px-3 py-2">{row.totalQuestions}</td>
                  <td className="text-center px-3 py-2">
                    <div className="text-xs font-medium mb-1">{percent}%</div>
                    <div className="w-full bg-gray-200 rounded h-1.5">
                      <div className="bg-blue-500 h-1.5 rounded" style={{ width: `${percent}%` }} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FiltersAndStats({
  certifications,
  selectedCertId,
  setSelectedCertId,
  filterType,
  setFilterType,
  certStats,
  lang,
}: {
  certifications: any[];
  selectedCertId: string;
  setSelectedCertId: (v: string) => void;
  filterType: "all" | "topic" | "misto";
  setFilterType: (v: "all" | "topic" | "misto") => void;
  certStats: any;
  lang: Lang;
}) {
  return (
    <div className="rounded-2xl bg-white shadow ring-1 ring-black/5 p-4 space-y-3">
      <div>
        <label className="block font-semibold mb-1">📚 {getLabel({ it:"Seleziona certificazione:", en:"Select certification:" })}</label>
        <select
          className="w-full border px-3 py-2 rounded"
          value={selectedCertId}
          onChange={(e) => setSelectedCertId(e.target.value)}
        >
          <option value="">{getLabel({ it:"-- Tutte --", en:"-- All --" })}</option>
          {certifications.map((c: any) => (<option key={c.id} value={c.id}>{c.name}</option>))}
        </select>
      </div>

      <div>
        <label className="block font-semibold mb-1">🎯 {getLabel({ it:"Filtra per tipo di quiz:", en:"Filter by quiz type:" })}</label>
        <select
          className="w-full border px-3 py-2 rounded"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
        >
          <option value="all">{getLabel({ it:"-- Tutti --", en:"-- All --" })}</option>
          <option value="topic">{getLabel({ it:"Solo quiz per argomento", en:"Only topic-based quizzes" })}</option>
          <option value="misto">{getLabel({ it:"Solo quiz misti", en:"Only mixed quizzes" })}</option>
        </select>
      </div>

      {certStats && certStats.total_exams > 0 && (
        <ul className="text-sm list-disc list-inside pt-1">
          <li>{getLabel({ it:"Simulazioni", en:"Simulations" })}: {certStats.total_exams}</li>
          <li>{getLabel({ it:"Massimo", en:"Highest score" })}: {certStats.max_score}%</li>
          <li>{getLabel({ it:"Media", en:"Average score" })}: {parseFloat(certStats.average_score).toFixed(1)}%</li>
        </ul>
      )}
    </div>
  );
}

function getEarnedBadgesList(list: any[]) {
  if (!Array.isArray(list)) return [];
  return list.filter((b: any) =>
    Boolean(
      b?.earned || b?.awarded || b?.obtained || b?.unlocked ||
      b?.user_has_badge || b?.isUnlocked || b?.obtained_at || b?.awarded_at ||
      b?.status === "earned" || b?.status === "obtained" || b?.mine === true
    )
  );
}
function getEarnedBadgesCount(list: any[]) {
  return getEarnedBadgesList(list).length;
}
function getBadgeTitle(b: any) {
  return b?.title || b?.name || b?.badge_name || b?.badge?.name || "Badge";
}
function getBadgeImage(b: any) {
  if (b?.imageUrl) return b.imageUrl;
  if (b?.image_url) return b.image_url;
  if (b?.image) return b.image;
  if (b?.icon) return b.icon;
  if (b?.badge_image) return b.badge_image;
  if (b?.badge?.imageUrl) return b.badge.imageUrl;
  if (b?.badge?.image_url) return b.badge.image_url;
  if (b?.badge?.image) return b.badge.image;
  if (b?.media?.url) return b.media.url;
  if (b?.asset?.url) return b.asset.url;
  return null;
}

function SimpleBadgesGrid({ badges = [], max = 6 }: { badges: any[]; max: number | null }) {
  const list = max == null ? badges : badges.slice(0, max);
  if (!list.length) return <p className="text-sm text-slate-600">—</p>;

  return (
    <ul className="grid [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))] gap-3">
      {list.map((b: any, i: number) => {
        const title = getBadgeTitle(b);
        const img = getBadgeImage(b);
        return (
          <li key={b?.id ?? i} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3">
            {img ? (
              <img src={img} alt={title} loading="lazy" className="size-12 rounded-lg object-contain bg-white ring-1 ring-black/5" />
            ) : (
              <div className="size-12 rounded-lg grid place-items-center bg-white ring-1 ring-black/5 text-slate-500">🏅</div>
            )}
            <span className="text-sm font-medium leading-tight line-clamp-2">{title}</span>
          </li>
        );
      })}
    </ul>
  );
}

/* 🔗 Link legali mobile (Next.js) */
function MobileLegalLinks() {
  const pathname = usePathname() || "/it";
  const m = pathname.match(/^\/(it|en|fr|es)(?:\/|$)/i);
  const lang: Lang = (m?.[1]?.toLowerCase() as Lang) || "it";

  // Slug conformi alla tua App Router
  const privacy   = `/${lang}/privacy`;
  const terms     = `/${lang}/termini`;
  const cookie    = `/${lang}/cookie`;

  return (
    <div className="mt-10 md:hidden text-center text-sm text-gray-500">
      <p className="mb-2">© {new Date().getFullYear()} CertifyQuiz</p>
      <div className="flex justify-center gap-4">
        <Link href={privacy} className="underline hover:no-underline">
          {getLabel({ it: "Privacy", en: "Privacy Policy" })}
        </Link>
        <Link href={terms} className="underline hover:no-underline">
          {getLabel({ it: "Termini e Condizioni", en: "Terms & Conditions" })}
        </Link>
        <Link href={cookie} className="underline hover:no-underline">
          {getLabel({ it: "Cookie", en: "Cookie Policy" })}
        </Link>
      </div>
    </div>
  );
}
