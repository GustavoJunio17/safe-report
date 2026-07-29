import { onlyDigits } from "@/lib/cpf";

const MIN_BIRTH_DATE = "1900-01-01";

/** Máscara progressiva dd/mm/aaaa. */
export function formatBirthDate(value: string) {
  const digits = onlyDigits(value).slice(0, 8);
  return digits
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{2})(\d)/, "$1/$2");
}

/** Converte dd/mm/aaaa em aaaa-mm-dd; devolve null se a data não existir. */
export function parseBirthDate(value: string): string | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
  if (!match) return null;

  const [, day, month, year] = match;
  const date = new Date(`${year}-${month}-${day}T00:00:00Z`);

  if (Number.isNaN(date.getTime())) return null;
  // Rejeita datas que o Date "corrige" sozinho, como 31/02.
  if (
    date.getUTCFullYear() !== Number(year) ||
    date.getUTCMonth() + 1 !== Number(month) ||
    date.getUTCDate() !== Number(day)
  ) {
    return null;
  }

  return `${year}-${month}-${day}`;
}

export function isValidBirthDate(value: string) {
  const iso = parseBirthDate(value);
  if (!iso) return false;
  return iso >= MIN_BIRTH_DATE && iso <= new Date().toISOString().slice(0, 10);
}
