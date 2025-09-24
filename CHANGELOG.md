## [20250924-154713] Preview branch preview/lunaria-carro-supabase-cleanfix-20250924-154713

- Fix limpio: carro/page.tsx usa solo campos válidos del tipo Producto
- Eliminado uso de campos inexistentes (image, imagen_url, etc.)
- Render seguro con p.imagen || ""

