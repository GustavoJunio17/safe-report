"use client";

import { useActionState } from "react";
import { signUp, type AuthState } from "@/lib/actions/auth";
import { SubmitButton } from "@/components/submit-button";
import { Alert } from "@/components/alert";

const initialState: AuthState = {};

export function SignUpForm() {
  const [state, formAction] = useActionState(signUp, initialState);

  return (
    <form action={formAction} className="mt-8 space-y-5">
      {state.error && <Alert tone="error">{state.error}</Alert>}
      {state.success && <Alert tone="success">{state.success}</Alert>}

      <div>
        <label htmlFor="fullName" className="field-label">
          Nome completo
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          required
          placeholder="Maria Souza"
          className="field-input"
        />
      </div>

      <div>
        <label htmlFor="email" className="field-label">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="voce@empresa.com"
          className="field-input"
        />
      </div>

      <div>
        <label htmlFor="password" className="field-label">
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="Mínimo de 8 caracteres"
          className="field-input"
        />
        <p className="field-hint">Use ao menos 8 caracteres.</p>
      </div>

      <SubmitButton pendingLabel="Criando conta..." className="btn-primary w-full">
        Criar conta
      </SubmitButton>
    </form>
  );
}
