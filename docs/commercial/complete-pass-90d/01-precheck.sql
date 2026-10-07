-- ============================================================================
-- Complete Pass 90 giorni (ISC2 CC, CCST Networking/Cybersecurity, EIPASS, ICDL)
-- 01 — PRECHECK (SOLO LETTURA). Eseguire in MySQL Workbench su produzione.
-- ============================================================================

-- [1] Le certificazioni esistono con questi slug? (atteso: 5 righe)
--     Se manca una riga o lo slug e' diverso, correggere gli slug in 02-data.sql.
SELECT id, slug, name FROM certifications
 WHERE slug IN ('isc2-cc','cisco-ccst-networking','cisco-ccst-cybersecurity','eipass','icdl')
 ORDER BY slug;

-- [1b] Se EIPASS/ICDL non compaiono sopra: cerca lo slug reale.
SELECT id, slug, name FROM certifications
 WHERE slug LIKE '%eipass%' OR slug LIKE '%icdl%' OR name LIKE '%EIPASS%' OR name LIKE '%ICDL%';

-- [2] Offerta di riferimento CCNA Complete: prezzo, durata, Stripe, stato.
--     Il prezzo e la valuta qui sotto sono quelli copiati di default sui nuovi pass.
SELECT id, code, status, currency, amount_minor, access_duration_days, stripe_product_id, stripe_price_id
  FROM certification_product_offers WHERE code = 'octopus-complete-ccna';

-- [3] Capability dell'offerta CCNA Complete (atteso: 11 righe).
SELECT i.resource_type, i.resource_scope, i.resource_key, i.access_level
  FROM product_resource_inclusions i
  JOIN certification_product_offers o ON o.id = i.offer_id
 WHERE o.code = 'octopus-complete-ccna' ORDER BY i.resource_type;

-- [4] Offerte gia' esistenti per le 5 certificazioni (atteso: solo CCST Networking
--     Dolphin+Complete e CCST Cybersecurity Dolphin; nessuna per ISC2 CC/EIPASS/ICDL).
SELECT c.slug, o.id, o.code, o.status, o.amount_minor, o.access_duration_days, o.stripe_price_id
  FROM certification_product_offers o JOIN certifications c ON c.id = o.certification_id
 WHERE c.slug IN ('isc2-cc','cisco-ccst-networking','cisco-ccst-cybersecurity','eipass','icdl')
 ORDER BY c.slug, o.code;

-- [5] Cosa contiene davvero ogni pass: domande, lab, scenari attivi per certificazione.
--     Le capability lab/scenario nel pass vengono aggiunte da 02-data.sql solo se > 0.
SELECT c.slug,
       (SELECT COUNT(*) FROM questions q JOIN topics t ON t.id = q.topic_id WHERE t.certification_id = c.id) AS domande,
       (SELECT COUNT(*) FROM lab_certifications lc WHERE lc.certification_id = c.id) AS lab,
       (SELECT COUNT(*) FROM scenarios sc JOIN topics t ON t.id = sc.topic_id
         WHERE t.certification_id = c.id AND sc.is_active = 1) AS scenari_attivi,
       (SELECT COUNT(*) FROM topic_review_pages r JOIN topics t ON t.id = r.topic_id
         WHERE t.certification_id = c.id) AS ripassi
  FROM certifications c
 WHERE c.slug IN ('isc2-cc','cisco-ccst-networking','cisco-ccst-cybersecurity','eipass','icdl')
 ORDER BY c.slug;

-- [6] Il prodotto Complete esiste (atteso: 1 riga, tier_rank 20).
SELECT id, code, version, tier_rank, is_active FROM catalog_products WHERE code = 'octopus-complete';

-- [7] Baseline per il confronto col postcheck.
SELECT (SELECT COUNT(*) FROM certification_product_offers) AS offers_total,
       (SELECT COUNT(*) FROM product_resource_inclusions) AS inclusions_total;
