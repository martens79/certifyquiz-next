import type { Metadata } from "next";
import { spaceGrotesk } from "@/fonts/space-grotesk";
import { Users, Languages, LifeBuoy, Mail, ArrowRight, Building2 } from "lucide-react";
import FaqAccordion from "@/components/team/FaqAccordion";
import TwaPurchaseGate from "@/components/twa/TwaPurchaseGate";

const CONTACT_EMAIL = "certifyquiz@gmail.com";

export const metadata: Metadata = {
  title: "CertifyQuiz entreprises — Certifications IT pour petits groupes",
  description:
    "Préparation aux certifications IT pour petits groupes : accès individuels et démarrage accompagné. Demandez une proposition pour votre groupe.",
};

const OFFER = [
  {
    icon: Users,
    title: "Accès individuels",
    body: "Chaque personne a son propre compte et sa propre progression : elle étudie à son rythme, sans partager d'identifiants.",
  },
  {
    icon: Languages,
    title: "Certifications IT en quatre langues",
    body: "Quiz, scénarios d'examen et fiches de révision en italien, anglais, français et espagnol, pour des certifications comme AWS, Cisco, CompTIA, Microsoft et ISC2.",
  },
  {
    icon: LifeBuoy,
    title: "Démarrage accompagné",
    body: "Au début, nous vous aidons à choisir la certification et à lancer les personnes de votre groupe.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Vous nous écrivez",
    body: "Indiquez-nous combien de personnes composent le groupe et sur quelle certification vous voulez travailler.",
  },
  {
    n: "02",
    title: "Nous définissons le démarrage",
    body: "Nous vous envoyons une proposition pour le groupe, avec conditions, délais et modalités d'accès.",
  },
  {
    n: "03",
    title: "Chacun étudie avec son propre compte",
    body: "Chaque personne se prépare en autonomie avec les quiz et les fiches de révision, avec une progression individuelle.",
  },
];

const FAQS = [
  {
    q: "Puis-je essayer la plateforme avant de vous écrire ?",
    a: "Oui : de nombreux quiz sont accessibles gratuitement sur le site, ce qui vous permet de vous faire une idée du niveau et du format avant de nous contacter.",
  },
  {
    q: "Chaque personne a-t-elle un compte séparé ?",
    a: "Oui. Chaque personne se connecte avec son propre compte et voit sa propre progression.",
  },
  {
    q: "Le responsable peut-il voir la progression du groupe ?",
    a: "Non : pour l'instant, il n'y a ni tableau de bord pour le responsable ni rapport sur les personnes. Chacun ne voit que ses propres résultats.",
  },
  {
    q: "Quelles certifications sont disponibles ?",
    a: "Celles présentes sur le site, en italien, anglais, français et espagnol. Dites-nous laquelle vous intéresse et nous vous confirmerons ce que nous pouvons offrir à votre groupe.",
  },
  {
    q: "Comment fonctionnent les tarifs et la facturation ?",
    a: "Il n'y a pas de grille tarifaire publique : nous définissons les conditions et la facturation dans la proposition pour votre groupe.",
  },
];

function mailto(subject: string) {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}

export default function TeamLandingPageFR() {
  return (
    <TwaPurchaseGate lang="fr">
    <main className={`${spaceGrotesk.variable} bg-white`}>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0B1220]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(245,166,35,0.08),_transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 lg:py-28">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-amber-300">
              <Building2 className="h-3 w-3" />
              CertifyQuiz pour les entreprises
            </span>
            <h1
              style={{ fontFamily: "var(--font-display)" }}
              className="mt-5 text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl"
            >
              Préparation aux certifications IT pour petits groupes
            </h1>
            <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-slate-300">
              Quiz, scénarios d&apos;examen et fiches de révision pour les certifications IT les plus demandées, avec
              des accès individuels et un démarrage accompagné pour votre groupe.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={mailto("Informations pour mon groupe — CertifyQuiz")}
                className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-[14px] font-semibold text-[#0B1220] transition hover:bg-amber-300"
              >
                Demandez des informations pour votre groupe
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#comment-ca-marche"
                className="text-[14px] font-medium text-slate-300 underline-offset-4 hover:text-white hover:underline"
              >
                Comment ça marche →
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
          Ce que vous trouvez
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
      <section id="comment-ca-marche" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2
            style={{ fontFamily: "var(--font-display)" }}
            className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl"
          >
            Comment ça marche
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
          Questions fréquentes
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
            Demandez des informations pour votre groupe
          </h2>
          <p className="mt-4 text-[15px] text-slate-300">
            Dites-nous combien vous êtes et sur quelle certification vous voulez travailler : nous vous répondrons avec
            une proposition pour votre groupe.
          </p>
          <a
            href={mailto("Informations pour mon groupe — CertifyQuiz")}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-amber-400 px-7 py-3 text-[14px] font-semibold text-[#0B1220] transition hover:bg-amber-300"
          >
            <Mail className="h-4 w-4" />
            Écrivez-nous pour votre groupe
          </a>
        </div>
      </section>
    </main>
    </TwaPurchaseGate>
  );
}
