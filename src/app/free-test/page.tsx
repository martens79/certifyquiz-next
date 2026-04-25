import FreeTestPageContent from "@/components/newsletter/FreeTestPageContent";

export const metadata = {
  title: "Free IT Certification Test | CertifyQuiz",
  description:
    "Take a free IT certification practice test and get useful quiz questions, explanations and study tips.",
};

export default async function FreeTestPage({
  searchParams,
}: {
  searchParams?: Promise<{
    cert?: string;
    topic?: string;
    source?: string;
    quiz?: string;
  }>;
}) {
  const params = await searchParams;

  return (
    <FreeTestPageContent
      lang="en"
      cert={params?.cert ?? "general"}
      topic={params?.topic ?? "general"}
      source={params?.source ?? "free-test"}
      quizHref={params?.quiz ?? ""}
    />
  );
}