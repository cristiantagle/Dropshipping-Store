-- Store OAuth tokens for AliExpress (single row)
create table if not exists public.aliexpress_tokens (
  id int primary key default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  access_token text,
  refresh_token text,
  expires_at timestamptz,
  scope text,
  user_id text
);

alter table public.aliexpress_tokens enable row level security;
-- Deny anon by default; service-role bypasses RLS
