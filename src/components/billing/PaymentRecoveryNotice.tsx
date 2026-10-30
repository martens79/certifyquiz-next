// src/components/billing/PaymentRecoveryNotice.tsx
//
// Avviso per un abbonamento con pagamento da regolarizzare (past_due / unpaid).
// Non concede nulla: spiega che Premium e' sospeso e, se riceve onOpenPortal, mostra il pulsante per il portale Stripe.
import { recoveryCopy } from "@/lib/billing-recovery";

type Props = {
  lang: string;
  /** "body": testo del profilo. "checkoutBlocked": testo mostrato quando il checkout viene rifiutato. */
  message: "body" | "checkoutBlocked";
  /** Se presente, mostra il pulsante che apre il portale Stripe. */
  onOpenPortal?: () => void;
  busy?: boolean;
  /** L'ultimo tentativo di aprire il portale e' fallito. */
  failed?: boolean;
  /** App Android (TWA): il portale non e' raggiungibile, si invita ad aprire il sito. */
  twa?: boolean;
};

export default function PaymentRecoveryNotice({ lang, message, onOpenPortal, busy = false, failed = false, twa = false }: Props) {
  const copy = recoveryCopy(lang);
  return (
    <div role="alert" data-testid="payment-recovery" className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
      <div className="font-semibold">⚠️ {copy.title}</div>
      <p className="mt-1">{copy[message]}</p>
      {twa && <p className="mt-1">{copy.twaNote}</p>}
      {onOpenPortal && !twa && (
        <button
          type="button"
          onClick={onOpenPortal}
          disabled={busy}
          className="mt-2 inline-flex min-h-11 items-center rounded-lg bg-amber-600 px-4 font-bold text-white hover:bg-amber-700 disabled:opacity-60"
        >
          {busy ? copy.loading : copy.cta}
        </button>
      )}
      {failed && <p className="mt-2 font-semibold text-red-700">{copy.error}</p>}
    </div>
  );
}
