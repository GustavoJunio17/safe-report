import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatCpf } from "@/lib/cpf";
import type { Report } from "@/lib/types";
import { ReportForm } from "./report-form";

export const metadata: Metadata = { title: "Nova denúncia" };

const dateTime = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

export default async function RelatarPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data } = await supabase
    .from("reports")
    .select("*")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false });

  const reports = (data as Report[]) ?? [];

  return (
    <AppShell profile={profile}>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          Registrar denúncia
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          Preencha os dados abaixo. As informações são confidenciais e
          analisadas apenas pela equipe responsável.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="card p-6 sm:p-8">
          <ReportForm defaultFullName={profile.full_name ?? ""} />
        </div>

        <aside className="space-y-6">
          <div className="card p-6">
            <h2 className="text-sm font-semibold text-ink">
              Minhas denúncias
              <span className="ml-2 rounded-full bg-canvas px-2 py-0.5 text-xs font-medium text-muted">
                {reports.length}
              </span>
            </h2>

            {reports.length === 0 ? (
              <p className="mt-4 text-sm text-muted">
                Você ainda não registrou nenhuma denúncia.
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-line">
                {reports.map((report) => (
                  <li key={report.id} className="py-3.5 first:pt-0 last:pb-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-ink">
                          {report.accused_name}
                        </p>
                        <p className="mt-0.5 text-xs text-muted">
                          {dateTime.format(new Date(report.created_at))} · CPF{" "}
                          {formatCpf(report.cpf)}
                        </p>
                      </div>
                      <StatusBadge status={report.status} />
                    </div>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted">
                      {report.reason}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-xl border border-brand/15 bg-brand-soft p-5">
            <p className="text-sm font-semibold text-brand-strong">
              Sigilo garantido
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-brand-strong/80">
              Seus dados pessoais são usados apenas para validar o relato e não
              são compartilhados com a pessoa reclamada.
            </p>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
