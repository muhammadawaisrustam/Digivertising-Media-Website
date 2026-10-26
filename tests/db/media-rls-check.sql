-- Access rules for image uploads (storage bucket "media"). Runs in a transaction,
-- ends with a deliberate error and rolls back, so nothing is kept. Each check should PASS.
-- Only metadata rows are inserted here: no file is ever stored.
begin;
create temp table t_results (check_name text, expected text, actual text);
grant all on t_results to authenticated, anon;

insert into auth.users (id, email, aud, role) values
  ('00000000-0000-0000-0000-0000000000e2', 'media-editor@test.invalid', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-0000000000f2', 'media-viewer@test.invalid', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-0000000000b2', 'media-pending@test.invalid', 'authenticated', 'authenticated');
update public.profiles set role = 'editor' where id = '00000000-0000-0000-0000-0000000000e2';
update public.profiles set role = 'viewer' where id = '00000000-0000-0000-0000-0000000000f2';

insert into t_results select 'bucket is public', 'true', public::text from storage.buckets where id = 'media';
insert into t_results select 'bucket size limit 5 MB', '5242880', file_size_limit::text from storage.buckets where id = 'media';
insert into t_results select 'bucket refuses SVG', 'false', ('image/svg+xml' = any (allowed_mime_types))::text from storage.buckets where id = 'media';

-- Editor: may upload into uploads/ only
set local role authenticated;
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-0000000000e2","role":"authenticated"}';
do $$ begin
  insert into storage.objects (bucket_id, name) values ('media', 'uploads/rls-test/editor.png');
  insert into t_results values ('editor: can upload to uploads/', 'ok', 'ok');
exception when insufficient_privilege then insert into t_results values ('editor: can upload to uploads/', 'ok', 'refused'); end $$;
do $$ begin
  insert into storage.objects (bucket_id, name) values ('media', 'elsewhere/editor.png');
  insert into t_results values ('editor: cannot upload outside uploads/', 'refused', 'ok');
exception when insufficient_privilege then insert into t_results values ('editor: cannot upload outside uploads/', 'refused', 'refused'); end $$;
insert into t_results select 'editor: can list uploads', '1', count(*)::text from storage.objects where name like 'uploads/rls-test/%';
update storage.objects set name = 'uploads/rls-test/renamed.png' where name = 'uploads/rls-test/editor.png';
reset role;
insert into t_results select 'editor: cannot rename (no update rule)', 'uploads/rls-test/editor.png', name from storage.objects where name like 'uploads/rls-test/%';

-- Viewer: can list, cannot upload
set local role authenticated;
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-0000000000f2","role":"authenticated"}';
insert into t_results select 'viewer: can list uploads', '1', count(*)::text from storage.objects where name like 'uploads/rls-test/%';
do $$ begin
  insert into storage.objects (bucket_id, name) values ('media', 'uploads/rls-test/viewer.png');
  insert into t_results values ('viewer: cannot upload', 'refused', 'ok');
exception when insufficient_privilege then insert into t_results values ('viewer: cannot upload', 'refused', 'refused'); end $$;
reset role;

-- Pending account: nothing
set local role authenticated;
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-0000000000b2","role":"authenticated"}';
insert into t_results select 'pending: cannot list', '0', count(*)::text from storage.objects where name like 'uploads/rls-test/%';
do $$ begin
  insert into storage.objects (bucket_id, name) values ('media', 'uploads/rls-test/pending.png');
  insert into t_results values ('pending: cannot upload', 'refused', 'ok');
exception when insufficient_privilege then insert into t_results values ('pending: cannot upload', 'refused', 'refused'); end $$;
reset role;

-- Anonymous visitor: cannot upload or list (public files are still viewable by address)
set local role anon;
set local request.jwt.claims = '{"role":"anon"}';
insert into t_results select 'anon: cannot list', '0', count(*)::text from storage.objects where name like 'uploads/rls-test/%';
do $$ begin
  insert into storage.objects (bucket_id, name) values ('media', 'uploads/rls-test/anon.png');
  insert into t_results values ('anon: cannot upload', 'refused', 'ok');
exception when insufficient_privilege then insert into t_results values ('anon: cannot upload', 'refused', 'refused'); end $$;
reset role;

select case when expected = actual then 'PASS' else 'FAIL' end as status, check_name, expected, actual from t_results;
do $$ begin raise exception 'MEDIA-RLS-CHECK-RESULTS %', (select string_agg(case when expected = actual then 'PASS ' else 'FAIL ' end || check_name || ' (expected ' || expected || ', got ' || coalesce(actual, 'null') || ')', ' | ') from t_results); end $$;
rollback;
