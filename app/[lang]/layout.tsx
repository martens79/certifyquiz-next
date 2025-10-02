// src/app/[lang]/layout.tsx
import { isLocale, type Locale, defaultLocale } from "@/lib/i18n";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const lang: Locale = isLocale(params.lang) ? (params.lang as Locale) : defaultLocale;

  return (
    <>
      {/* Imposta l'attributo lang sul root <html> via side-effect se vuoi (opzionale) */}
      {/* <script dangerouslySetInnerHTML={{ __html: `document.documentElement.lang='${lang}'` }} /> */}

      <Header lang={lang} />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      <Footer lang={lang} />
    </>
  );
}
