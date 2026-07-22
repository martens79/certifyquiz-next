"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/paths";
import { apiFetch } from "@/lib/auth";
import { useAuth } from "@/components/auth/AuthProvider";
import GuideAccessGate from "./GuideAccessGate";

type Props = {
  lang: Locale;
  slug: string;
  price: number;
};

const COPY = {
  download: {
    it: "Scarica il PDF",
    en: "Download PDF",
    fr: "Télécharger le PDF",
    es: "Descargar PDF",
  },
  downloading: {
    it: "Download in corso…",
    en: "Downloading…",
    fr: "Téléchargement…",
    es: "Descargando…",
  },
  error: {
    it: "Download non riuscito. Riprova.",
    en: "Download failed. Please try again.",
    fr: "Échec du téléchargement. Réessayez.",
    es: "Error al descargar. Inténtalo de nuevo.",
  },
  checking: {
    it: "Verifica accesso…",
    en: "Checking access…",
    fr: "Vérification…",
    es: "Verificando acceso…",
  },
} as const;

const ACCESS_BADGE_COPY = {
  premium: {
    it: "✅ Incluso nel tuo Premium",
    en: "✅ Included in your Premium",
    fr: "✅ Inclus dans votre Premium",
    es: "✅ Incluido en tu Premium",
  },
  purchased: {
    it: "✅ Guida acquistata",
    en: "✅ Guide purchased",
    fr: "✅ Guide acheté",
    es: "✅ Guía comprada",
  },
} as const;

export default function GuideDownloadPanel({ lang, slug, price }: Props) {
  const { loading: authLoading, user } = useAuth();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [accessReason, setAccessReason] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      if (!user) {
        if (!cancelled) setHasAccess(false);
        return;
      }

      try {
        const res = await apiFetch(`/guides/${encodeURIComponent(slug)}?lang=${lang}`);
        const json = await res.json().catch(() => null);
        if (!cancelled) {
          setHasAccess(!!json?.guide?.hasAccess);
          setAccessReason(json?.guide?.accessReason ?? null);
        }
      } catch {
        if (!cancelled) setHasAccess(false);
      }
    }

    if (!authLoading) check();

    return () => {
      cancelled = true;
    };
  }, [authLoading, user, slug, lang]);

  async function handleDownload() {
    setError(null);
    setDownloading(true);

    try {
      const res = await apiFetch(`/guides/${encodeURIComponent(slug)}/download?lang=${lang}`);
      if (!res.ok) throw new Error("download_failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${slug}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setError(COPY.error[lang]);
    } finally {
      setDownloading(false);
    }
  }

  if (authLoading || hasAccess === null) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-500 shadow-sm">
        {COPY.checking[lang]}
      </div>
    );
  }

  if (!hasAccess) {
    return <GuideAccessGate lang={lang} slug={slug} price={price} />;
  }

  const badgeCopy =
    accessReason === "premium" || accessReason === "purchased"
      ? ACCESS_BADGE_COPY[accessReason][lang]
      : null;

  return (
    <div className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-8">
      {badgeCopy && (
        <p className="mb-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
          {badgeCopy}
        </p>
      )}

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      <button
        type="button"
        onClick={handleDownload}
        disabled={downloading}
        className="flex w-full items-center justify-center rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {downloading ? COPY.downloading[lang] : COPY.download[lang]}
      </button>
    </div>
  );
}
