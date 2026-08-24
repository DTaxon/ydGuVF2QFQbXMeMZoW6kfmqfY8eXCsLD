-- Run this entire script in the Supabase SQL Editor.
--
-- It creates/updates the 25-spot signup table and gives the public website
-- permission to VIEW, INSERT, UPDATE, and DELETE signups.
--
-- IMPORTANT SECURITY NOTE:
-- The admin password is checked in config.js/app.js on the GitHub Pages site.
-- GitHub Pages is public, so this is only a convenience gate for a low-risk
-- office pool. A technically knowledgeable visitor can inspect the site and
-- bypass that client-side check. Do not use this pattern for sensitive data.

create table if not exists public.office_pool_signups (
  spot integer primary key check (spot between 1 and 25),
  name text not null check (char_length(trim(name)) between 1 and 80),
  signed_up_at timestamptz not null default now()
);

alter table public.office_pool_signups enable row level security;

-- Re-running this file is safe: replace the policies if they already exist.
drop policy if exists "Public can view office pool signups" on public.office_pool_signups;
drop policy if exists "Public can claim an office pool spot" on public.office_pool_signups;
drop policy if exists "Website can update office pool signups" on public.office_pool_signups;
drop policy if exists "Website can delete office pool signups" on public.office_pool_signups;

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

create policy "Website can update office pool signups"
on public.office_pool_signups
for update
to anon, authenticated
using (true)
with check (
  spot between 1 and 25
  and char_length(trim(name)) between 1 and 80
);

create policy "Website can delete office pool signups"
on public.office_pool_signups
for delete
to anon, authenticated
using (true);

grant select, insert, update, delete on public.office_pool_signups to anon, authenticated;

-- The primary key on `spot` still guarantees that only one signup can own
-- each numbered spot.
