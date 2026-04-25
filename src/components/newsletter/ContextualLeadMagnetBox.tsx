// src/components/newsletter/ContextualLeadMagnetBox.tsx

import Link from "next/link";

type Lang = "it" | "en" | "fr" | "es";
type Variant = "topic" | "cert";

type Props = {
  lang?: Lang;
  variant?: Variant;
  certificationSlug?: string;
  topicSlug?: string;
  quizHref?: string;
  className?: string;
};

type BaseCopy = {
  eyebrowTopic: string;
  eyebrowCert: string;
  topicDefaultTitle: string;
  certDefaultTitle: string;
  topicDefaultText: string;
  certDefaultText: string;
  topicButton: string;
  certButton: string;
  emailText: string;
};

type CertCopy = {
  certTitle: string;
  certText: string;
  topicTitle?: string;
  topicText?: string;
};

const CONTENT: Record<Lang, BaseCopy> = {
  it: {
    eyebrowTopic: "Test gratuito",
    eyebrowCert: "Scopri il tuo livello",
    topicDefaultTitle: "Sei davvero pronto su questo argomento?",
    certDefaultTitle: "Scopri il tuo livello prima di iniziare",
    topicDefaultText:
      "Fai un mini test gratuito collegato a questa pagina e scopri subito dove devi migliorare.",
    certDefaultText:
      "Prima di iniziare la preparazione completa, fai un test rapido e capisci da dove partire.",
    topicButton: "Fai il test gratuito",
    certButton: "Scopri il tuo livello",
    emailText: "Ricevi anche consigli utili per prepararti meglio.",
  },
  en: {
    eyebrowTopic: "Free test",
    eyebrowCert: "Check your level",
    topicDefaultTitle: "Are you really ready on this topic?",
    certDefaultTitle: "Check your level before you start",
    topicDefaultText:
      "Take a free mini test related to this page and see where you need to improve.",
    certDefaultText:
      "Before starting your full preparation, take a quick test and understand where to begin.",
    topicButton: "Start free test",
    certButton: "Check your level",
    emailText: "Get useful tips to prepare better.",
  },
  fr: {
    eyebrowTopic: "Test gratuit",
    eyebrowCert: "Évaluez votre niveau",
    topicDefaultTitle: "Êtes-vous vraiment prêt sur ce sujet ?",
    certDefaultTitle: "Évaluez votre niveau avant de commencer",
    topicDefaultText:
      "Faites un mini test gratuit lié à cette page et repérez vos points faibles.",
    certDefaultText:
      "Avant de commencer votre préparation complète, faites un test rapide pour savoir par où commencer.",
    topicButton: "Faire le test gratuit",
    certButton: "Évaluer mon niveau",
    emailText: "Recevez aussi des conseils utiles pour mieux vous préparer.",
  },
  es: {
    eyebrowTopic: "Test gratuito",
    eyebrowCert: "Comprueba tu nivel",
    topicDefaultTitle: "¿Estás realmente preparado en este tema?",
    certDefaultTitle: "Comprueba tu nivel antes de empezar",
    topicDefaultText:
      "Haz un mini test gratuito relacionado con esta página y descubre dónde debes mejorar.",
    certDefaultText:
      "Antes de empezar tu preparación completa, haz una prueba rápida y descubre por dónde comenzar.",
    topicButton: "Hacer el test gratuito",
    certButton: "Comprobar mi nivel",
    emailText: "Recibe también consejos útiles para prepararte mejor.",
  },
};

