/**
 * Todo horário exibido no site usa o fuso de Brasília (UTC-3).
 *
 * O servidor pode rodar em UTC — a Vercel roda —, então sem fixar o fuso
 * aqui a mesma denúncia aparece com hora diferente dependendo de onde o
 * código executa. O Brasil não usa horário de verão desde 2019, então
 * America/Sao_Paulo é UTC-3 o ano inteiro.
 */
export const TIME_ZONE = "America/Sao_Paulo";

const dateTimeShort = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: TIME_ZONE,
});

const dateTimeLong = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
  timeStyle: "short",
  timeZone: TIME_ZONE,
});

/**
 * Datas puras (birth_date) não têm hora nem fuso: são lidas como UTC e
 * exibidas como UTC. Converter para Brasília jogaria o dia para trás.
 */
const dateOnlyLong = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
  timeZone: "UTC",
});

const isoDateInBrazil = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
});

/** timestamptz → "17/08/2003 14:30" no horário de Brasília. */
export function formatDateTime(value: string) {
  return dateTimeShort.format(new Date(value));
}

/** timestamptz → "17 de agosto de 2003 às 14:30" no horário de Brasília. */
export function formatDateTimeLong(value: string) {
  return dateTimeLong.format(new Date(value));
}

/** date (aaaa-mm-dd) → "17 de agosto de 2003". */
export function formatDateOnly(value: string) {
  return dateOnlyLong.format(new Date(`${value}T00:00:00Z`));
}

/** Hoje em Brasília, no formato aaaa-mm-dd. */
export function todayInBrazil() {
  return isoDateInBrazil.format(new Date());
}

/** Ano corrente em Brasília. */
export function currentYearInBrazil() {
  return Number(todayInBrazil().slice(0, 4));
}
