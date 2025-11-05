// src/components/LegalTopBar.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

// Ricava la lingua dal path: /it/..., /en/..., /fr/..., /es/...
const getLangFromPath = (pathname: string) => {
  const m = pathname.match(/^\/(it|en|fr|es)(\/|$)/i);
  return (m ? m[1].toLowerCase() : 'it') as 'it' | 'en' | 'fr' | 'es';
};

type Props = {
  sticky?: boolean;
};

export default function LegalTopBar({ sticky = true }: Props) {
  const router = useRouter();
  const pathname = usePathname() || '/it';
  const lang = useMemo(() => getLangFromPath(pathname), [pathname]);

  const t = {
    it: { back: 'Indietro', home: 'Home', close: 'Chiudi' },
    en: { back: 'Back', home: 'Home', close: 'Close' },
    fr: { back: 'Retour', home: 'Accueil', close: 'Fermer' },
    es: { back: 'Atrás', home: 'Inicio', close: 'Cerrar' },
  }[lang];

  const goBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) router.back();
    else router.push(`/${lang}`);
  };

  // ESC per chiudere
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') goBack();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div
      className={`${sticky ? 'sticky top-0' : ''} z-40 bg-white/90 backdrop-blur border-b`}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <button
          onClick={goBack}
          className="inline-flex items-center gap-2 text-sm text-blue-700 hover:underline"
        >
          <span aria-hidden>←</span>
          {t.back}
        </button>

        <Link href={`/${lang}`} className="text-sm text-gray-700 hover:underline">
          {t.home}
        </Link>

        <button
          onClick={goBack}
          aria-label={t.close}
          title={t.close}
          className="p-2 rounded hover:bg-gray-100"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
