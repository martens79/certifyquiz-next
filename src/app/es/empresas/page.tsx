import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import {
  CheckCircle2,
  Users,
  BarChart3,
  Mail,
  ArrowRight,
  FileSpreadsheet,
  Building2,
} from "lucide-react";
import TeamDashboardPreview from "@/components/team/TeamDashboardPreview";
import FaqAccordion from "@/components/team/FaqAccordion";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const CONTACT_EMAIL = "certifyquiz@gmail.com";

export const metadata: Metadata = {
  title: "CertifyQuiz Team — Certificaciones IT para empresas desde €49/mes",
  description:
    "Asigna certificaciones AWS, Cisco, CompTIA y otras 30+ a tu equipo IT y sigue el progreso en tiempo real. Planes para empresas desde €49/mes, factura única.",
};

const STATUS_LABELS = {
  passed: "Aprobado",
  "in-progress": "En curso",
  behind: "Atrasado",
} as const;

const MEMBERS = [
  { initials: "MR", name: "Marco R.", cert: "AWS Solutions Architect", target: 92, status: "passed" as const },
  { initials: "GS", name: "Giulia S.", cert: "Cisco CCNA", target: 64, status: "in-progress" as const },
  { initials: "AF", name: "Andrea F.", cert: "Security+", target: 38, status: "behind" as const },
  { initials: "LC", name: "Laura C.", cert: "ISC2 CC", target: 100, status: "passed" as const },
];

const FAQS = [
  {
    q: "¿Puedo probarlo antes de pagar?",
    a: "Sí. Escríbenos y activamos una prueba gratuita de 7 días para tu equipo, las mismas condiciones que el plan Premium individual.",
  },
  {
    q: "¿Cada persona del equipo tiene su propia cuenta?",
    a: "Sí, cada miembro tiene su propio acceso y progreso individual. El responsable de la empresa ve un panel agregado de todo el equipo.",
  },
  {
    q: "¿Qué certificaciones están incluidas?",
    a: "Las 33+ certificaciones disponibles en CertifyQuiz: AWS, Cisco, Microsoft, CompTIA, ISC2, CEH y muchas más, en italiano, inglés, francés y español.",
  },
  {
    q: "¿Cómo funciona la facturación?",
    a: "Una factura única para la empresa, sin múltiples tarjetas de crédito que gestionar. Facturación anual disponible bajo petición.",
  },
];

const PAIN_POINTS = [
  {
    title: "Cursos de miles de euros, pocos terminados",
    body: "Los cursos tradicionales cuestan mucho y se abandonan a medio camino. Nadie sabe realmente en qué punto está el equipo.",
  },
  {
    title: "Cero visibilidad del equipo",
    body: "¿Quién está listo para el examen de AWS? ¿Quién va atrasado en Cisco? Sin datos, lo descubres demasiado tarde.",
  },
  {
    title: "Renovaciones perdidas entre correos",
    body: "Los plazos de renovación de certificaciones se pierden en bandejas de entrada saturadas, y te enteras cuando ya han caducado.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Invita a tu equipo",
    body: "Envía un enlace de invitación: cada persona crea su cuenta vinculada a la empresa en segundos.",
  },
  {
    n: "02",
    title: "Asigna las certificaciones",
    body: "Elige las rutas adecuadas por rol o persona entre las 33+ certificaciones disponibles: AWS, Cisco, CompTIA, ISC2 y más.",
  },
  {
    n: "03",
    title: "Sigue el progreso",
    body: "Un panel muestra puntuaciones, intentos y puntos débiles de todo el equipo, en tiempo real.",
  },
];

