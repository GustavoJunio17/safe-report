-- ============================================================
-- Migração: denúncia deixa de exigir conta de usuário.
-- Rode no SQL Editor se o banco já foi criado com o schema antigo.
-- (Em banco novo, use apenas supabase/schema.sql.)
-- ============================================================

-- 1. Denúncias não pertencem mais a uma conta.
alter table public.reports drop column if exists user_id;
drop index if exists public.reports_user_id_idx;

-- 2. Políticas do modelo antigo.
drop policy if exists "reports_select" on public.reports;
drop policy if exists "reports_insert_own" on public.reports;
drop policy if exists "profiles_update_own" on public.profiles;

-- 3. Envio público, leitura restrita a administradores.
drop policy if exists "reports_insert_public" on public.reports;
create policy "reports_insert_public" on public.reports
  for insert to anon, authenticated
  with check (true);

drop policy if exists "reports_select_admin" on public.reports;
create policy "reports_select_admin" on public.reports
  for select using (public.is_admin());

drop policy if exists "reports_update_admin" on public.reports;
create policy "reports_update_admin" on public.reports
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "reports_delete_admin" on public.reports;
create policy "reports_delete_admin" on public.reports
  for delete using (public.is_admin());
