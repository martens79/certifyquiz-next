// src/components/billing/AlreadyPremiumNotice.tsx
//
// Avviso mostrato quando il backend rifiuta un nuovo checkout perche' l'utente ha gia' un abbonamento attivo o in prova
// (SUBSCRIPTION_ALREADY_ACTIVE). Nessun dettaglio tecnico: solo cosa e' successo e dove gestire l'abbonamento.
import { alreadyActiveCopy, profileHref } from "@/lib/billing-recovery";

export default function AlreadyPremiumNotice({ lang }: { lang: string }) {
  const copy = alreadyActiveCopy(lang);
  return (
    <div role="status" data-testid="already-premium" className="mt-3 max-w-3xl rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-950">
      <div className="font-semibold">✓ {copy.title}</div>
      <p className="mt-1">{copy.body}</p>
      <a
        href={profileHref(lang)}
        className="mt-2 inline-flex min-h-11 items-center rounded-lg bg-emerald-700 px-4 font-bold text-white hover:bg-emerald-800"
      >
        {copy.cta}
      </a>
    </div>
  );
}
