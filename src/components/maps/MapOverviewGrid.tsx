"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/paths";
import { pricingPath } from "@/lib/paths";
import type { MapOverviewItem } from "@/lib/data";
import { apiFetch } from "@/lib/auth";
import { useAuth } from "@/components/auth/AuthProvider";
import { trackEvent, userStatusFrom, type UserStatus } from "@/lib/analytics";

/** Item arricchito lato server col logo preso dal registry certificazioni */
export type MapCardItem = MapOverviewItem & { imageUrl: string | null };

type Props = {
  lang: Locale;
  items: MapCardItem[];
};

const LABELS = {
  it: {
    badge: "CertifyQuiz Mappe",
    title: "Mappe concettuali PDF",
    subtitle:
      "Mappe concettuali scaricabili in PDF per fissare i concetti chiave delle certificazioni: anteprima gratuita, versione completa inclusa in Premium.",
    search: "Cerca certificazione o mappa...",
    empty:
      "Non ci sono ancora mappe pubblicate. Stiamo lavorando alle prime: torna a trovarci a breve.",
    noResults: "Nessun risultato trovato.",
    count: "mappe",
    premium: "Premium",
    pages: "pp.",
    maps: "mappe",
    preview: "Anteprima gratuita",
    download: "Scarica il PDF",
    downloading: "Download in corso…",
    downloadError: "Download non riuscito. Riprova.",
    unlock: "Sblocca con Premium",
    italianOnly: "",
  },
  en: {
    badge: "CertifyQuiz Maps",
    title: "PDF concept maps",
    subtitle:
      "Downloadable PDF concept maps to lock in the key ideas of each certification: free preview, full version included in Premium.",
    search: "Search certification or map...",
    empty:
      "No maps published yet. The first ones are on their way — check back soon.",
    noResults: "No results found.",
    count: "maps",
    premium: "Premium",
    pages: "pp.",
    maps: "maps",
    preview: "Free preview",
    download: "Download PDF",
    downloading: "Downloading…",
    downloadError: "Download failed. Please try again.",
    unlock: "Unlock with Premium",
    italianOnly: "🇮🇹 Currently in Italian only",
  },
  fr: {
    badge: "CertifyQuiz Cartes",
    title: "Cartes conceptuelles PDF",
    subtitle:
      "Cartes conceptuelles PDF téléchargeables pour ancrer les notions clés de chaque certification : aperçu gratuit, version complète incluse dans Premium.",
    search: "Rechercher une certification ou une carte...",
    empty:
      "Aucune carte publiée pour le moment. Les premières arrivent bientôt.",
    noResults: "Aucun résultat trouvé.",
    count: "cartes",
    premium: "Premium",
    pages: "pp.",
    maps: "cartes",
    preview: "Aperçu gratuit",
    download: "Télécharger le PDF",
    downloading: "Téléchargement…",
    downloadError: "Échec du téléchargement. Réessayez.",
    unlock: "Débloquer avec Premium",
    italianOnly: "🇮🇹 Disponible uniquement en italien pour l'instant",
  },
  es: {
    badge: "CertifyQuiz Mapas",
    title: "Mapas conceptuales PDF",
    subtitle:
      "Mapas conceptuales en PDF descargables para fijar las ideas clave de cada certificación: vista previa gratuita, versión completa incluida en Premium.",
    search: "Buscar certificación o mapa...",
    empty:
      "Todavía no hay mapas publicados. Los primeros están en camino: vuelve pronto.",
    noResults: "No se encontraron resultados.",
    count: "mapas",
    premium: "Premium",
    pages: "pp.",
    maps: "mapas",
    preview: "Vista previa gratuita",
    download: "Descargar PDF",
    downloading: "Descargando…",
    downloadError: "Error al descargar. Inténtalo de nuevo.",
    unlock: "Desbloquear con Premium",
    italianOnly: "🇮🇹 Por ahora solo en italiano",
  },
} as const;

/**
 * Base comune ai tre CTA della card: stessa altezza (il bordo è sempre
 * presente, trasparente dove non serve, così i bottoni impilati si allineano)
 * e tap target di 44px come da linee guida mobile.
 */
const ACTION_BASE =
  "inline-flex min-h-[44px] items-center justify-center rounded-xl border px-4 py-2 text-center text-sm font-semibold transition";

