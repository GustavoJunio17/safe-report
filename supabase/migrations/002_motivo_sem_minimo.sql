-- ============================================================
-- Migração: o motivo não tem mais tamanho mínimo.
-- O check antigo exigia 20 caracteres e barrava relatos curtos.
-- Rode no SQL Editor do Supabase.
-- ============================================================

alter table public.reports drop constraint if exists reports_reason_check;

alter table public.reports
  add constraint reports_reason_check
  check (char_length(reason) between 1 and 5000);
