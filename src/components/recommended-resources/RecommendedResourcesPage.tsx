"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, GraduationCap, Mail } from "lucide-react";

import {
  recommendedCertificationOrder,
  recommendedResources,
  type RecommendedResource,
  type RecommendedResourceType,
} from "../../content/recommended-resources";
import { trackEvent } from "@/lib/analytics";
import { legalPath } from "@/lib/i18n";
import type { Locale } from "@/lib/paths";

type Props = { lang: Locale };

const COPY = {
  it: {
    eyebrow: "Risorse per lo studio",
    title: "Materiale consigliato",
    intro: "Una raccolta curata di libri, corsi e strumenti utili per preparare le certificazioni disponibili su CertifyQuiz.",
    disclosure: "Alcuni link presenti in questa pagina sono link di affiliazione. Se acquisti attraverso questi link, CertifyQuiz potrebbe ricevere una commissione senza costi aggiuntivi per te.",
    certifications: "Certificazioni",
    emptyTitle: "I consigli sono in preparazione",
    emptyText: "Stiamo selezionando risorse affidabili. Torna presto: pubblicheremo qui solo materiali verificati, senza suggerimenti o link fittizi.",
    type: { book: "Libri", course: "Corsi", equipment: "Attrezzatura" },
    bookCta: "Vedi il libro",
    courseCta: "Scopri il corso",
    equipmentCta: "Vedi la risorsa",
    onAmazon: "Vedi su Amazon",
    notifyTitle: "Avvisami quando è pronto",
    notifyText: "Lascia la tua email: ti scriviamo appena pubblichiamo i primi materiali consigliati.",
    notifyPlaceholder: "La tua email",
    notifyButton: "Avvisami",
    notifySending: "Invio...",
    notifySuccess: "Fatto! Ti avviseremo appena la sezione sarà pronta.",
    notifyExists: "Sei già iscritto con questa email.",
    notifyError: "Errore nell'iscrizione. Riprova.",
    notifyDisclaimerPre: "Iscrivendoti accetti la nostra ",
    privacyLabel: "Privacy Policy",
  },
  en: {
    eyebrow: "Study resources",
    title: "Recommended resources",
    intro: "A curated collection of useful books, courses and tools for the certifications available on CertifyQuiz.",
    disclosure: "Some links on this page are affiliate links. If you purchase through these links, CertifyQuiz may receive a commission at no additional cost to you.",
    certifications: "Certifications",
    emptyTitle: "Recommendations are being prepared",
    emptyText: "We are selecting trustworthy resources. Check back soon: we will only publish verified materials, with no made-up suggestions or links.",
    type: { book: "Books", course: "Courses", equipment: "Equipment" },
    bookCta: "View the book",
    courseCta: "Explore the course",
    equipmentCta: "View resource",
    onAmazon: "View on Amazon",
    notifyTitle: "Notify me when it's ready",
    notifyText: "Leave your email and we'll let you know as soon as we publish the first recommended materials.",
    notifyPlaceholder: "Your email",
    notifyButton: "Notify me",
    notifySending: "Sending...",
    notifySuccess: "Done! We'll let you know as soon as this section is ready.",
    notifyExists: "You are already subscribed with this email.",
    notifyError: "Subscription error. Please try again.",
    notifyDisclaimerPre: "By subscribing you accept our ",
    privacyLabel: "Privacy Policy",
  },
  fr: {
    eyebrow: "Ressources d’étude",
    title: "Ressources recommandées",
    intro: "Une sélection de livres, cours et outils utiles pour préparer les certifications disponibles sur CertifyQuiz.",
    disclosure: "Certains liens présents sur cette page sont des liens d’affiliation. Si vous effectuez un achat via ces liens, CertifyQuiz peut recevoir une commission sans coût supplémentaire pour vous.",
    certifications: "Certifications",
    emptyTitle: "Les recommandations sont en préparation",
    emptyText: "Nous sélectionnons des ressources fiables. Revenez bientôt : seuls des supports vérifiés seront publiés, sans suggestions ni liens fictifs.",
    type: { book: "Livres", course: "Cours", equipment: "Équipement" },
    bookCta: "Voir le livre",
    courseCta: "Découvrir le cours",
    equipmentCta: "Voir la ressource",
    onAmazon: "Voir sur Amazon",
    notifyTitle: "Prévenez-moi quand c'est prêt",
    notifyText: "Laissez votre email : nous vous préviendrons dès la publication des premiers contenus recommandés.",
    notifyPlaceholder: "Votre email",
    notifyButton: "Me prévenir",
    notifySending: "Envoi...",
    notifySuccess: "C'est fait ! Nous vous préviendrons dès que cette section sera prête.",
    notifyExists: "Vous êtes déjà inscrit avec cette adresse email.",
    notifyError: "Erreur lors de l'inscription. Veuillez réessayer.",
    notifyDisclaimerPre: "En vous inscrivant, vous acceptez notre ",
    privacyLabel: "Politique de confidentialité",
  },
  es: {
    eyebrow: "Recursos de estudio",
    title: "Material recomendado",
    intro: "Una selección de libros, cursos y herramientas útiles para preparar las certificaciones disponibles en CertifyQuiz.",
    disclosure: "Algunos enlaces de esta página son enlaces de afiliación. Si compras a través de ellos, CertifyQuiz podría recibir una comisión sin coste adicional para ti.",
    certifications: "Certificaciones",
    emptyTitle: "Las recomendaciones están en preparación",
    emptyText: "Estamos seleccionando recursos fiables. Vuelve pronto: solo publicaremos materiales verificados, sin sugerencias ni enlaces ficticios.",
    type: { book: "Libros", course: "Cursos", equipment: "Equipamiento" },
    bookCta: "Ver el libro",
    courseCta: "Descubrir el curso",
    equipmentCta: "Ver el recurso",
    onAmazon: "Ver en Amazon",
    notifyTitle: "Avísame cuando esté listo",
    notifyText: "Déjanos tu email: te avisaremos en cuanto publiquemos los primeros materiales recomendados.",
    notifyPlaceholder: "Tu email",
    notifyButton: "Avisarme",
    notifySending: "Enviando...",
    notifySuccess: "¡Listo! Te avisaremos en cuanto esta sección esté disponible.",
    notifyExists: "Ya estás suscrito con este email.",
    notifyError: "Error al suscribirte. Inténtalo de nuevo.",
    notifyDisclaimerPre: "Al suscribirte aceptas nuestra ",
    privacyLabel: "Política de privacidad",
  },
} as const;

