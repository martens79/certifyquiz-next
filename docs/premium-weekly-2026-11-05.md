# Premium settimanale — frontend

Proposta in bozza. Piano settimanale EUR 3,99 ogni 7 giorni, rinnovo automatico, senza trial; mensile EUR 9,99 e trial 7 giorni invariati, annuale EUR 59,90 invariato. Stessi vantaggi Premium dopo pagamento.

Per esporlo serve NEXT_PUBLIC_PREMIUM_WEEKLY_ENABLED=1 alla build. Default disattivato. Attivare solo dopo consenso, configurazione del Price reale STRIPE_PRICE_PREMIUM_WEEKLY e BILLING_WEEKLY_ENABLED=1 nel backend. Il Price non viene creato da queste PR.

Listino IT/EN/FR/ES, prima card settimanale, 3 colonne desktop e card impilate su mobile. Selezione iniziale mensile conservata. CTA principale, confronto, CTA finale e barra mobile mostrano la periodicità corretta. Ripresa login conserva premium_weekly; vecchi intent vengono ignorati se la funzione è disabilitata. Campagna mensile non applicata al settimanale. Nessun nuovo evento di acquisto sulla success page.

Il trial attuale è solo mensile; il backend non garantisce storicamente una sola prova per account. Il settimanale è senza trial per conservare la policy attuale. Prima di estendergli il trial di 7 giorni, approvare e implementare un registro unico persistente per account con recupero dello storico Stripe, prenotazione atomica e test concorrenti. Non usare localStorage per il diritto alla prova.

Analytics riusa pricing_viewed, pricing_plan_selected, checkout_attempted e checkout_created con plan_type=premium_weekly; conversioni, rinnovi, cancellazioni e ricavi arrivano dal backend Stripe. Consenso e revoca invariati. Il piano di misurazione, SQL in sola lettura e checklist completa sono in certifyquiz-backend/docs/payments/premium-weekly-2026-11-05.md e premium-weekly-readonly.sql.

La regola Vercel in vercel.json disabilita solo il branch codex/premium-weekly-20261105, impedendo preview automatiche; non modifica il comportamento di main. Nessun merge/deploy. La produzione Stripe richiede riautenticazione per una verifica effettiva dell'account; nessun checkout reale è stato aperto.
