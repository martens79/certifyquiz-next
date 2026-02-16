import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com").replace(/\/+$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "À propos | CertifyQuiz",
  description: "Découvrez qui a créé CertifyQuiz et la mission du projet.",
  alternates: {
    canonical: `${SITE}/fr/a-propos`,
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
    title: "À propos | CertifyQuiz",
    description: "Découvrez qui a créé CertifyQuiz et pourquoi ce projet existe.",
    url: `${SITE}/fr/a-propos`,
    siteName: "CertifyQuiz",
    locale: "fr-FR",
  },
  twitter: { card: "summary_large_image" },
};

export default function AProposFR() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10 text-slate-800">
      <h1 className="text-2xl font-bold">À propos</h1>

      <Section>
        <p>Salut, je m’appelle Lorenzo.</p>
        <p className="mt-3">
          Je suis technicien hardware et développeur logiciel, avec une expérience concrète dans l’IT.
        </p>
        <p className="mt-3">
          J’ai obtenu la certification ECDL et j’ai étudié pour des examens techniques comme Network+, en constatant
          directement les difficultés réelles de la préparation aux certifications IT.
        </p>
        <p className="mt-3">
          C’est de là qu’est né CertifyQuiz : des quiz d’entraînement structurés, des explications claires et des
          parcours organisés pour arriver à l’examen avec plus de confiance.
        </p>
      </Section>

      <Section title="Mission">
        Rendre la préparation aux certifications IT plus claire, plus structurée et plus accessible. Pas pour remplacer
        les ressources officielles, mais pour les compléter avec un entraînement pratique afin d’évaluer votre niveau réel.
      </Section>

      <Section title="Valeurs du projet">
        <ul className="list-disc ml-5 space-y-1">
          <li>
            <b>Clarté</b> : chaque question doit aider à comprendre, pas seulement à mémoriser.
          </li>
          <li>
            <b>Structure</b> : des quiz alignés sur les objectifs officiels et des parcours cohérents.
          </li>
          <li>
            <b>Accessibilité</b> : les examens sont presque toujours en anglais ; étudier ne doit pas être un mur.
          </li>
          <li>
            <b>Amélioration continue</b> : contenu amélioré au fil du temps (aussi grâce aux retours).
          </li>
          <li>
            <b>Indépendance</b> : projet indépendant, non affilié aux éditeurs officiels.
          </li>
        </ul>
      </Section>

      <Section title="Vous voulez commencer ?">
        <p>Si vous voulez vous tester, commencez par un quiz et vérifiez votre niveau réel de préparation.</p>
        <Link
          href="/fr/quiz-home"
          className="mt-3 inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-bold text-white shadow-sm hover:bg-blue-700 transition"
        >
          🚀 Commencer un quiz
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
