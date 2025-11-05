// ✅ src/components/HreflangLinks.jsx
import React from "react";
import { Helmet } from "react-helmet-async";

// Questo componente React serve per inserire nel <head> della pagina
// i tag <link rel="alternate" hreflang="..."> utili alla SEO multilingua.
// Aiuta i motori di ricerca a capire quali versioni linguistiche esistono di una pagina.

const HreflangLinks = ({ path }) => {
  const baseUrl = "https://www.certifyquiz.com";

  // Elenco delle lingue supportate nel sito
  const languages = ["it", "en", "fr", "es"];

  return (
    <Helmet>
      {languages.map((lang) => (
        <link
          key={lang}
          rel="alternate"
          hrefLang={lang}
          href={`${baseUrl}/${lang}${path}`}
        />
      ))}

      {/* Tag x-default per indicare la versione di fallback generica */}
      <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/it${path}`} />
    </Helmet>
  );
};

export default HreflangLinks;
