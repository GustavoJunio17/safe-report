"use client";

import { useActionState, useState } from "react";
import { createReport, type ReportFormState } from "@/lib/actions/reports";
import { SubmitButton } from "@/components/submit-button";
import { Alert } from "@/components/alert";
import { formatCpf } from "@/lib/cpf";

const initialState: ReportFormState = {};
const MAX_REASON = 5000;

export function ReportForm() {
  const [state, formAction] = useActionState(createReport, initialState);

  if (state.protocol) {
    return <Receipt protocol={state.protocol} />;
  }

  return (
    <form action={formAction} className="space-y-6">
      {state.error && <Alert tone="error">{state.error}</Alert>}
      <Fields fieldErrors={state.fieldErrors} />
    </form>
  );
}

function Receipt({ protocol }: { protocol: string }) {
  return (
    <div className="text-center">
      <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
        <svg viewBox="0 0 24 24" fill="none" className="size-6">
          <path
            d="m5 12.5 4.5 4.5L19 7"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      <h3 className="mt-5 text-lg font-semibold tracking-tight text-ink">
        Denúncia registrada
      </h3>
      <p className="mt-2 text-sm text-muted">
        Guarde o número de protocolo abaixo. Ele identifica seu relato em
        eventuais contatos com a equipe responsável.
      </p>

      <p className="mt-6 inline-block rounded-lg border border-line bg-canvas px-5 py-3 font-mono text-lg tracking-widest text-ink">
        {protocol}
      </p>

      <div className="mt-8">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="btn-secondary"
        >
          Registrar outra denúncia
        </button>
      </div>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs font-medium text-red-600">{message}</p>;
}

function Fields({ fieldErrors }: { fieldErrors?: Record<string, string> }) {
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
