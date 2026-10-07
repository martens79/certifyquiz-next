-- ============================================================================
-- Complete Pass 90 giorni — 04 ATTIVAZIONE (mette in vendita)
-- Eseguire per ogni certificazione SOLO dopo aver creato in Stripe il Product e
-- il Price (one-time, EUR) con LO STESSO importo di amount_minor dell'offerta
-- (vedi 03-postcheck [1]). Compilare gli ID Stripe qui sotto: le righe con NULL
-- vengono saltate, quindi si puo' attivare una certificazione per volta.
-- Prima di attivare, verificare in anteprima admin (?include_inactive=1) la card.
-- ============================================================================

DROP TEMPORARY TABLE IF EXISTS pass_activate;
CREATE TEMPORARY TABLE pass_activate (
  code VARCHAR(160) NOT NULL PRIMARY KEY,
  stripe_product_id VARCHAR(191) NULL,
  stripe_price_id   VARCHAR(191) NULL
);
INSERT INTO pass_activate (code, stripe_product_id, stripe_price_id) VALUES
  ('octopus-complete-isc2-cc',                  NULL, NULL),   -- prod_xxx, price_xxx
  ('octopus-complete-cisco-ccst-cybersecurity', NULL, NULL),
  ('octopus-complete-icdl',                     NULL, NULL),
  ('octopus-complete-eipass',                   NULL, NULL);

START TRANSACTION;

UPDATE certification_product_offers o
  JOIN pass_activate a ON a.code = o.code
   SET o.stripe_product_id = a.stripe_product_id,
       o.stripe_price_id   = a.stripe_price_id,
       o.status            = 'active'
 WHERE a.stripe_product_id IS NOT NULL
   AND a.stripe_price_id   IS NOT NULL
   AND o.status = 'inactive'
   AND o.version = 1;

SELECT code, status, amount_minor, access_duration_days, stripe_price_id
  FROM certification_product_offers WHERE code LIKE 'octopus-complete-%' ORDER BY code;

-- Se corretto:
COMMIT;
-- Altrimenti: ROLLBACK;
