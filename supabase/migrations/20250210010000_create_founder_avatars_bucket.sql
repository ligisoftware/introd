insert into storage.buckets (id, name, public)
values ('founder-avatars', 'founder-avatars', true)
on conflict (id) do update
  set name = excluded.name,
      public = excluded.public;

-- RLS policies for founder-avatars bucket

-- Public read access for founder avatars in the public bucket
create policy "Public read access for founder avatars"
  on storage.objects
  for select
  using (bucket_id = 'founder-avatars');

-- Allow authenticated users to upload avatar files under their own auth.uid() folder
create policy "Users can upload their own avatars"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'founder-avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow authenticated users to update files under their own auth.uid() folder
create policy "Users can update their own avatars"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'founder-avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'founder-avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow authenticated users to delete files under their own auth.uid() folder
create policy "Users can delete their own avatars"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'founder-avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

