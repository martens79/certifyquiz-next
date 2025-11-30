// src/components/layout/LocaleSwitcher.tsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { locales, type Locale, isLocale } from "@/lib/i18n";

const LANG_RE = /^\/(it|en|fr|es)(?=\/|$)/i;

export default function LocaleSwitcher({ current }: { current: Locale }) {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const search = useSearchParams();

  const switchTo = (lang: string) => {
    if (!isLocale(lang)) return;
    if (lang === current) return;

    let base = pathname;

    // sostituisci solo il primo segmento se è una lingua; altrimenti preponi
    if (LANG_RE.test(base)) {
      base = base.replace(LANG_RE, `/${lang}`);
    } else {
      base = `/${lang}${base.startsWith("/") ? "" : "/"}${base}`;
    }

    // preserva querystring se presente
    const qs = search?.toString();
    const next = qs ? `${base}?${qs}` : base;

    router.push(next);
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
