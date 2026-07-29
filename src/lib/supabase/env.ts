/**
 * Lê as chaves do Supabase tolerando erros comuns de configuração:
 * barra no final da URL (gera `//auth/v1/...` e o gateway responde
 * "Invalid path specified in request URL") e espaços em volta do valor.
 */
export function supabaseEnv() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!rawUrl || !anonKey) {
    throw new Error(
      "Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  const url = rawUrl.replace(/\/+$/, "");

  if (!/^https:\/\/[^/]+$/.test(url)) {
    throw new Error(
      `NEXT_PUBLIC_SUPABASE_URL inválida: "${rawUrl}". Use apenas a origem do projeto, ex.: https://abcdefgh.supabase.co`,
    );
  }

  return { url, anonKey };
}
