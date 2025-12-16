// src/app/[lang]/profile/profile-client.tsx
"use client";

import { useEffect, useMemo, useState, type FC } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { apiFetch, getToken } from "@/lib/auth";
import { getLabel } from "@/lib/i18n";
// 📈 Grafico andamento
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// —— Tipi base
type Locale = "it" | "en" | "fr" | "es";

type User = {
  id: number;
  email?: string;
  username?: string;
  name?: string;
  role?: string;
  premium?: boolean;
};

type QuizHistoryRow = {
  id: number;
  quiz_id: number | null;
  certification_id: number | null;
  certification_name?: string;
  correct_answers?: number | null;
  total_questions?: number | null;
  percentage?: number | null;
  score?: number | null | string;
  passed?: 0 | 1 | boolean | null;
  date?: string | null;
  created_at?: string | null;
};

// 🔧 include anche campi extra da endpoint categorie
type CategoryProgressRow = {
  category: string;
  total_topics: number;
  quizTaken: number;
  totalQuestions: number;
  completed?: number;
  avgPercentage?: number;
};

type CertRow = { id: number; name: string };
type CertStat = {
  total_exams: number;
  average_score: number;
  max_score: number;
} | null;

const clamp = (v: number) => Math.max(0, Math.min(100, v));

// ——— Label localizzate (senza toccare dict globale)
const LBL = {
  profile: {
    it: "Profilo",
    en: "Profile",
    fr: "Profil",
    es: "Perfil",
  },
  loading: {
    it: "Caricamento profilo…",
    en: "Loading profile…",
    fr: "Chargement du profil…",
    es: "Cargando perfil…",
  },
  leaderboard: {
    it: "Classifica",
    en: "Leaderboard",
    fr: "Classement",
    es: "Clasificación",
  },
  history: {
    it: "Storico simulazioni",
    en: "Exam history",
    fr: "Historique des simulations",
    es: "Historial de simulaciones",
  },
  noHistory: {
    it: "Nessuna simulazione trovata",
    en: "No simulations found",
    fr: "Aucune simulation trouvée",
    es: "No se encontraron simulaciones",
  },
  mixedQuiz: {
    it: "Quiz Misto",
    en: "Mixed Quiz",
    fr: "Quiz mixte",
    es: "Cuestionario mixto",
  },
  dateMissing: {
    it: "Data non disponibile",
    en: "No date",
    fr: "Date indisponible",
    es: "Sin fecha",
  },
  streak: {
    it: "🔥 Slancio",
    en: "🔥 Streak",
    fr: "🔥 Série",
    es: "🔥 Racha",
  },
  bestStreak: {
    it: "🎯 Record",
    en: "🎯 Best streak",
    fr: "🎯 Meilleure série",
    es: "🎯 Mejor racha",
  },
  average: {
    it: "📊 Media",
    en: "📊 Average",
    fr: "📊 Moyenne",
    es: "📊 Media",
  },
  badges: {
    it: "🏅 Badge",
    en: "🏅 Badges",
    fr: "🏅 Badges",
    es: "🏅 Insignias",
  },
  earnedBadges: {
    it: "Badge ottenuti",
    en: "Earned badges",
    fr: "Badges obtenus",
    es: "Insignias obtenidas",
  },
  earnHint: {
    it: "Ancora nessun badge — fai un quiz per sbloccarne uno!",
    en: "No badges yet — do a quiz to earn one!",
    fr: "Pas encore de badge — faites un quiz pour en gagner un !",
    es: "Aún no hay insignias — ¡haz un cuestionario para ganar una!",
  },
  selectCert: {
    it: "Seleziona certificazione:",
    en: "Select certification:",
    fr: "Sélectionnez la certification :",
    es: "Selecciona certificación:",
  },
  all: {
    it: "-- Tutte --",
    en: "-- All --",
    fr: "-- Toutes --",
    es: "-- Todas --",
  },
  simulations: {
    it: "Simulazioni",
    en: "Simulations",
    fr: "Simulations",
    es: "Simulaciones",
  },
  highest: {
    it: "Massimo",
    en: "Highest score",
    fr: "Meilleur score",
    es: "Puntuación más alta",
  },
  avgScore: {
    it: "Media",
    en: "Average score",
    fr: "Score moyen",
    es: "Puntuación media",
  },
  byCategory: {
    it: "Progresso per categoria",
    en: "Progress by category",
    fr: "Progrès par catégorie",
    es: "Progreso por categoría",
  },
  category: {
    it: "Categoria",
    en: "Category",
    fr: "Catégorie",
    es: "Categoría",
  },
  questions: {
    it: "Domande",
    en: "Questions",
    fr: "Questions",
    es: "Preguntas",
  },
  trendTitle: {
    it: "Andamento punteggi",
    en: "Score trend",
    fr: "Évolution des scores",
    es: "Evolución de los puntajes",
  },

  avgNote: {
  it: "Media basata solo su quiz completati",
  en: "Average based only on completed quizzes",
  fr: "Moyenne basée uniquement sur les quiz terminés",
  es: "Media basada solo en cuestionarios completados",
},
testAttemptsExcluded: {
  it: "• {n} tentativi di prova esclusi",
  en: "• {n} test attempts excluded",
  fr: "• {n} tentatives de test exclues",
  es: "• {n} intentos de prueba excluidos",
},
showMore: {
  it: "Mostra di più",
  en: "Show more",
  fr: "Afficher plus",
  es: "Mostrar más",
},
showLess: {
  it: "Mostra meno",
  en: "Show less",
  fr: "Afficher moins",
  es: "Mostrar menos",
},
badgeUnlocked: {
  it: "Sbloccato",
  en: "Unlocked",
  fr: "Débloqué",
  es: "Desbloqueado",
},
badgeLocked: {
  it: "Bloccato",
  en: "Locked",
  fr: "Verrouillé",
  es: "Bloqueado",
},
badgeNotEarned: {
  it: "Non ancora ottenuto",
  en: "Not earned yet",
  fr: "Pas encore obtenu",
  es: "Aún no obtenido",
},
badgeLockedHint: {
  it: "Bloccato — completa quiz per sbloccarlo",
  en: "Locked — complete quizzes to unlock it",
  fr: "Verrouillé — terminez des quiz pour le débloquer",
  es: "Bloqueado — completa cuestionarios para desbloquearlo",
},

};

