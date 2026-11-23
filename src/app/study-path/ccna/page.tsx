import CcnaStudyPath from "@/components/quiz/CcnaStudyPath";

// English SEO routes live at the root; middleware canonicalizes /en/* here.
export const metadata = {
  title: "CCNA Study Path | CertifyQuiz",
  robots: { index: false, follow: true },
};

export default function Page() {
  return <CcnaStudyPath lang="en" />;
}