function MapCard({
  lang,
  item,
  access,
  userStatus,
  userEmail,
}: {
  lang: Locale;
  item: MapCardItem;
  access: MapOverviewItem["access"];
  userStatus: UserStatus;
  userEmail: string | null;
}) {
  const t = LABELS[lang];
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const previewHref = `/api/backend/maps/${encodeURIComponent(
    item.slug
  )}/preview?lang=${lang}`;

  const trackMapEvent = (eventName: string) =>
    trackEvent(eventName, {
      certification_slug: item.certification_slug,
      map_slug: item.slug,
      language: lang,
      user_status: userStatus,
      source: "maps_page",
      resource_type: "map",
    });

  function handlePreviewClick() {
    trackMapEvent("study_map_preview_clicked");
  }

  function handleLockedClick() {
    trackMapEvent("study_map_locked_clicked");

    // ✅ Tracking click Premium nel funnel (DB), oltre a GA4 sopra
    fetch("/api/backend/funnel-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "premium_clicked_map_locked",
        email: userEmail,
        cert_slug: item.certification_slug,
        topic_slug: null,
        lang,
      }),
    }).catch(console.error);
  }

  async function handleDownload() {
    trackMapEvent("study_map_download_clicked");
    setError(null);
    setDownloading(true);

    try {
      const res = await apiFetch(
        `/maps/${encodeURIComponent(item.slug)}/download?lang=${lang}`
      );

      if (!res.ok) throw new Error("download_failed");

      const blob = await res.blob();
      if (!blob.size) throw new Error("empty_pdf");

      const pdfBlob =
        blob.type === "application/pdf"
          ? blob
          : new Blob([blob], { type: "application/pdf" });

      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `${item.slug}.pdf`;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (err) {
      console.error("Map PDF download failed:", err);
      setError(t.downloadError);
    } finally {
      setDownloading(false);
    }
  }

  const meta = [
    item.map_count ? `${item.map_count} ${t.maps}` : null,
    item.page_count ? `${item.page_count} ${t.pages}` : null,
  ].filter(Boolean);

  return (
    <article className="flex flex-col rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-50 to-white p-4 shadow-sm transition hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 shrink-0 rounded-lg bg-white object-contain p-0.5"
            />
          ) : null}
          <p
            className="truncate text-xs font-semibold text-slate-500"
            title={item.certification_name}
          >
            {item.certification_name}
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">
          ⭐ {t.premium}
        </span>
      </div>

      <h2
        className="mb-2 line-clamp-2 text-lg font-extrabold text-slate-950"
        title={item.title}
      >
        {item.title}
      </h2>

      {item.description ? (
        <p className="mb-3 line-clamp-3 text-sm leading-5 text-slate-600">
          {item.description}
        </p>
      ) : null}

      {lang !== "it" && !item.lang_available && t.italianOnly ? (
        <p className="mb-2 inline-flex w-fit rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
          {t.italianOnly}
        </p>
      ) : null}

      {meta.length > 0 ? (
        <p className="mb-3 text-xs font-semibold text-slate-500">
          {meta.join(" · ")}
        </p>
      ) : null}

      {error ? <p className="mb-2 text-xs text-red-600">{error}</p> : null}

      <div className="mt-auto flex flex-col gap-2 pt-2">
        <a
          href={previewHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handlePreviewClick}
          className={`${ACTION_BASE} border-slate-300 bg-white text-slate-800 hover:bg-slate-50`}
        >
          👁️ {t.preview}
        </a>

        {access === "premium" ? (
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className={`${ACTION_BASE} border-transparent bg-slate-900 text-white hover:opacity-90 disabled:opacity-60`}
          >
            {downloading ? t.downloading : `⬇️ ${t.download}`}
          </button>
        ) : (
          <Link
            href={pricingPath(lang)}
            onClick={handleLockedClick}
            className={`${ACTION_BASE} border-transparent bg-amber-500 text-white hover:bg-amber-600`}
          >
            🔒 {t.unlock}
          </Link>
        )}
      </div>
    </article>
  );
}

export default function MapOverviewGrid({ lang, items }: Props) {
  const t = LABELS[lang];
  const [query, setQuery] = useState("");
  const { loading: authLoading, user } = useAuth();
  const [liveAccess, setLiveAccess] = useState<Record<
    number,
    MapOverviewItem["access"]
  > | null>(null);

  // items arriva da un fetch server-side non autenticato (cache 1h): per un
  // utente Premium mostrerebbe sempre "locked". Qui rifacciamo la stessa
  // chiamata col token per avere lo stato reale.
  useEffect(() => {
    let cancelled = false;

    async function refreshAccess() {
      if (!user) return;
      try {
        const res = await apiFetch(`/maps?lang=${lang}`);
        const json = await res.json().catch(() => null);
        if (!cancelled && Array.isArray(json?.items)) {
          const map: Record<number, MapOverviewItem["access"]> = {};
          for (const it of json.items) map[it.id] = it.access;
          setLiveAccess(map);
        }
      } catch {
        // silenzioso: si resta sul fallback SSR (locked)
      }
    }

    if (!authLoading) refreshAccess();

    return () => {
      cancelled = true;
    };
  }, [authLoading, user, lang]);

  // Vista lista: una volta sola quando la pagina ha risorse da mostrare.
  // authLoading in dipendenza cosi' lo status utente e' quello vero, non
  // sempre "anonymous" per la finestra prima che /me risponda.
  useEffect(() => {
    if (authLoading || items.length === 0) return;

    trackEvent("study_map_list_viewed", {
      language: lang,
      user_status: userStatusFrom(user),
      source: "maps_page",
      resource_type: "map",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, items.length, lang]);

  const userStatus = userStatusFrom(authLoading ? null : user);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;

    return items.filter(
      (item) =>
        item.certification_name.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q)
    );
  }, [items, query]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 md:py-8">
      <section className="rounded-3xl bg-slate-950 px-5 py-6 text-white shadow-sm md:px-8 md:py-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="mb-3 inline-flex rounded-full bg-indigo-500/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-indigo-200">
              {t.badge}
            </p>

            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              {t.title}
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-200 md:text-base">
              {t.subtitle}
            </p>
          </div>

          {items.length > 0 ? (
            <div className="rounded-2xl bg-white/10 px-4 py-3 text-center">
              <div className="text-2xl font-extrabold">{items.length}</div>
              <div className="text-xs font-semibold text-slate-300">
                {t.count}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {items.length === 0 ? (
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
          {t.empty}
        </section>
      ) : (
        <>
          <section className="mt-5">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.search}
              aria-label={t.search}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            />
          </section>

          {filtered.length === 0 ? (
            <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
              {t.noResults}
            </section>
          ) : (
            <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {filtered.map((item) => (
                <MapCard
                  key={item.id}
                  lang={lang}
                  item={item}
                  access={liveAccess?.[item.id] ?? item.access}
                  userStatus={userStatus}
                  userEmail={user?.email ?? null}
                />
              ))}
            </section>
          )}
        </>
      )}
    </main>
  );
}
