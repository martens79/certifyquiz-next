// src/pages/QuizHome.jsx
import { useEffect, useState } from "react";
import { GraduationCap, Lock, Network, Cloud, Database, Code, Server, Cpu } from "lucide-react";
import { getCurrentLang, getLabel, getCurrentLangFromPath } from "../utils/langUtils";
import { useAuth } from "../contexts/AuthContext";
import BottomNavbar from "../components/BottomNavbar";
import QuizTitle from "../components/QuizTitle";
import CategoryBox from "../components/CategoryBox";
import SEOHead from "../components/SEOHead"; // ✅ aggiunto
import { useLocation, Link } from "react-router-dom";
import { api } from "../services/api";

// Estrae lo slug dalla route /{lang}/certifications/<slug>
const slugFromLink = (link) => {
  if (!link || typeof link !== "string") return null;
  const i = link.indexOf("/certifications/");
  if (i === -1) return null;
  return link.slice(i + "/certifications/".length).replace(/\/+$/, "");
};

// Ritorna il numero di topic tradotti per una cert (usando la mappa availability)
// quante tradotte per quel link (compatibile anche con vecchia mappa numerica)
const translatedCountForLink = (availability, link) => {
  const slug = slugFromLink(link);
  const rec  = slug ? availability?.[slug] : undefined;
  if (rec && typeof rec === "object") return Number(rec.translated || 0);
  return Number(rec || 0);
};

// TUTTI i topic tradotti?
const isFullyTranslatedForLink = (availability, link) => {
  const slug = slugFromLink(link);
  const rec  = slug ? availability?.[slug] : undefined;
  if (!rec || typeof rec !== "object") return false; // backend vecchio: non sappiamo
  return rec.total > 0 && Number(rec.translated || 0) >= Number(rec.total || 0);
};
// Ritorna true se la cert ha almeno 1 topic tradotto nella lingua corrente
const hasTranslatedForLang = (availability, link) =>
  translatedCountForLink(availability, link) > 0;

// Filtra le certificazioni che hanno traduzioni disponibili
const pickTranslatedCerts = (certs, availability) =>
  (certs || []).filter((c) => hasTranslatedForLang(availability, c.link));

// Ordina: prima quelle con più topic tradotti, poi alfabetico per nome
const sortCertsForLang = (certs, availability) =>
  [...(certs || [])].sort((a, b) => {
    const cb = translatedCountForLink(availability, b.link);
    const ca = translatedCountForLink(availability, a.link);
    if (cb !== ca) return cb - ca;
    return (a.name || "").localeCompare(b.name || "");
  });

// Formatta la stringa "n topic" localizzata
const formatTopicCount = (n, lang) => {
  const L = {
    it: n === 1 ? "1 topic" : `${n} topic`,
    en: n === 1 ? "1 topic" : `${n} topics`,
    fr: n === 1 ? "1 sujet" : `${n} sujets`,
    es: n === 1 ? "1 tema" : `${n} temas`,
  };
  return (L[lang] || L.en);
};

// Etichetta per il badge (es. "✔ 3 topics")
const badgeLabel = (n, lang) => `✔ ${formatTopicCount(n, lang)}`;

// 🧠 Badge intelligente: se la cert è completa → "✓ All topics", altrimenti "✔ n topics"
const smartBadgeLabel = (availability, link, lang) => {
  const slug = slugFromLink(link);
  const rec = slug ? availability?.[slug] : undefined;
  const translated = rec && typeof rec === "object" ? Number(rec.translated || 0) : Number(rec || 0);
  const total      = rec && typeof rec === "object" ? Number(rec.total || 0) : 0;

  if (total > 0 && translated >= total) {
    const L = { en: "All topics", fr: "Tous les sujets", es: "Todos los temas", it: "Tutti i topic" };
    return `✓ ${L[lang] || L.en}`;
  }
  // fallback: usa la tua etichetta classica
  return `✔ ${formatTopicCount(translated, lang)}`;
};


// Classi per le pill: attiva (tradotta) vs default
const pillClasses = (active) =>
  active
    ? "bg-emerald-100 text-emerald-900 border-emerald-300"
    : "bg-white/10 text-white border-white/20";

