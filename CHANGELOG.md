## [20250924-073045] Preview branch preview/lunaria-clean-productos-20250924-073045

- Limpieza global: eliminado 'productos' de todo el repo
- lib/products.ts ahora exporta Producto + getProducts con supabaseClient
- ProductListClient usa Producto y categorySlug
- Carro depende solo de localStorage, sin mocks
- Categorías usan <ProductListClient categorySlug={slug} />

