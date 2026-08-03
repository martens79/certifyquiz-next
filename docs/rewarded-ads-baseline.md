# Baseline Premium prima dei Rewarded Ads

Periodo minimo: 14 giorni completi, senza annunci e senza modificare contemporaneamente prezzi o limiti Free.

## Segmenti e definizioni

- **Free autenticati:** utenti con account, non Premium e non trial.
- **Elegibili:** Free autenticati che raggiungono il limite delle 10 spiegazioni.
- **Paywall exposure:** prima visualizzazione di `explanation_paywall_viewed` per sessione e certificazione.
- **Ricavo per eleggibile:** ricavi guide singole + ricavi Premium attribuiti / utenti eleggibili. Tenere separati incasso annuale e MRR normalizzato.
- **Conversione 1/7/30 giorni:** prima conversione confermata da Stripe entro la finestra dalla prima esposizione al paywall.

## Eventi GA4 e funnel

Creare un funnel esplorativo: `diagnostic_quiz_started` → `quiz_completed` → `quiz_result_viewed` → `explanation_paywall_viewed` → `premium_cta_clicked` → `pricing_viewed` → `pricing_plan_selected` → `checkout_started` → `purchase_completed`.

Breakdown obbligatori: `certification_slug`, `language`, `user_state`, `quiz_mode`, `source_page`, `plan_type`, `purchase_type`. Non esportare email, nomi o risposte.

Dashboard proposta:

1. Free autenticati e utenti eleggibili giornalieri.
2. Paywall unici, CTR Premium e abbandono quiz dopo paywall.
3. Checkout e conversioni distinte: mensile, annuale, guida singola.
4. Conversione entro 1, 7 e 30 giorni dalla prima esposizione.
5. Ricavo totale e ricavo per eleggibile.
6. Retention D1/D7 per coorte di prima esposizione, solo se è disponibile un identificatore first-party pseudonimo lato warehouse; GA4 da solo può non bastare.

## Query logica (warehouse/BigQuery)

Costruire una tabella `first_paywall` con `MIN(event_timestamp)` per identificatore pseudonimo. Fare left join con conversioni Stripe confermate, classificare `TIMESTAMP_DIFF` nelle finestre 1/7/30 giorni e aggregare per data, certificazione, lingua e stato utente. I conteggi di ricavo devono usare gli importi Stripe effettivi, non valori client.

## Guardrail per il futuro esperimento

- Ricavo totale per eleggibile.
- Conversione Premium mensile e annuale.
- Vendite guide singole.
- Quiz completion e abbandono dopo paywall.
- D1/D7, Core Web Vitals e reclami.

Non avviare il test Rewarded finché gli eventi non restano stabili per 14 giorni e le conversioni client sono riconciliate con i webhook Stripe.

## Configurazione Rewarded predisposta (inattiva)

Backend autorevole:

```env
REWARDED_ADS_ENABLED=false
REWARDED_ADS_DAILY_CAP=2
REWARDED_ADS_WEEKLY_CAP=6
REWARDED_ADS_ROLLOUT_PERCENTAGE=0
REWARDED_ADS_HOLDOUT_PERCENTAGE=0
```

Non esiste un flag pubblico capace di abilitare la UI. Quando l'esperimento verrà implementato, eligibility, cap, intent e grant dovranno essere decisi dal backend.
