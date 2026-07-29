import { STATUS_LABEL, type ReportStatus } from "@/lib/types";

const STYLES: Record<ReportStatus, string> = {
  pendente: "bg-amber-50 text-amber-700 ring-amber-600/20",
  em_analise: "bg-blue-50 text-blue-700 ring-blue-600/20",
  resolvido: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  arquivado: "bg-slate-100 text-slate-600 ring-slate-500/20",
};

export function StatusBadge({ status }: { status: ReportStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${STYLES[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
