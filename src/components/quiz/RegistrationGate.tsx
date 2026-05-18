'use client';

import { usePathname } from 'next/navigation';
import type { Locale } from '@/lib/quiz-types';
import { withLang } from '@/lib/i18n';

type Props = {
  lang: Locale;
  certificationSlug?: string;
  topicSlug?: string;
  correctCount?: number;
  totalAnswered?: number;
  onBack?: () => void;
};

const COPY = {
  badge: {
    it: '5 domande completate',
    en: '5 questions completed',
    fr: '5 questions complétées',
    es: '5 preguntas completadas',
  },
  title: {
    it: 'Crea un account gratuito per continuare',
    en: 'Create a free account to keep going',
    fr: 'Crée un compte gratuit pour continuer',
    es: 'Crea una cuenta gratuita para continuar',
  },
  sub: {
    it: 'Salva i tuoi progressi e continua il quiz. È gratis.',
    en: "Save your progress and continue the quiz. It's free.",
    fr: "Sauvegarde ta progression et continue le quiz. C'est gratuit.",
    es: 'Guarda tu progreso y continúa el quiz. Es gratis.',
  },
  google: {
    it: 'Continua con Google',
    en: 'Continue with Google',
    fr: 'Continuer avec Google',
    es: 'Continuar con Google',
  },
  email: {
    it: 'Registrati con email',
    en: 'Sign up with email',
    fr: "S'inscrire avec email",
    es: 'Registrarse con email',
  },
  login: {
    it: 'Hai già un account?',
    en: 'Already have an account?',
    fr: 'Tu as déjà un compte ?',
    es: '¿Ya tienes cuenta?',
  },
  loginLink: {
    it: 'Accedi',
    en: 'Log in',
    fr: 'Connexion',
    es: 'Entrar',
  },
  back: {
    it: 'Continua senza account',
    en: 'Continue without account',
    fr: 'Continuer sans compte',
    es: 'Continuar sin cuenta',
  },
};

export default function RegistrationGate({
  lang,
  correctCount = 0,
  totalAnswered = 5,
  onBack,
}: Props) {
  const pathname = usePathname();
  const redirect = encodeURIComponent(pathname ?? '/');

  const googleHref = `https://api.certifyquiz.com/api/auth/google?redirect=${redirect}&remember=1`;
  const registerHref = withLang(lang, `/register?redirect=${redirect}`);
  const loginHref = withLang(lang, `/login?redirect=${redirect}`);

  const percentage = totalAnswered > 0
    ? Math.round((correctCount / totalAnswered) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-md rounded-2xl bg-white p-6 text-gray-900 shadow-xl sm:p-8">

      <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800">
        🎯 {COPY.badge[lang]}
      </div>

      <div className="mb-4 flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-3">
        <div className="text-center">
          <div className="text-xl font-semibold text-gray-900">{percentage}%</div>
          <div className="text-xs text-gray-500">Score</div>
        </div>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="text-center">
          <div className="text-xl font-semibold text-gray-900">{correctCount}/{totalAnswered}</div>
          <div className="text-xs text-gray-500">
            {lang === 'it' ? 'Corrette' : 'Correct'}
          </div>
        </div>
      </div>

      <h2 className="mb-1 text-xl font-semibold text-gray-900">{COPY.title[lang]}</h2>
      <p className="mb-6 text-sm text-gray-600">{COPY.sub[lang]}</p>

      
        href={googleHref}
        className="mb-3 flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
      >
        <svg className="h-5 w-5" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.38 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.1 24.5c0-1.64-.15-3.21-.43-4.73H24v9.01h12.44c-.54 2.91-2.18 5.38-4.63 7.04l7.49 5.81c4.38-4.04 6.8-9.98 6.8-17.13z"/>
          <path fill="#FBBC05" d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.01 0 19.91 0 24c0 4.09.92 7.99 2.56 11.78l7.98-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.81l-7.49-5.81c-2.08 1.39-4.74 2.21-8.42 2.21-6.26 0-11.57-3.88-13.46-9.41l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </svg>
        {COPY.google[lang]}
      </a>

      
        href={registerHref}
        className="mb-4 flex w-full items-center justify-center rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
      >
        {COPY.email[lang]}
      </a>

      <p className="mb-4 text-center text-sm text-gray-500">
        {COPY.login[lang]}{' '}
        <a href={loginHref} className="font-medium text-gray-900 underline underline-offset-2">
          {COPY.loginLink[lang]}
        </a>
      </p>

      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mx-auto block text-xs text-gray-400 underline underline-offset-2 hover:text-gray-600"
        >
          {COPY.back[lang]}
        </button>
      )}
    </div>
  );
}