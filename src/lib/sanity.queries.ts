import { groq } from "next-sanity";

export const postsListByLang = groq`
*[_type == "post" && lang == $lang] | order(publishedAt desc)[0...20]{
  "id": _id,
  "slug": slug.current,
  title, excerpt, lang, publishedAt,
  "coverUrl": cover.asset->url
}`;

export const postBySlugLang = groq`
*[_type == "post" && slug.current == $slug && lang == $lang][0]{
  "id": _id,
  "slug": slug.current,
  title, excerpt, lang, publishedAt,
  "coverUrl": cover.asset->url,
  body
}`;
