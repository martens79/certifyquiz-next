import { groq } from "next-sanity";

export const articlesListByLang = groq`
*[
  _type == "article" &&
  !(_id in path("drafts.**")) &&
  lang == $lang &&
  seo.noindex != true &&
  defined(coalesce(publishedAt, date)) &&
  dateTime(coalesce(publishedAt, date)) <= dateTime(now())
] | order(coalesce(publishedAt, date) desc)[0...20]{
  "id": _id,
  "slug": slug.current,
  title,
  excerpt,
  lang,
  category,
  "publishedAt": coalesce(publishedAt, date),
  "coverUrl": coalesce(coverImage.asset->url, cover.asset->url)
}`;

export const articleBySlugLang = groq`
*[
  _type == "article" &&
  !(_id in path("drafts.**")) &&
  slug.current == $slug &&
  lang == $lang &&
  defined(coalesce(publishedAt, date)) &&
  dateTime(coalesce(publishedAt, date)) <= dateTime(now())
][0]{
  "id": _id,
  "slug": slug.current,
  title,
  excerpt,
  lang,
  category,
  "publishedAt": coalesce(publishedAt, date),
  "coverUrl": coalesce(coverImage.asset->url, cover.asset->url),

  // ✅ nuovo + fallback vecchio
  "body": coalesce(body, content),

  "seoTitle": seo.title,
  "seoDescription": description
}`;
