-- Keep the role helper out of the public API (not callable via /rest/v1/rpc).
create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;
alter function public.current_role_is(public.app_role[]) set schema private;
