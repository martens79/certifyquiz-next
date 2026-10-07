-- ============================================================================
-- Complete Pass 90 giorni — 02 DATI
-- Eseguire SOLO dopo aver letto il precheck (01). Crea le offerte "Complete" a
-- 90 giorni per ISC2 CC, CCST Cybersecurity, ICDL, EIPASS.
--
-- SICUREZZA: le offerte nascono 'inactive' e senza stripe_price_id: NESSUNA
-- vendita parte finche' non esegui 04-activate.sql. Idempotente: gli INSERT
-- saltano cio' che esiste gia'. Non modifica offerte esistenti.
--
-- PREZZO: di default eguale a CCNA Complete (letto dal DB). Per cambiarlo per
-- una certificazione, sostituire NULL con l'importo in centesimi (es. 1990).
-- Il price Stripe che creerai dopo deve avere LO STESSO importo: il webhook
-- confronta l'importo pagato con l'ordine e rifiuta la concessione se diverso.
-- ============================================================================

SET @duration_days := 90;
SET @price_default := (SELECT amount_minor FROM certification_product_offers
                        WHERE code = 'octopus-complete-ccna' AND version = 1 LIMIT 1);

DROP TEMPORARY TABLE IF EXISTS pass_seed;
CREATE TEMPORARY TABLE pass_seed (
  cert_slug  VARCHAR(191) NOT NULL PRIMARY KEY,
  price_minor INT UNSIGNED NULL,
  with_guide TINYINT NOT NULL,   -- esiste la guida PDF
  with_map   TINYINT NOT NULL    -- esistono le mappe concettuali PDF
);
INSERT INTO pass_seed (cert_slug, price_minor, with_guide, with_map) VALUES
  ('isc2-cc',                  NULL, 1, 1),
  ('cisco-ccst-cybersecurity', NULL, 1, 1),
  ('icdl',                     NULL, 1, 1),
  ('eipass',                   NULL, 0, 0);   -- nessuna guida/mappa nel catalogo PDF
UPDATE pass_seed SET price_minor = COALESCE(price_minor, @price_default);

SELECT 'prezzo di default (centesimi)' AS info, @price_default AS valore;

START TRANSACTION;

-- [1] Offerte (una per certificazione, inactive, a 90 giorni).
INSERT INTO certification_product_offers
       (product_id, certification_id, code, currency, amount_minor, access_duration_days, version, status)
SELECT p.id, c.id, CONCAT('octopus-complete-', c.slug), 'EUR', s.price_minor, @duration_days, 1, 'inactive'
  FROM pass_seed s
  JOIN certifications c ON c.slug = s.cert_slug
  JOIN catalog_products p ON p.code = 'octopus-complete' AND p.version = 1
 WHERE s.price_minor IS NOT NULL
   AND NOT EXISTS (SELECT 1 FROM certification_product_offers o
                    WHERE o.product_id = p.id AND o.certification_id = c.id
                      AND o.version = 1 AND o.currency = 'EUR');

-- [2] Capability di base (le 7 del Complete CCNA che non dipendono dai contenuti).
INSERT IGNORE INTO product_resource_inclusions (offer_id, resource_type, resource_scope, resource_key, access_level)
SELECT o.id, t.resource_type, 'certification', '*', 'full'
  FROM pass_seed s
  JOIN certifications c ON c.slug = s.cert_slug
  JOIN certification_product_offers o ON o.certification_id = c.id
       AND o.code = CONCAT('octopus-complete-', c.slug) AND o.version = 1
  JOIN (SELECT 'quiz' AS resource_type UNION ALL SELECT 'explanation' UNION ALL SELECT 'exam_mode'
        UNION ALL SELECT 'progress' UNION ALL SELECT 'review' UNION ALL SELECT 'mistake_review'
        UNION ALL SELECT 'mock_review') t;

-- [3] Guida e mappe: solo dove il PDF esiste.
INSERT IGNORE INTO product_resource_inclusions (offer_id, resource_type, resource_scope, resource_key, access_level)
SELECT o.id, 'guide', 'certification', '*', 'full'
  FROM pass_seed s JOIN certifications c ON c.slug = s.cert_slug
  JOIN certification_product_offers o ON o.certification_id = c.id
       AND o.code = CONCAT('octopus-complete-', c.slug) AND o.version = 1
 WHERE s.with_guide = 1;

INSERT IGNORE INTO product_resource_inclusions (offer_id, resource_type, resource_scope, resource_key, access_level)
SELECT o.id, 'map', 'certification', '*', 'full'
  FROM pass_seed s JOIN certifications c ON c.slug = s.cert_slug
  JOIN certification_product_offers o ON o.certification_id = c.id
       AND o.code = CONCAT('octopus-complete-', c.slug) AND o.version = 1
 WHERE s.with_map = 1;

-- [4] Lab e scenari: solo se la certificazione ne ha davvero.
INSERT IGNORE INTO product_resource_inclusions (offer_id, resource_type, resource_scope, resource_key, access_level)
SELECT o.id, 'lab', 'certification', '*', 'full'
  FROM pass_seed s JOIN certifications c ON c.slug = s.cert_slug
  JOIN certification_product_offers o ON o.certification_id = c.id
       AND o.code = CONCAT('octopus-complete-', c.slug) AND o.version = 1
 WHERE EXISTS (SELECT 1 FROM lab_certifications lc WHERE lc.certification_id = c.id);

INSERT IGNORE INTO product_resource_inclusions (offer_id, resource_type, resource_scope, resource_key, access_level)
SELECT o.id, 'scenario', 'certification', '*', 'full'
  FROM pass_seed s JOIN certifications c ON c.slug = s.cert_slug
  JOIN certification_product_offers o ON o.certification_id = c.id
       AND o.code = CONCAT('octopus-complete-', c.slug) AND o.version = 1
 WHERE EXISTS (SELECT 1 FROM scenarios sc JOIN topics t ON t.id = sc.topic_id
                WHERE t.certification_id = c.id AND sc.is_active = 1);

-- Verifica DENTRO la transazione: una riga per offerta, durata 90, status inactive,
-- nessuno stripe_price_id, capability = 7 + guida/mappe/lab/scenari dove presenti.
SELECT o.code, o.status, o.amount_minor, o.access_duration_days, o.stripe_price_id,
       COUNT(i.id) AS capability, GROUP_CONCAT(i.resource_type ORDER BY i.resource_type) AS tipi
  FROM certification_product_offers o
  LEFT JOIN product_resource_inclusions i ON i.offer_id = o.id
 WHERE o.code IN ('octopus-complete-isc2-cc','octopus-complete-cisco-ccst-cybersecurity',
                  'octopus-complete-icdl','octopus-complete-eipass')
 GROUP BY o.id ORDER BY o.code;

-- Se corretto:
COMMIT;
-- Altrimenti: ROLLBACK; (al posto del COMMIT, prima di chiudere la sessione).
