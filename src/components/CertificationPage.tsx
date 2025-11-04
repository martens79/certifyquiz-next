// src/components/CertificationPage.tsx
import Image from "next/image";
import type {
  CertificationData,
  LocalizedText,
} from "@/certifications/types";

type Lang = "it" | "en" | "fr" | "es";

function pickLabel(obj: LocalizedText | string | undefined, lang: Lang): string {
  if (!obj) return "";
  if (typeof obj === "string") return obj;
  // LocalizedText ha sempre le 4 lingue, ma teniamo un fallback safe
  return obj[lang] ?? obj.it ?? obj.en ?? obj.fr ?? obj.es ?? "";
}

function getList<T>(
  rec:
    | Readonly<Record<Lang, ReadonlyArray<T>>>
    | undefined,
  lang: Lang
): T[] {
  if (!rec) return [];
  return (rec[lang] ?? rec.it ?? rec.en ?? rec.fr ?? rec.es ?? []) as T[];
}

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
    quizRoute,
  } = data;

  const pageTitle = pickLabel(title, lang) || "Certification";
  const pageDescription = pickLabel(description, lang);
  const levelText =
    pickLabel(
      level ?? {
        it: "Principiante",
        en: "Beginner",
        fr: "Débutant",
        es: "Principiante",
      },
      lang
    ) || "";

  // Topics (ReadonlyArray<LocalizedText>)
  const pageTopics = topics.map((t) => pickLabel(t, lang)).filter(Boolean);

  // Extra content (già readonly-friendly nei tipi centrali)
  const learn = getList<string>(extraContent?.learn, lang);
  const whyChoose = getList<string>(extraContent?.whyChoose, lang);
  const faqRaw = getList<{ q: string; a: string }>(extraContent?.faq as any, lang);
  const examRefsRaw = getList<{ text: string; url: string }>(
    extraContent?.examReference as any,
    lang
  );

  const faq = faqRaw
    .map((f) => ({
      q: f?.q ?? "",
      a: f?.a ?? "",
    }))
    .filter((x) => x.q || x.a);

  const examRefs = examRefsRaw.map((r) => ({
    text: r?.text ?? "",
    url: r?.url,
  }));

  const quizHref = data.quizRoute[lang] ?? data.quizRoute.it ?? "";

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
            <h1 className="text-3xl font-bold text-blue-900 mb-2 leading-tight">
              {pageTitle}
            </h1>
            {levelText && (
              <span className="inline-block bg-orange-400 text-white text-sm font-semibold px-3 py-1 rounded-full">
                🎓 {levelText}
              </span>
            )}
          </div>
        </header>

        {pageDescription ? (
          <p className="text-gray-700 mb-4">{pageDescription}</p>
        ) : null}

        {/* CTA */}
        {quizHref ? (
          <div className="mt-2 mb-6 text-center">
            <a
              href={quizHref}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-semibold shadow-md hover:from-yellow-600 hover:to-yellow-500 transition-transform hover:scale-105"
            >
              <span className="text-lg">🚀</span>
              {{
                it: "Vai ai quiz",
                en: "Go to quiz",
                fr: "Accéder aux quiz",
                es: "Ir a los cuestionarios",
              }[lang] ?? "Go to quiz"}
            </a>
          </div>
        ) : null}

        {/* Blocchi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Topics */}
          {pageTopics.length > 0 && (
            <div className="bg-blue-100 p-4 rounded-xl shadow">
              <h2 className="text-lg font-semibold text-blue-800 mb-2">
                {{
                  it: "Argomenti dell'esame",
                  en: "Exam Topics",
                  fr: "Sujets de l'examen",
                  es: "Temas del examen",
                }[lang] ?? "Exam Topics"}
              </h2>
              <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                {pageTopics.map((t, i) => (
                  <li key={i}>✅ {t}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Exam references */}
          {examRefs.length > 0 && (
            <div className="bg-blue-100 p-4 rounded-xl shadow">
              <h2 className="text-lg font-semibold text-blue-800 mb-2">
                {{
                  it: "Esami ufficiali di riferimento",
                  en: "Official reference exams",
                  fr: "Examens officiels",
                  es: "Exámenes oficiales",
                }[lang] ?? "Official reference exams"}
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
                {{
                  it: "Perché scegliere questa certificazione",
                  en: "Why choose this certification",
                  fr: "Pourquoi choisir cette certification",
                  es: "Por qué elegir esta certificación",
                }[lang] ?? "Why choose this certification"}
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
              {{
                it: "Cosa impari",
                en: "What you’ll learn",
                fr: "Ce que vous apprendrez",
                es: "Lo que aprenderás",
              }[lang] ?? "What you’ll learn"}
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
