"use client";
import { useCallback, useEffect, useState } from "react";
import { authFetch, backendUrl } from "@/lib/auth";

export function urlBase64ToUint8Array(value: string) {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const base64 = (value + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  return Uint8Array.from([...raw].map((char) => char.charCodeAt(0)));
}

export function usePushNotifications(language: "it" | "en" | "fr" | "es", certificationId?: number | null) {
  const [isSupported, setSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSubscribed, setSubscribed] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshStatus = useCallback(async () => {
    const supported = typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
    setSupported(supported);
    if (!supported) return;
    setPermission(Notification.permission);
    const registration = await navigator.serviceWorker.ready;
    setSubscribed(!!(await registration.pushManager.getSubscription()));
    setError(null);
  }, []);

  useEffect(() => { refreshStatus().catch(() => setError("STATUS_FAILED")); }, [refreshStatus]);

  const subscribe = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      if (!isSupported) throw new Error("UNSUPPORTED");
      const granted = await Notification.requestPermission();
      setPermission(granted);
      if (granted !== "granted") throw new Error("PERMISSION_DENIED");
      const registration = await navigator.serviceWorker.ready;
      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        const keyResponse = await fetch(backendUrl("/push/public-key"));
        if (!keyResponse.ok) throw new Error("CONFIG_FAILED");
        const { publicKey } = await keyResponse.json();
        subscription = await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(publicKey) });
      }
      const response = await authFetch(backendUrl("/push/subscribe"), { method: "POST", body: JSON.stringify({ subscription: subscription.toJSON(), language, certificationId: certificationId ?? null }) });
      if (!response.ok) throw new Error("SYNC_FAILED");
      setSubscribed(true);
      // La conferma locale è best-effort: un blocco del sistema operativo non
      // deve annullare una subscription Web Push creata e sincronizzata.
      try {
        await registration.showNotification("CertifyQuiz", {
          body: language === "it" ? "Notifiche attivate correttamente." : language === "fr" ? "Notifications activées avec succès." : language === "es" ? "Notificaciones activadas correctamente." : "Notifications enabled successfully.",
          icon: "/icons/icon-192.png",
          badge: "/icons/icon-192.png",
          tag: "push-enabled",
          data: { url: `/${language === "en" ? "" : language + "/"}profile` },
        });
      } catch {
        // Subscription valida: la consegna remota continuerà a funzionare.
      }
    } catch (e) { setError(e instanceof Error ? e.message : "SUBSCRIBE_FAILED"); }
    finally { setLoading(false); }
  }, [certificationId, isSupported, language]);

  const unsubscribe = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        const response = await authFetch(backendUrl("/push/unsubscribe"), { method: "POST", body: JSON.stringify({ endpoint: subscription.endpoint }) });
        if (!response.ok) throw new Error("SYNC_FAILED");
        await subscription.unsubscribe();
      }
      setSubscribed(false);
    } catch (e) { setError(e instanceof Error ? e.message : "UNSUBSCRIBE_FAILED"); }
    finally { setLoading(false); }
  }, []);

  return { isSupported, permission, isSubscribed, isLoading, error, subscribe, unsubscribe, refreshStatus };
}
