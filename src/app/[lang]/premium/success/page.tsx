"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider"; // <-- adatta se serve

const COPY: Record<string, any> = {
  it: {
    weeklyDesc: "Checkout completato. Verifica nel profilo lo stato confermato, l’eventuale prova gratuita e la data del prossimo addebito.",
    title: "Checkout completato",
    monthlyDesc: "Checkout completato. Verifica nel profilo lo stato confermato, l’eventuale prova gratuita e la data del prossimo addebito.",
    annualDesc: "Checkout completato. Verifica nel profilo lo stato confermato, l’eventuale prova gratuita e la data del prossimo addebito.",
    quiz: "Vai ai quiz",
    home: "Torna alla home",
  },
  fr: {
    weeklyDesc: "Checkout terminé. Vérifiez dans votre profil le statut confirmé, l’éventuel essai gratuit et la date du prochain débit.",
    title: "Checkout terminé",
    monthlyDesc: "Checkout terminé. Vérifiez dans votre profil le statut confirmé, l’éventuel essai gratuit et la date du prochain débit.",
    annualDesc: "Checkout terminé. Vérifiez dans votre profil le statut confirmé, l’éventuel essai gratuit et la date du prochain débit.",
    quiz: "Aller aux quiz",
    home: "Retour à l’accueil",
  },
  es: {
    weeklyDesc: "Checkout completado. Comprueba en tu perfil el estado confirmado, la posible prueba gratuita y la fecha del próximo cobro.",
    title: "Checkout completado",
    monthlyDesc: "Checkout completado. Comprueba en tu perfil el estado confirmado, la posible prueba gratuita y la fecha del próximo cobro.",
    annualDesc: "Checkout completado. Comprueba en tu perfil el estado confirmado, la posible prueba gratuita y la fecha del próximo cobro.",
    quiz: "Ir a los quiz",
    home: "Volver al inicio",
  },
};

export default function PremiumSuccessLangPage() {
  const { lang } = useParams() as { lang: string };
  const searchParams = useSearchParams();
  const isMonthly = searchParams.get("plan") !== "premium_annual";
  const isWeekly = searchParams.get("plan") === "premium_weekly";
  const t = COPY[lang] ?? COPY.it;

  const { refreshMe } = useAuth();
  const [sync, setSync] = useState<"idle" | "ok" | "fail">("idle");

  useEffect(() => {
    (async () => {
      try {
        setSync("idle");
        await refreshMe();
        setSync("ok");
      } catch {
        setSync("fail");
      }
    })();
  }, [refreshMe]);



  return (
    <main className="mx-auto max-w-2xl px-6 py-16 text-center">
      <h1 className="text-3xl font-bold">{t.title}</h1>
      <p className="mt-4 text-gray-600">{isWeekly ? t.weeklyDesc : isMonthly ? t.monthlyDesc : t.annualDesc}</p>

      <p className="mt-6 text-sm text-gray-500">
        {sync === "idle" && "Sincronizzazione Premium..."}
        {sync === "ok" && "Premium sincronizzato ✅"}
        {sync === "fail" && "Sync fallito. Prova a ricaricare la pagina."}
      </p>

      <div className="mt-10 flex flex-col gap-3">
        <Link className="rounded-lg bg-black px-6 py-3 text-white" href={`/${lang}/quiz-home`}>
          {t.quiz}
        </Link>
        <Link className="rounded-lg border px-6 py-3" href={`/${lang}`}>
          {t.home}
        </Link>
      </div>
    </main>
  );
}
