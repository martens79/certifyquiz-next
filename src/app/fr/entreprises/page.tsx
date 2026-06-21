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
  title: "CertifyQuiz Team — Certifications IT pour entreprises dès 49€/mois",
  description:
    "Attribuez les certifications AWS, Cisco, CompTIA et 30+ autres à votre équipe IT et suivez la progression en temps réel. Offres entreprises dès 49€/mois, facture unique.",
};

const STATUS_LABELS = {
  passed: "Réussi",
  "in-progress": "En cours",
  behind: "En retard",
} as const;

const MEMBERS = [
  { initials: "MR", name: "Marco R.", cert: "AWS Solutions Architect", target: 92, status: "passed" as const },
  { initials: "GS", name: "Giulia S.", cert: "Cisco CCNA", target: 64, status: "in-progress" as const },
  { initials: "AF", name: "Andrea F.", cert: "Security+", target: 38, status: "behind" as const },
  { initials: "LC", name: "Laura C.", cert: "ISC2 CC", target: 100, status: "passed" as const },
];

const FAQS = [
  {
    q: "Puis-je l'essayer avant de payer ?",
    a: "Oui. Contactez-nous et nous activerons un essai gratuit de 7 jours pour votre équipe, aux mêmes conditions que le plan Premium individuel.",
  },
  {
    q: "Chaque membre de l'équipe a-t-il son propre compte ?",
    a: "Oui, chaque membre dispose de son propre identifiant et de sa progression individuelle. Le référent de l'entreprise voit un tableau de bord agrégé de toute l'équipe.",
  },
  {
    q: "Quelles certifications sont incluses ?",
    a: "Les 33+ certifications disponibles sur CertifyQuiz : AWS, Cisco, Microsoft, CompTIA, ISC2, CEH et bien d'autres, en italien, anglais, français et espagnol.",
  },
  {
    q: "Comment fonctionne la facturation ?",
    a: "Une facture unique pour l'entreprise, aucune carte bancaire multiple à gérer. Facturation annuelle disponible sur demande.",
  },
];

const PAIN_POINTS = [
  {
    title: "Des formations à des milliers d'euros, rarement terminées",
    body: "Les formations traditionnelles coûtent cher et sont abandonnées à mi-parcours. Personne ne sait vraiment où en est l'équipe.",
  },
  {
    title: "Aucune visibilité sur l'équipe",
    body: "Qui est prêt pour l'examen AWS ? Qui est encore en retard sur Cisco ? Sans données, vous le découvrez trop tard.",
  },
  {
    title: "Renouvellements perdus dans les emails",
    body: "Les échéances de renouvellement des certifications se perdent dans des boîtes mail surchargées — jusqu'à ce qu'elles soient déjà expirées.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Invitez votre équipe",
    body: "Envoyez un lien d'invitation : chaque personne crée son compte lié à l'entreprise en quelques secondes.",
  },
  {
    n: "02",
    title: "Attribuez les certifications",
    body: "Choisissez les bons parcours par rôle ou par personne parmi les 33+ certifications disponibles : AWS, Cisco, CompTIA, ISC2 et d'autres.",
  },
  {
    n: "03",
    title: "Suivez la progression",
    body: "Un tableau de bord affiche les scores, les tentatives et les points faibles de toute l'équipe, en temps réel.",
  },
];

const PLANS = [
  {
    name: "Team Starter",
    price: "49€",
    period: "/mois",
    seats: "Jusqu'à 10 personnes",
    features: ["Toutes les certifications Premium", "Tableau de bord de progression", "Facture unique pour l'entreprise"],
    cta: "Demander une démo",
    highlighted: false,
  },
  {
    name: "Team Pro",
    price: "99€",
    period: "/mois",
    seats: "Jusqu'à 25 personnes",
    features: [
      "Tout Team Starter",
      "Attribution des certifications par rôle",
      "Rapports exportables (CSV/PDF)",
      "Support prioritaire",
    ],
    cta: "Demander une démo",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Sur mesure",
    period: "",
    seats: "Plus de 25 personnes",
    features: ["Account manager dédié", "Facturation centralisée", "Accompagnement à l'intégration"],
    cta: "Contactez-nous",
    highlighted: false,
  },
];

function mailto(subject: string) {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}

export default function TeamLandingPageFR() {
  return (
    <main className={`${spaceGrotesk.variable} bg-white`}>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0B1220]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(245,166,35,0.08),_transparent_60%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-amber-300">
              <Building2 className="h-3 w-3" />
              CertifyQuiz pour les entreprises
            </span>
            <h1
              style={{ fontFamily: "var(--font-display)" }}
              className="mt-5 text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl"
            >
              Savez-vous vraiment où en est votre équipe IT sur les certifications ?
            </h1>
            <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-slate-300">
              Attribuez des parcours de certification IT à votre équipe — AWS, Cisco, CompTIA et 30+ autres — et
              suivez la progression en temps réel. Fini les formations abandonnées à mi-chemin ou les échéances
              perdues dans les emails.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={mailto("Démo CertifyQuiz Team")}
                className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-[14px] font-semibold text-[#0B1220] transition hover:bg-amber-300"
              >
                Demander une démo
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#offres"
                className="text-[14px] font-medium text-slate-300 underline-offset-4 hover:text-white hover:underline"
              >
                Voir les offres →
              </a>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <TeamDashboardPreview
              teamLabel="Équipe DevOps · 8 membres"
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
          Si vous gérez une équipe IT, ça va vous parler
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

      {/* PRICING */}
      <section id="offres" className="mx-auto max-w-6xl px-6 py-20">
        <h2
          style={{ fontFamily: "var(--font-display)" }}
          className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl"
        >
          Offres pour les entreprises
        </h2>
        <p className="mt-3 max-w-xl text-[15px] text-slate-600">
          Une facture unique, aucune carte multiple à gérer.
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
                  Le plus choisi
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
                href={mailto(`Demande d'info — ${plan.name}`)}
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
            <p className="text-[14px] text-slate-700">33+ certifications IT en italien, anglais, français et espagnol</p>
          </div>
          <div className="flex items-start gap-3">
            <BarChart3 className="h-5 w-5 shrink-0 text-amber-500" />
            <p className="text-[14px] text-slate-700">Tableau de bord en temps réel pour chaque membre de l'équipe</p>
          </div>
          <div className="flex items-start gap-3">
            <FileSpreadsheet className="h-5 w-5 shrink-0 text-amber-500" />
            <p className="text-[14px] text-slate-700">Facture unique pour l'entreprise, aucune carte multiple à gérer</p>
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
            Discutons-en pendant 15 minutes
          </h2>
          <p className="mt-4 text-[15px] text-slate-300">
            Dites-nous combien de personnes compte votre équipe et sur quelles certifications vous voulez travailler.
            Nous répondons sous un jour ouvré.
          </p>
          <a
            href={mailto("Démo CertifyQuiz Team")}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-amber-400 px-7 py-3 text-[14px] font-semibold text-[#0B1220] transition hover:bg-amber-300"
          >
            <Mail className="h-4 w-4" />
            Écrivez-nous pour une démo
          </a>
        </div>
      </section>
    </main>
  );
}
