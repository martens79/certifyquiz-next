"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { apiFetch } from "@/lib/auth";
import type { Locale } from "@/lib/i18n";

type InboxItem = {
  id: number;
  title: string;
  body: string;
  url: string;
  image: string | null;
  created_at: string;
  read_at: string | null;
};

const labels = {
  it: { title: "Notifiche", empty: "Nessuna notifica", all: "Segna tutte come lette" },
  en: { title: "Notifications", empty: "No notifications", all: "Mark all as read" },
  fr: { title: "Notifications", empty: "Aucune notification", all: "Tout marquer comme lu" },
  es: { title: "Notificaciones", empty: "No hay notificaciones", all: "Marcar todo como leído" },
};

export default function NotificationBell({ lang }: { lang: Locale }) {
  const [items, setItems] = useState<InboxItem[]>([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<InboxItem | null>(null);
  const initialized = useRef(false);
  const newestId = useRef(0);
  const root = useRef<HTMLDivElement | null>(null);
  const t = labels[lang];

  const load = useCallback(async () => {
    try {
      const response = await apiFetch("/push/inbox");
      if (!response.ok) return;
      const data = (await response.json()) as { items: InboxItem[]; unread: number };
      const nextNewest = data.items[0]?.id || 0;
      if (initialized.current && nextNewest > newestId.current && data.items[0]?.read_at == null) {
        setToast(data.items[0]);
      }
      newestId.current = Math.max(newestId.current, nextNewest);
      initialized.current = true;
      setItems(data.items);
      setUnread(data.unread);
    } catch {
      // Il centro notifiche è un fallback e non deve interferire con la pagina.
    }
  }, []);

  useEffect(() => {
    load();
    const timer = window.setInterval(load, 30000);
    const onVisible = () => { if (document.visibilityState === "visible") load(); };
    const onMessage = (event: MessageEvent) => { if (event.data?.type === "CQ_PUSH_RECEIVED") load(); };
    document.addEventListener("visibilitychange", onVisible);
    navigator.serviceWorker?.addEventListener("message", onMessage);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
      navigator.serviceWorker?.removeEventListener("message", onMessage);
    };
  }, [load]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 7000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (open && root.current && !root.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  async function read(item: InboxItem) {
    if (!item.read_at) {
      await apiFetch(`/push/inbox/${item.id}/read`, { method: "POST", body: "{}" }).catch(() => undefined);
      setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, read_at: new Date().toISOString() } : entry));
      setUnread((value) => Math.max(0, value - 1));
    }
    setOpen(false);
    window.location.href = item.url;
  }

  async function readAll() {
    await apiFetch("/push/inbox/read-all", { method: "POST", body: "{}" }).catch(() => undefined);
    setItems((current) => current.map((item) => ({ ...item, read_at: item.read_at || new Date().toISOString() })));
    setUnread(0);
  }

  return (
    <div ref={root} className="relative mr-2">
      <button type="button" onClick={() => setOpen((value) => !value)} className="relative grid h-10 w-10 place-items-center rounded-full border border-slate-300 bg-white hover:bg-slate-50" aria-label={t.title} aria-expanded={open}>
        <span aria-hidden className="text-lg">🔔</span>
        {unread > 0 && <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-red-600 px-1 text-center text-[11px] font-bold leading-5 text-white">{unread > 99 ? "99+" : unread}</span>}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-[70] w-[min(360px,calc(100vw-24px))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b px-4 py-3"><strong>{t.title}</strong>{unread > 0 && <button type="button" onClick={readAll} className="text-xs font-semibold text-blue-700 hover:underline">{t.all}</button>}</div>
          <div className="max-h-[420px] overflow-y-auto">
            {items.length === 0 ? <p className="p-5 text-sm text-slate-500">{t.empty}</p> : items.map((item) => (
              <button key={item.id} type="button" onClick={() => read(item)} className={`block w-full border-b px-4 py-3 text-left hover:bg-slate-50 ${item.read_at ? "bg-white" : "bg-blue-50/70"}`}>
                <span className="block text-sm font-bold text-slate-900">{item.title}</span><span className="mt-1 block text-sm text-slate-600">{item.body}</span><span className="mt-1 block text-xs text-slate-400">{new Date(item.created_at).toLocaleString(lang)}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {toast && (
        <button type="button" onClick={() => read(toast)} className="fixed bottom-20 right-4 z-[100] w-[min(380px,calc(100vw-32px))] rounded-2xl border border-blue-200 bg-white p-4 text-left shadow-2xl">
          <span className="block text-sm font-bold text-slate-900">🔔 {toast.title}</span><span className="mt-1 block text-sm text-slate-600">{toast.body}</span>
        </button>
      )}
    </div>
  );
}