const CERT_COPY: Record<string, Partial<Record<Lang, CertCopy>>> = {
  "security-plus": {
    it: {
      certTitle: "Vuoi capire se Security+ è alla tua portata?",
      certText:
        "Fai un test rapido e scopri il tuo livello prima di iniziare a studiare sul serio.",
      topicTitle: "Passeresti davvero questa parte di Security+?",
      topicText:
        "Fai un mini test mirato e scopri se hai capito davvero questo argomento.",
    },
    en: {
      certTitle: "Want to know if Security+ is within your reach?",
      certText: "Take a quick test and check your level before studying seriously.",
      topicTitle: "Would you really pass this part of Security+?",
      topicText:
        "Take a focused mini test and see if you truly understand this topic.",
    },
    fr: {
      certTitle: "Voulez-vous savoir si Security+ est à votre portée ?",
      certText:
        "Faites un test rapide et évaluez votre niveau avant de commencer sérieusement.",
      topicTitle: "Réussiriez-vous vraiment cette partie de Security+ ?",
      topicText:
        "Faites un mini test ciblé et vérifiez votre compréhension.",
    },
    es: {
      certTitle: "¿Quieres saber si Security+ está a tu alcance?",
      certText:
        "Haz una prueba rápida y comprueba tu nivel antes de estudiar en serio.",
      topicTitle: "¿Aprobarías realmente esta parte de Security+?",
      topicText:
        "Haz un mini test específico y comprueba si entiendes bien este tema.",
    },
  },

  "aws-cloud-practitioner": {
    it: {
      certTitle: "Sei pronto per AWS Cloud Practitioner?",
      certText:
        "Fai un test rapido sui concetti AWS e capisci subito da dove partire.",
      topicTitle: "Capisci davvero questo concetto AWS?",
      topicText:
        "Fai un mini test mirato e scopri se le tue basi cloud sono solide.",
    },
    en: {
      certTitle: "Are you ready for AWS Cloud Practitioner?",
      certText: "Take a quick AWS concepts test and understand where to start.",
      topicTitle: "Do you really understand this AWS concept?",
      topicText:
        "Take a focused mini test and check if your cloud basics are solid.",
    },
    fr: {
      certTitle: "Êtes-vous prêt pour AWS Cloud Practitioner ?",
      certText: "Faites un test rapide sur AWS et voyez par où commencer.",
      topicTitle: "Comprenez-vous vraiment ce concept AWS ?",
      topicText:
        "Faites un mini test ciblé et vérifiez vos bases cloud.",
    },
    es: {
      certTitle: "¿Estás preparado para AWS Cloud Practitioner?",
      certText: "Haz una prueba rápida sobre AWS y descubre por dónde empezar.",
      topicTitle: "¿Entiendes de verdad este concepto de AWS?",
      topicText:
        "Haz un mini test específico y comprueba tus bases cloud.",
    },
  },
};

function localizePath(lang: Lang, path: string) {
  return lang === "en" ? path : `/${lang}${path}`;
}

export default function ContextualLeadMagnetBox({
  lang = "en",
  variant = "topic",
  certificationSlug,
  topicSlug,
  quizHref,
  className = "",
}: Props) {
  const safeLang: Lang = CONTENT[lang] ? lang : "en";
  const t = CONTENT[safeLang];

  const certCopy =
    certificationSlug && CERT_COPY[certificationSlug]
      ? CERT_COPY[certificationSlug][safeLang]
      : undefined;

  const isTopic = variant === "topic";

  const eyebrow = isTopic ? t.eyebrowTopic : t.eyebrowCert;

  const title = isTopic
    ? certCopy?.topicTitle ?? t.topicDefaultTitle
    : certCopy?.certTitle ?? t.certDefaultTitle;

  const text = isTopic
    ? certCopy?.topicText ?? t.topicDefaultText
    : certCopy?.certText ?? t.certDefaultText;

  const button = isTopic ? t.topicButton : t.certButton;

  // Lead magnet contestuale: porta a una pagina dedicata al test gratuito/newsletter
 const searchParams = new URLSearchParams({
  source: `${variant}-lead-magnet`,
  cert: certificationSlug ?? "general",
  topic: topicSlug ?? "general",
});

if (quizHref) {
  searchParams.set("quiz", quizHref);
}

const href = localizePath(safeLang, `/free-test?${searchParams.toString()}`);

  return (
    <section
      className={`rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-slate-50 p-5 md:p-6 shadow-sm ${className}`}
      aria-label={eyebrow}
    >
      <div className="mb-3 inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-700">
        {eyebrow}
      </div>

      <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900">
        {title}
      </h2>

      <p className="mt-2 text-sm md:text-base leading-relaxed text-slate-700">
        {text}
      </p>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link
          href={href}
          data-cta="lead-magnet"
          data-variant={variant}
          data-cert={certificationSlug ?? "general"}
          data-topic={topicSlug ?? "general"}
          className="inline-flex items-center justify-center rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-800"
        >
          {button}
        </Link>

        <p className="text-xs leading-relaxed text-slate-500">
          {t.emailText}
        </p>
      </div>
    </section>
  );
}