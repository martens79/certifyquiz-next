// src/components/SEOHead.jsx
import { Helmet } from "react-helmet-async";

export default function SEOHead({ title, description, lang, canonical, hreflangs = [] }) {
  return (
    <Helmet htmlAttributes={{ lang }}>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {canonical && <link rel="canonical" href={canonical} />}
      {hreflangs.map((h) => (
        <link key={h.hrefLang} rel="alternate" hrefLang={h.hrefLang} href={h.href} />
      ))}
      {/* Dati strutturati base */}
      <script type="application/ld+json">{`
      {
        "@context":"https://schema.org",
        "@type":"WebPage",
        "inLanguage":"${lang}",
        "isPartOf":{"@id":"https://www.certifyquiz.com/#website"}
      }`}</script>
    </Helmet>
  );
}
