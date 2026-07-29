"use client";

import { useActionState, useState } from "react";
import { createReport, type ReportFormState } from "@/lib/actions/reports";
import { SubmitButton } from "@/components/submit-button";
import { Alert } from "@/components/alert";
import { formatCpf } from "@/lib/cpf";

const initialState: ReportFormState = {};
const MAX_REASON = 5000;

export function ReportForm({ defaultFullName }: { defaultFullName: string }) {
  const [state, formAction] = useActionState(createReport, initialState);

  return (
    <form action={formAction} className="space-y-6">
      {state.error && <Alert tone="error">{state.error}</Alert>}
      {state.success && <Alert tone="success">{state.success}</Alert>}

      {/* A key troca a cada envio bem-sucedido, remontando e limpando os campos. */}
      <Fields
        key={state.token ?? "new"}
        defaultFullName={defaultFullName}
        fieldErrors={state.fieldErrors}
      />
    </form>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs font-medium text-red-600">{message}</p>;
}

function Fields({
  defaultFullName,
  fieldErrors,
}: {
  defaultFullName: string;
  fieldErrors?: Record<string, string>;
}) {
  const [cpf, setCpf] = useState("");
  const [reasonLength, setReasonLength] = useState(0);

  return (
    <>
      <fieldset className="space-y-5">
        <legend className="mb-4 text-xs font-semibold tracking-wide text-muted uppercase">
          Seus dados
        </legend>

        <div>
          <label htmlFor="fullName" className="field-label">
            Nome completo
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            defaultValue={defaultFullName}
            placeholder="Maria Souza"
            className="field-input"
          />
          <FieldError message={fieldErrors?.fullName} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="cpf" className="field-label">
              CPF
            </label>
            <input
              id="cpf"
              name="cpf"
              inputMode="numeric"
              required
              value={cpf}
              onChange={(event) => setCpf(formatCpf(event.target.value))}
              placeholder="000.000.000-00"
              className="field-input"
            />
            <FieldError message={fieldErrors?.cpf} />
          </div>

          <div>
            <label htmlFor="birthDate" className="field-label">
              Data de nascimento
            </label>
            <input
              id="birthDate"
              name="birthDate"
              type="date"
              required
              max={new Date().toISOString().slice(0, 10)}
              className="field-input"
            />
            <FieldError message={fieldErrors?.birthDate} />
          </div>
        </div>
      </fieldset>

      <hr className="border-line" />

      <fieldset className="space-y-5">
        <legend className="mb-4 text-xs font-semibold tracking-wide text-muted uppercase">
          Sobre a denúncia
        </legend>

        <div>
          <label htmlFor="accusedName" className="field-label">
            Nome da pessoa reclamada
          </label>
          <input
            id="accusedName"
            name="accusedName"
            type="text"
            required
            placeholder="Nome de quem você quer reclamar"
            className="field-input"
          />
          <FieldError message={fieldErrors?.accusedName} />
        </div>

        <div>
          <label htmlFor="reason" className="field-label">
            Motivo
          </label>
          <textarea
            id="reason"
            name="reason"
            required
            rows={8}
            maxLength={MAX_REASON}
            onChange={(event) => setReasonLength(event.target.value.length)}
            placeholder="Descreva o que aconteceu: datas, local, pessoas envolvidas e qualquer detalhe relevante."
            className="field-input resize-y"
          />
          <div className="mt-1.5 flex items-center justify-between">
            <p className="text-xs text-muted">
              Quanto mais detalhes, mais rápida é a apuração.
            </p>
            <span className="text-xs tabular-nums text-muted">
              {reasonLength}/{MAX_REASON}
            </span>
          </div>
          <FieldError message={fieldErrors?.reason} />
        </div>
      </fieldset>

      <div className="flex justify-end pt-2">
        <SubmitButton pendingLabel="Registrando...">
          Enviar denúncia
        </SubmitButton>
      </div>
    </>
  );
}
