-- PawPixl fan accounts. Paste this whole file into Supabase > SQL Editor > Run.
-- Each fan can only ever read or change their own rows (row level security).
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  last_seen timestamptz default now()
);
create table if not exists public.favorites (
  user_id uuid not null references auth.users on delete cascade default auth.uid(),
  game text not null, kind text not null, key text not null,
  created_at timestamptz default now(),
  primary key (user_id, game, kind, key)
);
alter table public.profiles enable row level security;
alter table public.favorites enable row level security;
drop policy if exists "own profile" on public.profiles;
create policy "own profile" on public.profiles for all
  using (auth.uid() = id) with check (auth.uid() = id);
drop policy if exists "own favorites" on public.favorites;
create policy "own favorites" on public.favorites for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
-- tiny table the keep-awake job pings so the free project never pauses
create table if not exists public.ping (id int primary key, at timestamptz default now());
insert into public.ping (id) values (1) on conflict do nothing;
alter table public.ping enable row level security;
drop policy if exists "anyone can read ping" on public.ping;
create policy "anyone can read ping" on public.ping for select using (true);
