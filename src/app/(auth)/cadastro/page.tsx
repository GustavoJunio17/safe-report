import type { Metadata } from "next";
import Link from "next/link";
import { SignUpForm } from "./signup-form";

export const metadata: Metadata = { title: "Criar conta" };

export default function SignUpPage() {
  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight text-ink">
        Criar conta
      </h2>
      <p className="mt-2 text-sm text-muted">
        Sua conta permite registrar denúncias e acompanhar o andamento delas.
      </p>

      <SignUpForm />

      <p className="mt-8 text-sm text-muted">
        Já possui conta?{" "}
        <Link
          href="/login"
          className="font-semibold text-brand hover:text-brand-strong"
        >
          Entrar
        </Link>
      </p>
    </div>
  );
}
