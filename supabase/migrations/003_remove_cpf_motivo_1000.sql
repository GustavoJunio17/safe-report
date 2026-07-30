-- ============================================================
-- Migração: o formulário não coleta mais CPF e o motivo passa
-- a ter no máximo 1000 caracteres.
-- Rode no SQL Editor do Supabase.
--
-- Atenção: a coluna cpf é removida junto com os dados já
-- gravados nela. Não há como desfazer.
-- ============================================================

alter table public.reports drop column if exists cpf;

alter table public.reports drop constraint if exists reports_reason_check;

alter table public.reports
  add constraint reports_reason_check
  check (char_length(reason) between 1 and 1000);
