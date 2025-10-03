// app/[lang]/layout.tsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n";

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
