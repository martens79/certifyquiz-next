import { notFound } from "next/navigation";
import CcnaStudyPath from "@/components/quiz/CcnaStudyPath";
import type { StudyLang } from "@/lib/ccna-study-path";
export const metadata = {
  title: "CCNA Study Path | CertifyQuiz",
  robots: { index: false, follow: true },
};
export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!["it", "en", "fr", "es"].includes(lang)) notFound();
  return <CcnaStudyPath lang={lang as StudyLang} />;
}
