-- V17 Paint Planner / Customer App
-- Run in Supabase SQL editor or with Supabase CLI before enabling the customer app.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.paint_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Oma maalaussuunnitelma',
  category text not null check (category in ('interior','exterior','roof','other')),
  city text,
  status text not null default 'draft' check (status in ('draft','quote_requested','archived')),
  photo_path text,
  design_data jsonb not null default '{}'::jsonb,
  estimate_low numeric(12,2),
  estimate_high numeric(12,2),
  pricing_version text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid not null references public.paint_projects(id) on delete cascade,
  project_title text not null,
  city text,
  estimate_low numeric(12,2),
  estimate_high numeric(12,2),
  name text not null,
  email text not null,
  phone text not null,
  message text,
  status text not null default 'received' check (status in ('received','reviewing','quoted','closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists paint_projects_user_updated_idx on public.paint_projects(user_id, updated_at desc);
create index if not exists quote_requests_user_created_idx on public.quote_requests(user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.paint_projects enable row level security;
alter table public.quote_requests enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "projects_select_own" on public.paint_projects for select using (auth.uid() = user_id);
create policy "projects_insert_own" on public.paint_projects for insert with check (auth.uid() = user_id);
create policy "projects_update_own" on public.paint_projects for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "projects_delete_own" on public.paint_projects for delete using (auth.uid() = user_id);

create policy "quotes_select_own" on public.quote_requests for select using (auth.uid() = user_id);
create policy "quotes_insert_own" on public.quote_requests for insert with check (
  auth.uid() = user_id
  and exists (select 1 from public.paint_projects p where p.id = project_id and p.user_id = auth.uid())
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('paint-planner', 'paint-planner', false, 10485760, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = false, file_size_limit = 10485760, allowed_mime_types = array['image/jpeg','image/png','image/webp'];

create policy "planner_images_insert_own" on storage.objects for insert to authenticated
with check (bucket_id = 'paint-planner' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "planner_images_select_own" on storage.objects for select to authenticated
using (bucket_id = 'paint-planner' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "planner_images_update_own" on storage.objects for update to authenticated
using (bucket_id = 'paint-planner' and (storage.foldername(name))[1] = auth.uid()::text)
with check (bucket_id = 'paint-planner' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "planner_images_delete_own" on storage.objects for delete to authenticated
using (bucket_id = 'paint-planner' and (storage.foldername(name))[1] = auth.uid()::text);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, phone)
  values (new.id, new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'phone')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists paint_projects_set_updated_at on public.paint_projects;
create trigger paint_projects_set_updated_at before update on public.paint_projects
for each row execute procedure public.set_updated_at();

drop trigger if exists quote_requests_set_updated_at on public.quote_requests;
create trigger quote_requests_set_updated_at before update on public.quote_requests
for each row execute procedure public.set_updated_at();
