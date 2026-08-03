"use client";

import Image from "next/image";
import { ExternalLink, GraduationCap } from "lucide-react";

import {
  recommendedCertificationOrder,
  recommendedResources,
  type RecommendedResource,
  type RecommendedResourceType,
} from "../../content/recommended-resources";
import { trackEvent } from "@/lib/analytics";
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
  },
} as const;

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
