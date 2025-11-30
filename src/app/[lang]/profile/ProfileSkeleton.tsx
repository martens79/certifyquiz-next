"use client";
import type { FC } from "react";
type Lang = "it" | "en" | "fr" | "es";

const TXT: Record<Lang, string> = {
  it: "Caricamento profilo…",
  en: "Loading profile…",
  fr: "Chargement du profil…",
  es: "Cargando perfil…",
};

const ProfileSkeleton: FC<{ lang: Lang }> = ({ lang }) => (
  <div className="min-h-screen flex items-center justify-center text-lg">
    <div className="animate-pulse rounded-xl border px-6 py-4 bg-white/70">
      {TXT[lang] ?? TXT.it}
    </div>
  </div>
);

export default ProfileSkeleton;
