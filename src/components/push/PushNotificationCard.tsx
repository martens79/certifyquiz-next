"use client";
import { usePushNotifications } from "@/hooks/usePushNotifications";

const copy = {
  it: ["Ricevi promemoria utili", "Attiva le notifiche per nuovi quiz, guide, mappe e promemoria di studio.", "Attiva notifiche", "Notifiche attive", "Disattiva"],
  en: ["Get useful reminders", "Enable notifications for new quizzes, guides, maps and study reminders.", "Enable notifications", "Notifications active", "Disable"],
  fr: ["Recevez des rappels utiles", "Activez les notifications pour les nouveaux quiz, guides, cartes et rappels d’étude.", "Activer les notifications", "Notifications actives", "Désactiver"],
  es: ["Recibe recordatorios útiles", "Activa las notificaciones para nuevos cuestionarios, guías, mapas y recordatorios de estudio.", "Activar notificaciones", "Notificaciones activas", "Desactivar"],
} as const;

export default function PushNotificationCard({ lang }: { lang: "it" | "en" | "fr" | "es" }) {
  const push = usePushNotifications(lang);
  const t = copy[lang];
  const ios = typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window.navigator as Navigator & { standalone?: boolean }).standalone;
  return <section className="rounded-2xl bg-white shadow ring-1 ring-black/5 p-4" aria-labelledby="push-title">
    <h2 id="push-title" className="text-lg font-semibold">🔔 {t[0]}</h2>
    <p className="mt-2 text-sm text-slate-600">{t[1]}</p>
    {!push.isSupported && <p className="mt-2 text-sm text-amber-700">{ios ? "Su iPhone/iPad aggiungi prima CertifyQuiz alla schermata Home." : "Le notifiche push non sono supportate in questo browser."}</p>}
    {push.permission === "denied" && <p className="mt-2 text-sm text-amber-700">Riattiva le notifiche dalle impostazioni del browser.</p>}
    {push.error && push.permission !== "denied" && <p className="mt-2 text-sm text-red-700">Impossibile aggiornare le notifiche. Riprova.</p>}
    <div className="mt-3 flex items-center gap-3">
      <button type="button" disabled={push.isLoading || !push.isSupported || push.permission === "denied"} onClick={push.isSubscribed ? push.unsubscribe : push.subscribe} className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">
        {push.isLoading ? "…" : push.isSubscribed ? t[4] : t[2]}
      </button>
      {push.isSubscribed && <span className="text-sm font-semibold text-emerald-700">{t[3]}</span>}
    </div>
  </section>;
}
