"use client";

import { useActionState } from "react";
import { updateReport, type ReviewFormState } from "@/lib/actions/reports";
import { SubmitButton } from "@/components/submit-button";
import { Alert } from "@/components/alert";
import { STATUS_LABEL, STATUS_ORDER, type Report } from "@/lib/types";

const initialState: ReviewFormState = {};

export function ReportReview({ report }: { report: Report }) {
  const [state, formAction] = useActionState(updateReport, initialState);

  return (
    <form action={formAction} className="mt-5 space-y-4">
      <input type="hidden" name="id" value={report.id} />

      {state.error && <Alert tone="error">{state.error}</Alert>}
      {state.success && <Alert tone="success">{state.success}</Alert>}

      <div>
        <label htmlFor="status" className="field-label">
          Status
        </label>
        <select
          id="status"
          name="status"
          defaultValue={report.status}
          className="field-input"
        >
          {STATUS_ORDER.map((item) => (
            <option key={item} value={item}>
              {STATUS_LABEL[item]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="adminNotes" className="field-label">
          Observações internas
        </label>
        <textarea
          id="adminNotes"
          name="adminNotes"
          rows={6}
          defaultValue={report.admin_notes ?? ""}
          placeholder="Registre providências, contatos e decisões."
          className="field-input resize-y"
        />
        <p className="field-hint">Visível apenas para administradores.</p>
      </div>

      <SubmitButton pendingLabel="Salvando..." className="btn-primary w-full">
        Salvar alterações
      </SubmitButton>
    </form>
  );
}
