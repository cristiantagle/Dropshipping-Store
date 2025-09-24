## [20250924-153901] Preview branch preview/lunaria-carro-supabase-20250924-153901

- Reescrito app/carro/page.tsx para consumir productos desde Supabase
- Eliminado import roto de 'productos' desde lib/products
- Usa Producto desde '@/lib/products' y fetch real con supabase.from('productos')

