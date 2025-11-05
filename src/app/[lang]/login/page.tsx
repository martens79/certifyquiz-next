// src/app/[lang]/login/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import type { Locale } from '@/lib/i18n';
import { langFromPathname, getLabel } from '@/lib/i18n';
import { getToken, setToken, backendUrl } from '@/lib/auth';

export default function LoginPage() {
  const pathname = usePathname() ?? '/it';
  const lang = useMemo<Locale>(() => langFromPathname(pathname), [pathname]);
  const router = useRouter();
  const sp = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true); // ✅ ora usato davvero
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ?redirect=/it/profile (solo path interni)
  const redirectParam = useMemo(() => {
    const r = sp.get('redirect');
    return r && r.startsWith('/') ? r : null;
  }, [sp]);

  // se già loggato → redirect
  useEffect(() => {
    const token = getToken();
    if (token) {
      router.replace(redirectParam || `/${lang}/profile`);
      return;
    }
    setLoading(false);
  }, [router, redirectParam, lang]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch(backendUrl('/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });

      if (!res.ok) {
        const status = res.status;
        let msg = String(getLabel({ it: 'Login fallito', en: 'Login failed' }, lang));
        if (status === 401 || status === 403) {
          msg = String(getLabel({ it: 'Email o password errate', en: 'Wrong email or password' }, lang));
        } else if (status === 429) {
          msg = String(getLabel({ it: 'Troppi tentativi. Riprova più tardi.', en: 'Too many attempts. Try later.' }, lang));
        }
        throw new Error(msg || 'Login error');
      }

      const data = (await res.json()) as { token?: string };
      if (!data?.token) throw new Error('Token missing');

      // ✅ persistente se remember=true, altrimenti solo sessione
      setToken(data.token, remember);

      router.replace(redirectParam || `/${lang}/profile`);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : String(getLabel({ it: 'Errore', en: 'Error' }, lang));
      setError(msg || String(getLabel({ it: 'Errore', en: 'Error' }, lang)));
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-blue-700 text-white text-lg">
        ⏳ {String(getLabel({ it: 'Caricamento…', en: 'Loading…' }, lang))}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-800 to-blue-600 p-4 relative">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md space-y-6 z-10">
        <h2 className="text-2xl font-bold text-center text-blue-700">
          🔑 {String(getLabel({ it: 'Accedi', en: 'Login' }, lang))}
        </h2>

        {error && <p className="text-red-600 text-center text-sm font-medium">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block font-medium text-gray-700 mb-1">
              📧 {String(getLabel({ it: 'Email', en: 'Email' }, lang))}
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={String(getLabel({ it: 'inserisci la tua email', en: 'enter your email' }, lang))}
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
            <label htmlFor="password" className="block font-medium text-gray-700 mb-1">
              🔒 {String(getLabel({ it: 'Password', en: 'Password' }, lang))}
            </label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                id="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                placeholder={String(getLabel({ it: 'inserisci la tua password', en: 'enter your password' }, lang))}
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
                aria-label={
                  String(
                    getLabel(
                      showPw
                        ? { it: 'Nascondi password', en: 'Hide password' }
                        : { it: 'Mostra password', en: 'Show password' },
                      lang
                    )
                  )
                }
                title={
                  String(
                    getLabel(
                      showPw
                        ? { it: 'Nascondi password', en: 'Hide password' }
                        : { it: 'Mostra password', en: 'Show password' },
                      lang
                    )
                  )
                }
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
              {String(getLabel({ it: 'Ricordami', en: 'Remember me' }, lang))}
            </label>

            <Link href={`/${lang}/forgot-password`} className="text-sm text-blue-600 hover:underline">
              {String(getLabel({ it: 'Password dimenticata?', en: 'Forgot password?' }, lang))}
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold flex items-center justify-center disabled:opacity-60 transition"
            disabled={!email || !password || submitting}
          >
            {submitting ? '…' : `🚀 ${String(getLabel({ it: 'Accedi', en: 'Login' }, lang))}`}
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-700">
          {String(getLabel({ it: 'Non hai un account?', en: "Don't have an account?" }, lang))}{' '}
          <Link href={`/${lang}/register`} className="text-blue-600 hover:underline font-semibold">
            {String(getLabel({ it: 'Registrati', en: 'Register' }, lang))}
          </Link>
        </p>
      </div>
    </div>
  );
}
