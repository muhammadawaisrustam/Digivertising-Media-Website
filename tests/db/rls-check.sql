-- Access-rule (Row Level Security) check. Runs inside a transaction and rolls
-- everything back, so it leaves no data behind. Each row should say PASS.
begin;
create temp table t_results (check_name text, expected text, actual text);
grant all on t_results to authenticated, anon;

insert into auth.users (id, email, aud, role) values
  ('00000000-0000-0000-0000-0000000000a1', 'owner@test.invalid', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-0000000000e1', 'editor@test.invalid', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-0000000000b1', 'pending@test.invalid', 'authenticated', 'authenticated');
insert into t_results select 'new account starts as pending', 'pending', role::text from public.profiles where id = '00000000-0000-0000-0000-0000000000b1';
update public.profiles set role = 'owner' where id = '00000000-0000-0000-0000-0000000000a1';
update public.profiles set role = 'editor' where id = '00000000-0000-0000-0000-0000000000e1';
insert into public.pages (slug, locale, published, draft) values ('rls-test-home', 'en', '{"live":true}', '{"draft":true}'), ('rls-test-promo', 'en', '{"live":true}', null), ('rls-test-secret', 'en', null, '{"draft":true}');
insert into public.leads (source, locale, name, email, consent_at) values ('website_contact', 'en', 'RLS Test Lead', 'rls-lead@test.invalid', now());

-- Pending account: sees nothing, cannot promote itself
set local role authenticated;
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-0000000000b1","role":"authenticated"}';
insert into t_results select 'pending: pages visible', '0', count(*)::text from public.pages where slug like 'rls-test-%';
insert into t_results select 'pending: leads visible', '0', count(*)::text from public.leads where email = 'rls-lead@test.invalid';
insert into t_results select 'pending: own profile visible', '1', count(*)::text from public.profiles where email like '%@test.invalid';
update public.profiles set role = 'owner' where id = '00000000-0000-0000-0000-0000000000b1';
reset role;
insert into t_results select 'pending: cannot promote itself', 'pending', role::text from public.profiles where id = '00000000-0000-0000-0000-0000000000b1';

-- Editor: edits pages, cannot see leads or change roles
set local role authenticated;
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-0000000000e1","role":"authenticated"}';
insert into t_results select 'editor: pages visible', '3', count(*)::text from public.pages where slug like 'rls-test-%';
insert into t_results select 'editor: leads visible', '0', count(*)::text from public.leads where email = 'rls-lead@test.invalid';
update public.pages set draft = '{"edited":true}' where slug = 'rls-test-home';
insert into public.page_revisions (slug, locale, content, note) values ('rls-test-home', 'en', '{"v":1}', 'test');
insert into t_results select 'editor: can add a version', '1', count(*)::text from public.page_revisions where slug = 'rls-test-home';
update public.profiles set role = 'owner' where id = '00000000-0000-0000-0000-0000000000e1';
reset role;
insert into t_results select 'editor: draft saved', '{"edited": true}', draft::text from public.pages where slug = 'rls-test-home';
insert into t_results select 'editor: cannot promote itself', 'editor', role::text from public.profiles where id = '00000000-0000-0000-0000-0000000000e1';

-- Owner: sees leads and all profiles
set local role authenticated;
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-0000000000a1","role":"authenticated"}';
insert into t_results select 'owner: leads visible', '1', count(*)::text from public.leads where email = 'rls-lead@test.invalid';
insert into t_results select 'owner: profiles visible', '3', count(*)::text from public.profiles where email like '%@test.invalid';
reset role;

-- Anonymous visitor: only published content through the read functions
set local role anon;
set local request.jwt.claims = '{"role":"anon"}';
insert into t_results select 'anon: pages table hidden', '0', count(*)::text from public.pages where slug like 'rls-test-%';
insert into t_results select 'anon: leads table hidden', '0', count(*)::text from public.leads where email = 'rls-lead@test.invalid';
insert into t_results select 'anon: live page readable', '{"live": true}', public.published_page('rls-test-home', 'en')::text;
insert into t_results select 'anon: unpublished page not readable', 'null', coalesce(public.published_page('rls-test-secret', 'en')::text, 'null');
insert into t_results select 'anon: landing list has only published', 'rls-test-home,rls-test-promo', string_agg(s, ',' order by s) from public.published_landing_slugs('en') s where s like 'rls-test-%';
reset role;

select case when expected = actual then 'PASS' else 'FAIL' end as status, check_name, expected, actual from t_results;
-- Ends with a deliberate error so the transaction can never be committed,
-- even by a tool that ignores the rollback. The message carries the results.
do $$ begin raise exception 'RLS-CHECK-RESULTS %', (select string_agg(case when expected = actual then 'PASS ' else 'FAIL ' end || check_name || ' (expected ' || expected || ', got ' || coalesce(actual, 'null') || ')', ' | ') from t_results); end $$;
rollback;
