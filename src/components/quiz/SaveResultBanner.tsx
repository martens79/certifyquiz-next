'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import type { Locale } from '@/lib/quiz-types';
import {
  EMPTY_OUTBOX,
  completeAwaiting,
  discardAwaiting,
  discardResult,
  getAwaitingIdentity,
  getOutboxItems,
  getResolvedIdentity,
  hydrateOutbox,
  retryResult,
  subscribeOutbox,
  type AwaitingItem,
  type OutboxItem,
  type SaveFailureKind,
} from '@/lib/save-exam-outbox';
import { retryUnresolvedResult } from '@/lib/quiz-result-save';

type Props = {
  lang: Locale;
  userId: number | string | null | undefined;
  /** risultato appena concluso in questa pagina (schermata finale del quiz) */
  attemptId?: string;
  /** risultati rimasti da un caricamento precedente, valutati ma mai registrati */
  leftover?: boolean;
};

type Copy = {
  saving: string;
  saved: string;
  retry: string;
  discard: string;
  keepOpen: string;
  leftover: (correct: number, total: number) => string;
  failed: Record<SaveFailureKind, string>;
};

// Il punteggio mostrato e' valido; quello che puo' mancare e' la voce in cronologia.
const COPY: Record<Locale, Copy> = {
  it: {
    saving: 'Registrazione del risultato in cronologia…',
    saved: 'Risultato registrato nella cronologia.',
    retry: 'Riprova a salvare',
    discard: 'Scarta',
    keepOpen: 'Non chiudere questa pagina finché non è salvato.',
    leftover: (c, t) => `Un quiz concluso in precedenza (${c}/${t}) non è stato registrato nella cronologia.`,
    failed: {
      network: 'Il risultato è stato calcolato, ma la registrazione nella cronologia NON è confermata (connessione assente). Le tue risposte non sono andate perse: riprova a salvare, non verranno creati duplicati.',
      timeout: 'Il risultato è stato calcolato, ma la registrazione nella cronologia NON è confermata (il server non ha risposto). Riprova a salvare, non verranno creati duplicati.',
      server: 'Il risultato è stato calcolato, ma la registrazione nella cronologia NON è confermata (errore del server). Riprova a salvare, non verranno creati duplicati.',
      busy: 'Il salvataggio è ancora in corso sul server. Attendi qualche secondo e riprova.',
      rate: 'Troppe richieste ravvicinate: il risultato NON è ancora nella cronologia. Attendi circa 30 secondi e riprova a salvare.',
      auth: 'La sessione è scaduta: il risultato NON è ancora nella cronologia. Accedi di nuovo (anche da un’altra scheda) e poi riprova a salvare.',
      rejected: 'Non è stato possibile registrare questo risultato nella cronologia. Il punteggio mostrato resta valido.',
      interrupted: 'La registrazione del risultato nella cronologia NON è confermata. Riprova a salvare, non verranno creati duplicati.',
      identity: 'Il risultato è stato calcolato, ma la registrazione nella cronologia NON è confermata: non riesco ancora a verificare il tuo account. Riprova tra qualche secondo senza rispondere di nuovo; se ricarichi la pagina il risultato non verrà registrato.',
    },
  },
  en: {
    saving: 'Saving your result to your history…',
    saved: 'Result saved to your history.',
    retry: 'Retry saving',
    discard: 'Discard',
    keepOpen: 'Please keep this page open until it is saved.',
    leftover: (c, t) => `A quiz you completed earlier (${c}/${t}) was not saved to your history.`,
    failed: {
      network: 'Your result was calculated, but saving to your history is NOT confirmed (no connection). Your answers are not lost: please retry saving, no duplicates will be created.',
      timeout: 'Your result was calculated, but saving to your history is NOT confirmed (the server did not respond). Please retry saving, no duplicates will be created.',
      server: 'Your result was calculated, but saving to your history is NOT confirmed (server error). Please retry saving, no duplicates will be created.',
      busy: 'The save is still in progress on the server. Wait a few seconds and try again.',
      rate: 'Too many requests: your result is NOT in your history yet. Wait about 30 seconds and retry saving.',
      auth: 'Your session has expired: your result is NOT in your history yet. Sign in again (a different tab works too), then retry saving.',
      rejected: 'This result could not be saved to your history. The score shown is still valid.',
      interrupted: 'Saving your result to your history is NOT confirmed. Please retry saving, no duplicates will be created.',
      identity: 'Your result was calculated, but saving to your history is NOT confirmed: your account could not be verified yet. Retry in a few seconds without answering again; if you reload this page the result will not be saved.',
    },
  },
  fr: {
    saving: 'Enregistrement du résultat dans l’historique…',
    saved: 'Résultat enregistré dans l’historique.',
    retry: 'Réessayer l’enregistrement',
    discard: 'Ignorer',
    keepOpen: 'Ne fermez pas cette page tant qu’il n’est pas enregistré.',
    leftover: (c, t) => `Un quiz terminé précédemment (${c}/${t}) n’a pas été enregistré dans l’historique.`,
    failed: {
      network: 'Le résultat a été calculé, mais son enregistrement dans l’historique n’est PAS confirmé (pas de connexion). Vos réponses ne sont pas perdues : réessayez l’enregistrement, aucun doublon ne sera créé.',
      timeout: 'Le résultat a été calculé, mais son enregistrement dans l’historique n’est PAS confirmé (le serveur n’a pas répondu). Réessayez l’enregistrement, aucun doublon ne sera créé.',
      server: 'Le résultat a été calculé, mais son enregistrement dans l’historique n’est PAS confirmé (erreur du serveur). Réessayez l’enregistrement, aucun doublon ne sera créé.',
      busy: 'L’enregistrement est encore en cours sur le serveur. Attendez quelques secondes puis réessayez.',
      rate: 'Trop de requêtes : le résultat n’est PAS encore dans l’historique. Attendez environ 30 secondes puis réessayez.',
      auth: 'La session a expiré : le résultat n’est PAS encore dans l’historique. Reconnectez-vous (un autre onglet convient aussi), puis réessayez l’enregistrement.',
      rejected: 'Ce résultat n’a pas pu être enregistré dans l’historique. Le score affiché reste valable.',
      interrupted: 'L’enregistrement du résultat dans l’historique n’est PAS confirmé. Réessayez l’enregistrement, aucun doublon ne sera créé.',
      identity: 'Le résultat a été calculé, mais son enregistrement dans l’historique n’est PAS confirmé : votre compte n’a pas encore pu être vérifié. Réessayez dans quelques secondes sans répondre à nouveau ; si vous rechargez la page, le résultat ne sera pas enregistré.',
    },
  },
  es: {
    saving: 'Guardando el resultado en tu historial…',
    saved: 'Resultado guardado en tu historial.',
    retry: 'Reintentar el guardado',
    discard: 'Descartar',
    keepOpen: 'No cierres esta página hasta que se guarde.',
    leftover: (c, t) => `Un cuestionario que completaste antes (${c}/${t}) no se guardó en tu historial.`,
    failed: {
      network: 'El resultado se calculó, pero el guardado en tu historial NO está confirmado (sin conexión). Tus respuestas no se han perdido: reintenta el guardado, no se crearán duplicados.',
      timeout: 'El resultado se calculó, pero el guardado en tu historial NO está confirmado (el servidor no respondió). Reintenta el guardado, no se crearán duplicados.',
      server: 'El resultado se calculó, pero el guardado en tu historial NO está confirmado (error del servidor). Reintenta el guardado, no se crearán duplicados.',
      busy: 'El guardado sigue en curso en el servidor. Espera unos segundos e inténtalo de nuevo.',
      rate: 'Demasiadas solicitudes: tu resultado AÚN NO está en el historial. Espera unos 30 segundos y reintenta el guardado.',
      auth: 'La sesión ha caducado: tu resultado AÚN NO está en el historial. Inicia sesión de nuevo (sirve otra pestaña) y reintenta el guardado.',
      rejected: 'No se pudo guardar este resultado en tu historial. La puntuación mostrada sigue siendo válida.',
      interrupted: 'El guardado de tu resultado en el historial NO está confirmado. Reintenta el guardado, no se crearán duplicados.',
      identity: 'El resultado se calculó, pero el guardado en tu historial NO está confirmado: aún no se pudo verificar tu cuenta. Reintenta en unos segundos sin responder de nuevo; si recargas la página, el resultado no se guardará.',
    },
  },
};

