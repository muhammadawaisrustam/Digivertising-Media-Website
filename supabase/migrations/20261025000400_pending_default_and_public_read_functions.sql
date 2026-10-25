alter table public.profiles alter column role set default 'pending';

-- Public website reads: only the published version, nothing else.
-- These let the server read live pages with the publishable key, so the
-- secret key is only needed to store website enquiries.
create or replace function public.published_page(p_slug text, p_locale text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select published from public.pages
  where slug = p_slug and locale = p_locale and published is not null;
$$;

create or replace function public.published_landing_slugs(p_locale text)
returns setof text
language sql
stable
security definer
set search_path = public
as $$
  select slug from public.pages
  where locale = p_locale and published is not null and slug not in ('home', 'about')
  order by slug;
$$;

revoke all on function public.published_page(text, text) from public;
revoke all on function public.published_landing_slugs(text) from public;
grant execute on function public.published_page(text, text) to anon, authenticated;
grant execute on function public.published_landing_slugs(text) to anon, authenticated;
