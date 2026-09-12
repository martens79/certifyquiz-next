// src/app/cookies/page.tsx
import CookiePage, {
  generateMetadata as generateLangMetadata,
} from "@/app/[lang]/cookie/page";
import type { Locale } from "@/lib/i18n";

export function generateMetadata() {
  return generateLangMetadata({ params: Promise.resolve({ lang: "en" }) });
}

export default function Page() {
  return <CookiePage params={Promise.resolve({ lang: "en" as Locale })} />;
}
