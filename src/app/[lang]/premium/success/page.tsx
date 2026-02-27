"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

const COPY: Record<string, any> = {
  it: {
    title: "Premium attivato 🎉",
    subtitle: "La tua prova gratuita di 7 giorni è iniziata.",
    desc: "Ora hai accesso completo a spiegazioni e funzionalità Premium.",
    quiz: "Vai ai quiz",
    home: "Torna alla home",
  },
  fr: {
    title: "Premium activé 🎉",
    subtitle: "Votre essai gratuit de 7 jours a commencé.",
    desc: "Vous avez maintenant accès complet aux explications et fonctionnalités Premium.",
    quiz: "Aller aux quiz",
    home: "Retour à l’accueil",
  },
  es: {
    title: "Premium activado 🎉",
    subtitle: "Tu prueba gratuita de 7 días ha comenzado.",
    desc: "Ahora tienes acceso completo a explicaciones y funciones Premium.",
    quiz: "Ir a los quiz",
    home: "Volver al inicio",
  },
};

export default function PremiumSuccessLangPage() {
  const { lang } = useParams() as { lang: string };
  const t = COPY[lang] ?? COPY.it;

  return (
    <div className="max-w-2xl mx-auto py-20 px-6 text-center">
      <h1 className="text-3xl font-bold mb-6">{t.title}</h1>
      <p className="mb-4 text-lg">{t.subtitle}</p>
      <p className="mb-10 text-gray-600">{t.desc}</p>

      <div className="flex flex-col gap-4">
        <Link href={`/${lang}/quiz`} className="bg-black text-white px-6 py-3 rounded-lg">
          {t.quiz}
        </Link>
        <Link href={`/${lang}`} className="border px-6 py-3 rounded-lg">
          {t.home}
        </Link>
      </div>
    </div>
  );
}