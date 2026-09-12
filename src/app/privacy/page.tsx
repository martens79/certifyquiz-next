// src/app/privacy/page.tsx
import PrivacyPage, {
  generateMetadata as generateLangMetadata,
} from "@/app/[lang]/privacy/page";
import type { Locale } from "@/lib/i18n"; // oppure Lang, usa il tipo che hai davvero

export function generateMetadata() {
  return generateLangMetadata({ params: Promise.resolve({ lang: "en" }) });
}

export default function Page() {
  return <PrivacyPage params={Promise.resolve({ lang: "en" as Locale })} />;
}
