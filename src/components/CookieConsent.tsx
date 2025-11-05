// src/components/CookieConsent.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

type Locale = 'it' | 'en' | 'fr' | 'es';

const getLangFromPath = (pathname: string): Locale => {
  const m = pathname.match(/^\/(it|en|fr|es)(?:\/|$)/i);
  return (m?.[1]?.toLowerCase() || 'it') as Locale;
};

type Props = {
  /** Se true, alza il banner (es. per non coprire footer utente loggato) */
  isLoggedIn?: boolean;
  /** Offset in px quando loggato (default 100) */
  loggedOffsetPx?: number;
};

export default function CookieConsent({
  isLoggedIn = false,
  loggedOffsetPx = 100,
}: Props) {
  const pathname = usePathname() || '/it';
  const lang = useMemo(() => getLangFromPath(pathname), [pathname]);
  const [show, setShow] = useState(false);

  // Mostra se non esiste un consenso salvato (compat: chiave vecchia e nuova)
  useEffect(() => {
    try {
      const oldKey = localStorage.getItem('cookie-consent'); // compat con versione precedente
      const newKey = localStorage.getItem('cq:cookie-consent');
      if (!oldKey && !newKey) setShow(true);
    } catch {
      // no-op
    }
  }, []);

  if (!show) return null;

  const links: Record<Locale, { privacy: string; cookie: string }> = {
    it: { privacy: '/it/privacy', cookie: '/it/cookie' },
    en: { privacy: '/en/privacy', cookie: '/en/cookie' },
    fr: { privacy: '/fr/privacy', cookie: '/fr/cookie' },
    es: { privacy: '/es/privacy', cookie: '/es/cookie' },
  };

  const t = {
    it: {
      text:
        'Usiamo cookie per migliorare l’esperienza. Leggi la ',
      privacy: 'Privacy',
      and: ' e la ',
      cookie: 'Cookie Policy',
      accept: 'Accetta',
      reject: 'Rifiuta',
    },
    en: {
      text: 'We use cookies to improve your experience. Read the ',
      privacy: 'Privacy',
      and: ' and the ',
      cookie: 'Cookie Policy',
      accept: 'Accept',
      reject: 'Reject',
    },
    fr: {
      text:
        'Nous utilisons des cookies pour améliorer votre expérience. Lisez la ',
      privacy: 'Confidentialité',
      and: ' et la ',
      cookie: 'Politique de cookies',
      accept: 'Accepter',
      reject: 'Refuser',
    },
    es: {
      text:
        'Usamos cookies para mejorar tu experiencia. Lee la ',
      privacy: 'Privacidad',
      and: ' y la ',
      cookie: 'Política de cookies',
      accept: 'Aceptar',
      reject: 'Rechazar',
    },
  }[lang];

  const accept = () => {
    try {
      localStorage.setItem('cq:cookie-consent', JSON.stringify({ status: 'accepted', ts: Date.now() }));
      localStorage.setItem('cookie-consent', 'accepted'); // compat con chiave precedente
    } finally {
      setShow(false);
    }
  };

  const reject = () => {
    try {
      localStorage.setItem('cq:cookie-consent', JSON.stringify({ status: 'rejected', ts: Date.now() }));
      localStorage.setItem('cookie-consent', 'rejected'); // compat con chiave precedente
    } finally {
      setShow(false);
    }
  };

  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 z-[100] max-w-xl w-[92%] bg-white shadow-xl rounded-xl p-4 transition-all"
      style={{ bottom: isLoggedIn ? `${loggedOffsetPx}px` : '20px' }}
      role="dialog"
      aria-live="polite"
    >
      <p className="text-sm">
        {t.text}
        <Link href={links[lang].privacy} className="underline">
          {t.privacy}
        </Link>
        {t.and}
        <Link href={links[lang].cookie} className="underline">
          {t.cookie}
        </Link>
        .
      </p>

      <div className="mt-3 flex gap-2 justify-end">
        <button
          onClick={accept}
          className="px-3 py-1 rounded bg-black text-white"
        >
          {t.accept}
        </button>
        <button
          onClick={reject}
          className="px-3 py-1 rounded border"
        >
          {t.reject}
        </button>
      </div>
    </div>
  );
}
