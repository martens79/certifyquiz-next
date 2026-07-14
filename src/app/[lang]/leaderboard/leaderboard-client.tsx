"use client";

import { useEffect, useState, type FC } from "react";
import Link from "next/link";

import type { Locale } from "@/lib/i18n";
import { getLabel } from "@/lib/i18n";
import { apiFetch, getToken } from "@/lib/auth";

// 🔤 Label localizzate
const LBL = {
  title: {
    it: "Classifica",
    en: "Leaderboard",
    fr: "Classement",
    es: "Clasificación",
  },
  subtitle: {
    it: "Le migliori performance degli utenti su CertifyQuiz.",
    en: "Top user performances on CertifyQuiz.",
    fr: "Les meilleures performances des utilisateurs sur CertifyQuiz.",
    es: "Mejores resultados de los usuarios en CertifyQuiz.",
  },
  you: {
    it: "Tu",
    en: "You",
    fr: "Vous",
    es: "Tú",
  },
  avg: {
    it: "Media",
    en: "Average",
    fr: "Moyenne",
    es: "Media",
  },
  best: {
    it: "Migliore",
    en: "Best",
    fr: "Meilleur",
    es: "Mejor",
  },
  exams: {
    it: "Simulazioni",
    en: "Attempts",
    fr: "Simulations",
    es: "Simulaciones",
  },
  streak: {
    it: "Streak",
    en: "Streak",
    fr: "Série",
    es: "Racha",
  },
  noData: {
    it: "Nessun dato classifica disponibile.",
    en: "No leaderboard data available.",
    fr: "Aucune donnée de classement disponible.",
    es: "No hay datos de clasificación disponibles.",
  },
  backProfile: {
    it: "Torna al profilo",
    en: "Back to profile",
    fr: "Retour au profil",
    es: "Volver al perfil",
  },
  scopeGlobal: {
    it: "Globale",
    en: "Global",
    fr: "Mondial",
    es: "Global",
  },
  scopeTeam: {
    it: "Team",
    en: "Team",
    fr: "Équipe",
    es: "Equipo",
  },
  scopeFriends: {
    it: "Amici",
    en: "Friends",
    fr: "Amis",
    es: "Amigos",
  },
  allCerts: {
    it: "Tutte le certificazioni",
    en: "All certifications",
    fr: "Toutes les certifications",
    es: "Todas las certificaciones",
  },
  noOrg: {
    it: "La classifica Team è riservata ai piani aziendali.",
    en: "The Team leaderboard is available on Team plans.",
    fr: "Le classement Équipe est réservé aux offres entreprise.",
    es: "La clasificación de Equipo está reservada a los planes de empresa.",
  },
  discoverTeam: {
    it: "Scopri il piano Team",
    en: "Discover the Team plan",
    fr: "Découvrir l'offre Équipe",
    es: "Descubre el plan Equipo",
  },
  noFriendsYet: {
    it: "Non hai ancora amici in classifica.",
    en: "You don't have any friends on the leaderboard yet.",
    fr: "Vous n'avez pas encore d'amis dans le classement.",
    es: "Aún no tienes amigos en la clasificación.",
  },
  manageFriends: {
    it: "Gestisci amici →",
    en: "Manage friends →",
    fr: "Gérer les amis →",
    es: "Gestionar amigos →",
  },
};

type Scope = "global" | "team" | "friends";

const BUSINESS_PATH: Record<Locale, string> = {
  it: "/it/aziende",
  en: "/business",
  fr: "/fr/entreprises",
  es: "/es/empresas",
};

// ─────────────────── tipi locali ───────────────────
type LeaderboardRow = {
  user_id?: number;
  userId?: number;
  id?: number;
  username?: string | null;
  name?: string | null;
  email?: string | null;
  total_exams?: number | string | null;
  exams?: number | string | null;
  attempts?: number | string | null;
  avg_percentage?: number | string | null;
  average_score?: number | string | null;
  best_percentage?: number | string | null;
  max_score?: number | string | null;
  current_streak?: number | string | null;
  best_streak?: number | string | null;
};

