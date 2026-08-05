-- ============================================================
-- Safe Report — schema completo
-- Rode este arquivo inteiro no SQL Editor do Supabase.
--
-- Modelo: o formulário é PÚBLICO (sem conta). Apenas contas
-- administrativas leem e tratam as denúncias.
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

-- ---------- Tabela: profiles (só administradores têm conta) ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role public.user_role not null default 'user',
  created_at timestamptz not null default now()
);

-- ---------- Tabela: reports ----------
-- O teto de birth_date é fixo de propósito: um CHECK com current_date não
-- é imutável e quebra dump/restore. "Não pode ser no futuro" é validado na
-- aplicação, pelo relógio de Brasília.
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 3 and 150),
  birth_date date not null
    check (birth_date between date '1900-01-01' and date '2200-01-01'),
  accused_name text not null
    check (char_length(accused_name) between 3 and 150),
  reason text not null check (char_length(reason) between 1 and 1000),
  status public.report_status not null default 'pendente',
  admin_notes text check (admin_notes is null or char_length(admin_notes) <= 5000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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

-- ---------- Trigger: cria profile ao criar usuário ----------
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

-- profiles: cada conta lê a si mesma; admin lê todas.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

-- reports: qualquer visitante insere; ninguém anônimo lê.
--
-- A chave anon é pública (vai no bundle do navegador), então a API REST do
-- Supabase é um endpoint de escrita aberto. Sem restringir colunas, daria
-- para gravar a denúncia já como 'arquivado' — some da fila de pendentes —
-- ou com admin_notes preenchido, que a equipe lê como nota interna.
revoke insert on public.reports from anon, authenticated;
grant insert (id, full_name, birth_date, accused_name, reason)
  on public.reports to anon, authenticated;

-- Visitante anônimo não lê, não altera e não apaga. A RLS abaixo já
-- bloqueia; retirar o privilégio fecha a mesma porta uma camada antes.
revoke select, update, delete on public.reports from anon;
revoke all on public.profiles from anon;

drop policy if exists "reports_insert_public" on public.reports;
create policy "reports_insert_public" on public.reports
  for insert to anon, authenticated
  with check (status = 'pendente' and admin_notes is null);

drop policy if exists "reports_select_admin" on public.reports;
create policy "reports_select_admin" on public.reports
  for select using (public.is_admin());

drop policy if exists "reports_update_admin" on public.reports;
create policy "reports_update_admin" on public.reports
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "reports_delete_admin" on public.reports;
create policy "reports_delete_admin" on public.reports
  for delete using (public.is_admin());

-- Políticas antigas do modelo com conta de usuário, se existirem.
drop policy if exists "reports_select" on public.reports;
drop policy if exists "reports_insert_own" on public.reports;
drop policy if exists "profiles_update_own" on public.profiles;

-- ============================================================
-- Criar um administrador:
--   1. Authentication > Users > Add user (com senha, "Auto Confirm User")
--   2. update public.profiles set role = 'admin' where email = 'voce@email.com';
-- ============================================================
