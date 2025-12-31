import { groq } from "next-sanity";

export const articlesListByLang = groq`
*[_type == "article" && lang == $lang] | order(coalesce(publishedAt, date) desc)[0...20]{
  "id": _id,
  "slug": slug.current,
  title,
  excerpt,
  lang,
  "publishedAt": coalesce(publishedAt, date),
  "coverUrl": coalesce(coverImage.asset->url, cover.asset->url)
}`;

export const articleBySlugLang = groq`
*[_type == "article" && slug.current == $slug && lang == $lang][0]{
  "id": _id,
  "slug": slug.current,
  title,
  excerpt,
  lang,
  "publishedAt": coalesce(publishedAt, date),
  "coverUrl": coalesce(coverImage.asset->url, cover.asset->url),

  // ✅ nuovo + fallback vecchio
  "body": coalesce(body, content)
}`;
