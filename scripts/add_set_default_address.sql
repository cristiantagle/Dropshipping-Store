-- Optional helper RPC to set default address atomically
create or replace function public.set_default_address(addr_id uuid)
returns void
language plpgsql
security definer
as $$
declare
  uid uuid;
  target_user uuid;
begin
  uid := auth.uid();
  select user_id into target_user from public.user_addresses where id = addr_id;
  if target_user is null then
    raise exception 'address not found';
  end if;
  if uid is distinct from target_user then
    raise exception 'permission denied';
  end if;
  update public.user_addresses set is_default = false where user_id = target_user;
  update public.user_addresses set is_default = true where id = addr_id;
end;
$$;

revoke all on function public.set_default_address(uuid) from public;
grant execute on function public.set_default_address(uuid) to authenticated;

