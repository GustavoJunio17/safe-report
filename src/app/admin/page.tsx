import type { Metadata } from "next";
import Link from "next/link";
import { AppShell, NavLink } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatCpf } from "@/lib/cpf";
import {
  STATUS_LABEL,
  STATUS_ORDER,
  type Report,
  type ReportStatus,
} from "@/lib/types";
import { AdminFilters } from "./filters";

export const metadata: Metadata = { title: "Painel administrativo" };

const dateTime = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

function isStatus(value: string | undefined): value is ReportStatus {
  return !!value && (STATUS_ORDER as readonly string[]).includes(value);
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const profile = await requireAdmin();
  const { status, q } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("reports")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (isStatus(status)) {
    query = query.eq("status", status);
  }

  const term = q?.trim();
  if (term) {
    query = query.or(
      `full_name.ilike.%${term}%,accused_name.ilike.%${term}%,cpf.ilike.%${term}%`,
    );
  }

  const [{ data }, { data: allStatuses }] = await Promise.all([
    query,
    supabase.from("reports").select("status"),
  ]);

  const reports = (data as Report[]) ?? [];
  const statusRows = (allStatuses as { status: ReportStatus }[]) ?? [];

  const counts = STATUS_ORDER.reduce<Record<ReportStatus, number>>(
    (acc, key) => {
      acc[key] = statusRows.filter((row) => row.status === key).length;
      return acc;
    },
    { pendente: 0, em_analise: 0, resolvido: 0, arquivado: 0 },
  );

  const stats = [
    { label: "Total de denúncias", value: statusRows.length },
    { label: STATUS_LABEL.pendente, value: counts.pendente },
    { label: STATUS_LABEL.em_analise, value: counts.em_analise },
    { label: STATUS_LABEL.resolvido, value: counts.resolvido },
  ];

  return (
    <AppShell
      profile={profile}
      nav={
        <NavLink href="/admin" active>
          Painel
        </NavLink>
      }
    >
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          Painel administrativo
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          Acompanhe e trate todas as denúncias registradas na plataforma.
        </p>
      </div>

      <dl className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-5">
            <dt className="text-xs font-medium tracking-wide text-muted uppercase">
              {stat.label}
            </dt>
            <dd className="mt-2 text-3xl font-semibold tracking-tight text-ink tabular-nums">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="card overflow-hidden">
        <div className="border-b border-line p-5">
          <AdminFilters status={isStatus(status) ? status : ""} q={q ?? ""} />
        </div>

        {reports.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted">
            Nenhuma denúncia encontrada com os filtros atuais.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[46rem] text-left text-sm">
              <thead className="bg-canvas text-xs tracking-wide text-muted uppercase">
                <tr>
                  <th className="px-5 py-3 font-medium">Denunciante</th>
                  <th className="px-5 py-3 font-medium">Reclamado</th>
                  <th className="px-5 py-3 font-medium">Recebida em</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {reports.map((report) => (
                  <tr key={report.id} className="transition hover:bg-canvas/70">
                    <td className="px-5 py-4">
                      <p className="font-medium text-ink">{report.full_name}</p>
                      <p className="text-xs text-muted">
                        CPF {formatCpf(report.cpf)}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-ink">
                      {report.accused_name}
                    </td>
                    <td className="px-5 py-4 text-muted tabular-nums">
                      {dateTime.format(new Date(report.created_at))}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={report.status} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/${report.id}`}
                        className="font-medium text-brand hover:text-brand-strong"
                      >
                        Abrir
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
}
