// app/sitemap.ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.certifyquiz.com";
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/it`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/en`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/fr`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/es`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];
}
