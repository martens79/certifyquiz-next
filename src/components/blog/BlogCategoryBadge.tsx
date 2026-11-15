import React from "react";
import type { Locale } from "@/lib/i18n";
import { diaryLabels } from "@/lib/blog-categories";

export default function BlogCategoryBadge({ category, lang }: {
  category?: string | null;
  lang: Locale;
}) {
  if (category !== "diary") return null;
  return <span className="inline-block rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">{diaryLabels[lang]}</span>;
}
