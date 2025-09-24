## [20250924-152633] Preview branch preview/lunaria-fix-carro-supabase-20250924-152633

- Reescrito app/carro/page.tsx para consumir productos desde Supabase
- Eliminado import roto de 'productos' desde lib/products
- Usa Producto desde '@/lib/products' y fetch real con supabase.from('productos')

