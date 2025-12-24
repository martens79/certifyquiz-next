// src/components/layout/LocaleSwitcher.tsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { locales, type Locale, isLocale } from "@/lib/i18n";

// Match lingua SOLO per le lingue prefissate (EN è root, quindi non deve mai comparire come /en)
const LANG_RE = /^\/(it|fr|es)(?=\/|$)/i;

export default function LocaleSwitcher({ current }: { current: Locale }) {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const search = useSearchParams();

  const switchTo = (nextLangRaw: string) => {
    if (!isLocale(nextLangRaw)) return;
    const nextLang = nextLangRaw as Locale;
    if (nextLang === current) return;

    // 1) togli eventuale prefisso lingua (it/fr/es) se presente
    //    (se sei su EN root, non c’è prefisso e non cambia nulla)
    const stripped = pathname.replace(LANG_RE, "") || "/";

    // 2) ricostruisci path secondo la regola:
    //    EN = root (nessun /en)
    //    IT/FR/ES = prefisso /{lang}
    let nextPath = stripped;
    if (nextLang !== "en") {
      nextPath = `/${nextLang}${stripped === "/" ? "" : stripped}`;
    }

    // 3) preserva querystring
    const qs = search?.toString();
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
