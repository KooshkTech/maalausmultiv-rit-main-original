-- Kamu Studio enterprise foundation: organizations, memberships, pricing, projects, audit and tenant-safe storage.
-- Additive migration. Existing V17 paint tables remain intact while the new SaaS model is adopted incrementally.

create extension if not exists pgcrypto;

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique check (slug ~ '^[a-z0-9][a-z0-9-]{1,62}$'),
  quote_email text not null,
  branding jsonb not null default '{"primary":"#1E293B","accent":"#F97316"}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organization_members (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner','admin','member')),
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

create table if not exists public.organization_pricing (
  organization_id uuid primary key references public.organizations(id) on delete cascade,
  currency char(3) not null default 'EUR',
  paint_base_sqm numeric(10,2),
  paint_coat_multiplier numeric(5,2),
  cleaning_base_sqm numeric(10,2),
  window_unit_rate numeric(10,2),
  pricing_payload jsonb not null default '{}'::jsonb,
  version integer not null default 1,
  updated_at timestamptz not null default now()
);

create table if not exists public.studio_projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  type text not null check (type in ('varikamu','siivouskamu')),
  status text not null default 'draft' check (status in ('draft','ready','quote_requested','archived')),
  original_image_path text,
  edited_image_path text,
  state_payload jsonb not null default '{}'::jsonb,
  estimate_payload jsonb,
  pricing_version integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.studio_quote_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid not null references public.studio_projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'received' check (status in ('received','reviewing','quoted','won','closed')),
  customer_payload jsonb not null default '{}'::jsonb,
  message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organization_feature_flags (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  key text not null,
  enabled boolean not null default false,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (organization_id, key)
);