function Row({ item, lang, showLeftover }: { item: OutboxItem; lang: Locale; showLeftover: boolean }) {
  const t = COPY[lang] ?? COPY.en;
  const [now, setNow] = useState(() => Date.now());
  const [busy, setBusy] = useState(false);

  // riabilita il pulsante quando scade il cooldown
  useEffect(() => {
    const wait = item.retryAt - Date.now();
    if (item.status !== 'failed' || wait <= 0) return;
    const id = setTimeout(() => setNow(Date.now()), wait + 20);
    return () => clearTimeout(id);
  }, [item.retryAt, item.status]);

  if (item.status === 'saving') {
    return (
      <div role="status" data-testid="save-status-saving" className="mb-3 rounded-xl border border-slate-300 bg-slate-50 p-3 text-sm text-slate-800">
        {t.saving}
      </div>
    );
  }
  if (item.status === 'saved') {
    return (
      <div role="status" data-testid="save-status-saved" className="mb-3 rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-900">
        ✓ {t.saved}
      </div>
    );
  }

  const f = item.failure ?? { kind: 'interrupted' as const, retryable: true, status: null };
  const cooling = item.retryAt > now;
  const p = item.entry.payload;
  return (
    <div
      role="alert"
      data-testid="save-error"
      data-kind={f.kind}
      className="mb-3 flex flex-col gap-2 rounded-xl border border-amber-400 bg-amber-50 p-3 text-sm text-amber-950 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="space-y-1">
        {showLeftover && <p className="font-semibold">{t.leftover(p.correctAnswers, p.totalQuestions)}</p>}
        <p>{t.failed[f.kind]}</p>
        {!item.persisted && f.retryable && <p className="font-semibold">{t.keepOpen}</p>}
      </div>
      <div className="flex shrink-0 gap-2">
        {f.retryable && (
          <button
            type="button"
            data-testid="save-retry"
            className="rounded-lg bg-amber-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
            disabled={busy || cooling}
            onClick={async () => {
              setBusy(true);
              try { await retryResult(item.entry.attemptId); } catch { /* lo stato e' nello store */ } finally { setBusy(false); }
            }}
          >
            {t.retry}
          </button>
        )}
        {(showLeftover || !f.retryable) && (
          <button
            type="button"
            data-testid="save-discard"
            className="rounded-lg border border-amber-900 px-3 py-2 text-sm font-semibold"
            onClick={() => discardResult(item.entry.attemptId)}
          >
            {t.discard}
          </button>
        )}
      </div>
    </div>
  );
}

