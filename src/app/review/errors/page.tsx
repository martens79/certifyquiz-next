// src/app/review/errors/page.tsx
import ReviewErrorsClient from "./review-errors-client";

type SearchParams = {
  certificationId?: string;
  topicId?: string;
  limit?: string;
};

// ✅ Next 15.5.x nel tuo setup: searchParams è Promise
type PageProps = {
  searchParams?: Promise<SearchParams>;
};

export default async function Page(props: PageProps) {
  const sp = (await props.searchParams) ?? {};

  return (
    <ReviewErrorsClient
      lang="en"
      certificationId={sp.certificationId}
      topicId={sp.topicId}
      limit={sp.limit}
    />
  );
}