const PLANS = [
  {
    name: "Team Starter",
    price: "€49",
    period: "/mes",
    seats: "Hasta 10 personas",
    features: ["Todas las certificaciones Premium", "Panel de progreso del equipo", "Factura única para la empresa"],
    cta: "Solicitar una demo",
    highlighted: false,
  },
  {
    name: "Team Pro",
    price: "€99",
    period: "/mes",
    seats: "Hasta 25 personas",
    features: [
      "Todo lo de Team Starter",
      "Asignación de certificaciones por rol",
      "Informes exportables (CSV/PDF)",
      "Soporte prioritario",
    ],
    cta: "Solicitar una demo",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "A medida",
    period: "",
    seats: "Más de 25 personas",
    features: ["Gestor de cuenta dedicado", "Facturación centralizada", "Incorporación asistida"],
    cta: "Contáctanos",
    highlighted: false,
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
        <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-amber-300">
              <Building2 className="h-3 w-3" />
              CertifyQuiz para empresas
            </span>
            <h1
              style={{ fontFamily: "var(--font-display)" }}
              className="mt-5 text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl"
            >
              ¿Sabes realmente en qué punto está tu equipo de IT con las certificaciones?
            </h1>
            <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-slate-300">
              Asigna rutas de certificación IT a tu equipo — AWS, Cisco, CompTIA y 30+ más — y sigue el progreso en
              tiempo real. Se acabaron los cursos a medias o los plazos de renovación perdidos entre correos.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={mailto("Demo CertifyQuiz Team")}
                className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-[14px] font-semibold text-[#0B1220] transition hover:bg-amber-300"
              >
                Solicitar una demo
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#planes"
                className="text-[14px] font-medium text-slate-300 underline-offset-4 hover:text-white hover:underline"
              >
                Ver planes →
              </a>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <TeamDashboardPreview
              teamLabel="Equipo DevOps · 8 miembros"
              statusLabels={STATUS_LABELS}
              members={MEMBERS}
            />
          </div>
        </div>
      </section>

      {/* PAIN POINTS */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2
          style={{ fontFamily: "var(--font-display)" }}
          className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl"
        >
          Si gestionas un equipo IT, esto te sonará
        </h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {PAIN_POINTS.map((p) => (
            <div key={p.title}>
              <h3 className="text-[15px] font-semibold text-slate-900">{p.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-slate-600">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-slate-50 py-20">
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

      {/* PRICING */}
      <section id="planes" className="mx-auto max-w-6xl px-6 py-20">
        <h2
          style={{ fontFamily: "var(--font-display)" }}
          className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl"
        >
          Planes para empresas
        </h2>
        <p className="mt-3 max-w-xl text-[15px] text-slate-600">
          Una factura única, sin múltiples tarjetas que perseguir.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col rounded-2xl border p-7 ${
                plan.highlighted
                  ? "border-amber-300 bg-amber-50/40 shadow-lg shadow-amber-100"
                  : "border-slate-200 bg-white"
              }`}
            >
              {plan.highlighted && (
                <span className="mb-3 inline-block w-fit rounded-full bg-amber-400 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#0B1220]">
                  Más elegido
                </span>
              )}
              <h3 className="text-[15px] font-semibold text-slate-900">{plan.name}</h3>
              <p className="mt-1 font-mono text-[12px] text-slate-500">{plan.seats}</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span style={{ fontFamily: "var(--font-display)" }} className="text-3xl font-semibold text-slate-900">
                  {plan.price}
                </span>
                <span className="text-[13px] text-slate-500">{plan.period}</span>
              </div>
              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[14px] text-slate-700">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={mailto(`Consulta de plan — ${plan.name}`)}
                className={`mt-8 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-[13px] font-semibold transition ${
                  plan.highlighted
                    ? "bg-[#0B1220] text-white hover:bg-[#16243d]"
                    : "border border-slate-300 text-slate-900 hover:border-slate-400"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* TRUST / VALUE STRIP */}
      <section className="border-y border-slate-100 bg-slate-50 py-14">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 sm:grid-cols-3">
          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 shrink-0 text-amber-500" />
            <p className="text-[14px] text-slate-700">33+ certificaciones IT en italiano, inglés, francés y español</p>
          </div>
          <div className="flex items-start gap-3">
            <BarChart3 className="h-5 w-5 shrink-0 text-amber-500" />
            <p className="text-[14px] text-slate-700">Panel actualizado en tiempo real para cada miembro del equipo</p>
          </div>
          <div className="flex items-start gap-3">
            <FileSpreadsheet className="h-5 w-5 shrink-0 text-amber-500" />
            <p className="text-[14px] text-slate-700">Factura única para la empresa, sin múltiples tarjetas que gestionar</p>
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
            Hablemos 15 minutos
          </h2>
          <p className="mt-4 text-[15px] text-slate-300">
            Cuéntanos cuántas personas tiene tu equipo y en qué certificaciones queréis trabajar. Te respondemos en
            un día laborable.
          </p>
          <a
            href={mailto("Demo CertifyQuiz Team")}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-amber-400 px-7 py-3 text-[14px] font-semibold text-[#0B1220] transition hover:bg-amber-300"
          >
            <Mail className="h-4 w-4" />
            Escríbenos para una demo
          </a>
        </div>
      </section>
    </main>
  );
}
