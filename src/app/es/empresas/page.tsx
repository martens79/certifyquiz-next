import type { Metadata } from "next";
import { spaceGrotesk } from "@/fonts/space-grotesk";
import { Users, Languages, LifeBuoy, Mail, ArrowRight, Building2 } from "lucide-react";
import FaqAccordion from "@/components/team/FaqAccordion";

const CONTACT_EMAIL = "certifyquiz@gmail.com";

export const metadata: Metadata = {
  title: "CertifyQuiz empresas — Certificaciones IT para grupos pequeños",
  description:
    "Preparación de certificaciones IT para grupos pequeños, con accesos individuales e inicio asistido. Solicita información para tu grupo.",
};

const OFFER = [
  {
    icon: Users,
    title: "Accesos individuales",
    body: "Cada persona tiene su propia cuenta y su propio progreso: estudia a su ritmo, sin compartir credenciales.",
  },
  {
    icon: Languages,
    title: "Certificaciones IT en cuatro idiomas",
    body: "Cuestionarios, escenarios de examen y fichas de repaso en italiano, inglés, francés y español, para certificaciones como AWS, Cisco, CompTIA, Microsoft e ISC2.",
  },
  {
    icon: LifeBuoy,
    title: "Inicio asistido",
    body: "Al principio te ayudamos a elegir la certificación y a poner en marcha a las personas de tu grupo.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Nos escribes",
    body: "Indícanos cuántas personas forman el grupo y en qué certificación queréis trabajar.",
  },
  {
    n: "02",
    title: "Definimos el inicio",
    body: "Te enviamos una propuesta para el grupo con condiciones, plazos y forma de acceso.",
  },
  {
    n: "03",
    title: "Cada uno estudia con su propia cuenta",
    body: "Cada persona se prepara de forma autónoma con cuestionarios y fichas de repaso, con progreso individual.",
  },
];

const FAQS = [
  {
    q: "¿Puedo probar la plataforma antes de escribiros?",
    a: "Sí: muchos cuestionarios son gratuitos en el sitio, así que puedes hacerte una idea del nivel y del formato antes de contactarnos.",
  },
  {
    q: "¿Cada persona tiene una cuenta separada?",
    a: "Sí. Cada persona accede con su propia cuenta y ve su propio progreso.",
  },
  {
    q: "¿El responsable puede ver el progreso del grupo?",
    a: "No: por ahora no hay un panel para el responsable ni informes sobre cada persona. Cada uno ve solo sus propios resultados.",
  },
  {
    q: "¿Qué certificaciones están disponibles?",
    a: "Las que figuran en el sitio, en italiano, inglés, francés y español. Dinos cuál necesitas y te confirmaremos qué podemos ofrecer a tu grupo.",
  },
  {
    q: "¿Cómo funcionan los precios y la facturación?",
    a: "No hay una lista de precios pública: acordamos las condiciones y la facturación en la propuesta para tu grupo.",
  },
];

function mailto(subject: string) {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}

export default function TeamLandingPageES() {
  return (
    <main className={`${spaceGrotesk.variable} bg-white`}>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0B1220]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(245,166,35,0.08),_transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 lg:py-28">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-amber-300">
              <Building2 className="h-3 w-3" />
              CertifyQuiz para empresas
            </span>
            <h1
              style={{ fontFamily: "var(--font-display)" }}
              className="mt-5 text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl"
            >
              Preparación de certificaciones IT para grupos pequeños
            </h1>
            <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-slate-300">
              Cuestionarios, escenarios de examen y fichas de repaso para las certificaciones IT más demandadas, con
              accesos individuales e inicio asistido para tu grupo.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={mailto("Información para mi grupo — CertifyQuiz")}
                className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-[14px] font-semibold text-[#0B1220] transition hover:bg-amber-300"
              >
                Solicita información para tu grupo
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#como-funciona"
                className="text-[14px] font-medium text-slate-300 underline-offset-4 hover:text-white hover:underline"
              >
                Cómo funciona →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2
          style={{ fontFamily: "var(--font-display)" }}
          className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl"
        >
          Qué encontrarás
        </h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {OFFER.map(({ icon: Icon, title, body }) => (
            <div key={title}>
              <Icon className="h-5 w-5 text-amber-500" />
              <h3 className="mt-3 text-[15px] font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-slate-600">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="como-funciona" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2
            style={{ fontFamily: "var(--font-display)" }}
            className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl"
          >
            Cómo funciona
          </h2>
          <div className="mt-10 grid gap-10 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n}>
                <span className="font-mono text-[13px] text-amber-500">{s.n}</span>
                <h3 className="mt-2 text-[16px] font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-slate-600">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <h2
          style={{ fontFamily: "var(--font-display)" }}
          className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl"
        >
          Preguntas frecuentes
        </h2>
        <div className="mt-8">
          <FaqAccordion items={FAQS} />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-[#0B1220] py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2
            style={{ fontFamily: "var(--font-display)" }}
            className="text-2xl font-semibold tracking-tight text-white sm:text-3xl"
          >
            Solicita información para tu grupo
          </h2>
          <p className="mt-4 text-[15px] text-slate-300">
            Cuéntanos cuántos sois y en qué certificación queréis trabajar: te responderemos con una propuesta para tu
            grupo.
          </p>
          <a
            href={mailto("Información para mi grupo — CertifyQuiz")}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-amber-400 px-7 py-3 text-[14px] font-semibold text-[#0B1220] transition hover:bg-amber-300"
          >
            <Mail className="h-4 w-4" />
            Escríbenos sobre tu grupo
          </a>
        </div>
      </section>
    </main>
  );
}
