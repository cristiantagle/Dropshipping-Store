-- Create table to store AliExpress push/webhook events
create table if not exists public.ae_push_events (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  received_at timestamptz,
  received_path text,
  event jsonb
);

-- RLS optional: keep disabled; writes go through service role only
alter table public.ae_push_events enable row level security;

-- Simple policy: allow no anon writes/reads; service role bypasses RLS
drop policy if exists ae_push_events_read on public.ae_push_events;
create policy ae_push_events_read on public.ae_push_events for select to authenticated using (false);