// Utility per deduplicare (se mai unisci liste)
const uniqBy = (arr, keyFn) => {
  const seen = new Set();
  return (arr || []).filter((x) => {
    const k = keyFn(x);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
};


// 🌍 Funzione principale esportata
export default function QuizHome() {
  const location = useLocation();
  const { pathname } = useLocation();
   const lang = getCurrentLangFromPath(pathname); // lingua presa dall’URL (en/fr/es/it)
  const { isLoggedIn } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  // ✅ SEO dinamico
  const title = getLabel({
    it: "Quiz online per certificazioni IT — CertifyQuiz",
    en: "Online IT Certification Quizzes — CertifyQuiz",
    fr: "Quiz en ligne pour certifications IT — CertifyQuiz",
    es: "Cuestionarios online para certificaciones IT — CertifyQuiz",
  });

  const description = getLabel({
    it: "Accedi a tutte le categorie di quiz IT: sicurezza, reti, cloud, database, programmazione e altro. Scegli la certificazione e inizia subito.",
    en: "Access all IT quiz categories: security, networking, cloud, databases, programming and more. Choose your certification and start now.",
    fr: "Accédez à toutes les catégories de quiz IT : sécurité, réseaux, cloud, bases de données, programmation et plus. Choisissez votre certification et commencez.",
    es: "Accede a todas las categorías de cuestionarios IT: seguridad, redes, nube, bases de datos, programación y más. Elige tu certificación y empieza ahora.",
  });

  const hreflangs = [
    { hrefLang: "it", href: "https://www.certifyquiz.com/it/quiz-home" },
    { hrefLang: "en", href: "https://www.certifyquiz.com/en/quiz-home" },
    { hrefLang: "fr", href: "https://www.certifyquiz.com/fr/quiz-home" },
    { hrefLang: "es", href: "https://www.certifyquiz.com/es/quiz-home" },
    { hrefLang: "x-default", href: "https://www.certifyquiz.com/en/quiz-home" },
  ];

  // Testi banner "Available topics"
const AVAILABLE_TXT = {
  en: { title: "Available topics", lead: "Already translated in this language:" },
  fr: { title: "Sujets disponibles", lead: "Déjà traduits dans cette langue :" },
  es: { title: "Temas disponibles", lead: "Ya traducidos en este idioma:" },
  it: { title: "Topic disponibili", lead: "Già disponibili in italiano:" },
};

// 🔎 Disponibilità quiz tradotti per certificazione (slug → count)
const [availability, setAvailability] = useState({});

// ✅ normalizza slug backend → slug canonico FE
const normalizeAvailSlug = (raw) => {
  const s = String(raw || "").trim();

  // CCST: accetta entrambe le varianti, ma usa SEMPRE quella che vuoi come canonical in FE
  if (s === "cisco-ccst-security") return "cisco-ccst-cybersecurity";
  if (s === "ccst-cybersecurity") return "cisco-ccst-cybersecurity";

  return s;
};

// fetch una sola volta per lingua (solo non-IT)
useEffect(() => {
  if (lang === "it") return;

  api
    .get("/quiz-translation-availability", { params: { lang } })
    .then(({ data }) => {
      const map = {};

      (data?.items || []).forEach((it) => {
        const slug = normalizeAvailSlug(it?.slug);
        if (!slug) return;

        const val = {
          translated: Number(it.topics_with_translations || 0),
          total: Number(it.topics_total || 0),
        };

        // ✅ canonical
        map[slug] = val;

        // ✅ alias legacy: se in qualche punto il render usa ancora "...-security"
        if (slug === "cisco-ccst-cybersecurity") {
          map["cisco-ccst-security"] = val;
        }
      });

      console.log("[availability]", map);
      setAvailability(map);
    })
    .catch((e) => {
      console.error(
        "availability fetch error:",
        e?.response?.status,
        e?.message
      );
    });
}, [lang]);






  // 🎯 Nomi certificazioni
  const certificationNames = {
    base: [
      { name: "EIPASS", link: `/${lang}/certifications/eipass` },
      { name: "ECDL", link: `/${lang}/certifications/ecdl` },
      { name: "PEKIT", link: `/${lang}/certifications/pekit` },
      { name: "A+", link: `/${lang}/certifications/comptia-a-plus` },
      { name: "IC3", link: null },
      { name: "CompTIA Tech+ (ex ITF+)", link: `/${lang}/certifications/comptia-itf-plus` },
    ],
    sicurezza: [
      { name: "Security+", link: `/${lang}/certifications/security-plus` },
      { name: "CEH", link: `/${lang}/certifications/ceh` },
      { name: "CISSP", link: `/${lang}/certifications/cissp` },
      { name: "CISM", link: null },
      { name: "ISC2 CC", link: `/${lang}/certifications/isc2-cc` },
      { name: "CCST Cybersecurity", link: `/${lang}/certifications/cisco-ccst-security` },
    ],
    reti: [
      { name: "Network+", link: `/${lang}/certifications/network-plus` },
      { name: "CCNA", link: `/${lang}/certifications/ccna` },
      { name: "JNCIE", link: `/${lang}/certifications/jncie` },
      { name: "CCST Networking", link: `/${lang}/certifications/cisco-ccst-networking` },
      { name: "F5-CTS", link: `/${lang}/certifications/f5` },
    ],
    cloud: [
      { name: "AWS Cloud Practitioner", link: `/${lang}/certifications/aws-cloud-practitioner` },
      { name: "Azure", link: `/${lang}/certifications/microsoft-azure-fundamentals` },
      { name: "Google Cloud", link: `/${lang}/certifications/google-cloud` },
      { name: "CompTIA Cloud+", link: `/${lang}/certifications/comptia-cloud-plus` },
      { name: "IBM Cloud v5", link: `/${lang}/certifications/ibm-cloud-v5` },
      { name: "AWS Solutions Architect", link: `/${lang}/certifications/aws-solutions-architect` },
    ],
    database: [
      { name: "Microsoft SQL Server", link: `/${lang}/certifications/microsoft-sql-server` },
      { name: "Oracle", link: `/${lang}/certifications/oracle-database-sql` },
      { name: "MySQL", link: `/${lang}/certifications/mysql` },
      { name: "MongoDB", link: `/${lang}/certifications/mongodb-developer` },
    ],
    programmazione: [
      { name: "Java SE", link: `/${lang}/certifications/java-se` },
      { name: "Python", link: `/${lang}/certifications/python-developer` },
      { name: "JavaScript", link: `/${lang}/certifications/javascript-developer` },
      { name: "C#", link: `/${lang}/certifications/csharp` },
      { name: "TypeScript", link: null, comingSoon: true },
      { name: "Kotlin", link: null, comingSoon: true },
      { name: "Go", link: null, comingSoon: true },
      { name: "Rust", link: null, comingSoon: true },
      { name: "Swift", link: null, comingSoon: true },
    ],
    virtualizzazione: [
      { name: "VMware VCP", link: `/${lang}/certifications/vmware-vcp` },
      { name: "Hyper-V", link: null },
      { name: "Microsoft Virtualization", link: `/${lang}/certifications/microsoft-virtualization` },
    ],
    "intelligenza-artificiale": [
      { name: "Google TensorFlow Developer", link: `/${lang}/certifications/tensorflow` },
      { name: "PyTorch", link: null },
      { name: "OpenAI", link: null },
      { name: "Microsoft AI Fundamentals", link: `/${lang}/certifications/microsoft-ai-fundamentals` },
    ],
  };


 // Elenco certificazioni tradotte nella lingua corrente (usa gli slug dei link)
// Tutte le certificazioni in un unico array
const allCerts = Object.values(certificationNames).flat();

// Tutte le cert con almeno 1 topic tradotto (parziali O complete)
const translatedCertsForLang =
  lang !== "it"
    ? allCerts
        .filter((c) => translatedCountForLink(availability, c.link) > 0)
        .sort((a, b) => {
          const cb = translatedCountForLink(availability, b.link);
          const ca = translatedCountForLink(availability, a.link);
          return cb !== ca ? cb - ca : (a.name || "").localeCompare(b.name || "");
        })
    : [];



  // 📦 Categorie principali
  const quizCategories = [
    {
      key: "base",
      route: "/base",
      name: getLabel({ it: "Base", en: "Fundamentals", es: "Básico", fr: "Base" }),
      description: getLabel({
        it: "Concetti base di informatica e hardware.",
        en: "Basic IT and hardware concepts.",
        es: "Conceptos básicos de informática y hardware.",
        fr: "Notions de base en informatique et matériel.",
      }),
      color: "blue",
      icon: <GraduationCap size={30} />,
      certifications: certificationNames.base,
    },
    {
      key: "sicurezza",
      route: "/sicurezza",
      name: getLabel({ it: "Sicurezza", en: "Security", es: "Seguridad", fr: "Sécurité" }),
      description: getLabel({
        it: "Fondamenti di sicurezza informatica.",
        en: "Cybersecurity fundamentals.",
        es: "Fundamentos de ciberseguridad.",
        fr: "Principes de cybersécurité.",
      }),
      color: "rose",
      icon: <Lock size={30} />,
      certifications: certificationNames.sicurezza,
    },
    {
      key: "reti",
      route: "/reti",
      name: getLabel({ it: "Reti", en: "Networking", es: "Redes", fr: "Réseaux" }),
      description: getLabel({
        it: "Protocolli e infrastrutture di rete.",
        en: "Network protocols and infrastructure.",
        es: "Protocolos e infraestructura de red.",
        fr: "Protocoles et infrastructure réseau.",
      }),
      color: "green",
      icon: <Network size={30} />,
      certifications: certificationNames.reti,
    },
    {
      key: "cloud",
      route: "/cloud",
      name: getLabel({ it: "Cloud", en: "Cloud", es: "Nube", fr: "Cloud" }),
      description: getLabel({
        it: "Servizi e architetture cloud.",
        en: "Cloud services and architectures.",
        es: "Servicios y arquitecturas cloud.",
        fr: "Services et architectures cloud.",
      }),
      color: "purple",
      icon: <Cloud size={30} />,
      certifications: certificationNames.cloud,
    },
    {
      key: "database",
      route: "/database",
      name: getLabel({ it: "Database", en: "Database", es: "Base de datos", fr: "Base de données" }),
      description: getLabel({
        it: "Progettazione e gestione dei database.",
        en: "Database design and management.",
        es: "Diseño y gestión de bases de datos.",
        fr: "Conception et gestion de bases de données.",
      }),
      color: "yellow",
      icon: <Database size={30} />,
      certifications: certificationNames.database,
    },
    {
      key: "programmazione",
      route: "/programmazione",
      name: getLabel({ it: "Programmazione", en: "Programming", es: "Programación", fr: "Programmation" }),
      description: getLabel({
        it: "Linguaggi e sviluppo software.",
        en: "Languages and software development.",
        es: "Lenguajes y desarrollo de software.",
        fr: "Langages et développement logiciel.",
      }),
      color: "teal",
      icon: <Code size={30} />,
      certifications: certificationNames.programmazione,
    },
    {
      key: "virtualizzazione",
      route: "/virtualizzazione",
      name: getLabel({ it: "Virtualizzazione", en: "Virtualization", es: "Virtualización", fr: "Virtualisation" }),
      description: getLabel({
        it: "Tecnologie di virtualizzazione.",
        en: "Virtualization technologies.",
        es: "Tecnologías de virtualización.",
        fr: "Technologies de virtualisation.",
      }),
      color: "orange",
      icon: <Server size={30} />,
      certifications: certificationNames.virtualizzazione,
    },
    {
      key: "intelligenza-artificiale",
      route: "/intelligenza-artificiale",
      name: getLabel({
        it: "Intelligenza Artificiale",
        en: "Artificial Intelligence",
        es: "Inteligencia Artificial",
        fr: "Intelligence Artificielle",
      }),
      description: getLabel({
        it: "Machine learning e AI applicata.",
        en: "Machine learning and applied AI.",
        es: "Aprendizaje automático e IA aplicada.",
        fr: "Apprentissage automatique et IA appliquée.",
      }),
      color: "cyan",
      icon: <Cpu size={30} />,
      certifications: certificationNames["intelligenza-artificiale"],
    },
  ];

  return (
    <div className="min-h-[100svh] bg-gray-100 text-gray-900 flex flex-col">
      {/* ✅ SEO dinamico */}
      <SEOHead
        title={title}
        description={description}
        lang={lang}
        canonical={`https://www.certifyquiz.com/${lang}/quiz-home`}
        hreflangs={hreflangs}
      />

      {/* Contenuto scrollabile */}
      <main className="flex-1 overflow-y-auto px-3 pt-10 pb-[96px]">
        <QuizTitle />

{lang !== "it" && translatedCertsForLang.length > 0 && (
  <div className="mx-auto max-w-[1380px] mb-4 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-900 p-3">
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <div className="text-sm">
        <div className="font-semibold">{AVAILABLE_TXT[lang]?.title || "Available topics"}</div>
        <div className="opacity-80">{AVAILABLE_TXT[lang]?.lead || "Already translated in this language:"}</div>
      </div>
      <div className="flex flex-wrap gap-2">
       {translatedCertsForLang.map((c) => {
  const label = smartBadgeLabel(availability, c.link, lang);
  return (
    <Link
      key={c.link} // meglio del name: è unico e stabile
      to={c.link}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-emerald-300 text-sm hover:bg-emerald-100 transition"
      title={label}
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
        <div
          className="
            mx-auto max-w-[1380px]
            grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
            gap-3 mt-2
            auto-rows-[230px]
          "
        >
          {quizCategories.map((cat) => (
            <CategoryBox
              key={cat.key}
              title={cat.name}
              icon={cat.icon}
              description={cat.description}
              route={cat.route}
              color={cat.color}
              certifications={cat.certifications}
              compact
            />
          ))}
        </div>
      </main>

      {/* Navbar fissa in basso */}
      <BottomNavbar />
    </div>
  );
}
