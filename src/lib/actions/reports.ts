"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { isValidCpf, onlyDigits } from "@/lib/cpf";
import { isValidBirthDate, parseBirthDate } from "@/lib/date";
import { STATUS_ORDER } from "@/lib/types";

export type ReportFormState = {
  error?: string;
  /** Protocolo gerado quando o envio dá certo. */
  protocol?: string;
  fieldErrors?: Record<string, string>;
};

export type ReviewFormState = {
  error?: string;
  success?: string;
};

const reportSchema = z.object({
  fullName: z.string().trim().min(3, "Informe o nome completo."),
  cpf: z
    .string()
    .transform(onlyDigits)
    .refine((value) => isValidCpf(value), "CPF inválido."),
  // O formulário envia dd/mm/aaaa; o banco guarda aaaa-mm-dd.
  birthDate: z
    .string()
    .refine(isValidBirthDate, "Data de nascimento inválida.")
    .transform((value) => parseBirthDate(value) as string),
  accusedName: z.string().trim().min(3, "Informe o nome da pessoa reclamada."),
  reason: z
    .string()
    .trim()
    .min(1, "Descreva o ocorrido.")
    .max(5000, "O relato deve ter no máximo 5000 caracteres."),
});

/** Registro público: qualquer pessoa pode enviar, sem conta. */
export async function createReport(
  _prev: ReportFormState,
  formData: FormData,
): Promise<ReportFormState> {
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

  // O id é gerado aqui para devolver o protocolo sem precisar de SELECT —
  // quem envia é anônimo e não tem permissão de leitura na tabela.
  const id = crypto.randomUUID();

  const supabase = await createClient();
  const { error } = await supabase.from("reports").insert({
    id,
    full_name: parsed.data.fullName,
    cpf: parsed.data.cpf,
    birth_date: parsed.data.birthDate,
    accused_name: parsed.data.accusedName,
    reason: parsed.data.reason,
  });

  if (error) {
    // A mensagem do Postgres não vai para a tela (pode vazar detalhe do
    // schema), mas sem ela no log qualquer falha aqui vira adivinhação.
    console.error("[createReport] insert falhou:", error);
    return { error: "Não foi possível registrar a denúncia. Tente novamente." };
  }

  revalidatePath("/admin");
  return { protocol: id.slice(0, 8).toUpperCase() };
}

const updateSchema = z.object({
  id: z.uuid(),
  status: z.enum(STATUS_ORDER),
  adminNotes: z.string().trim().max(5000).optional(),
});

export async function updateReport(
  _prev: ReviewFormState,
  formData: FormData,
): Promise<ReviewFormState> {
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
