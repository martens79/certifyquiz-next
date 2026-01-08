// app/[lang]/layout.tsx
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n";

const SUPPORTED = ["it", "en", "fr", "es"] as const;
type Lang = (typeof SUPPORTED)[number];

const ORIGIN =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.certifyquiz.com";

function home(lang: Lang) {
  return lang === "it" ? "/it"
       : lang === "es" ? "/es"
       : lang === "fr" ? "/fr"
       : "/en";
}

const isLang = (v: string): v is Lang =>
  (SUPPORTED as readonly string[]).includes(v);

// Hreflang/canonical per la home di sezione (/it, /en, /fr, /es)
export async function generateMetadata(
  { params }: { params: Promise<{ lang: string }> }
): Promise<Metadata> {
  const { lang: raw } = await params;
  const lang: Lang = isLang(raw) ? raw : "it";

  return {
    alternates: {
      canonical: home(lang), // relativo → diventa assoluto via metadataBase nel root layout
      languages: {
        "it-IT": `${ORIGIN}${home("it")}`,
        "en-US": `${ORIGIN}${home("en")}`,
        "fr-FR": `${ORIGIN}${home("fr")}`,
        "es-ES": `${ORIGIN}${home("es")}`,
        "x-default": `${ORIGIN}${home("en")}`,
      },
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: raw } = await params;
  const lang: Locale = isLocale(raw) ? (raw as Locale) : defaultLocale;

  return (
    <>
      <Header lang={lang} />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      <Footer lang={lang} />
    </>
  );
}
