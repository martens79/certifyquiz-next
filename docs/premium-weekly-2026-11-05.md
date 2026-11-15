# Premium: trial di 3 giorni solo sul mensile, settimanale EUR 3,99

Revisione 2026-11-08 delle PR #194/#169 (policy definitiva approvata). La prova gratuita di 3 giorni esiste SOLO sul piano mensile (EUR 9,99 al mese), una sola volta e solo per account idonei. Settimanale (EUR 3,99 ogni 7 giorni), trimestrale (EUR 19,90) e annuale (EUR 59,90 all'anno) sono a pagamento immediato; nessun testo promette prove su questi piani. Rinnovi automatici; cancellazione dal profilo prima del primo addebito o del prossimo rinnovo. Account mensili non idonei: pagamento immediato di EUR 9,99, confermato da Stripe prima dell'adesione.

Account esistenti precedenti al lancio esclusi dal nuovo trial per sicurezza storica. Trial 7 giorni già attivi e abbonamenti preesistenti conservano condizioni e scadenze. Nessuna promessa di prova attiva dalla success page: stato verificato nel profilo.

Listino e avvisi IT/EN/FR/ES, 3 colonne desktop e card impilate su mobile, stesso default mensile e stesse funzionalità. Download PDF durante il trial invariati. Ripresa login mantiene il piano. Eventi già disponibili riutilizzati senza duplicare acquisti e senza cambiare consenso Analytics.

Prima dell'abilitazione servono migrazione `premium_trial_accounts`, flag/cutoff della nuova policy e Price settimanale reale, collaudo Stripe sandbox e autorizzazione. Il frontend usa NEXT_PUBLIC_PREMIUM_WEEKLY_ENABLED=1 alla build. Il registro persistente e la serializzazione MySQL impediscono una seconda prova; errori o storico incerto falliscono in modo conservativo.

Analisi, politica per account preesistenti, misurazione e limiti del confronto prima/dopo, SQL read-only e azioni manuali: `certifyquiz-backend/docs/payments/premium-weekly-2026-11-05.md`. Cambiano insieme trial e disponibilità del settimanale: non attribuire l'eventuale crescita a una singola modifica.

Nessun merge, deploy o mutazione Stripe live. Regola Vercel invariata: niente preview automatica su codex/premium-weekly-20261105.
