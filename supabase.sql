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
-- let the website reach these tables (newer Supabase projects don't always do this by themselves)
grant usage on schema public to anon, authenticated;
grant select on public.ping to anon, authenticated;
grant select, insert, update, delete on public.profiles, public.favorites to authenticated;

-- ============ Player accounts, phase 1 (17 Nov 2026): My Roster, delete account, supporter flag, growth totals ============
-- Safe to run more than once. Nothing here changes or removes anyone's existing favorites.

-- My Roster: one row per player per character. Only that player can read or change their rows.
create table if not exists public.roster (
  user_id uuid not null references auth.users on delete cascade default auth.uid(),
  game text not null default 'genshin',
  char_id text not null,
  data jsonb not null default '{}'::jsonb,
  v int not null default 1,
  updated_at timestamptz not null default now(),
  primary key (user_id, game, char_id),
  constraint roster_game check (game ~ '^[a-z0-9-]{1,20}$'),
  constraint roster_char check (char_id ~ '^[a-z0-9-]{1,40}$'),
  constraint roster_size check (pg_column_size(data) < 6000)
);
alter table public.roster enable row level security;
drop policy if exists "own roster" on public.roster;
create policy "own roster" on public.roster for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
grant select, insert, update, delete on public.roster to authenticated;

-- the database sets the time of each save (a device can't fake it), and one player can't store more than 400 characters
create or replace function public.roster_guard() returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.updated_at := now();
  if tg_op = 'INSERT' and (select count(*) from public.roster where user_id = new.user_id) >= 400 then
    raise exception 'roster full';
  end if;
  return new;
end $$;
drop trigger if exists roster_guard on public.roster;
create trigger roster_guard before insert or update on public.roster for each row execute function public.roster_guard();

-- supporter flag for later (supporter badge / perks). Only you can switch it on, in Supabase > Table Editor > profiles.
alter table public.profiles add column if not exists supporter boolean not null default false;
revoke insert, update on public.profiles from authenticated;
grant insert (id, last_seen), update (id, last_seen) on public.profiles to authenticated;

-- "Delete my account": removes the sign-in and, through the links above, every saved row of that player
create or replace function public.delete_my_account() returns void language plpgsql security definer set search_path = public, auth as $$
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  delete from auth.users where id = auth.uid();
end $$;
revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;

-- My Teams (phase 2): saved teams, one row per team. Only that player can read or change them.
-- Sharing a team uses a Team Lab link (name, characters, constellations), so nothing here is ever public.
create table if not exists public.teams (
  user_id uuid not null references auth.users on delete cascade default auth.uid(),
  game text not null default 'genshin',
  id text not null,
  data jsonb not null default '{}'::jsonb,
  v int not null default 1,
  updated_at timestamptz not null default now(),
  primary key (user_id, game, id),
  constraint teams_game check (game ~ '^[a-z0-9-]{1,20}$'),
  constraint teams_id check (id ~ '^[a-z0-9]{6,24}$'),
  constraint teams_size check (pg_column_size(data) < 4000)
);
alter table public.teams enable row level security;
drop policy if exists "own teams" on public.teams;
create policy "own teams" on public.teams for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
grant select, insert, update, delete on public.teams to authenticated;
create or replace function public.teams_guard() returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.updated_at := now();
  if tg_op = 'INSERT' and (select count(*) from public.teams where user_id = new.user_id) >= 150 then
    raise exception 'too many teams';
  end if;
  return new;
end $$;
drop trigger if exists teams_guard on public.teams;
create trigger teams_guard before insert or update on public.teams for each row execute function public.teams_guard();

-- growth totals for the daily check and the Studio Growth meter: counts only, no emails, no names, no rosters.
-- Callable only with the service key (kept as a secret on the website Worker).
create or replace function public.pp_growth() returns json language sql security definer set search_path = public, auth as $$
  select json_build_object(
    'accounts',  (select count(*) from auth.users),
    'active30',  (select count(*) from public.profiles where last_seen > now() - interval '30 days'),
    'active7',   (select count(*) from public.profiles where last_seen > now() - interval '7 days'),
    'rosters',   (select count(distinct user_id) from public.roster),
    'teams',     (select count(*) from public.teams),
    'db_bytes',  pg_database_size(current_database()),
    'top_owned', (select coalesce(json_agg(t), '[]'::json) from (
                    select char_id, count(*) as n from public.roster where data->>'o' = '1'
                    group by char_id having count(*) >= 3 order by n desc limit 10) t)
  )
$$;
revoke all on function public.pp_growth() from public, anon, authenticated;
grant execute on function public.pp_growth() to service_role;