/** Risultato valutato ma identita' non ancora verificata: solo in memoria, retry manuale senza rispondere di nuovo. */
function AwaitingRow({ item, lang }: { item: AwaitingItem; lang: Locale }) {
  const t = COPY[lang] ?? COPY.en;
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const wait = item.retryAt - Date.now();
    if (item.status !== 'waiting' || wait <= 0) return;
    const id = setTimeout(() => setNow(Date.now()), wait + 20);
    return () => clearTimeout(id);
  }, [item.retryAt, item.status]);
  if (item.status === 'resolving') {
    return (
      <div role="status" data-testid="save-status-saving" className="mb-3 rounded-xl border border-slate-300 bg-slate-50 p-3 text-sm text-slate-800">
        {t.saving}
      </div>
    );
  }
  return (
    <div
      role="alert"
      data-testid="save-error"
      data-kind="identity"
      className="mb-3 flex flex-col gap-2 rounded-xl border border-amber-400 bg-amber-50 p-3 text-sm text-amber-950 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="space-y-1">
        <p>{t.failed.identity}</p>
        <p className="font-semibold">{t.keepOpen}</p>
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          data-testid="save-retry"
          className="rounded-lg bg-amber-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
          disabled={item.retryAt > now}
          onClick={() => { retryUnresolvedResult(item.attemptId).catch(() => { /* lo stato e' nello store */ }); }}
        >
          {t.retry}
        </button>
        <button
          type="button"
          data-testid="save-discard"
          className="rounded-lg border border-amber-900 px-3 py-2 text-sm font-semibold"
          onClick={() => discardAwaiting(item.attemptId)}
        >
          {t.discard}
        </button>
      </div>
    </div>
  );
}

/**
 * Stato della registrazione in cronologia, distinto dal punteggio.
 * - con `attemptId`: il risultato appena concluso (salvataggio / salvato / errore + retry);
 * - con `leftover`: risultati di un caricamento precedente non ancora registrati.
 */
export default function SaveResultBanner({ lang, userId, attemptId, leftover = false }: Props) {
  const awaiting = useSyncExternalStore(
    subscribeOutbox,
    () => (leftover ? null : getAwaitingIdentity(attemptId)),
    () => null
  );
  const resolved = useSyncExternalStore(
    subscribeOutbox,
    () => (leftover ? null : getResolvedIdentity(attemptId)),
    () => null
  );
  // user?.id (AuthProvider) oppure l'id verificato dal retry dell'identita'
  const uid = userId != null ? String(userId) : resolved;

  useEffect(() => {
    if (leftover && uid != null) hydrateOutbox(uid);
  }, [leftover, uid]);

  // L'identita' e' arrivata (AuthProvider idratato) mentre il risultato era in attesa: una sola registrazione, nessun loop.
  const waitingId = awaiting?.status === 'waiting' ? awaiting.attemptId : null;
  useEffect(() => {
    if (waitingId && userId != null) completeAwaiting(waitingId, async () => userId, {}, false).catch(() => { /* stato nello store */ });
  }, [waitingId, userId]);

  const all = useSyncExternalStore(
    subscribeOutbox,
    () => (uid == null ? EMPTY_OUTBOX : getOutboxItems(uid)),
    () => EMPTY_OUTBOX
  );
  const shown = leftover ? all.filter((i) => !i.fresh) : attemptId ? all.filter((i) => i.entry.attemptId === attemptId) : EMPTY_OUTBOX;
  if (awaiting) {
    return (
      <div data-testid="save-current">
        <AwaitingRow item={awaiting} lang={lang} />
      </div>
    );
  }
  if (uid == null || shown.length === 0) return null;
  return (
    <div data-testid={leftover ? 'save-leftover' : 'save-current'}>
      {shown.map((item) => (
        <Row key={item.entry.attemptId} item={item} lang={lang} showLeftover={leftover} />
      ))}
    </div>
  );
}
