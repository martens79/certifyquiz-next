"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { locales, type Locale, isLocale } from "@/lib/i18n";
import { CAT_KEY_TO_SLUG, type CategoryKey } from "@/lib/paths";

/* ------------------------------------------------------------------ */
/* REGEX                                                              */
/* ------------------------------------------------------------------ */

// ✅ Quiz: EN root "/quiz/..." + altre lingue "/it|fr|es/quiz/..."
const QUIZ_RE = /^\/(?:(it|fr|es)\/)?quiz\//i;

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

// ✅ Rimuove UNO O PIÙ prefissi lingua (gestisce anche /it/en/...)
// Nota: en è root, ma se compare come prefisso lo togliamo comunque (stato "sporco")
function stripAnyLocalePrefixes(pathname: string) {
  const clean = pathname.replace(/^(?:\/(?:it|en|fr|es))+(?=\/|$)/i, "");
  return clean === "" ? "/" : clean;
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

  // ✅ Sempre pulito: niente /it/en/... ecc.
  const pathname = stripAnyLocalePrefixes(pathnameRaw);

  function switchTo(nextRaw: string) {
    if (!isLocale(nextRaw)) return;
    const next = nextRaw as Locale;
    if (next === current) return;

    /* ---------------------- QUIZ ---------------------- */
    // EN root: "/quiz/..."  | IT/FR/ES: "/it/quiz/..."
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
    // fallback semplice e robusto: ripulisci e applica lingua
    router.push(qs(applyLocale(pathname, next), query));
  }

  return (
    <select
      value={current}
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
