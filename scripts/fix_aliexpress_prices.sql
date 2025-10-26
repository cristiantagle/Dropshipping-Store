-- Fix AE imported products: normalize products.price_cents to base cents (no markup)
-- Source-of-truth is products_external.price (CLP pesos) captured by the extension

-- 1) Preview how many rows will change
SELECT COUNT(*) AS rows_to_update
FROM products p
JOIN products_external pe ON pe.product_id = p.id
WHERE pe.source = 'aliexpress'
  AND pe.price IS NOT NULL AND pe.price > 0
  AND (p.price_cents IS NULL OR p.price_cents <> ROUND(pe.price * 100));

-- 2) Update: set price_cents = round(price_pe * 100)
BEGIN;
UPDATE products p
SET price_cents = ROUND(pe.price * 100)
FROM products_external pe
WHERE pe.product_id = p.id
  AND pe.source = 'aliexpress'
  AND pe.price IS NOT NULL AND pe.price > 0
  AND (p.price_cents IS NULL OR p.price_cents <> ROUND(pe.price * 100));
COMMIT;

-- 3) Verify no pending rows remain
SELECT COUNT(*) AS remaining_after_update
FROM products p
JOIN products_external pe ON pe.product_id = p.id
WHERE pe.source = 'aliexpress'
  AND pe.price IS NOT NULL AND pe.price > 0
  AND (p.price_cents IS NULL OR p.price_cents <> ROUND(pe.price * 100));

