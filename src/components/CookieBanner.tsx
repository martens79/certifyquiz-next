"use client";
import { usePathname } from "next/navigation";
import { langFromPathname } from "@/lib/i18n";
import { useConsent } from "@/components/analytics/ConsentProvider";

const COPY = {
  it: { message: "Usiamo cookie tecnici e, con il tuo consenso, cookie Analytics. Questa scelta non autorizza finalità pubblicitarie.", reject: "Rifiuta", accept: "Accetta Analytics" },
  en: { message: "We use essential cookies and, with your consent, analytics cookies. This choice does not authorize advertising purposes.", reject: "Reject", accept: "Accept analytics" },
  fr: { message: "Nous utilisons des cookies essentiels et, avec votre consentement, des cookies de mesure d’audience. Ce choix n’autorise pas les finalités publicitaires.", reject: "Refuser", accept: "Accepter les statistiques" },
  es: { message: "Usamos cookies esenciales y, con tu consentimiento, cookies de analítica. Esta elección no autoriza fines publicitarios.", reject: "Rechazar", accept: "Aceptar analítica" },
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
