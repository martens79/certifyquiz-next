// src/app/terms/page.tsx
import TermsPage, {
  generateMetadata as generateLangMetadata,
} from "@/app/[lang]/terms/page";
import type { Locale } from "@/lib/i18n";

export function generateMetadata() {
  return generateLangMetadata({ params: Promise.resolve({ lang: "en" }) });
}

export default function Page() {
  return <TermsPage params={Promise.resolve({ lang: "en" as Locale })} />;
}