// ---------- helper fetch JSON (mai throw)
async function tryJson<T>(path: string): Promise<T | null> {
  try {
    const r = await apiFetch(path);
    if (!r.ok) return null;
    return (await r.json()) as T;
  } catch {
    return null;
  }
}

// 🔧 prova più endpoint in ordine
async function tryJsonMulti<T>(paths: string[]): Promise<T | null> {
  for (const p of paths) {
    const v = await tryJson<T>(p);
    if (v) return v;
  }
  return null;
}

// ---------- coercizioni numeriche robuste (supporta "72,5" e stringhe)
const toNumFlexible = (v: unknown, dflt = 0): number => {
  if (typeof v === "string") {
    const s = v.replace(",", ".").trim();
    const n = Number(s);
    return Number.isFinite(n) ? n : dflt;
  }
  const n = Number(v);
  return Number.isFinite(n) ? n : dflt;
};

// 🔧 calcolo percentuale “intelligente” lato client
// Usa percentage solo se ha senso; altrimenti cade su correct/total o score.
const computePercent = (ex: {
  percentage?: number | string | null;
  correct_answers?: number | string | null;
  total_questions?: number | string | null;
  score?: number | string | null;
}) => {
  // prima leggo correct/total e score, così posso decidere se fidarmi di percentage=0
  const correct = toNumFlexible(ex.correct_answers, NaN);
  const total = toNumFlexible(ex.total_questions, NaN);
  let s = toNumFlexible(ex.score, NaN);

  // 1) percentage
  let p = toNumFlexible(ex.percentage, NaN);
  if (Number.isFinite(p)) {
    // se è frazione 0–1 → 0–100
    if (p > 0 && p <= 1) p = p * 100;

    // mi fido di 0% solo se anche correct e score sono coerenti con 0
    if (
      p > 0 ||
      ((Number.isFinite(correct) && correct === 0) ||
        (Number.isFinite(s) && s === 0))
    ) {
      return clamp(Math.round(p));
    }
    // altrimenti non mi fido di questo 0 e vado ai fallback
  }

  // 2) correct/total
  if (Number.isFinite(correct) && Number.isFinite(total) && total > 0) {
    const pct = (correct / total) * 100;
    return clamp(Math.round(pct));
  }

  // 3) score (es. "0.50" → 50)
  if (Number.isFinite(s)) {
    if (s > 0 && s <= 1) s = s * 100;
    return clamp(Math.round(s));
  }

  return null;
};

// ---------- normalizzatori per liste
function normalizeCerts(data: any): CertRow[] {
  if (Array.isArray(data)) return data as CertRow[];
  if (Array.isArray(data?.items)) return data.items as CertRow[];
  if (Array.isArray(data?.rows)) return data.rows as CertRow[];
  if (Array.isArray(data?.certifications)) return data.certifications as CertRow[];
  if (Array.isArray(data?.certs)) return data.certs as CertRow[];
  return [];
}