type NotifyStatus = "idle" | "loading" | "ok" | "exists" | "error";

function NotifyMeForm({ lang, t }: { lang: Locale; t: (typeof COPY)[Locale] }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<NotifyStatus>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) return;

    try {
      setStatus("loading");

      const res = await fetch("/api/backend/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          lang,
          gdprConsent: true,
          source: "recommended-resources-notify",
        }),
      });

      const data = (await res.json().catch(() => ({}))) as { status?: string; ok?: boolean };

      if (res.ok) {
        setStatus(data?.status === "already" ? "exists" : "ok");
        trackEvent("recommended_resources_notify_signup", { page_language: lang });
        if (data?.status !== "already") setEmail("");
      } else {
        setStatus(data?.status === "already" ? "exists" : "error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto mt-6 max-w-md rounded-xl border border-blue-200 bg-white p-5 text-left shadow-sm">
      <p className="flex items-center gap-2 text-sm font-bold text-slate-900">
        <Mail size={16} className="text-blue-700" aria-hidden /> {t.notifyTitle}
      </p>
      <p className="mt-1 text-sm leading-6 text-slate-600">{t.notifyText}</p>

      <form onSubmit={onSubmit} className="mt-3" noValidate>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.notifyPlaceholder}
            aria-label={t.notifyPlaceholder}
            disabled={status === "loading"}
            className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            aria-busy={status === "loading"}
            className="shrink-0 rounded-lg bg-blue-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-800 disabled:opacity-60"
          >
            {status === "loading" ? t.notifySending : t.notifyButton}
          </button>
        </div>

        <p className="mt-2 text-xs leading-5 text-slate-500">
          {t.notifyDisclaimerPre}
          <Link href={legalPath(lang, "privacy")} className="underline">
            {t.privacyLabel}
          </Link>
          .
        </p>

        {status === "ok" && <p className="mt-2 text-sm font-semibold text-green-700">{t.notifySuccess}</p>}
        {status === "exists" && <p className="mt-2 text-sm font-semibold text-amber-700">{t.notifyExists}</p>}
        {status === "error" && <p className="mt-2 text-sm font-semibold text-red-700">{t.notifyError}</p>}
      </form>
    </div>
  );
}

