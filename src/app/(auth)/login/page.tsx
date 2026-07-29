import type { Metadata } from "next";
import Link from "next/link";
import { Alert } from "@/components/alert";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Acesso restrito" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight text-ink">
        Acesso restrito
      </h2>
      <p className="mt-2 text-sm text-muted">
        Área destinada à equipe responsável pela apuração das denúncias.
      </p>

      {erro === "sem-permissao" && (
        <div className="mt-6">
          <Alert tone="error">
            Sua conta não tem permissão para acessar o painel.
          </Alert>
        </div>
      )}

      <LoginForm />

      <p className="mt-8 text-sm text-muted">
        Quer registrar uma denúncia?{" "}
        <Link
          href="/"
          className="font-semibold text-brand hover:text-brand-strong"
        >
          Ir para o formulário
        </Link>
      </p>
    </div>
  );
}
