// src/components/CertificationPage.jsx
import React from "react";
import { Helmet } from "react-helmet-async";
import BottomNavbar from "./BottomNavbar";

/* ───────── Helpers robusti (no dipendenze esterne) ───────── */

function getLangFromPath() {
  try {
    const seg = (window.location.pathname || "/").split("/").filter(Boolean)[0];
    return ["it", "en", "fr", "es"].includes(seg) ? seg : "it";
  } catch {
    return "it";
  }
}

function pickLabel(val, lang = "it") {
  // accetta string | {it,en,fr,es} | qualsiasi altra cosa
  if (val == null) return "";
  if (typeof val === "string") return val;
  if (React.isValidElement(val)) return val; // già JSX nella lingua giusta
  if (typeof val === "object") {
    // Se è un oggetto multilingua
    if (val[lang] != null) return val[lang];
    if (val.it != null) return val.it;
    // fallback: prima stringa trovata
    for (const k of ["en", "fr", "es"]) if (val[k] != null) return val[k];
  }
  return String(val ?? "");
}

function mapList(arr, lang) {
  if (!Array.isArray(arr)) return [];
  return arr.map((item) => {
    if (typeof item === "string" || React.isValidElement(item)) return item;
    if (item && typeof item === "object") {
      // FAQ {q, a} multilingua
      if ("q" in item || "a" in item) {
        return {
          q: pickLabel(item.q, lang),
          a: pickLabel(item.a, lang),
        };
      }
      // ref {text, url} multilingua
      if ("text" in item) {
        return { text: pickLabel(item.text, lang), url: item.url };
      }
    }
    return pickLabel(item, lang);
  });
}

/* ───────── Component ───────── */

