import type { Metadata } from "next";
import { spaceGrotesk } from "@/fonts/space-grotesk";
import { Users, Languages, LifeBuoy, Mail, ArrowRight, Building2 } from "lucide-react";
import FaqAccordion from "@/components/team/FaqAccordion";

const CONTACT_EMAIL = "certifyquiz@gmail.com";

export const metadata: Metadata = {
  title: "CertifyQuiz per le aziende — Certificazioni IT per piccoli gruppi",
  description:
    "Preparazione alle certificazioni IT per piccoli gruppi, con accessi individuali e avvio assistito. Scrivici per ricevere una proposta per il tuo gruppo.",
};

const OFFER = [
  {
    icon: Users,
    title: "Accessi individuali",
    body: "Ogni persona ha il proprio account e i propri progressi: studia con i suoi tempi, senza condividere le credenziali.",
  },
  {
    icon: Languages,
    title: "Certificazioni IT in quattro lingue",
    body: "Quiz, scenari d'esame e ripassi in italiano, inglese, francese e spagnolo, su certificazioni come AWS, Cisco, CompTIA, Microsoft e ISC2.",
  },
  {
    icon: LifeBuoy,
    title: "Avvio assistito",
    body: "All'inizio ti aiutiamo a scegliere la certificazione e a far partire le persone del gruppo.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Ci scrivi",
    body: "Indicaci quante persone sono nel gruppo e su quale certificazione volete lavorare.",
  },
  {
    n: "02",
    title: "Definiamo l'avvio",
    body: "Ti inviamo una proposta per il gruppo con condizioni, tempi e modalità di accesso.",
  },
  {
    n: "03",
    title: "Ognuno studia con il proprio account",
    body: "Ogni persona si prepara in autonomia su quiz e ripassi, con progressi individuali.",
  },
];

const FAQS = [
  {
    q: "Posso provare la piattaforma prima di scrivere?",
    a: "Sì: molti quiz sono disponibili gratuitamente sul sito, così puoi farti un'idea del livello e del formato prima di contattarci.",
  },
  {
    q: "Ogni persona ha un account separato?",
    a: "Sì. Ogni persona accede con il proprio account e vede i propri progressi.",
  },
  {
    q: "Il responsabile può vedere i progressi del gruppo?",
    a: "No: al momento non c'è una dashboard per il responsabile né report sulle singole persone. Ognuno vede solo i propri risultati.",
  },
  {
    q: "Quali certificazioni sono disponibili?",
    a: "Quelle presenti sul sito, in italiano, inglese, francese e spagnolo. Dicci quale ti serve e ti confermiamo cosa possiamo offrire al gruppo.",
  },
  {
    q: "Come funzionano prezzi e fatturazione?",
    a: "Non c'è un listino pubblico: definiamo condizioni e fatturazione nella proposta per il gruppo.",
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
        <div className="relative mx-auto max-w-6xl px-6 py-20 lg:py-28">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-amber-300">
              <Building2 className="h-3 w-3" />
              CertifyQuiz per le aziende
            </span>
            <h1
              style={{ fontFamily: "var(--font-display)" }}
              className="mt-5 text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl"
            >
              Preparazione alle certificazioni IT per piccoli gruppi
            </h1>
            <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-slate-300">
              Quiz, scenari d&apos;esame e ripassi per le certificazioni IT più richieste, con accessi individuali e un
              avvio assistito per il tuo gruppo.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={mailto("Informazioni per il mio gruppo — CertifyQuiz")}
                className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-[14px] font-semibold text-[#0B1220] transition hover:bg-amber-300"
              >
                Richiedi informazioni per il tuo gruppo
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#come-funziona"
                className="text-[14px] font-medium text-slate-300 underline-offset-4 hover:text-white hover:underline"
              >
                Come funziona →
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
          Cosa trovi
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
      <section id="come-funziona" className="bg-slate-50 py-20">
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

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <h2
          style={{ fontFamily: "var(--font-display)" }}
          className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl"
        >
          Domande frequenti
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
            Richiedi informazioni per il tuo gruppo
          </h2>
          <p className="mt-4 text-[15px] text-slate-300">
            Scrivici quante persone siete e su quale certificazione volete lavorare: ti rispondiamo con una proposta
            per il gruppo.
          </p>
          <a
            href={mailto("Informazioni per il mio gruppo — CertifyQuiz")}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-amber-400 px-7 py-3 text-[14px] font-semibold text-[#0B1220] transition hover:bg-amber-300"
          >
            <Mail className="h-4 w-4" />
            Scrivici per il tuo gruppo
          </a>
        </div>
      </section>
    </main>
  );
}
