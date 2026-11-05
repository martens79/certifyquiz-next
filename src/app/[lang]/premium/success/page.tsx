"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider"; // <-- adatta se serve

const COPY: Record<string, any> = {
  it: {
    weeklyDesc: "Piano scelto: Premium settimanale, 3,99€ con rinnovo automatico ogni 7 giorni. Verifica lo stato dell’abbonamento nel tuo profilo.",
    title: "Premium attivato",
    monthlyDesc: "La prova gratuita di 7 giorni è attiva. Ora puoi accedere alle funzionalità Premium.",
    annualDesc: "Il piano Premium annuale è attivo. Sono stati addebitati 59,90€ per 12 mesi.",
    quiz: "Vai ai quiz",
    home: "Torna alla home",
  },
  fr: {
    weeklyDesc: "Offre choisie : Premium hebdomadaire, 3,99€ avec renouvellement automatique tous les 7 jours. Vérifiez son statut dans votre profil.",
    title: "Premium activé",
    monthlyDesc: "Votre essai gratuit de 7 jours est actif. Vous avez maintenant accès aux fonctionnalités Premium.",
    annualDesc: "Votre abonnement Premium annuel est actif. 59,90€ ont été débités pour 12 mois.",
    quiz: "Aller aux quiz",
    home: "Retour à l’accueil",
  },
  es: {
    weeklyDesc: "Plan elegido: Premium semanal, 3,99€ con renovación automática cada 7 días. Comprueba el estado en tu perfil.",
    title: "Premium activado",
    monthlyDesc: "Tu prueba gratuita de 7 días está activa. Ahora tienes acceso a las funciones Premium.",
    annualDesc: "Tu plan Premium anual está activo. Se han cobrado 59,90€ por 12 meses.",
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
