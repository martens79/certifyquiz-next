// src/app/[lang]/register/page.tsx
'use client';

import { useMemo, useState } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { Locale } from '@/lib/i18n';
import { langFromPathname, getLabel } from '@/lib/i18n';
import { setToken, backendUrl } from '@/lib/auth';

type FormDataState = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  website: string;
};

type RegisterSuccess = {
  token?: string;
  user?: {
    id: number;
    email: string;
    username?: string;
  };
};

type RegisterError = {
  error?: string;
  message?: string;
};

function getErrorMessage(err: unknown, fallback = 'Error'): string {
  if (typeof err === 'string') return err;
  if (err && typeof err === 'object' && 'message' in err && typeof (err as any).message === 'string') {
    return (err as { message: string }).message;
  }
  return fallback;
}

async function safeJson<T = unknown>(res: Response): Promise<T | null> {
  try {
    // Prova a leggere JSON solo se il server lo dichiara
    const ctype = res.headers.get('content-type') || '';
    if (!ctype.toLowerCase().includes('application/json')) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export default function RegisterPage() {
  const pathname = usePathname() ?? '/it';
  const lang = useMemo<Locale>(() => langFromPathname(pathname), [pathname]);
  const router = useRouter();

  const [formData, setFormData] = useState<FormDataState>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    website: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const [turnstileKey, setTurnstileKey] = useState(0);

  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';

  function resetTurnstile() {
    setTurnstileToken('');
    setTurnstileKey((current) => current + 1);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError('');
    setMessage('');
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!formData.username.trim()) {
      setError(String(getLabel({ it: 'Inserisci un username', en: 'Enter a username' }, lang)));
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError(String(getLabel({ it: 'Le password non corrispondono', en: 'Passwords do not match' }, lang)));
      return;
    }
    if (formData.password.length < 8 || !/[A-Za-z]/.test(formData.password) || !/\d/.test(formData.password)) {
      setError(
        String(
          getLabel(
            {
              it: 'La password deve contenere almeno 8 caratteri, una lettera e un numero.',
              en: 'The password must contain at least 8 characters, one letter, and one number.',
            },
            lang
          )
        )
      );
      return;
    }

    // Honeypot anti-bot: gli utenti reali non vedono né compilano questo campo.
    if (formData.website.trim()) {
      setError(
        String(
          getLabel(
            {
              it: 'Verifica anti-bot non riuscita.',
              en: 'Anti-bot verification failed.',
            },
            lang
          )
        )
      );
      resetTurnstile();
      return;
    }

    if (!turnstileSiteKey) {
      setError(
        String(
          getLabel(
            {
              it: 'Protezione anti-bot non configurata. Riprova più tardi.',
              en: 'Anti-bot protection is not configured. Please try again later.',
            },
            lang
          )
        )
      );
      return;
    }

    if (!turnstileToken) {
      setError(
        String(
          getLabel(
            { it: 'Completa la verifica anti-bot.', en: 'Complete the anti-bot verification.' },
            lang
          )
        )
      );
      return;
    }

    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch(backendUrl('/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          website: formData.website,
          turnstileToken,
        }),
      });

      const data = await safeJson<RegisterSuccess & RegisterError>(res);

      if (!res.ok) {
        const status = res.status;
        const backendErr = (data?.error || data?.message) ?? undefined;

        let friendly =
          backendErr ||
          String(getLabel({ it: 'Errore nella registrazione', en: 'Registration error' }, lang));

        if (status === 409) {
          friendly =
            backendErr ||
            String(
              getLabel(
                { it: 'Email o username già registrati.', en: 'Email or username already registered.' },
                lang
              )
            );
        } else if (status === 400) {
          friendly =
            backendErr ||
            String(getLabel({ it: 'Dati mancanti o non validi.', en: 'Missing or invalid data.' }, lang));
        }

        throw new Error(friendly);
      }

      // Se il backend restituisce user+token → login diretto
      if (data?.token && data?.user) {
        try {
          setToken?.(data.token, true); // persistente
        } catch {
          try {
            localStorage.setItem('cq_token', data.token);
          } catch {
            /* noop */
          }
        }
        router.replace(`/${lang}/profile`);
        return;
      }

      // Altrimenti messaggio di conferma e redirect al login
      setMessage(
        String(
          getLabel(
            {
              it: 'Registrazione completata! Ora puoi accedere.',
              en: 'Registration successful! You can now log in.',
            },
            lang
          )
        )
      );
      setTimeout(() => router.replace(`/${lang}/login`), 1200);
    } catch (err: unknown) {
      resetTurnstile();
      setError(
        getErrorMessage(
          err,
          String(getLabel({ it: 'Errore', en: 'Error' }, lang))
        )
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-800 to-blue-600 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-600 flex items-center gap-2 mb-6">
          🔐 {String(getLabel({ it: 'Registrati', en: 'Register' }, lang))}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Honeypot anti-bot: non rimuovere. */}
          <div
            aria-hidden="true"
            className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden"
          >
            <label htmlFor="website">Website</label>
            <input
              id="website"
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              autoComplete="off"
              tabIndex={-1}
            />
          </div>

          <div>
            <label htmlFor="username" className="block font-medium text-gray-700 mb-1">
              📛 {String(getLabel({ it: 'Nome utente', en: 'Username' }, lang))}
            </label>
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              autoComplete="username"
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-medium text-gray-700 mb-1">📧 Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block font-medium text-gray-700 mb-1">
              🔒 {String(getLabel({ it: 'Password', en: 'Password' }, lang))}
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block font-medium text-gray-700 mb-1">
              🔁 {String(getLabel({ it: 'Conferma Password', en: 'Confirm Password' }, lang))}
            </label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              autoComplete="new-password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex min-h-[65px] items-center justify-center">
            {turnstileSiteKey ? (
              <Turnstile
                key={turnstileKey}
                siteKey={turnstileSiteKey}
                options={{ theme: 'light', size: 'flexible' }}
                onSuccess={(token) => {
                  setTurnstileToken(token);
                  setError('');
                }}
                onExpire={resetTurnstile}
                onError={resetTurnstile}
              />
            ) : (
              <p className="text-red-500 text-sm text-center">
                {String(
                  getLabel(
                    {
                      it: 'Turnstile non configurato: manca NEXT_PUBLIC_TURNSTILE_SITE_KEY.',
                      en: 'Turnstile is not configured: NEXT_PUBLIC_TURNSTILE_SITE_KEY is missing.',
                    },
                    lang
                  )
                )}
              </p>
            )}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-600 text-sm">{message}</p>}

          <button
            type="submit"
            disabled={submitting || !turnstileToken || !turnstileSiteKey}
            className={`w-full text-white font-semibold py-2 rounded-md transition ${
              submitting || !turnstileToken || !turnstileSiteKey
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {submitting ? '…' : '🚀'} {String(getLabel({ it: 'Registrati', en: 'Register' }, lang))}
          </button>
        </form>

        <p className="text-sm mt-4 text-center text-gray-700">
          {String(getLabel({ it: 'Hai già un account?', en: 'Already have an account?' }, lang))}{' '}
          <Link href={`/${lang}/login`} className="text-blue-600 hover:underline font-semibold">
            {String(getLabel({ it: 'Accedi', en: 'Login' }, lang))}
          </Link>
        </p>
      </div>
    </div>
  );
}