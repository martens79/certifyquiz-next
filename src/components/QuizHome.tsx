// src/components/QuizHome.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Lock,
  Network,
  Cloud,
  Database,
  Code,
  Server,
  Cpu,
  BriefcaseBusiness,
} from "lucide-react";

import QuizTitle from "@/components/QuizTitle";
import CategoryBox from "@/components/CategoryBox";
import BottomNavbar from "@/components/BottomNavbar";


// Locale + builder dei path certificazioni (client-safe)
import type { Locale, CategoryKey } from "@/lib/paths";
import { certPath } from "@/lib/paths";

/* ---------- i18n helpers ---------- */
type I18nText = Partial<Record<Locale, string>>;
const getLabel = (d: I18nText, lang: Locale) =>
  d[lang] ?? d.it ?? d.en ?? d.fr ?? d.es ?? "";

/* ---------- Tipi availability (backend) ---------- */
type AvailabilityMap = Record<string, { translated: number; total: number }>;
type BackendAvailabilityItem = {
  slug?: string;
  topics_with_translations?: number;
  topics_total?: number;
};
type BackendAvailabilityPayload =
  | { items?: BackendAvailabilityItem[] }
  | BackendAvailabilityItem[];

function isArrayPayload(x: unknown): x is BackendAvailabilityItem[] {
  return Array.isArray(x);
}
function hasItemsPayload(x: unknown): x is { items: BackendAvailabilityItem[] } {
  return (
    typeof x === "object" &&
    x !== null &&
    Array.isArray((x as Record<string, unknown>).items)
  );
}

