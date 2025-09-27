update categorias set imagen_url = 'https://iowpylofmfzlbvlhlqih.supabase.co/storage/v1/object/public/branding/categorias/hogar.svg'
where slug = 'hogar';

update categorias set imagen_url = 'https://iowpylofmfzlbvlhlqih.supabase.co/storage/v1/object/public/branding/categorias/belleza.svg'
where slug = 'belleza';

update categorias set imagen_url = 'https://iowpylofmfzlbvlhlqih.supabase.co/storage/v1/object/public/branding/categorias/bienestar.svg'
where slug = 'bienestar';

update categorias set imagen_url = 'https://iowpylofmfzlbvlhlqih.supabase.co/storage/v1/object/public/branding/categorias/eco.svg'
where slug = 'eco';

update categorias set imagen_url = 'https://iowpylofmfzlbvlhlqih.supabase.co/storage/v1/object/public/branding/categorias/tecnologia.svg'
where slug = 'tecnologia';

insert into categorias (slug, nombre, descripcion, imagen_url)
values (
  'mascotas',
  'Mascotas',
  'Accesorios y cuidado animal',
  'https://iowpylofmfzlbvlhlqih.supabase.co/storage/v1/object/public/branding/categorias/mascotas.svg'
)
on conflict (slug) do update set imagen_url = excluded.imagen_url;
