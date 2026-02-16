import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com").replace(/\/+$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Chi sono | CertifyQuiz",
  description: "Scopri chi ha creato CertifyQuiz e la missione del progetto.",
  alternates: {
    canonical: `${SITE}/it/chi-sono`,
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
    title: "Chi sono | CertifyQuiz",
    description: "Scopri chi ha creato CertifyQuiz e perché nasce il progetto.",
    url: `${SITE}/it/chi-sono`,
    siteName: "CertifyQuiz",
    locale: "it-IT",
  },
  twitter: { card: "summary_large_image" },
};

export default function ChiSonoIT() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10 text-slate-800">
      <h1 className="text-2xl font-bold">Chi sono</h1>

      <Section>
        <p>Ciao, sono Lorenzo.</p>
        <p className="mt-3">
          Sono un tecnico di sviluppo software e tecnico hardware, con esperienza pratica nel mondo IT.
        </p>
        <p className="mt-3">
          Nel mio percorso ho conseguito la certificazione ECDL e ho studiato per certificazioni tecniche come Network+,
          confrontandomi con le difficoltà reali della preparazione agli esami IT.
        </p>
        <p className="mt-3">
          Da qui nasce CertifyQuiz: una piattaforma di quiz strutturati, con spiegazioni chiare e percorsi organizzati
          per aiutare aspiranti tecnici e professionisti IT ad arrivare all’esame con maggiore sicurezza.
        </p>
      </Section>

      <Section title="La missione">
        Rendere la preparazione alle certificazioni IT più chiara, strutturata e accessibile. Non per sostituire il
        materiale ufficiale, ma per affiancarlo con uno strumento pratico che ti aiuti a capire davvero a che punto sei.
      </Section>

      <Section title="I valori del progetto">
        <ul className="list-disc ml-5 space-y-1">
          <li><b>Chiarezza</b>: ogni domanda deve aiutare a capire, non solo a memorizzare.</li>
          <li><b>Struttura</b>: quiz basati su programmi ufficiali e percorsi coerenti.</li>
          <li><b>Accessibilità</b>: le certificazioni sono quasi sempre in inglese; lo studio non deve essere un muro.</li>
          <li><b>Miglioramento continuo</b>: contenuti aggiornati e migliorati nel tempo (anche grazie ai feedback).</li>
          <li><b>Indipendenza</b>: progetto indipendente, non affiliato ai vendor ufficiali.</li>
        </ul>
      </Section>

      <Section title="Vuoi iniziare?">
        <p>Se vuoi metterti alla prova, inizia con un quiz e verifica il tuo livello reale di preparazione.</p>
        <Link
          href="/it/quiz-home"
          className="mt-3 inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-bold text-white shadow-sm hover:bg-blue-700 transition"
        >
          🚀 Inizia un quiz
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