/* ---------- Util per badge ---------- */
const slugFromLink = (link?: string | null) => {
  if (!link) return null;
  // match sia "certificazioni" (IT) che "certifications" (EN/FR) e "certificaciones" (ES)
  const m = link.match(
    /\/(certificazioni|certifications|certificaciones)\/([^/?#]+)/i
  );
  return m?.[2] ? m[2].replace(/\/+$/, "") : null;
};
const SLUG_ALIASES: Record<string, string> = {
  "security-plus": "security-plus",
  "cisco-ccst-security": "cisco-ccst-cybersecurity",
  "microsoft-ai-fundamentals": "microsoft-ai",
  "ai-fundamentals": "microsoft-ai",
};


const translatedCountForLink = (
  availability: AvailabilityMap,
  link?: string | null
) => {
  const raw = slugFromLink(link);
  if (!raw) return 0;

  const slug = SLUG_ALIASES[raw] ?? raw;
  const rec = availability[slug];
  return rec ? Number(rec.translated ?? 0) : 0;
};


const smartBadgeLabel = (
  availability: AvailabilityMap,
  link: string | null | undefined,
  lang: Locale
) => {
  const raw = slugFromLink(link);
  const slug = raw ? SLUG_ALIASES[raw] ?? raw : null;

  const rec = slug ? availability[slug] : undefined;
  const translated = rec ? Number(rec.translated ?? 0) : 0;
  const total = rec ? Number(rec.total ?? 0) : 0;

  if (total > 0 && translated >= total) {
    const L: Record<Locale, string> = {
      en: "All topics",
      fr: "Tous les sujets",
      es: "Todos los temas",
      it: "Tutti i topic",
    };
    return `✓ ${L[lang]}`;
  }
  const L2: Record<Locale, (n: number) => string> = {
    it: (n) => (n === 1 ? "1 topic" : `${n} topic`),
    en: (n) => (n === 1 ? "1 topic" : `${n} topics`),
    fr: (n) => (n === 1 ? "1 sujet" : `${n} sujets`),
    es: (n) => (n === 1 ? "1 tema" : `${n} temas`),
  };
  return `✔ ${L2[lang](translated)}`;
};

const AVAILABLE_TXT: Record<Locale, { title: string; lead: string }> = {
  en: { title: "Available topics", lead: "Already translated in this language:" },
  fr: { title: "Sujets disponibles", lead: "Déjà traduits dans cette langue :" },
  es: { title: "Temas disponibles", lead: "Ya traducidos en este idioma:" },
  it: { title: "Topic disponibili", lead: "Già disponibili in italiano:" },
};

/* ---------- Tipi per le certificazioni mostrate ---------- */
type CertItem = {
  name: string;
  link: string | null;
  comingSoon?: true;
};

type CertificationNames = Record<CategoryKey, CertItem[]>;

export default function QuizHome({ lang }: { lang: Locale }) {
  const [availability, setAvailability] = useState<AvailabilityMap>({});

  useEffect(() => {
  // ✅ reset immediato a ogni cambio lingua
  setAvailability({});

  // ✅ IT: niente chiamata (ma lo state è già pulito)
  if (lang === "it") return;

  const ac = new AbortController();

  fetch(`/api/backend/quiz-translation-availability?lang=${lang}&strict=1`, {
  signal: ac.signal,
})

    .then((r) => (r.ok ? r.json() : Promise.reject(r)))
    .then((data: unknown) => {
      const map: AvailabilityMap = {};
      const rows: BackendAvailabilityItem[] = isArrayPayload(data)
        ? data
        : hasItemsPayload(data)
        ? data.items
        : [];

      for (const it of rows) {
        if (!it?.slug) continue;
        map[it.slug] = {
          translated: Number(it.topics_with_translations ?? 0),
          total: Number(it.topics_total ?? 0),
        };
      }
      // ⬇⬇⬇ METTI QUESTO BLOCCO QUI ⬇⬇⬇
      console.log("🔎 availability keys:", Object.keys(map));
      console.log(
        "🔎 CCST entries:",
        Object.entries(map).filter(([k]) => k.includes("ccst"))
      );
      console.log(
        "❓ has cisco-ccst-cybersecurity?",
        map["cisco-ccst-cybersecurity"]
      );
      // ⬆⬆⬆ FINE ⬆⬆⬆
      setAvailability(map);
    })
    .catch((err) => {
      // ignora abort
      if (err?.name !== "AbortError") setAvailability({});
    });

  return () => ac.abort();
}, [lang]);


  /* ---------- SLUG ufficiali (tutti con certPath) ---------- */

// ✅ base condivisa anche come fallback "default"
const baseCerts = [
  { name: "EIPASS", link: certPath(lang, "eipass") },
  { name: "ECDL", link: certPath(lang, "icdl") },
  { name: "PEKIT", link: certPath(lang, "pekit") },
  { name: "ITIL 4 Foundation", link: certPath(lang, "itil-4-foundation") },
  { name: "A+", link: certPath(lang, "comptia-a-plus") },
  { name: "IC3", link: null },
  { name: "CompTIA Tech+ (ex ITF+)", link: certPath(lang, "comptia-itf-plus") },

]; // ✅ niente "as const"

const certificationNames: CertificationNames = {
  // ✅ richiesto perché CategoryKey include "default"
  default: baseCerts,

  base: baseCerts,

    management: [
    { name: "PMP", link: certPath(lang, "pmp") },
    { name: "ITIL 4 Foundation", link: certPath(lang, "itil-4-foundation") },
    { name: "CAPM", link: null, comingSoon: true },
    { name: "Scrum Master", link: null, comingSoon: true },
    { name: "PRINCE2 Foundation", link: null, comingSoon: true },
  ],

  sicurezza: [
    { name: "Security+", link: certPath(lang, "security-plus") },
    { name: "CEH", link: certPath(lang, "ceh") },
    { name: "CISSP", link: certPath(lang, "cissp") },
    { name: "CISM", link: null },
    { name: "ISC2 CC", link: certPath(lang, "isc2-cc") },
    { name: "CCST Cybersecurity", link: certPath(lang, "cisco-ccst-cybersecurity") },

  ],

  reti: [
  { name: "Network+", link: certPath(lang, "network-plus") },
  { name: "CCNA", link: certPath(lang, "ccna") },
  { name: "CCNP Enterprise", link: certPath(lang, "ccnp-enterprise") },
  { name: "JNCIE", link: certPath(lang, "jncie") },
  { name: "CCST Networking", link: certPath(lang, "cisco-ccst-networking") },
  { name: "F5-CTS", link: certPath(lang, "f5") },
],

cloud: [
  { name: "AWS Cloud Practitioner", link: certPath(lang, "aws-cloud-practitioner") },
  { name: "AWS AI Practitioner", link: certPath(lang, "aws-ai-practitioner") },
  { name: "Azure", link: certPath(lang, "microsoft-azure-fundamentals") },
  { name: "Google Cloud", link: certPath(lang, "google-cloud") },
  { name: "Google Cloud Digital Leader", link: certPath(lang, "google-cloud-digital-leader") },
  { name: "Kubernetes KCNA", link: certPath(lang, "kcna-kubernetes-cloud-native") },
  { name: "CompTIA Cloud+", link: certPath(lang, "comptia-cloud-plus") },
  { name: "IBM Cloud v5", link: certPath(lang, "ibm-cloud-v5") },
  { name: "AWS Solutions Architect", link: certPath(lang, "aws-solutions-architect") },
],

  database: [
    { name: "Microsoft SQL Server", link: certPath(lang, "microsoft-sql-server") },
    { name: "Oracle", link: certPath(lang, "oracle-database-sql") },
    { name: "MySQL", link: certPath(lang, "mysql") },
    { name: "MongoDB", link: certPath(lang, "mongodb-developer") },
  ],

  programmazione: [
    { name: "Java SE", link: certPath(lang, "java-se") },
    { name: "Python", link: certPath(lang, "python-developer") },
    { name: "JavaScript", link: certPath(lang, "javascript-developer") },
    { name: "C#", link: certPath(lang, "csharp") },
    { name: "TypeScript", link: null, comingSoon: true },
    { name: "Kotlin", link: null, comingSoon: true },
    { name: "Go", link: null, comingSoon: true },
    { name: "Rust", link: null, comingSoon: true },
    { name: "Swift", link: null, comingSoon: true },
  ],

  virtualizzazione: [
    { name: "VMware VCP", link: certPath(lang, "vmware-vcp") },
    { name: "Hyper-V", link: null },
    { name: "Microsoft Virtualization", link: certPath(lang, "microsoft-virtualization") },
  ],

  ai: [
  { name: "AI Foundations", link: certPath(lang, "ai-foundations") },
  { name: "Microsoft AI Fundamentals", link: certPath(lang, "microsoft-ai") },
  { name: "AWS AI Practitioner", link: certPath(lang, "aws-ai-practitioner") },
  { name: "Google TensorFlow Developer", link: certPath(lang, "tensorflow") },
  { name: "PyTorch", link: null },
  { name: "OpenAI", link: null },
],
};

  const allCerts: CertItem[] = Object.values(certificationNames).flat();

  const allCertsUnique: CertItem[] = Array.from(
  new Map(allCerts.map((c) => [c.link ?? `name:${c.name}`, c])).values()
);


  const translatedCertsForLang: CertItem[] =
  lang !== "it"
    ? allCertsUnique
        .filter((c) => translatedCountForLink(availability, c.link) > 0)
        .sort((a, b) => {
          const cb = translatedCountForLink(availability, b.link);
          const ca = translatedCountForLink(availability, a.link);
          return cb !== ca ? cb - ca : a.name.localeCompare(b.name);
        })
    : [];


  /* ---------- UI ---------- */
  const quizCategories: Array<{
    key: CategoryKey;
    categoryKey: CategoryKey;
    name: string;
    description: string;
    color: "red" | "rose" | "green" | "purple" | "yellow" | "indigo" | "orange" | "cyan" | "blue" | "teal";
    icon: React.ReactNode;
    certifications: CertItem[];
  }> = [
    {
      key: "base",
      categoryKey: "base",
      name: getLabel({ it: "Base", en: "Fundamentals", es: "Básico", fr: "Base" }, lang),
      description: getLabel(
        {
          it: "Concetti base di informatica e hardware.",
          en: "Basic IT and hardware concepts.",
          es: "Conceptos básicos de informática y hardware.",
          fr: "Notions de base en informatique et matériel.",
        },
        lang
      ),
      color: "blue",
      icon: <GraduationCap size={30} />,
      certifications: certificationNames.base,
    },
    {
      key: "sicurezza",
      categoryKey: "sicurezza",
      name: getLabel({ it: "Sicurezza", en: "Security", es: "Seguridad", fr: "Sécurité" }, lang),
      description: getLabel(
        {
          it: "Fondamenti di sicurezza informatica.",
          en: "Cybersecurity fundamentals.",
          es: "Fundamentos de ciberseguridad.",
          fr: "Principes de cybersécurité.",
        },
        lang
      ),
      color: "rose",
      icon: <Lock size={30} />,
      certifications: certificationNames.sicurezza,
    },
    {
      key: "reti",
      categoryKey: "reti",
      name: getLabel({ it: "Reti", en: "Networking", es: "Redes", fr: "Réseaux" }, lang),
      description: getLabel(
        {
          it: "Protocolli e infrastrutture di rete.",
          en: "Network protocols and infrastructure.",
          es: "Protocolos e infraestructura de red.",
          fr: "Protocoles et infrastructure réseau.",
        },
        lang
      ),
      color: "green",
      icon: <Network size={30} />,
      certifications: certificationNames.reti,
    },
    {
      key: "cloud",
      categoryKey: "cloud",
      name: getLabel({ it: "Cloud", en: "Cloud", es: "Nube", fr: "Cloud" }, lang),
      description: getLabel(
        {
          it: "Servizi e architetture cloud.",
          en: "Cloud services and architectures.",
          es: "Servicios y arquitecturas cloud.",
          fr: "Services et architectures cloud.",
        },
        lang
      ),
      color: "purple",
      icon: <Cloud size={30} />,
      certifications: certificationNames.cloud,
    },
    {
      key: "database",
      categoryKey: "database",
      name: getLabel({ it: "Database", en: "Database", es: "Base de datos", fr: "Base de données" }, lang),
      description: getLabel(
        {
          it: "Progettazione e gestione dei database.",
          en: "Database design and management.",
          es: "Diseño y gestión de bases de datos.",
          fr: "Conception et gestion de bases de données.",
        },
        lang
      ),
      color: "yellow",
      icon: <Database size={30} />,
      certifications: certificationNames.database,
    },
    {
      key: "programmazione",
      categoryKey: "programmazione",
      name: getLabel(
        { it: "Programmazione", en: "Programming", es: "Programación", fr: "Programmation" },
        lang
      ),
      description: getLabel(
        {
          it: "Linguaggi e sviluppo software.",
          en: "Languages and software development.",
          es: "Lenguajes y desarrollo de software.",
          fr: "Langages et développement logiciel.",
        },
        lang
      ),
      color: "teal",
      icon: <Code size={30} />,
      certifications: certificationNames.programmazione,
    },
    {
      key: "virtualizzazione",
      categoryKey: "virtualizzazione",
      name: getLabel(
        { it: "Virtualizzazione", en: "Virtualization", es: "Virtualización", fr: "Virtualisation" },
        lang
      ),
      description: getLabel(
        {
          it: "Tecnologie di virtualizzazione.",
          en: "Virtualization technologies.",
          es: "Tecnologías de virtualización.",
          fr: "Technologies de virtualisation.",
        },
        lang
      ),
      color: "orange",
      icon: <Server size={30} />,
      certifications: certificationNames.virtualizzazione,
    },
    {
      key: "ai",
categoryKey: "ai",
name: getLabel(
  {
    it: "Intelligenza Artificiale",
    en: "Artificial Intelligence",
    es: "Inteligencia Artificial",
    fr: "Intelligence Artificielle",
  },
  lang
),

      description: getLabel(
        {
          it: "Machine learning e AI applicata.",
          en: "Machine learning and applied AI.",
          es: "Aprendizaje automático e IA aplicada.",
          fr: "Apprentissage automatique et IA appliquée.",
        },
        lang
      ),
      color: "cyan",
      icon: <Cpu size={30} />,
      certifications: certificationNames.ai,
    },
  ];

  return (
    <div className="min-h-svh
 bg-gray-100 text-gray-900 flex flex-col">
      <main className="flex-1 overflow-y-auto px-3 pt-2 pb-15.5">
        <QuizTitle lang={lang} />

        {lang !== "it" && lang !== "en" && translatedCertsForLang.length > 0 && (
          <div className="mx-auto max-w-345 mb-4 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-900 p-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="text-sm">
                <div className="font-semibold">
                  {AVAILABLE_TXT[lang]?.title || "Available topics"}
                </div>
                <div className="opacity-80">
                  {AVAILABLE_TXT[lang]?.lead || "Already translated in this language:"}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {translatedCertsForLang.map((c) => {
                  const label = smartBadgeLabel(availability, c.link, lang);
                  const isDisabled = !c.link;
                  return (
                    <Link
                      key={`${c.link ?? "nolink"}::${c.name}`}
                      href={c.link ?? "#"}
                      onClick={(e) => {
                        if (isDisabled) e.preventDefault();
                      }}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm transition
                        ${
                          !isDisabled
                            ? "bg-white border-emerald-300 hover:bg-emerald-100"
                            : "bg-gray-200 border-gray-300 cursor-not-allowed text-gray-500"
                        }`}
                      title={label}
                      aria-disabled={isDisabled}
                      prefetch={false}
                    >
                      <span>{c.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 border border-emerald-400">
                        {label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}

               {/* Griglia categorie: box compatti + id per anchor (#base, #sicurezza, ...) */}
        <div
          className="
            mx-auto max-w-345
            grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4
            gap-3 mt-1
          "
        >
          {quizCategories.map((cat) => (
            <section key={cat.key} id={cat.key} className="h-55">
              <CategoryBox
                title={cat.name}
                icon={cat.icon}
                description={cat.description}
                categoryKey={cat.categoryKey}
                lang={lang}
                color={cat.color}
                certifications={cat.certifications}
                compact
                className="h-full"
              />
            </section>
          ))}
        </div>

          <div className="mt-4 flex justify-center">
  <a
    href="#management"
    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-800 transition"
  >
    <span>
      {getLabel(
        {
          it: "Scopri anche l’area Management",
          en: "Discover the Management area",
          fr: "Découvrez aussi l’espace Management",
          es: "Descubre también el área Management",
        },
        lang
      )}
    </span>

    <span className="animate-bounce">↓</span>
  </a>
</div>

        {/* Management: area business/career in evidenza */}
        <section id="management" className="mx-auto max-w-345 mt-4">
          <CategoryBox
            title={getLabel(
              {
                it: "Management & Project Management",
                en: "Management & Project Management",
                es: "Gestión y Project Management",
                fr: "Management & Gestion de Projet",
              },
              lang
            )}
            icon={<BriefcaseBusiness size={32} />}
            description={getLabel(
              {
                it: "Project management, leadership, processi Agile, governance e organizzazione aziendale.",
                en: "Project management, leadership, Agile processes, governance and business organization.",
                es: "Gestión de proyectos, liderazgo, procesos Agile, gobernanza y organización empresarial.",
                fr: "Gestion de projet, leadership, processus Agile, gouvernance et organisation d’entreprise.",
              },
              lang
            )}
            categoryKey="management"
            lang={lang}
            color="blue"
            certifications={certificationNames.management}
            compact
            variant="wide"
            className="min-h-42"
          />
        </section>

      </main>

      <BottomNavbar />
    </div>
  );
}
