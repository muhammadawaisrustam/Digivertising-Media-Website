-- Performance tuning suggested by the Supabase advisor (no change in who can access what).
drop policy "read own profile" on public.profiles;
create policy "read own profile" on public.profiles for select to authenticated
  using (id = (select auth.uid()) or private.current_role_is(array['owner', 'admin']::public.app_role[]));

drop policy "staff append audit" on public.audit_log;
create policy "staff append audit" on public.audit_log for insert to authenticated
  with check (actor = (select auth.uid()));

create index audit_log_actor_idx on public.audit_log (actor);
create index page_revisions_published_by_idx on public.page_revisions (published_by);
create index pages_updated_by_idx on public.pages (updated_by);
