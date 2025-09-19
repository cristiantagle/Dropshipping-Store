create extension if not exists "pgcrypto";

create table if not exists categorias (
  slug text primary key,
  nombre text not null,
  descripcion text,
  cover_url text
);

create table if not exists productos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  descripcion text,
  precio numeric(10,2) not null check (precio >= 0),
  imagen_url text,
  categoria_slug text not null references categorias(slug) on delete cascade,
  created_at timestamptz default now()
);

alter table categorias enable row level security;
alter table productos enable row level security;

do $$ begin
  create policy "categorias select public" on categorias for select using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "productos select public" on productos for select using (true);
exception when duplicate_object then null; end $$;

insert into categorias (slug,nombre,descripcion,cover_url) values
  ('hogar','Hogar','Todo para tu casa','https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=1200&auto=format&fit=crop'),
  ('belleza','Belleza','Cuidado personal','https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1200&auto=format&fit=crop'),
  ('tecnologia','Tecnología','Gadgets y más','https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop'),
  ('bienestar','Bienestar','Salud y fitness','https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop'),
  ('eco','Eco','Sustentable','https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?q=80&w=1200&auto=format&fit=crop'),
  ('mascotas','Mascotas','Amigos peludos','https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1200&auto=format&fit=crop')
on conflict (slug) do update set nombre=excluded.nombre;

-- 12 productos por categoría (mismos que te pasé antes) — HOGAR
insert into productos (nombre,descripcion,precio,imagen_url,categoria_slug) values
('Set de sábanas premium','Algodón 300 hilos',29990,'https://images.unsplash.com/photo-1582582429416-0ef9e483e90f?q=80&w=1200&auto=format&fit=crop','hogar'),
('Frazada térmica','Invierno sin frío',24990,'https://images.unsplash.com/photo-1549187774-b4e9b0445b41?q=80&w=1200&auto=format&fit=crop','hogar'),
('Lámpara minimal','LED cálida',15990,'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?q=80&w=1200&auto=format&fit=crop','hogar'),
('Organizador multiuso','3 niveles',12990,'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop','hogar'),
('Cortinas blackout','Par 140x220',34990,'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop','hogar'),
('Difusor aromático','Con temporizador',19990,'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop','hogar'),
('Almohadas memory','Pack 2',22990,'https://images.unsplash.com/photo-1505691723518-36a5ac3b2d26?q=80&w=1200&auto=format&fit=crop','hogar'),
('Set toallas hotel','6 piezas',27990,'https://images.unsplash.com/photo-1597143720585-3df7f3b07258?q=80&w=1200&auto=format&fit=crop','hogar'),
('Cubertería 24p','Acero inoxidable',21990,'https://images.unsplash.com/photo-1556912998-6a321dcae8e9?q=80&w=1200&auto=format&fit=crop','hogar'),
('Sartén antiadherente','28 cm',17990,'https://images.unsplash.com/photo-1617195737493-8c3b77e3b824?q=80&w=1200&auto=format&fit=crop','hogar'),
('Manta decorativa','Tejido suave',14990,'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop','hogar'),
('Porta especias','Gira 360°',9990,'https://images.unsplash.com/photo-1514511547117-f2f122bf6e16?q=80&w=1200&auto=format&fit=crop','hogar');

