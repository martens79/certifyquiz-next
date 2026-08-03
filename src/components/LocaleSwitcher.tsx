"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { locales, type Locale, isLocale } from "@/lib/i18n";
import {
  CAT_KEY_TO_SLUG,
  resolveCategoryKey,
  GUIDES_SLUG_BY_LANG,
  MAPS_SLUG_BY_LANG,
  REVIEWS_SLUG_BY_LANG,
  SCENARIOS_SLUG_BY_LANG,
  PRICING_SLUG_BY_LANG,
  GAMES_SLUG_BY_LANG,
  RECOMMENDED_RESOURCES_SLUG_BY_LANG,
  recommendedResourcesPath,
} from "@/lib/paths";

/* ------------------------------------------------------------------ */
/* REGEX                                                              */
/* ------------------------------------------------------------------ */

// ✅ Quiz: EN root "/quiz/..." + altre lingue "/it|fr|es/quiz/..."
const QUIZ_RE = /^\/(?:(it|fr|es)\/)?quiz\//i;

// ✅ Quiz Home: EN root "/quiz-home" + altre lingue "/it|fr|es/quiz-home"
const QUIZ_HOME_RE = /^\/(?:(it|fr|es)\/)?quiz-home\/?$/i;

// ✅ Home locale: /it /fr /es (EN è /)
const LOCALE_HOME_RE = /^\/(it|fr|es)\/?$/i;

const CAT_LIST_RE =
  /^\/(?:(it)\/categorie|(fr)\/categories|(es)\/categorias|categories)\/?$/i;

