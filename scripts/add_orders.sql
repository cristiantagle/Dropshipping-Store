-- Orders and addresses schema for Lunaria
-- Run in Supabase SQL editor once (requires service role for RLS maintenance)

-- Enable pgcrypto for gen_random_uuid in case it's not enabled (Supabase usually has it)
create extension if not exists pgcrypto;

-- Addresses
create table if not exists public.user_addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  full_name text,
  line1 text not null,
  line2 text,
  city text not null,
  region text,
  postal_code text,
  country text not null,
  phone text,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_addresses_user_idx on public.user_addresses(user_id);

alter table public.user_addresses enable row level security;
drop policy if exists user_addresses_select on public.user_addresses;
drop policy if exists user_addresses_mutate on public.user_addresses;

create policy user_addresses_select on public.user_addresses for select
  to authenticated
  using (auth.uid() = user_id);

create policy user_addresses_mutate on public.user_addresses for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  email text,
  status text not null default 'pending', -- pending | approved | rejected | refunded
  currency text default 'CLP',
  total_cents integer not null default 0,
  mp_preference_id text,
  mp_payment_id text,
  address_id uuid references public.user_addresses(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_user_idx on public.orders(user_id);
create index if not exists orders_payment_idx on public.orders(mp_payment_id);
create index if not exists orders_pref_idx on public.orders(mp_preference_id);

alter table public.orders enable row level security;
drop policy if exists orders_select_own on public.orders;
drop policy if exists orders_insert_own on public.orders;

create policy orders_select_own on public.orders for select
  to authenticated
  using (user_id is not distinct from auth.uid());

-- Allow client-side creation when user is logged (guest orders should be created via server/webhook)
create policy orders_insert_own on public.orders for insert
  to authenticated
  with check (user_id is not distinct from auth.uid());

-- Order items
create table if not exists public.order_items (
  id bigserial primary key,
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid,
  title text not null,
  quantity integer not null check (quantity > 0),
  unit_price_cents integer not null check (unit_price_cents >= 0),
  image_url text
);

create index if not exists order_items_order_idx on public.order_items(order_id);

alter table public.order_items enable row level security;
drop policy if exists order_items_select_own on public.order_items;
drop policy if exists order_items_insert_own on public.order_items;

create policy order_items_select_own on public.order_items for select
  to authenticated
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (o.user_id is not distinct from auth.uid())
    )
  );

create policy order_items_insert_own on public.order_items for insert
  to authenticated
  with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (o.user_id is not distinct from auth.uid())
    )
  );

-- Optional: raw MP events audit
create table if not exists public.mp_events (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  topic text,
  type text,
  data jsonb
);

alter table public.mp_events enable row level security;
drop policy if exists mp_events_read on public.mp_events;
create policy mp_events_read on public.mp_events for select to authenticated using (false);

