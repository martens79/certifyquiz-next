"use client";

import { useEffect, useMemo, useState } from "react";

type Locale = "it" | "en" | "fr" | "es";

const STORAGE_FIRST_SEEN = "cq:freepromo:firstSeenAt";
const STORAGE_LAST_SHOWN = "cq:freepromo:lastShownAt";
const DAY_MS = 24 * 60 * 60 * 1000;

function safeNum(v: string | null) {
  const n = v ? Number(v) : NaN;
  return Number.isFinite(n) ? n : null;
}

export default function FreeLimitedTimePopup({ lang }: { lang: Locale }) {
  const [open, setOpen] = useState(false);

  const t = useMemo(() => {
    const dict = {
      it: {
        title: "Tutto gratis (tempo limitato)",
        body:
          "In questo periodo di test, quiz e spiegazioni Premium sono disponibili gratuitamente. Questa promo è temporanea: approfittane ora.",
        cta: "Ok, ho capito",
        foot: "Mostrato al massimo 1 volta al giorno.",
      },
      en: {
        title: "Everything is free (limited time)",
        body:
          "During this testing period, quizzes and Premium explanations are temporarily free. This promo won't last forever—use it now.",
        cta: "Got it",
        foot: "Shown at most once per day.",
      },
      fr: {
        title: "Tout est gratuit (temps limité)",
        body:
          "Pendant cette phase de test, les quiz et les explications Premium sont gratuits. Promo temporaire : profitez-en maintenant.",
        cta: "J’ai compris",
        foot: "Affiché au maximum 1 fois par jour.",
      },
      es: {
        title: "Todo gratis (tiempo limitado)",
        body:
          "Durante este periodo de prueba, los quizzes y las explicaciones Premium son gratis. Es una promo temporal: aprovecha ahora.",
        cta: "Entendido",
        foot: "Se muestra como máximo 1 vez al día.",
      },
    } satisfies Record<Locale, { title: string; body: string; cta: string; foot: string }>;

    return dict[lang] ?? dict.it;
  }, [lang]);

  useEffect(() => {
    // Build-safe + SSR-safe: client only
    try {
      const now = Date.now();

      const firstSeen = safeNum(localStorage.getItem(STORAGE_FIRST_SEEN));
      const lastShown = safeNum(localStorage.getItem(STORAGE_LAST_SHOWN));

      // 1) Non mostrare MAI al primo ingresso assoluto:
      if (!firstSeen) {
        localStorage.setItem(STORAGE_FIRST_SEEN, String(now));
        return;
      }

      // 2) Mostra max 1 volta ogni 24h:
      if (!lastShown || now - lastShown >= DAY_MS) {
        setOpen(true);
        localStorage.setItem(STORAGE_LAST_SHOWN, String(now));
      }
    } catch {
      // se localStorage non disponibile, non bloccare l'app: semplicemente non mostrare
    }
  }, []);

  // Chiudi con ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-black/10 overflow-hidden">
        <div className="p-5 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-lg font-semibold leading-snug">{t.title}</h2>
            <button
              onClick={() => setOpen(false)}
              className="text-sm px-2 py-1 rounded-md hover:bg-black/5"
              aria-label="Close"
              title="Close"
            >
              ✕
            </button>
          </div>

          <p className="text-sm text-black/75 leading-relaxed">{t.body}</p>

          <div className="pt-2 flex items-center justify-between gap-3">
            <p className="text-xs text-black/45">{t.foot}</p>
            <button
              onClick={() => setOpen(false)}
              className="text-sm font-medium px-4 py-2 rounded-xl bg-black text-white hover:opacity-90"
            >
              {t.cta}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
