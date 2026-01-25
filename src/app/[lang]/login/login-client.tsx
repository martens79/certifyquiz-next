// src/app/[lang]/login/login-client.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { langFromPathname, getLabel } from "@/lib/i18n";
import {
  backendUrl,
  getToken,
  setToken,
  authHeader,
  clearToken,
  setUser, // ✅ salva l’utente in cache locale
} from "@/lib/auth";

type Props = {
  initialLang: Locale;
};

export default function LoginPageClient({ initialLang }: Props) {
  const pathname = usePathname() ?? "/it";
  const router = useRouter();
  const sp = useSearchParams();

  // 🔧 usa lang iniziale dal server, ma se il pathname cambia si riallinea
  const lang = useMemo<Locale>(
    () => langFromPathname(pathname) || initialLang,
    [pathname, initialLang]
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Evita doppi redirect
  const navigatingRef = useRef(false);

  // ?redirect=/it/quiz/topic/184 (solo path interni)
  const redirectParam = useMemo(() => {
    const r = sp.get("redirect");
    return r && r.startsWith("/") ? r : null;
  }, [sp]);

    const googleHref = useMemo(() => {
    const redirectTarget = redirectParam || `/${lang}/profile`;
    return `https://api.certifyquiz.com/api/auth/google?redirect=${encodeURIComponent(
      redirectTarget
    )}&remember=${remember ? 1 : 0}`;
  }, [redirectParam, lang, remember]);

  // ✅ Se esiste un token, verifica con /auth/me.
  useEffect(() => {
    let alive = true;

    (async () => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(backendUrl("/auth/me"), {
          method: "GET",
          headers: { Accept: "application/json", ...authHeader() },
          credentials: "include",
          cache: "no-store",
        });

        if (!alive) return;

        if (res.ok) {
          // Popola cache utente così la topbar cambia subito
          try {
            const me = await res.json();
            setUser(me, true);
          } catch {}
          if (!navigatingRef.current) {
            navigatingRef.current = true;
            router.replace(redirectParam || `/${lang}/profile`);
          }
        } else if (res.status === 401) {
          clearToken();
          setLoading(false);
        } else {
          // altri errori → mostra form
          setLoading(false);
        }
      } catch {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [router, redirectParam, lang]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (submitting || navigatingRef.current) return;
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch(backendUrl("/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          remember, // se il backend lo usa per refresh cookie
        }),
      });

      if (!res.ok) {
        let msg = String(getLabel({ it: "Login fallito", en: "Login failed" }, lang));
        if (res.status === 401 || res.status === 403) {
          msg = String(
            getLabel(
              { it: "Email o password errate", en: "Wrong email or password" },
              lang
            )
          );
        } else if (res.status === 429) {
          msg = String(
            getLabel(
              {
                it: "Troppi tentativi. Riprova più tardi.",
                en: "Too many attempts. Try later.",
              },
              lang
            )
          );
        }
        throw new Error(msg);
      }

      const data = (await res.json()) as { token?: string };
      if (!data?.token) throw new Error("Token mancante");

      // ✅ salva token con remember
      setToken(data.token, remember);

      // ✅ carica /auth/me e salva utente (così la topbar si aggiorna subito)
      try {
        const meRes = await fetch(backendUrl("/auth/me"), {
          method: "GET",
          headers: { Accept: "application/json", ...authHeader() },
          credentials: "include",
          cache: "no-store",
        });
        if (meRes.ok) {
          const me = await meRes.json();
          setUser(me, remember);
        }
      } catch {
        // se fallisce /auth/me non bloccare il login
      }

      // ✅ redirect finale (una sola volta)
      if (!navigatingRef.current) {
        navigatingRef.current = true;
        router.replace(redirectParam || `/${lang}/profile`);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : String(getLabel({ it: "Errore", en: "Error" }, lang));
      setError(msg);
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-blue-700 text-white text-lg">
        ⏳ {String(getLabel({ it: "Caricamento…", en: "Loading…" }, lang))}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-800 to-blue-600 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center text-blue-700">
          🔑 {String(getLabel({ it: "Accedi", en: "Login" }, lang))}
        </h2>

    <a
  href={googleHref}
  className="w-full flex items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
>
  Continue with Google
</a>

<div className="relative py-1">
  <div className="absolute inset-0 flex items-center">
    <div className="w-full border-t border-gray-200" />
  </div>
  <div className="relative flex justify-center text-xs">
    <span className="bg-white px-2 text-gray-500">
      {String(getLabel({ it: "oppure", en: "or" }, lang))}
    </span>
  </div>
</div>

        {error && (
          <p className="text-red-600 text-center text-sm font-medium">{error}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block font-medium text-gray-700 mb-1"
            >
              📧 {String(getLabel({ it: "Email", en: "Email" }, lang))}
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={String(
                getLabel(
                  { it: "inserisci la tua email", en: "enter your email" },
                  lang
                )
              )}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              autoComplete="username"
              required
              disabled={submitting}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block font-medium text-gray-700 mb-1"
            >
              🔒 {String(getLabel({ it: "Password", en: "Password" }, lang))}
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                id="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                placeholder={String(
                  getLabel(
                    {
                      it: "inserisci la tua password",
                      en: "enter your password",
                    },
                    lang
                  )
                )}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                autoComplete="current-password"
                required
                disabled={submitting}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-700"
                aria-label={String(
                  getLabel(
                    showPw
                      ? { it: "Nascondi password", en: "Hide password" }
                      : { it: "Mostra password", en: "Show password" },
                    lang
                  )
                )}
                title={String(
                  getLabel(
                    showPw
                      ? { it: "Nascondi password", en: "Hide password" }
                      : { it: "Mostra password", en: "Show password" },
                    lang
                  )
                )}
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                disabled={submitting}
              />
              {String(getLabel({ it: "Ricordami", en: "Remember me" }, lang))}
            </label>

            <Link
              href={`/${lang}/forgot-password`}
              className="text-sm text-blue-600 hover:underline"
            >
              {String(
                getLabel(
                  { it: "Password dimenticata?", en: "Forgot password?" },
                  lang
                )
              )}
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold flex items-center justify-center disabled:opacity-60 transition"
            disabled={!email || !password || submitting}
          >
            {submitting
              ? "…"
              : `🚀 ${String(
                  getLabel({ it: "Accedi", en: "Login" }, lang)
                )}`}
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-700">
          {String(
            getLabel(
              { it: "Non hai un account?", en: "Don't have an account?" },
              lang
            )
          )}{" "}
          <Link
            href={`/${lang}/register`}
            className="text-blue-600 hover:underline font-semibold"
          >
            {String(getLabel({ it: "Registrati", en: "Register" }, lang))}
          </Link>
        </p>
      </div>
    </div>
  );
}
