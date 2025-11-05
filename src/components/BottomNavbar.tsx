'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ListChecks, GraduationCap, User, Mail, Globe } from 'lucide-react';
// Se hai già il tuo LanguageSwitcher in Next, lascialo. Altrimenti commenta la riga.
// import LanguageSwitcher from '@/components/LanguageSwitcher';

type Locale = 'it' | 'en' | 'fr' | 'es';

const SUPPORTED: Locale[] = ['it', 'en', 'fr', 'es'];

/** Utility locali per evitare dipendenze legacy */
function getLabel<T extends Record<string, string>>(obj: T | undefined, fallback: Locale = 'it'): string {
  if (!obj) return '';
  for (const lang of SUPPORTED) {
    if (obj[lang]) return obj[lang];
  }
  return obj[fallback] ?? '';
}

function getCurrentLangFromPath(pathname: string): Locale {
  const seg = pathname.split('/').filter(Boolean)[0] as Locale | undefined;
  return (SUPPORTED as readonly string[]).includes(seg || '') ? (seg as Locale) : 'it';
}

export default function BottomNavbar() {
  const router = useRouter();
  const pathname = usePathname() ?? '/it';
  const lang = getCurrentLangFromPath(pathname);

  // Se il path inizia con "#", non cambiamo pagina; altrimenti prefix con lingua
  const to = (path: string) => (path.startsWith('#') ? '#' + path.slice(1) : `/${lang}${path}`);
  const isActive = (path: string) => !path.startsWith('#') && pathname === `/${lang}${path}`;

  // 🔔 stato: utente già iscritto alla newsletter?
  const [isNewsletterSubscribed, setIsNewsletterSubscribed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('newsletter_subscribed') === 'true';
  });

  // ascolta cambiamenti (anche da altre tab) + evento custom dopo submit
  useEffect(() => {
    const onStorage = () => setIsNewsletterSubscribed(localStorage.getItem('newsletter_subscribed') === 'true');
    const onCustom = () => onStorage();
    window.addEventListener('storage', onStorage);
    window.addEventListener('newsletter-subscribed', onCustom as EventListener);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('newsletter-subscribed', onCustom as EventListener);
    };
  }, []);

  // scroll smooth per gli anchor link
  const handleHashClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (!path?.startsWith('#')) return;
    e.preventDefault();
    const el = document.getElementById(path.slice(1));
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.pageYOffset - 12;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  // ====== MOBILE: Language popover ======
  const [openLang, setOpenLang] = useState(false);
  const langMenuRef = useRef<HTMLDivElement | null>(null);

  // chiudi al click fuori
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (openLang && langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setOpenLang(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [openLang]);

  // chiudi al cambio percorso
  useEffect(() => {
    setOpenLang(false);
  }, [pathname]);

  // cambia lingua mantenendo route + query + hash
  const changeLang = (code: Locale) => {
    if (!SUPPORTED.includes(code)) return;

    // salva preferenza
    try {
      localStorage.setItem('preferred_lang', code);
    } catch {}

    // rimuove eventuale prefisso lingua esistente
    const parts = pathname.split('/').filter(Boolean);
    const first = parts[0];
    const rest = (SUPPORTED as readonly string[]).includes(first || '') ? parts.slice(1) : parts;

    let newPath = `/${code}/${rest.join('/')}`
      .replace(/\/+$/, '/')
      .replace(/\/$/, '');
    newPath = newPath === `/${code}` ? `/${code}/` : newPath;

    // preserva querystring e hash correnti
    const search = typeof window !== 'undefined' ? window.location.search : '';
    const hash = typeof window !== 'undefined' ? window.location.hash : '';

    router.push(`${newPath}${search || ''}${hash || ''}`);
  };

  // Voci di menu (fedeli all’originale; puoi ritarare le rotte più avanti)
  const items = [
    {
      key: 'home',
      to: '/',
      label: { it: 'Home', en: 'Home', fr: 'Accueil', es: 'Inicio' },
      icon: <ListChecks size={22} />,
      title: { it: 'Vai alla home', en: 'Go to home', fr: 'Accueil', es: 'Inicio' },
    },
    {
      key: 'quizhome',
      to: '/quiz-home',
      label: { it: 'Quiz', en: 'Quiz', fr: 'Quiz', es: 'Quiz' },
      icon: <GraduationCap size={22} />,
      title: {
        it: 'Vai ai quiz per categoria',
        en: 'Browse quizzes by category',
        fr: 'Voir les quiz par catégorie',
        es: 'Ver cuestionarios por categoría',
      },
    },
    // 📨 Newsletter: visibile SOLO se NON iscritto
    !isNewsletterSubscribed && {
      key: 'newsletter',
      to: '#newsletter',
      label: { it: 'Newsletter', en: 'Newsletter', fr: 'Newsletter', es: 'Newsletter' },
      icon: <Mail size={22} />,
      title: {
        it: 'Iscriviti alla newsletter',
        en: 'Subscribe to the newsletter',
        fr: 'S’abonner à la newsletter',
        es: 'Suscribirse al boletín',
      },
    },
    {
      key: 'suggested',
      to: '/quiz-suggeriti',
      label: { it: 'Suggeriti', en: 'Suggested', fr: 'Suggérés', es: 'Sugeridos' },
      icon: <ListChecks size={22} />,
      title: {
        it: 'Vai ai quiz suggeriti',
        en: 'Suggested quizzes',
        fr: 'Quiz suggérés',
        es: 'Quiz sugeridos',
      },
    },
    {
      key: 'profile',
      to: '/login', // 🔁 placeholder: collega più avanti al profilo reale / app Railway
      label: { it: 'Login', en: 'Login', fr: 'Connexion', es: 'Iniciar' },
      icon: <User size={22} />,
      title: { it: 'Accedi', en: 'Login', fr: 'Connexion', es: 'Iniciar sesión' },
    },
  ].filter(Boolean) as Array<{
    key: string;
    to: string;
    label: Record<Locale, string>;
    icon: React.ReactNode;
    title: Record<Locale, string>;
  }>;

  // nascondi "Home" se sei già in home locale
  const isOnHome = /^\/(it|en|fr|es)?\/?$/.test(pathname);
  const filteredItems = items.filter((item) => !(item.key === 'home' && isOnHome));

  return (
    <>
      {/* Spacer per non far finire i contenuti sotto la navbar */}
      <div className="h-[80px] md:h-[80px]" aria-hidden />

      {/* NAVBAR MOBILE */}
      <div
        className="md:hidden fixed bottom-0 left-0 w-full bg-white p-3 flex justify-around items-center text-[#0a1f44]
                   shadow-inner border-t border-gray-200 h-[80px] z-50
                   [padding-bottom:env(safe-area-inset-bottom)]"
      >
        {filteredItems.map(({ key, to: path, label, icon, title }) => (
          <Link
            key={key}
            href={to(path)}
            title={getLabel(title)}
            className="flex flex-col items-center text-sm"
            onClick={(e) => handleHashClick(e, path)}
          >
            {icon}
            <span className={isActive(path) ? 'font-bold' : ''}>{getLabel(label)}</span>
          </Link>
        ))}

        {/* 🌐 MOBILE: bottone lingua + popover */}
        <div className="relative" ref={langMenuRef}>
          <button
            type="button"
            className="flex flex-col items-center text-sm px-3 py-2 rounded-lg hover:bg-gray-100"
            aria-haspopup="menu"
            aria-expanded={openLang ? 'true' : 'false'}
            aria-label="Seleziona lingua"
            onClick={() => setOpenLang((v) => !v)}
          >
            <Globe size={22} />
            <span className="mt-[2px]">{lang?.toUpperCase?.() || 'IT'}</span>
          </button>

          {openLang && (
            <div
              role="menu"
              className="absolute bottom-[94px] right-0 w-44 bg-white border border-gray-200 rounded-xl shadow-lg p-2"
            >
              {[
                { code: 'it', label: 'Italiano', flag: '🇮🇹' },
                { code: 'en', label: 'English', flag: '🇬🇧' },
                { code: 'fr', label: 'Français', flag: '🇫🇷' },
                { code: 'es', label: 'Español', flag: '🇪🇸' },
              ].map(({ code, label, flag }) => (
                <button
                  key={code}
                  role="menuitem"
                  className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-2 ${
                    lang === code ? 'font-semibold' : ''
                  }`}
                  onClick={() => changeLang(code as Locale)}
                >
                  <span aria-hidden>{flag}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* NAVBAR DESKTOP */}
      <div
        className="hidden md:flex fixed bottom-0 left-0 w-full bg-white px-6 py-3 text-[#0a1f44]
                   shadow-inner border-t border-gray-200 h-[80px] z-50
                   [padding-bottom:env(safe-area-inset-bottom)]"
      >
        <div className="flex w-full items-center justify-between">
          <div className="flex gap-16 items-center">
            {filteredItems.map(({ key, to: path, label, icon, title }) => (
              <Link
                key={key}
                href={to(path)}
                title={getLabel(title)}
                className="flex flex-col items-center text-sm"
                onClick={(e) => handleHashClick(e, path)}
              >
                {icon}
                <span className={isActive(path) ? 'font-bold' : ''}>{getLabel(label)}</span>
              </Link>
            ))}
          </div>

          <div className="pl-6 flex items-center gap-4">
            {/* Desktop: se hai un LanguageSwitcher già pronto in Next, scommenta */}
            {/* <LanguageSwitcher /> */}
            <div className="text-sm opacity-70">© CertifyQuiz</div>
          </div>
        </div>
      </div>
    </>
  );
}