// 🔧 compat con /user-history /quiz-results
function normalizeHistory(data: any): QuizHistoryRow[] {
  const raw: any[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.items)
    ? data.items
    : [];

  return raw.map((r, i) => {
    const correct = toNumFlexible(r?.correct_answers ?? r?.correct, 0);
    const total = toNumFlexible(r?.total_questions ?? r?.total, 0);

    const scoreRaw = r?.score ?? null;
    const scoreNum = scoreRaw != null ? toNumFlexible(scoreRaw, NaN) : NaN;

    const percentageRaw =
      r?.percentage ?? r?.avgScorePct ?? r?.avg_percentage ?? null;
    const percentageNum =
      percentageRaw != null ? toNumFlexible(percentageRaw, NaN) : NaN;

    const passedRaw = r?.passed;
    const passed =
      passedRaw === true ||
      passedRaw === 1 ||
      passedRaw === "1" ||
      (typeof passedRaw === "string" &&
        passedRaw.toLowerCase() === "true")
        ? 1
        : passedRaw === false ||
          passedRaw === 0 ||
          passedRaw === "0" ||
          (typeof passedRaw === "string" &&
            passedRaw.toLowerCase() === "false")
        ? 0
        : null;

    const created_at = r?.created_at ?? r?.date ?? null;

    return {
      id: toNumFlexible(r?.id, i + 1),
      quiz_id: r?.quiz_id ?? null,
      certification_id: r?.certification_id ?? null,
      certification_name:
        r?.certification_name ?? r?.cert_name ?? r?.name ?? undefined,
      correct_answers: Number.isFinite(correct) ? correct : 0,
      total_questions: Number.isFinite(total) ? total : 0,
      percentage: Number.isFinite(percentageNum) ? percentageNum : null,
      score: Number.isFinite(scoreNum) ? scoreNum : null,
      passed,
      created_at,
      date: r?.date ?? null,
    };
  });
}

// 🔧 normalizza le stats da endpoint /user-certification-stats
// + fallback su history filtrata
function normalizeCertStats(
  raw: any,
  historyRows: QuizHistoryRow[]
): CertStat {
  const hasHistory =
    Array.isArray(historyRows) && historyRows.length > 0;

  // 1) provo a leggere i campi dal backend
  let total_exams = toNumFlexible(
    raw?.total_exams ??
      raw?.totalAttempts ??
      raw?.exams_count ??
      raw?.count ??
      raw?.total ??
      0
  );

  let avg = toNumFlexible(
    raw?.average_score ??
      raw?.avgScorePct ??
      raw?.avg_score ??
      raw?.avg_percentage ??
      raw?.average ??
      raw?.avg ??
      0
  );

  let max = toNumFlexible(
    raw?.max_score ??
      raw?.best_score ??
      raw?.highest ??
      raw?.maxPct ??
      raw?.max_percentage ??
      0
  );

  // se il backend usa frazioni 0–1 → porto a 0–100
  if (avg > 0 && avg <= 1) avg *= 100;
  if (max > 0 && max <= 1) max *= 100;

  avg = clamp(Math.round(avg * 10) / 10);
  max = clamp(Math.round(max));

  const hasBackendStats =
    Number.isFinite(total_exams) &&
    total_exams > 0 &&
    Number.isFinite(avg) &&
    Number.isFinite(max);

  if (hasBackendStats) {
    return {
      total_exams,
      average_score: avg,
      max_score: max,
    };
  }

  // 2) fallback → calcolo dalle righe di history (filtrate)
  if (!hasHistory) return null;

  const percents = historyRows
    .map((ex) => computePercent(ex))
    .filter((p): p is number => p != null && Number.isFinite(p));

  if (!percents.length) return null;

  const total = historyRows.length;
  const maxFromHistory = Math.max(...percents);
  const avgFromHistory =
    percents.reduce((sum, p) => sum + p, 0) / percents.length;

  return {
    total_exams: total,
    average_score: Math.round(avgFromHistory * 10) / 10,
    max_score: Math.round(maxFromHistory),
  };
}

