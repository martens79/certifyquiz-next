import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/lib/i18n";

function aboutHref(lang: Locale) {
  if (lang === "it") return "/it/chi-sono";
  if (lang === "fr") return "/fr/a-propos";
  if (lang === "es") return "/es/sobre-mi";
  return "/about"; // EN root
}

const T: Record<
  Locale,
  {
    title: string;
    role: string;
    text: string;
    cta: string;
  }
> = {
  it: {
    title: "Articolo scritto da Lorenzo",
    role: "Fondatore di CertifyQuiz",
    text: "Tecnico software e hardware. Ho creato CertifyQuiz perché preparare certificazioni IT non dovrebbe essere un salto nel buio: quiz realistici, spiegazioni chiare e meno stress.",
    cta: "Chi sono",
  },
  en: {
    title: "Article by Lorenzo",
    role: "Founder of CertifyQuiz",
    text: "Software and hardware technician. I built CertifyQuiz because IT certification prep shouldn’t feel like a black box: realistic quizzes, clear explanations, less stress.",
    cta: "About me",
  },
  fr: {
    title: "Article écrit par Lorenzo",
    role: "Fondateur de CertifyQuiz",
    text: "Technicien logiciel et matériel. J’ai créé CertifyQuiz pour rendre la préparation aux certifications IT plus claire : quiz réalistes, explications nettes, moins de stress.",
    cta: "À propos",
  },
  es: {
    title: "Artículo escrito por Lorenzo",
    role: "Fundador de CertifyQuiz",
    text: "Técnico de software y hardware. Creé CertifyQuiz para que preparar certificaciones IT sea más claro: quizzes realistas, explicaciones claras y menos estrés.",
    cta: "Sobre mí",
  },
};

export default function AuthorBox({
  lang,
  className = "",
}: {
  lang: Locale;
  className?: string;
}) {
  const t = T[lang] ?? T.it;
  const href = aboutHref(lang);

  return (
    <aside className={`mt-10 ${className}`} aria-label="Author">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-1 ring-zinc-200">
            <Image
              src="/images/lorenzo.png"
              alt="Lorenzo – CertifyQuiz"
              fill
              sizes="64px"
              className="object-cover"
              priority={false}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-zinc-900">{t.title}</p>
              <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] font-medium text-zinc-700">
                {t.role}
              </span>
            </div>

            <p className="mt-2 text-sm leading-relaxed text-zinc-700">
              {t.text}
            </p>

            <div className="mt-3">
              <Link
                href={href}
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
              >
                {t.cta}
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
