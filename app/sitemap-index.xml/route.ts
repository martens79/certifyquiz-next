// app/sitemap-index.xml/route.ts
export const dynamic = "force-dynamic";
export const revalidate = 0;

type Lang = "it" | "en" | "fr" | "es";
type UnknownRecord = Record<string, unknown>;

function isRecord(v: unknown): v is UnknownRecord {
  return v !== null && typeof v === "object";
}

function arrayFromUnknown(u: unknown): unknown[] {
  if (Array.isArray(u)) return u;
  if (isRecord(u)) {
    const keys = ["data", "items", "results", "rows", "list", "payload", "certifications"] as const;
    for (const k of keys) {
      const v = (u as UnknownRecord)[k];
      if (Array.isArray(v)) return v as unknown[];
    }
  }
  return [];
}

function pickSlugs(u: unknown): string[] {
  const arr = arrayFromUnknown(u);
  const out: string[] = [];
  for (const x of arr) {
    if (typeof x === "string") out.push(x);
    else if (isRecord(x) && typeof (x as UnknownRecord).slug === "string") out.push(String((x as UnknownRecord).slug));
  }
  return out;
}

async function fetchJSON(url: string, init?: RequestInit) {
  const r = await fetch(url, { cache: "no-store", next: { revalidate: 0 }, ...init });
  if (!r.ok) throw new Error(`HTTP ${r.status} ${r.statusText}`);
  return (await r.json()) as unknown;
}

export async function GET() {
  const site = "https://www.certifyquiz.com";
  const langs: Lang[] = ["it", "en", "fr", "es"];
  const baseByLang: Record<Lang, string> = {
    it: "certificazioni",
    en: "certifications",
    fr: "certifications",
    es: "certificaciones",
  };

  const API = (process.env.API_BASE_URL || "").replace(/\/+$/, "");
  const SECRET = (process.env.REVALIDATE_SECRET || "").trim();

  let source: "admin" | "public" | "empty" = "empty";
  let slugs: string[] = [];

  if (API) {
    // 1) Prova l'endpoint admin con doppia auth (header + querystring)
    try {
      const adminUrl =
        API + "/admin/all-cert-slugs" + (SECRET ? "?secret=" + encodeURIComponent(SECRET) : "");
      const data = await fetchJSON(adminUrl, {
        headers: SECRET
          ? {
              "x-revalidate-secret": SECRET,
              authorization: `Bearer ${SECRET}`,
            }
          : {},
      });
      if (Array.isArray(data)) {
        slugs = Array.from(new Set(data.filter((s): s is string => typeof s === "string"))).sort();
        source = "admin";
      } else {
        throw new Error("bad_admin_payload");
      }
    } catch {
      // 2) Fallback all'endpoint pubblico (potrebbe restare a 4)
      try {
        const pubUrl = API + "/certifications?locale=it&fields=slug";
        const data = await fetchJSON(pubUrl);
        slugs = Array.from(new Set(pickSlugs(data))).sort();
        source = "public";
      } catch {
        slugs = [];
        source = "empty";
      }
    }
  }

  const lastmod = new Date().toISOString();
  const lines: string[] = [];
  const push = (s: string) => lines.push(s);

  push('<?xml version="1.0" encoding="UTF-8"?>');
  push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
  push('        xmlns:xhtml="http://www.w3.org/1999/xhtml">');

  // Home
  push("  <url>");
  push(`    <loc>${site}/</loc>`);
  push(`    <lastmod>${lastmod}</lastmod>`);
  push("    <changefreq>weekly</changefreq>");
  push("    <priority>1.0</priority>");
  push("  </url>");

  // Lingue + liste
  for (const l of langs) {
    push("  <url>");
    push(`    <loc>${site}/${l}</loc>`);
    push(`    <lastmod>${lastmod}</lastmod>`);
    push("    <changefreq>weekly</changefreq>");
    push("    <priority>0.8</priority>");
    push("  </url>");

    push("  <url>");
    push(`    <loc>${site}/${l}/${baseByLang[l]}</loc>`);
    push(`    <lastmod>${lastmod}</lastmod>`);
    push("    <changefreq>weekly</changefreq>");
    push("    <priority>0.8</priority>");
    push("  </url>");
  }

  // 1 blocco per certificazione (loc IT) + hreflang reciproci + x-default
  for (const slug of slugs) {
    const map: Record<Lang, string> = {
      it: `${site}/it/${baseByLang.it}/${slug}`,
      en: `${site}/en/${baseByLang.en}/${slug}`,
      fr: `${site}/fr/${baseByLang.fr}/${slug}`,
      es: `${site}/es/${baseByLang.es}/${slug}`,
    };

    push("  <url>");
    push(`    <loc>${map.it}</loc>`);
    push(`    <lastmod>${lastmod}</lastmod>`);
    push("    <changefreq>weekly</changefreq>");
    push("    <priority>0.7</priority>");
    for (const l of langs) {
      push(`    <xhtml:link rel="alternate" hreflang="${l}" href="${map[l]}"/>`);
    }
    push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${map.it}"/>`);
    push("  </url>");
  }

  push("</urlset>");

  const xml = lines.join("\n");

  const headers = new Headers({
    "Content-Type": "application/xml; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Source": source,
    "X-Slugs-Len": String(slugs.length),
  });

  return new Response(xml, { headers });
}
