// src/certifications/types.ts

// Lingue supportate
export type Lang = "it" | "en" | "fr" | "es";

// Oggetto localizzato immutabile
export type LocalizedText = Readonly<{
  it: string;
  en: string;
  fr: string;
  es: string;
}>;

export type LocalizedRoute = Readonly<{
  it: string;
  en: string;
  fr: string;
  es: string;
}>;

// ✅ Nuovo formato topic con title + slug
export type TopicLinkItem = Readonly<{
  title: LocalizedText | string;
  slug?: Partial<Record<Lang, string>>;
}>;

// ✅ Supporta:
// - formato vecchio: LocalizedText
// - eventuale stringa semplice
// - formato nuovo: { title, slug }
export type CertificationTopic = LocalizedText | string | TopicLinkItem;

export type ExtraContent = {
  // liste immutabili per ogni lingua
  learn?: Readonly<Record<keyof LocalizedText, ReadonlyArray<string>>>;
  whyChoose?: Readonly<Record<keyof LocalizedText, ReadonlyArray<string>>>;
  examReference?: Readonly<
    Record<
      keyof LocalizedText,
      ReadonlyArray<Readonly<{ text: string; url: string }>>
    >
  >;
  faq?: Readonly<
    Record<
      keyof LocalizedText,
      ReadonlyArray<Readonly<{ q: string; a: string }>>
    >
  >;

  // ✅ NEW: blocco SEO (risponde a "current certification", "2021", "2023")
  currentCertification?: Readonly<Record<keyof LocalizedText, ReadonlyArray<string>>>;
};

export type CertificationData = {
  // 🔢 opzionale, valorizzato via mapping ids.ts
  id?: number;

  slug: string;
  imageUrl: string;
  officialUrl: string;
  companyProductsUrl?: string;

  title: LocalizedText;
  level: LocalizedText;
  description: LocalizedText;

  // ✅ ora accetta sia il vecchio formato sia il nuovo con slug
  topics: ReadonlyArray<CertificationTopic>;

  extraContent?: ExtraContent;

  quizRoute: LocalizedRoute;
  backRoute: LocalizedRoute;

  // 🎨 opzionale (usato in alcune UI)
  color?: string;

  imageSide?: "left" | "right";
};