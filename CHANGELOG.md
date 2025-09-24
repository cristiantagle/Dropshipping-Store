## [20250924-154307] Preview branch preview/lunaria-carro-supabase-fixed-20250924-154307

- Reescrito app/carro/page.tsx con import correcto desde '@/lib/supabase/client'
- Usa Producto desde '@/lib/products' y fetch real con supabase.from('productos')
- Eliminado import roto anterior

