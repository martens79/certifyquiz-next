// src/components/FooterLegale.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

const getLangFromPath = (pathname) => {
  const m = pathname.match(/^\/(it|en|fr|es)(\/|$)/i);
  return m ? m[1].toLowerCase() : "it";
};

export default function FooterLegale() {
  const { pathname } = useLocation();
  const lang = getLangFromPath(pathname);

  const labels =
    {
      it: { privacy: "Privacy", terms: "Termini e Condizioni", cookie: "Cookie" },
      en: { privacy: "Privacy Policy", terms: "Terms & Conditions", cookie: "Cookie Policy" },
      fr: { privacy: "Politique de confidentialité", terms: "Conditions générales", cookie: "Politique de cookies" },
      es: { privacy: "Política de privacidad", terms: "Términos y condiciones", cookie: "Política de cookies" },
    }[lang] || { privacy: "Privacy Policy", terms: "Terms & Conditions", cookie: "Cookie Policy" };

  return (
    // fisso su desktop, nascosto su mobile
    <footer className="hidden md:block fixed bottom-0 left-0 right-0 bg-white border-t">
      <div className="max-w-6xl mx-auto px-4 py-3 text-center text-sm text-gray-500">
        <p className="flex items-center justify-center gap-3">
          <span>© {new Date().getFullYear()} CertifyQuiz</span>
          <span>·</span>
          <Link to={`/${lang}/privacy-policy`} className="underline hover:no-underline">
            {labels.privacy}
          </Link>
          <span>·</span>
          <Link to={`/${lang}/terms-conditions`} className="underline hover:no-underline">
            {labels.terms}
          </Link>
          <span>·</span>
          <Link to={`/${lang}/cookie-policy`} className="underline hover:no-underline">
            {labels.cookie}
          </Link>
        </p>
      </div>
    </footer>
  );
}
