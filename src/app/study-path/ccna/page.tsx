import CcnaStudyPath from "@/components/quiz/CcnaStudyPath";

import { studyCopy } from "@/lib/ccna-study-path";

// English SEO routes live at the root; middleware canonicalizes /en/* here.
export const metadata = {
  title: `${studyCopy.en.title} | CertifyQuiz`,
  description: studyCopy.en.intro,
  robots: { index: false, follow: true },
};

export default function Page() {
  return <CcnaStudyPath lang="en" />;
}
