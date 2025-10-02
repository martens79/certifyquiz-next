import Link from "next/link";
import { dict, type Locale, withLang } from "@/lib/i18n";

export default function Footer({ lang }: { lang: Locale }) {
  const t = dict[lang];
  const year = new Date().getFullYear();

  const links = [
    { href: withLang(lang, "/privacy"), label: t.privacy },
    { href: withLang(lang, "/termini"), label: t.terms },
    { href: withLang(lang, "/cookie"), label: t.cookies },
    { href: withLang(lang, "/contatti"), label: t.contact },
  ];

  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gray-900 text-white grid place-items-center text-xs font-bold">
              CQ
            </div>
            <span className="font-semibold">CertifyQuiz</span>
          </div>
          <p className="mt-3 text-sm text-gray-600">
            Quiz realistici, spiegazioni dettagliate e badge per certificazioni IT.
          </p>
        </div>

        <nav>
          <h3 className="text-sm font-semibold mb-2">Links</h3>
          <ul className="space-y-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-gray-700 hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="text-sm font-semibold mb-2">Newsletter</h3>
          <p className="text-sm text-gray-600">
            Iscriviti per aggiornamenti su nuove certificazioni e funzionalità.
          </p>
          {/* placeholder form; collega al tuo backend/newsletter */}
          <form className="mt-3 flex gap-2">
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              OK
            </button>
          </form>
        </div>
      </div>
      <div className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-gray-500 flex items-center justify-between">
          <span>© {year} CertifyQuiz. All rights reserved.</span>
          <span>vNext</span>
        </div>
      </div>
    </footer>
  );
}
