"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

const COPY: Record<string, any> = {
  it: {
    title: "Pagamento annullato",
    desc: "La sottoscrizione non è stata attivata.",
    retry: "Riprova",
    home: "Torna alla home",
  },
  fr: {
    title: "Paiement annulé",
    desc: "L’abonnement n’a pas été activé.",
    retry: "Réessayer",
    home: "Retour à l’accueil",
  },
  es: {
    title: "Pago cancelado",
    desc: "La suscripción no se activó.",
    retry: "Intentar de nuevo",
    home: "Volver al inicio",
  },
};

export default function PremiumCancelLangPage() {
  const { lang } = useParams() as { lang: string };
  const t = COPY[lang] ?? COPY.it;

  return (
    <div className="max-w-2xl mx-auto py-20 px-6 text-center">
      <h1 className="text-3xl font-bold mb-6">{t.title}</h1>
      <p className="mb-10 text-gray-600">{t.desc}</p>

      <div className="flex flex-col gap-4">
        <Link href={`/${lang}/prezzi`} className="bg-black text-white px-6 py-3 rounded-lg">
          {t.retry}
        </Link>
        <Link href={`/${lang}`} className="border px-6 py-3 rounded-lg">
          {t.home}
        </Link>
      </div>
    </div>
  );
}