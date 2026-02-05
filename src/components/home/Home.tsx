"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";

import { withLang } from "@/lib/i18n";
import { categoryPath, type CategoryKey, type Locale } from "@/lib/paths";

import BlogTeaser from "@/components/BlogTeaser";
import logo from "@/../public/images/logo-certifyquiz.png";

import {
  BrainCircuit,
  LockKeyhole,
  Network,
  Cloud,
  Database,
  Code,
  Layers,
  Cpu,
} from "lucide-react";

/* Helpers */
function L(o: { it: string; en: string; fr: string; es: string }, lang: Locale) {
  return o[lang] ?? o.it;
}

/* Colori coerenti (statici, no classi dinamiche Tailwind) */
const CATEGORY_UI: Record<
  Exclude<CategoryKey, "default">,
  { bg: string; border: string; ring: string }
> = {
  base: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    ring: "hover:ring-2 hover:ring-blue-200/60",
  },
  sicurezza: {
    bg: "bg-red-50",
    border: "border-red-200",
    ring: "hover:ring-2 hover:ring-red-200/60",
  },
  reti: {
    bg: "bg-green-50",
    border: "border-green-200",
    ring: "hover:ring-2 hover:ring-green-200/60",
  },
  cloud: {
    bg: "bg-purple-50",
    border: "border-purple-200",
    ring: "hover:ring-2 hover:ring-purple-200/60",
  },
  database: {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    ring: "hover:ring-2 hover:ring-yellow-200/60",
  },
  programmazione: {
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    ring: "hover:ring-2 hover:ring-indigo-200/60",
  },
  virtualizzazione: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    ring: "hover:ring-2 hover:ring-orange-200/60",
  },
  ai: {
    bg: "bg-cyan-50",
    border: "border-cyan-200",
    ring: "hover:ring-2 hover:ring-cyan-200/60",
  },
} as const;


export type HomeStats = {
  questions: number;
  topics: number;
  certifications: number;
};


type Props = {
  lang?: Locale;
  isLoggedIn?: boolean;
  stats?: HomeStats; // ✅ aggiungi
};


