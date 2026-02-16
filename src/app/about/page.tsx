import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com").replace(/\/+$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "About | CertifyQuiz",
  description: "Learn who created CertifyQuiz and the mission behind the project.",
  alternates: {
    canonical: `${SITE}/about`,
    languages: {
      "it-IT": `${SITE}/it/chi-sono`,
      "en-US": `${SITE}/about`,
      "fr-FR": `${SITE}/fr/a-propos`,
      "es-ES": `${SITE}/es/sobre-mi`,
      "x-default": `${SITE}/it/chi-sono`,
    },
  },
  openGraph: {
    type: "article",
    title: "About | CertifyQuiz",
    description: "Learn who created CertifyQuiz and why this project exists.",
    url: `${SITE}/about`,
    siteName: "CertifyQuiz",
    locale: "en-US",
  },
  twitter: { card: "summary_large_image" },
};

export default function AboutEN() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10 text-slate-800">
      <h1 className="text-2xl font-bold">About</h1>

      <Section>
        <p>Hi, I’m Lorenzo.</p>
        <p className="mt-3">
          I’m a software developer and hardware technician with hands-on IT experience.
        </p>
        <p className="mt-3">
          I earned the ECDL certification and studied for technical exams such as Network+, experiencing first-hand how
          difficult IT certification prep can be.
        </p>
        <p className="mt-3">
          That’s why I built CertifyQuiz: structured practice quizzes, clear explanations, and organized paths to help
          you approach your exam with more confidence.
        </p>
      </Section>

      <Section title="Mission">
        Make IT certification prep clearer, more structured, and more accessible. Not to replace official resources, but
        to support them with practical training so you can measure your real readiness.
      </Section>

      <Section title="Project values">
        <ul className="list-disc ml-5 space-y-1">
          <li><b>Clarity</b>: each question should help you understand, not just memorize.</li>
          <li><b>Structure</b>: quizzes aligned with official objectives and coherent paths.</li>
          <li><b>Accessibility</b>: exams are almost always in English; studying shouldn’t feel like a wall.</li>
          <li><b>Continuous improvement</b>: content refined over time (also through user feedback).</li>
          <li><b>Independence</b>: an independent project, not affiliated with official vendors.</li>
        </ul>
      </Section>

      <Section title="Ready to start?">
        <p>If you want to test yourself, start with a quiz and check your real level of preparation.</p>
        <Link
          href="/quiz-home"

          className="mt-3 inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-bold text-white shadow-sm hover:bg-blue-700 transition"
        >
          🚀 Start a quiz
        </Link>
      </Section>
    </main>
  );
}

function Section({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="mt-6">
      {title && <h2 className="text-lg font-semibold">{title}</h2>}
      <div className="mt-2 text-sm leading-6">{children}</div>
    </section>
  );
}
