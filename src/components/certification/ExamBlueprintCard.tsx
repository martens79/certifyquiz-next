import type { ExamBlueprint } from "@/certifications/types";

type Lang = "it" | "en" | "fr" | "es";

const COPY = {
  it: {
    title: "Programma ufficiale dell’esame",
    name: "Nome esame",
    code: "Codice esame",
    version: "Versione",
    provider: "Ente certificatore",
    topics: "Argomenti ufficiali",
    weight: "Peso nell’esame",
    source: "Fonte ufficiale",
    examPage: "Pagina ufficiale dell’esame",
    verified: "Ultimo controllo",
    external: "link esterno",
    noWeights:
      "L’ente certificatore pubblica gli argomenti ufficiali dell’esame, ma non indica un peso percentuale per ciascun dominio.",
    note: "I quiz di CertifyQuiz sono organizzati seguendo i domini e gli obiettivi ufficiali dell’esame.",
  },
  en: {
    title: "Official exam blueprint",
    name: "Exam name",
    code: "Exam code",
    version: "Version",
    provider: "Certification provider",
    topics: "Official domains",
    weight: "Exam weight",
    source: "Official source",
    examPage: "Official exam page",
    verified: "Last verified",
    external: "external link",
    noWeights:
      "The certification provider publishes the official exam topics but does not specify a percentage weight for each domain.",
    note: "CertifyQuiz quizzes are organized around the official exam domains and objectives.",
  },
  fr: {
    title: "Programme officiel de l’examen",
    name: "Nom de l’examen",
    code: "Code de l’examen",
    version: "Version",
    provider: "Organisme certificateur",
    topics: "Domaines officiels",
    weight: "Poids dans l’examen",
    source: "Source officielle",
    examPage: "Page officielle de l’examen",
    verified: "Dernière vérification",
    external: "lien externe",
    noWeights:
      "L’organisme certificateur publie les sujets officiels de l’examen, mais n’indique pas de pondération pour chaque domaine.",
    note: "Les quiz CertifyQuiz sont organisés selon les domaines et objectifs officiels de l’examen.",
  },
  es: {
    title: "Programa oficial del examen",
    name: "Nombre del examen",
    code: "Código del examen",
    version: "Versión",
    provider: "Entidad certificadora",
    topics: "Dominios oficiales",
    weight: "Peso en el examen",
    source: "Fuente oficial",
    examPage: "Página oficial del examen",
    verified: "Última comprobación",
    external: "enlace externo",
    noWeights:
      "La entidad certificadora publica los temas oficiales del examen, pero no indica un peso porcentual para cada dominio.",
    note: "Los cuestionarios de CertifyQuiz se organizan según los dominios y objetivos oficiales del examen.",
  },
} as const;

const DATE_LOCALE: Record<Lang, string> = {
  it: "it-IT",
  en: "en-US",
  fr: "fr-FR",
  es: "es-ES",
};