export default function CertificationPage({
  title,
  description,
  topics = [],
  officialUrl,
  quizRoute,
  backRoute,
  level = { it: "Principiante", en: "Beginner", fr: "Débutant", es: "Principiante" },
  imageUrl,
  companyProductsUrl,
  ctaButton,
  extraContent = {},
  imageSide = "left",
}) {
  const lang = getLangFromPath();

  // Normalizzazione con fallback IT
  const pageTitle       = pickLabel(title,       lang) || "Certification";
  const pageDescription = pickLabel(description, lang);

  const pageTopics = Array.isArray(topics)
    ? topics.map((t) => pickLabel(t, lang)).filter(Boolean)
    : [];

  const learn       = mapList(extraContent?.learn?.[lang]         ?? extraContent?.learn?.it,         lang);
  const whyChoose   = mapList(extraContent?.whyChoose?.[lang]     ?? extraContent?.whyChoose?.it,     lang);
  const faqRaw      = mapList(extraContent?.faq?.[lang]           ?? extraContent?.faq?.it,           lang);
  const examRefs    = mapList(extraContent?.examReference?.[lang] ?? extraContent?.examReference?.it, lang);

  const faq = Array.isArray(faqRaw)
    ? faqRaw.filter((x) => x && (typeof x === "string" || React.isValidElement(x) || x.q || x.a))
    : [];

  const usedFallback =
    lang !== "it" &&
    (
      !title?.[lang] ||
      !description?.[lang] ||
      (Array.isArray(topics) && topics.length > 0 && pageTopics.some((t) => !t))
    );

  return (
    <>
      <Helmet>
        <title>{`CertifyQuiz – ${pageTitle}`}</title>
        {pageDescription ? <meta name="description" content={String(pageDescription)} /> : null}
        <meta property="og:title" content={`CertifyQuiz – ${pageTitle}`} />
        {pageDescription ? <meta property="og:description" content={String(pageDescription)} /> : null}
        {imageUrl && <meta property="og:image" content={imageUrl} />}
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-blue-50 flex flex-col items-center pt-6 md:pt-[12vh] md:pb-12 px-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden p-6 pb-[120px]">

          {usedFallback && (
            <div className="mb-4 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-900 px-4 py-2 text-sm">
              {pickLabel({
                it: "Alcuni contenuti non sono ancora tradotti. Stai vedendo il fallback in italiano.",
                en: "Some content isn’t translated yet. Showing Italian fallback.",
                fr: "Certains contenus ne sont pas encore traduits. Affichage du texte italien.",
                es: "Parte del contenido no está traducido. Mostrando italiano como respaldo.",
              }, lang)}
            </div>
          )}

          {/* Header titolo + logo */}
          <header
            className={`flex items-center justify-center gap-4 sm:gap-6 mb-4 text-center ${
              imageSide === "right" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {imageUrl && (
              <div className="shrink-0 bg-blue-100 rounded-xl p-2">
                <img
                  src={imageUrl}
                  alt={typeof pageTitle === "string" ? pageTitle : "Certification"}
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain"
                />
              </div>
            )}

            <div className="max-w-full">
              <h1 className="text-3xl font-bold text-blue-900 mb-2 leading-tight">
                {pageTitle}
              </h1>
              <span className="inline-block bg-orange-400 text-white text-sm font-semibold px-3 py-1 rounded-full">
                🎓 {pickLabel(level, lang)}
              </span>
            </div>
          </header>

          {pageDescription ? (
            <p className="text-gray-700 mb-4">
              {/* può essere string o JSX */}
              {pageDescription}
            </p>
          ) : null}

          {ctaButton && <div className="mt-2 mb-6 text-center">{ctaButton}</div>}

          {/* Blocchi a box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* Topics */}
            {pageTopics.length > 0 && (
              <div className="bg-blue-100 p-4 rounded-xl shadow">
                <h2 className="text-lg font-semibold text-blue-800 mb-2">
                  {pickLabel({
                    it: "Argomenti dell'esame",
                    en: "Exam Topics",
                    fr: "Sujets de l'examen",
                    es: "Temas del examen",
                  }, lang)}
                </h2>
                <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                  {pageTopics.map((t, i) => (
                    <li key={i}>✅ {t}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Exam references */}
            {Array.isArray(examRefs) && examRefs.length > 0 && (
              <div className="bg-blue-100 p-4 rounded-xl shadow">
                <h2 className="text-lg font-semibold text-blue-800 mb-2">
                  {pickLabel({
                    it: "Esami ufficiali di riferimento",
                    en: "Official reference exams",
                    fr: "Examens officiels",
                    es: "Exámenes oficiales",
                  }, lang)}
                </h2>
                <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                  {examRefs.map((item, idx) => {
                    if (typeof item === "string" || React.isValidElement(item)) {
                      return <li key={idx}>📘 {item}</li>;
                    }
                    const text = item?.text || "";
                    const url = item?.url;
                    return (
                      <li key={idx}>
                        📘{" "}
                        {url ? (
                          <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                            {text}
                          </a>
                        ) : (
                          text
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Why choose */}
            {Array.isArray(whyChoose) && whyChoose.length > 0 && (
              <div className="bg-blue-100 p-4 rounded-xl shadow col-span-full">
                <h2 className="text-lg font-semibold text-blue-800 mb-2">
                  {pickLabel({
                    it: "Perché scegliere questa certificazione",
                    en: "Why choose this certification",
                    fr: "Pourquoi choisir cette certification",
                    es: "Por qué elegir esta certificación",
                  }, lang)}
                </h2>
                <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                  {whyChoose.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Learn */}
          {Array.isArray(learn) && learn.length > 0 && (
            <section className="mt-4">
              <h2 className="text-lg font-semibold mb-2">
                {pickLabel({ it: "Cosa impari", en: "What you’ll learn", fr: "Ce que vous apprendrez", es: "Lo que aprenderás" }, lang)}
              </h2>
              <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                {learn.map((l, i) => <li key={i}>• {l}</li>)}
              </ul>
            </section>
          )}

          {/* FAQ */}
          {Array.isArray(faq) && faq.length > 0 && (
            <section className="mt-8">
              <h2 className="text-xl font-bold mb-2">FAQ</h2>
              <div className="space-y-4">
                {faq.map((f, idx) => {
                  if (typeof f === "string" || React.isValidElement(f)) {
                    return <div key={idx} className="text-gray-700">{f}</div>;
                  }
                  return (
                    <div key={idx}>
                      <p className="font-semibold">{f.q}</p>
                      <p className="text-gray-700">{f.a}</p>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          <div className="block md:hidden h-[96px]" />
        </div>
      </div>

      <BottomNavbar />
    </>
  );
}