-- BELLEZA (12)
insert into productos (nombre,descripcion,precio,imagen_url,categoria_slug) values
('Secador iónico','Cabello sin frizz',32990,'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop','belleza'),
('Plancha de pelo','Cerámica pro',30990,'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop','belleza'),
('Cepillo alisador','2 en 1',21990,'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1200&auto=format&fit=crop','belleza'),
('Set skincare','Rutina diaria',25990,'https://images.unsplash.com/photo-1585238341307-867d33d5b4b2?q=80&w=1200&auto=format&fit=crop','belleza'),
('Espejo con luz','Aumento 5x',13990,'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop','belleza'),
('Rizador automático','Ondas perfectas',28990,'https://images.unsplash.com/photo-1622582691542-028f9b2585fa?q=80&w=1200&auto=format&fit=crop','belleza'),
('Brochas maquillaje','12 piezas',14990,'https://images.unsplash.com/photo-1526045612212-70caf35c14df?q=80&w=1200&auto=format&fit=crop','belleza'),
('Limpieza facial','Sónico',19990,'https://images.unsplash.com/photo-1585238341307-867d33d5b4b2?q=80&w=1200&auto=format&fit=crop','belleza'),
('Serum vitamina C','30ml',12990,'https://images.unsplash.com/photo-1622582691542-028f9b2585fa?q=80&w=1200&auto=format&fit=crop','belleza'),
('Mascarilla capilar','Nutritiva',9990,'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop','belleza'),
('Removedor maquillaje','Bifásico',7990,'https://images.unsplash.com/photo-1526045612212-70caf35c14df?q=80&w=1200&auto=format&fit=crop','belleza'),
('Organizador cosmético','Acrílico',8990,'https://images.unsplash.com/photo-1585238341307-867d33d5b4b2?q=80&w=1200&auto=format&fit=crop','belleza');

-- TECNOLOGÍA (12)
insert into productos (nombre,descripcion,precio,imagen_url,categoria_slug) values
('Audífonos BT','Cancelación ruido',39990,'https://images.unsplash.com/photo-1518443881170-2f772ce10544?q=80&w=1200&auto=format&fit=crop','tecnologia'),
('Cargador 65W','GaN USB-C',19990,'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?q=80&w=1200&auto=format&fit=crop','tecnologia'),
('Teclado mecánico','RGB',29990,'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop','tecnologia'),
('Mouse inalámbrico','Silencioso',12990,'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop','tecnologia'),
('Power bank','20.000 mAh',24990,'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?q=80&w=1200&auto=format&fit=crop','tecnologia'),
('Hub USB-C','7 en 1',22990,'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop','tecnologia'),
('Webcam HD','1080p',18990,'https://images.unsplash.com/photo-1627856014754-596103db973e?q=80&w=1200&auto=format&fit=crop','tecnologia'),
('SSD portátil','1TB',69990,'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop','tecnologia'),
('Parlante BT','IPX7',24990,'https://images.unsplash.com/photo-1518443881170-2f772ce10544?q=80&w=1200&auto=format&fit=crop','tecnologia'),
('Cable trenzado','USB-C 100W',5990,'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?q=80&w=1200&auto=format&fit=crop','tecnologia'),
('Tablet 10"','64GB',119990,'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop','tecnologia'),
('Soporte notebook','Aluminio',14990,'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop','tecnologia');

-- BIENESTAR (12)
insert into productos (nombre,descripcion,precio,imagen_url,categoria_slug) values
('Banda elástica resistencia','Entrenamiento en casa',7990,'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop','bienestar'),
('Mancuernas 2x5kg','Revestidas',24990,'https://images.unsplash.com/photo-1546484959-f9a53db89aee?q=80&w=1200&auto=format&fit=crop','bienestar'),
('Colchoneta yoga','Antideslizante',12990,'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1200&auto=format&fit=crop','bienestar'),
('Botella térmica','Acero 750ml',9990,'https://images.unsplash.com/photo-1542736667-069246bdbc74?q=80&w=1200&auto=format&fit=crop','bienestar'),
('Masajeador cervical','Portátil',29990,'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1200&auto=format&fit=crop','bienestar'),
('Báscula inteligente','BMI',19990,'https://images.unsplash.com/photo-1575311373937-133c12bd8d78?q=80&w=1200&auto=format&fit=crop','bienestar'),
('Soga de saltar','Acero ajustable',7990,'https://images.unsplash.com/photo-1583454110551-21e438d3c9c4?q=80&w=1200&auto=format&fit=crop','bienestar'),
('Rodillo foam','Recuperación',14990,'https://images.unsplash.com/photo-1580130718644-4615e8fa2b49?q=80&w=1200&auto=format&fit=crop','bienestar'),
('Banda tela','Glúteos',8990,'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop','bienestar'),
('Esterilla pilates','Gruesa',13990,'https://images.unsplash.com/photo-1542736667-069246bdbc74?q=80&w=1200&auto=format&fit=crop','bienestar'),
('Proteína whey','1kg vainilla',34990,'https://images.unsplash.com/photo-1585238341307-867d33d5b4b2?q=80&w=1200&auto=format&fit=crop','bienestar'),
('Elastiband pro','Alta resistencia',9990,'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop','bienestar');