function formatVerifiedDate(value: string, lang: Lang): string {
  const date = new Date(`${value.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(DATE_LOCALE[lang], {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

type ExamDomain = ExamBlueprint["domains"][number];

function DomainList({
  domains,
  noWeightsLabel,
}: {
  domains: ReadonlyArray<ExamDomain>;
  noWeightsLabel: string;
}) {
  const hasAnyPercentage = domains.some(
    (domain) => domain.percentage != null || (domain.percentageMin != null && domain.percentageMax != null)
  );

  return (
    <>
      <ul className="mt-2 space-y-2.5">
        {domains.map((domain) => {
          const isRange = domain.percentage == null && domain.percentageMin != null && domain.percentageMax != null;

          return (
            <li key={domain.name}>
              <div className="flex min-w-0 items-baseline justify-between gap-3 text-sm">
                <span className="min-w-0 text-slate-800">{domain.name}</span>
                {domain.percentage != null && (
                  <span className="shrink-0 font-semibold text-blue-800" aria-label={`${domain.percentage}%`}>
                    {domain.percentage}%
                  </span>
                )}
                {isRange && (
                  <span
                    className="shrink-0 font-semibold text-blue-800"
                    aria-label={`${domain.percentageMin}–${domain.percentageMax}%`}
                  >
                    {domain.percentageMin}–{domain.percentageMax}%
                  </span>
                )}
              </div>
              {domain.percentage != null && (
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-blue-100" aria-hidden="true">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{ width: `${Math.min(100, Math.max(0, domain.percentage))}%` }}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {!hasAnyPercentage && (
        <p className="mt-3 text-xs leading-5 text-slate-600">{noWeightsLabel}</p>
      )}
    </>
  );
}

export default function ExamBlueprintCard({
  blueprint,
  lang,
}: {
  blueprint?: ExamBlueprint | null;
  lang: Lang;
}) {
  const hasExams = (blueprint?.exams?.length ?? 0) > 0;
  if (!blueprint || (blueprint.domains.length === 0 && !hasExams)) return null;

  const t = COPY[lang];

  return (
    <section
      aria-labelledby="exam-blueprint-heading"
      className="mb-5 rounded-xl border border-blue-200 bg-blue-50/70 p-4 sm:p-5"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 id="exam-blueprint-heading" className="text-lg font-bold text-blue-900">
            {t.title}
          </h2>
          {blueprint.examName && (
            <p className="mt-1 text-sm font-medium text-slate-800">
              <span className="font-semibold">{t.name}: </span>{blueprint.examName}
            </p>
          )}
          <dl className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-700">
            {blueprint.examCode && (
              <div><dt className="inline font-semibold">{t.code}: </dt><dd className="inline">{blueprint.examCode}</dd></div>
            )}
            {blueprint.examVersion && (
              <div><dt className="inline font-semibold">{t.version}: </dt><dd className="inline">{blueprint.examVersion}</dd></div>
            )}
            {blueprint.provider && (
              <div><dt className="inline font-semibold">{t.provider}: </dt><dd className="inline">{blueprint.provider}</dd></div>
            )}
          </dl>
        </div>
      </div>

      <h3 className="mt-4 text-sm font-semibold text-slate-800">{t.topics}</h3>

      {hasExams ? (
        <div className="mt-2 space-y-5">
          {blueprint.exams!.map((exam) => (
            <div key={exam.label}>
              <p className="text-sm font-semibold text-blue-900">
                {exam.label}
                {exam.examVersion && (
                  <span className="ml-1 font-normal text-slate-600">({exam.examVersion})</span>
                )}
              </p>
              <DomainList domains={exam.domains} noWeightsLabel={t.noWeights} />
              {exam.sourceUrl && (
                <p className="mt-1 text-xs">
                  <a
                    href={exam.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-blue-700 underline decoration-blue-300 underline-offset-2 hover:text-blue-900"
                  >
                    {exam.sourceName ?? t.source} <span aria-hidden="true">↗</span>
                    <span className="sr-only"> ({t.external})</span>
                  </a>
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <DomainList domains={blueprint.domains} noWeightsLabel={t.noWeights} />
      )}

      {blueprint.note && (
        <p className="mt-3 rounded-lg bg-blue-100/70 p-2.5 text-xs leading-5 text-blue-900">
          {blueprint.note}
        </p>
      )}

      <div className="mt-4 border-t border-blue-200 pt-3 text-sm text-slate-700">
        <p>
          <span className="font-semibold">{t.source}: </span>
          <a
            href={blueprint.officialSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-700 underline decoration-blue-300 underline-offset-2 hover:text-blue-900"
          >
            {blueprint.officialSourceName} <span aria-hidden="true">↗</span>
            <span className="sr-only"> ({t.external})</span>
          </a>
        </p>
        {blueprint.officialExamPageUrl && (
          <p className="mt-1">
            <a
              href={blueprint.officialExamPageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-700 underline decoration-blue-300 underline-offset-2 hover:text-blue-900"
            >
              {t.examPage} <span aria-hidden="true">↗</span>
              <span className="sr-only"> ({t.external})</span>
            </a>
          </p>
        )}
        {blueprint.lastVerifiedAt && (
          <p className="mt-1"><span className="font-semibold">{t.verified}: </span>{formatVerifiedDate(blueprint.lastVerifiedAt, lang)}</p>
        )}
      </div>

      <p className="mt-3 text-sm leading-5 text-blue-950">{t.note}</p>
    </section>
  );
}
