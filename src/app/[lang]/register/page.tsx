// src/app/[lang]/register/page.tsx
'use client';

import { useMemo, useState } from 'react';
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
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<string>('');

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
    if (formData.password.length < 6) {
      setError(String(getLabel({ it: 'Password troppo corta (min 6)', en: 'Password too short (min 6)' }, lang)));
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

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-600 text-sm">{message}</p>}

          <button
            type="submit"
            disabled={submitting}
            className={`w-full text-white font-semibold py-2 rounded-md transition ${
              submitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
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
