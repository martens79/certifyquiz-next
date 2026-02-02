// src/app/[lang]/review/errors/page.tsx
import ReviewErrorsClient from "./review-errors-client";

// Se hai già un tipo Locale comune, usa quello.
// Altrimenti questo va bene:
type Locale = "it" | "en" | "fr" | "es";

type SearchParams = {
  certificationId?: string;
  topicId?: string;
  limit?: string;
};

// ✅ Next 15.5.x: params (e searchParams) possono essere Promise
type PageProps = {
  params: Promise<{ lang: Locale }>;
  searchParams?: Promise<SearchParams>;
};

export default async function Page(props: PageProps) {
  const { lang } = await props.params;
  const sp = (await props.searchParams) ?? {};

  return (
    <ReviewErrorsClient
      lang={lang}
      certificationId={sp.certificationId}
      topicId={sp.topicId}
      limit={sp.limit}
    />
  );
}