function ctaFor(resource: RecommendedResource, t: (typeof COPY)[Locale]) {
  if (resource.platform.toLowerCase() === "amazon") return t.onAmazon;
  if (resource.type === "book") return t.bookCta;
  if (resource.type === "course") return t.courseCta;
  return t.equipmentCta;
}

export default function RecommendedResourcesPage({ lang }: Props) {
  const t = COPY[lang];
  const activeResources = recommendedResources
    .filter((resource) => resource.active)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <header className="max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-wide text-blue-700">{t.eyebrow}</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">{t.title}</h1>
        <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">{t.intro}</p>
      </header>

      <aside className="mt-7 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950" aria-label={t.disclosure}>
        {t.disclosure}
      </aside>

      <section className="mt-10" aria-labelledby="certifications-heading">
        <h2 id="certifications-heading" className="text-xl font-extrabold text-slate-900">{t.certifications}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {recommendedCertificationOrder.map((certification) => (
            <span key={certification.slug} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm">
              {certification.label}
            </span>
          ))}
        </div>
      </section>

      {activeResources.length === 0 ? (
        <section className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <GraduationCap className="mx-auto h-10 w-10 text-blue-700" aria-hidden />
          <h2 className="mt-3 text-xl font-extrabold text-slate-900">{t.emptyTitle}</h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-600">{t.emptyText}</p>
          <NotifyMeForm lang={lang} t={t} />
        </section>
      ) : (
        recommendedCertificationOrder.map((certification) => {
          const certResources = activeResources.filter((resource) => resource.certificationSlug === certification.slug);
          if (certResources.length === 0) return null;

          return (
            <section key={certification.slug} className="mt-12" aria-labelledby={`cert-${certification.slug}`}>
              <h2 id={`cert-${certification.slug}`} className="text-2xl font-black text-slate-900">{certification.label}</h2>
              {(["book", "course", "equipment"] as RecommendedResourceType[]).map((type) => {
                const resources = certResources.filter((resource) => resource.type === type);
                if (resources.length === 0) return null;
                return (
                  <div key={type} className="mt-6">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-slate-600">{t.type[type]}</h3>
                    <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {resources.map((resource) => (
                        <article key={resource.id} className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                          {resource.imageUrl && (
                            <div className="relative aspect-[16/9] bg-slate-100">
                              <Image src={resource.imageUrl} alt="" fill className="object-contain p-4" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
                            </div>
                          )}
                          <div className="flex flex-1 flex-col p-5">
                            <p className="text-xs font-bold uppercase tracking-wide text-blue-700">{resource.platform} · {resource.language}</p>
                            <h4 className="mt-2 text-lg font-extrabold text-slate-900">{resource.title[lang]}</h4>
                            <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{resource.description[lang]}</p>
                            <a
                              href={resource.affiliateUrl}
                              target="_blank"
                              rel="nofollow sponsored noopener noreferrer"
                              onClick={() => trackEvent("affiliate_link_clicked", {
                                certification_slug: resource.certificationSlug,
                                product_name: resource.title[lang],
                                product_type: resource.type,
                                affiliate_platform: resource.platform,
                                page_language: lang,
                                destination_url: resource.affiliateUrl,
                              })}
                              className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                            >
                              {ctaFor(resource, t)} <ExternalLink size={15} aria-hidden />
                            </a>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                );
              })}
            </section>
          );
        })
      )}
    </main>
  );
}