type NormalizedRow = {
  userId: number | null;
  displayName: string;
  totalExams: number;
  avgPct: number | null;
  bestPct: number | null;
  streakCurrent: number;
  streakBest: number;
};

type CertOption = { id: number; slug: string; name: string };

// helper numerico
const toNum = (v: unknown, dflt = 0): number => {
  if (typeof v === "string") {
    const s = v.replace(",", ".").trim();
    const n = Number(s);
    return Number.isFinite(n) ? n : dflt;
  }
  const n = Number(v);
  return Number.isFinite(n) ? n : dflt;
};

// percentuale da 0–100 con clamp
const clamp = (v: number) => Math.max(0, Math.min(100, v));

// fetch JSON safe
async function tryJson<T>(path: string): Promise<T | null> {
  try {
    const res = await apiFetch(path);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

// normalizza risposta arbitraria → array di LeaderboardRow
function normalizeRaw(data: any): LeaderboardRow[] {
  if (Array.isArray(data)) return data as LeaderboardRow[];
  if (Array.isArray(data?.items)) return data.items as LeaderboardRow[];
  if (Array.isArray(data?.rows)) return data.rows as LeaderboardRow[];
  if (Array.isArray(data?.leaderboard)) return data.leaderboard as LeaderboardRow[];
  if (Array.isArray(data?.data)) return data.data as LeaderboardRow[];
  return [];
}

// normalizza singola riga
function normalizeRow(x: LeaderboardRow): NormalizedRow {
  const userId =
    (typeof x.user_id === "number" && x.user_id) ||
    (typeof x.userId === "number" && x.userId) ||
    (typeof x.id === "number" && x.id) ||
    null;

  const displayName =
    x.username ||
    x.name ||
    x.email ||
    (userId != null ? `User #${userId}` : "User");

  const totalExams = toNum(x.total_exams ?? x.exams ?? x.attempts ?? 0, 0);

  let avg = x.avg_percentage ?? x.average_score ?? null;
  let best = x.best_percentage ?? x.max_score ?? null;

  let avgNum = avg != null ? toNum(avg, NaN) : NaN;
  let bestNum = best != null ? toNum(best, NaN) : NaN;

  if (Number.isFinite(avgNum) && avgNum > 0 && avgNum <= 1) avgNum *= 100;
  if (Number.isFinite(bestNum) && bestNum > 0 && bestNum <= 1) bestNum *= 100;

  const streakCurrent = toNum(x.current_streak ?? 0, 0);
  const streakBest = toNum(x.best_streak ?? 0, 0);

  return {
    userId,
    displayName,
    totalExams,
    avgPct: Number.isFinite(avgNum) ? clamp(Math.round(avgNum)) : null,
    bestPct: Number.isFinite(bestNum) ? clamp(Math.round(bestNum)) : null,
    streakCurrent,
    streakBest,
  };
}

const LeaderboardClient: FC<{ lang: Locale }> = ({ lang }) => {
  const [rows, setRows] = useState<NormalizedRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [myId, setMyId] = useState<number | null>(null);
  const [hasToken, setHasToken] = useState(false);
  const [scope, setScope] = useState<Scope>("global");
  const [certOptions, setCertOptions] = useState<CertOption[]>([]);
  const [certFilter, setCertFilter] = useState<string>("");
  const [noOrg, setNoOrg] = useState(false);

  // inizializza hasToken in modo safe
  useEffect(() => {
    try {
      setHasToken(!!getToken());
    } catch {
      setHasToken(false);
    }
  }, []);

  // carica userId da /auth/me (solo se loggato)
  useEffect(() => {
    if (!hasToken) return;

    let alive = true;
    (async () => {
      const me =
        (await tryJson<any>("/auth/me")) ||
        (await tryJson<any>("/user/me")) ||
        (await tryJson<any>("/me"));
      if (!alive) return;
      if (me?.id && typeof me.id === "number") setMyId(me.id);
    })();
    return () => {
      alive = false;
    };
  }, [hasToken]);

  // carica elenco certificazioni per il filtro
  useEffect(() => {
    let alive = true;
    (async () => {
      const list = await tryJson<any[]>("/certifications");
      if (!alive || !Array.isArray(list)) return;
      const nameKey = lang === "it" ? "name" : `name_${lang}`;
      setCertOptions(
        list.map((c) => ({
          id: c.id,
          slug: c.slug,
          name: c[nameKey] || c.name || c.slug,
        }))
      );
    })();
    return () => {
      alive = false;
    };
  }, [lang]);

  // carica leaderboard (scope + filtro certificazione)
  useEffect(() => {
    if (scope !== "global" && !hasToken) {
      setScope("global");
      return;
    }

    let alive = true;
    (async () => {
      setLoading(true);
      setNoOrg(false);

      const qs = new URLSearchParams();
      qs.set("scope", scope);
      if (certFilter) qs.set("certification_id", certFilter);

      const raw = await tryJson<any>(`/leaderboard?${qs.toString()}`);
      if (!alive) return;

      if (scope === "team" && raw?.error === "NO_ORG") {
        setNoOrg(true);
        setRows([]);
        setLoading(false);
        return;
      }

      const normalized = normalizeRaw(raw)
        .map(normalizeRow)
        .filter((r) => r.totalExams > 0);

      normalized.sort((a, b) => {
        const bestA = a.bestPct ?? -1;
        const bestB = b.bestPct ?? -1;
        if (bestB !== bestA) return bestB - bestA;
        const avgA = a.avgPct ?? -1;
        const avgB = b.avgPct ?? -1;
        return avgB - avgA;
      });

      setRows(normalized);
      setLoading(false);
    })();

    return () => {
      alive = false;
    };
  }, [scope, certFilter, hasToken]);

  const tTitle = getLabel(LBL.title, lang);
  const tSubtitle = getLabel(LBL.subtitle, lang);
  const tYou = getLabel(LBL.you, lang);
  const tAvg = getLabel(LBL.avg, lang);
  const tBest = getLabel(LBL.best, lang);
  const tExams = getLabel(LBL.exams, lang);
  const tStreak = getLabel(LBL.streak, lang);
  const tNoData = getLabel(LBL.noData, lang);
  const tBackProfile = getLabel(LBL.backProfile, lang);
  const tScopeGlobal = getLabel(LBL.scopeGlobal, lang);
  const tScopeTeam = getLabel(LBL.scopeTeam, lang);
  const tScopeFriends = getLabel(LBL.scopeFriends, lang);
  const tAllCerts = getLabel(LBL.allCerts, lang);
  const tNoOrg = getLabel(LBL.noOrg, lang);
  const tDiscoverTeam = getLabel(LBL.discoverTeam, lang);
  const tNoFriendsYet = getLabel(LBL.noFriendsYet, lang);
  const tManageFriends = getLabel(LBL.manageFriends, lang);

  const tabBtnClass = (active: boolean) =>
    `rounded-full px-3 py-1.5 text-xs md:text-sm font-medium transition ${
      active
        ? "bg-slate-900 text-white"
        : "border border-slate-300 text-slate-700 hover:bg-slate-50"
    }`;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            🏆 {tTitle}
          </h1>
          <p className="mt-1 text-sm text-slate-600">{tSubtitle}</p>
        </div>
        <Link
          href={`/${lang}/profile`}
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-3 py-1.5 text-xs md:text-sm text-slate-700 hover:bg-slate-50"
        >
          ← {tBackProfile}
        </Link>
      </div>

      <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={tabBtnClass(scope === "global")}
            onClick={() => setScope("global")}
          >
            {tScopeGlobal}
          </button>
          {hasToken && (
            <button
              type="button"
              className={tabBtnClass(scope === "team")}
              onClick={() => setScope("team")}
            >
              {tScopeTeam}
            </button>
          )}
          {hasToken && (
            <button
              type="button"
              className={tabBtnClass(scope === "friends")}
              onClick={() => setScope("friends")}
            >
              {tScopeFriends}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {scope === "friends" && (
            <Link
              href={`/${lang}/friends`}
              className="text-xs md:text-sm text-slate-600 hover:text-slate-900 underline"
            >
              {tManageFriends}
            </Link>
          )}
          <select
            value={certFilter}
            onChange={(e) => setCertFilter(e.target.value)}
            className="rounded-full border border-slate-300 px-3 py-1.5 text-xs md:text-sm text-slate-700"
          >
            <option value="">{tAllCerts}</option>
            {certOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl bg-white shadow ring-1 ring-black/5 p-4">
          <div className="animate-pulse space-y-3">
            <div className="h-4 w-40 bg-slate-200 rounded" />
            <div className="h-3 w-60 bg-slate-100 rounded" />
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="h-16 bg-slate-100 rounded-xl" />
              <div className="h-16 bg-slate-100 rounded-xl" />
            </div>
          </div>
        </div>
      ) : scope === "team" && noOrg ? (
        <div className="rounded-2xl bg-white shadow ring-1 ring-black/5 p-6 text-sm text-slate-600">
          <p>{tNoOrg}</p>
          <Link
            href={BUSINESS_PATH[lang]}
            className="mt-3 inline-block rounded-full bg-slate-900 px-4 py-2 text-xs md:text-sm font-medium text-white hover:bg-slate-800"
          >
            {tDiscoverTeam}
          </Link>
        </div>
      ) : !rows.length ? (
        <div className="rounded-2xl bg-white shadow ring-1 ring-black/5 p-6 text-sm text-slate-600">
          {scope === "friends" ? (
            <>
              <p>{tNoFriendsYet}</p>
              <Link
                href={`/${lang}/friends`}
                className="mt-3 inline-block rounded-full bg-slate-900 px-4 py-2 text-xs md:text-sm font-medium text-white hover:bg-slate-800"
              >
                {tManageFriends}
              </Link>
            </>
          ) : (
            tNoData
          )}
        </div>
      ) : (
        <div className="rounded-2xl bg-white shadow ring-1 ring-black/5 p-2 sm:p-3">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50 text-xs uppercase text-slate-500">
                  <th className="px-3 py-2 text-left">#</th>
                  <th className="px-3 py-2 text-left">User</th>
                  <th className="px-3 py-2 text-center">{tExams}</th>
                  <th className="px-3 py-2 text-center">{tAvg}</th>
                  <th className="px-3 py-2 text-center">{tBest}</th>
                  <th className="px-3 py-2 text-center">{tStreak}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, idx) => {
                  const isMe = myId != null && r.userId === myId;
                  const rank = idx + 1;

                  const badge =
                    rank === 1
                      ? "🥇"
                      : rank === 2
                      ? "🥈"
                      : rank === 3
                      ? "🥉"
                      : null;

                  const rowBg = isMe
                    ? "bg-amber-50"
                    : rank <= 3
                    ? "bg-slate-50"
                    : "bg-white";

                  return (
                    <tr
                      key={`${r.userId ?? "u"}-${idx}`}
                      className={`border-b last:border-0 ${rowBg}`}
                    >
                      <td className="px-3 py-2 text-left font-semibold">
                        {badge ? (
                          <span className="inline-flex items-center gap-1">
                            <span>{badge}</span>
                            <span className="text-xs text-slate-500">
                              #{rank}
                            </span>
                          </span>
                        ) : (
                          <span className="text-xs text-slate-500">
                            #{rank}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-left">
                        <span className="font-medium">
                          {r.displayName}{" "}
                          {isMe && (
                            <span className="ml-1 text-xs text-amber-700">
                              ({tYou})
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center">
                        {r.totalExams}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {r.avgPct != null ? `${r.avgPct}%` : "—"}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {r.bestPct != null ? `${r.bestPct}%` : "—"}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {r.streakCurrent > 0
                          ? `${r.streakCurrent}/${r.streakBest || r.streakCurrent}`
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!hasToken && (
        <p className="mt-4 text-xs text-slate-500">
          In futuro, effettuando l’accesso potrai vedere anche la tua posizione
          personale in classifica.
        </p>
      )}
    </main>
  );
};

export default LeaderboardClient;
