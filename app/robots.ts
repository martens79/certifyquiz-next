// app/robots.ts
export default function robots() {
  const site = "https://www.certifyquiz.com";
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${site}/sitemap-index.xml`, // <-- usa l’indice custom con hreflang
    host: site,
  };
}
