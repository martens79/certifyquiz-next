// src/components/layout/LocaleSwitcher.tsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { locales, type Locale, isLocale } from "@/lib/i18n";

// ✅ usa la tua mappa categorie -> slug per lingua
// (se non è in paths.ts, sposta l'import dove sta davvero)
import { CAT_KEY_TO_SLUG, type CategoryKey } from "@/lib/paths";

/**
 * LOCALE SWITCHER — regole URL CertifyQuiz
 *
 * 1) QUIZ: SEMPRE /{lang}/quiz/... (EN incluso)
 *    Esempio:
 *      /it/quiz/security-plus/mixed  -> EN -> /en/quiz/security-plus/mixed
 *
 * 2) CATEGORIES (SEO):
 *    - EN: /categories/:slug
 *    - FR: /fr/categories/:slug
 *    - ES: /es/categories/:slug
 *    - IT: /it/categorie/:slug  (slug tradotto!)
 *
 * 3) SEO (tutto il resto):
 *    - EN = root (nessun /en)
 *    - IT/FR/ES = prefisso /{lang}
 *
 * 4) Preserva sempre query string (?x=...)
 */

// Lingue supportate (serve per regex safe)
const LOCALES = ["it", "en", "fr", "es"] as const;

// Regex per riconoscere un prefisso lingua all’inizio path
const LANG_PREFIX_RE = new RegExp(`^/(${LOCALES.join("|")})(?=/|$)`, "i");

// Regex per riconoscere il flusso quiz: /{lang}/quiz/...
const QUIZ_PREFIX_RE = new RegExp(`^/(${LOCALES.join("|")})/quiz/`, "i");

// CATEGORIES: riconosce list e detail
// - EN: /categories
// - FR: /fr/categories
// - ES: /es/categories
// - IT: /it/categorie
const CAT_LIST_RE = /^\/(?:(it|fr|es)\/)?(categories|categorie)\/?$/i;
const CAT_DETAIL_RE = /^\/(?:(it|fr|es)\/)?(categories|categorie)\/([^/?#]+)\/?$/i;

// Lingua dal prefisso URL (se assente = EN)
function langFromPathPrefix(prefix?: string | null): Locale {
  return prefix && isLocale(prefix) ? (prefix as Locale) : "en";
}

// Trova la CategoryKey dato lo slug nella lingua corrente
function categoryKeyFromSlug(lang: Locale, slug: string): CategoryKey | null {
  const map = CAT_KEY_TO_SLUG[lang] as Record<string, string>;
  const entry = Object.entries(map).find(([, s]) => s === slug);
  return (entry?.[0] as CategoryKey) ?? null;
}

// Costruisce /categories root a seconda della lingua (regola attuale del tuo progetto)
function categoriesListPath(lang: Locale): string {
  if (lang === "it") return "/it/categorie";
  return lang === "en" ? "/categories" : `/${lang}/categories`;
}

function categoryDetailPath(lang: Locale, slug: string): string {
  return `${categoriesListPath(lang)}/${slug}`;
}

export default function LocaleSwitcher({ current }: { current: Locale }) {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const search = useSearchParams();

  const switchTo = (nextLangRaw: string) => {
    if (!isLocale(nextLangRaw)) return;
    const nextLang = nextLangRaw as Locale;
    if (nextLang === current) return;

    const cleanPath = pathname || "/";
    const qs = search?.toString();

    /* -------------------------------------------------------------- */
    /* 1) QUIZ FLOW                                                    */
    /* -------------------------------------------------------------- */
    // /{lang}/quiz/...  ->  /{nextLang}/quiz/...
    if (QUIZ_PREFIX_RE.test(cleanPath)) {
      const nextPath = cleanPath.replace(QUIZ_PREFIX_RE, `/${nextLang}/quiz/`);
      router.push(qs ? `${nextPath}?${qs}` : nextPath);
      return;
    }

    /* -------------------------------------------------------------- */
    /* 2) CATEGORY PAGES (SEO) — traduce anche lo slug                 */
    /* -------------------------------------------------------------- */
    // List: /categories | /fr/categories | /es/categories | /it/categorie
    if (CAT_LIST_RE.test(cleanPath)) {
      const nextPath = categoriesListPath(nextLang);
      router.push(qs ? `${nextPath}?${qs}` : nextPath);
      return;
    }

    // Detail: /categories/security | /fr/categories/security | /it/categorie/sicurezza
    const mDetail = cleanPath.match(CAT_DETAIL_RE);
    if (mDetail?.[3]) {
      const prefix = mDetail[1]; // it|fr|es oppure undefined (EN)
      const currentLang = langFromPathPrefix(prefix);
      const currentSlug = mDetail[3];

      const key = categoryKeyFromSlug(currentLang, currentSlug);

      // Fallback safe: se non mappa, manda alla lista nella lingua target (meglio che 404)
      if (!key) {
        const nextPath = categoriesListPath(nextLang);
        router.push(qs ? `${nextPath}?${qs}` : nextPath);
        return;
      }

      const nextSlug = CAT_KEY_TO_SLUG[nextLang][key];
      const nextPath = categoryDetailPath(nextLang, nextSlug);
      router.push(qs ? `${nextPath}?${qs}` : nextPath);
      return;
    }

    /* -------------------------------------------------------------- */
    /* 3) SEO FLOW (fallback)                                         */
    /* -------------------------------------------------------------- */
    // Per tutto il resto: togli prefisso lingua se presente e riapplica regola
    const stripped = cleanPath.replace(LANG_PREFIX_RE, "") || "/";

    // EN = root (no /en)
    if (nextLang === "en") {
      router.push(qs ? `${stripped}?${qs}` : stripped);
      return;
    }

    // IT/FR/ES = /{lang} + resto
    const nextPath = `/${nextLang}${stripped === "/" ? "" : stripped}`;
    router.push(qs ? `${nextPath}?${qs}` : nextPath);
  };

  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <span className="sr-only">Language</span>
      <select
        aria-label="Language"
        className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm"
        value={current}
        onChange={(e) => switchTo(e.target.value)}
      >
        {locales.map((l) => (
          <option value={l} key={l}>
            {l.toUpperCase()}
          </option>
        ))}
      </select>
    </label>
  );
}
