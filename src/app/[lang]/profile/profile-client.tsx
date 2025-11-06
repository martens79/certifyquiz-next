"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/auth";

type Locale = "it" | "en" | "fr" | "es";

type User = {
  id: number;
  email: string;
  name?: string | null;
  createdAt?: string | null;
};

type StreakResp = { current: number };
type QuizStat = { day: string; score: number };

function isQuizStat(x: unknown): x is QuizStat {
  return (
    typeof x === "object" &&
    x !== null &&
    typeof (x as { day?: unknown }).day === "string" &&
    typeof (x as { score?: unknown }).score === "number"
  );
}

export default function ProfileClient({ lang }: { lang: Locale }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [streak, setStreak] = useState<number | null>(null);
  const [weekly, setWeekly] = useState<QuizStat[]>([]);

  useEffect(() => {
    let mounted = true;

    // /user/me
    apiFetch("/user/me")
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((data: unknown) => {
        if (!mounted) return;
        // accettiamo il payload solo se ha email (campo minimo)
        const u = data as Partial<User>;
        if (typeof u?.email === "string" && typeof u?.id === "number") {
          setUser({
            id: u.id,
            email: u.email,
            name: u.name ?? null,
            createdAt: u.createdAt ?? null,
          });
        } else {
          setUser(null);
        }
      })
      .catch((_err: unknown) => {
        if (!mounted) return;
        setUser(null);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    // /user/streak
    apiFetch("/user/streak")
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((data: unknown) => {
        if (!mounted) return;
        const cur = (data as Partial<StreakResp>)?.current;
        setStreak(typeof cur === "number" ? cur : 0);
      })
      .catch((_err: unknown) => {
        if (!mounted) return;
        setStreak(0);
      });

    // /user/weekly (se non esiste, mock)
    apiFetch("/user/weekly")
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((data: unknown) => {
        if (!mounted) return;
        if (Array.isArray(data)) {
          const safe = data.filter(isQuizStat);
          setWeekly(safe);
        }
      })
      .catch((_err: unknown) => {
        if (!mounted) return;
        setWeekly([
          { day: "Mon", score: 42 },
          { day: "Tue", score: 65 },
          { day: "Wed", score: 50 },
          { day: "Thu", score: 78 },
          { day: "Fri", score: 71 },
          { day: "Sat", score: 90 },
          { day: "Sun", score: 55 },
        ]);
      });

    return () => {
      mounted = false;
    };
  }, [lang]); // se cambia lingua, riconfigura (utile per testi/locale)

  if (loading) return <div className="p-6">Loading…</div>;
  if (!user) return <div className="p-6">Please login.</div>;

  return (
    <div id="profile-root" className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Profile</h1>

      <div className="rounded-xl border p-4 bg-white">
        <div><b>Email:</b> {user.email}</div>
        <div><b>Name:</b> {user.name || "—"}</div>
        <div>
          <b>Joined:</b>{" "}
          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
        </div>
      </div>

      <div className="rounded-xl border p-4 bg-white">
        <div className="text-sm text-gray-500">Your streak</div>
        <div className="text-3xl font-black">{streak ?? "—"} 🔥</div>
      </div>

      {/* <WeeklyProgressChart data={weekly} /> */}
    </div>
  );
}