create table if not exists public.audit_events (
  id bigint generated always as identity primary key,
  organization_id uuid references public.organizations(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_members_user_idx on public.organization_members(user_id, organization_id);
create index if not exists studio_projects_tenant_user_updated_idx on public.studio_projects(organization_id, user_id, updated_at desc);
create index if not exists studio_quotes_tenant_created_idx on public.studio_quote_requests(organization_id, created_at desc);
create index if not exists audit_events_tenant_created_idx on public.audit_events(organization_id, created_at desc);

alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.organization_pricing enable row level security;
alter table public.studio_projects enable row level security;
alter table public.studio_quote_requests enable row level security;
alter table public.organization_feature_flags enable row level security;
alter table public.audit_events enable row level security;

create or replace function public.is_org_member(org_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.organization_members m
    where m.organization_id = org_id and m.user_id = auth.uid()
  );
$$;

create or replace function public.is_org_admin(org_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.organization_members m
    where m.organization_id = org_id and m.user_id = auth.uid() and m.role in ('owner','admin')
  );
$$;

revoke all on function public.is_org_member(uuid) from public;
revoke all on function public.is_org_admin(uuid) from public;
grant execute on function public.is_org_member(uuid) to authenticated;
grant execute on function public.is_org_admin(uuid) to authenticated;

create policy "organizations_member_select" on public.organizations for select to authenticated using (public.is_org_member(id));
create policy "organizations_admin_update" on public.organizations for update to authenticated using (public.is_org_admin(id)) with check (public.is_org_admin(id));

create policy "members_member_select" on public.organization_members for select to authenticated using (public.is_org_member(organization_id));
create policy "members_admin_insert" on public.organization_members for insert to authenticated with check (public.is_org_admin(organization_id));
create policy "members_admin_update" on public.organization_members for update to authenticated using (public.is_org_admin(organization_id)) with check (public.is_org_admin(organization_id));
create policy "members_admin_delete" on public.organization_members for delete to authenticated using (public.is_org_admin(organization_id) and user_id <> auth.uid());

create policy "pricing_member_select" on public.organization_pricing for select to authenticated using (public.is_org_member(organization_id));
create policy "pricing_admin_write" on public.organization_pricing for all to authenticated using (public.is_org_admin(organization_id)) with check (public.is_org_admin(organization_id));

create policy "studio_projects_select" on public.studio_projects for select to authenticated using (public.is_org_member(organization_id) and (user_id = auth.uid() or public.is_org_admin(organization_id)));
create policy "studio_projects_insert" on public.studio_projects for insert to authenticated with check (user_id = auth.uid() and public.is_org_member(organization_id));
create policy "studio_projects_update" on public.studio_projects for update to authenticated using (public.is_org_member(organization_id) and (user_id = auth.uid() or public.is_org_admin(organization_id))) with check (public.is_org_member(organization_id) and (user_id = auth.uid() or public.is_org_admin(organization_id)));
create policy "studio_projects_delete" on public.studio_projects for delete to authenticated using (public.is_org_member(organization_id) and (user_id = auth.uid() or public.is_org_admin(organization_id)));

create policy "studio_quotes_select" on public.studio_quote_requests for select to authenticated using (public.is_org_member(organization_id) and (user_id = auth.uid() or public.is_org_admin(organization_id)));
create policy "studio_quotes_insert" on public.studio_quote_requests for insert to authenticated with check (
  user_id = auth.uid() and public.is_org_member(organization_id)
  and exists (select 1 from public.studio_projects p where p.id = project_id and p.organization_id = organization_id and p.user_id = auth.uid())
);
create policy "studio_quotes_admin_update" on public.studio_quote_requests for update to authenticated using (public.is_org_admin(organization_id)) with check (public.is_org_admin(organization_id));

create policy "feature_flags_member_select" on public.organization_feature_flags for select to authenticated using (public.is_org_member(organization_id));
create policy "feature_flags_admin_write" on public.organization_feature_flags for all to authenticated using (public.is_org_admin(organization_id)) with check (public.is_org_admin(organization_id));

create policy "audit_admin_select" on public.audit_events for select to authenticated using (public.is_org_admin(organization_id));

create or replace function public.create_organization(org_name text, org_slug text, org_quote_email text)
returns uuid language plpgsql security definer set search_path = public as $$
declare new_id uuid;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  insert into public.organizations(name, slug, quote_email) values (org_name, lower(org_slug), org_quote_email) returning id into new_id;
  insert into public.organization_members(organization_id, user_id, role) values (new_id, auth.uid(), 'owner');
  insert into public.organization_pricing(organization_id) values (new_id);
  insert into public.audit_events(organization_id, actor_user_id, action, entity_type, entity_id)
  values (new_id, auth.uid(), 'organization.created', 'organization', new_id);
  return new_id;
end;
$$;
revoke all on function public.create_organization(text,text,text) from public;
grant execute on function public.create_organization(text,text,text) to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('kamu-studio', 'kamu-studio', false, 15728640, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = false, file_size_limit = 15728640, allowed_mime_types = array['image/jpeg','image/png','image/webp'];

create policy "kamu_storage_select" on storage.objects for select to authenticated using (
  bucket_id = 'kamu-studio'
  and public.is_org_member(nullif((storage.foldername(name))[1], '')::uuid)
);
create policy "kamu_storage_insert" on storage.objects for insert to authenticated with check (
  bucket_id = 'kamu-studio'
  and public.is_org_member(nullif((storage.foldername(name))[1], '')::uuid)
  and (storage.foldername(name))[2] = auth.uid()::text
);
create policy "kamu_storage_update" on storage.objects for update to authenticated using (
  bucket_id = 'kamu-studio' and public.is_org_member(nullif((storage.foldername(name))[1], '')::uuid)
  and ((storage.foldername(name))[2] = auth.uid()::text or public.is_org_admin(nullif((storage.foldername(name))[1], '')::uuid))
) with check (
  bucket_id = 'kamu-studio' and public.is_org_member(nullif((storage.foldername(name))[1], '')::uuid)
);
create policy "kamu_storage_delete" on storage.objects for delete to authenticated using (
  bucket_id = 'kamu-studio' and public.is_org_member(nullif((storage.foldername(name))[1], '')::uuid)
  and ((storage.foldername(name))[2] = auth.uid()::text or public.is_org_admin(nullif((storage.foldername(name))[1], '')::uuid))
);

create trigger organizations_set_updated_at before update on public.organizations for each row execute procedure public.set_updated_at();
create trigger organization_pricing_set_updated_at before update on public.organization_pricing for each row execute procedure public.set_updated_at();
create trigger studio_projects_set_updated_at before update on public.studio_projects for each row execute procedure public.set_updated_at();
create trigger studio_quotes_set_updated_at before update on public.studio_quote_requests for each row execute procedure public.set_updated_at();
