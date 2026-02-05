// src/app/terms/page.tsx
import TermsPage from "@/app/[lang]/terms/page";
import type { Locale } from "@/lib/i18n";

export default function Page() {
  return <TermsPage params={Promise.resolve({ lang: "en" as Locale })} />;
}
