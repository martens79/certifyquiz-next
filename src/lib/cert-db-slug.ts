/** Slug pubblico/registry -> slug realmente usato dal backend (/certifications/by-slug/:slug). */
export const normalizeDbSlug = (slug: string) => {
  if (slug === "network-plus") return "comptia-network-plus";
  if (slug === "tensorflow") return "google-tensorflow";
  if (slug === "tensorflow-developer") return "google-tensorflow";
  // Il backend espone Python come "python-developer" ("python" -> not_found) e
  // C# come "microsoft-csharp" ("csharp" -> not_found).
  if (slug === "csharp") return "microsoft-csharp";
  return slug;
};
