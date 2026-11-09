import type { Metadata } from "next";
import { spaceGrotesk } from "@/fonts/space-grotesk";
import { Users, Languages, LifeBuoy, Mail, ArrowRight, Building2 } from "lucide-react";
import FaqAccordion from "@/components/team/FaqAccordion";
import TwaPurchaseGate from "@/components/twa/TwaPurchaseGate";

const CONTACT_EMAIL = "certifyquiz@gmail.com";

export const metadata: Metadata = {
  title: "CertifyQuiz for Teams — IT Certification Prep for Small Groups",
  description:
    "IT certification prep for small groups, with individual accounts and assisted onboarding. Contact us for a proposal for your group.",
};

const OFFER = [
  {
    icon: Users,
    title: "Individual accounts",
    body: "Everyone has their own account and their own progress: they study at their own pace, with no shared logins.",
  },
  {
    icon: Languages,
    title: "IT certifications in four languages",
    body: "Quizzes, exam scenarios and review pages in Italian, English, French and Spanish, covering certifications such as AWS, Cisco, CompTIA, Microsoft and ISC2.",
  },
  {
    icon: LifeBuoy,
    title: "Assisted onboarding",
    body: "At the start we help you choose the certification and get the people in your group going.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "You write to us",
    body: "Tell us how many people are in the group and which certification you want to work on.",
  },
  {
    n: "02",
    title: "We define the start",
    body: "We send you a proposal for the group with terms, timing and how access works.",
  },
  {
    n: "03",
    title: "Everyone studies with their own account",
    body: "Each person prepares independently with quizzes and review pages, with individual progress.",
  },
];

const FAQS = [
  {
    q: "Can I try the platform before getting in touch?",
    a: "Yes: many quizzes are free on the site, so you can get a feel for the level and format before contacting us.",
  },
  {
    q: "Does each person have a separate account?",
    a: "Yes. Everyone signs in with their own account and sees their own progress.",
  },
  {
    q: "Can the manager see the group's progress?",
    a: "No: for now there is no manager dashboard and no reports on individuals. Everyone sees only their own results.",
  },
  {
    q: "Which certifications are available?",
    a: "The ones on the site, in Italian, English, French and Spanish. Tell us which one you need and we'll confirm what we can offer your group.",
  },
  {
    q: "How do pricing and invoicing work?",
    a: "There is no public price list: we agree terms and invoicing in the proposal for your group.",
  },
];

function mailto(subject: string) {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}

export default function TeamLandingPageEN() {
  return (
    <TwaPurchaseGate lang="en">
    <main className={`${spaceGrotesk.variable} bg-white`}>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0B1220]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(245,166,35,0.08),_transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 lg:py-28">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-amber-300">
              <Building2 className="h-3 w-3" />
              CertifyQuiz for business
            </span>
            <h1
              style={{ fontFamily: "var(--font-display)" }}
              className="mt-5 text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl"
            >
              IT certification prep for small groups
            </h1>
            <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-slate-300">
              Quizzes, exam scenarios and review pages for the most in-demand IT certifications, with individual
              accounts and assisted onboarding for your group.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={mailto("Information for my group — CertifyQuiz")}
                className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-[14px] font-semibold text-[#0B1220] transition hover:bg-amber-300"
              >
                Request information for your group
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#how-it-works"
                className="text-[14px] font-medium text-slate-300 underline-offset-4 hover:text-white hover:underline"
              >
                How it works →
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
          What you get
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
      <section id="how-it-works" className="bg-slate-50 py-20">
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
            Request information for your group
          </h2>
          <p className="mt-4 text-[15px] text-slate-300">
            Tell us how many of you there are and which certification you want to work on: we&apos;ll reply with a
            proposal for your group.
          </p>
          <a
            href={mailto("Information for my group — CertifyQuiz")}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-amber-400 px-7 py-3 text-[14px] font-semibold text-[#0B1220] transition hover:bg-amber-300"
          >
            <Mail className="h-4 w-4" />
            Email us about your group
          </a>
        </div>
      </section>
    </main>
    </TwaPurchaseGate>
  );
}
