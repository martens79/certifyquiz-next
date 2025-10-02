// app/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SUPPORTED = ["it", "en", "fr", "es"] as const;
type Lang = typeof SUPPORTED[number];

function pickPreferred(): Lang {
  if (typeof navigator === "undefined") return "it";
  const tag = (navigator.language || "it").toLowerCase();
  if (tag.startsWith("it")) return "it";
  if (tag.startsWith("fr")) return "fr";
  if (tag.startsWith("es")) return "es";
  return "en";
}

export default function RootLanding() {
  const router = useRouter();
  const preferred = useMemo(() => pickPreferred(), []);
  const [count, setCount] = useState(3);

  useEffect(() => {
    const t = setInterval(() => setCount((c) => (c > 0 ? c - 1 : 0)), 1000);
    const to = setTimeout(() => router.replace(`/${preferred}`), 3000);
    return () => {
      clearInterval(t);
      clearTimeout(to);
    };
  }, [preferred, router]);

  const langs = [
    { code: "it", label: "Italiano", path: "/it" },
    { code: "en", label: "English",  path: "/en" },
    { code: "fr", label: "Français", path: "/fr" },
    { code: "es", label: "Español",  path: "/es" },
  ] as const;

  return (
    <div className="min-h-dvh bg-gradient-to-br from-indigo-50 via-white to-emerald-50">
      <div className="mx-auto max-w-5xl px-6 py-10">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gray-900 text-white grid place-items-center text-xs font-bold">
              CQ
            </div>
            <span className="font-semibold text-lg">CertifyQuiz</span>
          </div>
          <span className="hidden md:inline text-xs text-gray-500">
            Auto-redirect a <b>/{preferred}</b> tra {count}s
          </span>
        </div>

        {/* Hero */}
        <section className="mt-16 text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Quiz reali per <span className="whitespace-nowrap">certificazioni IT</span>
          </h1>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Spiegazioni passo-passo, modalità esame e badge. Scegli la tua lingua per iniziare.
          </p>

          {/* Language cards */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 justify-center">
            {langs.map((l) => (
              <Link
                key={l.code}
                href={l.path}
                onClick={(e) => {
                  e.preventDefault();
                  router.replace(l.path);
                }}
                className={`group rounded-2xl border p-4 sm:p-5 bg-white/70 backdrop-blur transition shadow-sm hover:shadow-md hover:bg-white ${
                  l.code === preferred ? "ring-2 ring-gray-900" : ""
                }`}
              >
                <div className="text-2xl">{flag(l.code as Lang)}</div>
                <div className="mt-2 font-medium">{l.label}</div>
                <div className="text-xs text-gray-500 group-hover:underline">/{l.code}</div>
              </Link>
            ))}
          </div>

          <button
            onClick={() => router.replace(`/${preferred}`)}
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-gray-900 text-white px-4 py-2 text-sm hover:opacity-90"
          >
            Vai subito a /{preferred} 🚀
          </button>
        </section>
      </div>
    </div>
  );
}

function flag(code: Lang) {
  switch (code) {
    case "it": return "🇮🇹";
    case "en": return "🇬🇧";
    case "fr": return "🇫🇷";
    case "es": return "🇪🇸";
  }
}
