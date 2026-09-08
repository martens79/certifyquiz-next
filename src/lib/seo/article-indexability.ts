function collectStrings(value: unknown, out: string[]): void {
  if (typeof value === "string") { out.push(value); return; }
  if (Array.isArray(value)) { for (const item of value) collectStrings(item, out); return; }
  if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      if (!["_key", "_type", "asset", "markDefs"].includes(key)) collectStrings(item, out);
    }
  }
}

export function articleWordCount(body: unknown): number {
  const strings: string[] = [];
  collectStrings(body, strings);
  return strings.join(" ").trim().split(/\s+/).filter(Boolean).length;
}

export function isArticleIndexable(article: { title?: string | null; excerpt?: string | null; body?: unknown }): boolean {
  return Boolean(article.title?.trim()) && Boolean(article.excerpt?.trim()) && articleWordCount(article.body) >= 500;
}
