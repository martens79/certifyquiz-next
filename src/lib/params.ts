// src/lib/params.ts
export type Lang = "it" | "en" | "fr" | "es";

export type LangParams = Promise<{ lang: Lang }>;

export async function unwrap<T extends object>(p: Promise<T>): Promise<T> {
  return p;
}
