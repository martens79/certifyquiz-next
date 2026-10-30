// src/lib/billing-recovery.ts
//
// Recupero di un pagamento fallito (abbonamento Stripe past_due / unpaid).
//
// Regole (invariate rispetto a prima):
//  - Premium NON e' attivo finche' Stripe non incassa: lo decide il backend con i webhook, qui non si concede nulla.
//  - NON si crea un secondo abbonamento: il checkout resta rifiutato dal backend (400).
// Qui c'e' solo il percorso per il cliente: capire cosa e' successo e aprire il portale Stripe per aggiornare il metodo di pagamento.

export type RecoveryLang = "it" | "en" | "fr" | "es";

/** Stati Stripe con abbonamento esistente ma pagamento da regolarizzare. */
export const PAYMENT_ISSUE_STATUSES: readonly string[] = ["past_due", "unpaid"];

export function needsPaymentRecovery(status: string | null | undefined): boolean {
  return typeof status === "string" && PAYMENT_ISSUE_STATUSES.includes(status);
}

/** Risposta del backend a create-checkout-session quando esiste gia' un abbonamento con pagamento non regolare. */
export function isPaymentIssueCheckoutResponse(httpStatus: number, body: unknown): boolean {
  return (
    httpStatus === 400 &&
    typeof body === "object" &&
    body !== null &&
    (body as { code?: unknown }).code === "SUBSCRIPTION_PAYMENT_ISSUE"
  );
}

/**
 * Difesa in profondita' contro redirect non autorizzati: si naviga solo verso il portale Stripe.
 * (Il backend crea la sessione solo per il cliente dell'utente autenticato e con return_url fisso.)
 * Se il portale usasse un dominio personalizzato, va elencato in NEXT_PUBLIC_BILLING_PORTAL_HOSTS (host separati da virgola).
 */
const DEFAULT_PORTAL_HOSTS = ["billing.stripe.com"];

function configuredPortalHosts(): string[] {
  const extra = (process.env.NEXT_PUBLIC_BILLING_PORTAL_HOSTS || "")
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter((h) => /^[a-z0-9.-]+$/.test(h));
  return [...DEFAULT_PORTAL_HOSTS, ...extra];
}

export function isStripePortalUrl(value: unknown, allowedHosts: readonly string[] = configuredPortalHosts()): value is string {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && allowedHosts.includes(url.hostname) && !url.username && !url.password;
  } catch {
    return false;
  }
}

export type PortalResult =
  | { ok: true; url: string }
  | { ok: false; reason: "no_customer" | "unavailable" | "untrusted_url" };

/** `post` esegue POST /billing/create-portal-session con l'autenticazione dell'utente (nessun parametro dal client). */
export async function requestPortalUrl(post: () => Promise<Response>): Promise<PortalResult> {
  try {
    const res = await post();
    const data = (await res.json().catch(() => null)) as { url?: unknown; code?: unknown } | null;
    if (!res.ok) {
      return { ok: false, reason: data?.code === "NO_STRIPE_CUSTOMER" ? "no_customer" : "unavailable" };
    }
    if (!isStripePortalUrl(data?.url)) return { ok: false, reason: "untrusted_url" };
    return { ok: true, url: data.url };
  } catch {
    return { ok: false, reason: "unavailable" };
  }
}

type RecoveryCopy = {
  title: string;
  body: string;
  checkoutBlocked: string;
  cta: string;
  loading: string;
  error: string;
};

export const RECOVERY_COPY: Record<RecoveryLang, RecoveryCopy> = {
  it: {
    title: "Pagamento non riuscito",
    body: "L'ultimo pagamento del tuo abbonamento Premium non è andato a buon fine, quindi Premium è sospeso. Aggiorna il metodo di pagamento dal portale sicuro di Stripe: Stripe ritenterà l'addebito e, appena va a buon fine, Premium torna attivo.",
    checkoutBlocked: "Hai già un abbonamento Premium con un pagamento da regolarizzare: non serve crearne un altro. Aggiorna il metodo di pagamento.",
    cta: "Aggiorna metodo di pagamento",
    loading: "Apertura del portale…",
    error: "Non riusciamo ad aprire il portale di pagamento. Riprova tra poco; se il problema continua, scrivici dalla pagina Contatti.",
  },
  en: {
    title: "Payment failed",
    body: "The latest payment for your Premium subscription did not go through, so Premium is on hold. Update your payment method in Stripe's secure portal: Stripe will retry the charge and, as soon as it succeeds, Premium is active again.",
    checkoutBlocked: "You already have a Premium subscription with a payment to fix: there is no need to create another one. Update your payment method.",
    cta: "Update payment method",
    loading: "Opening the portal…",
    error: "We could not open the payment portal. Please try again shortly; if the problem persists, contact us from the Contact page.",
  },
  fr: {
    title: "Paiement échoué",
    body: "Le dernier paiement de votre abonnement Premium n'a pas abouti : Premium est donc suspendu. Mettez à jour votre moyen de paiement dans le portail sécurisé de Stripe : Stripe retentera le prélèvement et, dès qu'il réussit, Premium redevient actif.",
    checkoutBlocked: "Vous avez déjà un abonnement Premium dont le paiement est à régulariser : inutile d'en créer un autre. Mettez à jour votre moyen de paiement.",
    cta: "Mettre à jour le moyen de paiement",
    loading: "Ouverture du portail…",
    error: "Impossible d'ouvrir le portail de paiement. Réessayez dans un instant ; si le problème persiste, contactez-nous depuis la page Contact.",
  },
  es: {
    title: "Pago fallido",
    body: "El último pago de tu suscripción Premium no se completó, así que Premium está en pausa. Actualiza tu método de pago en el portal seguro de Stripe: Stripe reintentará el cobro y, en cuanto se complete, Premium vuelve a estar activo.",
    checkoutBlocked: "Ya tienes una suscripción Premium con un pago por regularizar: no hace falta crear otra. Actualiza tu método de pago.",
    cta: "Actualizar método de pago",
    loading: "Abriendo el portal…",
    error: "No podemos abrir el portal de pago. Inténtalo de nuevo en un momento; si el problema continúa, escríbenos desde la página de Contacto.",
  },
};

export function recoveryCopy(lang: string | null | undefined): RecoveryCopy {
  return RECOVERY_COPY[(lang as RecoveryLang) in RECOVERY_COPY ? (lang as RecoveryLang) : "en"];
}
