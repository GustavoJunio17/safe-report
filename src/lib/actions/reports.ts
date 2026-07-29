"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin, requireProfile } from "@/lib/auth";
import { isValidCpf, onlyDigits } from "@/lib/cpf";
import { STATUS_ORDER } from "@/lib/types";

export type ReportFormState = {
  error?: string;
  success?: string;
  /** Muda a cada envio bem-sucedido para remontar (limpar) o formulário. */
  token?: string;
  fieldErrors?: Record<string, string>;
};

const MIN_BIRTH_DATE = "1900-01-01";

const reportSchema = z.object({
  fullName: z.string().trim().min(3, "Informe o nome completo."),
  cpf: z
    .string()
    .transform(onlyDigits)
    .refine((value) => isValidCpf(value), "CPF inválido."),
  birthDate: z
    .string()
    .refine((value) => {
      const date = new Date(value);
      return (
        !Number.isNaN(date.getTime()) &&
        value >= MIN_BIRTH_DATE &&
        date <= new Date()
      );
    }, "Data de nascimento inválida."),
  accusedName: z
    .string()
    .trim()
    .min(3, "Informe o nome da pessoa reclamada."),
  reason: z
    .string()
    .trim()
    .min(20, "Descreva o ocorrido com ao menos 20 caracteres.")
    .max(5000, "O relato deve ter no máximo 5000 caracteres."),
});

export async function createReport(
  _prev: ReportFormState,
  formData: FormData,
): Promise<ReportFormState> {
  const profile = await requireProfile();

  const parsed = reportSchema.safeParse({
    fullName: formData.get("fullName"),
    cpf: formData.get("cpf"),
    birthDate: formData.get("birthDate"),
    accusedName: formData.get("accusedName"),
    reason: formData.get("reason"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      fieldErrors[key] ??= issue.message;
    }
    return { error: "Revise os campos destacados.", fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("reports").insert({
    user_id: profile.id,
    full_name: parsed.data.fullName,
    cpf: parsed.data.cpf,
    birth_date: parsed.data.birthDate,
    accused_name: parsed.data.accusedName,
    reason: parsed.data.reason,
  });

  if (error) {
    return { error: "Não foi possível registrar a denúncia. Tente novamente." };
  }

  revalidatePath("/relatar");
  return {
    success: "Denúncia registrada. Você pode acompanhar o status abaixo.",
    token: crypto.randomUUID(),
  };
}

const updateSchema = z.object({
  id: z.uuid(),
  status: z.enum(STATUS_ORDER),
  adminNotes: z.string().trim().max(5000).optional(),
});

export async function updateReport(
  _prev: ReportFormState,
  formData: FormData,
): Promise<ReportFormState> {
  await requireAdmin();

  const parsed = updateSchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
    adminNotes: formData.get("adminNotes") ?? undefined,
  });

  if (!parsed.success) {
    return { error: "Dados inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("reports")
    .update({
      status: parsed.data.status,
      admin_notes: parsed.data.adminNotes || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.id);

  if (error) {
    return { error: "Não foi possível salvar as alterações." };
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/${parsed.data.id}`);
  return { success: "Denúncia atualizada." };
}
