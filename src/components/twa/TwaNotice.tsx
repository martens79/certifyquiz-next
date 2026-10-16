"use client";

import Link from "next/link";
import type { TwaLocale } from "@/lib/twa";

type Variant = "section" | "guide";

const COPY: Record<TwaLocale, Record<Variant, { title: string; body: string }> & { home: string }> = {
  it: {
    section: {
      title: "Sezione non disponibile nell'app",
      body: "Questa sezione non è disponibile nell'app Android. Quiz, simulazioni d'esame, ripassi e progressi restano a tua disposizione con il tuo account.",
    },
    guide: {
      title: "Guida riservata",
      body: "Questa guida è riservata agli utenti con accesso attivo. Accedi con il tuo account per verificare il tuo accesso.",
    },
    home: "Torna alla home",
  },
  en: {
    section: {
      title: "Not available in the app",
      body: "This section isn't available in the Android app. Quizzes, mock exams, reviews and your progress remain available with your account.",
    },
    guide: {
      title: "Restricted guide",
      body: "This guide is reserved for users with active access. Sign in with your account to check your access.",
    },
    home: "Back to home",
  },
  fr: {
    section: {
      title: "Section indisponible dans l'application",
      body: "Cette section n'est pas disponible dans l'application Android. Quiz, examens blancs, révisions et progression restent disponibles avec votre compte.",
    },
    guide: {
      title: "Guide réservé",
      body: "Ce guide est réservé aux utilisateurs disposant d'un accès actif. Connectez-vous avec votre compte pour vérifier votre accès.",
    },
    home: "Retour à l'accueil",
  },
  es: {
    section: {
      title: "Sección no disponible en la app",
      body: "Esta sección no está disponible en la app de Android. Los cuestionarios, simulacros, repasos y tu progreso siguen disponibles con tu cuenta.",
    },
    guide: {
      title: "Guía reservada",
      body: "Esta guía está reservada a usuarios con acceso activo. Inicia sesión con tu cuenta para comprobar tu acceso.",
    },
    home: "Volver al inicio",
  },
};

/**
 * Avviso neutro mostrato nell'app Android al posto delle superfici di acquisto.
 * Nessun prezzo, nessun invito ad acquistare, nessun link verso pagine di pagamento.
 */
export default function TwaNotice({
  lang,
  variant = "section",
  overlay = false,
  homeHref,
}: {
  lang: TwaLocale;
  variant?: Variant;
  overlay?: boolean;
  homeHref?: string;
}) {
  const t = COPY[lang] ?? COPY.en;
  const copy = t[variant];
  const href = homeHref ?? (lang === "en" ? "/" : `/${lang}`);

  const card = (
    <div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-6 text-center text-gray-900 shadow-sm">
      <h2 className="text-lg font-semibold">{copy.title}</h2>
      <p className="mt-2 text-sm text-gray-600">{copy.body}</p>
      <Link
        href={href}
        className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-gray-900 px-4 text-sm font-semibold text-white"
      >
        {t.home}
      </Link>
    </div>
  );

  if (!overlay) return <div className="px-4 py-10">{card}</div>;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-auto bg-white px-4 py-10" role="alert">
      {card}
    </div>
  );
}
