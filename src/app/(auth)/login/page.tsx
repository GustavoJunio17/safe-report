import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Entrar" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight text-ink">
        Acessar plataforma
      </h2>
      <p className="mt-2 text-sm text-muted">
        Entre com suas credenciais para registrar ou acompanhar denúncias.
      </p>

      <LoginForm redirectTo={redirect} />

      <p className="mt-8 text-sm text-muted">
        Ainda não tem conta?{" "}
        <Link
          href="/cadastro"
          className="font-semibold text-brand hover:text-brand-strong"
        >
          Criar conta
        </Link>
      </p>
    </div>
  );
}
