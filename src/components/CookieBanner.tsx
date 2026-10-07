"use client";
import { usePathname } from "next/navigation";
import { langFromPathname } from "@/lib/i18n";
import { useConsent } from "@/components/analytics/ConsentProvider";

const COPY = {
  it: { message: "Usiamo cookie tecnici e opzionali per migliorare l’esperienza.", reject: "Rifiuta", accept: "Accetta" },
  en: { message: "We use essential and optional cookies to improve your experience.", reject: "Reject", accept: "Accept" },
  fr: { message: "Nous utilisons des cookies essentiels et facultatifs pour améliorer votre expérience.", reject: "Refuser", accept: "Accepter" },
  es: { message: "Usamos cookies esenciales y opcionales para mejorar tu experiencia.", reject: "Rechazar", accept: "Aceptar" },
};

export default function CookieBanner() {
  const { status, ready, setConsent } = useConsent();
  const t = COPY[langFromPathname(usePathname())];
  if (!ready || status !== "unknown") return null;
  return (
    <div data-cq-notice className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] left-4 right-4 md:bottom-4 md:right-24 rounded-2xl shadow p-4 bg-white border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 z-[10000]">
      <p className="text-sm">{t.message}</p>
      <div className="flex shrink-0 gap-2">
        <button onClick={() => setConsent(false)} className="min-h-11 px-3 py-2 border rounded-xl">{t.reject}</button>
        <button onClick={() => setConsent(true)} className="min-h-11 px-3 py-2 border rounded-xl">{t.accept}</button>
      </div>
    </div>
  );
}
