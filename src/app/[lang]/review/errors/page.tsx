import type { Locale } from "@/lib/i18n";
import ReviewErrorsClient from "./review-errors-client";

export default function Page({
  params,
  searchParams,
}: {
  params: { lang: Locale };
  searchParams?: { certificationId?: string; topicId?: string; limit?: string };
}) {
  return (
    <ReviewErrorsClient
      lang={params.lang}
      certificationId={searchParams?.certificationId ?? ""}
      topicId={searchParams?.topicId ?? ""}
      limit={searchParams?.limit ?? "20"}
    />
  );
}
