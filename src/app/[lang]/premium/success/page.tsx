"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider"; // <-- adatta se serve

const COPY: Record<string, any> = {
  it: {
    title: "Premium attivato",
    desc: "Prova attiva. Ora puoi accedere alle funzionalità Premium.",
    quiz: "Vai ai quiz",
    home: "Torna alla home",
  },
  fr: {
    title: "Premium activé",
    desc: "Essai actif. Vous avez maintenant accès aux fonctionnalités Premium.",
    quiz: "Aller aux quiz",
    home: "Retour à l’accueil",
  },
  es: {
    title: "Premium activado",
    desc: "Prueba activa. Ahora tienes acceso a las funciones Premium.",
    quiz: "Ir a los quiz",
    home: "Volver al inicio",
  },
};

export default function PremiumSuccessLangPage() {
  const { lang } = useParams() as { lang: string };
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
      <p className="mt-4 text-gray-600">{t.desc}</p>

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