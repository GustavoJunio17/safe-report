-- ============================================================
-- Migração: fecha o INSERT público da tabela reports.
--
-- Problema: a política antiga era `with check (true)` e o grant de
-- INSERT valia para todas as colunas. Como a chave anon é pública (vai
-- no bundle do navegador), qualquer pessoa podia chamar a API REST do
-- Supabase direto e gravar uma denúncia já com `status = 'arquivado'`
-- — sumindo da fila de pendentes — ou com `admin_notes` preenchido,
-- plantando texto num campo que a equipe lê como nota interna. Também
-- dava para gravar nome e relato de tamanho arbitrário.
--
-- Rode no SQL Editor do Supabase.
-- ============================================================

-- ---------- 1. Limites de tamanho e sanidade ----------
-- Se algum ALTER falhar, existem linhas fora do limite: corrija-as antes
-- de repetir (select ... where char_length(full_name) > 150).

alter table public.reports drop constraint if exists reports_full_name_check;
alter table public.reports
  add constraint reports_full_name_check
  check (char_length(full_name) between 3 and 150);

alter table public.reports drop constraint if exists reports_accused_name_check;
alter table public.reports
  add constraint reports_accused_name_check
  check (char_length(accused_name) between 3 and 150);

-- O teto "não pode ser no futuro" fica na aplicação: um CHECK com
-- current_date não é imutável e quebra dump/restore.
alter table public.reports drop constraint if exists reports_birth_date_check;
alter table public.reports
  add constraint reports_birth_date_check
  check (birth_date between date '1900-01-01' and date '2200-01-01');

alter table public.reports drop constraint if exists reports_admin_notes_check;
alter table public.reports
  add constraint reports_admin_notes_check
  check (admin_notes is null or char_length(admin_notes) <= 5000);

-- ---------- 2. Quem envia só escreve nas colunas do formulário ----------
-- Privilégio de coluna não sobrepõe grant de tabela: é preciso revogar o
-- INSERT inteiro e devolver apenas as colunas permitidas. O `id` continua
-- na lista porque a aplicação o gera para devolver o protocolo sem SELECT.
revoke insert on public.reports from anon, authenticated;
grant insert (id, full_name, birth_date, accused_name, reason)
  on public.reports to anon, authenticated;

-- Visitante anônimo não lê, não altera e não apaga. A RLS já bloqueava;
-- retirar o privilégio fecha a mesma porta uma camada antes.
revoke select, update, delete on public.reports from anon;
revoke all on public.profiles from anon;

-- ---------- 3. Política de INSERT deixa de aceitar qualquer linha ----------
drop policy if exists "reports_insert_public" on public.reports;
create policy "reports_insert_public" on public.reports
  for insert to anon, authenticated
  with check (status = 'pendente' and admin_notes is null);
