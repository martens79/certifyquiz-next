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
  title: "CertifyQuiz Team — Certificazioni IT per aziende da €49/mese",
  description:
    "Assegna certificazioni AWS, Cisco, CompTIA e altre 30+ al tuo team IT e segui i progressi in tempo reale. Piani aziendali da €49/mese, fattura unica.",
};

const PAIN_POINTS = [
  {
    title: "Corsi da migliaia di euro, pochi finiti",
    body: "I corsi tradizionali costano tanto e finiscono dimenticati a metà. Nessuno sa davvero a che punto sono i colleghi.",
  },
  {
    title: "Zero visibilità sul team",
    body: "Chi è pronto per l'esame AWS? Chi è ancora indietro su Cisco? Senza dati, lo scopri solo quando è troppo tardi.",
  },
  {
    title: "Rinnovi persi tra le email",
    body: "Le scadenze delle certificazioni si perdono in caselle di posta affollate, e te ne accorgi quando sono già scadute.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Invita il team",
    body: "Manda un link di invito: ogni persona crea il proprio account collegato all'azienda in pochi secondi.",
  },
  {
    n: "02",
    title: "Assegna le certificazioni",
    body: "Scegli i percorsi giusti per ruolo o persona tra le 33+ certificazioni disponibili: AWS, Cisco, CompTIA, ISC2 e altre.",
  },
  {
    n: "03",
    title: "Segui i progressi",
    body: "Una dashboard mostra punteggi, tentativi e aree deboli di tutto il team, in tempo reale.",
  },
];

const PLANS = [
  {
    name: "Team Starter",
    price: "€49",
    period: "/mese",
    seats: "Fino a 10 persone",
    features: ["Tutte le certificazioni Premium", "Dashboard progressi del team", "Fattura unica aziendale"],
    cta: "Richiedi una demo",
    highlighted: false,
  },
  {
    name: "Team Pro",
    price: "€99",
    period: "/mese",
    seats: "Fino a 25 persone",
    features: [
      "Tutto di Team Starter",
      "Assegnazione certificazioni per ruolo",
      "Report esportabili (CSV/PDF)",
      "Supporto prioritario",
    ],
    cta: "Richiedi una demo",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Su misura",
    period: "",
    seats: "Oltre 25 persone",
    features: ["Account manager dedicato", "Fatturazione centralizzata", "Onboarding assistito"],
    cta: "Contattaci",
    highlighted: false,
  },
];

function mailto(subject: string) {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}

export default function AziendeLandingPage() {
  return (
    <main className={`${spaceGrotesk.variable} bg-white`}>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0B1220]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(245,166,35,0.08),_transparent_60%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-amber-300">
              <Building2 className="h-3 w-3" />
              CertifyQuiz per le aziende
            </span>
            <h1
              style={{ fontFamily: "var(--font-display)" }}
              className="mt-5 text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl"
            >
              Sai davvero a che punto è il tuo team con le certificazioni?
            </h1>
            <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-slate-300">
              Assegna i percorsi di certificazione IT al tuo team — AWS, Cisco, CompTIA e altre 30+ — e segui i
              progressi in tempo reale. Niente più corsi dimenticati a metà o scadenze perse via email.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={mailto("Demo CertifyQuiz Team")}
                className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-[14px] font-semibold text-[#0B1220] transition hover:bg-amber-300"
              >
                Richiedi una demo
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#piani"
                className="text-[14px] font-medium text-slate-300 underline-offset-4 hover:text-white hover:underline"
              >
                Vedi i piani →
              </a>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <TeamDashboardPreview />
          </div>
        </div>
      </section>

      {/* PAIN POINTS */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2
          style={{ fontFamily: "var(--font-display)" }}
          className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl"
        >
          Per chi gestisce un team IT, questo suona familiare
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
            Come funziona
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
      <section id="piani" className="mx-auto max-w-6xl px-6 py-20">
        <h2
          style={{ fontFamily: "var(--font-display)" }}
          className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl"
        >
          Piani per aziende
        </h2>
        <p className="mt-3 max-w-xl text-[15px] text-slate-600">
          Una fattura unica, niente carte multiple da rincorrere.
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
                  Più scelto
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
                href={mailto(`Richiesta info — ${plan.name}`)}
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
            <p className="text-[14px] text-slate-700">33+ certificazioni IT in italiano, inglese, francese e spagnolo</p>
          </div>
          <div className="flex items-start gap-3">
            <BarChart3 className="h-5 w-5 shrink-0 text-amber-500" />
            <p className="text-[14px] text-slate-700">Dashboard aggiornata in tempo reale per ogni membro del team</p>
          </div>
          <div className="flex items-start gap-3">
            <FileSpreadsheet className="h-5 w-5 shrink-0 text-amber-500" />
            <p className="text-[14px] text-slate-700">Fattura unica aziendale, niente carte di credito da gestire</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <h2
          style={{ fontFamily: "var(--font-display)" }}
          className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl"
        >
          Domande frequenti
        </h2>
        <div className="mt-8">
          <FaqAccordion />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-[#0B1220] py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2
            style={{ fontFamily: "var(--font-display)" }}
            className="text-2xl font-semibold tracking-tight text-white sm:text-3xl"
          >
            Parliamone in 15 minuti
          </h2>
          <p className="mt-4 text-[15px] text-slate-300">
            Raccontaci quante persone ha il tuo team e su quali certificazioni volete lavorare. Ti rispondiamo entro
            un giorno lavorativo.
          </p>
          <a
            href={mailto("Demo CertifyQuiz Team")}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-amber-400 px-7 py-3 text-[14px] font-semibold text-[#0B1220] transition hover:bg-amber-300"
          >
            <Mail className="h-4 w-4" />
            Scrivici per una demo
          </a>
        </div>
      </section>
    </main>
  );
}
