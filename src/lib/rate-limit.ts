import { headers } from "next/headers";

/**
 * Limite de envios em memória, por IP.
 *
 * Não substitui um WAF: o processo é reciclado e a Vercel pode manter mais
 * de uma instância, então o teto real é por instância. Serve para conter
 * repetição acidental e abuso trivial pelo formulário; contra flood
 * distribuído (ou contra quem chama a API do Supabase direto, já que a chave
 * anon é pública) a defesa tem que ser o rate limit/BotID da Vercel.
 */
const WINDOW_MS = 60_000;
const MAX_HITS = 5;
/** Teto de chaves guardadas — impede que o mapa cresça sem limite. */
const MAX_KEYS = 10_000;

const hits = new Map<string, number[]>();

export async function clientIp(): Promise<string> {
  const store = await headers();
  const forwarded = store.get("x-forwarded-for");
  // O primeiro item é o cliente; os demais são proxies. Na Vercel o header
  // é reescrito na borda, então não dá para forjar a posição inicial.
  const ip = forwarded?.split(",")[0]?.trim() || store.get("x-real-ip");
  return ip || "desconhecido";
}

/** `true` quando o envio deve ser recusado por excesso de tentativas. */
export function isRateLimited(key: string): boolean {
  const now = Date.now();

  if (hits.size > MAX_KEYS) hits.clear();

  const recent = (hits.get(key) ?? []).filter((at) => now - at < WINDOW_MS);

  if (recent.length >= MAX_HITS) {
    hits.set(key, recent);
    return true;
  }

  recent.push(now);
  hits.set(key, recent);
  return false;
}
