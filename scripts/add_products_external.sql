-- External product link/store for enrichment sources (AliExpress, etc.)
create table if not exists public.products_external (
  id bigserial primary key,
  product_id uuid not null references public.products(id) on delete cascade,
  source text not null, -- e.g., 'aliexpress'
  external_id text,
  url text,
  title text,
  rating numeric,
  price numeric,
  currency text,
  store text,
  orders numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_external_product_id_idx on public.products_external(product_id);
create unique index if not exists products_external_unique_src on public.products_external(product_id, source);

alter table public.products_external enable row level security;
-- Disallow anon reads/writes by default (service-role bypasses RLS)
drop policy if exists products_external_read on public.products_external;
create policy products_external_read on public.products_external for select to authenticated using (false);

