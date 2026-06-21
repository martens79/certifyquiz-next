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
  title: "CertifyQuiz Team — IT Certifications for Businesses from €49/month",
  description:
    "Assign AWS, Cisco, CompTIA and 30+ other certifications to your IT team and track progress in real time. Business plans from €49/month, single invoice.",
};

const STATUS_LABELS = {
  passed: "Passed",
  "in-progress": "In progress",
  behind: "Behind",
} as const;

const MEMBERS = [
  { initials: "MR", name: "Marco R.", cert: "AWS Solutions Architect", target: 92, status: "passed" as const },
  { initials: "GS", name: "Giulia S.", cert: "Cisco CCNA", target: 64, status: "in-progress" as const },
  { initials: "AF", name: "Andrea F.", cert: "Security+", target: 38, status: "behind" as const },
  { initials: "LC", name: "Laura C.", cert: "ISC2 CC", target: 100, status: "passed" as const },
];

const FAQS = [
  {
    q: "Can I try it before paying?",
    a: "Yes. Get in touch and we'll set up a 7-day free trial for your team, the same terms as the individual Premium plan.",
  },
  {
    q: "Does each team member get their own account?",
    a: "Yes, every member has their own login and individual progress. The company admin sees an aggregated dashboard for the whole team.",
  },
  {
    q: "Which certifications are included?",
    a: "All 33+ certifications available on CertifyQuiz: AWS, Cisco, Microsoft, CompTIA, ISC2, CEH and many more, in Italian, English, French and Spanish.",
  },
  {
    q: "How does billing work?",
    a: "One single invoice for the company, no multiple credit cards to manage. Annual billing is available on request.",
  },
];

const PAIN_POINTS = [
  {
    title: "Courses cost thousands, few get finished",
    body: "Traditional courses are expensive and get abandoned halfway through. No one really knows where the team stands.",
  },
  {
    title: "Zero visibility into your team",
    body: "Who's ready for the AWS exam? Who's still behind on Cisco? Without data, you find out too late.",
  },
  {
    title: "Renewals lost in email",
    body: "Certification renewal deadlines get buried in crowded inboxes — until they've already expired.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Invite your team",
    body: "Send an invite link: each person creates their own account linked to the company in seconds.",
  },
  {
    n: "02",
    title: "Assign certifications",
    body: "Pick the right paths by role or person from 33+ certifications available: AWS, Cisco, CompTIA, ISC2 and more.",
  },
  {
    n: "03",
    title: "Track progress",
    body: "A dashboard shows scores, attempts and weak spots across the whole team, in real time.",
  },
];

const PLANS = [
  {
    name: "Team Starter",
    price: "€49",
    period: "/mo",
    seats: "Up to 10 people",
    features: ["All Premium certifications", "Team progress dashboard", "Single company invoice"],
    cta: "Request a demo",
    highlighted: false,
  },
  {
    name: "Team Pro",
    price: "€99",
    period: "/mo",
    seats: "Up to 25 people",
    features: [
      "Everything in Team Starter",
      "Role-based certification assignment",
      "Exportable reports (CSV/PDF)",
      "Priority support",
    ],
    cta: "Request a demo",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    seats: "More than 25 people",
    features: ["Dedicated account manager", "Centralized billing", "Guided onboarding"],
    cta: "Contact us",
    highlighted: false,
  },
];

function mailto(subject: string) {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}

export default function TeamLandingPageEN() {
  return (
    <main className={`${spaceGrotesk.variable} bg-white`}>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0B1220]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(245,166,35,0.08),_transparent_60%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-amber-300">
              <Building2 className="h-3 w-3" />
              CertifyQuiz for business
            </span>
            <h1
              style={{ fontFamily: "var(--font-display)" }}
              className="mt-5 text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl"
            >
              Do you actually know where your IT team stands on certifications?
            </h1>
            <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-slate-300">
              Assign IT certification paths to your team — AWS, Cisco, CompTIA and 30+ more — and track progress in
              real time. No more half-finished courses or renewal deadlines lost in your inbox.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={mailto("CertifyQuiz Team demo")}
                className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-[14px] font-semibold text-[#0B1220] transition hover:bg-amber-300"
              >
                Request a demo
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#plans"
                className="text-[14px] font-medium text-slate-300 underline-offset-4 hover:text-white hover:underline"
              >
                See plans →
              </a>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <TeamDashboardPreview teamLabel="Team DevOps · 8 members" statusLabels={STATUS_LABELS} members={MEMBERS} />
          </div>
        </div>
      </section>

      {/* PAIN POINTS */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2
          style={{ fontFamily: "var(--font-display)" }}
          className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl"
        >
          If you manage an IT team, this will sound familiar
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
            How it works
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
      <section id="plans" className="mx-auto max-w-6xl px-6 py-20">
        <h2
          style={{ fontFamily: "var(--font-display)" }}
          className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl"
        >
          Plans for businesses
        </h2>
        <p className="mt-3 max-w-xl text-[15px] text-slate-600">
          One single invoice, no multiple cards to chase.
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
                  Most popular
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
                href={mailto(`Plan inquiry — ${plan.name}`)}
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
            <p className="text-[14px] text-slate-700">33+ IT certifications in Italian, English, French and Spanish</p>
          </div>
          <div className="flex items-start gap-3">
            <BarChart3 className="h-5 w-5 shrink-0 text-amber-500" />
            <p className="text-[14px] text-slate-700">Real-time dashboard for every team member</p>
          </div>
          <div className="flex items-start gap-3">
            <FileSpreadsheet className="h-5 w-5 shrink-0 text-amber-500" />
            <p className="text-[14px] text-slate-700">Single company invoice, no multiple cards to manage</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <h2
          style={{ fontFamily: "var(--font-display)" }}
          className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl"
        >
          Frequently asked questions
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
            Let's talk for 15 minutes
          </h2>
          <p className="mt-4 text-[15px] text-slate-300">
            Tell us how many people are on your team and which certifications you want to focus on. We'll reply
            within one business day.
          </p>
          <a
            href={mailto("CertifyQuiz Team demo")}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-amber-400 px-7 py-3 text-[14px] font-semibold text-[#0B1220] transition hover:bg-amber-300"
          >
            <Mail className="h-4 w-4" />
            Email us for a demo
          </a>
        </div>
      </section>
    </main>
  );
}
