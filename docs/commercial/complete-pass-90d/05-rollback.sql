-- ============================================================================
-- Complete Pass 90 giorni — 05 ROLLBACK di 02-data.sql
-- Rimuove SOLO le 4 offerte nuove (e le loro inclusioni, via ON DELETE CASCADE),
-- e solo se non hanno alcun ordine. Non tocca CCNA ne' CCST Networking.
-- Se un'offerta e' gia' stata venduta NON va cancellata: si mette status='retired'.
-- ============================================================================
START TRANSACTION;

DELETE o FROM certification_product_offers o
 WHERE o.code IN ('octopus-complete-isc2-cc','octopus-complete-cisco-ccst-cybersecurity',
                  'octopus-complete-icdl','octopus-complete-eipass')
   AND NOT EXISTS (SELECT 1 FROM commerce_orders co WHERE co.offer_id = o.id)
   AND NOT EXISTS (SELECT 1 FROM user_certification_entitlements e WHERE e.offer_id = o.id);

SELECT code, status FROM certification_product_offers WHERE code LIKE 'octopus-complete-%' ORDER BY code;

-- Se corretto:
COMMIT;
-- Altrimenti: ROLLBACK;
-- Rollback di 02b (opzionale):
--   UPDATE certification_product_offers SET access_duration_days = NULL
--    WHERE code = 'octopus-complete-cisco-ccst-networking';