const ProfileClient: FC<{ lang: Locale }> = ({ lang }) => {
  const router = useRouter();
  const pathname = usePathname() ?? `/${lang}/profile`;

  // —— Hydration-safe
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => setIsHydrated(true), []);

  // 🔐 hasToken come stato (SSR-safe)
  const [hasToken, setHasToken] = useState<boolean | null>(null);
  useEffect(() => {
    setHasToken(!!getToken());
  }, []);

  // redirect solo quando sappiamo che NON c'è token
  useEffect(() => {
    if (hasToken === false) {
      router.replace(
        `/${lang}/login?redirect=${encodeURIComponent(pathname)}`
      );
    }
  }, [hasToken, lang, pathname, router]);

  const [loadingUser, setLoadingUser] = useState(true);

  // —— User
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      // 🔧 leggiamo la risposta grezza (può essere { user: {...} } oppure direttamente {...})
      const raw =
        (await tryJson<any>("/auth/me")) ||
        (await tryJson<any>("/user/me")) ||
        (await tryJson<any>("/me"));

      if (!alive) return;

      const u: User | null = raw?.user ?? raw ?? null;

      if (u && u.id) {
        setUser(u);
        try {
          localStorage.setItem("user", JSON.stringify(u));
        } catch {
          // ignore
        }
      } else {
        // fallback da localStorage se esiste qualcosa
        try {
          const ls = JSON.parse(localStorage.getItem("user") || "null");
          if (ls?.id) setUser(ls);
        } catch {
          // ignore
        }
      }

      setLoadingUser(false);
    })();

    return () => {
      alive = false;
    };
  }, []);

  // —— Streak
  const [streak, setStreak] = useState<{ current: number; record: number }>(
    {
      current: 0,
      record: 0,
    }
  );

  useEffect(() => {
    let alive = true;
    (async () => {
      const data =
        (await tryJson<any>("/user/slancio")) ||
        (await tryJson<any>("/user/slancio/0"));
      if (!alive) return;
      const current = toNumFlexible(
        data?.current ?? data?.current_streak ?? data?.streak,
        0
      );
      const record = toNumFlexible(
        data?.best_streak ??
          data?.longest ??
          data?.longest_streak ??
          data?.max_streak ??
          data?.record,
        0
      );
      setStreak({ current, record });
    })();
    return () => {
      alive = false;
    };
  }, []);

  // —— Badge (catalogo completo + stato utente)
const [badges, setBadges] = useState<any[]>([]);
useEffect(() => {
  let alive = true;
  (async () => {
    const rows = (await tryJson<any[]>("/user/user-badges")) || [];
    if (alive) setBadges(Array.isArray(rows) ? rows : []);
  })();
  return () => {
    alive = false;
  };
}, []);


// —— Storico quiz (senza /exam-history, che è 404)
const [history, setHistory] = useState<QuizHistoryRow[]>([]);
useEffect(() => {
  let alive = true;
  (async () => {
    const data =
      (await tryJsonMulti<any>([
        "/user/user-history",
        "/quiz-results",
        "/api/backend/user-history",
        "/api/backend/quiz-results",
      ])) ?? [];

    const rows = normalizeHistory(data);
    if (alive) setHistory(rows);
  })();
  return () => {
    alive = false;
  };
}, []);


  // —— Certificazioni + filtro + stats
  const [certs, setCerts] = useState<CertRow[]>([]);
  const [selectedCertId, setSelectedCertId] = useState<string>(""); // "" = tutte
  const [certStats, setCertStats] = useState<CertStat>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const raw = await tryJson<any>("/get-certifications");
      const rows = normalizeCerts(raw);
      if (alive) setCerts(rows);
    })();
    return () => {
      alive = false;
    };
  }, []);

  // 🔍 numero della cert selezionata (o null se "tutte")
  const selectedCertNumeric = useMemo(
    () => (selectedCertId ? Number(selectedCertId) : null),
    [selectedCertId]
  );

  // 🔍 history filtrata per certificazione (usata da: storico + grafico + stats box)
  const filteredHistory = useMemo(
    () =>
      selectedCertNumeric
        ? history.filter(
            (row) => row.certification_id === selectedCertNumeric
          )
        : history,
    [history, selectedCertNumeric]
  );

// ✅ definizione quiz "valido" (esclude simulazioni tecniche / abbandonate)
const COMPLETION_THRESHOLD = 0.6; // 60%

const validHistory = useMemo(() => {
  return filteredHistory.filter((row) => {
    const total = row.total_questions ?? 0;
    const correct = row.correct_answers ?? 0;

    if (!total) return false;

    // quiz considerato valido se è stato completato almeno al 60%
    return correct / total >= COMPLETION_THRESHOLD;
  });
}, [filteredHistory]);

