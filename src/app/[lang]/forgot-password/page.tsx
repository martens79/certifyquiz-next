// src/app/[lang]/forgot-password/page.tsx
'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { langFromPathname, getLabel, type Locale } from '@/lib/i18n';
import { backendUrl } from '@/lib/auth';

const isEmail = (v: string) =>
  typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export default function ForgotPasswordPage() {
  const pathname = usePathname() ?? '/it';
  const lang = useMemo<Locale>(() => langFromPathname(pathname), [pathname]);

  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    const normalized = email.trim().toLowerCase();
    if (!isEmail(normalized)) {
      setErr(String(getLabel({ it: "Inserisci un'email valida", en: 'Please enter a valid email' }, lang)));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(backendUrl('/auth/forgot-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalized, lang }),
      });

      // Policy: risposta generica (non riveliamo se l'email esiste)
      if (!res.ok && res.status === 429) {
        setErr(
          String(
            getLabel(
              { it: 'Hai richiesto troppi reset in poco tempo. Riprova più tardi.', en: 'Too many reset requests. Please try again later.' },
              lang
            )
          )
        );
        setSent(false);
      } else {
        setSent(true);
      }
    } catch {
      setErr(String(getLabel({ it: 'Errore invio email. Riprova.', en: 'Failed to send email. Please try again.' }, lang)));
    } finally {
      setLoading(false);
    }
  }

  const emailValid = isEmail(email);

  return (
    <div className="min-h-screen grid place-items-center p-4 bg-gradient-to-b from-blue-800 to-blue-600">
      <form onSubmit={onSubmit} className="bg-white p-6 rounded-xl shadow w-full max-w-md space-y-4">
        <h1 className="text-xl font-semibold text-blue-700">
          {String(getLabel({ it: 'Password dimenticata', en: 'Forgot password' }, lang))}
        </h1>

        {sent ? (
          <>
            <p className="text-sm text-slate-700">
              {String(
                getLabel(
                  {
                    it: 'Se l’email esiste, riceverai un messaggio con le istruzioni entro pochi minuti.',
                    en: "If the email exists, you'll receive reset instructions shortly.",
                  },
                  lang
                )
              )}
            </p>
            <Link
              href={`/${lang}/login`}
              className="inline-block mt-3 px-4 py-2 border rounded text-slate-700 hover:bg-slate-50"
            >
              {String(getLabel({ it: 'Torna al login', en: 'Back to login' }, lang))}
            </Link>
          </>
        ) : (
          <>
            {err && <p className="text-sm text-red-600">{err}</p>}

            <label className="block text-sm font-medium mb-1">
              {String(getLabel({ it: 'Email', en: 'Email' }, lang))}
            </label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (err) setErr(null);
              }}
              required
              autoFocus
            />
            <p className="text-xs text-slate-500">
              {String(
                getLabel(
                  { it: 'Ti invieremo un link per reimpostare la password.', en: "We'll send you a link to reset your password." },
                  lang
                )
              )}
            </p>

            <button
              className="w-full px-4 py-2 bg-blue-600 text-white rounded font-semibold disabled:opacity-60"
              disabled={loading || !emailValid}
            >
              {loading
                ? String(getLabel({ it: 'Invio…', en: 'Sending…' }, lang))
                : String(getLabel({ it: 'Invia link di reset', en: 'Send reset link' }, lang))}
            </button>

            <div className="text-center">
              <Link href={`/${lang}/login`} className="inline-block mt-3 text-sm text-slate-600 hover:underline">
                {String(getLabel({ it: 'Ricordi la password? Accedi', en: 'Remember it? Log in' }, lang))}
              </Link>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
