-- Run this entire script once in the Supabase SQL Editor.
-- It creates the 25-spot signup table and gives anonymous website visitors
-- permission to VIEW and INSERT signups, but not edit or delete them.

create table if not exists public.office_pool_signups (
  spot integer primary key check (spot between 1 and 25),
  name text not null check (char_length(trim(name)) between 1 and 80),
  signed_up_at timestamptz not null default now()
);

alter table public.office_pool_signups enable row level security;

-- Re-running the file is safe: replace the policies if they already exist.
drop policy if exists "Public can view office pool signups" on public.office_pool_signups;
drop policy if exists "Public can claim an office pool spot" on public.office_pool_signups;

create policy "Public can view office pool signups"
on public.office_pool_signups
for select
to anon, authenticated
using (true);

create policy "Public can claim an office pool spot"
on public.office_pool_signups
for insert
to anon, authenticated
with check (
  spot between 1 and 25
  and char_length(trim(name)) between 1 and 80
);

grant select, insert on public.office_pool_signups to anon, authenticated;

-- No UPDATE or DELETE permission is granted to website visitors.
-- The primary key on `spot` guarantees that only one signup can own each number.

-- OPTIONAL ADMIN COMMANDS (run manually in Supabase SQL Editor):
-- Remove one signup:
-- delete from public.office_pool_signups where spot = 7;
--
-- Clear the entire pool:
-- truncate table public.office_pool_signups;
