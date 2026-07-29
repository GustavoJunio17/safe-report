"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; success?: string };

const signInSchema = z.object({
  email: z.email("E-mail inválido."),
  password: z.string().min(1, "Informe sua senha."),
});

const signUpSchema = z.object({
  fullName: z.string().trim().min(3, "Informe seu nome completo."),
  email: z.email("E-mail inválido."),
  password: z.string().min(8, "A senha deve ter ao menos 8 caracteres."),
});

export async function signIn(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: "E-mail ou senha incorretos." };
  }

  const redirectTo = String(formData.get("redirect") || "/");
  revalidatePath("/", "layout");
  redirect(redirectTo.startsWith("/") ? redirectTo : "/");
}

export async function signUp(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = signUpSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { full_name: parsed.data.fullName } },
  });

  if (error) {
    return { error: error.message };
  }

  // No session means Supabase is set to require e-mail confirmation.
  if (!data.session) {
    return {
      success:
        "Conta criada. Confirme o e-mail enviado para ativar seu acesso.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/relatar");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
