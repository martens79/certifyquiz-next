// src/certifications/types.ts

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

  // 👇 accetta array readonly (compatibile con `as const`)
  topics: ReadonlyArray<LocalizedText>;

  extraContent?: ExtraContent;

  quizRoute: LocalizedRoute;
  backRoute: LocalizedRoute;

  // 🎨 opzionale (usato in alcune UI)
  color?: string;

  imageSide?: "left" | "right";
};
