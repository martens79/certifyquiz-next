"use client";
import { usePathname, useRouter } from "next/navigation";
import { locales, type Locale, isLocale } from "@/lib/i18n";

export default function LocaleSwitcher({ current }: { current: Locale }) {
  const router = useRouter();
  const pathname = usePathname() || "/";

  function switchTo(lang: string) {
    if (!isLocale(lang)) return;
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length === 0) {
      router.push(`/${lang}`);
      return;
    }
    // sostituisce lo slug lingua (prima parte del path)
    parts[0] = lang;
    router.push("/" + parts.join("/"));
  }

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
