-- ============================================================================
-- OPZIONALE — CCST Networking Complete a 90 giorni
-- L'offerta 'octopus-complete-cisco-ccst-networking' esiste gia' ed e' attiva
-- (€24,90, senza scadenza). Eseguire SOLO se vuoi che le NUOVE vendite siano a
-- 90 giorni come CCNA. Gli ordini gia' pagati non cambiano. Prezzo e Stripe invariati.
-- ============================================================================
START TRANSACTION;

UPDATE certification_product_offers
   SET access_duration_days = 90
 WHERE code = 'octopus-complete-cisco-ccst-networking'
   AND access_duration_days IS NULL;

SELECT code, status, amount_minor, access_duration_days, stripe_price_id
  FROM certification_product_offers WHERE code LIKE '%ccst%' ORDER BY code;

-- Se corretto:
COMMIT;
-- Altrimenti: ROLLBACK;
