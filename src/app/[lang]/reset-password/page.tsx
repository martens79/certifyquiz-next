// src/app/[lang]/reset-password/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { langFromPathname, getLabel, type Locale } from '@/lib/i18n';
import { backendUrl } from '@/lib/auth';

type Status = 'checking' | 'ok' | 'invalid' | 'used' | 'expired' | 'missing';

const strongEnough = (s: string) =>
  typeof s === 'string' && s.length >= 8 && /[A-Za-z]/.test(s) && /\d/.test(s);

export default function ResetPasswordPage() {
  const pathname = usePathname() ?? '/it';
  const lang = useMemo<Locale>(() => langFromPathname(pathname), [pathname]);
  const router = useRouter();
  const sp = useSearchParams();

  const token = sp.get('token') || '';

  const [pw1, setPw1] = useState('');
  const [pw2, setPw2] = useState('');
  const [show, setShow] = useState(false);

  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Status>('checking');

  // Valida il token all'apertura
  useEffect(() => {
    let cancelled = false;

    async function validate() {
      if (!token) {
        setStatus('missing');
        return;
      }
      setStatus('checking');
      try {
        const res = await fetch(
          `${backendUrl('/auth/reset-password/validate')}?token=${encodeURIComponent(token)}`,
          { method: 'GET' }
        );
        if (!res.ok) {
          // Il backend può restituire codici specifici nel JSON
          const data = await safeJson(res);
          const code: string | undefined = data?.code;
          if (code === 'USED') setStatus('used');
          else if (code === 'EXPIRED') setStatus('expired');
          else setStatus('invalid');
          return;
        }
        if (!cancelled) setStatus('ok');
      } catch {
        if (!cancelled) setStatus('invalid');
      }
    }

    validate();
    return () => {
      cancelled = true;
    };
  }, [token]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    if (status !== 'ok') return;

    if (pw1 !== pw2) {
      setErr(String(getLabel({ it: 'Le password non coincidono', en: 'Passwords do not match' }, lang)));
      return;
    }
    if (!strongEnough(pw1)) {
      setErr(
        String(getLabel({ it: 'Min 8 caratteri, lettere e numeri', en: 'Min 8 chars, letters & numbers' }, lang))
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(backendUrl('/auth/reset-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: pw1 }),
      });

      if (!res.ok) {
        const data = await safeJson(res);
        const code: string | undefined = data?.code;
        const message =
          code === 'USED'
            ? getLabel(
                { it: 'Link già usato. Richiedi un nuovo reset.', en: 'Link already used. Request a new reset.' },
                lang
              )
            : code === 'EXPIRED'
            ? getLabel(
                { it: 'Link scaduto. Richiedi un nuovo reset.', en: 'Link expired. Request a new reset.' },
                lang
              )
            : getLabel({ it: 'Token non valido o scaduto', en: 'Invalid or expired token' }, lang);
        throw new Error(String(message));
      }

      setMsg(
        String(
          getLabel(
            { it: 'Password aggiornata! Ora puoi accedere.', en: 'Password updated! You can log in now.' },
            lang
          )
        )
      );
      setTimeout(() => router.replace(`/${lang}/login`), 1200);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : String(getLabel({ it: 'Errore', en: 'Error' }, lang)));
    } finally {
      setLoading(false);
    }
  }

  function StatusBox() {
    if (status === 'checking') {
      return (
        <p className="text-sm text-slate-600">
          {String(getLabel({ it: 'Verifica del link in corso…', en: 'Checking link…' }, lang))}
        </p>
      );
    }
    if (status === 'missing')
      return (
        <ErrorBox>
          {String(
            getLabel(
              { it: 'Token mancante. Usa il link ricevuto via email.', en: 'Missing token. Use the link from your email.' },
              lang
            )
          )}
        </ErrorBox>
      );
    if (status === 'invalid')
      return <ErrorBox>{String(getLabel({ it: 'Link non valido.', en: 'Invalid link.' }, lang))}</ErrorBox>;
    if (status === 'used')
      return (
        <ErrorBox>
          {String(
            getLabel(
              { it: 'Link già usato. Richiedi un nuovo reset.', en: 'Link already used. Request a new reset.' },
              lang
            )
          )}
        </ErrorBox>
      );
    if (status === 'expired')
      return (
        <ErrorBox>
          {String(
            getLabel(
              { it: 'Link scaduto. Richiedi un nuovo reset.', en: 'Link expired. Request a new reset.' },
              lang
            )
          )}
        </ErrorBox>
      );
    return null;
  }

  const canSubmit = status === 'ok' && strongEnough(pw1) && pw1 === pw2 && !loading;

  return (
    <div className="min-h-screen grid place-items-center p-4 bg-gradient-to-b from-blue-800 to-blue-600">
      <form onSubmit={onSubmit} className="bg-white p-6 rounded-xl shadow w-full max-w-md space-y-4">
        <h1 className="text-xl font-semibold text-blue-700">
          {String(getLabel({ it: 'Reimposta password', en: 'Reset password' }, lang))}
        </h1>

        <StatusBox />

        {msg && <p className="text-sm text-green-700">{msg}</p>}
        {err && <p className="text-sm text-red-600">{err}</p>}

        {status === 'ok' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">
                {String(getLabel({ it: 'Nuova password', en: 'New password' }, lang))}
              </label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  className="w-full border rounded px-3 py-2 pr-10 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={pw1}
                  onChange={(e) => setPw1(e.target.value)}
                  placeholder="••••••••"
                  autoFocus
                  required
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-700"
                  aria-label={String(
                    getLabel(show ? { it: 'Nascondi password', en: 'Hide password' } : { it: 'Mostra password', en: 'Show password' }, lang)
                  )}
                  title={String(
                    getLabel(show ? { it: 'Nascondi password', en: 'Hide password' } : { it: 'Mostra password', en: 'Show password' }, lang)
                  )}
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {String(
                  getLabel(
                    { it: 'Almeno 8 caratteri, con lettere e numeri.', en: 'At least 8 chars, with letters and numbers.' },
                    lang
                  )
                )}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {String(getLabel({ it: 'Ripeti password', en: 'Repeat password' }, lang))}
              </label>
              <input
                type={show ? 'text' : 'password'}
                className="w-full border rounded px-3 py-2 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={pw2}
                onChange={(e) => setPw2(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              className="w-full px-4 py-2 bg-blue-600 text-white rounded font-semibold disabled:opacity-60"
              disabled={!canSubmit}
            >
              {loading
                ? String(getLabel({ it: 'Salvataggio…', en: 'Saving…' }, lang))
                : String(getLabel({ it: 'Aggiorna password', en: 'Update password' }, lang))}
            </button>
          </>
        )}
      </form>
    </div>
  );
}

async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

function ErrorBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-sm bg-rose-50 text-rose-700 border border-rose-200 rounded px-3 py-2">
      {children}
    </div>
  );
}
