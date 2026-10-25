-- Performance tuning suggested by the Supabase advisor (no change in who can access what).
alter policy "read own profile" on public.profiles
  using (id = (select auth.uid()) or private.current_role_is(array['owner', 'admin']::public.app_role[]));

alter policy "staff append audit" on public.audit_log
  with check (actor = (select auth.uid()));

create index if not exists audit_log_actor_idx on public.audit_log (actor);
create index if not exists page_revisions_published_by_idx on public.page_revisions (published_by);
create index if not exists pages_updated_by_idx on public.pages (updated_by);
