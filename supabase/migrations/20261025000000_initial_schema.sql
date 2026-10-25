-- Digivertising Media & PR: initial schema (Phase 3)
-- Run only against the dedicated "Digivertising Media and PR" Supabase project.
-- Every table has Row Level Security enabled. The browser never receives the
-- service-role key; public website reads and form inserts go through the server.

create extension if not exists pgcrypto;

-- Roles -------------------------------------------------------------------
create type public.app_role as enum ('owner', 'admin', 'editor', 'viewer');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  display_name text not null default '',
  role public.app_role not null default 'viewer',
  created_at timestamptz not null default now()
);

-- Helper used by policies. security definer so it can read profiles under RLS.
create or replace function public.current_role_is(allowed public.app_role[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = any (allowed)
  );
$$;

revoke all on function public.current_role_is(public.app_role[]) from public;
grant execute on function public.current_role_is(public.app_role[]) to authenticated;

-- New sign-ups get a viewer profile. Roles are raised by an owner only.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email) values (new.id, coalesce(new.email, ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Pages -------------------------------------------------------------------
create table public.pages (
  slug text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 60),
  locale text not null check (locale in ('en', 'ar')),
  published jsonb,
  draft jsonb,
  published_at timestamptz,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null,
  primary key (slug, locale)
);

create table public.page_revisions (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  locale text not null,
  content jsonb not null,
  note text not null default '' check (char_length(note) <= 200),
  published_at timestamptz not null default now(),
  published_by uuid references auth.users (id) on delete set null,
  foreign key (slug, locale) references public.pages (slug, locale) on delete cascade
);
create index page_revisions_page_idx on public.page_revisions (slug, locale, published_at desc);

-- Leads -------------------------------------------------------------------
create type public.lead_status as enum (
  'new', 'researching', 'qualified', 'needs_review', 'contact_drafted', 'approved_for_contact',
  'contacted', 'replied', 'proposal_drafted', 'won', 'lost', 'archived'
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status public.lead_status not null default 'new',
  source text not null check (source in ('website_contact', 'website_proposal')),
  locale text not null check (locale in ('en', 'ar')),
  name text not null check (char_length(name) between 2 and 100),
  business_name text not null default '',
  email text not null check (char_length(email) <= 200),
  phone text not null default '',
  country text not null default '',
  timezone text not null default '',
  services text[] not null default '{}',
  goals text not null default '',
  website text not null default '',
  scope text not null default '',
  timeline text not null default '',
  budget text not null default '',
  details text not null default '',
  consent_at timestamptz not null,
  qualification jsonb
);
create index leads_created_idx on public.leads (created_at desc);

-- Audit log: who changed what (append-only for app users) ------------------
create table public.audit_log (
  id bigint generated always as identity primary key,
  at timestamptz not null default now(),
  actor uuid references auth.users (id) on delete set null,
  action text not null,
  target text not null default '',
  details jsonb not null default '{}'
);

-- Row Level Security ------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.pages enable row level security;
alter table public.page_revisions enable row level security;
alter table public.leads enable row level security;
alter table public.audit_log enable row level security;

-- Profiles: everyone sees their own; owners/admins see all; only owners change roles.
create policy "read own profile" on public.profiles for select to authenticated
  using (id = auth.uid() or public.current_role_is(array['owner', 'admin']::public.app_role[]));
create policy "owners manage profiles" on public.profiles for update to authenticated
  using (public.current_role_is(array['owner']::public.app_role[]))
  with check (public.current_role_is(array['owner']::public.app_role[]));

-- Pages: staff can read; editors and up can write. Public visitors read
-- published content through the server, so there is no anon policy.
create policy "staff read pages" on public.pages for select to authenticated
  using (public.current_role_is(array['owner', 'admin', 'editor', 'viewer']::public.app_role[]));
create policy "editors insert pages" on public.pages for insert to authenticated
  with check (public.current_role_is(array['owner', 'admin', 'editor']::public.app_role[]));
create policy "editors update pages" on public.pages for update to authenticated
  using (public.current_role_is(array['owner', 'admin', 'editor']::public.app_role[]))
  with check (public.current_role_is(array['owner', 'admin', 'editor']::public.app_role[]));

create policy "staff read revisions" on public.page_revisions for select to authenticated
  using (public.current_role_is(array['owner', 'admin', 'editor', 'viewer']::public.app_role[]));
create policy "editors add revisions" on public.page_revisions for insert to authenticated
  with check (public.current_role_is(array['owner', 'admin', 'editor']::public.app_role[]));

-- Leads: private. Website forms insert through the server (service role).
create policy "admins read leads" on public.leads for select to authenticated
  using (public.current_role_is(array['owner', 'admin']::public.app_role[]));
create policy "admins update leads" on public.leads for update to authenticated
  using (public.current_role_is(array['owner', 'admin']::public.app_role[]))
  with check (public.current_role_is(array['owner', 'admin']::public.app_role[]));

-- Audit log: owners and admins read; any staff member can append their own entries.
create policy "admins read audit" on public.audit_log for select to authenticated
  using (public.current_role_is(array['owner', 'admin']::public.app_role[]));
create policy "staff append audit" on public.audit_log for insert to authenticated
  with check (actor = auth.uid());

-- No delete policies: deletes are not possible for app users in Phase 3.
