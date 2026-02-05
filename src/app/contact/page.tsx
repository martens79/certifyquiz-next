import StaticPage from "@/app/[lang]/[page]/page";
import type { Locale } from "@/lib/i18n";

export default function Page() {
  return (
    <StaticPage
      params={Promise.resolve({ lang: "en" as Locale, page: "contact" })}
    />
  );
}
