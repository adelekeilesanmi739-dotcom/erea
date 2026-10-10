-- Run this AFTER your existing schema.sql

create table if not exists public.vip_purchases (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 vip_level integer not null check (vip_level between 1 and 6),
 amount numeric(12,2) not null check (amount > 0),
 status text not null default 'pending' check (status in ('pending','success','failed')),
 reference text not null unique,
 provider text not null default 'paystack',
 provider_transaction_id text,
 metadata jsonb not null default '{}'::jsonb,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);

alter table public.vip_purchases enable row level security;
drop policy if exists "Users can view own VIP purchases" on public.vip_purchases;
create policy "Users can view own VIP purchases"
on public.vip_purchases for select to authenticated
using (auth.uid() = user_id);

create or replace function public.fulfill_vip(
  p_reference text,
  p_provider_transaction_id text
) returns boolean
language plpgsql
security definer
set search_path=public
as $$
declare
  purchase public.vip_purchases%rowtype;
begin
  select * into purchase
  from public.vip_purchases
  where reference = p_reference
  for update;

  if not found then
    return false;
  end if;

  if purchase.status = 'success' then
    return true;
  end if;

  update public.profiles
  set vip_level = greatest(coalesce(vip_level, 0), purchase.vip_level)
  where id = purchase.user_id;

  update public.vip_purchases
  set status = 'success',
      provider_transaction_id = p_provider_transaction_id,
      updated_at = now()
  where id = purchase.id;

  return true;
end;
$$;

revoke all on function public.fulfill_vip(text,text)
from public, anon, authenticated;
