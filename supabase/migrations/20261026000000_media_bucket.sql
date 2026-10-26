-- Image uploads for the page editor.
-- Bucket "media": public read (images appear on public pages), 5 MB per file,
-- raster images only (no SVG, which can carry scripts).
-- Uploads: editors and above, only into the uploads/ folder.
-- The studio can list files (staff). No update or delete through the API.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do nothing;

create policy "media: editors upload"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'media'
    and (storage.foldername(name))[1] = 'uploads'
    and private.current_role_is(array['owner', 'admin', 'editor']::public.app_role[])
  );

create policy "media: staff list"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'media'
    and private.current_role_is(array['owner', 'admin', 'editor', 'viewer']::public.app_role[])
  );
