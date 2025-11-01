// src/app/[lang]/page.tsx
import Home from "@/components/home/Home"; // ✅ importa il componente reale
import type { Locale } from "@/lib/i18n";

export default async function LangHome(
  props: { params: Promise<{ lang: Locale }> }
) {
  // ⏳ Next 15: i params vanno "awaitati"
  const { lang } = await props.params;

  // 🏠 render della home vera
  return (
    <main id="main">
      <Home lang={lang} />
    </main>
  );
}
