-- ============================================================
-- Safe Report — schema completo
-- Rode este arquivo inteiro no SQL Editor do Supabase.
-- ============================================================

-- ---------- Tipos ----------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('admin', 'user');
  end if;
  if not exists (select 1 from pg_type where typname = 'report_status') then
    create type public.report_status as enum ('pendente', 'em_analise', 'resolvido', 'arquivado');
  end if;
end $$;

-- ---------- Tabela: profiles ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role public.user_role not null default 'user',
  created_at timestamptz not null default now()
);

-- ---------- Tabela: reports ----------
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  full_name text not null,
  cpf text not null check (cpf ~ '^[0-9]{11}$'),
  birth_date date not null,
  accused_name text not null,
  reason text not null check (char_length(reason) between 20 and 5000),
  status public.report_status not null default 'pendente',
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists reports_user_id_idx on public.reports (user_id);
create index if not exists reports_status_idx on public.reports (status);
create index if not exists reports_created_at_idx on public.reports (created_at desc);

-- ---------- Helper: admin? (security definer evita recursão de RLS) ----------
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

-- ---------- Trigger: cria profile no signup ----------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- RLS ----------
alter table public.profiles enable row level security;
alter table public.reports  enable row level security;

-- profiles
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()));

-- reports
drop policy if exists "reports_select" on public.reports;
create policy "reports_select" on public.reports
  for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists "reports_insert_own" on public.reports;
create policy "reports_insert_own" on public.reports
  for insert with check (user_id = auth.uid());

drop policy if exists "reports_update_admin" on public.reports;
create policy "reports_update_admin" on public.reports
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "reports_delete_admin" on public.reports;
create policy "reports_delete_admin" on public.reports
  for delete using (public.is_admin());

-- ============================================================
-- Promover uma conta a admin (rode depois de criar o usuário):
--   update public.profiles set role = 'admin' where email = 'voce@empresa.com';
-- ============================================================
