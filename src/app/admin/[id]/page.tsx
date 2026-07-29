import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell, NavLink } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatCpf } from "@/lib/cpf";
import type { Profile, Report } from "@/lib/types";
import { ReportReview } from "./review-form";

export const metadata: Metadata = { title: "Detalhe da denúncia" };

const dateTime = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
  timeStyle: "short",
});

const dateOnly = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
  timeZone: "UTC",
});

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-3.5">
      <dt className="text-xs font-medium tracking-wide text-muted uppercase">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-ink">{value}</dd>
    </div>
  );
}

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const profile = await requireAdmin();
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("reports")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();
  const report = data as Report;

  const { data: authorData } = await supabase
    .from("profiles")
    .select("email, full_name")
    .eq("id", report.user_id)
    .maybeSingle();
  const author = authorData as Pick<Profile, "email" | "full_name"> | null;

  return (
    <AppShell
      profile={profile}
      nav={
        <NavLink href="/admin" active>
          Painel
        </NavLink>
      }
    >
      <Link
        href="/admin"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition hover:text-ink"
      >
        <svg viewBox="0 0 24 24" fill="none" className="size-4">
          <path
            d="m14 6-6 6 6 6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Voltar ao painel
      </Link>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">
            Denúncia contra {report.accused_name}
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            Protocolo {report.id.slice(0, 8).toUpperCase()} · recebida em{" "}
            {dateTime.format(new Date(report.created_at))}
          </p>
        </div>
        <StatusBadge status={report.status} />
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <section className="card p-6">
            <h2 className="text-sm font-semibold text-ink">Relato</h2>
            <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap text-ink">
              {report.reason}
            </p>
          </section>

          <section className="card p-6">
            <h2 className="text-sm font-semibold text-ink">
              Dados do denunciante
            </h2>
            <dl className="mt-2 divide-y divide-line">
              <Row label="Nome completo" value={report.full_name} />
              <Row label="CPF" value={formatCpf(report.cpf)} />
              <Row
                label="Data de nascimento"
                value={dateOnly.format(new Date(`${report.birth_date}T00:00:00Z`))}
              />
              <Row
                label="Conta vinculada"
                value={author?.email ?? "conta removida"}
              />
            </dl>
          </section>
        </div>

        <aside>
          <div className="card p-6">
            <h2 className="text-sm font-semibold text-ink">Tratativa</h2>
            <p className="mt-1 text-xs text-muted">
              Atualize o status e registre observações internas.
            </p>
            <ReportReview report={report} />
            <p className="mt-4 text-xs text-muted">
              Última atualização: {dateTime.format(new Date(report.updated_at))}
            </p>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
