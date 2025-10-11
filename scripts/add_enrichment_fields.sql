-- 🎨 AGREGAR CAMPOS DE ENRIQUECIMIENTO A LA TABLA PRODUCTS
-- Estos campos almacenarán la información enriquecida generada por IA

-- Campos de contenido enriquecido
ALTER TABLE products ADD COLUMN IF NOT EXISTS marketing_copy TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS technical_specs JSONB;
ALTER TABLE products ADD COLUMN IF NOT EXISTS key_features JSONB;
ALTER TABLE products ADD COLUMN IF NOT EXISTS seo_keywords TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS target_audience TEXT;

-- Campos de metadatos de enriquecimiento
ALTER TABLE products ADD COLUMN IF NOT EXISTS enriched_at TIMESTAMPTZ;
ALTER TABLE products ADD COLUMN IF NOT EXISTS enrichment_version TEXT;

-- Índices para búsquedas eficientes
CREATE INDEX IF NOT EXISTS idx_products_enriched ON products(enriched_at);
CREATE INDEX IF NOT EXISTS idx_products_target_audience ON products(target_audience);
CREATE INDEX IF NOT EXISTS idx_products_seo_keywords ON products USING gin(to_tsvector('spanish', seo_keywords));

-- Comentarios para documentación
COMMENT ON COLUMN products.marketing_copy IS 'Copy de marketing generado por IA';
COMMENT ON COLUMN products.technical_specs IS 'Especificaciones técnicas en formato JSON';
COMMENT ON COLUMN products.key_features IS 'Características clave en formato JSON array';
COMMENT ON COLUMN products.seo_keywords IS 'Keywords SEO separadas por comas';
COMMENT ON COLUMN products.target_audience IS 'Audiencia objetivo inferida';
COMMENT ON COLUMN products.enriched_at IS 'Timestamp de cuando fue enriquecido';
COMMENT ON COLUMN products.enrichment_version IS 'Versión del sistema de enriquecimiento utilizado';