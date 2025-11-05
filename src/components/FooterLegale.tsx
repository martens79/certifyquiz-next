// src/components/FooterLegale.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

type Locale = 'it' | 'en' | 'fr' | 'es';

const getLangFromPath = (pathname: string): Locale => {
  const m = pathname.match(/^\/(it|en|fr|es)(?:\/|$)/i);
  return (m?.[1]?.toLowerCase() || 'it') as Locale;
};

type Props = {
  /** fixed (default) o static */
  position?: 'fixed' | 'static';
  /** mostra anche su mobile (default: false) */
  showOnMobile?: boolean;
};

export default function FooterLegale({
  position = 'fixed',
  showOnMobile = false,
}: Props) {
  const pathname = usePathname() || '/it';
  const lang = useMemo(() => getLangFromPath(pathname), [pathname]);

  const labels = {
    it: { privacy: 'Privacy', terms: 'Termini e Condizioni', cookie: 'Cookie' },
    en: { privacy: 'Privacy Policy', terms: 'Terms & Conditions', cookie: 'Cookie Policy' },
    fr: { privacy: 'Politique de confidentialité', terms: 'Conditions générales', cookie: 'Politique de cookies' },
    es: { privacy: 'Política de privacidad', terms: 'Términos y condiciones', cookie: 'Política de cookies' },
  }[lang];

  const year = new Date().getFullYear();

  return (
    <footer
      className={[
        showOnMobile ? 'block' : 'hidden md:block',
        position === 'fixed' ? 'fixed bottom-0 left-0 right-0' : '',
        'bg-white border-t',
      ].join(' ')}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 text-center text-sm text-gray-500">
        <p className="flex items-center justify-center gap-3">
          <span>© {year} CertifyQuiz</span>
          <span>·</span>
          <Link href={`/${lang}/privacy`} className="underline hover:no-underline">
            {labels.privacy}
          </Link>
          <span>·</span>
          <Link href={`/${lang}/terms`} className="underline hover:no-underline">
            {labels.terms}
          </Link>
          <span>·</span>
          <Link href={`/${lang}/cookie`} className="underline hover:no-underline">
            {labels.cookie}
          </Link>
        </p>
      </div>
    </footer>
  );
}
