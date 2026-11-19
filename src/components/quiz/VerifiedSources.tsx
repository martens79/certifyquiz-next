'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { Locale } from '@/lib/quiz-types';

/**
 * Fonti verificabili sotto la spiegazione. Componente SEPARATO dal blocco spiegazione di
 * QuizEngine: riceve solo cio' che il backend ha gia' deciso di consegnare (verificato,
 * pubblicato, livello coerente con explanation_access). Il client non decide mai l'accesso:
 * si limita a non rendere nulla se non ci sono fonti valide e a non seguire URL non HTTPS.
 *
 * Nessuna etichetta "verificata": il payload non porta una prova di verifica da mostrare.
 *
 * UX mobile-first: sotto la domanda c'e' solo un pulsante compatto «Consulta le fonti» (e solo
 * se, dopo la risposta, esistono fonti utilizzabili). Le fonti stanno in un <dialog> modale
 * nativo: bottom sheet su smartphone, dialog compatto centrato da `sm:` in su. Il <dialog>
 * nativo fornisce gia' focus trap, Escape e inerzia dello sfondo, senza nuove dipendenze.
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
  open: string;
  close: string;
  panelTitle: string;
};

export const SOURCES_COPY: Record<Locale, Copy> = {
  it: { explanation: 'Fonte della spiegazione', background: 'Approfondimenti', section: 'Sezione', newTab: 'si apre in una nuova scheda', inLanguage: 'Lingua del documento', open: 'Consulta le fonti', close: 'Chiudi', panelTitle: 'Fonti' },
  en: { explanation: 'Source for the explanation', background: 'Further reading', section: 'Section', newTab: 'opens in a new tab', inLanguage: 'Document language', open: 'View sources', close: 'Close', panelTitle: 'Sources' },
  fr: { explanation: "Source de l'explication", background: 'Pour approfondir', section: 'Section', newTab: "s'ouvre dans un nouvel onglet", inLanguage: 'Langue du document', open: 'Consulter les sources', close: 'Fermer', panelTitle: 'Sources' },
  es: { explanation: 'Fuente de la explicación', background: 'Para profundizar', section: 'Sección', newTab: 'se abre en una pestaña nueva', inLanguage: 'Idioma del documento', open: 'Consultar las fuentes', close: 'Cerrar', panelTitle: 'Fuentes' },
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

/**
 * Filtro di sola sicurezza: il client non concede mai accessi, puo' solo NON mostrare.
 * Se il server ha negato la spiegazione (explanation_access.granted === false) nessuna
 * fonte di livello spiegazione (B) deve diventare visibile, anche se il payload ne portasse.
 */
export function visibleSources(input: unknown, explanationGranted?: boolean): VerifiedSource[] {
  const list = usableSources(input);
  return explanationGranted === false ? list.filter((s) => s.kind !== 'explanation') : list;
}

export function SourcesList({ list, lang }: { list: VerifiedSource[]; lang: Locale }) {
  const t = SOURCES_COPY[lang] ?? SOURCES_COPY.it;
  const explanation = list.filter((s) => s.kind === 'explanation');
  const background = list.filter((s) => s.kind !== 'explanation');
  return (
    <div className="space-y-4 text-sm" data-testid="quiz-sources">
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

/**
 * Pannello modale: bottom sheet su mobile, dialog compatto centrato da `sm:`.
 * Montato SOLO da aperto: a pannello chiuso nessun URL e' presente nel DOM.
 */
function SourcesPanel({ list, lang, onClose }: { list: VerifiedSource[]; lang: Locale; onClose: () => void }) {
  const t = SOURCES_COPY[lang] ?? SOURCES_COPY.it;
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (dialog) {
      if (typeof dialog.showModal === 'function') {
        if (!dialog.open) dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }
    }
    // Scroll della pagina bloccato mentre il pannello e' aperto; ripristinato alla chiusura.
    const body = typeof document !== 'undefined' ? document.body : null;
    const previous = body ? body.style.overflow : '';
    if (body) body.style.overflow = 'hidden';
    return () => {
      if (body) body.style.overflow = previous;
    };
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      // Escape (evento nativo `close`) chiude e fa tornare il focus al pulsante (gestito dal padre).
      onClose={onClose}
      // Click sullo sfondo (il <dialog> stesso, non il contenuto) = chiusura.
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-x-0 bottom-0 top-auto m-0 max-h-[85dvh] w-full max-w-none overflow-hidden rounded-t-2xl border border-white/10 bg-slate-900 p-0 text-white shadow-2xl backdrop:bg-black/60 sm:inset-0 sm:m-auto sm:h-fit sm:max-w-lg sm:rounded-2xl"
    >
      <div className="flex items-center justify-between gap-3 px-4 pb-2 pt-3">
        <h3 id={titleId} className="text-base font-semibold">{t.panelTitle}</h3>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg px-3 text-sm font-medium hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {t.close}
        </button>
      </div>
      <div className="max-h-[calc(85dvh-4rem)] overflow-y-auto overscroll-contain px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <SourcesList list={list} lang={lang} />
      </div>
    </dialog>
  );
}

export default function VerifiedSources({
  sources,
  lang,
  explanationGranted,
}: {
  sources?: unknown;
  lang: Locale;
  /** explanation_access.granted dal server: se `false`, le fonti B non vengono mai mostrate. */
  explanationGranted?: boolean;
}) {
  const list = visibleSources(sources, explanationGranted);
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  const close = useCallback(() => setOpen(false), []);

  // Ritorno del focus al pulsante dopo la chiusura (Escape, «Chiudi» o click sullo sfondo).
  useEffect(() => {
    if (wasOpen.current && !open) triggerRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  if (list.length === 0) return null;
  const t = SOURCES_COPY[lang] ?? SOURCES_COPY.it;
  return (
    <div className="mt-3">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 text-sm font-medium hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2z" />
          <path d="M18 19v2H6" />
        </svg>
        {t.open}
      </button>
      {open && <SourcesPanel list={list} lang={lang} onClose={close} />}
    </div>
  );
}
