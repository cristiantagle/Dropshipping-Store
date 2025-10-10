import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Env check:', {
  NEXT_PUBLIC_SUPABASE_URL: url,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: key ? key.slice(0, 6) + '...' : null,
});

if (!url || !key) {
  console.error('❌ Faltan variables de entorno.');
  process.exit(1);
}

const supabase = createClient(url, key);
const table = 'products';

try {
  const { count, error: countErr } = await supabase
    .from(table)
    .select('id', { count: 'exact', head: true });
  if (countErr) throw countErr;
  console.log(`✅ Tabla "${table}" count:`, count);

  const { data, error } = await supabase
    .from(table)
    .select('*')
    .limit(5);
  if (error) throw error;
  console.log('📦 Sample rows:', data);

  const required = ['id', 'nombre', 'precio', 'imagen', 'categoria', 'envio'];
  const missing = new Set(required);
  if (data && data.length > 0) {
    const cols = Object.keys(data[0] ?? {});
    for (const r of required) if (cols.includes(r)) missing.delete(r);
    console.log('🧩 Columns present:', cols);
    console.log('🚨 Missing required:', Array.from(missing));
  } else {
    console.log('⚠️ No hay filas para inferir columnas.');
  }
} catch (e) {
  console.error('❌ Supabase error:', e?.message ?? e);
  process.exit(1);
}
