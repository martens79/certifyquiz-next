-- ============================================================================
-- Complete Pass 90 giorni — 03 POSTCHECK (SOLO LETTURA), dopo 02-data.sql
-- ============================================================================

-- [1] Atteso: 4 offerte nuove, inactive, 90 giorni, senza stripe_price_id.
SELECT code, status, currency, amount_minor, access_duration_days, stripe_product_id, stripe_price_id
  FROM certification_product_offers
 WHERE code IN ('octopus-complete-isc2-cc','octopus-complete-cisco-ccst-cybersecurity',
                'octopus-complete-icdl','octopus-complete-eipass');

-- [2] Atteso: ISC2 CC / CCST Cyber / ICDL: 7 base + guide + map (+ lab/scenario se esistono);
--     EIPASS: 7 base (+ scenario se esistono). Confronta con il precheck [5].
SELECT o.code, COUNT(i.id) AS capability, GROUP_CONCAT(i.resource_type ORDER BY i.resource_type) AS tipi
  FROM certification_product_offers o
  JOIN product_resource_inclusions i ON i.offer_id = o.id
 WHERE o.code LIKE 'octopus-complete-%'
 GROUP BY o.id ORDER BY o.code;

-- [3] Atteso: nessuna capability Complete-only su Dolphin (0 righe).
SELECT o.code, i.resource_type
  FROM product_resource_inclusions i
  JOIN certification_product_offers o ON o.id = i.offer_id
  JOIN catalog_products p ON p.id = o.product_id
 WHERE p.code = 'dolphin-study' AND i.resource_type IN ('mock_review','lab','exam_mode');

-- [4] Totali: offerte = precheck [7] + 4, inclusioni = precheck [7] + somma di [2].
SELECT (SELECT COUNT(*) FROM certification_product_offers) AS offers_total,
       (SELECT COUNT(*) FROM product_resource_inclusions) AS inclusions_total;

-- [5] Le offerte CCNA e CCST preesistenti sono invariate.
SELECT code, status, amount_minor, access_duration_days, stripe_price_id
  FROM certification_product_offers
 WHERE code IN ('octopus-complete-ccna','octopus-complete-cisco-ccst-networking');
