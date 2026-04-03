// src/components/CertificationPage.tsx
import Image from "next/image";
import Link from "next/link";
import type { CertificationData, LocalizedText } from "@/certifications/types";
import CertificationPracticeBox from "@/components/certifications/CertificationPracticeBox";

type Lang = "it" | "en" | "fr" | "es";

type TopicLinkItem = {
  title: LocalizedText | string;
  slug?: Partial<Record<Lang, string>>;
};

/* -------------------- i18n helpers -------------------- */
function pickLabel(obj: LocalizedText | string | undefined, lang: Lang): string {
  if (!obj) return "";
  if (typeof obj === "string") return obj;
  return obj[lang] ?? obj.it ?? obj.en ?? obj.fr ?? obj.es ?? "";
}

function isLocalizedArray<T>(v: unknown): v is Readonly<Record<Lang, ReadonlyArray<T>>> {
  if (!v || typeof v !== "object" || Array.isArray(v)) return false;
  const rec = v as Record<string, unknown>;
  return (["it", "en", "fr", "es"] as const).some((k) => Array.isArray(rec[k]));
}

function getList<T>(rec: Readonly<Record<Lang, ReadonlyArray<T>>> | undefined, lang: Lang): T[] {
  if (!rec) return [];
  const list = rec[lang] ?? rec.it ?? rec.en ?? rec.fr ?? rec.es ?? ([] as readonly T[]);
  return Array.isArray(list) ? [...list] : [];
}

function isTopicLinkItem(value: unknown): value is TopicLinkItem {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  return "title" in value;
}

