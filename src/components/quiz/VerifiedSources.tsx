import type { Locale } from '@/lib/quiz-types';

/**
 * Fonti verificabili sotto la spiegazione. Componente SEPARATO dal blocco spiegazione di
 * QuizEngine: riceve solo cio' che il backend ha gia' deciso di consegnare (verificato,
 * pubblicato, livello coerente con explanation_access). Il client non decide mai l'accesso:
 * si limita a non rendere nulla se non ci sono fonti valide e a non seguire URL non HTTPS.
 *
 * Nessuna etichetta "verificata": il payload non porta una prova di verifica da mostrare.
 */
export type VerifiedSource = {
  id: number;
  level: 'A' | 'B';
  kind: 'explanation' | 'background';
  title: string;
  publisher: string;
  language: Locale;
  url: string;
  locator: string;
  version?: string;
};

type Copy = {
  explanation: string;
  background: string;
  section: string;
  newTab: string;
  inLanguage: string;
};

export const SOURCES_COPY: Record<Locale, Copy> = {
  it: { explanation: 'Fonte della spiegazione', background: 'Approfondimenti', section: 'Sezione', newTab: 'si apre in una nuova scheda', inLanguage: 'Lingua del documento' },
  en: { explanation: 'Source for the explanation', background: 'Further reading', section: 'Section', newTab: 'opens in a new tab', inLanguage: 'Document language' },
  fr: { explanation: "Source de l'explication", background: 'Pour approfondir', section: 'Section', newTab: "s'ouvre dans un nouvel onglet", inLanguage: 'Langue du document' },
  es: { explanation: 'Fuente de la explicación', background: 'Para profundizar', section: 'Sección', newTab: 'se abre en una pestaña nueva', inLanguage: 'Idioma del documento' },
};

const LANGS = ['it', 'en', 'fr', 'es'];

export function isSafeHttpsUrl(value: unknown): value is string {
  if (typeof value !== 'string' || !/^https:\/\//i.test(value)) return false;
  try {
    const u = new URL(value);
    return u.protocol === 'https:' && !u.username && !u.password && !!u.hostname;
  } catch {
    return false;
  }
}

/** Difesa in profondita': scarta righe malformate o con URL non HTTPS, senza mai lanciare. */
export function usableSources(input: unknown): VerifiedSource[] {
  if (!Array.isArray(input)) return [];
  const out: VerifiedSource[] = [];
  for (const s of input) {
    if (!s || typeof s !== 'object') continue;
    const r = s as Record<string, unknown>;
    if (!isSafeHttpsUrl(r.url)) continue;
    if (typeof r.title !== 'string' || !r.title.trim()) continue;
    if (typeof r.publisher !== 'string' || !r.publisher.trim()) continue;
    if (typeof r.locator !== 'string' || !r.locator.trim()) continue;
    out.push({
      id: Number(r.id),
      level: r.level === 'B' ? 'B' : 'A',
      kind: r.kind === 'explanation' ? 'explanation' : 'background',
      title: r.title,
      publisher: r.publisher,
      language: (LANGS.includes(String(r.language)) ? r.language : 'en') as Locale,
      url: r.url,
      locator: r.locator,
      ...(typeof r.version === 'string' && r.version ? { version: r.version } : {}),
    });
  }
  return out;
}

function SourceItem({ source, lang }: { source: VerifiedSource; lang: Locale }) {
  const t = SOURCES_COPY[lang] ?? SOURCES_COPY.it;
  return (
    <li className="min-w-0">
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-[44px] w-full flex-col justify-center break-words rounded-lg px-1 py-1 underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <span className="font-medium">
          {source.title}
          <span className="sr-only"> ({t.newTab})</span>
        </span>
        <span className="text-xs opacity-80">
          {source.publisher}
          {source.version ? ` · ${source.version}` : ''}
          {` · ${t.section}: ${source.locator}`}
          {` · ${t.inLanguage}: ${source.language.toUpperCase()}`}
        </span>
      </a>
    </li>
  );
}

export default function VerifiedSources({ sources, lang }: { sources?: unknown; lang: Locale }) {
  const list = usableSources(sources);
  if (list.length === 0) return null;
  const t = SOURCES_COPY[lang] ?? SOURCES_COPY.it;
  const explanation = list.filter((s) => s.kind === 'explanation');
  const background = list.filter((s) => s.kind !== 'explanation');
  return (
    <div className="mt-3 space-y-3 rounded-xl bg-white/5 p-4 text-sm" data-testid="quiz-sources">
      {explanation.length > 0 && (
        <section aria-label={t.explanation}>
          <h4 className="mb-1 font-semibold">{t.explanation}</h4>
          <ul className="space-y-1">{explanation.map((s) => <SourceItem key={s.id} source={s} lang={lang} />)}</ul>
        </section>
      )}
      {background.length > 0 && (
        <section aria-label={t.background}>
          <h4 className="mb-1 font-semibold">{t.background}</h4>
          <ul className="space-y-1">{background.map((s) => <SourceItem key={s.id} source={s} lang={lang} />)}</ul>
        </section>
      )}
    </div>
  );
}
