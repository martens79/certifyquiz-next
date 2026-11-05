# Premium: trial unico 3 giorni, settimanale EUR 3,99

Questa revisione delle PR #194/#169 sostituisce la precedente proposta. Tutti i piani offrono una sola prova di 3 giorni ai nuovi account idonei; dopo la prova: settimanale EUR 3,99 ogni 7 giorni, mensile EUR 9,99 al mese, annuale EUR 59,90 all'anno. Rinnovi automatici; cancellazione dal profilo prima del primo addebito o del prossimo rinnovo. Account non idonei: pagamento immediato, confermato da Stripe prima dell'adesione.

Account esistenti precedenti al lancio esclusi dal nuovo trial per sicurezza storica. Trial 7 giorni già attivi e abbonamenti preesistenti conservano condizioni e scadenze. Nessuna promessa di prova attiva dalla success page: stato verificato nel profilo.

Listino e avvisi IT/EN/FR/ES, 3 colonne desktop e card impilate su mobile, stesso default mensile e stesse funzionalità. Download PDF durante il trial invariati. Ripresa login mantiene il piano. Eventi già disponibili riutilizzati senza duplicare acquisti e senza cambiare consenso Analytics.

Prima dell'abilitazione servono migrazione `premium_trial_accounts`, flag/cutoff della nuova policy e Price settimanale reale, collaudo Stripe sandbox e autorizzazione. Il frontend usa NEXT_PUBLIC_PREMIUM_WEEKLY_ENABLED=1 alla build. Il registro persistente e la serializzazione MySQL impediscono una prova per piano; errori o storico incerto falliscono in modo conservativo.

Analisi, politica per account preesistenti, misurazione e limiti del confronto prima/dopo, SQL read-only e azioni manuali: `certifyquiz-backend/docs/payments/premium-weekly-2026-11-05.md`. Cambiano insieme trial e disponibilità del settimanale: non attribuire l'eventuale crescita a una singola modifica.

Nessun merge, deploy o mutazione Stripe live. Regola Vercel invariata: niente preview automatica su codex/premium-weekly-20261105.