const CAT_DETAIL_RE =
  /^\/(?:(it)\/categorie|(fr)\/categories|(es)\/categorias|categories)\/([^/?#]+)\/?$/i;

const CERT_LIST_RE =
  /^\/(?:(it)\/certificazioni|(fr)\/certifications|(es)\/certificaciones|certifications)\/?$/i;

const CERT_DETAIL_RE =
  /^\/(?:(it)\/certificazioni|(fr)\/certifications|(es)\/certificaciones|certifications)\/([^/?#]+)\/?$/i;

/**
 * ✅ Certification sub-path: /{certRoot}/{certSlug}/{second}(/{third})?
 * Copre sia "/certifications/{slug}/scenarios(/{id})?" sia le pagine topic
 * "/certifications/{slug}/{topicSlug}(/review)?".
 */
const CERT_SUB_RE =
  /^\/(?:(it)\/certificazioni|(fr)\/certifications|(es)\/certificaciones|certifications)\/([^/?#]+)\/([^/?#]+)(?:\/([^/?#]+))?\/?$/i;

/** ✅ Prezzi/Premium — slug tradotti per lingua (SEO) */
const PRICING_RE = sectionListRe(PRICING_SLUG_BY_LANG);

/** ✅ Guide PDF — lista e dettaglio (slug guida invariante per lingua) */
const GUIDES_LIST_RE = sectionListRe(GUIDES_SLUG_BY_LANG);
const GUIDES_DETAIL_RE = sectionDetailRe(GUIDES_SLUG_BY_LANG);

/** ✅ Mappe concettuali — solo lista, nessuna route di dettaglio con slug */
const MAPS_LIST_RE = sectionListRe(MAPS_SLUG_BY_LANG);

/** ✅ Ripassi — lista e dettaglio per certificazione (slug cert invariante) */
const REVIEWS_LIST_RE = sectionListRe(REVIEWS_SLUG_BY_LANG);
const REVIEWS_DETAIL_RE = sectionDetailRe(REVIEWS_SLUG_BY_LANG);

/** ✅ Scenari — solo lista in root; il dettaglio vive sotto /certifications/{slug}/scenari */
const SCENARIOS_LIST_RE = sectionListRe(SCENARIOS_SLUG_BY_LANG);
const GAMES_LIST_RE = sectionListRe(GAMES_SLUG_BY_LANG);
const GAMES_DETAIL_RE = sectionDetailRe(GAMES_SLUG_BY_LANG);
const RECOMMENDED_RESOURCES_RE = sectionListRe(RECOMMENDED_RESOURCES_SLUG_BY_LANG);

/** ✅ Parola "review" della pagina di ripasso topic (.../{topicSlug}/review) */
const TOPIC_REVIEW_WORD: Record<Locale, string> = {
  it: "ripasso",
  en: "review",
  fr: "revision",
  es: "repaso",
};

/**
 * ✅ Blog — "blog" è la stessa parola in tutte le lingue, ma lo slug
 * dell'articolo è tradotto indipendentemente per ogni lingua su Sanity
 * (documenti separati, nessun campo di collegamento fra traduzioni):
 * non è risolvibile lato client, vedi branch BLOG più sotto.
 */
const BLOG_SLUG_BY_LANG: Record<Locale, string> = {
  it: "blog",
  en: "blog",
  fr: "blog",
  es: "blog",
};
const BLOG_DETAIL_RE = sectionDetailRe(BLOG_SLUG_BY_LANG);

/* ------------------------------------------------------------------ */
/* HELPERS                                                            */
/* ------------------------------------------------------------------ */

function qs(path: string, q?: string) {
  return q ? `${path}?${q}` : path;
}

/** ✅ Root di una sezione "parola statica" (es. /it/guide, /fr/guides, /guide) */
function sectionRoot(lang: Locale, slugByLang: Record<Locale, string>) {
  const seg = slugByLang[lang];
  return lang === "en" ? `/${seg}` : `/${lang}/${seg}`;
}

/** ✅ Regex lista: root sezione, nessuno slug successivo */
function sectionListRe(slugByLang: Record<Locale, string>): RegExp {
  return new RegExp(
    `^\\/(?:(it)\\/${slugByLang.it}|(fr)\\/${slugByLang.fr}|(es)\\/${slugByLang.es}|${slugByLang.en})\\/?$`,
    "i"
  );
}

/** ✅ Regex dettaglio: root sezione + UNO slug invariante per lingua */
function sectionDetailRe(slugByLang: Record<Locale, string>): RegExp {
  return new RegExp(
    `^\\/(?:(it)\\/${slugByLang.it}|(fr)\\/${slugByLang.fr}|(es)\\/${slugByLang.es}|${slugByLang.en})\\/([^/?#]+)\\/?$`,
    "i"
  );
}

function homeRoot(lang: Locale) {
  return lang === "en" ? "/" : `/${lang}`;
}

function categoriesRoot(lang: Locale) {
  if (lang === "en") return "/categories";
  if (lang === "it") return "/it/categorie";
  if (lang === "fr") return "/fr/categories";
  return "/es/categorias";
}

function certificationsRoot(lang: Locale) {
  if (lang === "en") return "/certifications";
  if (lang === "it") return "/it/certificazioni";
  if (lang === "fr") return "/fr/certifications";
  return "/es/certificaciones";
}

/** ✅ Route prezzi per lingua: /pricing (EN root), /it/prezzi, /fr/prix, /es/precios */
function pricingRoot(lang: Locale) {
  return sectionRoot(lang, PRICING_SLUG_BY_LANG);
}

/**
 * ✅ Normalizza SOLO prefissi lingua "sporchi":
 * - /it/en/...  -> /en/... (ma EN è root, quindi poi diventa /...)
 * - /fr/it/...  -> /it/...
 * - /en/...     -> /...    (EN è root)
 */
function normalizeLocalePrefix(pathname: string) {
  // 1) doppio prefisso: tieni solo il secondo
  const m = pathname.match(/^\/(it|en|fr|es)\/(it|en|fr|es)(?=\/|$)/i);
  if (m) {
    const second = m[2].toLowerCase();
    const rest = pathname.replace(/^\/(it|en|fr|es)\/(it|en|fr|es)/i, "");
    pathname = `/${second}${rest}`;
  }

  // 2) EN è root: se compare come prefisso, rimuovilo
  pathname = pathname.replace(/^\/en(?=\/|$)/i, "");

  return pathname === "" ? "/" : pathname;
}

/** ✅ Deriva la lingua dal path reale (EN root se nessun prefisso) */
function localeFromPath(pathname: string): Locale {
  const m = pathname.match(/^\/(it|fr|es)(?=\/|$)/i);
  return (m?.[1]?.toLowerCase() || "en") as Locale;
}

// ✅ Ricostruisce path con regola: EN root senza /en, altre lingue con prefisso
function applyLocale(cleanPath: string, lang: Locale) {
  if (lang === "en") return cleanPath;
  return cleanPath === "/" ? `/${lang}` : `/${lang}${cleanPath}`;
}

type TopicListEntry = { id: number; slug: string };

/**
 * ✅ Risolve lo slug del topic nella lingua target chiamando l'endpoint
 * pubblico /api/topic-pages/by-cert (già usato server-side in data.ts),
 * via il proxy client /api/backend usato altrove nell'app.
 * Il topic è identificato per id: si cerca l'id nella lista in lingua
 * corrente (match sullo slug presente nell'URL), poi si legge lo slug
 * dello stesso id nella lista in lingua target.
 * Ritorna null se il topic non esiste (ancora) in quella lingua, o in
 * caso di errore di rete: il chiamante fa fallback alla pagina cert.
 */
async function resolveTopicSlug(
  certSlug: string,
  fromLang: Locale,
  toLang: Locale,
  topicSlug: string
): Promise<string | null> {
  try {
    const [fromRes, toRes] = await Promise.all([
      fetch(
        `/api/backend/topic-pages/by-cert/${encodeURIComponent(certSlug)}?lang=${fromLang}`
      ),
      fetch(
        `/api/backend/topic-pages/by-cert/${encodeURIComponent(certSlug)}?lang=${toLang}`
      ),
    ]);
    if (!fromRes.ok || !toRes.ok) return null;

    const fromData: { topics?: TopicListEntry[] } = await fromRes.json();
    const toData: { topics?: TopicListEntry[] } = await toRes.json();

    const current = fromData.topics?.find((t) => t.slug === topicSlug);
    if (!current) return null;

    const target = toData.topics?.find((t) => t.id === current.id);
    return target?.slug ?? null;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export default function LocaleSwitcher({ current }: { current: Locale }) {
  const router = useRouter();
  const pathnameRaw = usePathname() || "/";
  const search = useSearchParams();
  const query = search?.toString();

  // ✅ normalizza
  const pathname = normalizeLocalePrefix(pathnameRaw);

  // ✅ non fidarti solo del prop: deriva dal path reale
  const effectiveCurrent = localeFromPath(pathname) ?? current;

  function switchTo(nextRaw: string) {
    if (!isLocale(nextRaw)) return;
    const next = nextRaw as Locale;

    if (next === effectiveCurrent) return;

    /* ---------------------- HOME ---------------------- */
    if (pathname === "/" || LOCALE_HOME_RE.test(pathname)) {
      router.push(qs(homeRoot(next), query));
      return;
    }

    /* ------------ RECOMMENDED RESOURCES ------------- */
    if (RECOMMENDED_RESOURCES_RE.test(pathname)) {
      router.push(qs(recommendedResourcesPath(next), query));
      return;
    }

    /* ------------------- QUIZ HOME ------------------- */
    if (QUIZ_HOME_RE.test(pathname)) {
      const target = next === "en" ? "/quiz-home" : `/${next}/quiz-home`;
      router.push(qs(target, query));
      return;
    }

    /* ---------------------- QUIZ ---------------------- */
    if (QUIZ_RE.test(pathname)) {
      const slugPart = pathname.replace(QUIZ_RE, "/quiz/"); // normalizza a "/quiz/..."
      router.push(qs(applyLocale(slugPart, next), query));
      return;
    }

    /* ------------------- CATEGORY LIST ---------------- */
    if (CAT_LIST_RE.test(pathname)) {
      router.push(qs(categoriesRoot(next), query));
      return;
    }

    /* ------------------ CATEGORY DETAIL ---------------- */
    const catMatch = pathname.match(CAT_DETAIL_RE);
    if (catMatch) {
      const fromLang: Locale =
        catMatch[1] ? "it" : catMatch[2] ? "fr" : catMatch[3] ? "es" : "en";

      const slug = catMatch[4];
      const key = resolveCategoryKey(fromLang, slug);

      // Slug non risolvibile in questa lingua → fallback all'indice categorie
      // (mai un 404 silenzioso: vedi nota "Fix richiesto" nella issue).
      if (!key) {
        router.push(qs(categoriesRoot(next), query));
        return;
      }

      const nextSlug = CAT_KEY_TO_SLUG[next][key];
      router.push(qs(`${categoriesRoot(next)}/${nextSlug}`, query));
      return;
    }

    /* ---------------- CERTIFICATIONS LIST -------------- */
    if (CERT_LIST_RE.test(pathname)) {
      router.push(qs(certificationsRoot(next), query));
      return;
    }

    /* --------------- CERTIFICATION DETAIL -------------- */
    const certMatch = pathname.match(CERT_DETAIL_RE);
    if (certMatch) {
      const slug = certMatch[4];
      router.push(qs(`${certificationsRoot(next)}/${slug}`, query));
      return;
    }

    /* ------------- CERTIFICATION SUB-PATHS -------------- */
    // /{certRoot}/{certSlug}/scenari(/{id})?  → slug cert + id sono invarianti,
    //   basta tradurre la parola "scenari/scenarios/escenarios".
    // /{certRoot}/{certSlug}/{topicSlug}(/review)?  → topicSlug è localizzato
    //   in DB (tabella topics, colonne slug_it/slug_en/slug_fr/slug_es).
    //   Si tenta una risoluzione via API (stesso endpoint pubblico usato
    //   server-side); se il topic non esiste in quella lingua o la chiamata
    //   fallisce, fallback alla pagina certificazione invece di un 404.
    const certSubMatch = pathname.match(CERT_SUB_RE);
    if (certSubMatch) {
      const fromLang: Locale =
        certSubMatch[1] ? "it" : certSubMatch[2] ? "fr" : certSubMatch[3] ? "es" : "en";
      const certSlug = certSubMatch[4];
      const second = certSubMatch[5];
      const third = certSubMatch[6];

      const scenariosWord = SCENARIOS_SLUG_BY_LANG[fromLang];
      if (second.toLowerCase() === scenariosWord.toLowerCase()) {
        const nextWord = SCENARIOS_SLUG_BY_LANG[next];
        const tail = third ? `/${third}` : "";
        router.push(
          qs(`${certificationsRoot(next)}/${certSlug}/${nextWord}${tail}`, query)
        );
        return;
      }

      const certFallback = qs(`${certificationsRoot(next)}/${certSlug}`, query);
      const isReviewPage =
        !!third && third.toLowerCase() === TOPIC_REVIEW_WORD[fromLang].toLowerCase();

      resolveTopicSlug(certSlug, fromLang, next, second).then((targetSlug) => {
        if (!targetSlug) {
          router.push(certFallback);
          return;
        }
        const tail = isReviewPage ? `/${TOPIC_REVIEW_WORD[next]}` : "";
        router.push(
          qs(`${certificationsRoot(next)}/${certSlug}/${targetSlug}${tail}`, query)
        );
      });
      return;
    }

    /* ---------------------- PRICING -------------------- */
    if (PRICING_RE.test(pathname)) {
      router.push(qs(pricingRoot(next), query));
      return;
    }

    /* ---------------------- GUIDES ---------------------- */
    // Slug guida invariante per lingua (stesso record, colonne di contenuto
    // per lingua) → basta tradurre la parola "guide/guides/guias".
    if (GUIDES_LIST_RE.test(pathname)) {
      router.push(qs(sectionRoot(next, GUIDES_SLUG_BY_LANG), query));
      return;
    }
    const guideMatch = pathname.match(GUIDES_DETAIL_RE);
    if (guideMatch) {
      const slug = guideMatch[4];
      router.push(qs(`${sectionRoot(next, GUIDES_SLUG_BY_LANG)}/${slug}`, query));
      return;
    }

    /* ----------------------- MAPS ------------------------ */
    // Solo lista: nessuna route di dettaglio con slug al momento.
    if (MAPS_LIST_RE.test(pathname)) {
      router.push(qs(sectionRoot(next, MAPS_SLUG_BY_LANG), query));
      return;
    }

    /* ---------------------- REVIEWS ---------------------- */
    // Slug = certSlug (registro certificazioni, invariante per lingua).
    if (REVIEWS_LIST_RE.test(pathname)) {
      router.push(qs(sectionRoot(next, REVIEWS_SLUG_BY_LANG), query));
      return;
    }
    const reviewMatch = pathname.match(REVIEWS_DETAIL_RE);
    if (reviewMatch) {
      const certSlug = reviewMatch[4];
      router.push(
        qs(`${sectionRoot(next, REVIEWS_SLUG_BY_LANG)}/${certSlug}`, query)
      );
      return;
    }

    /* --------------------- SCENARIOS ---------------------- */
    // Solo lista in root; il dettaglio con id vive sotto /certifications/{slug}/scenari
    // ed è già coperto dal branch CERTIFICATION SUB-PATHS sopra.
    if (SCENARIOS_LIST_RE.test(pathname)) {
      router.push(qs(sectionRoot(next, SCENARIOS_SLUG_BY_LANG), query));
      return;
    }

    if (GAMES_LIST_RE.test(pathname)) {
      router.push(qs(sectionRoot(next, GAMES_SLUG_BY_LANG), query));
      return;
    }
    const gameMatch = pathname.match(GAMES_DETAIL_RE);
    if (gameMatch) {
      router.push(qs(`${sectionRoot(next, GAMES_SLUG_BY_LANG)}/${gameMatch[4]}`, query));
      return;
    }

    /* ---------------------- BLOG ------------------------ */
    // Lo slug articolo è tradotto indipendentemente per lingua su Sanity e
    // non esiste alcun campo che colleghi le versioni fra loro (verificato
    // su schema + dati live): impossibile risolvere lo slug tradotto lato
    // client. Fallback all'indice blog della lingua target invece di
    // portare uno slug quasi certamente sbagliato/inesistente.
    if (BLOG_DETAIL_RE.test(pathname)) {
      router.push(qs(sectionRoot(next, BLOG_SLUG_BY_LANG), query));
      return;
    }

    /* ------------------- SEO FALLBACK ------------------ */
    router.push(qs(applyLocale(pathname, next), query));
  }

  return (
    <select
      value={effectiveCurrent}
      onChange={(e) => switchTo(e.target.value)}
      className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm"
      aria-label="Language"
    >
      {locales.map((l) => (
        <option key={l} value={l}>
          {l.toUpperCase()}
        </option>
      ))}
    </select>
  );
}
