// src/app/cookies/page.tsx
import CookiePage from "@/app/[lang]/cookie/page";
import type { Locale } from "@/lib/i18n";

export default function Page() {
  return <CookiePage params={Promise.resolve({ lang: "en" as Locale })} />;
}
