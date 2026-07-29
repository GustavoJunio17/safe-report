export type ReportStatus = "pendente" | "em_analise" | "resolvido" | "arquivado";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: "admin" | "user";
  created_at: string;
};

export type Report = {
  id: string;
  full_name: string;
  cpf: string;
  birth_date: string;
  accused_name: string;
  reason: string;
  status: ReportStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
};

export const STATUS_LABEL: Record<ReportStatus, string> = {
  pendente: "Pendente",
  em_analise: "Em análise",
  resolvido: "Resolvido",
  arquivado: "Arquivado",
};

export const STATUS_ORDER = [
  "pendente",
  "em_analise",
  "resolvido",
  "arquivado",
] as const satisfies readonly ReportStatus[];
