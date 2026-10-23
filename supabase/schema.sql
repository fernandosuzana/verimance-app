-- Verimance database. Run once in Supabase: SQL Editor > New query > paste > Run.
-- Every table has Row Level Security: members only ever see their own conversations.

create extension if not exists pgcrypto;

-- ---------- profiles ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  age int check (age between 18 and 110),
  city text not null default '',
  gender text not null default 'w' check (gender in ('w','m','nb')),
  seeking text not null default 'all' check (seeking in ('w','m','all')),
  intent text not null default 'serious' check (intent in ('serious','companion','friends')),
  bio text not null default '' check (char_length(bio) <= 600),
  photo_url text,
  lang text not null default 'en' check (lang in ('en','fr','pt')),
  community_visible boolean not null default true,
  -- fields below are managed by Verimance only (members cannot change them)
  verification text not null default 'none' check (verification in ('none','pending','verified','rejected')),
  trust int not null default 70 check (trust between 0 and 100),
  role text not null default 'member' check (role in ('member','admin')),
  status text not null default 'active' check (status in ('active','restricted','removed')),
  plan text not null default 'trial' check (plan in ('free','trial','plus')),
  plan_ends timestamptz not null default (now() + interval '14 days'),
  stripe_customer text,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, lang)
  values (new.id, coalesce(new.raw_user_meta_data->>'name',''), coalesce(new.raw_user_meta_data->>'lang','en'))
  on conflict (id) do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
drop policy if exists "read own or visible verified" on public.profiles;
create policy "read own or visible verified" on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_admin()
         or (status = 'active' and verification = 'verified' and community_visible));
drop policy if exists "update own" on public.profiles;
create policy "update own" on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());
-- members may only edit these columns
revoke update on public.profiles from authenticated;
grant update (name, age, city, gender, seeking, intent, bio, photo_url, lang, community_visible) on public.profiles to authenticated;

-- ---------- blocks ----------
create table if not exists public.blocks (
  blocker uuid references public.profiles(id) on delete cascade,
  blocked uuid references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker, blocked)
);
alter table public.blocks enable row level security;
drop policy if exists "own blocks" on public.blocks;
create policy "own blocks" on public.blocks for all to authenticated
  using (blocker = auth.uid()) with check (blocker = auth.uid());

-- ---------- conversations & messages ----------
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_a uuid not null references public.profiles(id) on delete cascade,
  user_b uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  last_message_at timestamptz not null default now(),
  last_message text not null default '',
  check (user_a < user_b),
  unique (user_a, user_b)
);
create table if not exists public.messages (
  id bigint generated always as identity primary key,
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index if not exists messages_conv_idx on public.messages (conversation_id, created_at);

create or replace function public.in_conversation(c uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.conversations where id = c and auth.uid() in (user_a, user_b));
$$;

alter table public.conversations enable row level security;
drop policy if exists "participants read" on public.conversations;
create policy "participants read" on public.conversations for select to authenticated
  using (auth.uid() in (user_a, user_b));
alter table public.messages enable row level security;
drop policy if exists "participants read messages" on public.messages;
create policy "participants read messages" on public.messages for select to authenticated
  using (public.in_conversation(conversation_id));
-- messages and conversations are written only by the server (so Guardian can analyze each one)

-- ---------- Guardian alerts ----------
create table if not exists public.guardian_alerts (
  id bigint generated always as identity primary key,
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  level text not null check (level in ('safe','caution','high','critical')),
  risk int not null,
  stage text not null default 'none',
  signals jsonb not null default '[]',
  advice text not null default '',
  engine text not null default 'rules',
  created_at timestamptz not null default now()
);
create index if not exists alerts_conv_user_idx on public.guardian_alerts (conversation_id, user_id, created_at desc);
alter table public.guardian_alerts enable row level security;
drop policy if exists "own alerts" on public.guardian_alerts;
create policy "own alerts" on public.guardian_alerts for select to authenticated using (user_id = auth.uid());

-- ---------- reports ----------
create table if not exists public.reports (
  id bigint generated always as identity primary key,
  reporter uuid not null references public.profiles(id) on delete cascade,
  target uuid not null references public.profiles(id) on delete cascade,
  conversation_id uuid references public.conversations(id) on delete set null,
  reason text not null,
  note text not null default '',
  evidence jsonb not null default '[]',
  risk int not null default 0,
  status text not null default 'open' check (status in ('open','removed','restricted','dismissed')),
  decided_by uuid references public.profiles(id),
  decided_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.reports enable row level security;
drop policy if exists "own reports" on public.reports;
create policy "own reports" on public.reports for select to authenticated using (reporter = auth.uid() or public.is_admin());

-- ---------- family ally ----------
create table if not exists public.allies (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  name text not null,
  relation text not null default '',
  email text not null,
  notify_money boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.allies enable row level security;
drop policy if exists "own ally" on public.allies;
create policy "own ally" on public.allies for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---------- investors & B2B ----------
create table if not exists public.investor_messages (
  id bigint generated always as identity primary key,
  name text not null, org text not null default '', email text not null, message text not null,
  created_at timestamptz not null default now()
);
alter table public.investor_messages enable row level security;
drop policy if exists "admins read investor messages" on public.investor_messages;
create policy "admins read investor messages" on public.investor_messages for select to authenticated using (public.is_admin());

create table if not exists public.api_keys (
  id bigint generated always as identity primary key,
  name text not null,
  prefix text not null,
  key_hash text not null unique,
  revoked boolean not null default false,
  calls int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.api_keys enable row level security;
drop policy if exists "admins read keys" on public.api_keys;
create policy "admins read keys" on public.api_keys for select to authenticated using (public.is_admin());

-- ---------- realtime ----------
do $$ begin
  begin alter publication supabase_realtime add table public.messages; exception when others then null; end;
  begin alter publication supabase_realtime add table public.guardian_alerts; exception when others then null; end;
  begin alter publication supabase_realtime add table public.conversations; exception when others then null; end;
end $$;

-- ---------- profile photos ----------
insert into storage.buckets (id, name, public) values ('avatars','avatars', true) on conflict (id) do nothing;
drop policy if exists "avatar upload own folder" on storage.objects;
create policy "avatar upload own folder" on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "avatar update own folder" on storage.objects;
create policy "avatar update own folder" on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "avatar public read" on storage.objects;
create policy "avatar public read" on storage.objects for select using (bucket_id = 'avatars');

-- Make yourself an admin after you sign up (replace the email):
-- update public.profiles set role = 'admin', verification = 'verified' where id = (select id from auth.users where email = 'you@example.com');
