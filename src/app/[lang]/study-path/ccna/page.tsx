import { notFound } from "next/navigation";
import CcnaStudyPath from "@/components/quiz/CcnaStudyPath";
import { studyCopy, type StudyLang } from "@/lib/ccna-study-path";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const c = studyCopy[(lang in studyCopy ? lang : "it") as StudyLang];
  return {
    title: `${c.title} | CertifyQuiz`,
    description: c.intro,
    robots: { index: false, follow: true },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!["it", "en", "fr", "es"].includes(lang)) notFound();
  return <CcnaStudyPath lang={lang as StudyLang} />;
}
