import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com").replace(/\/+$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Sobre mí | CertifyQuiz",
  description: "Descubre quién creó CertifyQuiz y la misión del proyecto.",
  alternates: {
    canonical: `${SITE}/es/sobre-mi`,
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
    title: "Sobre mí | CertifyQuiz",
    description: "Descubre quién creó CertifyQuiz y por qué existe este proyecto.",
    url: `${SITE}/es/sobre-mi`,
    siteName: "CertifyQuiz",
    locale: "es-ES",
  },
  twitter: { card: "summary_large_image" },
};

export default function SobreMiES() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10 text-slate-800">
      <h1 className="text-2xl font-bold">Sobre mí</h1>

      <Section>
        <p>Hola, soy Lorenzo.</p>
        <p className="mt-3">
          Soy técnico de hardware y desarrollador de software, con experiencia práctica en el mundo IT.
        </p>
        <p className="mt-3">
          He obtenido la certificación ECDL y he estudiado para exámenes técnicos como Network+, viviendo de primera mano
          las dificultades reales de preparar certificaciones IT.
        </p>
        <p className="mt-3">
          De ahí nace CertifyQuiz: quizzes estructurados, explicaciones claras y rutas organizadas para ayudarte a llegar
          al examen con más confianza.
        </p>
      </Section>

      <Section title="Misión">
        Hacer que la preparación de certificaciones IT sea más clara, estructurada y accesible. No para sustituir el
        material oficial, sino para complementarlo con práctica real y medir tu nivel.
      </Section>

      <Section title="Valores del proyecto">
        <ul className="list-disc ml-5 space-y-1">
          <li>
            <b>Claridad</b>: cada pregunta debe ayudarte a entender, no solo memorizar.
          </li>
          <li>
            <b>Estructura</b>: quizzes alineados con objetivos oficiales y rutas coherentes.
          </li>
          <li>
            <b>Accesibilidad</b>: los exámenes son casi siempre en inglés; estudiar no debe ser una pared.
          </li>
          <li>
            <b>Mejora continua</b>: contenido refinado con el tiempo (también con feedback).
          </li>
          <li>
            <b>Independencia</b>: proyecto independiente, no afiliado a vendors oficiales.
          </li>
        </ul>
      </Section>

      <Section title="¿Quieres empezar?">
        <p>Si quieres ponerte a prueba, empieza con un quiz y comprueba tu nivel real de preparación.</p>
        <Link
          href="/es/quiz-home"
          className="mt-3 inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-bold text-white shadow-sm hover:bg-blue-700 transition"
        >
          🚀 Empezar un quiz
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
