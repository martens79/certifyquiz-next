import { type Locale, isLocale, defaultLocale, dict, withLang } from "@/lib/i18n";
import Link from "next/link";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  const lang: Locale = isLocale(raw) ? (raw as Locale) : defaultLocale;
  const t = dict[lang];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">CertifyQuiz</h1>
      <p className="text-gray-700">
        Benvenuto! Header e Footer sono pronti. Questa è una pagina demo localizzata: <b>{lang.toUpperCase()}</b>.
      </p>
      <div className="flex gap-3">
        <Link
          href={withLang(lang, "/certificazioni")}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          {t.certifications}
        </Link>
        <Link
          href={withLang(lang, "/prezzi")}
          className="rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
        >
          {t.pricing}
        </Link>
      </div>
    </div>
  );
}