/* -------------------- componente -------------------- */
export default function CertificationPage({
  lang,
  data,
}: {
  lang: Lang;
  data: CertificationData;
}) {
  const {
    title,
    description,
    topics = [],
    level,
    imageUrl,
    extraContent,
    imageSide = "left",
  } = data;

  const pageTitle = pickLabel(title, lang) || "Certification";
  const pageDescription = pickLabel(description, lang);
  const levelText =
    pickLabel(
      level ?? { it: "Principiante", en: "Beginner", fr: "Débutant", es: "Principiante" },
      lang
    ) || "";

  // ✅ Supporta sia topic legacy (solo testo) sia topic nuovi (title + slug)
  const pageTopics = topics
    .map((t) => {
      // Caso 1: stringa semplice
      if (typeof t === "string") {
        return {
          label: t,
          href: null as string | null,
        };
      }

      // Caso 2: nuovo formato con title + slug
      if (isTopicLinkItem(t)) {
        const label = pickLabel(t.title, lang);
        const topicSlug =
          t.slug?.[lang] ?? t.slug?.it ?? t.slug?.en ?? t.slug?.fr ?? t.slug?.es ?? "";

        const href = topicSlug
          ? lang === "en"
            ? `/certifications/${data.slug}/${topicSlug}`
            : `/${lang}/certificazioni/${data.slug}/${topicSlug}`
          : null;

        return {
          label,
          href,
        };
      }

      // Caso 3: formato legacy LocalizedText
      const label = pickLabel(t as LocalizedText, lang);
      return {
        label,
        href: null as string | null,
      };
    })
    .filter((t) => t.label);

  const learn = isLocalizedArray<string>(extraContent?.learn)
    ? getList<string>(extraContent!.learn, lang)
    : [];
  const whyChoose = isLocalizedArray<string>(extraContent?.whyChoose)
    ? getList<string>(extraContent!.whyChoose, lang)
    : [];

  // ✅ SEO booster block
  const currentCertification = isLocalizedArray<string>(extraContent?.currentCertification)
    ? getList<string>(extraContent!.currentCertification, lang)
    : [];

  type FaqItem = { q: string; a: string };
  const faqRaw = isLocalizedArray<FaqItem>(extraContent?.faq)
    ? getList<FaqItem>(extraContent!.faq, lang)
    : [];

  type RefItem = { text: string; url: string };
  const examRefsRaw = isLocalizedArray<RefItem>(extraContent?.examReference)
    ? getList<RefItem>(extraContent!.examReference, lang)
    : [];

  const faq = faqRaw.map((f) => ({ q: f?.q ?? "", a: f?.a ?? "" })).filter((x) => x.q || x.a);
  const examRefs = examRefsRaw.map((r) => ({ text: r?.text ?? "", url: r?.url }));

  const basePath = lang === "en" ? "" : `/${lang}`;

  // ✅ Usa quizRoute se presente
  const quizHref =
    data.quizRoute?.[lang] ??
    data.quizRoute?.it ??
    `${basePath}/quiz/${data.slug}`;

  // ✅ Warning di sviluppo
  if (process.env.NODE_ENV !== "production" && data.quizRoute) {
    const anyQ = data.quizRoute[lang] || data.quizRoute.it || "";
    if (anyQ && !anyQ.includes(`/quiz/`)) {
      // eslint-disable-next-line no-console
      console.warn(`[CertificationPage] quizRoute looks odd for "${data.slug}" → "${anyQ}"`);
    }
  }

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center pt-6 md:pt-[12vh] md:pb-12 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden p-6">
        {/* Header titolo + logo */}
        <header
          className={`flex items-center justify-center gap-4 sm:gap-6 mb-4 text-center ${
            imageSide === "right" ? "flex-row-reverse" : "flex-row"
          }`}
        >
          {imageUrl ? (
            <div className="shrink-0 bg-blue-100 rounded-xl p-2">
              <Image
                src={imageUrl}
                alt={pageTitle || "Certification"}
                width={96}
                height={96}
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain"
              />
            </div>
          ) : null}

          <div className="max-w-full">
            <h1 className="text-3xl font-bold text-blue-900 mb-2 leading-tight">{pageTitle}</h1>
            {levelText && (
              <span className="inline-block bg-orange-400 text-white text-sm font-semibold px-3 py-1 rounded-full">
                🎓 {levelText}
              </span>
            )}
          </div>
        </header>

        {pageDescription ? <p className="text-gray-700 mb-4">{pageDescription}</p> : null}

        {/* ✅ SEO booster */}
        {currentCertification.length > 0 && (
          <section className="mt-4 mb-4 bg-blue-100 p-4 rounded-xl shadow">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">
              {({
                it: "Qual è la certificazione SQL “attuale”?",
                en: "What is the current SQL certification?",
                fr: "Quelle est la certification SQL “actuelle” ?",
                es: "¿Cuál es la certificación SQL “actual”?",
              } as const)[lang] ?? "Current certification"}
            </h2>

            <div className="text-sm text-gray-800 space-y-2">
              {currentCertification.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>
        )}

        {/* CTA quiz */}
        <div className="mt-2 mb-6 text-center">
          <Link
            href={quizHref}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-semibold shadow-md hover:from-yellow-600 hover:to-yellow-500 transition-transform hover:scale-105"
          >
            <span className="text-lg">🚀</span>
            {({
              it: "Vai ai quiz",
              en: "Go to quiz",
              fr: "Accéder aux quiz",
              es: "Ir a los cuestionarios",
            } as const)[lang] ?? "Go to quiz"}
          </Link>
        </div>

        {/* Practice box */}
        <CertificationPracticeBox
          lang={lang}
          certificationTitle={pageTitle}
          quizHref={quizHref}
          topics={topics}
        />

        {/* Blocchi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Topics */}
          {pageTopics.length > 0 && (
            <div className="bg-blue-100 p-4 rounded-xl shadow">
              <h2 className="text-lg font-semibold text-blue-800 mb-2">
                {({
                  it: "Argomenti dell'esame",
                  en: "Exam Topics",
                  fr: "Sujets de l'examen",
                  es: "Temas del examen",
                } as const)[lang] ?? "Exam Topics"}
              </h2>

              <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                {pageTopics.map((t, i) => (
                  <li key={i}>
                    ✅{" "}
                    {t.href ? (
                      <Link href={t.href} className="text-blue-700 hover:underline font-medium">
                        {t.label}
                      </Link>
                    ) : (
                      t.label
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Exam references */}
          {examRefs.length > 0 && (
            <div className="bg-blue-100 p-4 rounded-xl shadow">
              <h2 className="text-lg font-semibold text-blue-800 mb-2">
                {({
                  it: "Esami ufficiali di riferimento",
                  en: "Official reference exams",
                  fr: "Examens officiels",
                  es: "Exámenes oficiales",
                } as const)[lang] ?? "Official reference exams"}
              </h2>
              <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                {examRefs.map((item, idx) => (
                  <li key={idx}>
                    📘{" "}
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 hover:underline"
                      >
                        {item.text}
                      </a>
                    ) : (
                      item.text
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Why choose */}
          {whyChoose.length > 0 && (
            <div className="bg-blue-100 p-4 rounded-xl shadow col-span-full">
              <h2 className="text-lg font-semibold text-blue-800 mb-2">
                {({
                  it: "Perché scegliere questa certificazione",
                  en: "Why choose this certification",
                  fr: "Pourquoi choisir cette certification",
                  es: "Por qué elegir esta certificación",
                } as const)[lang] ?? "Why choose this certification"}
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
        {learn.length > 0 && (
          <section className="mt-4">
            <h2 className="text-lg font-semibold mb-2">
              {({
                it: "Cosa impari",
                en: "What you’ll learn",
                fr: "Ce que vous apprendrez",
                es: "Lo que aprenderás",
              } as const)[lang] ?? "What you’ll learn"}
            </h2>
            <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
              {learn.map((l, i) => (
                <li key={i}>• {l}</li>
              ))}
            </ul>
          </section>
        )}

        {/* FAQ */}
        {faq.length > 0 && (
          <section className="mt-8">
            <h2 className="text-xl font-bold mb-2">FAQ</h2>
            <div className="space-y-4">
              {faq.map((f, idx) => (
                <div key={idx}>
                  {f.q ? <p className="font-semibold">{f.q}</p> : null}
                  {f.a ? <p className="text-gray-700">{f.a}</p> : null}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}