const testAttemptsCount =
  filteredHistory.length - validHistory.length;


  // 🔢 calcolo delle stats per la cert selezionata (o globali se "tutte")
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!user?.id) {
        if (alive) setCertStats(null);
        return;
      }

      // se nessuna cert è selezionata → non chiamo il backend, ma calcolo dalle history globali
      if (!selectedCertNumeric) {
        const statsFromHistory = normalizeCertStats(
          null,
          validHistory
        );
        if (alive) setCertStats(statsFromHistory);
        return;
      }

      // altrimenti provo l'endpoint dedicato, con fallback sempre su filteredHistory
      const raw = await tryJsonMulti<any>([
        `/user-certification-stats/${user.id}/${selectedCertNumeric}`,
        `/api/user-certification-stats/${user.id}/${selectedCertNumeric}`,
      ]);

      const stats = normalizeCertStats(raw, validHistory);
      if (alive) setCertStats(stats);
    })();
    return () => {
      alive = false;
    };
  }, [user?.id, selectedCertNumeric, validHistory]);

  // —— Progresso per categoria
  const [categoryProgress, setCategoryProgress] = useState<
    CategoryProgressRow[]
  >([]);
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const fromUser = await tryJson<any[]>(
          "/user/user-categories-progress"
        );

        let raw: any[] = [];

        if (Array.isArray(fromUser) && fromUser.length) {
          raw = fromUser;
        } else {
          const fallback = await tryJson<any[]>("/get-categories");
          raw = Array.isArray(fallback) ? fallback : [];
        }

        const rows: CategoryProgressRow[] = raw.map((r: any) => ({
          category: r.category ?? r.name ?? r.category_name ?? "",
          total_topics: toNumFlexible(
            r.total_topics ??
              r.totalTopics ??
              r.total_topics_count ??
              r.total ??
              0
          ),
          quizTaken: toNumFlexible(
            r.quizTaken ??
              r.quiz_taken ??
              r.taken ??
              r.completed_quiz ??
              0
          ),
          totalQuestions: toNumFlexible(
            r.totalQuestions ?? r.total_questions ?? r.questions ?? 0
          ),
          completed: toNumFlexible(
            r.completed ?? r.completed_topics ?? r.done ?? 0
          ),
          avgPercentage: toNumFlexible(
            r.avgPercentage ?? r.avg_percentage ?? r.percentage ?? 0
          ),
        }));

        if (alive) setCategoryProgress(rows);
      } catch {
        if (alive) setCategoryProgress([]);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  // —— Date formatter deterministico (evita mismatch SSR/CSR)
  const localeMap: Record<Locale, string> = {
    it: "it-IT",
    en: "en-US",
    fr: "fr-FR",
    es: "es-ES",
  };
  const dtf = useMemo(
    () =>
      new Intl.DateTimeFormat(localeMap[lang], {
        timeZone: "UTC",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    [lang]
  );

  // —— Media generale (sempre su TUTTO lo storico, non filtrata)
  const overallAverage = useMemo(() => {
  if (!validHistory.length) return null;

  const values = validHistory
    .map((ex) => computePercent(ex))
    .filter((n): n is number => n != null);

  if (!values.length) return null;

  return (
    values.reduce((s, n) => s + n, 0) / values.length
  ).toFixed(1);
}, [validHistory]);


  const earnedBadges = badges.filter(
    (b) =>
      b?.earned ||
      b?.awarded ||
      b?.obtained ||
      b?.unlocked ||
      b?.user_has_badge ||
      b?.isUnlocked ||
      b?.obtained_at ||
      b?.awarded_at ||
      b?.status === "earned" ||
      b?.status === "obtained" ||
      b?.mine === true
  );
// ✅ Set degli ID dei badge ottenuti (per match rapido)
const earnedIds = useMemo(() => {
  return new Set(
    earnedBadges.map((b) => String(b?.badge_id ?? b?.id ?? ""))
  );
}, [earnedBadges]);

// ✅ Catalogo completo già pronto dal backend
const allBadges = badges;




// 4. stato Mostra di più / meno
const BADGES_COLLAPSED = 8;
const [showAllBadges, setShowAllBadges] = useState(false);

// 5. visibleBadges  ⬅️ DOPO
const visibleBadges = useMemo(() => {
  return showAllBadges
    ? allBadges
    : allBadges.slice(0, BADGES_COLLAPSED);
}, [allBadges, showAllBadges]);

  // —— Render: loader SSR-safe
  if (!isHydrated || hasToken === null || loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        <div className="animate-pulse rounded-xl border px-6 py-4 bg-white/70">
          {getLabel(LBL.loading, lang)}
        </div>
      </div>
    );
  }

  // se sappiamo che NON c'è token → redirect in corso
  if (hasToken === false) {
    return null;
  }

  const displayName = user?.username || user?.name || "User";
  const email = user?.email || "—";

    const avatarBorderClass =
    user?.role === "admin"
      ? "ring-2 ring-red-400 bg-red-50"
      : user?.premium
      ? "ring-2 ring-amber-400 bg-amber-50"
      : "ring-2 ring-slate-200 bg-sky-50";


  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-indigo-50/30 text-[#0a1f44] p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="rounded-2xl bg-white shadow ring-1 ring-black/5 p-5">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:justify-between">


          {/* Colonna sinistra: avatar + dati profilo */}
<div className="flex items-start gap-6 group">
  {/* Wrapper avatar */}
  <div className="relative">
    {/* Halo neon dietro l'avatar */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="w-28 h-28 rounded-full bg-indigo-400/25 blur-xl group-hover:bg-pink-400/30 transition-colors duration-500" />
    </div>

    {/* Cerchio con gradiente e bordo dinamico */}
    <div className="relative w-24 h-24">
      <div
        className={`
          absolute inset-0 
          rounded-full 
          bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400
          opacity-80
          group-hover:opacity-100
          transition-opacity duration-300
        `}
      />

      <div
        className={`
          relative w-full h-full 
          rounded-full 
          shadow-lg overflow-hidden 
          flex items-center justify-center 
          transition-transform duration-300 ease-out 
          group-hover:scale-110 group-hover:rotate-3
          ${avatarBorderClass}
        `}
      >
        {/* Avatar BOTTTs (robot) */}
        <img
          src={`https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
            user?.username || user?.email || "user"
          )}`}
          alt="Avatar utente"
          className="w-full h-full rounded-full object-cover bg-white"
        />
      </div>

      {/* Chip "CQ" tech in basso a sinistra */}
      <div className="absolute -bottom-1 -left-1 rounded-md bg-slate-900 text-[10px] px-1.5 py-0.5 text-slate-100 shadow ring-1 ring-slate-700/80">
        CQ
      </div>

      {/* Badge Premium in basso a destra, animato */}
      {user?.premium && (
        <div className="absolute -bottom-1 -right-1 rounded-full bg-yellow-400 text-xs px-1.5 py-0.5 shadow ring-1 ring-yellow-500 animate-pulse">
          ⭐
        </div>
      )}
    </div>
  </div>

  {/* Testo profilo */}
  <div className="min-w-0 flex-1 flex flex-col justify-center">
  <h1 className="text-2xl sm:text-3xl font-extrabold leading-snug break-words">
    {getLabel(LBL.profile, lang)}: <span className="break-words">{displayName}</span>
  </h1>
  
    {/* 🔧 Dati del profilo */}
    <div className="mt-2 flex flex-col gap-1 text-sm text-slate-700">
     {/* Email */}
<div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 ring-1 ring-slate-200 max-w-full min-w-0">
  📧
  <span className="font-medium min-w-0 flex-1 truncate">
    {email}
  </span>
</div>


      {/* ID + ruolo */}
      {(user?.id || user?.role) && (
        <div className="inline-flex flex-wrap items-center gap-2 text-xs text-slate-600 mt-1">
          {user?.id && (
            <span className="inline-flex items-center gap-1">
              🆔 <span>ID: {user.id}</span>
            </span>
          )}
          {user?.role && (
            <span className="inline-flex items-center gap-1">
              🤖 <span>Ruolo: {user.role}</span>
            </span>
          )}
        </div>
      )}

      {/* Badge Premium */}
      {user?.premium && (
        <div className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-1 text-yellow-800 ring-1 ring-yellow-200 text-xs font-semibold mt-1">
          ⭐ Premium attivo
        </div>
      )}
    </div>
  </div>
</div>



            {/* Colonna destra: pulsante Classifica */}
            <div className="flex gap-2">
              <Link
                href={`/${lang}/leaderboard`}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500/90 hover:bg-amber-500 px-3.5 py-2 text-white text-sm font-semibold shadow"
              >
                🏆 {getLabel(LBL.leaderboard, lang)}
              </Link>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label={getLabel(LBL.streak, lang)}
            value={`${streak.current} ${
              lang === "it"
                ? streak.current === 1
                  ? "giorno"
                  : "giorni"
                : lang === "fr"
                ? streak.current === 1
                  ? "jour"
                  : "jours"
                : "days"
            }`}
          />
          <StatCard
            label={getLabel(LBL.bestStreak, lang)}
            value={`${streak.record} ${
              lang === "it"
                ? streak.record === 1
                  ? "giorno"
                  : "giorni"
                : lang === "fr"
                ? streak.record === 1
                  ? "jour"
                  : "jours"
                : "days"
            }`}
          />
         <div>
  <StatCard
    label={getLabel(LBL.average, lang)}
    value={overallAverage ? `${overallAverage}%` : "—"}
  />
  <p className="mt-1 text-[11px] leading-tight text-slate-500">
    {getLabel(LBL.avgNote, lang)}
    {testAttemptsCount > 0 && (
      <>
        {" "}
        {getLabel(LBL.testAttemptsExcluded, lang).replace(
          "{n}",
          String(testAttemptsCount)
        )}
      </>
    )}
  </p>
</div>


          <StatCard
            label={getLabel(LBL.badges, lang)}
            value={earnedBadges.length}
          />
        </div>

        {/* Badge */}
<div className="rounded-2xl bg-white shadow ring-1 ring-black/5 p-4">
  <div className="flex items-center justify-between gap-3">
    <h3 className="text-lg font-semibold mb-2">
      {getLabel(LBL.earnedBadges, lang)}{" "}
      <span className="ml-2 text-sm font-normal text-slate-500">
        ({earnedBadges.length}/{allBadges.length})
      </span>
    </h3>

    {allBadges.length > BADGES_COLLAPSED && (
      <button
        type="button"
        onClick={() => setShowAllBadges((v) => !v)}
        className="text-sm font-semibold text-slate-700 hover:text-slate-900 underline underline-offset-4"
      >
        {showAllBadges
          ? getLabel(LBL.showLess, lang)
          : getLabel(LBL.showMore, lang)}
      </button>
    )}
  </div>

  {!earnedBadges.length ? (
    <p className="text-sm text-slate-600">
      {getLabel(LBL.earnHint, lang)}
    </p>
  ) : null}

  <ul className="grid [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))] gap-3 mt-2">
    {visibleBadges.map((b, i) => (
      <li
        key={`badge-${b.id ?? "x"}-${i}`}

        className={[
          "flex items-center gap-3 rounded-xl border p-3 transition",
          b.earned
            ? "border-slate-200 bg-slate-50/70"
            : "border-slate-200 bg-white opacity-70 grayscale",
        ].join(" ")}
        title={
          b.earned
            ? getLabel(LBL.badgeUnlocked, lang)
            : getLabel(LBL.badgeLockedHint, lang)
        }
      >
        <div
          className={[
            "size-12 rounded-lg grid place-items-center ring-1 ring-black/5",
            b.earned ? "bg-white text-slate-500" : "bg-slate-100 text-slate-400",
          ].join(" ")}
        >
          {b.earned ? "🏅" : "🔒"}
        </div>

        <div className="min-w-0 flex-1">
          <span className="text-sm font-medium leading-tight line-clamp-2">
            {b.title}
          </span>

          {!b.earned && (
            <div className="mt-0.5 text-xs text-slate-500">
              {getLabel(LBL.badgeNotEarned, lang)}
            </div>
          )}
        </div>
      </li>
    ))}
  </ul>
</div>


                {/* Storico + Filtri/Stats + Categorie + Grafico */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonna sinistra: storico + tabella categorie */}
          <div className="lg:col-span-2 space-y-6">
            {/* Storico filtrato in base alla certificazione selezionata */}
            <HistoryGrid lang={lang} rows={filteredHistory} dtf={dtf} />

            {/* Progresso per categoria */}
            <CategoryTable lang={lang} rows={categoryProgress} />
          </div>

          {/* Colonna destra: filtro certificazione + grafico andamento */}
          <div className="space-y-6">
            <FiltersAndStats
              lang={lang}
              certs={certs}
              selectedCertId={selectedCertId}
              setSelectedCertId={setSelectedCertId}
              stats={certStats}
            />

            {/* Grafico andamento punteggi per la selezione corrente */}
            <PerformanceChart
              lang={lang}
              rows={validHistory}
              dtf={dtf}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileClient;


// ——— Mini componenti ———
const StatCard: FC<{ label: string; value: string | number }> = ({
  label,
  value,
}) => (
  <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-4">
    <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
      {label}
    </div>
    <div className="text-xl font-extrabold mt-0.5">{value}</div>
  </div>
);

const HistoryGrid: FC<{
  lang: Locale;
  rows: QuizHistoryRow[];
  dtf: Intl.DateTimeFormat;
}> = ({ lang, rows, dtf }) => {
  const tNoDate = getLabel(LBL.dateMissing, lang);
  const tHistory = getLabel(LBL.history, lang);
  const tMixed = getLabel(LBL.mixedQuiz, lang);

  if (!rows.length) {
    return (
      <div className="rounded-2xl bg-white shadow ring-1 ring-black/5 p-4">
        <h2 className="text-lg font-semibold mb-3">📝 {tHistory}</h2>
        <p className="italic text-gray-600">
          {getLabel(LBL.noHistory, lang)}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white shadow ring-1 ring-black/5 p-4">
      <h2 className="text-lg font-semibold mb-3">📝 {tHistory}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
        {rows.slice(0, 12).map((ex, i) => {
          const percent = computePercent(ex);
          const shown = percent == null ? "—" : `${percent}%`;

          const total = toNumFlexible(ex.total_questions, 0);
          const correct = toNumFlexible(ex.correct_answers, 0);

          const raw = ex.created_at || ex.date || null;
          const formatted = raw ? dtf.format(new Date(raw)) : tNoDate;

          const color =
            percent == null
              ? "bg-slate-50 ring-slate-200"
              : percent >= 80
              ? "bg-green-50 ring-green-200"
              : percent >= 60
              ? "bg-yellow-50 ring-yellow-200"
              : "bg-red-50 ring-red-200";

          return (
            <div
              key={ex.id ?? i}
              className={`rounded-xl p-3 ring-1 shadow-sm ${color}`}
            >
              <div className="font-semibold text-sm mb-1 truncate">
                {typeof ex.quiz_id === "number" && ex.quiz_id < 0
                  ? `🧩 ${tMixed}`
                  : ex.certification_name || "—"}
              </div>
              <div className="text-xs opacity-70">{formatted}</div>
              <div className="mt-1 text-sm">
                ({correct} / {total})
              </div>
              <div className="text-lg font-extrabold">{shown}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 📈 Grafico andamento punteggi in base allo storico filtrato
const PerformanceChart: FC<{
  lang: Locale;
  rows: QuizHistoryRow[];
  dtf: Intl.DateTimeFormat;
}> = ({ lang, rows, dtf }) => {
  if (!rows.length) return null;

  // Costruiamo dataset: ultimi 10 tentativi con percentuale valida
  const data = rows
    .map((ex) => {
      const pct = computePercent(ex);
      if (pct == null) return null;

      const raw = ex.created_at || ex.date || null;
      const label = raw ? dtf.format(new Date(raw)) : "#";

      return {
        label,
        value: pct,
      };
    })
    .filter((d): d is { label: string; value: number } => !!d)
    .slice(-10); // ultimi 10

  if (!data.length) return null;

  const title = getLabel(LBL.trendTitle, lang);

  return (
  <div className="rounded-2xl bg-white shadow ring-1 ring-black/5 p-4">
    <h3 className="text-lg font-semibold mb-2">📈 {title}</h3>

    {Array.isArray(data) && data.length > 1 ? (
      <div className="h-52 min-h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
            <Tooltip />
            <Line type="monotone" dataKey="value" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    ) : (
      <p className="text-sm text-slate-500">—</p>
    )}
  </div>
);
};

const FiltersAndStats: FC<{
  lang: Locale;
  certs: CertRow[];
  selectedCertId: string;
  setSelectedCertId: (v: string) => void;
  stats: CertStat;
}> = ({ lang, certs, selectedCertId, setSelectedCertId, stats }) => (
  <div className="rounded-2xl bg-white shadow ring-1 ring-black/5 p-4 space-y-3">
    <div>
      <label className="block font-semibold mb-1">
        📚 {getLabel(LBL.selectCert, lang)}
      </label>
      <select
        className="w-full border px-3 py-2 rounded"
        value={selectedCertId}
        onChange={(e) => setSelectedCertId(e.target.value)}
      >
        <option value="">{getLabel(LBL.all, lang)}</option>
        {(Array.isArray(certs) ? certs : []).map((c) => (
          <option key={c.id} value={String(c.id)}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
    {stats && stats.total_exams > 0 && (
      <ul className="text-sm list-disc list-inside pt-1">
        <li>
          {getLabel(LBL.simulations, lang)}: {stats.total_exams}
        </li>
        <li>
          {getLabel(LBL.highest, lang)}: {stats.max_score}%
        </li>
        <li>
          {getLabel(LBL.avgScore, lang)}:{" "}
          {Number(stats.average_score).toFixed(1)}%
        </li>
      </ul>
    )}
  </div>
);

const CategoryTable: FC<{ lang: Locale; rows: CategoryProgressRow[] }> = ({
  lang,
  rows,
}) => {
  if (!rows.length) return null;
  return (
    <div className="rounded-2xl bg-white shadow ring-1 ring-black/5 p-4">
      <h3 className="font-bold text-lg mb-2">
        📚 {getLabel(LBL.byCategory, lang)}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-blue-50 text-blue-900">
            <tr>
              <th className="text-left px-3 py-2">
                {getLabel(LBL.category, lang)}
              </th>
              <th className="text-center px-3 py-2">Quiz</th>
              <th className="text-center px-3 py-2">Topic</th>
              <th className="text-center px-3 py-2">
                {getLabel(LBL.questions, lang)}
              </th>
              <th className="text-center px-3 py-2">%</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((r, i) => {
              const percent =
                r.total_topics > 0
                  ? Math.round((r.quizTaken / r.total_topics) * 100)
                  : 0;
              return (
                <tr key={i} className="odd:bg-white even:bg-slate-50">
                  <td className="px-3 py-2">{r.category}</td>
                  <td className="text-center px-3 py-2">
                    {r.quizTaken}
                  </td>
                  <td className="text-center px-3 py-2">
                    {r.total_topics}
                  </td>
                  <td className="text-center px-3 py-2">
                    {r.totalQuestions}
                  </td>
                  <td className="text-center px-3 py-2">
                    <div className="text-xs font-medium mb-1">
                      {percent}%
                    </div>
                    <div className="w-full bg-gray-200 rounded h-1.5">
                      <div
                        className="h-1.5 rounded bg-blue-500"
                        style={{ width: `${percent}%` }}
                      />
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
};
