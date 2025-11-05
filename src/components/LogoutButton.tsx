// src/components/LogoutButton.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { toast } from 'react-toastify';

type Props = {
  compact?: boolean;
  /** Lingua corrente (it|en|fr|es). Se non viene passata, la ricavo dal pathname. */
  lang?: 'it' | 'en' | 'fr' | 'es';
  /** Facoltativo: se usi ancora un AuthContext lato Next, lo chiamo dopo il cleanup. */
  onLogout?: () => void;
};

const LANGS = ['it', 'en', 'fr', 'es'] as const;
function langFromPathname(pathname?: string): Props['lang'] {
  if (!pathname) return 'it';
  const m = pathname.match(/^\/(it|en|fr|es)(?:\/|$)/i);
  return (m?.[1]?.toLowerCase() as Props['lang']) || 'it';
}

export default function LogoutButton({ compact = false, lang, onLogout }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const currentLang = (lang ?? langFromPathname(pathname)) || 'it';

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth < 768);
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  const handleLogout = async () => {
    const confirmLogout = window.confirm(
      currentLang === 'it' ? 'Sei sicuro di voler uscire?' : 'Are you sure you want to log out?'
    );
    if (!confirmLogout) return;

    // tenta un logout lato backend (best-effort)
    try {
      const token = localStorage.getItem('cq_token') ?? undefined;
      if (token) {
        await fetch('/api/backend/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => {});
      }
    } catch {
      /* ignore */
    }

    // cleanup locale
    try {
      localStorage.removeItem('cq_token');
      localStorage.removeItem('user');
    } catch {
      /* ignore */
    }

    // eventuale hook esterno
    try {
      onLogout?.();
    } catch {
      /* ignore */
    }

    // feedback
    toast.success(currentLang === 'it' ? 'Logout effettuato con successo!' : 'Logged out successfully!');

    // redirect alla home localizzata
    router.replace(`/${currentLang}`);
  };

  const shared =
    'flex items-center gap-2 font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500';

  if (compact || isMobile) {
    return (
      <button onClick={handleLogout} className={`${shared} text-sm text-red-400 hover:text-red-300`}>
        <LogOut size={16} />
        {currentLang === 'it' ? 'Logout' : 'Logout'}
      </button>
    );
  }

  return (
    <button onClick={handleLogout} className={`${shared} logout-button text-white bg-rose-600 hover:bg-rose-700 px-3 py-1.5 rounded-full`}>
      <LogOut size={16} />
      {currentLang === 'it' ? 'Esci' : 'Logout'}
    </button>
  );
}
