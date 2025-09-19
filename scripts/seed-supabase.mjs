import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL || !SERVICE) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const sb = createClient(URL, SERVICE, { auth: { persistSession: false } });

const CATS = [
  { slug:'hogar', nombre:'Hogar', descripcion:'Cocina, orden, organización', imagen_url:'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop' },
  { slug:'belleza', nombre:'Belleza', descripcion:'Maquillaje y cuidado personal', imagen_url:'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1200&auto=format&fit=crop' },
  { slug:'tecnologia', nombre:'Tecnología', descripcion:'Accesorios tech y oficina', imagen_url:'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop' },
  { slug:'bienestar', nombre:'Bienestar', descripcion:'Fitness, descanso y salud', imagen_url:'https://images.unsplash.com/photo-1517836357463-d25dfeac8d58?q=80&w=1200&auto=format&fit=crop' },
  { slug:'eco', nombre:'Eco', descripcion:'Sustentables y reutilizables', imagen_url:'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1200&auto=format&fit=crop' },
  { slug:'mascotas', nombre:'Mascotas', descripcion:'Juguetes y accesorios', imagen_url:'https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=1200&auto=format&fit=crop' },
];

const IMG_BY = {
  hogar: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop',
  belleza: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1200&auto=format&fit=crop',
  tecnologia: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
  bienestar: 'https://images.unsplash.com/photo-1517836357463-d25dfeac8d58?q=80&w=1200&auto=format&fit=crop',
  eco: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1200&auto=format&fit=crop',
  mascotas: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=1200&auto=format&fit=crop',
};

function mkProducts(slug){
  const arr=[];
  for(let i=1;i<=12;i++){
    const precio = 4990 + i*500;
    arr.push({
      id: `${slug}-${String(i).padStart(2,'0')}`,
      nombre: `${slug[0].toUpperCase()+slug.slice(1)} producto ${i}`,
      precio,
      imagen_url: IMG_BY[slug],
      envio: i%3===0 ? 'Rápido (stock local)' : (i%2===0 ? 'Importado (Premium)' : 'Importado (Estándar)'),
      destacado: i%5===0,
      categoria_slug: slug
    });
  }
  return arr;
}

async function main(){
  // Upsert categorías
  const { error: e1 } = await sb.from('categorias').upsert(CATS, { onConflict:'slug' });
  if(e1){ console.error('Error categorías:', e1); process.exit(1); }

  // Upsert productos (12 por cat)
  const all=[];
  for(const c of CATS){ all.push(...mkProducts(c.slug)); }

  // batch insert (para no exceder payloads)
  for(let i=0;i<all.length;i+=50){
    const chunk = all.slice(i,i+50);
    const { error } = await sb.from('productos').upsert(chunk, { onConflict:'id' });
    if(error){ console.error('Error productos:', error); process.exit(1); }
  }

  console.log('Seed OK: categorias + 12 productos por categoría');
}
main().catch(err=>{ console.error(err); process.exit(1); });
