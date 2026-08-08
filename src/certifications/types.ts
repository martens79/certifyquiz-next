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

export type ExamDomain = Readonly<{
  /** Nome ufficiale pubblicato dall'ente certificatore. */
  name: string;
  /** Assente quando l'ente non pubblica un peso preciso. */
  percentage?: number | null;
  /** Range pubblicato dall'ente invece di un valore fisso (es. Microsoft: "25–30%").
   *  Se presente, ha priorità su `percentage` per la visualizzazione. */
  percentageMin?: number | null;
  percentageMax?: number | null;
}>;

export type ExamBlueprint = Readonly<{
  examName?: string | null;
  examCode?: string | null;
  examVersion?: string | null;
  provider?: string | null;
  officialSourceName: string;
  officialSourceUrl: string;
  /** Pagina riepilogativa dell'esame, distinta dal documento dei topic. */
  officialExamPageUrl?: string | null;
  /** Data ISO (YYYY-MM-DD) dell'ultima verifica della fonte ufficiale. */
  lastVerifiedAt?: string | null;
  /** Nota informativa breve (es. requisito di un secondo esame a scelta,
   *  o un cambio di programma già annunciato dall'ente). */
  note?: string | null;
  domains: ReadonlyArray<ExamDomain>;
  /** Sotto-esami quando la certificazione richiede più esami separati
   *  (es. CompTIA A+ Core 1 + Core 2, Cisco CCNP core + concentrazione).
   *  Se presente, ha priorità su `domains` per la visualizzazione nel box. */
  exams?: ReadonlyArray<Readonly<{
    label: string;
    examCode?: string | null;
    examVersion?: string | null;
    /** Sovrascrive officialSourceUrl/officialSourceName per questo esame, se l'ente pubblica un documento separato. */
    sourceUrl?: string | null;
    sourceName?: string | null;
    domains: ReadonlyArray<ExamDomain>;
  }>>;
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

  /** Stato editoriale del programma, distinto dalla disponibilità dei quiz. */
  lifecycleStatus?: "active" | "retired" | "legacy" | "needs-review";
  lifecycleNotice?: LocalizedText;

  metaTitle?: LocalizedText;
  metaDescription?: LocalizedText;

  /** Programma verificato dell'esame; se assente la relativa card non viene mostrata. */
  examBlueprint?: ExamBlueprint;

  

  // ✅ ora accetta sia il vecchio formato sia il nuovo con slug
  topics: ReadonlyArray<CertificationTopic>;

  extraContent?: ExtraContent;

  quizRoute: LocalizedRoute;
  backRoute: LocalizedRoute;

  // 🎨 opzionale (usato in alcune UI)
  color?: string;

  imageSide?: "left" | "right";
};
