-- Virtual House Painter order artifacts + admin visibility

alter table public.profiles
  add column if not exists role text not null default 'customer';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_role_check'
  ) then
    alter table public.profiles
      add constraint profiles_role_check check (role in ('customer','admin'));
  end if;
end $$;

alter table public.quote_requests
  add column if not exists summary_pdf_path text,
  add column if not exists before_image_path text,
  add column if not exists after_image_path text,
  add column if not exists design_data jsonb not null default '{}'::jsonb;

update storage.buckets
set allowed_mime_types = array['image/jpeg','image/png','image/webp','application/pdf'],
    file_size_limit = 10485760
where id = 'paint-planner';

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

drop policy if exists "admins_select_projects" on public.paint_projects;
create policy "admins_select_projects" on public.paint_projects
for select using (public.is_admin());

drop policy if exists "admins_update_projects" on public.paint_projects;
create policy "admins_update_projects" on public.paint_projects
for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins_select_quotes" on public.quote_requests;
create policy "admins_select_quotes" on public.quote_requests
for select using (public.is_admin());

drop policy if exists "admins_update_quotes" on public.quote_requests;
create policy "admins_update_quotes" on public.quote_requests
for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins_select_planner_files" on storage.objects;
create policy "admins_select_planner_files" on storage.objects
for select to authenticated
using (bucket_id = 'paint-planner' and public.is_admin());

-- Promote a real admin explicitly in the SQL editor after deployment, for example:
-- update public.profiles set role = 'admin' where id = '<ADMIN_AUTH_USER_UUID>';
