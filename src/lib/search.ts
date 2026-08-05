/** Tamanho máximo aceito na busca do painel. */
export const MAX_SEARCH_LENGTH = 80;

/**
 * O filtro `.or()` do PostgREST é uma string: vírgula separa condições,
 * ponto separa coluna/operador/valor e parêntese abre grupo. Um termo cru
 * vindo da query string (`/admin?q=...`) consegue fechar a condição e
 * anexar outra — basta um link montado e clicado por quem tem sessão.
 *
 * Como o campo busca nomes, tudo que não for letra, número, espaço, hífen
 * ou apóstrofo é descartado. Isso também neutraliza `%` e `_`, que são
 * curingas do ILIKE e permitiriam varrer a tabela inteira.
 */
export function sanitizeSearchTerm(value: string | undefined): string {
  if (!value) return "";
  return value
    .normalize("NFC")
    .replace(/[^\p{L}\p{N}\s'-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_SEARCH_LENGTH);
}
