import ReviewErrorsClient from "./review-errors-client";

type SearchParams = {
  certificationId?: string;
  topicId?: string;
  limit?: string;
};

export default function Page({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  return (
    <ReviewErrorsClient
      lang="en"
      certificationId={searchParams?.certificationId}
      topicId={searchParams?.topicId}
      limit={searchParams?.limit}
    />
  );
}
