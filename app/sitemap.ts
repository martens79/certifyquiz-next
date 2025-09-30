// src/app/sitemap.ts
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://www.certifyquiz.com";
  const now = new Date();

  const urls = [
    "/", "/it", "/en", "/fr", "/es",
    "/it/certificazioni",
    "/en/certifications",
    "/fr/certifications",
    "/es/certificaciones",
  ];

  return urls.map((path) => ({
    url: `${base}${path === "/" ? "" : path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.8,
  }));
}
