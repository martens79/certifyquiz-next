import type { PortableTextBlock } from "@portabletext/types";
import type { Locale } from "./i18n";

/** Projection returned by articleBySlugLang; older documents have no audio. */
export type SanityArticle = {
  id: string;
  slug: string;
  title: string;
  lang: Locale;
  excerpt?: string | null;
  category?: string | null;
  publishedAt?: string | null;
  date?: string | null;
  coverUrl?: string | null;
  audioUrl?: string | null;
  body?: PortableTextBlock[] | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
};
