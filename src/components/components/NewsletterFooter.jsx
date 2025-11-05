import { useLocation, Link } from "react-router-dom";
import NewsletterForm from "./NewsletterForm";

const getLangFromPath = (pathname) => {
  const m = pathname.match(/^\/(it|en|fr|es)(\/|$)/i);
  return m ? m[1].toLowerCase() : "it";
};

export default function NewsletterFooter() {
  const { pathname } = useLocation();
  const lang = getLangFromPath(pathname);
  const homePath = `/${lang}`;

  // sei in home? (anche con slash finale)
  const isHome =
    pathname === homePath || pathname === `${homePath}/` || pathname === "/";

  return (
    <section id="newsletter" className="bg-blue-50 border-t border-blue-100 py-8 md:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Rimani aggiornato 🚀</h2>
        <p className="text-neutral-700 mb-5">
          Iscriviti alla newsletter: articoli, quiz e novità sulle certificazioni IT.
        </p>

        <div className="max-w-lg mx-auto">
          <NewsletterForm />
        </div>

        {/* Nascondi il link Home se sei già in home */}
        {!isHome && (
          <div className="mt-5">
            <Link
              to={homePath}
              className="inline-flex items-center rounded-xl border px-4 py-2 text-sm hover:bg-white"
            >
              ⌂ Torna alla Home
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
