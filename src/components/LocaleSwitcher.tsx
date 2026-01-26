"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { locales, type Locale, isLocale } from "@/lib/i18n";
import { CAT_KEY_TO_SLUG, type CategoryKey } from "@/lib/paths";

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

/** ✅ Prezzi/Premium — slug tradotti per lingua (SEO) */
const PRICING_RE =
  /^\/(?:(it)\/prezzi|(fr)\/prix|(es)\/precios|pricing|prezzi)\/?$/i;

/* ------------------------------------------------------------------ */
/* HELPERS                                                            */
/* ------------------------------------------------------------------ */

function qs(path: string, q?: string) {
  return q ? `${path}?${q}` : path;
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
  if (lang === "en") return "/pricing";
  if (lang === "it") return "/it/prezzi";
  if (lang === "fr") return "/fr/prix";
  return "/es/precios";
}

function categoryKeyFromSlug(lang: Locale, slug: string): CategoryKey | null {
  const map = CAT_KEY_TO_SLUG[lang] as Record<string, string>;
  const found = Object.entries(map).find(([, s]) => s === slug);
  return (found?.[0] as CategoryKey) ?? null;
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
      const key = categoryKeyFromSlug(fromLang, slug);

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

    /* ---------------------- PRICING -------------------- */
    if (PRICING_RE.test(pathname)) {
      router.push(qs(pricingRoot(next), query));
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