-- ECO (12) y MASCOTAS (12)… (idénticos a los anteriores bloques que te pasé)
insert into productos (nombre,descripcion,precio,imagen_url,categoria_slug) values
('Bolsas reutilizables','Set 10',6990,'https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?q=80&w=1200&auto=format&fit=crop','eco'),
('Cepillo bambú','Pack 4',5990,'https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?q=80&w=1200&auto=format&fit=crop','eco'),
('Bombillas acero','Pack 8',4990,'https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?q=80&w=1200&auto=format&fit=crop','eco'),
('Compostera balcón','20L',24990,'https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?q=80&w=1200&auto=format&fit=crop','eco'),
('Detergente eco','3L',13990,'https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?q=80&w=1200&auto=format&fit=crop','eco'),
('Filtro agua','Carbón activado',16990,'https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?q=80&w=1200&auto=format&fit=crop','eco'),
('Bolsa malla','Frutas',2990,'https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?q=80&w=1200&auto=format&fit=crop','eco'),
('Termo eco','500ml',12990,'https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?q=80&w=1200&auto=format&fit=crop','eco'),
('Shampoo sólido','Aloe',7990,'https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?q=80&w=1200&auto=format&fit=crop','eco'),
('Jabón natural','Lavanda',4990,'https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?q=80&w=1200&auto=format&fit=crop','eco'),
('Papel reciclado','12 rollos',10990,'https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?q=80&w=1200&auto=format&fit=crop','eco'),
('Cuchillos bambú','Picnic',8990,'https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?q=80&w=1200&auto=format&fit=crop','eco');

insert into productos (nombre,descripcion,precio,imagen_url,categoria_slug) values
('Cama perro','Mediana',24990,'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1200&auto=format&fit=crop','mascotas'),
('Rascador gato','Con juguete',19990,'https://images.unsplash.com/photo-1574158622682-e40e69881006?q=80&w=1200&auto=format&fit=crop','mascotas'),
('Plato antideslizante','Acero',7990,'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1200&auto=format&fit=crop','mascotas'),
('Arnés reflectante','Talla M',12990,'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1200&auto=format&fit=crop','mascotas'),
('Peluche mordedor','Squeak',5990,'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1200&auto=format&fit=crop','mascotas'),
('Dispensador agua','Automático',14990,'https://images.unsplash.com/photo-1574158622682-e40e69881006?q=80&w=1200&auto=format&fit=crop','mascotas'),
('Arenero cerrado','Filtro carbón',23990,'https://images.unsplash.com/photo-1574158622682-e40e69881006?q=80&w=1200&auto=format&fit=crop','mascotas'),
('Cortauñas','Seguro',4990,'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1200&auto=format&fit=crop','mascotas'),
('Correa extensible','5m',6990,'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1200&auto=format&fit=crop','mascotas'),
('Cubre asientos auto','Impermeable',17990,'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1200&auto=format&fit=crop','mascotas'),
('Juguete lanzar','Pelota',6990,'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1200&auto=format&fit=crop','mascotas'),
('Fuente agua','USB',18990,'https://images.unsplash.com/photo-1574158622682-e40e69881006?q=80&w=1200&auto=format&fit=crop','mascotas');