export default function Home({ lang, isLoggedIn = false, stats }: Props) {
  const safeLang: Locale =
    lang === "it" || lang === "en" || lang === "fr" || lang === "es"
      ? lang
      : "en";

  const allCategories: Array<{
    key: Exclude<CategoryKey, "default">;
    icon: React.ReactNode;
    title: string;
    desc: string;
  }> = [
    {
      key: "base",
      icon: <BrainCircuit size={20} aria-hidden="true" />,
      title: L({ it: "Base", en: "Basic", fr: "Bases", es: "Básico" }, safeLang),
      desc: L(
        {
          it: "Competenze digitali di base e alfabetizzazione informatica.",
          en: "Basic digital and computer literacy skills.",
          fr: "Compétences numériques de base et culture informatique.",
          es: "Competencias digitales básicas y alfabetización informatica.",
        },
        safeLang
      ),
    },
    {
      key: "sicurezza",
      icon: <LockKeyhole size={20} aria-hidden="true" />,
      title: L(
        { it: "Sicurezza", en: "Security", fr: "Sécurité", es: "Seguridad" },
        safeLang
      ),
      desc: L(
        {
          it: "Protezione dei dati, minacce informatiche e prevenzione.",
          en: "Data protection, cyber threats and prevention.",
          fr: "Protection des données, menaces et prévention.",
          es: "Protección de datos, amenazas cibernéticas y prevención.",
        },
        safeLang
      ),
    },
    {
      key: "reti",
      icon: <Network size={20} aria-hidden="true" />,
      title: L(
        { it: "Reti", en: "Networking", fr: "Réseaux", es: "Redes" },
        safeLang
      ),
      desc: L(
        {
          it: "Fondamenti di reti, protocolli e infrastrutture.",
          en: "Networking fundamentals, protocols and infrastructure.",
          fr: "Bases des réseaux, protocoles et infrastructures.",
          es: "Fundamentos de redes, protocolos e infraestructuras.",
        },
        safeLang
      ),
    },
    {
      key: "ai",
      icon: <Cpu size={20} aria-hidden="true" />,
      title: L(
        {
          it: "Intelligenza Artificiale",
          en: "Artificial Intelligence",
          fr: "Intelligence Artificielle",
          es: "Inteligencia Artificial",
        },
        safeLang
      ),
      desc: L(
        {
          it: "Concetti base di AI, machine learning e applicazioni.",
          en: "Basics of AI, machine learning and applications.",
          fr: "Bases de l'IA, apprentissage automatique et applications.",
          es: "Conceptos básicos de IA, aprendizaje automático y aplicaciones.",
        },
        safeLang
      ),
    },
    {
      key: "cloud",
      icon: <Cloud size={20} aria-hidden="true" />,
      title: "Cloud",
      desc: L(
        {
          it: "Servizi cloud, modelli di distribuzione e sicurezza.",
          en: "Cloud services, deployment models and security.",
          fr: "Services cloud, modèles de déploiement et sécurité.",
          es: "Servicios en la nube, modelos de implementación y seguridad.",
        },
        safeLang
      ),
    },
    {
      key: "database",
      icon: <Database size={20} aria-hidden="true" />,
      title: "Database",
      desc: L(
        {
          it: "Modellazione, interrogazione e gestione dei dati.",
          en: "Modeling, querying and managing data.",
          fr: "Modélisation, requêtes et gestion des données.",
          es: "Modelado, consultas y gestión de datos.",
        },
        safeLang
      ),
    },
    {
      key: "programmazione",
      icon: <Code size={20} aria-hidden="true" />,
      title: L(
        {
          it: "Programmazione",
          en: "Programming",
          fr: "Programmation",
          es: "Programación",
        },
        safeLang
      ),
      desc: L(
        {
          it: "Logica di programmazione e linguaggi moderni.",
          en: "Programming logic and modern languages.",
          fr: "Logique de programmation et langages modernes.",
          es: "Lógica de programación y lenguajes modernos.",
        },
        safeLang
      ),
    },
    {
      key: "virtualizzazione",
      icon: <Layers size={20} aria-hidden="true" />,
      title: L(
        {
          it: "Virtualizzazione",
          en: "Virtualization",
          fr: "Virtualisation",
          es: "Virtualización",
        },
        safeLang
      ),
      desc: L(
        {
          it: "Tecnologie di virtualizzazione e ambienti cloud-native.",
          en: "Virtualization technologies and cloud-native environments.",
          fr: "Technologies de virtualisation et environnements cloud-native.",
          es: "Tecnologías de virtualización y entornos cloud-native.",
        },
        safeLang
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-10 overflow-x-hidden min-h-[100dvh]">
      {/* HERO (centrale, pulita) */}
      <header className="text-center max-w-3xl mx-auto">
        <div className="flex justify-center items-center gap-3 mb-3">
          <Image
            src={logo}
            alt="CertifyQuiz"
            width={44}
            height={44}
            className="h-11 w-auto"
            priority
          />
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800">
            CertifyQuiz
          </h1>
        </div>

        <p className="text-sm md:text-base text-slate-600 font-semibold mb-3">
          {L(
            {
              it: "Allenati per le certificazioni IT con quiz realistici e spiegazioni chiare.",
              en: "Prepare for IT certifications with realistic quizzes and clear explanations.",
              fr: "Préparez vos certifications IT avec des quiz réalistes et des explications claires.",
              es: "Prepárate para certificaciones IT con cuestionarios realistas y explicaciones claras.",
            },
            safeLang
          )}
        </p>

        <p className="text-xs md:text-sm text-slate-500 mb-6">
          {L(
            {
              it: "AWS, CCNA, Security+, Azure, CompTIA e altre: scegli una categoria e inizia subito.",
              en: "AWS, CCNA, Security+, Azure, CompTIA and more: pick a category and start now.",
              fr: "AWS, CCNA, Security+, Azure, CompTIA et plus : choisissez une catégorie et commencez.",
              es: "AWS, CCNA, Security+, Azure, CompTIA y más: elige una categoría y empieza ya.",
            },
            safeLang
          )}
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <Link
            href={`/${safeLang}/quiz-home`}
            className="inline-flex justify-center bg-blue-600 text-white font-bold px-6 py-3 rounded-xl shadow-md hover:bg-blue-700 transition-transform hover:scale-[1.02]"
          >
            {L(
              { it: "Esplora i quiz", en: "Explore quizzes", fr: "Explorer les quiz", es: "Explorar cuestionarios" },
              safeLang
            )}
          </Link>

          {!isLoggedIn && (
            <Link
              href={withLang(safeLang as any, "/login")}
              className="inline-flex justify-center items-center rounded-xl border px-6 py-3 font-bold hover:bg-neutral-50 transition"
            >
              {L(
                { it: "Accedi", en: "Login", fr: "Se connecter", es: "Iniciar sesión" },
                safeLang
              )}
            </Link>
          )}
        </div>

          {/* Contatore quiz  */}

                  {stats && (
          <p className="mt-3 text-xs md:text-sm text-slate-600">
            {L(
              {
                it: `${stats.questions.toLocaleString("it-IT")} domande • ${stats.topics.toLocaleString(
                  "it-IT"
                )} topic • ${stats.certifications.toLocaleString("it-IT")} certificazioni`,
                en: `${stats.questions.toLocaleString("en-US")} questions • ${stats.topics.toLocaleString(
                  "en-US"
                )} topics • ${stats.certifications.toLocaleString("en-US")} certifications`,
                fr: `${stats.questions.toLocaleString("fr-FR")} questions • ${stats.topics.toLocaleString(
                  "fr-FR"
                )} sujets • ${stats.certifications.toLocaleString("fr-FR")} certifications`,
                es: `${stats.questions.toLocaleString("es-ES")} preguntas • ${stats.topics.toLocaleString(
                  "es-ES"
                )} temas • ${stats.certifications.toLocaleString("es-ES")} certificaciones`,
              },
              safeLang
            )}
          </p>
        )}

        <p className="text-xs text-slate-500 mt-3">
          {L(
            {
              it: "I tuoi progressi vengono salvati nel profilo.",
              en: "Your progress is saved in your profile.",
              fr: "Vos progrès sont enregistrés dans votre profil.",
              es: "Tu progreso se guarda en tu perfil.",
            },
            safeLang
          )}
        </p>
      </header>

      {/* CATEGORIE (core) */}
      <section className="mt-8 md:mt-10" aria-label="Categories">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {allCategories.map((cat) => {
            const ui = CATEGORY_UI[cat.key];
            return (
              <Link
                key={cat.key}
                href={categoryPath(safeLang, cat.key)}
                className={`transition p-3 rounded-xl shadow border ${ui.bg} ${ui.border} ${ui.ring} text-left`}
              >
                <div className="flex items-center gap-2 text-slate-800 font-bold mb-1">
                  {cat.icon}
                  <span className="text-sm leading-tight">{cat.title}</span>
                </div>
                <div className="text-xs text-slate-600 leading-tight line-clamp-2">
                  {cat.desc}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Link suggeriti */}
        <div className="text-center mt-5">
          <Link
            href={withLang(safeLang as any, "/quiz-suggeriti")}
            className="text-blue-600 font-semibold hover:underline text-sm"
          >
            ⭐{" "}
            {L(
              {
                it: "Prova i nostri migliori quiz →",
                en: "Try our best quizzes →",
                fr: "Essayez nos meilleurs quiz →",
                es: "Prueba nuestros mejores quizzes →",
              },
              safeLang
            )}
          </Link>
        </div>
      </section>


                  {/* VENDORS (hub) */}
      <section className="mt-10 md:mt-12" aria-label="Browse by vendor">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-xs font-semibold text-slate-500">
            {L(
              {
                it: "Percorsi",
                en: "Paths",
                fr: "Parcours",
                es: "Rutas",
              },
              safeLang
            )}
          </div>

          <h2 className="mt-1 text-xl md:text-2xl font-extrabold text-slate-800">
            {L(
              {
                it: "Sfoglia per Brand",
                en: "Browse by vendor",
                fr: "Parcourir par éditeur",
                es: "Explorar por proveedor",
              },
              safeLang
            )}
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            {L(
              {
                it: "Scopri le certificazioni disponibili per ogni Brand.",
                en: "Discover available certifications for each vendor.",
                fr: "Découvrez les certifications disponibles pour chaque éditeur.",
                es: "Descubre las certificaciones disponibles por proveedor.",
              },
              safeLang
            )}
          </p>
        </div>

        {(() => {
          const hubHref = (slug: string) =>
            safeLang === "en" ? `/hub/${slug}` : `/${safeLang}/hub/${slug}`;

          // ✅ Mostra solo hub vendor che esistono ora (per evitare 404)
          const vendors: Array<{
            slug: string;
            title: string;
            desc: string;
            ui: { bg: string; border: string; ring: string };
          }> = [
            {
              slug: "google",
              title: "Google",
              desc: L(
                {
                  it: "Google Cloud (e altri percorsi in arrivo).",
                  en: "Google Cloud (more paths coming).",
                  fr: "Google Cloud (autres parcours à venir).",
                  es: "Google Cloud (más rutas próximamente).",
                },
                safeLang
              ),
              ui: CATEGORY_UI.cloud,
            },
            // 👉 aggiungi questi solo quando hai creato gli hub corrispondenti
            // {
            //   slug: "aws",
            //   title: "AWS",
            //   desc: L(
            //     { it: "Certificazioni AWS.", en: "AWS certifications.", fr: "Certifications AWS.", es: "Certificaciones AWS." },
            //     safeLang
            //   ),
            //   ui: CATEGORY_UI.cloud,
            // },
            // {
            //   slug: "microsoft",
            //   title: "Microsoft",
            //   desc: L(
            //     { it: "Azure e Microsoft.", en: "Azure and Microsoft.", fr: "Azure et Microsoft.", es: "Azure y Microsoft." },
            //     safeLang
            //   ),
            //   ui: CATEGORY_UI.programmazione,
            // },
            // {
            //   slug: "cisco",
            //   title: "Cisco",
            //   desc: L(
            //     { it: "Networking & Security.", en: "Networking & Security.", fr: "Réseaux & Sécurité.", es: "Redes y seguridad." },
            //     safeLang
            //   ),
            //   ui: CATEGORY_UI.reti,
            // },
          ];

          return (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {vendors.map((v) => (
                <Link
                  key={v.slug}
                  href={hubHref(v.slug)}
                  className={`transition p-4 rounded-xl shadow border ${v.ui.bg} ${v.ui.border} ${v.ui.ring} text-left`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-slate-800 font-extrabold">{v.title}</div>
                    <span className="text-xs font-semibold text-slate-600">
                      {L({ it: "Apri →", en: "Open →", fr: "Ouvrir →", es: "Abrir →" }, safeLang)}
                    </span>
                  </div>

                  <div className="mt-1 text-xs text-slate-600 leading-tight line-clamp-2">
                    {v.desc}
                  </div>

                  <div className="mt-3 text-sm font-bold text-slate-800">
                    {L(
                      { it: "Vai al vendor", en: "Go to vendor", fr: "Voir le vendor", es: "Ver proveedor" },
                      safeLang
                    )}
                  </div>
                </Link>
              ))}
            </div>
          );
        })()}

        {/* link alla pagina vendors centralizzata (quando la crei) */}
        <div className="text-center mt-5">
          <Link
            href={safeLang === "en" ? "/hub/vendors" : `/${safeLang}/hub/vendors`}
            className="text-blue-600 font-semibold hover:underline text-sm"
          >
            {L(
              {
                it: "Vedi tutti i brand →",
                en: "See all vendors →",
                fr: "Voir tous les éditeurs →",
                es: "Ver todos los proveedores →",
              },
              safeLang
            )}
          </Link>
        </div>
      </section>

      {/* BLOG (sotto, compatto, non invasivo) */}
      <section className="mt-10 md:mt-12" aria-label="Blog teaser">
        <div className="max-w-3xl mx-auto">
          <div className="mb-2 text-xs font-semibold text-slate-500 text-left">
            {L({ it: "Dal blog", en: "From the blog", fr: "Du blog", es: "Del blog" }, safeLang)}
          </div>
          <BlogTeaser lang={safeLang as any} variant="compact" />
        </div>
      </section>
    </div>
  );
}
